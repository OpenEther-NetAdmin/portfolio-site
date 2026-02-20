/**
 * Network Validation Utilities
 * Zod schemas for IP address and CIDR validation
 */
import { z } from 'zod';

/**
 * Validates an IPv4 address string (e.g., "192.168.1.1")
 * - Four octets separated by dots
 * - Each octet must be 0-255
 * - No leading zeros (except for "0" itself)
 */
export const IPv4Schema = z.string().refine(
  (value) => {
    // Check basic format: four groups separated by dots
    const parts = value.split('.');
    if (parts.length !== 4) return false;

    for (const part of parts) {
      // Empty part is invalid
      if (part.length === 0) return false;
      
      // Leading zeros are invalid (except for "0")
      if (part.length > 1 && part.startsWith('0')) return false;
      
      // Must be a valid number
      const num = Number(part);
      if (isNaN(num)) return false;
      
      // Must be in range 0-255
      if (num < 0 || num > 255) return false;
    }

    return true;
  },
  { message: 'Invalid IPv4 address. Must be 4 octets 0-255, no leading zeros (e.g., 192.168.1.1)' }
);

/**
 * Validates an IPv6 address string
 * Supports both full and compressed notation
 * 
 * Full: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
 * Compressed: 2001:db8:85a3::8a2e:370:7334
 * Loopback: ::1
 * Unspecified: ::
 */
export const IPv6Schema = z.string().refine(
  (value) => {
    // Empty string is invalid
    if (value.length === 0) return false;

    // Check for double colon (compression marker)
    const hasCompression = value.includes('::');
    
    // Only one :: allowed
    if (hasCompression && value.indexOf('::') !== value.lastIndexOf('::')) {
      return false;
    }

    // Split by colon
    const parts = value.split(':');
    
    // Handle special case of :: at the start or end
    if (value === '::') return true;
    
    // Handle :: at start (e.g., ::1)
    if (value.startsWith('::')) {
      const afterCompression = parts.slice(2).filter(p => p !== '');
      if (afterCompression.length > 7) return false;
      return afterCompression.every(isValidIPv6Segment);
    }
    
    // Handle :: at end (e.g., 2001::)
    if (value.endsWith('::')) {
      const beforeCompression = parts.slice(0, -2).filter(p => p !== '');
      if (beforeCompression.length > 7) return false;
      return beforeCompression.every(isValidIPv6Segment);
    }
    
    // Handle :: in middle
    if (hasCompression) {
      const nonEmptyParts = parts.filter(p => p !== '');
      // With compression, we can have fewer than 8 segments
      if (nonEmptyParts.length > 7) return false;
      return nonEmptyParts.every(isValidIPv6Segment);
    }
    
    // Full notation: must have exactly 8 segments
    if (parts.length !== 8) return false;
    return parts.every(isValidIPv6Segment);
  },
  { message: 'Invalid IPv6 address. Expected format: xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx' }
);

/**
 * Helper function to validate a single IPv6 segment
 * Each segment is 1-4 hex digits (0-ffff)
 */
function isValidIPv6Segment(segment: string): boolean {
  if (segment.length === 0 || segment.length > 4) return false;
  return /^[0-9a-fA-F]{1,4}$/.test(segment);
}

/**
 * Base CIDR schema - validates the numeric range
 * For IPv4: 0-32
 * For IPv6: 0-128
 */
export const CIDRSchema = z.number().int().min(0).max(128);

/**
 * IPv4-specific CIDR schema (0-32)
 */
export const IPv4CIDRSchema = z.number().int().min(0).max(32);

/**
 * IPv6-specific CIDR schema (0-128)
 */
export const IPv6CIDRSchema = z.number().int().min(0).max(128);

/**
 * Schema for subnet calculation form input
 * Combines IPv4 address and CIDR validation
 */
export const SubnetFormSchema = z.object({
  address: IPv4Schema,
  cidr: IPv4CIDRSchema,
});

/**
 * Schema for IPv6 subnet calculation form input
 */
export const IPv6SubnetFormSchema = z.object({
  address: IPv6Schema,
  cidr: IPv6CIDRSchema,
});

/**
 * Parse a CIDR notation string (e.g., "192.168.1.0/24")
 * Returns the address and CIDR number separately
 */
export function parseCIDRNotation(cidrString: string): { address: string; cidr: number } | null {
  const parts = cidrString.split('/');
  if (parts.length !== 2) return null;
  
  const [address, cidrStr] = parts;
  const cidr = parseInt(cidrStr, 10);
  
  if (isNaN(cidr)) return null;
  
  return { address, cidr };
}

/**
 * Schema for CIDR notation string input (e.g., "192.168.1.0/24")
 */
export const CIDRNotationSchema = z.string().refine(
  (value) => {
    const parsed = parseCIDRNotation(value);
    if (!parsed) return false;
    
    // Try to validate as IPv4 first
    const ipv4Result = IPv4Schema.safeParse(parsed.address);
    if (ipv4Result.success) {
      const cidrResult = IPv4CIDRSchema.safeParse(parsed.cidr);
      return cidrResult.success;
    }
    
    // Try IPv6
    const ipv6Result = IPv6Schema.safeParse(parsed.address);
    if (ipv6Result.success) {
      const cidrResult = IPv6CIDRSchema.safeParse(parsed.cidr);
      return cidrResult.success;
    }
    
    return false;
  },
  { message: 'Invalid CIDR notation. Expected format: IP/PREFIX (e.g., 192.168.1.0/24 or 2001:db8::/32)' }
);

/**
 * Validates an Autonomous System Number (ASN)
 * Supports both 2-byte (1-65535) and 4-byte (1-4294967295) ASNs
 */
export const ASNSchema = z.union([
  z.number().int().min(1).max(4294967295),
  z.string().refine(
    (value) => {
      // Support for ASDOT notation (e.g., "1.1000")
      if (value.includes('.')) {
        const parts = value.split('.');
        if (parts.length !== 2) return false;
        
        const [high, low] = parts.map(p => parseInt(p, 10));
        if (isNaN(high) || isNaN(low)) return false;
        
        // High part: 0-65535, Low part: 0-65535
        return high >= 0 && high <= 65535 && low >= 0 && low <= 65535;
      }
      
      // Plain number as string
      const num = parseInt(value, 10);
      if (isNaN(num)) return false;
      return num >= 1 && num <= 4294967295;
    },
    { message: 'Invalid ASN. Must be 1-4294967295 or in ASDOT format (e.g., 1.1000)' }
  )
]);

/**
 * Validates a BGP AS_PATH string
 * Format: space-separated ASNs (e.g., "100 200 300")
 */
export const ASPathSchema = z.string().refine(
  (value) => {
    if (value.trim().length === 0) return false;
    
    const asns = value.trim().split(/\s+/);
    return asns.every(asn => {
      const num = parseInt(asn, 10);
      return !isNaN(num) && num >= 1 && num <= 4294967295;
    });
  },
  { message: 'Invalid AS_PATH. Expected space-separated ASNs (e.g., "100 200 300")' }
);

/**
 * Type exports for form data
 */
export type SubnetFormData = z.infer<typeof SubnetFormSchema>;
export type IPv6SubnetFormData = z.infer<typeof IPv6SubnetFormSchema>;
export type ASNType = z.infer<typeof ASNSchema>;
