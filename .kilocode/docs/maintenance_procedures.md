# Production Maintenance Procedures

**Version**: 1.0  
**Scope**: Ongoing maintenance of OpenEther consulting website

---

## Maintenance Schedule

### Daily (Automated)
- [ ] Uptime monitoring (UptimeRobot/BetterUptime)
- [ ] SSL certificate validity check
- [ ] Log rotation (automatic via system)

### Weekly (15 minutes)
- [ ] Review contact form submissions
- [ ] Check analytics (if implemented)
- [ ] Verify no broken links
- [ ] Quick visual check of all pages

### Monthly (30-60 minutes)
- [ ] Security updates review
- [ ] Performance audit (Lighthouse)
- [ ] Backup integrity check
- [ ] Content review (outdated info?)
- [ ] Link validation scan

### Quarterly (2-3 hours)
- [ ] Dependency updates
- [ ] Full security audit
- [ ] SSL certificate renewal check
- [ ] Content strategy review
- [ ] Performance optimization review

### Annually (1 day)
- [ ] disaster recovery drill
- [ ] Complete security audit
- [ ] Backup restoration test
- [ ] Technology stack review
- [ ] Design refresh consideration

---

## Daily Maintenance

### Automated Tasks (No Action Required)

**Uptime Monitoring**:
- Service: UptimeRobot or BetterUptime
- Alerts via: Email/SMS
- Check: Website accessible every 5 minutes
- Response: If alert received, investigate immediately

**SSL Certificate Monitoring**:
- Tool: Built into uptime monitoring or separate SSL check
- Expiration alert: 30 days before
- Response: If alert received, check auto-renewal

**Log Rotation**:
- Managed by: logrotate (system service)
- Location: /var/log/nginx/
- Rotation: Daily
- Retention: 52 weeks (1 year)
- Action: Verify logs are rotating (no manual action)

---

## Weekly Maintenance (Every Monday)

### Estimated Time: 15 minutes

#### 1. Review Contact Form Submissions (5 min)
```bash
# Check Formspree dashboard
# Or check email inbox for form submissions
```

**Actions**:
- Respond to new inquiries within 24-48 hours
- Track leads in CRM/spreadsheet
- Flag any spam (report to Formspree if needed)

**What to look for**:
- [ ] New legitimate inquiries
- [ ] Any form submission errors
- [ ] Spam rate (should be low due to Formspree protection)

---

#### 2. Check Analytics (5 min)

**If using Google Analytics**:
1. Log in to analytics.google.com
2. Navigate to: Realtime → Overview
3. Check last 7 days: Audience → Overview

**Metrics to monitor**:
- [ ] Page views trending up, down, or stable?
- [ ] Bounce rate (should be < 70%)
- [ ] Average session duration
- [ ] Top pages (which content is popular?)
- [ ] Traffic sources (where visitors come from)

**What to look for**:
- Sudden drops in traffic (investigate cause)
- Pages with high exit rate (improve content?)
- New traffic sources (engage with them)

**Action items**:
- If traffic drops > 20%, investigate (Google penalty? Technical issue?)
- If bounce rate > 80%, review page content and user experience
- If blog post is popular, consider writing follow-up

---

#### 3. Verify No Broken Links (3 min)

```bash
# Option 1: Manual check of key pages
# Open in browser:
# - Homepage
# - Portfolio
# - Services
# - Blog
# - Contact

# Option 2: Automated check (if installed)
cd openether
broken-link-checker http://localhost:4321 --ordered
```

**What to check**:
- [ ] All navigation links work
- [ ] All social media links work (LinkedIn, GitHub)
- [ ] Email link works
- [ ] All blog post links work
- [ ] No images broken

**Actions**:
- Fix any broken internal links immediately
- Update or remove broken external links
- Update LinkedIn/GitHub URLs if changed

---

#### 4. Quick Visual Check (2 min)

