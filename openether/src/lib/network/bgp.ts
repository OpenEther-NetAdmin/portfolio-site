/**
 * BGP Looking Glass Engine
 * Pure TypeScript implementation for BGP AS_PATH parsing and analysis
 */
import type { ASPath, ASSegment } from './types';

/**
 * ASN Information (could be extended with external API)
 */
export interface ASNInfo {
  asn: number;
  name?: string;
  country?: string;
  type?: 'transit' | 'content' | 'enterprise' | 'access';
}

/**
 * BGP Path Analysis Result
 */
export interface BGPPathAnalysis {
  asPath: ASPath;
  asPathLength: number;
  uniqueASNs: number[];
  asnCount: number;
  segments: ASSegment[];
  pathString: string;
  isIPv4: boolean;
  originAS: number | null;
  neighborAS: number | null;
  prependingASNs: number[]; // ASNs that appear multiple times (AS path prepending)
  potentialIssues: string[];
}

/**
 * BGP Parser Class
 * Handles AS_PATH parsing and analysis
 */
export class BGPParser {
  /**
   * Parse AS_PATH string into structured format
   * Supports formats:
   * - Simple: "100 200 300"
   * - With segments: "100 200 {300 400} 500"
   * - ASDOT notation: "1.1000"
   */
  static parseASPath(asPathString: string): ASPath {
    const trimmed = asPathString.trim();
    if (!trimmed) {
      throw new Error('AS_PATH cannot be empty');
    }

    const segments: ASSegment[] = [];
    const allASNs: number[] = [];

    // Check for AS_SET notation (curly braces)
    const asSetRegex = /\{([^}]+)\}/g;
    let match;
    let lastIndex = 0;
    let remainingPath = trimmed;

    // Process AS_SETs first
    while ((match = asSetRegex.exec(trimmed)) !== null) {
      // Process AS_SEQUENCE before this AS_SET
      const beforeSet = trimmed.slice(lastIndex, match.index).trim();
      if (beforeSet) {
        const asns = this.parseASNList(beforeSet);
        if (asns.length > 0) {
          segments.push({
            type: 'AS_SEQUENCE',
            asns,
          });
          allASNs.push(...asns);
        }
      }

      // Process AS_SET
      const setASNs = this.parseASNList(match[1]);
      if (setASNs.length > 0) {
        segments.push({
          type: 'AS_SET',
          asns: setASNs,
        });
        allASNs.push(...setASNs);
      }

      lastIndex = match.index + match[0].length;
    }

    // Process remaining AS_SEQUENCE after last AS_SET
    const afterLastSet = trimmed.slice(lastIndex).trim();
    if (afterLastSet) {
      const asns = this.parseASNList(afterLastSet);
      if (asns.length > 0) {
        segments.push({
          type: 'AS_SEQUENCE',
          asns,
        });
        allASNs.push(...asns);
      }
    }

    // If no segments were created, treat entire path as AS_SEQUENCE
    if (segments.length === 0) {
      const asns = this.parseASNList(trimmed);
      if (asns.length > 0) {
        segments.push({
          type: 'AS_SEQUENCE',
          asns,
        });
        allASNs.push(...asns);
      }
    }

