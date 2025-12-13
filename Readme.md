# LocalChefBazaar Backend API

This repository contains the backend server for **LocalChefBazaar**, an online platform that connects home cooks with customers seeking fresh, homemade meals.  
The backend is responsible for authentication, user management, meal handling, order processing, payments, and secure communication with the database.

---

## Project Overview

The LocalChefBazaar backend provides RESTful APIs that support:
- Secure user authentication and authorization
- Meal creation and management by home chefs
- Order placement and tracking
- Online payment processing
- Image uploads for meals
- Data persistence using MongoDB

The API is designed with scalability, security, and clean architecture in mind.

---

## Tech Stack

- **Node.js**
- **Express.js (v5)**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Stripe** for payment processing
- **Cloudinary** for image storage
- **Multer** for file uploads

---

## Base URL

- **Production:** https://your-backend-url-here.com/api/v1  
- **Development:** http://localhost:3000/api/v1  

*(Replace with your actual deployed backend URL)*

---

## Authentication

- JWT-based authentication system
- Token is sent via the `Authorization` header:

  Authorization: Bearer `<access_token>`

- Protected routes require a valid token
- Passwords are securely hashed using bcrypt

---

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=your_frontend_url

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
