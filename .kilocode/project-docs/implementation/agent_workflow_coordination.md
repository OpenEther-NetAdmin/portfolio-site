# Multi-Agent Workflow Coordination: Network Utilities

## 1. Agent Roles & Responsibilities

### Lead Developer (LD)
- **Focus**: Core logic implementation, component architecture, and integration.
- **Tasks**:
  - Setup Preact integration in `astro.config.mjs`.
  - Implement `IPv4` and `IPv6` utility classes in `src/utils/network/`.
  - Create the Subnet Calculator UI components in `src/components/tools/subnet/`.
  - Ensure 100% type safety with TypeScript.

### QA Reviewer (QA)
- **Focus**: Correctness, performance, and edge cases.
- **Tasks**:
  - Review calculation logic for network boundary errors.
  - Test UI responsiveness on mobile devices (via browser tools).
  - Verify accessibility (ARIA labels, keyboard traps).
  - Perform performance audits on reactive state updates.

### Technical Writer (TW)
- **Focus**: Clarity, documentation, and user education.
- **Tasks**:
  - Write JSDoc for all public utility functions.
  - Create a `README.md` for the `/tools` directory.
  - Generate a "Network Engineering Guide" (technical blog post or tool-tips) explaining CIDR and VLSM.

## 2. Handoff Protocol
1. **LD** completes logic -> **QA** reviews logic.
2. **LD** completes UI -> **QA** reviews UI.
3. **QA** approves -> **TW** documents features.
4. **Final Review** by Architect (Kilo Code) before merging.

## 3. Communication Channel
All agents will use the `.kilocode/transcripts/` and `.kilocode/handoffs/` directories to pass state and decisions between sessions.
