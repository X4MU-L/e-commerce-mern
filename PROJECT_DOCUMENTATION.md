# MERN E-Commerce Application - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Data Models](#data-models)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [Features](#features)
10. [Application Flow](#application-flow)

---

## Project Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application that provides a complete online shopping experience with separate interfaces for customers and administrators.

### Key Capabilities

- **User Management**: Registration, login, OTP verification, password reset
- **Product Management**: Browse, search, filter products with categories and brands
- **Shopping Cart**: Add/remove items, update quantities
- **Wishlist**: Save favorite products
- **Order Management**: Place orders, track status, view history
- **Admin Dashboard**: Product CRUD operations, order management
- **Review System**: Customer product reviews and ratings
- **Address Management**: Multiple shipping addresses

---

## Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Middleware**:
  - CORS for cross-origin requests
  - Morgan for HTTP logging
  - Cookie-parser for cookie handling
- **Development**: Nodemon for hot reloading

### Frontend

- **Library**: React 18.2
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **UI Framework**: Material-UI (MUI) v5
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion, Lottie React
- **Notifications**: React Toastify
- **Build Tool**: Create React App

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  React App   │  │  Redux Store │      │
│  │              │◄─┤  Components  │◄─┤   (State)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                           │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │ Controllers  │  │  Middleware  │      │
│  │   Routes     │─►│   (Logic)    │  │  (Auth/CORS) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│                                                               │
│                      MongoDB Database                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Users │ │Products│ │Orders│ │Cart  │ │Reviews│ │Etc.  │    │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure

```
backend/
├── index.js                 # Application entry point
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment config
├── controllers/            # Business logic handlers
│   ├── Auth.js            # Authentication operations
│   ├── Product.js         # Product CRUD
│   ├── Order.js           # Order management
│   ├── Cart.js            # Shopping cart
│   ├── User.js            # User operations
│   ├── Address.js         # Address management
│   ├── Review.js          # Product reviews
│   ├── Wishlist.js        # Wishlist operations
│   ├── Brand.js           # Brand management
│   └── Category.js        # Category management
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Address.js
│   ├── Review.js
│   ├── Wishlist.js
│   ├── Brand.js
│   ├── Category.js
│   ├── OTP.js
│   └── PasswordResetToken.js
├── routes/                 # API route definitions
│   └── [corresponding route files]
├── middleware/             # Custom middleware
│   └── VerifyToken.js     # JWT authentication
├── utils/                  # Helper functions
│   ├── Emails.js          # Email sending
│   ├── GenerateOtp.js     # OTP generation
│   ├── GenerateToken.js   # JWT creation
│   └── SanitizeUser.js    # Remove sensitive data
├── database/               # Database configuration
│   └── db.js              # MongoDB connection
└── seed/                   # Database seeding scripts
    └── [seed files]
```

### Server Configuration (index.js)

**Port**: 8000  
**Key Middleware**:

- CORS with credentials enabled
- JSON body parser
- Cookie parser
- Morgan logger

**API Routes**:

- `/auth` - Authentication (signup, login, OTP, password reset)
- `/users` - User profile operations
- `/products` - Product listings and details
- `/orders` - Order creation and tracking
- `/cart` - Shopping cart operations
- `/brands` - Brand data
- `/categories` - Category data
- `/address` - Address management
- `/reviews` - Product reviews
- `/wishlist` - Wishlist operations

### Database Connection

- Uses Mongoose to connect to MongoDB
- Connection URI from environment variable `MONGO_URI`
- Async connection with error handling

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.js           # Application entry point
│   ├── App.js             # Main app component with routing
│   ├── app/
│   │   └── store.js       # Redux store configuration
│   ├── config/
│   │   └── axios.js       # Axios instance with baseURL
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication
│   │   │   ├── AuthApi.jsx
│   │   │   ├── AuthSlice.jsx
│   │   │   └── components/
│   │   ├── products/      # Product management
│   │   │   ├── ProductApi.jsx
│   │   │   ├── ProductSlice.jsx
│   │   │   └── components/
│   │   ├── cart/          # Shopping cart
│   │   ├── order/         # Orders
│   │   ├── address/       # Addresses
│   │   ├── review/        # Reviews
│   │   ├── wishlist/      # Wishlist
│   │   ├── user/          # User profile
│   │   ├── brands/        # Brands
│   │   ├── categories/    # Categories
│   │   ├── admin/         # Admin features
│   │   ├── checkout/      # Checkout process
│   │   ├── navigation/    # Navigation components
│   │   └── footer/        # Footer components
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderSuccessPage.jsx
│   │   ├── UserOrdersPage.jsx
│   │   ├── UserProfilePage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── OtpVerificationPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AdminOrdersPage.jsx
│   │   ├── AddProductPage.jsx
│   │   ├── ProductUpdatePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth/       # Authentication hooks
│   ├── assets/            # Images and animations
│   │   ├── images/
│   │   └── animations/    # Lottie animations
│   ├── constants/         # Application constants
│   ├── theme/             # MUI theme configuration
│   └── layout/            # Layout components
```

### State Management (Redux)

The application uses Redux Toolkit with the following slices:

1. **AuthSlice** - User authentication state
2. **ProductSlice** - Product listings and details
3. **CartSlice** - Shopping cart state
4. **OrderSlice** - Order management
5. **UserSlice** - User profile data
6. **AddressSlice** - User addresses
7. **ReviewSlice** - Product reviews
8. **WishlistSlice** - User wishlist
9. **BrandSlice** - Brand data
10. **CategoriesSlice** - Category data

### Routing Strategy

**Role-Based Routing**:

- Checks authentication status before rendering
- Separates admin and user routes
- Protected routes using `<Protected>` component
- Redirects based on user role (admin vs customer)

**Public Routes**:

- `/signup` - User registration
- `/login` - User login
- `/verify-otp` - OTP verification
- `/forgot-password` - Password recovery
- `/reset-password/:userId/:token` - Password reset

**User Routes** (Protected):

- `/` - Home page with products
- `/product-details/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/order-success/:id` - Order confirmation
- `/orders` - Order history
- `/profile` - User profile
- `/wishlist` - Saved products

**Admin Routes** (Protected):

- `/admin/dashboard` - Product management
- `/admin/add-product` - Add new product
- `/admin/product-update/:id` - Edit product
- `/admin/orders` - Order management

---

## Data Models

### User Model

```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  isVerified: Boolean (default: false),
  isAdmin: Boolean (default: false)
}
```

### Product Model

```javascript
{
  title: String (required),
  description: String (required),
  price: Number (required),
  discountPercentage: Number (default: 0),
  category: ObjectId -> Category (required),
  brand: ObjectId -> Brand (required),
  stockQuantity: Number (required),
  thumbnail: String (required),
  images: [String] (required),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  user: ObjectId -> User (required),
  item: [Mixed] (required) - order items,
  address: [Mixed] (required) - shipping address,
  status: String (enum: ['Pending', 'Dispatched', 'Out for delivery', 'Cancelled']),
  paymentMode: String (enum: ['COD', 'UPI', 'CARD'], required),
  total: Number (required),
  createdAt: Date (default: now)
}
```

### Cart Model

Similar structure linking user to products with quantities

### Review Model

Links users to products with ratings and comments

### Wishlist Model

Links users to favorite products

### Address Model

Stores multiple shipping addresses per user

### Brand & Category Models

Reference data for product organization

### OTP Model

Temporary storage for email verification codes

### PasswordResetToken Model

Temporary tokens for password reset flow

---

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - Verify email OTP
- `POST /auth/resend-otp` - Resend verification OTP
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/check` - Check authentication status
- `GET /auth/logout` - User logout

