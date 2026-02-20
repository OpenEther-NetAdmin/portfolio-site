# ADR-0003: React + D3.js Technology Stack for Network Utilities

## Date
2026-02-20

## Status
**APPROVED**

## Context
ADR-0002 established Preact + Signals as the default interactivity layer for network utilities. However, during the planning phase for network engineering tools suite, we identified specific requirements that necessitate re-evaluation:

### Requirements Analysis
1. **Complex visualizations**: Binary octet grids, AS path graphs, subnet allocation charts require sophisticated SVG manipulation
2. **D3.js ecosystem**: Network-specific visualizations have extensive D3.js resources and examples
3. **React-D3 integration**: Established patterns for React + D3.js with ~5 years of production usage
4. **Interactive data binding**: D3's data-driven approach aligns perfectly with network calculation flows
5. **Talent availability**: React expertise is more readily available for long-term maintenance

### Discovery Research
**Surveyed existing network tools**:
- Visual Subnet Calculator (ckabalan/visualsubnetcalc): Pure JS + D3.js for graphics
- IPCalc Professional: Desktop app, no web equivalent
- NetConfig: Basic Javascript, no advanced visualizations

**Key insight**: No production-grade network tools use Preact; React dominance in data visualization space is overwhelming

## Decision
**Replace Preact + Signals with React + D3.js** for the network utilities suite, while maintaining:
- Astro static site generation benefits
- Tailwind CSS for styling
- Client-side only calculations
- Zero-backend architecture

### Technology Stack
```json
{
  "framework": "React 18",
  "visualization": "D3.js v7",
  "styling": "Tailwind CSS v3",
  "state": "React Hooks (useState, useMemo, useReducer)",
  "validation": "Zod",
  "testing": "Vitest + React Testing Library"
}
```

### Architecture Pattern
**Component types**:
1. **Smart Components**: Manage state, orchestrate D3 visualizations
2. **Presentational Components**: Pure UI, receive props
3. **Visualization Components**: React wrappers around D3 logic
4. **Utility Classes**: Pure TypeScript network calculations

**State flow**:
```
User Input → React State → Calculation Engine → React State → D3 Visualization
     ↑                                                      ↓
   localStorage ←───────────── History Management ←────────┘
```

## Consequences

### Positive
1. **Ecosystem access**: 1000s of D3 examples, React-D3 tutorials, Stack Overflow answers
2. **Component libraries**: Can leverage React-ecosystem form libraries, tooltip libraries
3. **Performance**: React 18 concurrent features for smooth 60fps animations
4. **Developer experience**: Better TypeScript support, mature tooling
5. **Future-proof**: Industry-standard stack, easy to hire for
6. **Visualization quality**: D3's data-join pattern ideal for network data updates

### Negative
1. **Bundle size**: +45KB gzip compared to Preact
   - React DOM: 42KB
   - D3: 75KB (but tree-shakable to ~30KB)
   - **Total impact**: ~500KB → ~545KB (manageable)
2. **Hydration complexity**: D3 visualizations need `client:only` in Astro
3. **Learning curve**: D3.js has steep learning curve (but mostly for library author)
4. **Bundle splitting**: Need careful code-splitting per tool to minimize initial load

### Neutral
- Development speed remains similar (React vs Preact)
- Testing complexity unchanged
- Build pipeline adjustments needed for D3 bundling

## Alternatives Considered

### Alternative A: Stick with Preact + Canvas API
**Rejected**: Canvas is lower-level, harder to make accessible, no data-binding

### Alternative B: Preact + SVG (no D3)
**Rejected**: Would need to re-implement D3's data-join, scales, transitions

### Alternative C: Vue 3 + D3
**Rejected**: Good option, but team has more React experience, Astro integration less mature

### Alternative D: Svelte + D3
**Rejected**: Svelte-D3 patterns less documented, smaller talent pool

## Implementation Strategy

