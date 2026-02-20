# Production Deployment Runbook - OpenEther Consulting Website

**Version**: 1.0  
**Type**: VPS Deployment with Nginx  
**SSL Provider**: Let's Encrypt (Certbot)  
**Deployment Method**: Static files via SSH/FTP

---

## 1. Prerequisites

### Required Information
Collect these details before starting:

```
VPS Provider: ___________________
VPS IP Address: ___________________
VPS Username: ___________________
SSH Key Path: ~/.ssh/id_rsa

Domain Name: openether.com (example)
Domain Registrar: ___________________
Nameservers: ___________________

Email for SSL: your@email.com (Let's Encrypt requires valid email)
Formspree Form ID: ___________________ (from content finalization)
```

### Local Environment Setup
Ensure your local machine is ready:

```bash
# Verify Node.js version
node --version  # Should be >= 18.x

# Verify npm
npm --version   # Should be >= 9.x

# Verify build works locally
cd openether
npm install
npm run build

# Verify build output exists
ls -la dist/
# Should show: index.html, portfolio/, services/, contact/, blog/, assets/
```

### DNS Configuration (Do First)

**Time Required**: 5-30 minutes for propagation

1. **Point domain to VPS**:
   - Log into domain registrar
   - Create A record: `openether.com` → `[VPS_IP]`
   - Create CNAME: `www` → `openether.com`
   - Set TTL: 300 seconds (5 minutes)

2. **Test DNS propagation**:
   ```bash
   # Check if DNS updated
   dig openether.com +short
   # Should show your VPS IP

   # Check from different locations
   nslookup openether.com 8.8.8.8
   ```

3. **Wait for propagation**: Can take 5-30 minutes

---

## 2. VPS Initial Setup

### 2.1 SSH Key Setup (If not already configured)

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your@email.com"
# Save to: ~/.ssh/id_rsa

# Copy public key to VPS
ssh-copy-id username@[VPS_IP]
# Or manually add to ~/.ssh/authorized_keys on VPS
```

### 2.2 Initial Server Hardening

**Connect to VPS**:
```bash
ssh username@[VPS_IP]
```

**Update packages**:
```bash
sudo apt update
sudo apt upgrade -y
```

**Set timezone**:
```bash
sudo timedatectl set-timezone UTC  # or your preferred timezone
```

**Create deployment user** (recommended):
```bash
# Create user for website deployment
sudo adduser openether
# Set strong password

# Give sudo privileges
sudo usermod -aG sudo openether
```

**Disable password login (use SSH keys only)**:
```bash
sudo nano /etc/ssh/sshd_config

# Change:
PasswordAuthentication no
PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

**Configure firewall**:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 3. Nginx Installation & Configuration

### 3.1 Install Nginx

```bash
# Update package index
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Verify installation
sudo systemctl status nginx
# Should show: active (running)

# Enable auto-start
sudo systemctl enable nginx
```

### 3.2 Configure Nginx for Static Site

**Remove default site**:
```bash
sudo rm /etc/nginx/sites-enabled/default
```

**Create new configuration**:
```bash
sudo nano /etc/nginx/sites-available/openether
```

Add this configuration:
```nginx
# /etc/nginx/sites-available/openether

# HTTP (port 80) - redirects to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name openether.com www.openether.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS (port 443) - serves static site
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name openether.com www.openether.com;

    # SSL configuration managed by Certbot
    ssl_certificate /etc/letsencrypt/live/openether.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/openether.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Root directory for static files
    root /var/www/openether;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml
        application/x-font-ttf
        font/opentype
        font/woff
        font/woff2;

    # Caching static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location block
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Block access to hidden files
    location ~ /\. {
        deny all;
    }

    # Block access to backup files
    location ~ ~$ {
        deny all;
    }
}
```

**Enable the site**:
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/openether /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t
# Should show: syntax is ok, test is successful

# Reload Nginx (do this after SSL setup)
# sudo systemctl reload nginx
```

### 3.3 Create Web Root Directory

```bash
# Create directory for website files
sudo mkdir -p /var/www/openether

# Set ownership to deployment user
sudo chown -R openether:openether /var/www/openether

# Set appropriate permissions
sudo chmod -R 755 /var/www/openether
```

---

## 4. SSL Certificate Installation

### 4.1 Install Certbot

```bash
# Add certbot repository
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 Obtain SSL Certificate

