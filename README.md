# Spice Route Kitchen: static food ordering website

Plain HTML/CSS/JS. No build step and no backend, so Apache httpd can serve it as-is.

## Files
- `index.html`: page structure
- `style.css`: styling
- `app.js`: menu data, cart, checkout (edit `CONFIG` and `MENU` at the top)
- `.htaccess`: compression, caching, security headers

## Deploy on Ubuntu/Debian
```bash
sudo apt update && sudo apt install -y apache2
sudo cp -r ./* ./.htaccess /var/www/html/
sudo a2enmod deflate expires headers
sudo systemctl restart apache2
```

## Deploy on Amazon Linux / RHEL / CentOS
```bash
sudo dnf install -y httpd
sudo cp -r ./* ./.htaccess /var/www/html/
sudo systemctl enable --now httpd
```
Allow HTTP in your firewall / cloud security group (port 80, and 443 for HTTPS).

## .htaccess not working?
Make sure the site directory allows overrides:
```apache
<Directory /var/www/html>
    AllowOverride All
</Directory>
```

## Free HTTPS (once a domain points to your server)
```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d yourdomain.com
```

## How orders work
This is a front-end demo. Orders are saved in the visitor's browser (localStorage).
To actually receive orders, set `whatsappNumber` in `app.js` (a "Send order on WhatsApp"
button appears after checkout), or connect `placeOrder()` to a backend or form service
(for example a small Node/PHP endpoint behind httpd's `mod_proxy`).
