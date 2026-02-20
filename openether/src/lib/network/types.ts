// Core IP types
export interface IPv4Address {
  octets: [number, number, number, number];
  cidr: number;
  stringValue: string;
  binaryString: string;
  intValue: number;
}

export interface IPv6Address {
  segments: string[]; // 8 segments of 4 hex chars each
  cidr: number;
  stringValue: string;
  compressedString: string;
  binaryString: string;
  bigIntValue: bigint;
}

// Subnet calculation result
export interface IPv4NetworkResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'Private' | 'Loopback';
  isPrivate: boolean;
  isLoopback: boolean;
  binaryRepresentation: BinaryRepresentation;
}

export interface BinaryRepresentation {
  network: string;
  host: string;
  full: string;
  octets: string[];
}

// BGP types
export interface ASPath {
  segments: ASSegment[];
  length: number;
  asns: number[];
}

export interface ASSegment {
  type: 'AS_SET' | 'AS_SEQUENCE';
  asns: number[];
}

// VLSM types
export interface VLSMSubnetRequest {
  name: string;
  requiredHosts: number;
}

export interface VLSMAllocation {
  name: string;
  networkAddress: string;
  cidr: number;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
  usableHosts: number;
}

// OSPF types
export interface OSPFLink {
  source: string;
  target: string;
  bandwidth: number; // in Kbps
  cost: number;
}

export interface OSPFNode {
  id: string;
  type: 'router' | 'network';
  name: string;
}

// Form state types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// History entry
export interface HistoryEntry<T> {
  id: string;
  timestamp: number;
  input: T;
  result: T;
}