    return {
      segments,
      length: allASNs.length,
      asns: allASNs,
    };
  }

  /**
   * Parse a space-separated list of ASNs
   */
  static parseASNList(asnString: string): number[] {
    const parts = asnString.split(/\s+/).filter(p => p.length > 0);
    const asns: number[] = [];

    for (const part of parts) {
      try {
        const asn = this.parseASN(part);
        asns.push(asn);
      } catch {
        // Skip invalid ASNs
        console.warn(`Invalid ASN: ${part}`);
      }
    }

    return asns;
  }

  /**
   * Parse a single ASN (supports ASDOT notation)
   */
  static parseASN(asnString: string): number {
    const trimmed = asnString.trim();

    // ASDOT notation (e.g., "1.1000")
    if (trimmed.includes('.')) {
      const parts = trimmed.split('.');
      if (parts.length !== 2) {
        throw new Error(`Invalid ASDOT notation: ${asnString}`);
      }
      const high = parseInt(parts[0], 10);
      const low = parseInt(parts[1], 10);
      if (isNaN(high) || isNaN(low) || high < 0 || low < 0 || high > 65535 || low > 65535) {
        throw new Error(`Invalid ASDOT notation: ${asnString}`);
      }
      return high * 65536 + low;
    }

    // Plain number
    const asn = parseInt(trimmed, 10);
    if (isNaN(asn) || asn < 0 || asn > 4294967295) {
      throw new Error(`Invalid ASN: ${asnString}`);
    }
    return asn;
  }

  /**
   * Convert ASN to ASDOT notation
   */
  static toASDOT(asn: number): string {
    if (asn <= 65535) {
      return asn.toString();
    }
    const high = Math.floor(asn / 65536);
    const low = asn % 65536;
    return `${high}.${low}`;
  }

  /**
   * Analyze a BGP AS_PATH
   */
  static analyzeASPath(asPathString: string, isIPv4: boolean = true): BGPPathAnalysis {
    const asPath = this.parseASPath(asPathString);
    const uniqueASNs = [...new Set(asPath.asns)];
    const potentialIssues: string[] = [];
    const prependingASNs: number[] = [];

    // Detect AS path prepending (same ASN appears multiple times consecutively)
    const asnCounts = new Map<number, number>();
    for (const asn of asPath.asns) {
      asnCounts.set(asn, (asnCounts.get(asn) || 0) + 1);
    }
    for (const [asn, count] of asnCounts) {
      if (count > 1) {
        prependingASNs.push(asn);
        potentialIssues.push(`AS${asn} appears ${count} times (possible prepending)`);
      }
    }

    // Check for private ASNs
    for (const asn of asPath.asns) {
      if (this.isPrivateASN(asn)) {
        potentialIssues.push(`AS${asn} is a private ASN (64512-65534 or 4200000000-4294967294)`);
      }
    }

    // Get origin AS (last in path)
    const originAS = asPath.asns.length > 0 ? asPath.asns[asPath.asns.length - 1] : null;
    
    // Get neighbor AS (first in path)
    const neighborAS = asPath.asns.length > 0 ? asPath.asns[0] : null;

    // Check for unusually long AS paths
    if (asPath.asns.length > 50) {
      potentialIssues.push(`AS path is unusually long (${asPath.asns.length} ASNs)`);
    }

    return {
      asPath,
      asPathLength: asPath.length,
      uniqueASNs,
      asnCount: uniqueASNs.length,
      segments: asPath.segments,
      pathString: asPathString,
      isIPv4,
      originAS,
      neighborAS,
      prependingASNs,
      potentialIssues,
    };
  }

  /**
   * Check if ASN is in private range
   */
  static isPrivateASN(asn: number): boolean {
    // 16-bit private: 64512-65534
    if (asn >= 64512 && asn <= 65534) return true;
    // 32-bit private: 4200000000-4294967294
    if (asn >= 4200000000 && asn <= 4294967294) return true;
    return false;
  }

  /**
   * Check if ASN is well-known
   */
  static isWellKnownASN(asn: number): boolean {
    // Reserved ASNs
    const wellKnown = [0, 23456, 65535, 65536, 65551, 131072, 4294967295];
    return wellKnown.includes(asn);
  }

  /**
   * Get ASN type based on number
   */
  static getASNType(asn: number): '16-bit' | '32-bit' | 'private' | 'reserved' {
    if (asn >= 64512 && asn <= 65534) return 'private';
    if (asn >= 4200000000 && asn <= 4294967294) return 'private';
    if (asn === 0 || asn === 65535 || asn === 4294967295) return 'reserved';
    if (asn <= 65535) return '16-bit';
    return '32-bit';
  }

  /**
   * Format AS path for display
   */
  static formatASPath(asPath: ASPath): string {
    const parts: string[] = [];
    for (const segment of asPath.segments) {
      if (segment.type === 'AS_SET') {
        parts.push(`{ ${segment.asns.join(' ')} }`);
      } else {
        parts.push(segment.asns.join(' '));
      }
    }
    return parts.join(' ');
  }
}

export default BGPParser;
