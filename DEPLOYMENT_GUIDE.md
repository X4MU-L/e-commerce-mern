# Free Deployment Guide - Render & Vercel

## MERN E-Commerce Application

This guide shows you how to deploy your MERN app **completely free** by combining frontend and backend into a single deployment.

---

## 🎯 Deployment Strategy

Instead of 3 separate services (MongoDB, Backend, Frontend), we'll use:

1. **MongoDB Atlas** (Free 512MB cluster)
2. **Combined Backend + Frontend** (Backend serves built React app)
3. **Deploy on Render or Railway** (Free tier)

### How It Works

```
┌─────────────────────────────────────────┐
│         Free Hosting (Render)           │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │     Express Server (Node.js)       │ │
│  │                                    │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │  API Routes                  │ │ │
│  │  │  /auth, /products, /cart    │ │ │
│  │  └──────────────────────────────┘ │ │
│  │                                    │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │  Static Files (React Build)  │ │ │
│  │  │  Served at / route          │ │ │
│  │  └──────────────────────────────┘ │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │  MongoDB Atlas   │
    │  (Free Cluster)  │
    └──────────────────┘
```

---

## 📋 Prerequisites

1. GitHub account
2. MongoDB Atlas account (free)
3. Render or Railway account (free)
4. Gmail account (for sending emails)

---

## Step 1: Set Up MongoDB Atlas (FREE)

### 1.1 Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Choose **M0 (Free)** cluster

### 1.2 Create Cluster

1. Click **"Build a Database"**
2. Choose **FREE Shared** tier
3. Select **AWS** provider
4. Choose region closest to you (e.g., us-east-1)
5. Cluster Name: `mern-ecommerce`
6. Click **"Create"**

### 1.3 Configure Access

**Database User:**

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Authentication: **Password**
4. Username: `ecommerce-user`
5. Password: Generate secure password (save it!)
6. User Privileges: **Read and write to any database**
7. Click **"Add User"**

**Network Access:**

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Copy connection string:
   ```
   mongodb+srv://ecommerce-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at end:
   ```
   mongodb+srv://ecommerce-user:YourPassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

---

## Step 2: Prepare Your Code

### 2.1 Update Frontend Environment

Edit `frontend/.env.production`:

```env
# Will be your deployed URL (update after deployment)
REACT_APP_BASE_URL=https://your-app-name.onrender.com
```

Or for same-origin (recommended):

```env
# Empty or use relative paths (backend serves frontend)
REACT_APP_BASE_URL=
```

Update `frontend/src/config/axios.js`:

```javascript
import axios from "axios";

export const axiosi = axios.create({
  withCredentials: true,
  // In production, use same origin since backend serves frontend
  baseURL: process.env.REACT_APP_BASE_URL || "",
});
```

### 2.2 Update Backend Package.json

