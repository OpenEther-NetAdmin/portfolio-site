# OpenEther Project Structure

```
openether/                      # Root project directory
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.astro    # Primary CTA button
│   │   │   ├── Card.astro      # Content card component
│   │   │   ├── Badge.astro     # Tag/category badge
│   │   │   └── Container.astro # Max-width wrapper
│   │   ├── layout/
│   │   │   ├── Header.astro    # Site navigation header
│   │   │   ├── Footer.astro    # Site footer
│   │   │   └── Layout.astro    # Base layout wrapper
│   │   ├── seo/
│   │   │   └── Meta.astro      # SEO meta tags
│   │   └── icons/
│   │       └── Logo.astro      # OpenEther logo SVG
│   │
│   ├── layouts/                # Page-level layouts
│   │   ├── BaseLayout.astro    # Main layout with header/footer
│   │   └── BlogPost.astro      # Blog article layout
│   │
│   ├── pages/                  # File-based routing
│   │   ├── index.astro         # Home page (/)
│   │   ├── portfolio.astro     # Portfolio page (/portfolio)
│   │   ├── services.astro      # Services page (/services)
│   │   ├── contact.astro       # Contact page (/contact)
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing (/blog)
│   │   │   └── [...slug].astro # Dynamic blog posts (/blog/:slug)
│   │   └── 404.astro           # Not found page
│   │
│   ├── content/                # MDX content
│   │   ├── config.ts           # Content collection definitions
│   │   └── blog/               # Blog posts directory
│   │       ├── first-post.mdx
│   │       ├── network-auto-doc.mdx
│   │       └── ...
│   │
│   ├── styles/
│   │   └── global.css          # Global styles
│   │
│   └── utils/                  # Utility functions
│       ├── date.ts             # Date formatting
│       └── types.ts            # TypeScript types
│
├── public/                     # Static assets
│   ├── favicon.svg            # Site favicon
│   ├── images/                # Image assets
│   │   ├── hero/
│   │   └── projects/
│   └── fonts/                 # Self-hosted fonts (if needed)
│
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
└── .gitignore                # Git ignore rules
```

---

## File Purposes

### Components

| Component | Purpose |
|-----------|---------|
| `Button.astro` | Reusable button with variants (primary, secondary, outline) |
| `Card.astro` | Container for content cards with hover effects |
| `Badge.astro` | Small tag for categories, skills, status |
| `Container.astro` | Max-width wrapper with responsive padding |
| `Header.astro` | Navigation with links to all pages |
| `Footer.astro` | Copyright, social links, quick navigation |
| `Layout.astro` | HTML wrapper with `<head>`, SEO, global styles |
| `Meta.astro` | Page title, description, Open Graph tags |
| `Logo.astro` | SVG logo component |

### Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | Home/landing page |
| `/portfolio` | `portfolio.astro` | Resume and case studies |
| `/services` | `services.astro` | Consulting services |
| `/contact` | `contact.astro` | Contact form |
| `/blog` | `blog/index.astro` | Blog listing page |
| `/blog/*` | `blog/[...slug].astro` | Individual blog posts |
| `/404` | `404.astro` | Not found page |

---

## Routing Pattern

Astro uses file-based routing. Each `.astro` file in `src/pages/` becomes a route:

```
src/pages/index.astro         →  /
src/pages/portfolio.astro    →  /portfolio
src/pages/services.astro      →  /services
src/pages/contact.astro       →  /contact
src/pages/blog/index.astro    →  /blog
src/pages/blog/[...slug].astro → /blog/:slug (dynamic)
```

---

## Content Collections

Blog posts are stored as MDX files in `src/content/blog/`:

```mdx
---
title: "My First Blog Post"
description: "A brief description for SEO"
pubDate: 2026-02-18
tags: ["network", "automation"]
---

# My First Blog Post

Your content here...
```

---

## Key Decisions

1. **Component Organization**: Group by type (common, layout, seo, icons)
2. **Page Structure**: Flat in pages/ except for blog (subdirectory)
3. **Content**: MDX for blog posts (Markdown + JSX components)
4. **Styling**: Tailwind CSS with custom config (no separate CSS files)
5. **Assets**: Public folder for static files (images, fonts, favicon)
