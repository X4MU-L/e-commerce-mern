# 🗺️ Routing & Build Process Explained

## How Frontend Knows Backend URL

### Development (Docker) 🐳

```
┌─────────────────────────────────────────────────────────┐
│                    DEVELOPMENT MODE                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Browser (localhost:3000)                                │
│       │                                                   │
│       │ User visits: http://localhost:3000/cart         │
│       │                                                   │
│       ▼                                                   │
│  ┌──────────────────────────────────┐                   │
│  │  React Dev Server (Port 3000)    │                   │
│  │  - Serves React app              │                   │
│  │  - Hot Module Reload (HMR)       │                   │
│  └──────────────────────────────────┘                   │
│       │                                                   │
│       │ API Call: axios.get('/products')                │
│       │ Becomes: http://localhost:8000/api/v1/products  │
│       │ (because REACT_APP_BASE_URL=http://localhost:8000)│
│       │                                                   │
│       ▼                                                   │
│  ┌──────────────────────────────────┐                   │
│  │  Express Server (Port 8000)      │                   │
│  │  /api/v1/products → API handler  │                   │
│  │  Returns JSON                     │                   │
│  └──────────────────────────────────┘                   │
│       │                                                   │
│       ▼                                                   │
│  MongoDB (Port 27017)                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘

Environment Files:
frontend/.env.development:
  REACT_APP_BASE_URL=http://localhost:8000

backend/.env:
  ORIGIN=http://localhost:3000  (allows CORS from frontend)
```

### Production (Render) 🚀

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION MODE                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Browser (myapp.onrender.com)                           │
│       │                                                   │
│       │ User visits: https://myapp.onrender.com/cart    │
│       │                                                   │
│       ▼                                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Express Server (Port from Render)         │   │
│  │                                                    │   │
│  │  Request: /cart                                    │   │
│  │    ↓                                               │   │
│  │  Routes Check:                                     │   │
│  │    /api/v1/auth      → No match                   │   │
│  │    /api/v1/products  → No match                   │   │
│  │    *  (catch-all)    → ✅ MATCH                   │   │
│  │    ↓                                               │   │
│  │  Serve: /frontend/build/index.html                │   │
│  │    ↓                                               │   │
│  │  Browser receives HTML + JS bundle                │   │
│  │    ↓                                               │   │
│  │  React loads and React Router handles /cart       │   │
│  └──────────────────────────────────────────────────┘   │
│       │                                                   │
│       │ Later, React makes API call:                    │
│       │ axios.get('/products')                           │
│       │ Becomes: https://myapp.onrender.com/api/v1/products│
│       │ (because REACT_APP_BASE_URL="" → relative path) │
│       │                                                   │
│       ▼                                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Same Express Server                       │   │
│  │                                                    │   │
│  │  Request: /api/v1/products                        │   │
│  │    ↓                                               │   │
│  │  Routes Check:                                     │   │
│  │    /api/v1/products  → ✅ MATCH                   │   │
│  │    ↓                                               │   │
│  │  API handler executes                             │   │
│  │    ↓                                               │   │
│  │  Returns JSON                                      │   │
│  └──────────────────────────────────────────────────┘   │
│       │                                                   │
│       ▼                                                   │
│  MongoDB Atlas (cloud)                                   │
│                                                           │
└─────────────────────────────────────────────────────────┘

Environment Files:
frontend/.env.production:
  REACT_APP_BASE_URL=  (empty → relative paths)

Render Environment Variables:
  ORIGIN=https://myapp.onrender.com  (same origin → no CORS issues)
  NODE_ENV=production
```

---

## Build Process Step-by-Step

### What Happens During `npm run build`

```bash
# Command on Render:
npm install && cd backend && npm install && cd ../frontend && npm install && npm run build

