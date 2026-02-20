# TASK-0103: Design and Implement OpenEther Logo

**Phase**: 1 - Foundation  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 2 hours

---

## Description

Create the OpenEther logo as an SVG component and favicon.

---

## Acceptance Criteria

- [ ] Logo SVG component created (network node design)
- [ ] Logo displayed in header
- [ ] Favicon created and configured
- [ ] Logo scales properly at different sizes

---

## Steps

### 1.1 Create Logo SVG Component
File: `src/components/icons/Logo.astro`

```astro
---
// OpenEther Logo - Network Node Design
---

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 48 48" 
  class="w-8 h-8 text-primary"
  fill="none"
>
  <!-- Outer ring -->
  <circle 
    cx="24" 
    cy="24" 
    r="18" 
    stroke="currentColor" 
    stroke-width="2"
  />
  
  <!-- Inner circle -->
  <circle 
    cx="24" 
    cy="24" 
    r="8" 
    fill="currentColor"
  />
  
  <!-- Top line -->
  <line 
    x1="24" y1="6" 
    x2="24" y2="14" 
    stroke="currentColor" 
    stroke-width="2"
  />
  
  <!-- Bottom line -->
  <line 
    x1="24" y1="34" 
    x2="24" y2="42" 
    stroke="currentColor" 
    stroke-width="2"
  />
  
  <!-- Left line -->
  <line 
    x1="6" y1="24" 
    x2="14" y2="24" 
    stroke="currentColor" 
    stroke-width="2"
  />
  
  <!-- Right line -->
  <line 
    x1="34" y1="24" 
    x2="42" y2="24" 
    stroke="currentColor" 
    stroke-width="2"
  />
  
  <!-- Diagonal dots (optional) -->
  <circle cx="12" cy="12" r="2" fill="currentColor" />
  <circle cx="36" cy="12" r="2" fill="currentColor" />
  <circle cx="12" cy="36" r="2" fill="currentColor" />
  <circle cx="36" cy="36" r="2" fill="currentColor" />
</svg>
```

### 1.2 Create Favicon
File: `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#0f172a"/>
  <circle cx="16" cy="16" r="8" fill="#06b6d4"/>
  <circle cx="16" cy="16" r="3" fill="#0f172a"/>
</svg>
```

### 1.3 Update Layout for Favicon
In `src/layouts/Layout.astro` head:

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### 1.4 Test Logo Usage
Update header to use the logo:

```astro
import Logo from '../icons/Logo.astro';
```

---

## Dependencies

- TASK-0102: Base components created

---

## Notes

- Logo uses `currentColor` for easy theming
- Cyan accent color defined in Tailwind config
- Can be customized later if needed