**Important**: DNS must be pointing to your VPS IP before this step.

```bash
# Run certbot
sudo certbot --nginx -d openether.com -d www.openether.com

# Follow prompts:
# 1. Enter email address
# 2. Agree to terms
# 3. Choose whether to share email
# 4. Certbot will automatically configure SSL in Nginx
```

### 4.3 Verify SSL Configuration

```bash
# Check SSL certificate
sudo certbot certificates

# Should show:
# Certificate Name: openether.com
# Domains: openether.com www.openether.com
# Expiry Date: [90 days from now]
```

### 4.4 Test HTTPS

```bash
# Open in browser
# Should see padlock icon, no security warnings

# Test SSL grade
# Use: https://www.ssllabs.com/ssltest/
# Enter: openether.com
# Should be A or A+ grade
```

---

## 5. Deploy Website

### 5.1 Build Local Version

```bash
# On your local machine
cd openether

# Install dependencies
npm install

# Build for production
npm run build

# Verify build output
ls -lh dist/
```

### 5.2 Deploy to VPS

**Option A: Using rsync (Recommended)**

```bash
# From local machine, in openether directory
rsync -avz --delete dist/ openether@[VPS_IP]:/var/www/openether/

# Flags:
# -a: archive mode (preserves permissions)
# -v: verbose
# -z: compress
# --delete: remove files from server not in local build
```

**Option B: Using scp**

```bash
# From local machine, in openether directory
scp -r dist/* openether@[VPS_IP]:/var/www/openether/
```

**Option C: Using FTP/SFTP (with FileZilla)**

1. Connect to VPS via SFTP
2. Navigate to `/var/www/openether/`
3. Upload all files from local `dist/` folder
4. Ensure permissions are 644 for files, 755 for directories

### 5.3 Verify Deployment

**On VPS**:
```bash
# Check files are present
ls -la /var/www/openether/

# Should show: index.html, portfolio/, services/, contact/, blog/, assets/

# Set correct ownership
sudo chown -R openether:openether /var/www/openether

# Set correct permissions
find /var/www/openether -type f -exec chmod 644 {} \;
find /var/www/openether -type d -exec chmod 755 {} \;
```

**Restart Nginx**:
```bash
sudo systemctl reload nginx
```

**Test in browser**:
- Visit: https://openether.com
- Should load website
- Check: Padlock icon, no mixed content warnings

---

## 6. Post-Deployment Configuration

### 6.1 Test Contact Form

1. Visit: https://openether.com/contact
2. Fill out form with test data
3. Submit
4. Verify in Formspree dashboard
5. Verify email received

### 6.2 Verify All Pages Work

- [ ] https://openether.com/ (Home)
- [ ] https://openether.com/portfolio
- [ ] https://openether.com/services
- [ ] https://openether.com/contact
- [ ] https://openether.com/blog
- [ ] https://openether.com/blog/welcome-to-openether

### 6.3 Check Console for Errors

Open browser dev tools (F12) and check Console tab:
- [ ] No JavaScript errors
- [ ] No 404 errors
- [ ] No mixed content warnings

### 6.4 SSL Certificate Auto-Renewal

Test renewal process:
```bash
# Test dry-run (no actual renewal)
sudo certbot renew --dry-run

# Should succeed without errors
```

**Enable auto-renewal** (usually already enabled by Certbot):
```bash
# Check systemd timer
sudo systemctl list-timers | grep certbot

# Should show: certbot.timer
```

Certbot automatically runs twice daily to check for certificates expiring within 30 days.

---

## 7. Monitoring Setup

### 7.1 Uptime Monitoring

**Option A: UptimeRobot (Free)**
1. Sign up at https://uptimerobot.com/
2. Add new monitor:
   - Type: HTTPS
   - URL: https://openether.com
   - Monitoring interval: 5 minutes
3. Enable email alerts

**Option B: BetterUptime (Free tier)**
1. Sign up at https://betteruptime.com/
2. Add monitor for https://openether.com
3. Configure alerting

### 7.2 Error Tracking (Sentry)

```bash
# Install Sentry CLI
npm install -g @sentry/cli
```

**Create Sentry project**:
1. Sign up at https://sentry.io/
2. Create new project: Astro/JavaScript
3. Get DSN (Data Source Name)

**Add to site** (if using client-side JS):
1. Install browser SDK
2. Initialize with DSN
3. Test error reporting

