# Content Update Workflow

**Version**: 1.0  
**Scope**: Process for updating website content post-deployment

---

## Quick Reference

### Most Common Updates

#### Update Contact Form
1. Edit: `openether/src/pages/contact.astro`
2. Update Formspree ID (line 21)
3. Update email address (line 74)
4. Update social links (lines 81, 88)
5. Rebuild and deploy

#### Update Portfolio
1. Edit: `openether/src/pages/portfolio.astro`
2. Update work experience section
3. Update skills grid
4. Update certifications
5. Rebuild and deploy

#### Add Blog Post
1. Create new file in: `openether/src/content/blog/`
2. Use existing post as template
3. Use markdown or MDX format
4. Add frontmatter (title, date, description, tags)
5. Rebuild and deploy

#### Update Services
1. Edit: `openether/src/pages/services.astro`
2. Modify service offerings
3. Update process description
4. Rebuild and deploy

---

## Detailed Update Procedures

### Blog Post Addition

**Location**: `openether/src/content/blog/`

**Filename Format**: `YYYY-MM-DD-post-title.md`

**Required Frontmatter**:
```markdown
---
title: "Your Post Title"
pubDate: 2026-02-20
description: "Brief description for SEO"
author: "Your Name"
image:
  url: "/images/post-cover.jpg"
  alt: "Description of image"
tags: ["networking", "automation", "tutorial"]
---
```

**Content**: Use Markdown or MDX syntax

**Build & Deploy**:
```bash
cd openether
npm run build
rsync -avz --delete dist/ openether@[VPS_IP]:/var/www/openether/
```

---

### Portfolio Updates

**File**: `openether/src/pages/portfolio.astro`

**Sections to Edit**:
1. Professional Summary (lines ~20-40)
2. Work Experience Timeline (lines ~50-100)
3. Skills Grid (lines ~110-150)
4. Certifications (lines ~160-200)

**Best Practices**:
- Keep dates accurate
- Use real client names (with permission) or "Fortune 500 Client"
- Quantify achievements where possible ("reduced downtime by 40%")
- Update certifications as earned

---

### Contact Information Updates

**File**: `openether/src/pages/contact.astro`

**Line 21**: Formspree form ID
```astro
action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID"
```

**Line 74**: Email address
```astro
<a href="mailto:your-real-email@example.com">
```

**Lines 81 & 88**: Social links
```astro
<a href="https://linkedin.com/in/yourprofile">
<a href="https://github.com/yourusername">
```

**Also update**: `openether/src/components/layout/Footer.astro`

---

### Services Page Updates

**File**: `openether/src/pages/services.astro`

**Update**:
- Service offerings
- Pricing (if showing)
- Process/workflow description
- Call-to-action

**Frequency**: Review quarterly or as offerings change

---

### Design/Style Updates

**Colors**: Edit `openether/tailwind.config.mjs`

**Global Styles**: Edit `openether/src/styles/global.css`

**Components**: Edit files in `openether/src/components/`

---

## Build & Deploy Process

### 1. Make Changes Locally
```bash
cd openether
# Edit files...
```

### 2. Test Locally
```bash
npm run dev
# Visit: http://localhost:4321
# Test all changes
```

### 3. Build for Production
```bash
npm run build
```

**Verify build**:
```bash
ls -lh dist/
# Should show all pages and assets
```

### 4. Deploy to Production

**Option A: Quick Deploy (rsync)**
```bash
rsync -avz --delete dist/ openether@[VPS_IP]:/var/www/openether/
```

**Option B: Manual Upload**
```bash
# Copy files to VPS
scp -r dist/* openether@[VPS_IP]:/var/www/openether/

# Set permissions on VPS
ssh openether@[VPS_IP]
cd /var/www/openether
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

**Option C: Deploy Script**
Create `~/bin/deploy-openether.sh`:
```bash
#!/bin/bash
cd ~/projects/openether-portfolio/openether
npm run build
rsync -avz --delete dist/ openether@[VPS_IP]:/var/www/openether/
```

Make executable: `chmod +x ~/bin/deploy-openether.sh`

---

## Content Update Schedule

### Weekly
- Review contact form submissions
- Check for broken links
- Monitor analytics for popular content

### Monthly
- Review and update portfolio (if needed)
- Check for new certifications
- Test contact form functionality

### Quarterly
- Review services page accuracy
- Consider new blog post
- Update testimonials if applicable

### As Needed
- Add blog post when significant project completed
- Update certifications when earned
- Modify services when offerings change
- Update contact info if changed

---

## Testing After Updates

### Before Deployment
- [ ] Changes work in local dev
- [ ] Build succeeds without errors
- [ ] No broken links
- [ ] Images load correctly
- [ ] Forms still functional
- [ ] Mobile responsive maintained

### After Deployment
- [ ] Production site loads
- [ ] All pages display correctly
- [ ] Forms submit successfully
- [ ] Console shows no errors
- [ ] Performance not degraded

---

## Rollback Process

### If Update Causes Issues

1. **Restore from backup**:
```bash
# On VPS
cd /var/www
sudo tar -xzf /home/openether/backups/openether-site-[DATE].tar.gz
```

2. **Restore previous build locally**:
```bash
git checkout HEAD -- openether/
npm run build
rsync -avz --delete dist/ openether@[VPS_IP]:/var/www/openether/
```

---

## Version Control Best Practices

### Before Making Changes
```bash
# Pull latest
git pull origin main

# Create branch for updates (optional)
git checkout -b update-portfolio
```

### After Completing Updates
```bash
# Test locally first!
npm run dev

# Build and test
npm run build

# Commit changes
git add .
git commit -m "Update: Portfolio content and contact form"

# Push
git push origin main
# or: git push origin update-portfolio
```

---

## Common Update Scenarios

### Scenario 1: Add New Certification

**Files to edit**:
1. `openether/src/pages/portfolio.astro` - Add to certifications section
2. (Optional) Create blog post about certification experience

**Time estimate**: 15-30 minutes

**Testing**: Verify certification appears correctly

---

### Scenario 2: Update Email Address

**Files to edit**:
1. `openether/src/pages/contact.astro` (line 74)
2. `openether/src/components/layout/Footer.astro`

**Important**: Update Formspree settings to reflect new email

**Testing**: Submit test contact form

---

### Scenario 3: Add Case Study Blog Post

**Steps**:
1. Write case study in markdown
2. Add technical details and outcomes
3. Include before/after metrics
4. Add frontmatter with appropriate tags
5. Build and deploy

**Time estimate**: 2-4 hours (includes writing)

**Best practices**:
- Include code snippets if relevant
- Add images/charts
- Share on LinkedIn
- Link from portfolio page

---

### Scenario 4: Modify Service Offerings

**Files to edit**:
1. `openether/src/pages/services.astro` - Update descriptions
2. `openether/src/pages/portfolio.astro` - Show relevant examples
3. Blog posts - Cross-reference services

**Considerations**:
- Notify existing clients if service changes affect them
- Update any PDF materials
- Review pricing if applicable

---

## Emergency Contact Update

### If contact form stops working:

1. Check Formspree dashboard for errors
2. Verify form ID in contact.astro
3. Check email address is valid
4. Test with personal email

### If urgent, temporarily display direct email:

Edit contact.astro to show prominent email address until form fixed.

---

## Documentation Updates

### Update this workflow document when:
- New update pattern emerges
- Better deployment method found
- File locations change
- Build process changes

**Last updated**: 2026-02-20