# Step-by-step:
```

**Step 1: Install Root Dependencies**

```bash
npm install  # In root (if package.json exists)
```

**Step 2: Install Backend Dependencies**

```bash
cd backend
npm install
# Installs: express, mongoose, bcryptjs, etc.
# Creates: backend/node_modules/
```

**Step 3: Install Frontend Dependencies**

```bash
cd ../frontend
npm install
# Installs: react, redux, axios, etc.
# Creates: frontend/node_modules/
```

**Step 4: Build React App**

```bash
npm run build
# This runs: react-scripts build
```

What happens in `react-scripts build`:

```
1. Reads .env.production file
   ├─ Finds: REACT_APP_BASE_URL=
   └─ Stores in memory

2. Webpack processing:
   ├─ Scans all React files
   ├─ Finds: process.env.REACT_APP_BASE_URL
   ├─ Replaces with actual value: ""
   └─ Example in axios.js:
       Before: baseURL: process.env.REACT_APP_BASE_URL
       After:  baseURL: "" + "/api/v1" = "/api/v1"

3. Minification:
   ├─ Removes whitespace
   ├─ Shortens variable names
   ├─ Combines files
   └─ Creates: main.[hash].js

4. Creates build folder:
   frontend/build/
   ├── index.html          (entry point)
   ├── static/
   │   ├── css/
   │   │   └── main.[hash].css
   │   ├── js/
   │   │   ├── main.[hash].js    ← YOUR APP CODE (with baseURL="/api/v1")
   │   │   └── [hash].chunk.js
   │   └── media/
   │       └── [images, fonts]
   └── manifest.json

5. Output message:
   "The build folder is ready to be deployed."
```

**Step 5: Deploy**

```bash
cd backend
npm start
# Starts Express server
# Serves files from ../frontend/build
```

---

## How Express Serves React Build

### Backend index.js in Production

```javascript
// Production mode check
if (process.env.NODE_ENV === "production") {
  // Path to built React files
  const frontendBuildPath = path.join(__dirname, "../frontend/build");

  // Serve static files (CSS, JS, images)
  server.use(express.static(frontendBuildPath));
  // This makes files in /build available at root
  // Example: /build/static/css/main.123.css → /static/css/main.123.css

  // Catch-all route (MUST BE LAST)
  server.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
  // For ANY route not matched by API routes above,
  // send index.html and let React Router handle it
}
```

### Route Matching Order (Important!)

```javascript
// Express checks routes TOP to BOTTOM

// 1. API routes (defined BEFORE catch-all)
server.use("/api/v1/auth", authRoutes); // ← Matches /api/v1/auth/*
server.use("/api/v1/products", productRoutes); // ← Matches /api/v1/products/*
server.use("/api/v1/cart", cartRoutes); // ← Matches /api/v1/cart/*
// ... etc

// 2. Static files middleware
server.use(express.static(frontendBuildPath));
// ← Matches /static/*, /favicon.ico, etc.

// 3. Catch-all (defined LAST)
server.get("*", (req, res) => {
  // ← Matches EVERYTHING ELSE
  res.sendFile("frontend/build/index.html");
});
```

### Examples of Route Matching

| Request URL                | Matches         | Response   |
| -------------------------- | --------------- | ---------- |
| `/api/v1/products`         | API route       | JSON data  |
| `/api/v1/auth/login`       | API route       | JSON data  |
| `/static/css/main.123.css` | Static files    | CSS file   |
| `/static/js/main.456.js`   | Static files    | JS file    |
| `/`                        | Catch-all (`*`) | index.html |
| `/cart`                    | Catch-all (`*`) | index.html |
| `/product/123`             | Catch-all (`*`) | index.html |
| `/anything-else`           | Catch-all (`*`) | index.html |

---

## Environment Variable Baking

### How REACT*APP*\* Variables Work

React's Create React App **bakes** environment variables into the JavaScript bundle at **build time**, not runtime.

```javascript
// In your code (axios.js):
baseURL: process.env.REACT_APP_BASE_URL || '/api/v1'

