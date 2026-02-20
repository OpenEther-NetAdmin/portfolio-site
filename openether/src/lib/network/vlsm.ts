/**
 * VLSM Allocator Engine
 * Pure TypeScript implementation for Variable Length Subnet Mask allocation
 */
import type { VLSMSubnetRequest, VLSMAllocation } from './types';
import { IPv4Calculator } from './ipv4';

/**
 * VLSM Allocation Result
 */
export interface VLSMAllocationResult {
  allocations: VLSMAllocation[];
  totalUsed: number;
  totalAvailable: number;
  utilizationPercent: number;
  warnings: string[];
  baseNetwork: string;
  baseCIDR: number;
}

/**
 * VLSM Allocator Class
 * Implements efficient VLSM allocation algorithm
 */
export class VLSMAllocator {
  /**
   * Allocate subnets from a base network using VLSM
   * Sorts subnets by size (largest first) for efficient allocation
   */
  static allocate(
    baseNetwork: string,
    baseCIDR: number,
    requests: VLSMSubnetRequest[]
  ): VLSMAllocationResult {
    const warnings: string[] = [];
    const allocations: VLSMAllocation[] = [];

    // Validate base network
    const baseInfo = IPv4Calculator.calculate(baseNetwork, baseCIDR);
    const totalAvailable = baseInfo.usableHosts;

    // Sort requests by required hosts (descending) for efficient allocation
    const sortedRequests = [...requests].sort((a, b) => 
      b.requiredHosts - a.requiredHosts
    );

    // Track current position in the address space
    let currentAddress = IPv4Calculator.ipToInt(baseInfo.networkAddress);
    const maxAddress = IPv4Calculator.ipToInt(baseInfo.broadcastAddress);

    for (const request of sortedRequests) {
      // Calculate required CIDR for this subnet
      const requiredCIDR = this.calculateRequiredCIDR(request.requiredHosts);

      // Check if we have space
      const subnetSize = Math.pow(2, 32 - requiredCIDR);
      const subnetEnd = currentAddress + subnetSize - 1;

      if (subnetEnd > maxAddress) {
        warnings.push(
          `Not enough space for "${request.name}" (needs ${request.requiredHosts} hosts)`
        );
        continue;
      }

      // Align to subnet boundary
      const alignedAddress = this.alignToSubnetBoundary(currentAddress, requiredCIDR);
      
      // Check if alignment pushes us past the end
      const alignedEnd = alignedAddress + subnetSize - 1;
      if (alignedEnd > maxAddress) {
        warnings.push(
          `Not enough space for "${request.name}" after alignment`
        );
        continue;
      }

      // Create allocation
      const networkAddress = IPv4Calculator.intToIp(alignedAddress);
      const allocation = this.createAllocation(
        request.name,
        networkAddress,
        requiredCIDR
      );

      allocations.push(allocation);

      // Move to next position
      currentAddress = alignedAddress + subnetSize;
    }

    // Calculate utilization
    const totalUsed = allocations.reduce((sum, a) => sum + a.usableHosts, 0);
    const utilizationPercent = totalAvailable > 0 
      ? Math.round((totalUsed / totalAvailable) * 100) 
      : 0;

    // Sort allocations by network address for display
    allocations.sort((a, b) => {
      const aInt = IPv4Calculator.ipToInt(a.networkAddress);
      const bInt = IPv4Calculator.ipToInt(b.networkAddress);
      return aInt - bInt;
    });

    return {
      allocations,
      totalUsed,
      totalAvailable,
      utilizationPercent,
      warnings,
      baseNetwork: baseInfo.networkAddress,
      baseCIDR,
    };
  }

  /**
   * Calculate the minimum CIDR prefix needed for a given number of hosts
   */
  static calculateRequiredCIDR(requiredHosts: number): number {
    if (requiredHosts < 1) return 32;
    if (requiredHosts === 1) return 32;
    if (requiredHosts === 2) return 31;

    // Add 2 for network and broadcast addresses
    const totalNeeded = requiredHosts + 2;
    
    // Find the smallest power of 2 that fits
    const bits = Math.ceil(Math.log2(totalNeeded));
    return 32 - bits;
  }

  /**
   * Align an address to a subnet boundary
   */
  static alignToSubnetBoundary(address: number, cidr: number): number {
    if (cidr === 0) return 0;
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return (address & mask) >>> 0;
  }

  /**
   * Create a VLSM allocation object
   */
  static createAllocation(
    name: string,
    networkAddress: string,
    cidr: number
  ): VLSMAllocation {
    const info = IPv4Calculator.calculate(networkAddress, cidr);

    return {
      name,
      networkAddress: info.networkAddress,
      cidr: info.cidr,
      firstHost: info.firstUsableHost,
      lastHost: info.lastUsableHost,
      broadcastAddress: info.broadcastAddress,
      usableHosts: info.usableHosts,
    };
  }

  /**
   * Validate VLSM requests
   */
  static validateRequests(
    requests: VLSMSubnetRequest[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (requests.length === 0) {
      errors.push('At least one subnet request is required');
    }

    const names = new Set<string>();
    for (const request of requests) {
      if (!request.name || request.name.trim() === '') {
        errors.push('All subnets must have a name');
      }
      if (names.has(request.name)) {
        errors.push(`Duplicate subnet name: "${request.name}"`);
      }
      names.add(request.name);

      if (request.requiredHosts < 1) {
        errors.push(`"${request.name}": Required hosts must be at least 1`);
      }
      if (request.requiredHosts > Math.pow(2, 30) - 2) {
        errors.push(`"${request.name}": Required hosts exceeds maximum`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate total hosts needed for all requests
   */
  static calculateTotalNeeded(requests: VLSMSubnetRequest[]): number {
    return requests.reduce((sum, r) => {
      const cidr = this.calculateRequiredCIDR(r.requiredHosts);
      const subnetSize = Math.pow(2, 32 - cidr);
      return sum + subnetSize;
    }, 0);
  }

  /**
   * Check if requests fit in base network
   */
  static canFitInNetwork(
    baseNetwork: string,
    baseCIDR: number,
    requests: VLSMSubnetRequest[]
  ): boolean {
    const baseInfo = IPv4Calculator.calculate(baseNetwork, baseCIDR);
    const totalAvailable = Math.pow(2, 32 - baseCIDR);
    const totalNeeded = this.calculateTotalNeeded(requests);

    return totalNeeded <= totalAvailable;
  }

  /**
   * Get suggested base CIDR for given requests
   */
  static suggestBaseCIDR(requests: VLSMSubnetRequest[]): number {
    const totalNeeded = this.calculateTotalNeeded(requests);
    const bits = Math.ceil(Math.log2(totalNeeded));
    return Math.max(8, 32 - bits); // Minimum /8 for private networks
  }
}

export default VLSMAllocator;
