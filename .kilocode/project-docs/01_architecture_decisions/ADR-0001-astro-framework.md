# ADR-0001: Use Astro Framework for OpenEther Website

**Date**: 2026-02-18  
**Status**: Approved  
**Author**: Architect  

---

## Context

OpenEther requires a consulting firm website with:
- Self-hosted deployment on user's existing VPS
- Static content (portfolio, blog, services)
- Markdown-based blog system
- Dark theme professional design
- Fast performance for SEO

The previous project used Next.js 15 + shadcn/ui, but:
- Next.js requires Node.js runtime on server (more complex VPS setup)
- Higher server resource requirements
- Overkill for primarily static content

## Decision

**We will use Astro** as the primary framework for OpenEther.

## Consequences

### Positive
- **Zero JavaScript by default**: Ships only HTML/CSS, JavaScript only when needed
- **Simpler VPS deployment**: Outputs static HTML files (serve via Nginx)
- **Built-in Markdown/MDX support**: Native blog content management
- **Component flexibility**: Can use React/Svelte/Vue components when needed
- **Excellent performance**: Smaller bundle sizes, faster load times
- **SEO-friendly**: Server-side rendering option, easy meta tags
- **Developer experience**: Fast hot-reload, clear file structure

### Negative
- **Learning curve**: New framework if familiar with Next.js
- **Ecosystem smaller**: Fewer third-party integrations than Next.js
- **Client-side interactivity**: Requires islands architecture for dynamic features

### Tradeoffs Accepted
- Trading React ecosystem breadth for performance and deployment simplicity
- Accepting potential need to write custom components instead of using shadcn/ui

---

## Alternatives Considered

| Technology | Pros | Cons | Score |
|------------|------|------|-------|
| **Astro (CHOSEN)** | Best performance, simple deployment, native MDX | Smaller ecosystem | **9/10** |
| Next.js 15 | Familiar, large ecosystem, full SSR | Complex VPS setup, heavier | **7/10** |
| Hugo | Fastest build, proven for blogs | Go templates, less flexible | **7/10** |
| SolidStart | Great performance, fine-grained reactivity | Smaller community, less mature | **6/10** |

---

## Technical Implementation

### Stack Components
- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS (proven, fast)
- **UI Components**: Custom components (no shadcn/ui dependency)
- **Content**: MDX for blog with frontmatter
- **Deployment**: Static HTML via Nginx on VPS

### Directory Structure
```
openether/
├── src/
│   ├── components/    # Reusable UI components
│   ├── layouts/      # Page layouts
│   ├── pages/        # File-based routing
│   ├── content/      # Blog posts (MDX)
│   └── styles/       # Global styles
├── public/           # Static assets
├── astro.config.mjs  # Astro configuration
└── tailwind.config.mjs
```

### Build Output
- Static HTML files for all pages
- CSS bundled and minified
- Optional: Minimal JS for interactivity (forms, mobile menu)

---

## Verification

This choice meets our requirements:
- ✅ Self-hosted compatible (static HTML output)
- ✅ Markdown blog support (native MDX)
- ✅ Fast performance (zero JS by default)
- ✅ Dark theme (Tailwind CSS)
- ✅ Portfolio/blog focus (Astro's sweet spot)

---

## Approval

**Awaiting**: Your approval to proceed with Astro implementation

**⚠️ PUSHBACK POINTS**: 
- If you strongly prefer Next.js for familiarity, we can pivot - but deployment will be more complex

**💡 ALTERNATIVE**: If you want shadcn/ui components, we can use Astro's React integration and port the components - but for a portfolio site, custom Tailwind components will be lighter and faster.

**Decision Required**: Approve Astro, or request Next.js alternative?
