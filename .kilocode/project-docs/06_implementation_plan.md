# OpenEther Network Utilities Suite - Implementation Plan

**Document Version**: 1.0  
**Last Updated**: 2026-02-20  
**Architecture Reference**: ADR-0003 (React 18 + D3.js v7 + TypeScript)  
**Approval Status**: Awaiting Review

---

## 📋 Executive Summary

This implementation plan translates the approved architecture (ADR-0003) into an actionable roadmap for building the OpenEther Network Utilities Suite. The plan spans five phases from foundation setup through production-ready tools, with rigorous quality gates ensuring performance, accessibility, and code quality standards.

**Total Estimated Duration**: 6-8 weeks  
**Team Size**: 1-2 developers  
**Risk Level**: Medium (primarily technical complexity in D3.js visualizations)

---

## 🎯 Phase 0: Foundation Setup

**Duration**: 3-4 days  
**Priority**: Critical Path  
**Dependencies**: None

### 0.1 Dependency Installation

**Deliverables**:
- Install D3.js v7 and TypeScript types: `npm install d3 @types/d3`
- Install validation library: `npm install zod`
- Install input masking: `npm install react-imask`
- Install testing libraries: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- Install D3 testing utilities: `npm install -D @testing-library/user-event`

**Acceptance Criteria**:
- All packages install without peer dependency conflicts
- Bundle size analysis shows <200KB base size (before code splitting)
- TypeScript compilation succeeds with strict mode

**Risk Mitigation**: 
- Pin exact versions to prevent breaking changes
- Use `bundle-phobia-analyzer` to verify bundle size impact

### 0.2 Directory Structure Creation

**Deliverables**:
```bash
openether/src/
├── pages/tools/                  # Tool pages (Astro)
├── components/tools/             # React components
│   ├── common/                   # Shared components
│   │   ├── inputs/               # Input field components
│   │   ├── display/              # Result display components
│   │   └── visualizations/       # D3 visualization wrappers
│   ├── subnet/                   # Subnet-specific components
│   ├── bgp/                      # BGP-specific components
│   ├── vlsm/                     # VLSM-specific components
│   └── ospf/                     # OSPF-specific components
├── lib/network/                  # Calculation engines (pure TS)
│   ├── types.ts                  # Shared interfaces
│   ├── validators.ts             # Input validation
│   ├── ipv4.ts                   # IPv4 engine
│   ├── ipv6.ts                   # IPv6 engine
│   ├── bgp.ts                    # BGP engine
│   ├── vlsm.ts                   # VLSM engine
│   └── ospf.ts                   # OSPF engine
├── hooks/                        # Custom React hooks
│   ├── useFormState.ts
│   ├── useCalculationResults.ts
│   ├── useCalculationHistory.ts
│   └── useD3Visualization.ts
└── utils/                        # Helper functions
    ├── binary.ts
    ├── formatters.ts
    └── ip-utils.ts
```

**Acceptance Criteria**:
- All directories created with `.gitkeep` files
- README.md files in each major directory explaining purpose
- Path aliases configured in `tsconfig.json` for clean imports

**Time Estimate**: 4 hours

### 0.3 Shared Type Definitions

**Deliverables** (in `src/lib/network/types.ts`):
```typescript
// Network address types
export interface IPAddress {
  version: 4 | 6;
  address: string;
  binary?: string;
}

// Subnet calculation results
export interface SubnetCalculation {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  cidr: number;
  usableHosts: number;
  firstUsable: string;
  lastUsable: string;
  binaryVisualization: BinaryOctet[];
}

// BGP path parsing
export interface BGPPath {
  asPath: number[];
  rawPath: string;
  origin: string;
  nextHop?: string;
}

// VLSM allocation
export interface SubnetRequest {
  name: string;
  hosts: number;
  cidr?: number; // Optional exact CIDR
}

export interface AllocatedSubnet {
  name: string;
  network: string;
  cidr: number;
  hosts: number;
  usable: number;
}

// OSPF calculations
export interface OSPFInterface {
  bandwidth: number; // Mbps
  interfaceType: 'ethernet' | 'serial' | 'tunnel';
  cost?: number;
}

// Generic calculation result wrapper
export interface CalculationResult<T> {
  data: T | null;
  error: string | null;
  timestamp: number;
  executionTime: number; // ms
}
```

**Acceptance Criteria**:
- 100% type coverage with strict TypeScript
- All types documented with JSDoc comments
- No `any` types used
- Types exported for use in tests

**Time Estimate**: 6 hours

### 0.4 Base Configuration Updates