// During BUILD (npm run build):
// ↓
// React reads .env.production:
REACT_APP_BASE_URL=

// ↓
// Webpack replaces process.env.REACT_APP_BASE_URL with the value:
baseURL: "" || '/api/v1'

// ↓
// JavaScript evaluates:
baseURL: '/api/v1'

// ↓
// This gets minified and written to main.[hash].js:
{baseURL:"/api/v1"}
```

**Important:** Once built, the value is **hardcoded** in the JS file. Changing the environment variable on Render won't affect it unless you rebuild.

### Why Leave REACT_APP_BASE_URL Empty in Production?

```javascript
// Development (.env.development):
REACT_APP_BASE_URL=http://localhost:8000
// Result: axios calls http://localhost:8000/api/v1/products
// ✅ Works because frontend (port 3000) ≠ backend (port 8000)

// Production (.env.production):
REACT_APP_BASE_URL=
// Result: axios calls /api/v1/products
// Browser resolves relative path to: https://myapp.onrender.com/api/v1/products
// ✅ Works because frontend AND backend on SAME URL
```

**Benefits of same-origin in production:**

- ✅ No CORS issues (same domain)
- ✅ Simpler configuration
- ✅ Better security (cookies work seamlessly)
- ✅ Easier to move between environments

---

## Complete Request Flow Example

### User Visits Homepage

```
1. User types: https://myapp.onrender.com
   ↓
2. Browser sends: GET /
   ↓
3. Express checks routes:
   /api/v1/auth      → No match
   /api/v1/products  → No match
   *  (catch-all)    → ✅ MATCH
   ↓
4. Express sends: frontend/build/index.html
   ↓
5. Browser receives HTML:
   <html>
     <head>
       <link href="/static/css/main.abc123.css" rel="stylesheet">
     </head>
     <body>
       <div id="root"></div>
       <script src="/static/js/main.def456.js"></script>
     </body>
   </html>
   ↓
6. Browser requests: /static/css/main.abc123.css
   Express serves from: frontend/build/static/css/main.abc123.css
   ↓
7. Browser requests: /static/js/main.def456.js
   Express serves from: frontend/build/static/js/main.def456.js
   ↓
8. JavaScript executes:
   - React app initializes
   - Redux store created
   - Router checks URL: /
   - HomePage component renders
   ↓
9. HomePage useEffect runs:
   - axios.get('/products')
   - Becomes: https://myapp.onrender.com/api/v1/products
   ↓
10. Browser sends: GET /api/v1/products
    ↓
11. Express checks routes:
    /api/v1/products  → ✅ MATCH
    ↓
12. Products controller executes:
    - Queries MongoDB
    - Returns JSON
    ↓
13. Browser receives JSON:
    [{"id": 1, "name": "Product 1"}, ...]
    ↓
14. React updates state → UI shows products
```

---

## Quick Reference

### Development URLs

```
Frontend: http://localhost:3000
Backend:  http://localhost:8000
MongoDB:  localhost:27017

API calls: http://localhost:3000 → http://localhost:8000/api/v1/*
```

### Production URLs

```
Everything: https://myapp.onrender.com

User routes:  /           → index.html → React Router
              /cart       → index.html → React Router
              /products   → index.html → React Router

API routes:   /api/v1/products  → Express handler → JSON
              /api/v1/auth      → Express handler → JSON

Static files: /static/css/*.css → Build files
              /static/js/*.js   → Build files
```

### Environment Files

**Development:**

```bash
frontend/.env.development:
  REACT_APP_BASE_URL=http://localhost:8000

backend/.env:
  ORIGIN=http://localhost:3000
  NODE_ENV=development
```

**Production:**

```bash
frontend/.env.production:
  REACT_APP_BASE_URL=

Render Environment Variables:
  ORIGIN=https://myapp.onrender.com
  NODE_ENV=production
```

---

Now you understand exactly how routing, builds, and environment variables work! 🎓
