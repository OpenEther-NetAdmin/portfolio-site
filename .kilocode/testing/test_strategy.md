# Testing Strategy - OpenEther Consulting Website

**Document Version**: 1.0  
**Last Updated**: 2026-02-20  
**Scope**: Full-stack testing, QA, and production readiness

## Executive Summary

This document outlines a comprehensive testing strategy for the OpenEther consulting website built with Astro 4.x and Tailwind CSS. The strategy covers unit tests, integration tests, E2E tests, accessibility testing, performance validation, and QA processes.

**Key Testing Goals**:
- 100% validation of network utility functions (IPv4, IPv6, CIDR)
- Contact form functionality verification
- Cross-browser and mobile compatibility
- WCAG 2.1 AA accessibility compliance
- Lighthouse scores > 90 across all metrics
- Zero broken links and proper SEO setup

## Testing Stack

### Unit & Integration Testing
- **Framework**: Vitest (already configured)
- **Test Environment**: jsdom
- **Testing Library**: @testing-library/react (installed)
- **Coverage Tool**: v8 (built into Vitest)

### E2E Testing
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit
- **Parallel Execution**: Yes
- **CI Integration**: GitHub Actions

### Accessibility Testing
- **Automated**: axe-core via @axe-core/playwright
- **Manual**: axe DevTools browser extension
- **Standard**: WCAG 2.1 Level AA

### Performance Testing
- **Tool**: Lighthouse CI
- **Metrics**: Performance, Accessibility, Best Practices, SEO
- **CI Integration**: GitHub Actions
- **Budget**: All scores > 90

## Test Coverage Requirements