**Deliverables**:
- Update `astro.config.mjs` to enable React with code splitting
- Configure code splitting in `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          d3: ['d3'],
          react: ['react', 'react-dom'],
        }
      }
    }
  }
})
```
- Add bundle size budget to `package.json`:
```json
{
  "bundlesize": [
    {
      "path": "./dist/tools/*.js",
      "maxSize": "500kb"
    }
  ]
}
```

**Acceptance Criteria**:
- Each tool page bundle <500KB in production build
- React and D3.js vendors split into separate chunks
- Build passes bundlesize checks

**Time Estimate**: 3 hours

**Phase 0 Total Time**: 13 hours (2 days)

---

## 🏗️ Phase 1: Shared Infrastructure

**Duration**: 5-6 days  
**Priority**: Critical Path  
**Dependencies**: Phase 0 Complete

### 1.1 Custom Hooks Implementation

#### 1.1.1 useFormState Hook
**Location**: `src/hooks/useFormState.ts`

**Purpose**: Manage form state with validation and error handling

**Implementation Details**:
```typescript
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
}

function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validators: Partial<Record<keyof T, (value: any) => string | undefined>>
)
```

**Acceptance Criteria**:
- Handles complex nested forms
- Validates on blur and submit
- Supports async validation for IP availability checks (future)
- 100% unit test coverage

**Time Estimate**: 4 hours

#### 1.1.2 useCalculationResults Hook
**Location**: `src/hooks/useCalculationResults.ts`

**Purpose**: Manage calculation state with caching and performance tracking

**Implementation Details**:
```typescript
interface UseCalculationResults<T> {
  result: CalculationResult<T> | null;
  isCalculating: boolean;
  calculate: (input: any) => Promise<void>;
  clear: () => void;
}
```

**Acceptance Criteria**:
- Debounces rapid calculations (<50ms latency requirement)
- Measures execution time for performance monitoring
- Handles calculation errors gracefully
- 100% unit test coverage

**Time Estimate**: 3 hours

#### 1.1.3 useCalculationHistory Hook
**Location**: `src/hooks/useCalculationHistory.ts`

**Purpose**: Persist calculation history to localStorage

**Implementation Details**:
```typescript
interface UseCalculationHistory<T> {
  history: Array<{
    id: string;
    input: any;
    result: CalculationResult<T>;
    timestamp: number;
  }>;
  add: (input: any, result: CalculationResult<T>) => void;
  remove: (id: string) => void;
  clear: () => void;
  export: () => string; // JSON export
}
```

**Acceptance Criteria**:
- Persists to localStorage with error handling (private mode)
- Validates data on load (schema versioning)
- Limits history to 100 items (configurable)
- 100% unit test coverage

**Time Estimate**: 4 hours

#### 1.1.4 useD3Visualization Hook
**Location**: `src/hooks/useD3Visualization.ts`

**Purpose**: Initialize and update D3 visualizations in React components

**Implementation Details**:
```typescript
function useD3Visualization<T>(
  containerRef: RefObject<HTMLElement>,
  data: T,
  renderFn: (container: HTMLElement, data: T) => void,
  updateFn?: (container: HTMLElement, data: T) => void
)
```

**Acceptance Criteria**:
- Handles container resize with ResizeObserver
- Cleans up D3 selections on unmount
- Supports enter-update-exit pattern
- Prevents memory leaks
- 100% unit test coverage with JSDOM

**Time Estimate**: 6 hours

### 1.2 Validation Utilities

**Location**: `src/lib/network/validators.ts`

**Deliverables**:
```typescript
// IP validation
function validateIPv4(address: string): boolean
function validateIPv6(address: string): boolean
function validateCIDR(cidr: number, version: 4 | 6): boolean

// CIDR parsing
function parseCIDR(cidrString: string): { address: string; cidr: number }

// BGP validation
function validateASPath(path: string): boolean
function validateASN(asn: string | number): boolean

// Schema validation using Zod
const subnetSchema = z.object({
  address: z.string().refine(validateIPv4, { message: 'Invalid IPv4' }),
  cidr: z.number().min(1).max(30)
})
```

**Acceptance Criteria**:
- All validators return detailed error messages
- Handles edge cases (private IPs, loopback, etc.)
- 100% unit test coverage including edge cases
- Benchmarked performance (<1ms per validation)

**Time Estimate**: 5 hours

### 1.3 Shared Input Components

**Location**: `src/components/tools/common/inputs/`

#### 1.3.1 IPInput Component
**Purpose**: Reusable IP address input field with validation

**Features**:
- Real-time validation with visual feedback
- Support for IPv4 and IPv6
- Copy/paste handling
- Keyboard navigation
- Accessible labels and error messages