For static Astro site, errors are minimal, but Sentry can still catch:
- JavaScript errors (if any)
- 404 errors (via Logrocket or similar)

### 7.3 Log Monitoring

**Check Nginx access logs**:
```bash
# Real-time log monitoring
sudo tail -f /var/log/nginx/access.log

# Check for errors
sudo tail -f /var/log/nginx/error.log
```

**Set up log rotation** (usually pre-configured):
```bash
# Check logrotate configuration
sudo nano /etc/logrotate.d/nginx

# Should show weekly rotation, 52 weeks retention
```

---

## 8. Backup Strategy

### 8.1 Website Files Backup

**Create backup script** (`/home/openether/backup-site.sh`):
```bash
#!/bin/bash

# Backup script for OpenEther website
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/openether/backups"
WEBSITE_ROOT="/var/www/openether"

# Create backup directory if doesn't exist
mkdir -p $BACKUP_DIR

# Create tarball of website files
tar -czf $BACKUP_DIR/openether-site-$DATE.tar.gz -C $WEBSITE_ROOT .

# Keep only last 30 backups
ls -t $BACKUP_DIR/openether-site-*.tar.gz | tail -n +31 | xargs -r rm

echo "Backup created: $BACKUP_DIR/openether-site-$DATE.tar.gz"
```

**Make executable**:
```bash
chmod +x /home/openether/backup-site.sh
```

**Test backup**:
```bash
./backup-site.sh
ls -lh /home/openether/backups/
```

**Schedule automatic backups** (daily at 2 AM):
```bash
# Edit crontab
crontab -e

# Add line:
0 2 * * * /home/openether/backup-site.sh >> /home/openether/backup.log 2>&1
```

### 8.2 Nginx Configuration Backup

```bash
# Backup Nginx config
cd /etc/nginx
sudo tar -czf /home/openether/backups/nginx-config-$(date +%Y%m%d).tar.gz sites-available/
```

### 8.3 SSL Certificate Backup

```bash
# Backup Let's Encrypt certs
sudo tar -czf /home/openether/backups/letsencrypt-$(date +%Y%m%d).tar.gz \
  /etc/letsencrypt/live/ /etc/letsencrypt/renewal/
```

---

## 9. Security Hardening

### 9.1 SSH Security

- [ ] Password authentication disabled
- [ ] Root login disabled
- [ ] Only your SSH key can login
- [ ] Firewall blocking everything except SSH (22) and HTTPS (443)

### 9.2 Nginx Security Headers

Verify in `/etc/nginx/sites-available/openether`:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### 9.3 File Permissions

```bash
# Set correct ownership
sudo chown -R openether:openether /var/www/openether

# Set secure permissions
find /var/www/openether -type f -exec chmod 644 {} \;
find /var/www/openether -type d -exec chmod 755 {} \;
```

### 9.4 Disable Directory Listing

Nginx configuration already prevents this:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 9.5 Hide Nginx Version

```bash
# Edit nginx.conf
sudo nano /etc/nginx/nginx.conf

# In http block, add:
http {
    server_tokens off;
    # ... other config
}

# Reload nginx
sudo systemctl reload nginx
```

---

## 10. Troubleshooting

### 10.1 Website Not Loading

**Check Nginx status**:
```bash
sudo systemctl status nginx
```

**Check config syntax**:
```bash
sudo nginx -t
```

**Check error logs**:
```bash
sudo tail -f /var/log/nginx/error.log
```

**Check if port 80/443 is open**:
```bash
sudo netstat -tulpn | grep -E '80|443'
```

### 10.2 SSL Certificate Issues

**Check certificate**:
```bash
sudo certbot certificates
```

**Manually renew**:
```bash
sudo certbot renew --force-renewal
```

**Check SSL Labs**:
- Visit: https://www.ssllabs.com/ssltest/
- Enter your domain

### 10.3 Permission Issues

**Fix ownership**:
```bash
sudo chown -R openether:openether /var/www/openether
```

**Fix permissions**:
```bash
sudo chmod -R 755 /var/www/openether
find /var/www/openether -type f -exec chmod 644 {} \;
```

### 10.4 Form Not Working

**Check Formspree configuration**:
- Verify form ID in contact.astro
- Check Formspree dashboard for submissions
- Verify email address in Formspree

**Check browser console**: Look for CORS or network errors

### 10.5 Mixed Content Warnings

