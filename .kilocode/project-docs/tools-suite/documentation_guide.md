# Documentation Guide: Network Utilities Suite

## 1. JSDoc Standards
All utility functions in `src/utils/network/` must include JSDoc comments:
- `@param`: Description and expected type.
- `@returns`: Description of the returned object/value.
- `@example`: Clear code example for both IPv4 and IPv6.

## 2. Component READMEs
Each major tool (e.g., Subnet Calculator) should have a `README.md` in its directory:
- **Purpose**: What the component does.
- **Props**: API for the component.
- **State Flow**: How it interacts with signals.

## 3. User-Facing Guide
A technical guide should be created for the `/tools` landing page:
- **How to use**: Step-by-step instructions.
- **Technical Deep Dive**: Brief explanation of the math behind CIDR and bitwise operations used in the app.
- **Troubleshooting**: Common pitfalls in subnetting.

## 4. Maintenance Guide
- Instructions on how to add a new tool to the `/tools` registry.
- How to extend the `NetworkState` signals for new utilities.