**Acceptance Criteria**:
- WCAG 2.1 AA compliant (ARIA labels, keyboard navigation)
- Visual feedback for valid/invalid states
- 100% unit test coverage
- Performance tested (<16ms re-render)

**Time Estimate**: 6 hours

#### 1.3.2 CIDRInput Component
**Purpose**: CIDR notation input with slider and text field

**Features**:
- Dual input modes: slider and text
- Real-time subnet mask display
- Min/max constraints based on IP version
- Visual subnet size indicator

**Acceptance Criteria**:
- Slider and text field stay synchronized
- Accessible to screen readers
- Handles edge cases (/31, /32, etc.)
- 100% unit test coverage

**Time Estimate**: 4 hours

#### 1.3.3 ASNInput Component
**Purpose**: Autonomous System Number input

**Features**:
- Support for 4-byte ASNs (RFC 6793)
- ASN range validation (1-4294967295)
- Common ASN names/organizations (optional lookup)

**Acceptance Criteria**:
- Validates 4-byte ASN format
- Displays ASN in ASDOT format when appropriate
- 100% unit test coverage

**Time Estimate**: 3 hours

### 1.4 Shared Display Components

**Location**: `src/components/tools/common/display/`

#### 1.4.1 ResultCard Component
**Purpose**: Display calculation results in consistent format

**Features**:
- Expandable sections
- Copy-to-clipboard functionality
- Loading states
- Error display
- Print-friendly styling

**Acceptance Criteria**:
- Responsive design (mobile to desktop)
- WCAG 2.1 AA compliant color contrast
- 100% unit test coverage
- Print styles tested

**Time Estimate**: 4 hours

#### 1.4.2 BinaryOctetDisplay Component
**Purpose**: Display 8-bit binary visualization

**Features**:
- Network/host bit coloring (customizable)
- Hover effects for bit identification
- Copy binary string
- Accessible text alternative

**Acceptance Criteria**:
- Color-blind friendly palette
- Screen reader announces bit positions
- 100% unit test coverage
- Performance: renders 1000+ bits at 60fps

**Time Estimate**: 5 hours

#### 1.4.3 InfoPanel Component
**Purpose**: Show contextual help and explanations

**Features**:
- Collapsible sections
- Rich text support
- Code snippet examples
- Links to RFCs and documentation

**Acceptance Criteria**:
- Animations complete in <200ms
- Keyboard accessible
- 100% unit test coverage

**Time Estimate**: 3 hours

### 1.5 D3 Visualization Base Classes

**Location**: `src/components/tools/common/visualizations/`

#### 1.5.1 BaseVisualization Class
**Purpose**: Abstract base class for D3 visualizations

**Implementation Details**:
```typescript
abstract class BaseVisualization<T> {
  protected svg: Selection<SVGSVGElement, unknown, null, undefined>;
  protected data: T;
  protected margin: { top: number; right: number; bottom: number; left: number };
  
  constructor(container: HTMLElement, data: T) {
    this.data = data;
    this.initializeSVG(container);
    this.render();
  }
  
  protected abstract render(): void;
  protected abstract update(newData: T): void;
  protected abstract destroy(): void;
}
```

**Acceptance Criteria**:
- Handles responsive resizing
- Properly cleans up event listeners
- Extensible for all tool visualizations
- 100% unit test coverage

**Time Estimate**: 6 hours

#### 1.5.2 BinaryGrid Visualization
**Purpose**: Display binary representation of IP addresses

**Features**:
- 32-bit (IPv4) and 128-bit (IPv6) grid modes
- Network/host bit coloring
- Hover interactions
- Zoom/pan for large IPv6 addresses

**Acceptance Criteria**:
- Renders 128-bit IPv6 without performance issues
- Smooth 60fps animations
- Accessible via keyboard navigation
- 100% unit test coverage

**Time Estimate**: 8 hours

**Phase 1 Total Time**: 54 hours (7 days)

---

## 🔧 Phase 2: Subnet Calculator MVP

**Duration**: 8-10 days  
**Priority**: Critical Path  
**Dependencies**: Phase 1 Complete

### 2.1 IPv4 Calculation Engine

**Location**: `src/lib/network/ipv4.ts`

**Deliverables**:
```typescript
class IPv4Calculator {
  static calculateSubnet(address: string, cidr: number): SubnetCalculation
  static calculateSubnetMask(cidr: number): string
  static calculateBroadcast(network: string, cidr: number): string
  static getUsableHosts(cidr: number): number
  static isValidHost(address: string, network: string, cidr: number): boolean
}
```