Edit `backend/package.json` to add build script:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "seed": "node seed/seed.js",
    "build": "cd ../frontend && npm install && npm run build"
  }
}
```

### 2.3 Create Root Package.json

Create `package.json` in root directory:

```json
{
  "name": "mern-ecommerce",
  "version": "1.0.0",
  "description": "MERN E-Commerce Application",
  "main": "backend/index.js",
  "scripts": {
    "start": "cd backend && npm start",
    "build": "cd backend && npm install && cd ../frontend && npm install && npm run build",
    "install-all": "cd backend && npm install && cd ../frontend && npm install",
    "seed": "cd backend && npm run seed"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 2.4 Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Prepare for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/mern-ecommerce.git
git branch -M main
git push -u origin main
```

---

## Option A: Deploy on Render (Recommended - FREE)

### Step 1: Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mern-ecommerce`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && cd backend && npm install && cd ../frontend && npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     cd backend && npm start
     ```
   - **Plan**: **Free**

### Step 3: Set Environment Variables

Click **"Environment"** and add:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://ecommerce-user:YourPassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
SECRET_KEY=your_super_secret_64_character_jwt_key_here_make_it_very_strong_and_random
COOKIE_EXPIRATION_DAYS=7
PRODUCTION=true
ORIGIN=https://your-app-name.onrender.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**Important:**

- Replace `ORIGIN` with your actual Render URL (shown after deployment)
- Generate strong `SECRET_KEY` (64+ characters):
  ```bash
  openssl rand -base64 48
  ```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for build (5-10 minutes)
3. Your app will be live at: `https://your-app-name.onrender.com`

### Step 5: Update ORIGIN

1. Copy your deployed URL
2. Update `ORIGIN` environment variable with actual URL
3. Render will auto-redeploy

### Step 6: Seed Database (Optional)

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# SSH into service
render ssh mern-ecommerce

# Run seed
cd backend && npm run seed
```

Or use MongoDB Compass to manually add data.

---

## Option B: Deploy on Railway (FREE)

### Step 1: Create Railway Account

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Choose **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Node.js

### Step 3: Configure

**Settings:**

- **Build Command**:
  ```bash
  npm install && cd backend && npm install && cd ../frontend && npm install && npm run build
  ```
- **Start Command**:
  ```bash
  cd backend && npm start
  ```
- **Root Directory**: `/`

**Environment Variables:**
Add same variables as Render (above)

### Step 4: Deploy

- Railway automatically deploys
- Get URL from dashboard
- Update `ORIGIN` variable

---

## Option C: Deploy on Vercel (Limitations)

⚠️ **Note**: Vercel is great for frontend but has **10-second timeout** for API routes on free tier. Not ideal for this app, but possible.

### Alternative: Split Deployment

1. Deploy **Backend** on Render (free)
2. Deploy **Frontend** on Vercel (free)
3. Update `REACT_APP_BASE_URL` to point to Render backend

---

## 🎯 Complete Deployment Checklist

### Pre-Deployment

- [ ] MongoDB Atlas cluster created and configured
- [ ] Connection string obtained and tested
- [ ] Strong SECRET_KEY generated (64+ characters)
- [ ] Gmail app password created
- [ ] Code pushed to GitHub
- [ ] `.env` files NOT committed (in .gitignore)

### Render/Railway Setup

- [ ] Account created and connected to GitHub
- [ ] Web service configured with correct commands
- [ ] All environment variables set
- [ ] `ORIGIN` matches deployed URL
- [ ] NODE_ENV=production set

### Post-Deployment

- [ ] App builds successfully (check logs)
- [ ] App accessible at deployed URL
- [ ] Test user registration (email sending)
- [ ] Test login functionality
- [ ] Test product browsing
- [ ] Test cart and checkout
- [ ] Seed database if needed

---

## 🔧 Troubleshooting

### Build Fails

**Error**: `npm install failed`

```bash
# Solution: Check build logs
# Common issues:
# 1. Node version mismatch - set in package.json:
"engines": {
  "node": "18.x"
}

# 2. Missing dependencies - ensure all packages in package.json
```

### App Crashes After Deploy

**Error**: `Application failed to respond`

```bash
# Check logs for:
# 1. MongoDB connection - verify MONGO_URI
# 2. Port binding - ensure using process.env.PORT
# 3. Environment variables - check all are set
```

### CORS Errors

**Error**: `CORS policy blocked`

```bash
# Solution: Update ORIGIN in environment variables
ORIGIN=https://your-actual-deployed-url.onrender.com

# For same-origin (recommended):
ORIGIN=https://your-app-name.onrender.com
```

### Email Not Sending

**Error**: `Authentication failed`

```bash
# Solution:
# 1. Enable 2FA on Gmail
# 2. Generate App Password at: https://myaccount.google.com/apppasswords
# 3. Use app password in EMAIL_PASS (not regular password)
```

### Database Connection Failed

**Error**: `MongooseServerSelectionError`

```bash
# Solution:
# 1. Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
# 2. Check connection string format
# 3. Ensure password doesn't have special characters (or URL encode)
```

### Frontend Not Loading

**Error**: `Cannot GET /`

```bash
# Solution: Verify build completed
# Check logs for "Building React frontend"
# Ensure frontend/build directory exists
# Verify NODE_ENV=production in environment
```

---

## 💰 Cost Breakdown

| Service            | Plan       | Cost           | Limits                      |
| ------------------ | ---------- | -------------- | --------------------------- |
| MongoDB Atlas      | M0 Shared  | **FREE**       | 512MB storage               |
| Render Web Service | Free       | **FREE**       | Spins down after inactivity |
| Railway            | Free Trial | **FREE**       | $5 credit/month             |
| Domain (Optional)  | -          | ~$12/year      | Custom domain               |
| **TOTAL**          |            | **$0-12/year** |                             |

**Render Free Tier:**

- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic SSL
- ⚠️ Spins down after 15 min inactivity (cold starts)
- ⚠️ Slower builds

**Tips to Reduce Cold Starts:**

1. Use [UptimeRobot](https://uptimerobot.com) (free) to ping every 5 minutes
2. Upgrade to Render Starter ($7/month) for always-on

---

## 🚀 Going Live - Final Steps

### 1. Custom Domain (Optional)

**On Render:**

1. Buy domain from Namecheap/GoDaddy
2. In Render: Settings → Custom Domain
3. Add CNAME record: `your-domain.com` → `your-app.onrender.com`

### 2. Enable HTTPS

- Automatic on Render (Let's Encrypt)
- Update ORIGIN to `https://` URL

### 3. Set Up Monitoring

- Use Render's built-in logs
- Set up error notifications
- Monitor uptime with UptimeRobot

### 4. Backup Database

```bash
# Setup automated backups in MongoDB Atlas
# Database → Backup → Enable Cloud Backup (Free tier: 2 snapshots)
```

### 5. Performance Optimization

- Enable gzip compression
- Set up CDN for static assets (Cloudflare free)
- Optimize images
- Add caching headers

---

## 📊 Monitoring Your Deployment

### Check App Health

```bash
# Test API endpoint
curl https://your-app-name.onrender.com/api

# Should return:
{"message":"API running"}
```

### View Logs

**Render:**

- Dashboard → Your Service → Logs

**Railway:**

- Dashboard → Your Project → Deployments → Logs

### Database Monitoring

- MongoDB Atlas → Metrics
- Check connections, queries, storage

---

## 🔄 Updates and Redeployment

### Automatic Deployment

1. Push to GitHub main branch
2. Render/Railway auto-deploys
3. Wait for build (5-10 min)

### Manual Deployment

**Render:**

- Dashboard → Manual Deploy → Deploy Latest Commit

**Railway:**

- Dashboard → Redeploy

### Rollback

**Render:**

- Dashboard → Events → Rollback to previous deploy

---

## 📝 Environment Variables Reference

### Required Variables

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce

# Security
SECRET_KEY=64-character-random-string
COOKIE_EXPIRATION_DAYS=7
PRODUCTION=true
NODE_ENV=production

# CORS
ORIGIN=https://your-app.onrender.com

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=gmail-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Optional Variables

```env
# Port (Render sets automatically)
PORT=8000

# Session
SESSION_SECRET=another-random-secret

# File Upload (if implementing)
CLOUDINARY_URL=cloudinary://...
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Homepage loads at `https://your-app.onrender.com`
- [ ] User can sign up (email received)
- [ ] User can verify OTP
- [ ] User can login
- [ ] Products display correctly
- [ ] Can add products to cart
- [ ] Can place orders
- [ ] Admin can login
- [ ] Admin can add/edit products
- [ ] All images load
- [ ] No console errors

---

## 🎉 Congratulations!

Your MERN e-commerce app is now live and accessible worldwide - **completely FREE**!

**Your URLs:**

- **App**: https://your-app-name.onrender.com
- **API**: https://your-app-name.onrender.com/api
- **Database**: MongoDB Atlas dashboard

**Next Steps:**

1. Share your app link
2. Gather user feedback
3. Implement analytics (Google Analytics free)
4. Plan premium features
5. Consider upgrading for better performance

---

## 💡 Pro Tips

1. **Keep Free Tier Active**: Ping your app every 5 minutes with UptimeRobot
2. **Optimize Images**: Compress before upload to save bandwidth
3. **Use CDN**: Cloudflare free tier for static assets
4. **Monitor Usage**: Check Render/MongoDB metrics regularly
5. **Backup Regularly**: Export MongoDB data weekly
6. **Security**: Rotate SECRET_KEY periodically
7. **Updates**: Keep dependencies updated (npm audit)

---

**Need Help?**

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)

**Happy Deploying! 🚀**
