import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/OpenEther/);
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('OpenEther');
  });

  test('should have working navigation', async ({ page }) => {
    // Check main navigation links
    await expect(page.getByRole('link', { name: 'Portfolio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
  });

  test('should navigate to Portfolio page', async ({ page }) => {
    await page.click('a[href="/portfolio"]');
    await expect(page).toHaveURL('/portfolio');
    await expect(page.locator('h1')).toContainText('Chris Cline');
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL('/services');
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
  });

  test('should pass accessibility audit', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should have correct Formspree action', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toHaveAttribute('action', 'https://formspree.io/f/xpqjjybz');
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.getByText('chris.cline@openether.net')).toBeVisible();
    await expect(page.getByText('linkedin.com/in/ccline2')).toBeVisible();
  });

  test('should require form fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // HTML5 validation should prevent submission
    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
  });
});

test.describe('Portfolio Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portfolio');
  });

  test('should display name and title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Chris Cline');
  });

  test('should display work experience', async ({ page }) => {
    await expect(page.getByText('Senior Solutions Engineer')).toBeVisible();
    await expect(page.getByText('Bedroc / Change Healthcare')).toBeVisible();
  });

  test('should display skills section', async ({ page }) => {
    await expect(page.getByText('Network Security')).toBeVisible();
    await expect(page.getByText('Routing & Switching')).toBeVisible();
  });

  test('should display certifications', async ({ page }) => {
    await expect(page.getByText('CCNA')).toBeVisible();
    await expect(page.getByText('CompTIA Security+')).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test('should display blog listing', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL('/blog');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile menu', async ({ page }) => {
    await page.goto('/');
    // Mobile menu should be collapsed initially
    // Look for hamburger menu button
    const menuButton = page.locator('button[aria-label="Toggle menu"], button:has-text("Menu")');
    if (await menuButton.count() > 0) {
      await menuButton.click();
    }
  });
});