**Edge Cases to Handle**:
- /31 and /32 point-to-point links (RFC 3021)
- Default route (0.0.0.0/0)
- Host bits validation
- Invalid CIDR ranges

**Acceptance Criteria**:
- 100% unit test coverage (including all edge cases)
- <10ms calculation time for single subnet
- Correct handling of all CIDR ranges (0-32)
- Proper error messages for invalid inputs
- Benchmarked performance with 1000+ calculations

**Time Estimate**: 10 hours (includes testing)

### 2.2 IPv6 Calculation Engine

**Location**: `src/lib/network/ipv6.ts`

**Deliverables**:
```typescript
class IPv6Calculator {
  static calculateSubnet(address: string, cidr: number): SubnetCalculation
  static compressAddress(address: string): string
  static expandAddress(address: string): string
  static calculateEUI64(macAddress: string): string
}
```

**Edge Cases to Handle**:
- /127 and /128 (RFC 6164)
- Address compression/expansion
- IPv6 transition mechanisms (6to4, Teredo)
- Multiple valid representations

**Acceptance Criteria**:
- 100% unit test coverage (including IPv6-specific cases)
- <20ms calculation time (IPv6 more complex)
- Correct handling of all CIDR ranges (0-128)
- Proper IPv6 address normalization
- Benchmarked with 1000+ calculations

**Time Estimate**: 12 hours (includes testing)

### 2.3 Binary Visualization Component

**Location**: `src/components/tools/subnet/BinaryVisualization.tsx`

**Implementation**:
- Uses BinaryGrid D3 visualization
- Shows network vs host bits with color coding
- Interactive hover effects
- IPv4: 32-bit grid (4 rows × 8 columns)
- IPv6: 128-bit grid (8 rows × 16 columns, scrollable)

**Design Requirements**:
- Network bits: Blue (`#3B82F6`)
- Host bits: Green (`#10B981`)
- Subnet boundary: Clear visual separator
- Tooltip on hover showing bit position and value

**Acceptance Criteria**:
- Renders IPv6 without performance degradation
- 60fps animations on hover
- Color-blind friendly (patterns + colors)
- Screen reader accessible (table structure + ARIA)
- 100% unit test coverage (test with JSDOM + D3 mocks)

**Time Estimate**: 8 hours

### 2.4 Input Form Components

**Location**: `src/components/tools/subnet/SubnetCalculatorForm.tsx`

**Deliverables**:
- IP address input field (uses IPInput component)
- CIDR input (uses CIDRInput component)
- Calculate button with loading state
- Clear/reset functionality
- Keyboard shortcuts (Ctrl+Enter to calculate)

**Features**:
- Real-time validation
- Error message display
- Example placeholder: `192.168.1.0/24`

**Acceptance Criteria**:
- All inputs accessible via keyboard
- Screen reader announces validation errors
- Form submission prevents default and triggers calculation
- 100% unit test coverage (including keyboard interactions)
- Visual regression tested (desktop, tablet, mobile)

**Time Estimate**: 6 hours

### 2.5 Results Display Components

**Location**: `src/components/tools/subnet/SubnetResults.tsx`

**Deliverables**:
- Summary card: Network address, broadcast, subnet mask
- Details card: First/last usable, total hosts
- Binary visualization section
- Actions: Copy results, share URL, save to history

**Data Display**:
- Network: `192.168.1.0`
- Broadcast: `192.168.1.255`
- Subnet mask: `255.255.255.0`
- Usable hosts: `254`
- First usable: `192.168.1.1`
- Last usable: `192.168.1.254`

**Acceptance Criteria**:
- All data displayed with clear labels
- Copy buttons for each field
- Share URL encodes input parameters
- WCAG 2.1 AA compliant contrast ratios
- 100% unit test coverage
- Print styles hide interactive elements

**Time Estimate**: 8 hours

### 2.6 Tool Page Integration

**Location**: `src/pages/tools/subnet-calculator.astro`

**Implementation**:
```astro
---
import Layout from '../../layouts/Layout.astro'
import SubnetCalculator from '../../components/tools/subnet/SubnetCalculator.tsx'
---

<Layout title="Subnet Calculator | OpenEther Network Utilities">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2">Subnet Calculator</h1>
    <p class="text-gray-600 mb-8">
      Calculate IPv4 and IPv6 subnet information with interactive binary visualization.
    </p>
    
    <SubnetCalculator client:load />
    
    <div class="mt-12">
      <h2 class="text-xl font-semibold mb-4">How to Use</h2>
      <!-- Help documentation -->
    </div>
  </div>
</Layout>
```