**Pages to view**:
- [ ] Homepage (https://openether.com)
- [ ] Portfolio
- [ ] Services
- [ ] Contact

**What to look for**:
- [ ] Page loads without errors
- [ ] No console errors (F12 → Console)
- [ ] Contact form visible and functional
- [ ] Images load correctly
- [ ] No layout broken
- [ ] Mobile responsive (check on phone or resize browser)

**Actions**:
- If errors found, check Nginx logs
- If layout broken, check if recent deployment broke something
- If form not working, check Formspree configuration

---

## Monthly Maintenance (First Monday of Month)

### Estimated Time: 30-60 minutes

#### 1. Security Updates (15 min)

**Check for security advisories**:
- [ ] Node.js security releases: https://nodejs.org/en/security/
- [ ] Astro framework security: https://github.com/withastro/astro/security

**Update server packages**:
```bash
# SSH to VPS
ssh openether@[VPS_IP]

# Check for updates
sudo apt update

# Review available updates
sudo apt list --upgradable

# Apply security updates only
sudo apt upgrade -y --only-upgrade

# Check if reboot needed
if [ -f /var/run/reboot-required ]; then
    echo "Reboot required - schedule for low-traffic time"
    cat /var/run/reboot-required.pkgs
fi
```

**Update local development environment**:
```bash
cd openether

# Check for outdated packages
npm outdated

# Review changelogs for security fixes
# Then run:
npm update

# Test locally
npm run dev
npm run build
```

**Actions**:
- Apply security updates promptly
- Test site after updates
- If major Node.js version released, plan upgrade

---

#### 2. Performance Audit (15 min)

**Run Lighthouse test**:
```bash
# Option 1: Chrome DevTools
# F12 → Lighthouse tab → Generate report

# Option 2: Command line (if installed)
npm install -g @lhci/cli@0.12.x
lhci autorun --url=https://openether.com
```

**Check scores**:
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90

**Key metrics**:
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1

**Actions**:
- If scores drop > 5 points, investigate cause
- If LCP increases, check images or large dependencies
- If accessibility score drops, run axe DevTools

**Performance optimization opportunities**:
- Unoptimized images: Compress with TinyPNG or ImageOptim
- Large assets: Check `dist/` folder size
- New blog posts: Ensure images are optimized before uploading

---

#### 3. Backup Integrity Check (10 min)

**Verify backups exist**:
```bash
# SSH to VPS
ssh openether@[VPS_IP]

# Check backup directory
ls -lh /home/openether/backups/

# Should show recent backups (last 7 days)
# File size should be reasonable (1-10 MB for static site)
```

**Test backup restoration** (quarterly recommended, monthly optional):
```bash
# Create test directory
mkdir -p /tmp/restore-test

# Extract latest backup
LATEST_BACKUP=$(ls -t /home/openether/backups/openether-site-*.tar.gz | head -1)
tar -xzf $LATEST_BACKUP -C /tmp/restore-test/

# Verify files
ls /tmp/restore-test/
# Should show index.html, portfolio/, services/, etc.

# Clean up
rm -rf /tmp/restore-test
```

**Check backup automation**:
```bash
# Verify cron job is running
crontab -l | grep backup

# Check backup log
tail -f /home/openether/backup.log
```

**Actions**:
- If no recent backups, investigate cron job
- If backup size is 0, check disk space
- If restoration fails, create fresh backup: `./backup-site.sh`

---

#### 4. Content Review (10 min)

**Check for outdated information**:
- [ ] Work experience timeline current?
- [ ] Certifications still valid?
- [ ] Services offered still accurate?
- [ ] Skills list up to date?
- [ ] Blog posts still relevant?
- [ ] Contact information accurate?
- [ ] Social media links working?

**Actions**:
- Update [openether/src/pages/portfolio.astro] with new experience
- Add new certifications
- Remove outdated blog posts (or add update notices)
- Update services if offerings changed

**Schedule content updates**:
- [ ] Add to calendar for next month if updates needed
- [ ] Plan blog post if nothing published recently

---

#### 5. Link Validation Scan (10 min)

**Run automated link checker**:

```bash
# Install if not already installed
npm install -g broken-link-checker

# Run check
blc https://openether.com --ordered --recursive --exclude-external

# Or, check internal links only
blc https://openether.com --ordered --exclude-external
```

**Expected results**:
- 0 broken internal links
- Broken external links (review and update)

**Manual check of key external links**:
- [ ] LinkedIn profile
- [ ] GitHub profile
- [ ] Email link
- [ ] Any other external references

**Actions**:
- Fix any broken internal links (update and redeploy)
- Update external links that have changed
- Remove links to dead resources
- Check if LinkedIn/GitHub URLs still valid

---

## Quarterly Maintenance (First Month of Quarter)

### Estimated Time: 2-3 hours

#### 1. Dependency Updates (1 hour)

**Review outdated dependencies**:
```bash
cd openether

# Check for updates
npm outdated

# Key packages to monitor:
# - astro (major versions)
# - @astrojs/* (integrations)
# - tailwindcss
# - d3 (if visualization tools used)

# For each major package, check changelog:
# astro: https://github.com/withastro/astro/releases
# tailwind: https://github.com/tailwindlabs/tailwindcss/releases
```

**Update strategy**:
- **Patch versions**: Update immediately (bug fixes)
- **Minor versions**: Update monthly (new features, backward compatible)
- **Major versions**: Plan quarterly (breaking changes)

**Update process**:
```bash
# Update all packages to latest
cd openether
npm update

# Or update specific packages
npm install astro@latest @astrojs/mdx@latest

# Check for security advisories
npm audit

# If vulnerabilities found, run:
npm audit fix

# Test locally
npm run dev
```

**Major version upgrades** (e.g., Astro 4.x → 5.x):
- [ ] Read migration guide thoroughly
- [ ] Create feature branch: `git checkout -b upgrade-astro-5`
- [ ] Update one major dependency at a time
- [ ] Test build after each major update
- [ ] Run manual testing of all pages
- [ ] Deploy to staging (if available)
- [ ] If no issues, merge and deploy

**Test after updates**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Verify output
ls -lh dist/

# Preview
npm run preview
```

**Check compatibility**:
- [ ] All pages load without errors
- [ ] Blog posts render correctly
- [ ] Form still works
- [ ] Network tools (if any) functional
- [ ] No console errors

**Actions**:
- If build fails, check breaking changes in changelog
- If styles broken, check Tailwind upgrade notes
- If features broken, revert and plan migration

---

#### 2. Full Security Audit (30 min)

**Check server security**:
```bash
# SSH to VPS
ssh openether@[VPS_IP]

# Check for failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -20

# Check for unusual access patterns
sudo grep "sshd" /var/log/auth.log | tail -30

# Review firewall rules
sudo ufw status verbose

# Check for open ports
sudo netstat -tulpn

# Check disk space
df -h

# Check memory usage
free -h
```

**Nginx security check**:
```bash
# Check Nginx version (should be up to date)
nginx -v

# Check for suspicious requests in access log
sudo grep -E "(wp-admin|phpmyadmin|admin)" /var/log/nginx/access.log

# Check for SQL injection attempts
sudo grep -i "union.*select" /var/log/nginx/access.log
```

**SSL/TLS security**:
```bash
# Test SSL configuration
sudo certbot certificates

# Run SSL Labs test manually
# Visit: https://www.ssllabs.com/ssltest/
# Enter: openether.com

# Expected grade: A or A+
```

**Actions**:
- If many failed login attempts, consider fail2ban
- If disk space > 80%, clean old logs/backups
- If suspicious activity, block IPs via firewall
- Update server packages: `sudo apt update && sudo apt upgrade`

---

#### 3. SSL Certificate Renewal Check (15 min)

**Check auto-renewal status**:
```bash
# SSH to VPS
ssh openether@[VPS_IP]

# Check certbot timer
sudo systemctl list-timers | grep certbot

# Should show: certbot.timer

# Check last renewal attempt
sudo journalctl -u certbot.service | tail -20

# Check certificate expiration
sudo certbot certificates

# Should show: Valid for 90 days, auto-renews at 60 days
```

**Manual renewal test**:
```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Should succeed without errors

# If within 30 days of expiry, force renewal
# sudo certbot renew --force-renewal
```

**Actions**:
- If renewal failed, check DNS and network connectivity
- If auto-renewal not working, set up cron job:
```bash
# Edit crontab
sudo crontab -e

# Add line for daily renewal check:
0 3 * * * certbot renew --quiet
```

---

#### 4. Content Strategy Review (30 min)

**Review analytics performance**:
- [ ] Most popular pages (top 5)
- [ ] Most popular blog posts
- [ ] Traffic sources (organic, social, direct)
- [ ] Bounce rate trends
- [ ] Conversion goals (contact form submissions)

**Blog content audit**:
- [ ] When was last post published?
- [ ] Which posts get most traffic?
- [ ] Any outdated information?
- [ ] What topics to cover next?
- [ ] Are posts being shared socially?

**Client project updates**:
- [ ] Any completed projects to showcase?
- [ ] New skills learned worth highlighting?
- [ ] Testimonials received?
- [ ] Case studies to write?

**Action items**:
- [ ] Schedule next blog post
- [ ] Update portfolio with recent work
- [ ] Reach out for testimonials
- [ ] Plan content calendar for next quarter

---

## Annual Maintenance (Pick a Slow Period)

### Estimated Time: 1 full day

#### 1. Disaster Recovery Drill (2 hours)

**Scenario**: Website completely gone

**Steps**:
1. Document current state
2. Simulate disaster (rename website directory)
3. Follow recovery procedures
4. Time the recovery
5. Document lessons learned

**Recovery process**:
```bash
# SSH to VPS
ssh openether@[VPS_IP]

# Restore from latest backup
cd /var/www
sudo tar -xzf /home/openether/backups/openether-site-[LATEST].tar.gz

# Verify restoration
curl -I https://openether.com
# Should return 200 OK
```

**Success criteria**:
- [ ] Website restored within 1 hour
- [ ] All pages functional
- [ ] No data loss
- [ ] Documentation updated with any gaps found

---

#### 2. Complete Technology Stack Review (3 hours)

**Framework review**:
- [ ] Is Astro still the best choice?
- [ ] Should we upgrade to latest version?
- [ ] Any new Astro features to leverage?
- [ ] Build time still acceptable?

**Hosting review**:
- [ ] Is current VPS adequate?
- [ ] Should we move to managed hosting?
- [ ] Cost optimization opportunities?
- [ ] Performance adequate?

**Tool review**:
- [ ] Formspree still meeting needs?
- [ ] Analytics tool providing value?
- [ ] Monitoring tools effective?
- [ ] Any better alternatives?

**Design review**:
- [ ] Design still modern and fresh?
- [ ] Brand alignment still strong?
- [ ] User experience optimal?
- [ ] Mobile experience excellent?

**Decision points**:
- [ ] Plan major upgrade (if needed)
- [ ] Budget for next year hosting
- [ ] Research new tools
- [ ] Consider redesign

---

#### 3. Full Security Audit (2 hours)

**Penetration testing**:
- [ ] Run automated security scanner (e.g., OWASP ZAP)
- [ ] Check for XSS vulnerabilities
- [ ] Check for CSRF vulnerabilities
- [ ] Verify CSP headers effective

**Access review**:
- [ ] Who has SSH access? (should be only you)
- [ ] Review authorized_keys file
- [ ] Change passwords (every 6-12 months)
- [ ] Review cloud provider access

**Compliance check**:
- [ ] Privacy policy up to date
- [ ] GDPR compliance (if applicable)
- [ ] Cookie consent (if using analytics)
- [ ] Terms of service current

**Report**:
- Document any vulnerabilities found
- Create remediation plan
- Schedule fixes

---

#### 4. Backup Strategy Review (2 hours)

**Current backup audit**:
- [ ] Are backups running? (check cron logs)
- [ ] Are backups stored off-site?
- [ ] What's the retention policy?
- [ ] When was last successful restore tested?
- [ ] Are backups encrypted?

**Improvements**:
- [ ] Set up off-site backup to S3/Glacier
- [ ] Implement 3-2-1 backup rule
- [ ] Test backup encryption
- [ ] Document restore procedures

**Implementation**:
```bash
# Example: Backup to S3 (requires aws cli setup)
#!/bin/bash
# /home/openether/backup-to-s3.sh
cd /home/openether/backups
aws s3 cp openether-site-$(date +%Y%m%d).tar.gz s3://your-bucket/backups/
```

---

## Troubleshooting

### Issue: Website Down

**Diagnosis steps**:
1. Check uptime monitoring alert (when did it go down?)
2. Try to load website (what error?)
3. SSH to VPS: `ssh openether@[VPS_IP]`
4. Check Nginx: `sudo systemctl status nginx`
5. Check disk space: `df -h`
6. Check logs: `sudo tail -f /var/log/nginx/error.log`

**Common causes**:
- Nginx crashed: `sudo systemctl restart nginx`
- Disk full: Clean old logs/backups
- SSL expired: `sudo certbot renew`
- DNS issue: Check DNS propagation

---

### Issue: SSL Certificate Expired

**Immediate action**:
```bash
# SSH to VPS
ssh openether@[VPS_IP]

# Force renewal
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

**Investigation**:
```bash
# Check why auto-renewal failed
sudo journalctl -u certbot.service | tail -50

# Common issues:
# - DNS not pointing to server
# - Port 80 blocked
# - Certbot not running
```

---

### Issue: Contact Form Not Working

**Diagnosis**:
1. Test form submission
2. Check Formspree dashboard
3. Check spam folder in email
4. Check browser console for errors
5. Verify form ID in contact.astro

**Common fixes**:
- Update Formspree ID if changed
- Verify email address in Formspree settings
- Check spam filters
- Test with different email

---

### Issue: Poor Performance

**Diagnosis**:
```bash
# Run Lighthouse test
# Check scores for:
# - Performance (should be > 90)
# - LCP (should be < 2.5s)
# - CLS (should be < 0.1)
```

**Common fixes**:
- Optimize images (compress, use WebP)
- Reduce large dependencies
- Check for unused CSS/JS
- Review new blog post images

---

### Issue: Security Breach Suspicion

**Immediate actions**:
1. Change all passwords immediately
2. Review logs for unusual access
3. Check for modified files
4. Scan for malware
5. Notify relevant parties

**Forensics**:
```bash
# Check last logins
sudo last -f /var/log/wtmp

# Check modified files (last 7 days)
sudo find /var/www -type f -mtime -7 -ls

# Check Nginx access logs for suspicious requests
sudo grep -E "(union|select|script)" /var/log/nginx/access.log
```

---

## Sign-Off

**Monthly Maintenance Completed**:
- Date: _________________
- Performed by: _________________
- Issues found: _________________
- Actions taken: _________________
- Next major maintenance: _________________

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-20
