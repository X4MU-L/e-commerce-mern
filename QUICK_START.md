# 🛍️ MERN E-Commerce Application - Quick Start Guide

A full-stack e-commerce platform built with MongoDB, Express.js, React, and Node.js.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Manual Setup (Without Docker)](#-manual-setup-without-docker)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Customer Features

- 🔐 User authentication (signup, login, OTP verification)
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 📦 Order placement and tracking
- ⭐ Product reviews and ratings
- 📍 Multiple shipping addresses
- 🔍 Product search and filtering
- 🏷️ Category and brand filtering

### Admin Features

- 📊 Admin dashboard
- ➕ Add/Edit/Delete products
- 📦 Order management
- 📈 Product inventory control

---

## 🔧 Prerequisites

### For Docker Setup (Recommended)

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (latest version)
- Git

### For Manual Setup

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v5.0 or higher)
- npm or yarn package manager

---

## 🚀 Quick Start with Docker

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mern-ecommerce
```

### 2. Set Up Environment Variables

**Backend** - Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update:

```env
MONGO_URI=mongodb://mongo:27017/ecommerce
SECRET_KEY=your_super_secret_jwt_key_min_32_chars
ORIGIN=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**Frontend** - Create `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

The default values should work for Docker setup:

```env
REACT_APP_BASE_URL=http://localhost:8000
```

### 3. Start All Services

```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 4. Seed the Database (Optional)

```bash
# Populate database with sample data
docker-compose exec backend npm run seed
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017

### 6. Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

---

## 🛠️ Manual Setup (Without Docker)

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <your-repository-url>
cd mern-ecommerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**

```bash
# Start MongoDB service
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services app
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Use in `MONGO_URI`

### 3. Configure Environment Variables

**Backend** - Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
SECRET_KEY=your_super_secret_jwt_key_min_32_chars
COOKIE_EXPIRATION_DAYS=7
PRODUCTION=false
ORIGIN=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**Frontend** - Create `frontend/.env`:

```env
REACT_APP_BASE_URL=http://localhost:8000
```

### 4. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend runs on http://localhost:8000

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Frontend runs on http://localhost:3000

### 5. Seed Database (Optional)

```bash
cd backend
npm run seed
```

---

## 📚 Documentation

Comprehensive documentation is available:

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Complete technical documentation

  - Architecture overview
  - Technology stack
  - Data models and API endpoints
  - Authentication flow
  - Feature descriptions

- **[DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md)** - Docker development guide
  - Docker architecture
  - Complete setup instructions
  - Development workflow
  - Troubleshooting guide
  - Production deployment

---

## 📁 Project Structure

```
mern-ecommerce/
├── backend/                    # Backend Node.js/Express application
│   ├── controllers/           # Request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Helper functions
│   ├── database/             # Database configuration
│   ├── seed/                 # Database seeding scripts
│   ├── index.js              # Entry point
│   ├── package.json          # Dependencies
│   ├── Dockerfile            # Docker configuration
│   └── .env                  # Environment variables (create from .env.example)
│
├── frontend/                  # Frontend React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── app/             # Redux store
│   │   ├── features/        # Feature modules (auth, products, cart, etc.)
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── assets/          # Images and animations
│   │   ├── config/          # Axios configuration
│   │   ├── theme/           # MUI theme
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── package.json         # Dependencies
│   ├── Dockerfile           # Docker configuration
│   └── .env                 # Environment variables (create from .env.example)
│
├── docker-compose.yml        # Docker Compose configuration
├── PROJECT_DOCUMENTATION.md  # Technical documentation
├── DOCKER_SETUP_GUIDE.md    # Docker setup guide
└── README.md                # This file
```

---

## 📜 Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test          # Run tests (if configured)
```

### Frontend Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test          # Run tests
npm run eject     # Eject from Create React App (one-way operation)
```

### Docker Scripts