**Features**:
- SEO meta tags (dynamic based on query params)
- Open Graph tags for social sharing
- Help documentation section
- Links to related tools
- Breadcrumb navigation

**Acceptance Criteria**:
- Page loads with query parameters pre-populated
- React component hydrates without errors
- SEO meta tags present in HTML source
- Lighthouse score >95 (Performance, Accessibility, Best Practices)
- 100% E2E test coverage (Playwright)

**Time Estimate**: 6 hours

### 2.7 IPv6 Support Integration

**Location**: `src/components/tools/subnet/SubnetCalculator.tsx`

**Implementation**:
- Auto-detect IPv4 vs IPv6 based on input format
- Use appropriate calculation engine (IPv4Calculator vs IPv6Calculator)
- Adjust binary visualization (32-bit vs 128-bit)
- Update result cards to handle IPv6 addresses

**Acceptance Criteria**:
- Seamless switching between IPv4 and IPv6
- IPv6 addresses truncated appropriately in UI (show full on hover)
- Performance remains <50ms for IPv6 calculations
- All unit and E2E tests cover both IPv4 and IPv6

**Time Estimate**: 4 hours

**Phase 2 Total Time**: 54 hours (7 days)

---

## 📊 Phase 3: BGP Path Parser

**Duration**: 6-7 days  
**Priority**: High  
**Dependencies**: Phase 1 Complete

### 3.1 BGP Parsing Engine

**Location**: `src/lib/network/bgp.ts`

**Deliverables**:
```typescript
class BGPCalculator {
  static parseASPath(path: string): BGPPath
  static validateASPath(path: string): boolean
  static parseASDOT(asdot: string): number
  static formatASDOT(asn: number): string
  static analyzePath(asPath: number[]): {
    pathLength: number;
    privateASNs: number[];
    transitProviders: number[];
  }
}
```

**AS-PATH Formats to Support**:
- Cisco: `102 2048 4123`
- Juniper: `102 2048 4123`
- Arista: `102 2048 4123`
- AS Sets: `102 2048 {4123,4124} 5000`
- AS Confederation

**Acceptance Criteria**:
- 100% unit test coverage
- Parses AS-PATHs from major vendors
- Handles 4-byte ASNs (RFC 6793)
- Extracts private ASNs (64512-65534, 4200000000-4294967294)
- Performance: <10ms per parse

**Time Estimate**: 8 hours (includes testing)

### 3.2 ASN Graph Visualization

**Location**: `src/components/tools/bgp/ASPathGraph.tsx`

**Implementation**:
- D3 force-directed graph showing AS path
- Nodes: ASNs with size based on importance
- Edges: Path relationships
- Interactive: hover, click, drag

**Features**:
- Color coding by ASN type (tier-1, tier-2, private)
- Tooltip with ASN information
- Zoom and pan controls
- Export as SVG/PNG

**Acceptance Criteria**:
- Handles paths with 20+ ASNs without performance issues
- 60fps animations during node interactions
- Accessible: keyboard navigation, ARIA labels
- Color-blind friendly palette
- 100% unit test coverage (mock D3)

**Time Estimate**: 12 hours

### 3.3 BGP Tool Page

**Location**: `src/pages/tools/bgp-parser.astro`

**Features**:
- Text area input for AS-PATH
- Parse button with error handling
- Results: path summary, ASN list, transit analysis
- Graph visualization
- ASN lookup (optional external API)

**Acceptance Criteria**:
- Input accepts multiple AS-PATH formats
- Clear error messages for malformed paths
- Visual graph updates smoothly
- Lighthouse score >95
- E2E tests cover parsing and visualization

**Time Estimate**: 10 hours

**Phase 3 Total Time**: 30 hours (4 days)

---

## 🎯 Phase 4: VLSM Allocator

**Duration**: 7-8 days  
**Priority**: High  
**Dependencies**: Phase 1 Complete

### 4.1 VLSM Allocation Algorithm

**Location**: `src/lib/network/vlsm.ts`

**Deliverables**:
```typescript
class VLSMCalculator {
  static allocateSubnets(
    baseNetwork: string,
    subnetRequests: SubnetRequest[]
  ): AllocatedSubnet[]
  
  static calculateRequiredCIDR(hosts: number): number
  static validateNoOverlap(subnets: AllocatedSubnet[]): boolean
}
```

**Algorithm Requirements**:
1. Sort subnet requests by host count (largest first)
2. Calculate required CIDR for each subnet
3. Allocate from base network sequentially
4. Validate no overlaps
5. Maximize address space efficiency

