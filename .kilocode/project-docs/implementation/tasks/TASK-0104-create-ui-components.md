# TASK-0104: Create UI Components (Button, Card, Badge)

**Phase**: 1 - Foundation  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 2 hours

---

## Description

Create reusable UI components: Button, Card, and Badge.

---

## Acceptance Criteria

- [ ] Button component with variants (primary, secondary, outline)
- [ ] Card component with hover effects
- [ ] Badge component for tags and categories
- [ ] All components use Tailwind CSS
- [ ] Components are accessible and responsive

---

## Components

### Button.astro
```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  class?: string;
}

const { 
  variant = 'primary', 
  size = 'md',
  href,
  class: className = '' 
} = Astro.props;

const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-lg';

const variantClasses = {
  primary: 'bg-primary text-background hover:bg-primaryHover',
  secondary: 'bg-surface text-text hover:bg-border',
  outline: 'border border-border text-text hover:bg-surface',
  ghost: 'text-textMuted hover:text-text hover:bg-surface',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
---

{href ? (
  <a href={href} class={classes}>
    <slot />
  </a>
) : (
  <button class={classes}>
    <slot />
  </button>
)}
```

### Card.astro
```astro
---
interface Props {
  class?: string;
  hover?: boolean;
}

const { class: className = '', hover = false } = Astro.props;
---

<div class={`bg-surface rounded-xl border border-border p-6 ${hover ? 'hover:border-primary transition-colors' : ''} ${className}`}>
  <slot />
</div>
```

### Badge.astro
```astro
---
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary ${className}`}>
  <slot />
</span>
```

---

## Dependencies

- TASK-0101: Tailwind configured
- TASK-0102: Project structure created
