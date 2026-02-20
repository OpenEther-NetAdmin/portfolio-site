# TASK-0102: Create Project Structure and Base Components

**Phase**: 1 - Foundation  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 2 hours

---

## Description

Create the directory structure and base reusable components for the project.

---

## Acceptance Criteria

- [ ] Directory structure created (components, layouts, pages, content, styles)
- [ ] Base Layout component created with HTML wrapper
- [ ] Header component with navigation created
- [ ] Footer component created
- [ ] Container component for max-width wrapper

---

## Steps

### 1.1 Create Directory Structure
```bash
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/seo
mkdir -p src/components/icons
mkdir -p src/layouts
mkdir -p src/pages/blog
mkdir -p src/content/blog
mkdir -p src/styles
mkdir -p src/utils
mkdir -p public/images
```

### 1.2 Create Base Layout
File: `src/layouts/Layout.astro`

```astro
---
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import Meta from '../components/seo/Meta.astro';
import '../../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'OpenEther - Network Security Consulting' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <Meta title={title} description={description} />
  </head>
  <body class="bg-background text-text min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 1.3 Create Header Component
File: `src/components/layout/Header.astro`

```astro
---
import Logo from '../icons/Logo.astro';
---

<header class="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
  <div class="container mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2">
      <Logo />
      <span class="font-heading font-bold text-xl">OpenEther</span>
    </a>
    
    <nav class="hidden md:flex items-center gap-6">
      <a href="/" class="hover:text-primary transition-colors">Home</a>
      <a href="/portfolio" class="hover:text-primary transition-colors">Portfolio</a>
      <a href="/blog" class="hover:text-primary transition-colors">Blog</a>
      <a href="/services" class="hover:text-primary transition-colors">Services</a>
      <a href="/contact" class="hover:text-primary transition-colors">Contact</a>
    </nav>
    
    <!-- Mobile menu button - placeholder -->
  </div>
</header>
```

### 1.4 Create Footer Component
File: `src/components/layout/Footer.astro`

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="border-t border-border bg-surface">
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-textMuted">
        © {currentYear} OpenEther. All rights reserved.
      </p>
      
      <div class="flex gap-4">
        <a href="#" class="text-textMuted hover:text-primary transition-colors">LinkedIn</a>
        <a href="#" class="text-textMuted hover:text-primary transition-colors">GitHub</a>
      </div>
    </div>
  </div>
</footer>
```

### 1.5 Create Meta Component
File: `src/components/seo/Meta.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { 
  title, 
  description = 'OpenEther - Network Security Consulting',
  image = '/images/og-default.png'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<title>{title} | OpenEther</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:type" content="website" />
```

### 1.6 Create Container Component
File: `src/components/common/Container.astro`

```astro
---
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<div class={`container mx-auto px-4 max-w-6xl ${className}`}>
  <slot />
</div>
```

---

## Dependencies

- TASK-0100: Astro project initialized
- TASK-0101: Tailwind CSS configured

---

## Notes

- Components use Astro's component syntax
- All components are server-rendered by default (zero JS)
- Mobile menu will be added in a future task