**Check for HTTP resources on HTTPS**:
```bash
# In browser console, look for:
# "Mixed Content: The page was loaded over HTTPS,"

# Check your HTML for http:// links
# All resources should be https:// or protocol-relative
```

**Fix**: Update all links to https:// or relative paths.

---

## 11. Rollback Plan

### Quick Rollback (if issues detected)

**If you have backup**:
```bash
# On VPS
sudo systemctl stop nginx

cd /var/www
tar -xzf /home/openether/backups/openether-site-[DATE].tar.gz

# Restore to web root
cp -r openether/* /var/www/openether/

# Restart Nginx
sudo systemctl start nginx
```

**Emergency rollback**:
```bash
# Stop Nginx immediately
sudo systemctl stop nginx

# Start with error page
sudo nano /var/www/openether/index.html
# Add simple maintenance message

# Start Nginx
sudo systemctl start nginx
```

---

## 12. Post-Deployment Checklist

### Immediately After Deployment (0-5 minutes)
- [ ] Website loads at https://openether.com
- [ ] Home page displays correctly
- [ ] All navigation links work
- [ ] HTTPS padlock shows in browser
- [ ] No security warnings
- [ ] Console shows no errors

### Within 1 Hour
- [ ] Contact form tested and working
- [ ] All 6 pages load correctly
- [ ] Blog posts display properly
- [ ] Images load correctly
- [ ] SSL Labs test shows A or A+
- [ ] Mobile responsive verified

### Within 24 Hours
- [ ] Uptime monitoring active
- [ ] Log monitoring configured
- [ ] First backup created
- [ ] Certificate renewal tested
- [ ] Analytics tracking (if configured)
- [ ] No errors in Nginx logs

### Within 1 Week
- [ ] Daily backups running
- [ ] SSL renewal auto-tested
- [ ] Performance monitoring data collected
- [ ] User feedback reviewed
- [ ] Search engine indexing (check Google Search Console)

---

## 13. Next Steps After Launch

### Short Term (1-2 weeks)
- [ ] Monitor contact form submissions
- [ ] Track visitor analytics
- [ ] Collect performance data
- [ ] Review error logs daily
- [ ] Respond to any security alerts

### Medium Term (1 month)
- [ ] SSL certificate automatically renews
- [ ] Review backup integrity
- [ ] Update content if needed
- [ ] Monitor SEO rankings
- [ ] Check for broken links

### Long Term (Ongoing)
- [ ] Monthly security updates
- [ ] Quarterly performance review
- [ ] Bi-annual full backup restore test
- [ ] Annual SSL certificate review
- [ ] Keep dependencies updated

---

## Appendix A: Common Commands Reference

### Nginx
```bash
# Check status
sudo systemctl status nginx

# Start
sudo systemctl start nginx

# Stop
sudo systemctl stop nginx

# Restart
sudo systemctl restart nginx

# Reload configuration (less disruptive)
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Certbot (SSL)
```bash
# Check certificates
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### File Permissions
```bash
# Fix ownership
sudo chown -R openether:openether /var/www/openether

# Set directory permissions
find /var/www/openether -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/openether -type f -exec chmod 644 {} \;
```

### Logs
```bash
# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# System log
sudo tail -f /var/log/syslog
```

---

## Appendix B: Server Specifications

### Minimum Recommended
- **RAM**: 1 GB
- **Storage**: 20 GB SSD
- **Bandwidth**: 1 TB/month
- **OS**: Ubuntu 22.04 LTS

### Recommended for Production
- **RAM**: 2 GB
- **Storage**: 40 GB SSD
- **Bandwidth**: 2 TB/month
- **OS**: Ubuntu 22.04 LTS
- **Backups**: Automated daily

---

## Sign-Off

### Deployment Complete
**Date**: _________________  
**Deployed By**: _________________  
**VPS Provider**: _________________  
**Domain**: _________________

**Pre-Launch Checklist**:
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] Nginx configured and tested
- [ ] Website files deployed
- [ ] Contact form tested
- [ ] All pages verified
- [ ] Security headers configured
- [ ] Monitoring active
- [ ] Backup strategy in place

**Post-Launch Verification**:
- [ ] Website accessible via domain
- [ ] HTTPS working with valid certificate
- [ ] All functionality tested
- [ ] Performance acceptable
- [ ] Security scan passed

**Notes**: _________________

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-20  
**Next Review**: After deployment completion