**Edge Cases**:
- Not enough space in base network
- Overlapping CIDR requests
- Exact CIDR vs host count dual mode

**Acceptance Criteria**:
- 100% unit test coverage including edge cases
- Optimizes for minimum wasted space
- Validates all allocations before returning
- Performance: <50ms for 20 subnets
- Benchmarked with complex allocations

**Time Estimate**: 12 hours (includes testing)

### 4.2 VLSM Input Components

**Location**: `src/components/tools/vlsm/`

**Deliverables**:
- Network base input (IP + CIDR)
- Dynamic subnet request list (add/remove)
- Per-subnet: name, host count, optional CIDR
- Real-time validation

**Features**:
- Drag-and-drop reordering
- Bulk import (text area)
- Auto-suggest subnet names based on patterns

**Acceptance Criteria**:
- Intuitive UI for adding/removing subnets
- Real-time validation with clear errors
- Accessible: keyboard navigation, screen reader support
- Mobile responsive
- 100% unit test coverage

**Time Estimate**: 10 hours

### 4.3 Allocation Results Visualization

**Location**: `src/components/tools/vlsm/VLSMResults.tsx`

**Implementation**:
- Tree view showing subnet hierarchy
- Address space visualization (horizontal bar)
- Subnet details: network, CIDR, hosts, range
- Copy subnets in CIDR notation

**Acceptance Criteria**:
- Visual representation of address space allocation
- Color-coded for subnet types
- Responsive design
- Print-friendly
- 100% unit test coverage

**Time Estimate**: 10 hours

### 4.4 VLSM Tool Page

**Location**: `src/pages/tools/vlsm-allocator.astro`

**Features**:
- Input section with base network
- Dynamic subnet request list
- Allocate button with validation
- Results visualization
- Export allocations (CSV, JSON)

**Acceptance Criteria**:
- Handles 25+ subnet requests
- Clear error messages for invalid allocations
- Smooth transitions when results update
- Lighthouse score >95
- E2E tests cover full workflow

**Time Estimate**: 8 hours

**Phase 4 Total Time**: 40 hours (5 days)

---

## 🌐 Phase 5: OSPF Cost Calculator

**Duration**: 6-7 days  
**Priority**: Medium  
**Dependencies**: Phase 1 Complete

### 5.1 OSPF Cost Calculation Engine

**Location**: `src/lib/network/ospf.ts`

**Deliverables**:
```typescript
class OSPFCalculator {
  static calculateInterfaceCost(bandwidth: number): number
  static calculatePathCost(interfaces: OSPFInterface[]): number
  static buildShortestPathTree(
    nodes: string[],
    links: Array<{ from: string; to: string; cost: number }>
  ): ShortestPathTree
  static getOSPFNeighbors(
    interfaceConfig: OSPFInterface
  ): { cost: number; hello: number; dead: number }
}
```

**Reference Bandwidth**: 100 Mbps (OSPF default)

**Cost Calculation**:
- Cost = Reference bandwidth / Interface bandwidth
- Minimum cost: 1
- Common values: FastEthernet=1, Ethernet=10, T1=64

**Acceptance Criteria**:
- 100% unit test coverage
- Supports custom reference bandwidth
- Correctly calculates costs for common interface types
- <5ms per calculation

**Time Estimate**: 6 hours (includes testing)

### 5.2 Network Topology Visualization

**Location**: `src/components/tools/ospf/OSPFTopologyGraph.tsx`

**Implementation**:
- D3 force-directed graph
- Nodes: routers/interfaces
- Edges: links with cost labels
- Shortest path highlighting

**Features**:
- Click node to view details
- Hover edge to highlight
- Toggle shortest path tree view
- Interface bandwidth editing

**Acceptance Criteria**:
- Interactive topology editing
- Real-time cost updates
- Shortest path visualization
- 60fps interactions
- Accessibility support
- 100% unit test coverage

**Time Estimate**: 12 hours

### 5.3 OSPF Tool Page

**Location**: `src/pages/tools/ospf-calculator.astro`

**Features**:
- Interface configuration inputs
- Network topology builder
- Cost calculations
- Shortest path tree visualization
- OSPF timer calculations (hello, dead)

**Acceptance Criteria**:
- Multiple interface configuration methods
- Visual topology builder
- Real-time cost calculations
- Lighthouse score >95
- E2E tests cover key workflows

**Time Estimate**: 10 hours

**Phase 5 Total Time**: 28 hours (3.5 days)

---

## 🚦 Quality Gates

### Phase-Level Quality Requirements

