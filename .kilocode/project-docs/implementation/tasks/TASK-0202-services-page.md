# TASK-0202: Implement Services Page

**Phase**: 2 - Core Pages  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 2-3 hours

---

## Description

Create the services page listing consulting offerings and pricing.

---

## Acceptance Criteria

- [ ] Services listing with descriptions
- [ ] Process/workflow section
- [ ] Call-to-action for hiring
- [ ] Responsive design

---

## Services to Include

1. **Network Security Assessment**
   - Vulnerability scanning
   - Risk assessment
   - Recommendations report

2. **Penetration Testing**
   - External/internal testing
   - Web application testing
   - Detailed findings report

3. **Security Architecture Review**
   - Design review
   - Best practices consultation
   - Implementation guidance

4. **Incident Response**
   - 24/7 emergency response
   - Forensic analysis
   - Remediation support

---

## Structure

```astro
---
import Layout from '../../layouts/Layout.astro';
import Container from '../../components/common/Container.astro';
import Card from '../../components/common/Card.astro';
import Button from '../../components/common/Button.astro';
---

<Layout title="Services">
  <Container>
    <!-- Header -->
    <section class="py-12 text-center">
      <h1 class="text-4xl font-heading font-bold mb-4">Services</h1>
      <p class="text-xl text-textMuted max-w-2xl mx-auto">
        Expert network security consulting to protect your infrastructure.
      </p>
    </section>

    <!-- Services Grid -->
    <section class="py-12">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Service cards -->
      </div>
    </section>

    <!-- Process -->
    <section class="py-12 bg-surface rounded-xl p-8">
      <h2 class="text-2xl font-heading font-bold mb-6">How I Work</h2>
      <ol class="space-y-4">
        <li>1. Discovery Call - Understand your needs</li>
        <li>2. Proposal - Custom scope and pricing</li>
        <li>3. Engagement - Deliverables per agreed scope</li>
        <li>4. Follow-up - Support and recommendations</li>
      </ol>
    </section>

    <!-- CTA -->
    <section class="py-12 text-center">
      <Button href="/contact">Discuss Your Project</Button>
    </section>
  </Container>
</Layout>
```

---

## Dependencies

- TASK-0104: UI components (Card, Button)
- TASK-0200: Home page (for reference)
