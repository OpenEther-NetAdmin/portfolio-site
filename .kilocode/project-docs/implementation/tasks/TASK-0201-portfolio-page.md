# TASK-0201: Implement Portfolio/Resume Page

**Phase**: 2 - Core Pages  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 3-4 hours

---

## Description

Create the portfolio and resume page showcasing work experience, skills, and certifications.

---

## Acceptance Criteria

- [ ] Professional bio/summary section
- [ ] Work experience timeline
- [ ] Skills grid (technical skills)
- [ ] Certifications display
- [ ] Download resume PDF link (placeholder)

---

## Page Sections

### 1. Professional Summary
- Brief bio about your background
- Years of experience
- Areas of expertise

### 2. Work Experience
Timeline format with:
- Job title
- Company name
- Duration
- Key responsibilities/achievements

### 3. Skills Grid
Categories:
- Network Technologies
- Security Tools
- Cloud Platforms
- Programming Languages

### 4. Certifications
List of certifications (CISSP, CEH, etc.)

### 5. Resume Download
Link to PDF resume (placeholder for now)

---

## Structure

```astro
---
import Layout from '../../layouts/Layout.astro';
import Container from '../../components/common/Container.astro';
import Card from '../../components/common/Card.astro';
import Badge from '../../components/common/Badge.astro';
---

<Layout title="Portfolio">
  <Container>
    <!-- Bio Section -->
    <section class="py-12">
      <h1 class="text-4xl font-heading font-bold mb-4">Your Name</h1>
      <p class="text-xl text-textMuted max-w-2xl">
        Network Security Consultant with X years of experience...
      </p>
    </section>

    <!-- Work Experience -->
    <section class="py-12">
      <h2 class="text-2xl font-heading font-bold mb-8">Work Experience</h2>
      <!-- Timeline component -->
    </section>

    <!-- Skills -->
    <section class="py-12 bg-surface rounded-xl p-6">
      <h2 class="text-2xl font-heading font-bold mb-8">Skills</h2>
      <!-- Skills grid -->
    </section>

    <!-- Certifications -->
    <section class="py-12">
      <h2 class="text-2xl font-heading font-bold mb-8">Certifications</h2>
      <!-- Certification badges -->
    </section>
  </Container>
</Layout>
```

---

## Dependencies

- TASK-0104: UI components (Card, Badge)
- TASK-0200: Home page (for reference)