#### Gate 0: Foundation Setup
- **Bundle Size**: <200KB base size
- **TypeScript**: Strict mode, zero compilation errors
- **Build**: Production build completes without warnings
- **Dependencies**: No security vulnerabilities (npm audit)

#### Gate 1: Shared Infrastructure
- **Unit Test Coverage**: 100% for all utilities and hooks
- **Performance**: All hooks <16ms re-render time
- **Accessibility**: WCAG 2.1 AA compliance via axe-core
- **Bundle Size**: Each imported utility <5KB

#### Gate 2: Subnet Calculator MVP
- **Unit Test Coverage**: 100% for calculation engines
- **Performance**: Calculations <50ms, animations 60fps
- **E2E Tests**: Critical paths covered (Playwright)
- **Lighthouse Score**: >95 (Performance, Accessibility, Best Practices)
- **Bundle Size**: <500KB for subnet calculator page
- **Cross-browser**: Chrome, Firefox, Safari, Edge (latest 2 versions)

#### Gate 3-5: Additional Tools
- **Unit Test Coverage**: 100% for calculation engines
- **Integration Tests**: Tool-specific critical paths
- **E2E Tests**: Complete user workflows
- **Performance**: <100ms calculation latency
- **Lighthouse Score**: >90 for each tool page

### Testing Strategy

#### Unit Tests (Vitest)
- Location: `__tests__/unit/`
- Run: `npm test:unit`
- Coverage threshold: 100% for calculation engines, >80% overall
- Mock D3.js for visualization tests

#### Integration Tests (Vitest + React Testing Library)
- Location: `__tests__/integration/`
- Run: `npm test:integration`
- Test component interactions
- Test calculation flow end-to-end

#### E2E Tests (Playwright)
- Location: `__tests__/e2e/`
- Run: `npm test:e2e`
- Test complete user workflows
- Cross-browser testing
- Mobile viewport testing

#### Performance Tests
- Location: `__tests__/performance/`
- Run: `npm test:perf`
- Benchmark calculation engines
- Measure component re-render times
- Track bundle size regression

#### Accessibility Tests
- Tool: axe-core + Playwright
- Run: `npm test:a11y`
- WCAG 2.1 AA compliance
- Automated checks for all pages

### Code Review Checkpoints

**Before Phase 1**:
- Review type definitions for completeness
- Review directory structure for maintainability
- Approve dependency choices

**Before Phase 2**:
- Review custom hooks implementation
- Review validation utilities
- Approve shared components API

**After Phase 2 (MVP)**:
- Full code review of Subnet Calculator
- Performance audit
- Accessibility audit
- Security review (input validation, XSS prevention)

**Before Production**:
- Complete codebase review
- Final performance benchmarking
- Final accessibility testing
- Security scan (npm audit, code scanning)

---

## 📈 Risk Assessment & Mitigation

### Technical Risks

#### Risk 1: D3.js Performance Issues
**Likelihood**: Medium  
**Impact**: High  
**Mitigation**:
- Use D3 data-join pattern correctly
- Throttle updates for real-time interactions
- Implement virtualization for large datasets
- Test performance early and often

**Contingency**: Replace with canvas-based rendering if SVG performance inadequate

#### Risk 2: Bundle Size Exceeds Budget
**Likelihood**: Medium  
**Impact**: Medium  
**Mitigation**:
- Code splitting by tool
- Import D3 modules individually
- Lazy load non-critical components
- Monitor bundlesize in CI

**Contingency**: Remove lower-priority tools from MVP (defer to Phase 2)

#### Risk 3: Hydration Mismatch in Astro
**Likelihood**: Low  
**Impact**: High  
**Mitigation**:
- Use `client:only` for all D3 components
- Ensure server/client rendering consistency
- Test hydration thoroughly

**Contingency**: Move to pure client-side rendering if issues persist

### Schedule Risks

#### Risk 4: D3.js Learning Curve
**Likelihood**: High  
**Impact**: Medium  
**Mitigation**:
- Build simple visualizations first (BinaryGrid)
- Use D3 examples as reference
- Allocate extra time for Phase 1

**Contingency**: Simplify visualizations or use pre-built components

#### Risk 5: Scope Creep (Additional Tools)
**Likelihood**: Medium  
**Impact**: Medium  
**Mitigation**:
- Strictly prioritize tools (MVP first)
- Defer non-critical features to Phase 2
- Require approval for scope changes

**Contingency**: Drop OSPF calculator from Phase 1 if behind schedule

### Quality Risks

#### Risk 6: Accessibility Compliance
**Likelihood**: Medium  
**Impact**: High  
**Mitigation**:
- Design with accessibility from start
- Use axe-core throughout development
- Test with screen readers early
- Follow WCAG guidelines religiously