### Unit Test Coverage Targets
- **src/lib/network/**: 100% (critical validation logic)
- **src/hooks/**: 80% minimum (form state, calculation history)
- **src/utils/**: 80% minimum (if applicable)

### Integration Test Coverage
- Contact form submission flow
- Navigation between pages
- Blog post rendering and routing
- Network tool calculations (if exposed)

### E2E Test Coverage
- Home page → Services → Contact journey
- Blog listing → Blog post → Back navigation
- Contact form completion and submission
- Mobile menu toggle and navigation

## Phase 1: Content Finalization (Prerequisite)

### Tasks Required Before Testing
1. **Formspree Setup** (TASK-CF-01 → CF-02)
   - Create Formspree account
   - Obtain valid form ID
   - Update in contact.astro line 21

2. **Content Updates** (TASK-CF-03 → CF-06)
   - Update email address
   - Add LinkedIn profile URL
   - Add GitHub profile URL
   - Fill in portfolio content (real work experience, skills, certifications)

3. **Verification** (TASK-CF-07)
   - Review blog content for accuracy
   - Verify all placeholder text removed
   - Check brand consistency

**Dependencies**: All testing depends on content being finalized. Cannot proceed with meaningful tests until placeholders are removed.

## Phase 2: Testing Infrastructure (Parallelizable)

### Parallel Task Group A (Can run alongside content updates)
**Run by**: Developer agent

- **TASK-TEST-01**: Add test scripts to package.json
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:run": "vitest run",
      "test:coverage": "vitest run --coverage",
      "test:e2e": "playwright test"
    }
  }
  ```

- **TASK-TEST-02**: Update vitest.config.ts
  - Include components and pages in coverage
  - Add coverage thresholds
  - Configure reporters for CI

### Parallel Task Group B (Can run alongside content updates)
**Run by**: Developer agent

- **TASK-TEST-03**: Install Playwright
  ```bash
  npm install -D @playwright/test
  npx playwright install
  npx playwright install-deps
  ```
  - Configure playwright.config.ts
  - Set up test directory structure

- **TASK-TEST-05**: Install axe-core
  ```bash
  npm install -D @axe-core/playwright
  ```
  - Configure axe for E2E tests
  - Set WCAG 2.1 AA ruleset

## Phase 3: Unit & Integration Tests (Post-Content)

### Unit Tests (Sequential, but can be parallelized by agent)
**Run by**: Developer agent

- **TASK-TEST-06**: IPv4 validation tests
  - Valid addresses: 192.168.1.1, 10.0.0.1, 172.16.0.1
  - Invalid addresses: 256.1.1.1, 192.168.01.1, empty string
  - Edge cases: 0.0.0.0, 255.255.255.255

- **TASK-TEST-07**: IPv6 validation tests
  - Full notation: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
  - Compressed: 2001:db8:85a3::8a2e:370:7334
  - Loopback: ::1
  - Invalid: multiple ::, out of range hex

- **TASK-TEST-08**: CIDR validation tests
  - Valid CIDR: 192.168.1.0/24, 10.0.0.0/8
  - Invalid: 192.168.1.0/33, incorrect format

- **TASK-TEST-09**: Contact form validation tests
  - Required fields (name, email, message)
  - Email format validation
  - Form submission state management

### Integration Tests (Post-Unit Tests)
**Run by**: Developer agent

- **TASK-TEST-10**: Navigation component tests
  - Mobile menu toggle
  - Active page highlighting
  - Link functionality

- **TASK-TEST-11**: Blog system integration
  - MDX rendering
  - Metadata extraction
  - Dynamic routing

## Phase 4: E2E Testing (Post-Content)

### Critical User Journeys
**Run by**: QA agent with E2E focus

All E2E tests use Playwright with the following structure:

- **TASK-E2E-01**: Homepage navigation flow
  ```typescript
  test('Homepage navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/\/services/);
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/\/contact/);
  });
  ```

- **TASK-E2E-02**: Blog reading journey
  - Navigate to blog index
  - Click on blog post
  - Verify post content loads
  - Test back navigation
  - Test URL sharing

- **TASK-E2E-03**: Contact form submission
  - Fill in form fields (valid data)
  - Submit form
  - Verify success message/redirect
  - Test validation errors (missing required fields)
  - Test invalid email format

- **TASK-E2E-04**: Services page engagement
  - Navigate to services
  - Verify all services listed
  - Test any interactive elements

- **TASK-E2E-05**: Portfolio page navigation
  - Verify portfolio content displays
  - Test any skill/category filters
  - Verify certification badges

### Accessibility in E2E Tests
Each E2E test should include accessibility scan:
```typescript
test('Page should be accessible', async ({ page }) => {
  await page.goto('/contact');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Phase 5: Accessibility & Performance (Parallel)

### Accessibility Testing
**Run by**: QA agent with accessibility focus

- **TASK-AP-01**: Manual axe DevTools scan
  - Install axe DevTools browser extension
  - Scan each page (Home, Portfolio, Services, Contact, Blog Index, Blog Post)
  - Document any violations
  - Fix critical issues before launch

- **TASK-AP-03**: Accessibility checklist
  - [ ] All images have alt text
  - [ ] Keyboard navigation works
  - [ ] Focus indicators visible
  - [ ] Color contrast meets WCAG standards
  - [ ] Form labels properly associated
  - [ ] ARIA attributes used correctly
  - [ ] Skip navigation link present
  - [ ] Semantic HTML structure

### Performance Testing
**Run by**: DevOps agent

- **TASK-AP-02**: Lighthouse CI integration
  ```yaml
  # .github/workflows/lighthouse.yml
  - name: Lighthouse CI
    run: |
      npm install -g @lhci/cli@0.12.x
      npm run build
      lhci autorun
  ```

- **TASK-AP-04**: Performance budgets
  - Performance score: > 90
  - Accessibility score: > 95
  - Best Practices: > 90
  - SEO score: > 90
  - First Contentful Paint: < 1.8s
  - Largest Contentful Paint: < 2.5s

- **TASK-AP-05**: Mobile responsiveness
  - Test breakpoints: 320px, 768px, 1024px, 1440px
  - Verify navigation works on mobile
  - Check touch targets (min 44x44px)
  - Verify font sizes readable

## Phase 6: QA Process (Parallelizable)

### Cross-Platform Testing
**Run by**: QA agent

- **TASK-QA-01**: Cross-browser testing
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)
  - Test all interactive elements
  - Verify consistent rendering
  - Check console for errors

- **TASK-QA-02**: Mobile device testing
  - [ ] iPhone 14 (Safari)
  - [ ] Pixel 7 (Chrome)
  - [ ] iPad Air (Safari)
  - Test touch interactions
  - Verify responsive breakpoints
  - Check performance on mobile networks

### SEO Validation
**Run by**: QA agent

- **TASK-QA-03**: SEO checklist
  - [ ] Meta titles (50-60 chars, unique per page)
  - [ ] Meta descriptions (150-160 chars, unique)
  - [ ] Open Graph tags (og:title, og:description, og:image, og:type)
  - [ ] Twitter Card tags
  - [ ] Sitemap.xml generated
  - [ ] Robots.txt configured
  - [ ] Canonical URLs set
  - [ ] Structured data (JSON-LD)
  - [ ] Alt text for all images
  - [ ] Semantic heading structure (H1→H2→H3)
  - [ ] URL structure readable

- **TASK-QA-05**: Form functionality
  - [ ] All form fields have labels
  - [ ] Required fields marked
  - [ ] Validation shows errors
  - [ ] Form submission works
  - [ ] Success/error states handled
  - [ ] Test with real Formspree endpoint

- **TASK-QA-06**: Link validation
  - [ ] No broken internal links
  - [ ] No broken external links
  - [ ] Social media links functional
  - [ ] Email link works
  - Use tool: `npm run check-links` or online validator

## Test Execution Strategy

### Local Development
```bash
# Unit tests (watch mode)
npm test

# Unit tests (single run)
npm run test:run

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# All tests (CI mode)
npm run test:run && npm run test:e2e
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run -- --coverage
      - run: npm run test:e2e
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Pre-Deployment Checklist
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Code coverage meets thresholds (80% overall)
- [ ] Accessibility scan shows 0 violations
- [ ] Lighthouse scores all > 90
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Link validation passed
- [ ] SEO checklist complete
- [ ] Form functionality verified

## Risk Assessment

### High Risk
- **Formspree integration**: If not configured correctly, contact form won't work
  - *Mitigation*: Test with real endpoint, verify spam protection

- **Mobile responsiveness**: Issues could hurt SEO and user experience
  - *Mitigation*: Thorough testing across devices, use browser dev tools

### Medium Risk
- **Accessibility compliance**: Could face legal issues if not compliant
  - *Mitigation*: Automated + manual testing, fix all violations

- **Performance**: Large images or unoptimized code could slow site
  - *Mitigation*: Lighthouse CI, image optimization, code splitting

### Low Risk
- **SEO**: Missing meta tags or poor structure could impact ranking
  - *Mitigation*: SEO checklist, use SEO auditing tools

## Success Criteria

✅ **Launch Readiness**:
- All unit tests passing (100% for network, 80% for hooks)
- All E2E tests passing
- Accessibility: 0 axe violations on all pages
- Performance: Lighthouse scores > 90 across all metrics
- Cross-browser: Works on Chrome, Firefox, Safari, Edge
- Mobile: Responsive at all breakpoints, touch targets correct
- SEO: All meta tags present, sitemap submitted
- Forms: Contact form working, tested end-to-end
- Links: 0 broken links
- Content: All placeholders removed, brand-consistent

## Next Steps

1. **Immediate**: Complete content finalization (TASK-CF-01 to CF-07)
2. **Parallel**: Set up testing infrastructure (TASK-TEST-01 to TEST-05)
3. **Post-content**: Write unit and integration tests (TASK-TEST-06 to TEST-10)
4. **Post-content**: Create E2E tests (TASK-E2E-01 to E2E-05)
5. **Parallel**: QA process and accessibility testing (TASK-QA-01 to QA-06)
6. **Final**: Performance validation and deployment

---

**Related Documents**:
- [.kilocode/testing/qa_checklist.md](./qa_checklist.md) - Detailed QA procedures
- [.kilocode/docs/deployment_runbook.md](../docs/deployment_runbook.md) - Production deployment
- [openether/vitest.config.ts](../../openether/vitest.config.ts) - Test configuration
- [openether/src/lib/network/validators.ts](../../openether/src/lib/network/validators.ts) - Network validation functions