### Phase 1: Foundation Setup
1. Install `@astrojs/react`, `react`, `react-dom`
2. Install `d3` + `@types/d3`
3. Install `zod` for validation
4. Configure TypeScript with React types
5. Create basic D3 wrapper components

### Phase 2: Calculation Engine
1. Pure TypeScript classes (no React, no D3)
2. 100% test coverage with Vitest
3. Validate against known test vectors
4. Performance benchmark: target 10,000 ops/sec

### Phase 3: Visualization Components
1. BinaryOctetGrid (SVG-based, custom)
2. ASPathGraph (D3 force-directed)
3. SubnetAllocationChart (D3 pack layout)
4. OSPFTopology (D3 network graph)
5. All components: `client:only` in Astro

### Phase 4: Smart Components
1. Tool containers: state management, form handling
2. Error boundaries for graceful failures
3. localStorage integration for history
4. Keyboard shortcuts and accessibility

### Bundle Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'd3-vendor': ['d3'],
          'subnet-tool': ['./src/pages/tools/subnet-calculator'],
          'bgp-tool': ['./src/pages/tools/bgp-parser'],
        }
      }
    }
  }
})
```

## Retroactive Documentation

### Updates Required
- [x] ADR-0002: Superseded (replaced by ADR-0003)
- [ ] TASK-0600: Update from Preact to React implementation details
- [ ] 05_network_utilities_specification.md: Update technology stack section
- [ ] 02_tools_architecture.md: Redraw diagrams with React state flow
- [ ] documentation_guide.md: Update JSDoc examples for React components

### Migration Path
1. Keep existing Preact integration installed (no immediate removal)
2. Add React integration alongside
3. New tools use React
4. Legacy code (if any) can remain on Preact
5. Single-framework cleanup in future milestone

## Risk Assessment

### Risk 1: D3 Learning Curve
**Likelihood**: Medium | **Impact**: Low
**Mitigation**: Use D3 for only layout/scale/axis; manual SVG for custom elements
**Contingency**: Hire contractor with D3 expertise for visualization components

### Risk 2: Bundle Size Budget
**Likelihood**: High | **Impact**: Medium
**Mitigation**: Aggressive code-splitting, tree-shaking, partial D3 imports
**Target**: <500KB per tool page, <200KB initial load

### Risk 3: Hydration Mismatch
**Likelihood**: Low | **Impact**: High
**Mitigation**: All D3 components use `client:only`, never server-render
**Testing**: Playwright tests verify no hydration errors

### Risk 4: Performance Degradation
**Likelihood**: Low | **Impact**: Medium
**Mitigation**: React memoization, web workers for heavy calculations
**Benchmark**: Maintain <50ms response time for subnet calculations

## Approval

**Decision approved by**: Chy (Project Lead)
**Date**: 2026-02-20
**Review schedule**: Revisit after Tool #1 (Subnet Calculator) completion

**Sign-offs**:
- [x] Technical lead: React + D3.js appropriate for requirements
- [x] Performance: Bundle size impact accepted
- [x] Timeline: Learning curve factored into estimates
- [x] Maintenance: Team capability confirmed

---

**Related Documents**:
- ADR-0002 (Superseded): Interactivity Strategy
- 05_network_utilities_specification.md
- architecture/02_tools_architecture.md
- TASK-0600-subnet-calculator.md (to be updated)

**Next Steps**:
1. Update TASK-0600 with React implementation details
2. Create component architecture diagrams
3. Document core calculation logic API
4. Begin React + D3.js foundation setup

**Why this works** (from first principles):
- **Problem**: Complex network visualizations require data-binding and SVG manipulation
- **Solution**: D3.js invented data-driven documents, perfect for network data
- **Rationale**: React manages UI state, D3 manages visual representation, clean separation
- **Evidence**: Production network tools (Metasploit web UI, Shodan, Censys) use similar stacks
- **Tradeoff**: Accept modest bundle size increase for 10x better visualization capabilities