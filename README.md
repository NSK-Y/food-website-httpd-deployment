# 🍽️ Food Website: Apache HTTPD Deployment on AWS EC2

A responsive food-ordering website deployed on an AWS EC2 Ubuntu server with Apache HTTPD.

Deployment workflow:

```text
Local Development → GitHub → EC2 → Apache HTTPD → Public Website
```

---

## 📌 Project Overview

This project contains the **NSK Kitchen / Spice Route Kitchen** frontend website.

Users can:

* Browse and search food items
* Add items to a cart
* View cart totals
* Enter delivery details
* Select payment options
* Place orders
* Generate order confirmations
* Send orders through WhatsApp

The website is hosted on an AWS EC2 instance using Apache HTTPD.

---

## 🏗️ Architecture

```text
                    👨‍💻 Developer
                         |
                         ▼
                  Local Food Website
                         |
                         | git push
                         ▼
                    ┌─────────┐
                    │ GitHub  │
                    └─────────┘
                         |
                         | git clone
                         ▼
                ┌─────────────────┐
                │   AWS EC2       │
                │ Ubuntu Server   │
                └─────────────────┘
                         |
                         ▼
                 Apache HTTPD :80
                         |
                         ▼
                  /var/www/html/
                         |
                         ▼
                  ┌─────────────┐
                  │ Food Website│
                  └─────────────┘
                         |
                         ▼
                      Browser
```

---

# 📁 Project Structure

```text
food-website-httpd-deployment/
│
├── index.html          # Main website page
├── style.css           # Website styling
├── app.js              # Website functionality
├── .htaccess           # Apache configuration
├── README.md           # Project documentation
│
└── .git/               # Git repository metadata
```

---

# 🛠️ Technologies Used

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| HTML5        | Website structure       |
| CSS3         | Website styling         |
| JavaScript   | Website functionality   |
| Git          | Version control         |
| GitHub       | Source-code repository  |
| AWS EC2      | Cloud server            |
| Ubuntu       | Server operating system |
| Apache HTTPD | Web server              |
| Linux        | Server management       |

---

# 🚀 Deployment Process

## Step 1 — Create the Project

The website includes these primary files:

```text
index.html
style.css
app.js
.htaccess
```

The main entry point is:

```text
index.html
```

---

## Step 2 — Initialize Git

Open a terminal in the project directory:

```bash
cd foodsite
```

Initialize Git:

```bash
git init
```

Check the repository status:

```bash
git status
```

---

## Step 3 — Add Project Files

Stage all project files:

```bash
git add .
```

Verify the staged files:

```bash
git status
```

Expected files include:

```text
.htaccess
app.js
index.html
style.css
README.md
```

---

## Step 4 — Commit the Project

Create the initial commit:

```bash
git commit -m "Add foodsite application files"
```

---

## Step 5 — Push the Project to GitHub

GitHub repository:

**NSK-Y/food-website-httpd-deployment**

Add the remote repository:

```bash
git remote add origin https://github.com/NSK-Y/food-website-httpd-deployment.git
```

Set the main branch:

```bash
git branch -M main
```

Push the project:

```bash
git push -u origin main
```

---

## Step 6 — Launch an AWS EC2 Instance

Create an Ubuntu EC2 instance with the following basic configuration:

```text
Operating System: Ubuntu
Architecture: 64-bit
Instance: Free-tier eligible instance where available
```

Configure the Security Group to allow SSH access.

### Required SSH rule

```text
Type: SSH
Protocol: TCP
Port: 22
Source: Your IP
```

---

## Step 7 — Connect to EC2

From Windows PowerShell or another terminal:

