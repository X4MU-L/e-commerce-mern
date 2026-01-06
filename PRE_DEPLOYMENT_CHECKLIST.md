# ✅ Pre-Deployment Checklist

Before deploying to Render, verify everything is configured correctly.

---

## 🔍 Code Configuration

### Backend Routes (backend/index.js)

- [ ] All routes have `/api/v1` prefix:

  ```javascript
  server.use("/api/v1/auth", authRoutes);
  server.use("/api/v1/products", productRoutes);
  server.use("/api/v1/cart", cartRoutes);
  // ... etc
  ```

- [ ] Production code serves React build:

  ```javascript
  if (process.env.NODE_ENV === "production") {
    const frontendBuildPath = path.join(__dirname, "../frontend/build");
    server.use(express.static(frontendBuildPath));
    server.get("*", (req, res) => {
      res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
  }
  ```

- [ ] Uses `process.env.PORT` for port:
  ```javascript
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, ...);
  ```

### Frontend Configuration (frontend/src/config/axios.js)

- [ ] Axios handles empty base URL:
  ```javascript
  export const axiosi = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_URL
      ? `${process.env.REACT_APP_BASE_URL}/api/v1`
      : "/api/v1",
  });
  ```

### Environment Files

- [ ] `frontend/.env.development` exists:

  ```env
  REACT_APP_BASE_URL=http://localhost:8000
  ```

- [ ] `frontend/.env.production` exists:

  ```env
  REACT_APP_BASE_URL=
  ```

- [ ] `backend/.env.example` exists (for reference)

- [ ] `.env` files are in `.gitignore`:
  ```
  .env
  .env.local
  .env.development.local
  .env.production.local
  ```

### Root package.json

- [ ] File exists with correct scripts:
  ```json
  {
    "name": "mern-ecommerce",
    "version": "1.0.0",
    "scripts": {
      "start": "cd backend && npm start",
      "build": "cd backend && npm install && cd ../frontend && npm install && npm run build"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  }
  ```

### .gitignore

- [ ] Contains:
  ```
  node_modules/
  .env
  .env.local
  npm-debug.log*
  .DS_Store
  build/
  ```

---

## 🗄️ Database Setup

### MongoDB Atlas

- [ ] Free M0 cluster created
- [ ] Database user created with password saved
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string obtained and tested:
  ```
  mongodb+srv://user:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
  ```

---

## 📧 Email Setup

### Gmail Configuration

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] App Password saved securely

---

## 🔐 Security

### Secrets Generated

- [ ] Strong SECRET_KEY generated (64+ characters):
  ```bash
  openssl rand -base64 48
  ```
- [ ] SECRET_KEY saved securely

---

## 💻 GitHub

### Repository

- [ ] Code committed to git:

  ```bash
  git status  # Should be clean or ready to commit
  ```

- [ ] Repository pushed to GitHub:

  ```bash
  git remote -v  # Should show GitHub URL
  ```

- [ ] Repository is Public (required for Render free tier)

- [ ] No sensitive data committed (.env files excluded)

---

## 🧪 Local Testing

### Docker Development

- [ ] `docker-compose up` works
- [ ] Frontend accessible at localhost:3000
- [ ] Backend accessible at localhost:8000
- [ ] Can signup/login
- [ ] Can browse products
- [ ] Can add to cart

### Production Build Test (Optional)

- [ ] Frontend builds successfully:

  ```bash
  cd frontend
  npm run build
  # Should create frontend/build/ folder
  ```

- [ ] Backend serves frontend build:
  ```bash
  export NODE_ENV=production
  cd backend
  npm start
  # Visit http://localhost:8000 (should show React app)
  ```

---

## 📋 Information Gathered

Before starting Render deployment, have these ready:

### MongoDB

- [ ] Connection String:
  ```
  mongodb+srv://...
  ```

### Email

- [ ] Email address: ******\_\_\_******
- [ ] App Password: ******\_\_\_******

### Secrets

- [ ] SECRET_KEY: ******\_\_\_******

### GitHub

- [ ] Repository URL: ******\_\_\_******
- [ ] Branch: main (or **\_**)

---

## 🚀 Ready to Deploy!

If all checkboxes are ✅, you're ready to deploy to Render!

Follow: [RENDER_DEPLOYMENT_STEPS.md](./RENDER_DEPLOYMENT_STEPS.md)

---

## 📚 Reference Documents

- **Deployment Steps:** [RENDER_DEPLOYMENT_STEPS.md](./RENDER_DEPLOYMENT_STEPS.md)
- **Routing Explained:** [ROUTING_EXPLAINED.md](./ROUTING_EXPLAINED.md)
- **Full Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Project Documentation:** [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

## ⚠️ Common Pre-Deployment Mistakes

Avoid these:

- ❌ Forgetting to add `/api/v1` prefix to routes
- ❌ Hardcoding port 8000 (use process.env.PORT)
- ❌ Not having production environment files
- ❌ Committing .env files to git
- ❌ Using weak SECRET_KEY
- ❌ Not whitelisting 0.0.0.0/0 in MongoDB Atlas
- ❌ Using regular Gmail password instead of App Password
- ❌ Repository is Private (free Render requires Public)

---

**Good luck with deployment! 🍀**
