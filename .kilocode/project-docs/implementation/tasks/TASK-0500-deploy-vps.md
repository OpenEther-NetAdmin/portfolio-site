# TASK-0500: Deploy to VPS

**Phase**: 5 - Deployment  
**Status**: In Progress  
**Priority**: Critical  
**Estimated Effort**: 3-4 hours

---

## Description

Build and deploy the static site to your VPS with Nginx and SSL.

---

## Acceptance Criteria

- [ ] Production build completes without errors
- [ ] Nginx configured for static site
- [ ] Domain DNS points to VPS
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Site accessible via HTTPS
- [ ] All pages load correctly

---

## Steps

### 5.1 Build Production Site
```bash
# Build the Astro site
npm run build

# Output will be in dist/ directory
```

### 5.2 Configure Nginx

Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

Create config: `/etc/nginx/sites-available/openether`

```nginx
server {
    listen 80;
    server_name openether.com www.openether.com;
    
    root /var/www/openether;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/openether /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3 Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d openether.com -d www.openether.com

# Follow prompts (email, redirect HTTP to HTTPS)
```

### 5.4 Deploy Site Files

Option A: Manual upload
```bash
# Copy build files to server
scp -r dist/* user@vps:/var/www/openether/
```

Option B: Git deploy
```bash
# On VPS
git clone your-repo.git
cd your-repo
npm run build
sudo cp -r dist/* /var/www/openether/
```

### 5.5 Verify Deployment

- [ ] Visit https://openether.com
- [ ] Check all pages load
- [ ] Test contact form
- [ ] Verify SSL certificate

---

## Dependencies

- All previous tasks completed
- VPS access credentials
- Domain registered and DNS configured

---

## Notes

- Replace `openether.com` with your actual domain
- Keep SSL certificate auto-renewal enabled
- Consider setting up a deployment script for future updates
