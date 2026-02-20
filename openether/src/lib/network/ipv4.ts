/**
 * IPv4 Subnet Calculator Engine
 * Pure TypeScript implementation with zero dependencies
 */
import type { IPv4NetworkResult, BinaryRepresentation } from './types';

/**
 * IPv4 Calculator Class
 * Provides all subnet calculations for IPv4 networks
 */
export class IPv4Calculator {
  /**
   * Calculate all subnet information from IP address and CIDR
   */
  static calculate(ipAddress: string, cidr: number): IPv4NetworkResult {
    // Parse IP to 32-bit integer
    const ipInt = this.ipToInt(ipAddress);
    
    // Calculate subnet mask (network bits set to 1)
    const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    
    // Calculate network and broadcast addresses
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    
    // Calculate host ranges
    const firstUsable = cidr >= 31 ? network : network + 1;
    const lastUsable = cidr >= 31 ? broadcast : broadcast - 1;
    
    // Calculate usable hosts
    let usableHosts: number;
    if (cidr === 32) {
      usableHosts = 1;
    } else if (cidr === 31) {
      usableHosts = 2;
    } else {
      usableHosts = Math.pow(2, 32 - cidr) - 2;
    }
    
    // Total hosts in subnet
    const totalHosts = Math.pow(2, 32 - cidr);
    
    // Determine IP class and special properties
    const ipClass = this.getIPClass(ipInt);
    const isPrivate = this.isPrivateIP(ipInt);
    const isLoopback = this.isLoopbackIP(ipInt);
    
    // Generate binary representation
    const binaryRepresentation = this.toBinaryRepresentation(network, cidr);
    
    return {
      networkAddress: this.intToIp(network),
      broadcastAddress: this.intToIp(broadcast),
      subnetMask: this.intToIp(mask),
      wildcardMask: this.intToIp(~mask >>> 0),
      firstUsableHost: this.intToIp(firstUsable),
      lastUsableHost: this.intToIp(lastUsable),
      totalHosts,
      usableHosts,
      cidr,
      ipClass,
      isPrivate,
      isLoopback,
      binaryRepresentation,
    };
  }

  /**
   * Convert IP address string to 32-bit integer
   */
  static ipToInt(ip: string): number {
    const octets = ip.split('.').map(octet => parseInt(octet, 10));
    if (octets.length !== 4 || octets.some(isNaN)) {
      throw new Error(`Invalid IP address: ${ip}`);
    }
    return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  }

  /**
   * Convert 32-bit integer to IP address string
   */
  static intToIp(int: number): string {
    return [
      (int >>> 24) & 0xFF,
      (int >>> 16) & 0xFF,
      (int >>> 8) & 0xFF,
      int & 0xFF,
    ].join('.');
  }

  /**
   * Convert IP to binary string representation
   */
  static toBinaryString(ip: string): string {
    const int = this.ipToInt(ip);
    return int.toString(2).padStart(32, '0');
  }

  /**
   * Get binary representation with network/host bit separation
   */
  static toBinaryRepresentation(networkInt: number, cidr: number): BinaryRepresentation {
    const full = networkInt.toString(2).padStart(32, '0');
    const network = full.substring(0, cidr);
    const host = full.substring(cidr);
    
    // Split into octets
    const octets: string[] = [];
    for (let i = 0; i < 32; i += 8) {
      octets.push(full.substring(i, i + 8));
    }
    
    return {
      network,
      host,
      full,
      octets,
    };
  }

  /**
   * Determine IP address class (A, B, C, D, E)
   */
  static getIPClass(ipInt: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'Private' | 'Loopback' {
    const firstOctet = (ipInt >>> 24) & 0xFF;
    
    // Check loopback first (127.x.x.x)
    if (firstOctet === 127) {
      return 'Loopback';
    }
    
    // Check private ranges
    if (this.isPrivateIP(ipInt)) {
      return 'Private';
    }
    
    // Standard classes
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D';
    return 'E';
  }

  /**
   * Check if IP is in private range
   */
  static isPrivateIP(ipInt: number): boolean {
    const firstOctet = (ipInt >>> 24) & 0xFF;
    const secondOctet = (ipInt >>> 16) & 0xFF;
    
    // 10.0.0.0/8
    if (firstOctet === 10) return true;
    
    // 172.16.0.0/12
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true;
    
    // 192.168.0.0/16
    if (firstOctet === 192 && secondOctet === 168) return true;
    
    return false;
  }

  /**
   * Check if IP is loopback (127.x.x.x)
   */
  static isLoopbackIP(ipInt: number): boolean {
    const firstOctet = (ipInt >>> 24) & 0xFF;
    return firstOctet === 127;
  }

  /**
   * Get all subnets when dividing a network
   */
  static getSubnets(networkAddress: string, cidr: number, newCidr: number): string[] {
    if (newCidr <= cidr) {
      throw new Error('New CIDR must be larger than current CIDR');
    }
    
    const networkInt = this.ipToInt(networkAddress);
    const subnetCount = Math.pow(2, newCidr - cidr);
    const subnetSize = Math.pow(2, 32 - newCidr);
    
    const subnets: string[] = [];
    for (let i = 0; i < subnetCount; i++) {
      const subnetInt = networkInt + (i * subnetSize);
      subnets.push(this.intToIp(subnetInt));
    }
    
    return subnets;
  }

  /**
   * Check if an IP is within a given network
   */
  static isIPInNetwork(ip: string, network: string, cidr: number): boolean {
    const ipInt = this.ipToInt(ip);
    const networkInt = this.ipToInt(network);
    const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    
    return (ipInt & mask) === (networkInt & mask);
  }

  /**
   * Get the CIDR from a subnet mask
   */
  static maskToCIDR(mask: string): number {
    const maskInt = this.ipToInt(mask);
    // Count the number of 1 bits
    let count = 0;
    let temp = maskInt;
    while (temp) {
      count += temp & 1;
      temp = temp >>> 1;
    }
    return count;
  }

  /**
   * Get subnet mask from CIDR
   */
  static cidrToMask(cidr: number): string {
    if (cidr === 0) return '0.0.0.0';
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return this.intToIp(mask);
  }
}

export default IPv4Calculator;
