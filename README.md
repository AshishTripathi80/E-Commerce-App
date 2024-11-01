# E-Commerce Application

## Overview
This is a full-stack e-commerce application built using **Spring Boot** for the backend and **Angular** for the frontend. It offers users a complete shopping experience with features like product browsing, searching, reviews, and more.

## Features
### Backend (Spring Boot)
- **RESTful APIs** to manage product listings, user authentication, reviews, and shopping cart.
- **Product Management**: CRUD operations for product catalog.
- **User Authentication**: Secure user login and registration (JWT-based).
- **Shopping Cart**: Add, update, and remove items in the cart.
- **Product Reviews**: Users can post and view reviews on products.
- **Order Management**: Manage user orders and payment status.
- **Search Functionality**: Search products by category, price range, or name.

### Frontend (Angular)
- **Responsive Design**: User-friendly, mobile-compatible interface.
- **Product Catalog**: Display of all products with search and filtering options.
- **Product Reviews**: View and submit reviews for products.
- **User Authentication**: Login, registration, and profile management.
- **Shopping Cart & Checkout**: Manage cart, proceed to checkout, and place orders.
- **Order History**: View previous orders and their statuses.

## Tech Stack
- **Backend**: Spring Boot, Spring Security, JPA/Hibernate, MySQL
- **Frontend**: Angular, TypeScript, HTML, CSS, Bootstrap
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites
### Backend
- Java 11+
- Maven
- MySQL

### Frontend
- Node.js
- Angular CLI

## Installation

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/AshishTripathi80/E-Commerce-App
   ```
2. Navigate to the project directory:
   ```bash
   cd backend
   ```
3. Configure the MySQL database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
4. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend
1. Clone the repository:
   ```bash
   git clone https://github.com/AshishTripathi80/E-Commerce-App
   ```
2. Navigate to the project directory:
   ```bash
   cd frontend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Run the application:
   ```bash
   ng serve
   ```

## Usage
1. Open a browser and navigate to `http://localhost:4200/`.
2. Create an account or log in with existing credentials.
3. Browse products, add them to your cart, and proceed to checkout.
4. Users can also view their order history, leave product reviews, and manage their profiles.

## API Endpoints (Backend)
- **Products**: `/api/products`
  - GET: Fetch all products
  - POST: Add a new product
  - PUT: Update a product
  - DELETE: Remove a product
- **Users**: `/api/users`
  - POST: Register a new user
  - POST: User login
- **Orders**: `/api/orders`
  - GET: Fetch all orders for a user
  - POST: Place a new order
- **Reviews**: `/api/reviews`
  - GET: Fetch reviews for a product
  - POST: Add a new review
