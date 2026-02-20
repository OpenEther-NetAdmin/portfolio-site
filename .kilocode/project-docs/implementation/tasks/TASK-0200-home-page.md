# TASK-0200: Implement Home Page

**Phase**: 2 - Core Pages  
**Status**: Complete  
**Priority**: Critical  
**Estimated Effort**: 3 hours

---

## Description

Create the main landing page with hero section, services preview, blog preview, and call-to-action.

---

## Acceptance Criteria

- [ ] Hero section with logo, tagline, and CTA buttons
- [ ] Services preview section (3-4 services)
- [ ] Recent blog posts preview (3 latest)
- [ ] Call-to-action section for contact
- [ ] Fully responsive design

---

## Page Structure

```astro
---
import Layout from '../../layouts/Layout.astro';
import Container from '../../components/common/Container.astro';
import Button from '../../components/common/Button.astro';
import Card from '../../components/common/Card.astro';
import Badge from '../../components/common/Badge.astro';
---

<Layout title="Home">
  <!-- Hero Section -->
  <section class="py-20 md:py-32">
    <Container>
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-6xl font-heading font-bold mb-6">
          Secure. Connect. Automate.
        </h1>
        <p class="text-xl text-textMuted mb-8">
          OpenEther provides expert network security consulting and 
          penetration testing services for modern enterprises.
        </p>
        <div class="flex gap-4">
          <Button href="/services">View Services</Button>
          <Button href="/contact" variant="outline">Contact Me</Button>
        </div>
      </div>
    </Container>
  </section>

  <!-- Services Preview -->
  <section class="py-16 bg-surface">
    <Container>
      <h2 class="text-3xl font-heading font-bold mb-12">Services</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Service cards here -->
      </div>
      <div class="mt-8 text-center">
        <Button href="/services" variant="outline">View All Services</Button>
      </div>
    </Container>
  </section>

  <!-- Recent Blog Posts -->
  <section class="py-16">
    <Container>
      <h2 class="text-3xl font-heading font-bold mb-12">Latest Articles</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Blog post cards here -->
      </div>
    </Container>
  </section>

  <!-- CTA Section -->
  <section class="py-16 bg-surface">
    <Container>
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-3xl font-heading font-bold mb-4">
          Ready to secure your network?
        </h2>
        <p class="text-textMuted mb-8">
          Get in touch to discuss your security needs.
        </p>
        <Button href="/contact">Get in Touch</Button>
      </div>
    </Container>
  </section>
</Layout>
```

---

## Content

### Hero Section
- **Tagline**: "Secure. Connect. Automate."
- **Subtitle**: "OpenEther provides expert network security consulting and penetration testing services for modern enterprises."
- **CTAs**: "View Services" and "Contact Me"

### Services to Preview
1. Network Security Assessment
2. Penetration Testing
3. Security Architecture Review

### Blog Preview
- Show 3 most recent posts (can be empty initially)

---

## Dependencies

- TASK-0102: Layout components
- TASK-0104: UI components (Button, Card, Badge)
- TASK-0103: Logo component
