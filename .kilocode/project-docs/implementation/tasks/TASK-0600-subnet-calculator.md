# TASK-0600: Implement Subnet Calculator

## Description
Build a state-of-the-art Subnet Calculator supporting IPv4/v6, CIDR/VLSM, and binary visualization.

## Acceptance Criteria
- [ ] User can input IPv4 or IPv6 addresses with CIDR notation.
- [ ] Real-time calculation of Network Address, Broadcast Address, Subnet Mask, and Usable Host Range.
- [ ] Binary representation toggle for all addresses.
- [ ] Responsive UI using Tailwind CSS grid/flexbox.
- [ ] Interactive "Usable Host Range" visualization (progress bar or list).
- [ ] Error handling for invalid IP formats or masks.

## Dependencies
- ADR-0002: Interactivity Strategy (Preact + Signals)
- Modular Architecture Design

## Technical Details
- Framework: Preact (via Astro integration)
- State: `@preact/signals`
- Utils: `src/utils/network/ipv4.ts`, `src/utils/network/ipv6.ts`
- Directory: `src/pages/tools/subnet-calculator.astro`

## Workflow Assignment
- **Lead Developer**: Implement core TS logic and Preact components.
- **QA Reviewer**: Validate CIDR edge cases (/31, /127) and IPv6 shorthand parsing.
- **Technical Writer**: Document bitmask logic and user-facing guide.
