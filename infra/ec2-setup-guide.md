# EC2 First-Time Setup Guide (Ubuntu)

> This guide covers upgrading the system, installing essential tools, configuring Nginx as a reverse proxy, and obtaining an HTTPS certificate with Certbot.

---

## Table of Contents

1. [Upgrade apt](#1-upgrade-apt)
2. [Install Git, Docker, Docker Compose, Nginx, Certbot, Make](#2-install-git-docker-docker-compose-nginx-certbot-make)
3. [Configure Nginx Reverse Proxy](#3-configure-nginx-reverse-proxy)
4. [Obtain HTTPS Certificate with Certbot](#4-obtain-https-certificate-with-certbot)

---

## 1. Upgrade apt

Connect to the EC2 instance via SSH, then run:

```bash
sudo apt update && sudo apt upgrade -y
```

> **Note:** If a prompt appears asking about kernel or service restarts, press Enter to confirm the default.

---

## 2. Install Git, Docker, Docker Compose, Nginx, Certbot, Make

### 2.1 Install Git

```bash
sudo apt install -y git
git --version
```

---

### 2.2 Install Docker

```bash
# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin

# Enable Docker and start on boot
sudo systemctl enable docker
sudo systemctl start docker

# Allow current user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

---

### 2.3 Install Docker Compose

```bash
# Install Docker Compose plugin (recommended)
sudo apt install -y docker-compose-plugin

# Verify
docker compose version
```

> If you need the standalone `docker-compose` command, also run:
>
> ```bash
> sudo apt install -y docker-compose
> ```

---

### 2.4 Install Nginx

```bash
sudo apt install -y nginx

# Enable and verify status
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

---

### 2.5 Install Certbot (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
certbot --version
```

---

### 2.6 Install Make

```bash
sudo apt install -y make

# Verify
make --version
```

> Make is used to run `Makefile` commands, which are commonly used to simplify repeated tasks like `make build`, `make deploy`, or `make up`.

---

## 3. Configure Nginx Reverse Proxy

### 3.1 Prepare EC2 Security Group

Before configuring Nginx, make sure the EC2 Security Group has the following ports open:

| Port | Protocol | Purpose |
| ---- | -------- | ------- |
| 22   | TCP      | SSH     |
| 80   | TCP      | HTTP    |
| 443  | TCP      | HTTPS   |

---

### 3.2 Create a Config File for Your Domain

To map `example.com` to an app running on port `3000`:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Paste the following content:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forward original headers to the app
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
    }
}
```

> **Replace the following with your own values:**
>
> - `example.com` -> your domain
> - `3000` -> the port your app is running on

---

### 3.3 Enable the Config

```bash
# Create a symlink in sites-enabled
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# Test the config syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### 3.4 (Optional) Multiple Domains and Ports

If you have multiple apps, create a separate config file for each domain:

```bash
# For api.example.com -> port 4000
sudo nano /etc/nginx/sites-available/api.example.com
```

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.example.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. Obtain HTTPS Certificate with Certbot

### 4.1 Prerequisites

Make sure that:

- The domain's A Record is pointing to the EC2 instance's IP address
- Nginx is running and the config is valid
- Ports 80 and 443 are open in the Security Group

Verify the domain resolves correctly:

```bash
curl -I http://example.com
```

---

### 4.2 Request a Certificate

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot will prompt for the following:

1. **Email address** — used for certificate expiry notifications
2. **Terms of Service** — press `A` to agree
3. **Share email with EFF** — press `Y` or `N` as preferred

Certbot will automatically update the Nginx config to enable HTTPS.

---

### 4.3 Verify the Result

On success, Certbot will display output similar to:

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/example.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/example.com/privkey.pem
This certificate expires on YYYY-MM-DD.
```

Test by visiting `https://example.com` in a browser.

---

### 4.4 Set Up Auto-Renewal

Let's Encrypt certificates are valid for **90 days**. Certbot automatically sets up a cron job for renewal. Test it with:

```bash
# Dry run to verify auto-renewal works
sudo certbot renew --dry-run
```

If there are no errors, auto-renewal is working correctly.

To view the renewal timer:

```bash
sudo systemctl status certbot.timer
```

---

### 4.5 Nginx Config After HTTPS

Certbot will update the config automatically. The result will look similar to this:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;  # redirect HTTP -> HTTPS
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Summary

```
1. sudo apt update && sudo apt upgrade -y
2. Install git, docker, docker compose, nginx, certbot
3. Create /etc/nginx/sites-available/<domain>  (reverse proxy config)
4. sudo ln -s ... sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
5. sudo certbot --nginx -d <domain> -d www.<domain>
6. sudo certbot renew --dry-run  (verify auto-renewal)
```

---

> **Tip:** After editing any Nginx config, always run `sudo nginx -t && sudo systemctl reload nginx` to apply the changes safely.