```bash
docker-compose up                    # Start all services
docker-compose up -d                 # Start in detached mode
docker-compose up --build            # Rebuild and start
docker-compose down                  # Stop all services
docker-compose logs -f               # View logs
docker-compose exec backend sh       # Access backend shell
docker-compose exec backend npm run seed  # Seed database
```

---

## 🔐 Environment Variables

### Backend Variables

| Variable                 | Description                   | Example                           |
| ------------------------ | ----------------------------- | --------------------------------- |
| `MONGO_URI`              | MongoDB connection string     | `mongodb://mongo:27017/ecommerce` |
| `SECRET_KEY`             | JWT secret key (min 32 chars) | `your_secret_key_here`            |
| `COOKIE_EXPIRATION_DAYS` | Cookie expiry in days         | `7`                               |
| `PRODUCTION`             | Production mode flag          | `false`                           |
| `ORIGIN`                 | Frontend URL for CORS         | `http://localhost:3000`           |
| `EMAIL_USER`             | Email account for sending     | `your-email@gmail.com`            |
| `EMAIL_PASS`             | Email app password            | `your-app-password`               |
| `EMAIL_HOST`             | SMTP host                     | `smtp.gmail.com`                  |
| `EMAIL_PORT`             | SMTP port                     | `587`                             |

### Frontend Variables

| Variable             | Description     | Example                 |
| -------------------- | --------------- | ----------------------- |
| `REACT_APP_BASE_URL` | Backend API URL | `http://localhost:8000` |

### Email Configuration (Gmail)

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use the generated password in `EMAIL_PASS`

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000
```

### Main Endpoints

#### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/logout` - Logout user

#### Products

- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

#### Cart

- `GET /cart` - Get user cart
- `POST /cart` - Add to cart
- `PATCH /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove from cart

#### Orders

- `GET /orders` - Get user orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id` - Update order (admin)

#### Wishlist

- `GET /wishlist` - Get wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:id` - Remove from wishlist

#### Reviews

- `GET /reviews/:productId` - Get product reviews
- `POST /reviews` - Create review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

For complete API documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md#api-endpoints)

---

## 🧪 Testing the Application

### Default Test Users (After Seeding)

**Admin Account:**

- Email: admin@example.com
- Password: (set during seeding)

**Customer Account:**

- Email: customer@example.com
- Password: (set during seeding)

### Test Workflow

1. **Register/Login**: Create account or use test credentials
2. **Browse Products**: View products on homepage
3. **Add to Cart**: Select products and add to cart
4. **Checkout**: Proceed to checkout and place order
5. **Admin Panel**: Login as admin to manage products/orders

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3000 or 8000
lsof -i :3000
lsof -i :8000

# Kill the process or change port in docker-compose.yml
```

### Database Connection Failed

```bash
# Ensure MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongo

# Restart services
docker-compose down && docker-compose up
```

### Cannot Connect to Backend

```bash
# Verify backend is running
curl http://localhost:8000

# Check CORS settings in backend/.env
# Ensure ORIGIN=http://localhost:3000
```

For more troubleshooting, see [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md#troubleshooting)

---

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `SECRET_KEY` (64+ characters)
- [ ] Update `ORIGIN` to production frontend URL
- [ ] Set `PRODUCTION=true`
- [ ] Use production MongoDB (Atlas or VPS)
- [ ] Configure SSL/HTTPS
- [ ] Set up proper logging
- [ ] Enable monitoring
- [ ] Configure automated backups

### Deployment Options

1. **Vercel** (Frontend) + **Heroku/Railway** (Backend)
2. **AWS ECS** with Docker containers
3. **DigitalOcean App Platform**
4. **Google Cloud Run**
5. **Self-hosted VPS** with Docker

For detailed deployment instructions, see [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md#production-deployment)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues and questions:

- Check [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
- Check [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md)
- Open an issue on GitHub

---

## 🙏 Acknowledgments

- MongoDB for the database
- Express.js for the backend framework
- React for the frontend library
- Node.js for the runtime environment
- Material-UI for the UI components
- Redux Toolkit for state management

---

**Happy Coding! 🎉**
