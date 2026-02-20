# ADR-0002: Interactivity Strategy for Network Utilities

## Context
The network engineering utilities suite requires high-performance, real-time reactive UI. Changes in input (IP, Mask) must instantaneously update multiple derived views (Binary, Network info, Host ranges). The existing project uses Astro with Tailwind CSS.

## Decision
We will use **Preact** as the UI framework integration for interactive tools, combined with **@preact/signals** for state management.

## Rationale
1. **Performance**: Preact is extremely lightweight (3KB) and its virtual DOM is highly optimized for the complex form updates required by a calculator.
2. **Reactivity**: Signals provide a much more performant and cleaner way to handle reactive state compared to standard React `useState`, especially when many components depend on the same shared state (Network context).
3. **TypeScript Integration**: Excellent support for strongly typed signals ensures the calculator logic remains bug-free.
4. **Islands Architecture**: Astro allows us to hydrate only the specific calculator component (`client:load`), keeping the rest of the portfolio static.

## Alternatives Considered
- **Pure TypeScript**: Rejected due to high overhead in manually updating the DOM and managing complex reactive state across multiple views (Binary vs Dec).
- **Alpine.js**: Rejected because it's harder to unit test complex logic (like IPv6 bitmask operations) and lacks the deep TypeScript integration found in Preact/React.
- **Full React**: Rejected as Preact provides the same API with significantly less bundle overhead for this specific use case.

## Consequences
- **Gain**: Sub-millisecond UI updates, cleaner code through signal-based derived values (e.g., automatically calculating the broadcast address when the network address changes).
- **Loss**: Requires adding `@astrojs/preact` and `@preact/signals` to the dependency list.

## Why This Works
By using Signals, we can decouple the calculation logic from the UI components. The logic can live in plain TS files that update signals, and the UI components will automatically re-render only the specific bits of the DOM that changed.