### Products (`/products`)

- `GET /products` - Get products (with filters, pagination)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)
- `DELETE /products/:id` - Soft delete product (admin)

### Orders (`/orders`)

- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status (admin)
- `GET /orders/all` - Get all orders (admin)

### Cart (`/cart`)

- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PATCH /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove cart item

### Wishlist (`/wishlist`)

- `GET /wishlist` - Get user wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:id` - Remove from wishlist

### Reviews (`/reviews`)

- `GET /reviews/:productId` - Get product reviews
- `POST /reviews` - Create review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Address (`/address`)

- `GET /address` - Get user addresses
- `POST /address` - Add new address
- `PATCH /address/:id` - Update address
- `DELETE /address/:id` - Delete address

### Users (`/users`)

- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile

### Brands (`/brands`)

- `GET /brands` - Get all brands

### Categories (`/categories`)

- `GET /categories` - Get all categories

---

## Authentication & Authorization

### JWT-Based Authentication

**Flow**:

1. User registers/logs in
2. Server generates JWT token
3. Token stored in HTTP-only cookie (secure, sameSite)
4. Client sends cookie with each request
5. Middleware verifies token on protected routes

**Security Features**:

- Password hashing with bcrypt (10 salt rounds)
- HTTP-only cookies prevent XSS attacks
- Token expiration configured via environment variable
- Secure flag enabled in production
- SameSite policy for CSRF protection

**Middleware** (`VerifyToken.js`):

- Extracts token from cookies
- Verifies signature using secret key
- Decodes user information
- Attaches user to request object
- Handles token expiration and invalid tokens

**User Sanitization**:

- Removes sensitive fields (password) before sending responses
- Only sends necessary user information in tokens

### Email Verification (OTP)

- Generated OTP on signup
- Sent via Nodemailer
- Stored in database with expiration
- Required before full account access

### Password Reset

1. User requests reset via email
2. Token generated and emailed
3. Token validates reset link
4. New password hashed and updated

---

## Features

### Customer Features

**1. User Registration & Authentication**

- Email/password signup
- OTP verification via email
- Login with credentials
- Password reset flow
- Session management

**2. Product Browsing**

- View all products with pagination
- Filter by category and brand
- Search functionality
- Product details page with images
- View product reviews and ratings

**3. Shopping Cart**

- Add products to cart
- Update quantities
- Remove items
- Cart persistence
- Real-time price calculations

**4. Wishlist**

- Save favorite products
- Easy cart addition from wishlist
- Remove items

**5. Checkout Process**

- Select shipping address
- Multiple address support
- Choose payment method (COD/UPI/CARD)
- Order review before submission

**6. Order Management**

- Place orders
- View order history
- Track order status
- Order details with items and pricing

**7. User Profile**

- Update personal information
- Manage shipping addresses
- View account details

**8. Product Reviews**

- Rate and review purchased products
- View reviews from other customers
- Edit/delete own reviews

### Admin Features

**1. Product Management**

- Add new products with images
- Edit existing products
- Soft delete products (mark as deleted)
- Restore deleted products
- Manage stock quantities

**2. Order Management**

- View all customer orders
- Update order status (Pending → Dispatched → Out for delivery)
- Mark orders as cancelled
- Order filtering and search

**3. Dashboard**

- Product overview
- Order statistics
- Quick actions

---

## Application Flow

### User Registration Flow

```
1. User fills signup form
2. Frontend validates input
3. POST /auth/signup
4. Backend creates user (password hashed)
5. JWT generated and sent in cookie
6. OTP generated and emailed
7. User redirected to OTP verification page
8. User enters OTP
9. POST /auth/verify-otp
10. Account marked as verified
11. User gains full access
```

### Shopping Flow

```
1. Browse products on homepage
2. Apply filters (category, brand, price)
3. Click product for details
4. Add to cart or wishlist
5. View cart
6. Proceed to checkout
7. Select/add shipping address
8. Choose payment method
9. Review order summary
10. Place order
11. POST /orders creates order
12. Redirect to success page
13. Email confirmation sent
```

### Admin Product Management

```
1. Admin logs in
2. Redirected to admin dashboard
3. View all products (including deleted)
4. Click "Add Product" or edit existing
5. Fill product form (title, description, price, etc.)
6. Upload images
7. Submit form
8. POST /products or PATCH /products/:id
9. Product saved to database
10. Dashboard updated with new product
```

### Order Processing (Admin)

```
1. Admin views orders page
2. Filter orders by status
3. Select order to update
4. Change status (Pending → Dispatched → Out for delivery)
5. PATCH /orders/:id
6. Customer notified of status change
7. Order list updates
```

### Authentication Check Flow

```
1. App loads
2. useAuthCheck hook runs
3. GET /auth/check
4. Backend verifies JWT from cookie
5. Returns user data if valid
6. Frontend updates Redux state
7. Routes render based on auth state
8. Protected components accessible
```

---

## Environment Variables

### Backend (.env)

```
MONGO_URI=<MongoDB connection string>
SECRET_KEY=<JWT secret key>
COOKIE_EXPIRATION_DAYS=<number of days>
PRODUCTION=<true/false>
ORIGIN=<frontend URL for CORS>
EMAIL_USER=<email for nodemailer>
EMAIL_PASS=<email password>
```

### Frontend (.env)

```
REACT_APP_BASE_URL=<backend API URL>
```

---

## Build and Deployment

### Backend

- **Development**: `npm run dev` (uses nodemon)
- **Production**: `npm start` (uses node)
- **Seeding**: `npm run seed` (populates database)
- **Deployment**: Configured for Vercel (vercel.json)

### Frontend

- **Development**: `npm start` (port 3000)
- **Production Build**: `npm run build`
- **Testing**: `npm test`

---

## Key Dependencies

### Backend

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `nodemailer` - Email sending
- `cors` - CORS middleware
- `cookie-parser` - Cookie parsing
- `morgan` - HTTP logging
- `dotenv` - Environment variables

### Frontend

- `react` & `react-dom` - UI library
- `@reduxjs/toolkit` & `react-redux` - State management
- `react-router-dom` - Routing
- `@mui/material` - UI components
- `axios` - HTTP client
- `react-hook-form` - Form handling
- `react-toastify` - Notifications
- `framer-motion` - Animations
- `lottie-react` - Lottie animations

---

## Security Considerations

1. **Password Security**: Bcrypt hashing with salt rounds
2. **XSS Protection**: HTTP-only cookies
3. **CSRF Protection**: SameSite cookie policy
4. **Token Expiration**: Configurable JWT expiration
5. **Input Validation**: Form validation on client and server
6. **CORS Configuration**: Restricted to specified origin
7. **Secure Cookies**: Enabled in production
8. **Email Verification**: Required for account activation
9. **Password Reset**: Temporary tokens with expiration

---

## Future Enhancements (Potential)

1. Payment gateway integration (Stripe, PayPal)
2. Product image upload to cloud storage
3. Advanced search with Elasticsearch
4. Real-time notifications (WebSocket)
5. Analytics dashboard for admin
6. Inventory management system
7. Multi-language support
8. Mobile app (React Native)
9. Social media login (OAuth)
10. Customer support chat

---

_This documentation provides a comprehensive overview of the MERN E-commerce application architecture, features, and implementation details._
