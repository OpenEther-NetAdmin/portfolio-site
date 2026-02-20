# TASK-0101: Configure Tailwind CSS with Dark Theme

**Phase**: 1 - Foundation  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 1 hour

---

## Description

Install and configure Tailwind CSS with custom dark theme colors matching the OpenEther brand.

---

## Acceptance Criteria

- [ ] Tailwind CSS installed via npm
- [ ] Dark theme colors configured in `tailwind.config.mjs`
- [ ] Custom fonts (Inter, Outfit) configured
- [ ] Global CSS imports Tailwind directives
- [ ] Build completes without errors

---

## Steps

### 1.1 Install Tailwind CSS
```bash
# Install Tailwind and Astro integration
npx astro add tailwind
```

### 1.2 Configure Tailwind
Update `tailwind.config.mjs` with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#06b6d4',      // Cyan
        primaryHover: '#22d3ee',  // Cyan light
        background: '#0f172a',   // Dark slate
        surface: '#1e293b',      // Slate 900
        border: '#334155',       // Slate 800
        text: '#f1f5f9',         // Slate 100
        textMuted: '#94a3b8',    // Slate 400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 1.3 Update Global Styles
Create `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-background text-text;
  }
  
  body {
    @apply min-h-screen antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading font-bold;
  }
}
```

### 1.4 Import Global Styles
In `src/layouts/Layout.astro`:

```astro
---
import '../styles/global.css';
---
```

---

## Dependencies

- TASK-0100: Astro project initialized

---

## Notes

- Using Slate color palette from Tailwind
- Inter for body text, Outfit for headings
- Cyan accent for primary actions
