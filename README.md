# 🛒 MERN E-Commerce Application

A fully-featured e-commerce app built with the *MERN stack* (MongoDB, Express.js, React, Node.js).  
It offers product browsing, advanced search and filters, cart management, secure Stripe payments, and an admin dashboard for managing products, categories, and orders.


## ✨ Features  

### ✅ User Features  
- 🔒 *Authentication & Security* – Register, log in, and manage profiles with *JWT-based authentication*.  
- 🛍 *Product Browsing* – Search, filter, and explore products effortlessly.  
- 🛒 *Shopping Cart* – Add and checkout items smoothly.  
- 💳 *Payments* – Integrated with *Stripe* for secure and reliable transactions.  
- 📦 *Orders* – Track order history and view delivery status.  

### ⚙ Admin Features  
- 🛠 *Product Management* – Add and remove products with ease.  
- 📂 *Category Management* – Organize products under categories for better navigation.  
- 📑 *Order Management* – View and update customer orders.  
 

---

## 🛠 Tech Stack  

- *MongoDB* – NoSQL database for scalable and flexible data storage.  
- *Express.js* – Lightweight backend framework for REST APIs and server logic.  
- *React.js* – Modern frontend library for building responsive and interactive UIs.  
- *Node.js* – Runtime environment for executing JavaScript on the server.  
- *Stripe* – Integrated payment gateway for secure transactions.  
- *JWT* – JSON Web Tokens for secure authentication and session handling.  

---

## 🚀 Getting Started

## ✅ Prerequisites

* **Node.js**
* **MongoDB Atlas** 
* **Cloudinary** 
* **Stripe** 

## ⚙ Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/Rishavkumar7892/mern-ecommerce
cd mern-ecommerce
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

#### Admin

```bash
cd admin
npm install
```

### 3. Environment Variables

**Backend**
- Create a `.env` file in the `backend` directory.
- Add the below variables with appropriate values:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Frontend**
- Create a `.env` file in the `frontend` directory
- Add the below variable:
```bash
VITE_BACKEND_URL="http://localhost:4000"
```

**Admin**
- Create a `.env` file in the `admin` directory
- Add the below variable:
```bash
VITE_BACKEND_URL="http://localhost:4000"
```

### 4. Run the application

   #### Backend

```bash
cd backend
npm start server
```

#### Frontend

```bash
cd frontend
npm run dev
```

#### Admin

```bash
cd admin
npm run dev
```