```bash
ssh -i "path/to/your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

Example:

```bash
ssh -i "D:\keys\mykey.pem" ubuntu@3.107.38.204
```

After a successful login, the prompt should resemble:

```text
ubuntu@ip-172-31-33-61:~$
```

---

## Step 8 — Install Git

Check whether Git is installed:

```bash
git --version
```

If Git is not installed:

```bash
sudo apt update
sudo apt install git -y
```

---

## Step 9 — Clone the GitHub Repository

Clone the project:

```bash
git clone https://github.com/NSK-Y/food-website-httpd-deployment.git
```

Enter the project directory:

```bash
cd food-website-httpd-deployment
```

List the files:

```bash
ls
```

Expected output:

```text
README.md
app.js
index.html
style.css
.htaccess
```

---

## Step 10 — Install Apache HTTPD

On Ubuntu, Apache HTTPD is provided by the `apache2` package.

Update package information:

```bash
sudo apt update
```

Install Apache:

```bash
sudo apt install apache2 -y
```

Check the Apache service:

```bash
sudo systemctl status apache2
```

Apache should eventually show:

```text
Active: active (running)
```

---

## ⚠️ Step 11 — Resolve Port 80 Conflicts

Apache may fail to start if another web server is already using port 80.

Check which process is listening on port 80:

```bash
sudo ss -ltnp | grep ':80'
```

If the output contains:

```text
users:(("nginx",...))
```

Nginx is using port 80. Apache also normally uses port 80, so both services cannot bind to the port simultaneously.

---

## Step 12 — Stop Nginx

If Nginx is not required, stop it:

```bash
sudo systemctl stop nginx
```

Prevent Nginx from starting automatically:

```bash
sudo systemctl disable nginx
```

---

## Step 13 — Start Apache

Start Apache:

```bash
sudo systemctl start apache2
```

Verify the service:

```bash
sudo systemctl status apache2
```

Expected output:

```text
Active: active (running)
```

---

## Step 14 — Verify Port 80

Check which service is listening on port 80:

```bash
sudo ss -ltnp | grep ':80'
```

The output should contain:

```text
apache2
```

Example:

```text
LISTEN ... *:80 ... users:(("apache2",...))
```

This confirms that Apache is accepting HTTP requests.

---

## Step 15 — Copy the Website to Apache

Ubuntu's default Apache web root is:

```text
/var/www/html/
```

Copy the project files:

```bash
sudo cp -r . /var/www/html/
```

Verify the copied files:

```bash
ls -la /var/www/html/
```

Expected files include:

```text
.htaccess
README.md
app.js
index.html
style.css
```

---

## Step 16 — Restart Apache

Restart Apache after copying the website:

```bash
sudo systemctl restart apache2
```

Check the service:

```bash
sudo systemctl status apache2
```

---

## Step 17 — Test the Website Locally

Test Apache from inside the EC2 instance:

```bash
curl http://localhost
```

If the website's HTML source appears, Apache is serving the site successfully.

Example:

```text
<!doctype html>
<html lang="en">
<head>
...
<title>Spice Route Kitchen – Order Food Online</title>
...
```

This confirms that Apache is serving:

```text
Apache → index.html
```

---

## 🔐 Step 18 — Configure the AWS Security Group

The EC2 Security Group must allow HTTP traffic.

Navigate to:

```text
AWS Console
   ↓
EC2
   ↓
Instances
   ↓
Your EC2 Instance
   ↓
Security
   ↓
Security Groups
   ↓
Inbound Rules
```

Add the following rule:

```text
Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0
```

This allows users to access the website over HTTP.

---

## 🌐 Step 19 — Access the Website

Find the EC2 instance's **Public IPv4 address**.

For this deployment:

```text
3.107.38.204
```

Open the following URL:

```text
http://3.107.38.204
```

The website should now be publicly accessible.

---

# 🔄 Complete Deployment Flow

```text
1. Create Website
       ↓
2. git init
       ↓
3. git add .
       ↓
4. git commit
       ↓
5. git push
       ↓
6. GitHub Repository
       ↓
7. Create EC2
       ↓
8. SSH into EC2
       ↓
9. Install Git
       ↓
10. git clone
       ↓
11. Install Apache
       ↓
12. Stop Nginx if it occupies port 80
       ↓
13. Start Apache
       ↓
14. Copy files to /var/www/html/
       ↓
15. Restart Apache
       ↓
16. Configure Security Group
       ↓
17. Open EC2 Public IP
       ↓
