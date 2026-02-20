# Test Plan: Network Utilities Suite

## 1. Testing Strategy
We will employ a three-tier testing strategy:
1. **Unit Tests (Vitest)**: Exhaustive testing of the math logic in `src/utils/network/`.
2. **Component Tests (Preact Testing Library)**: Testing individual UI components for correct rendering based on signal state.
3. **E2E Tests (Playwright)**: Testing the full user flow from input to host range visualization.

## 2. Critical Edge Cases
- **IPv4 Small Subnets**: /31 (P2P), /32 (Host).
- **IPv6 Small Subnets**: /127 (P2P), /128 (Host).
- **IPv6 Shorthand**: Ensuring `::1`, `2001:db8::/32` are parsed correctly.
- **Large Subnets**: Ensuring memory performance for `/8` or large IPv6 prefix views (using virtualization if needed).
- **Invalid Inputs**: Malformed IPs, out-of-range CIDRs.

## 3. Quality Metrics
- **Unit Test Coverage**: 100% for `src/utils/network/`.
- **Lighthouse Score**: >95 for Performance and Accessibility.
- **Response Time**: UI updates in <16ms (60fps).

## 4. Automation
Tests should be integrated into the CI/CD pipeline (e.g., GitHub Actions) to run on every PR.