**Contingency**: Engage accessibility consultant if needed

#### Risk 7: Cross-Browser Compatibility
**Likelihood**: Low  
**Impact**: Medium  
**Mitigation**:
- Test in Chrome, Firefox, Safari, Edge regularly
- Use autoprefixer for CSS
- Avoid experimental web features
- Use Playwright for cross-browser E2E testing

**Contingency**: Define supported browser matrix and document limitations

---

## 📅 Implementation Timeline

### Week 1: Foundation
- **Day 1-2**: Phase 0 (Foundation Setup)
- **Day 3-5**: Phase 1 (Shared Infrastructure - Hooks)

### Week 2: Shared Infrastructure Continued
- **Day 6-7**: Phase 1 (Shared Infrastructure - Components)
- **Day 8-9**: Phase 1 (Shared Infrastructure - D3 Base)
- **Day 10**: Buffer / Code Review

### Week 3: Subnet Calculator MVP
- **Day 11-12**: Phase 2 (IPv4 Engine + Tests)
- **Day 13-14**: Phase 2 (IPv6 Engine + Tests)
- **Day 15**: Buffer / Code Review

### Week 4: Subnet Calculator UI
- **Day 16-17**: Phase 2 (Binary Visualization + Input Components)
- **Day 18-19**: Phase 2 (Results Display + Page Integration)
- **Day 20**: Buffer / Testing

### Week 5: BGP Parser
- **Day 21-22**: Phase 3 (BGP Engine + Tests)
- **Day 23-24**: Phase 3 (Visualization + Tool Page)
- **Day 25**: Buffer / Testing

### Week 6: VLSM Allocator
- **Day 26-27**: Phase 4 (VLSM Algorithm + Tests)
- **Day 28-29**: Phase 4 (Input Components + Results)
- **Day 30**: Phase 4 (Tool Page Integration)

### Week 7: VLSM Testing & OSPF
- **Day 31-32**: Phase 4 (Testing + Bug Fixes)
- **Day 33-34**: Phase 5 (OSPF Engine + Tests)
- **Day 35**: Buffer / Code Review

### Week 8: OSPF & Polish
- **Day 36-37**: Phase 5 (Visualization + Tool Page)
- **Day 38-39**: Final Testing, Performance Audit, Accessibility Audit
- **Day 40**: Documentation, Deployment Preparation

**Buffer Days**: 7 days built in for risks and iterations

---

## 📝 Acceptance Criteria Summary

### Overall Project Acceptance
- [ ] All five phases completed
- [ ] All quality gates passed
- [ ] 100% unit test coverage for calculation engines
- [ ] E2E tests for all critical user flows
- [ ] Lighthouse score >90 for all tool pages
- [ ] Bundle size <500KB per tool page
- [ ] WCAG 2.1 AA compliance verified
- [ ] Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
- [ ] Performance benchmarks met (<50ms calculations, 60fps animations)
- [ ] Code review completed for all phases
- [ ] Documentation complete and up-to-date
- [ ] Deployment pipeline configured and tested

### Tool-Specific Acceptance
- [ ] **Subnet Calculator**: IPv4/IPv6 support, binary visualization, all edge cases handled
- [ ] **BGP Path Parser**: Parses multiple formats, ASN graph visualization, 4-byte ASN support
- [ ] **VLSM Allocator**: Dual-mode operation, overlap prevention, optimal allocation
- [ ] **OSPF Cost Calculator**: Interface cost calculations, shortest-path tree, timer calculations

---

## 🔗 Architecture References

- [ADR-0003: React + D3.js Technology Stack](./01_architecture_decisions/ADR-0003-react-d3js-technology-stack.md)
- [Network Utilities Architecture](./02_tools_architecture.md)
- [Project Specification](./05_network_utilities_specification.md)

---

## 📚 Next Steps

1. **Review and Approve**: This implementation plan requires approval before work begins
2. **Setup Development Environment**: Ensure all dependencies and tools installed
3. **Create Feature Branches**: Use branch naming convention: `feature/TOOL-001-subnet-calculator`
4. **Daily Standups**: Review progress, blockers, and plan next steps
5. **Weekly Demos**: Demonstrate completed work to stakeholders

---

**Document Prepared By**: Senior Application Architect  
**Date**: 2026-02-20  
**Status**: Ready for Review and Approval

---

## 🔄 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-20 | Initial implementation plan | Architect |

---

**Awaiting Approval**: ⏳ Yes - Please review and provide approval to proceed with implementation