18. Website Live 🚀
```

---

# 🧪 Useful Commands

### Check Apache status

```bash
sudo systemctl status apache2
```

### Start Apache

```bash
sudo systemctl start apache2
```

### Stop Apache

```bash
sudo systemctl stop apache2
```

### Restart Apache

```bash
sudo systemctl restart apache2
```

### Enable Apache at boot

```bash
sudo systemctl enable apache2
```

### Check port 80

```bash
sudo ss -ltnp | grep ':80'
```

### Test the website locally

```bash
curl http://localhost
```

### Check Apache configuration

```bash
sudo apache2ctl configtest
```

Expected output:

```text
Syntax OK
```

### View Apache access logs

```bash
sudo tail -f /var/log/apache2/access.log
```

### View Apache error logs

```bash
sudo tail -f /var/log/apache2/error.log
```

---

# 🐛 Troubleshooting

## Apache Fails to Start

Check the service status:

```bash
sudo systemctl status apache2
```

Check port 80:

```bash
sudo ss -ltnp | grep ':80'
```

If Nginx is using port 80:

```bash
sudo systemctl stop nginx
sudo systemctl start apache2
```

---

## Website Does Not Open in the Browser

Check Apache:

```bash
sudo systemctl status apache2
```

Check port 80:

```bash
sudo ss -ltnp | grep ':80'
```

Test the website locally:

```bash
curl http://localhost
```

If localhost works but the public IP does not, verify that the AWS Security Group allows HTTP traffic on port `80`.

---

## Apache Shows the Default Page

Check the web root:

```bash
ls -la /var/www/html/
```

Confirm that this file exists:

```text
index.html
```

Copy the project files again if necessary:

```bash
sudo cp -r . /var/www/html/
```

Restart Apache:

```bash
sudo systemctl restart apache2
```

---

## Check Apache Logs

Access log:

```bash
sudo tail -f /var/log/apache2/access.log
```

Error log:

```bash
sudo tail -f /var/log/apache2/error.log
```

---

# 🔒 Security Notes

Do not commit sensitive information to GitHub.

Never upload:

```text
AWS access keys
Private SSH keys
Passwords
API keys
.env files containing secrets
Database credentials
```

Use environment variables or a secure secret-management solution for sensitive data.

---

# 📚 What This Project Demonstrates

This project demonstrates practical experience with:

* Linux server administration
* AWS EC2
* SSH
* Git
* GitHub
* Apache HTTPD
* Web-server configuration
* Port 80
* AWS Security Groups
* Linux systemd
* Basic troubleshooting
* HTTP deployment
* Application hosting

---

# 🎯 DevOps Concepts Practiced

### Version Control

```text
Git → GitHub
```

### Cloud

```text
AWS EC2
```

### Operating System

```text
Ubuntu Linux
```

### Web Server

```text
Apache HTTPD
```

### Networking

```text
HTTP
TCP
Port 80
Security Groups
Public IP
```

### Troubleshooting

```text
Port conflict
Nginx vs Apache
Apache service failure
Linux logs
```

---

# 🚀 Future Improvements

This project can be extended into a production-style DevOps project by adding:

* Docker containerization
* Docker Compose
* HTTPS with Let's Encrypt
* A domain name
* Nginx reverse proxy
* CI/CD with GitHub Actions
* Terraform infrastructure
* Ansible configuration management
* AWS Application Load Balancer
* AWS Route 53
* CloudWatch monitoring
* Automated deployment
* Blue-green deployment
* Security scanning

---

# 👨‍💻 Author

**Naveen Sri Krishna Yarramsetty**

B.Tech Engineering Student | DevOps & Cloud Enthusiast

GitHub:

https://github.com/NSK-Y

---

# ⭐ Project

Repository:

https://github.com/NSK-Y/food-website-httpd-deployment

Live deployment:

http://3.107.38.204

---

## 📌 Key Learning

This project demonstrates how a website moves from source code to a publicly accessible cloud server:

```text
Developer
   ↓
Git
   ↓
GitHub
   ↓
AWS EC2
   ↓
Apache HTTPD
   ↓
Port 80
   ↓
Internet
   ↓
User Browser
```

This workflow provides a practical foundation for larger DevOps, cloud, and SRE deployments.
