# ⚙️ Shopify – A Full Stack MERN E-Commerce Web Application (Backend)

This is the backend server for Shopify E-Commerce Web Application built using Node.js, Express.js, and MongoDB.

---

## 🛠 Tech Stack:-

- Node.js

- Express.js

- MongoDB Atlas

- MongoDB Compass

- Mongoose

- JWT

- bcrypt

- Cloudinary (for image uploads)

- Nodemailer (optional)

- Multer

- Stripe

- CORS

- Dotenv

---

## 🔑 Environment Variables:-

**Create a `.env` file inside `server`:**

- PORT=5000
- MONGODB_URL=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- CLOUD_NAME=your_cloud_name
- CLOUD_API_KEY=your_api_key
- CLOUD_SECRET=your_secret_key
- PAYPAL_MODE=sandbox
- PAYPAL_CLIENT_ID=your_client_id
- PAYPAL_CLIENT_SECRET=your_secret_key
- PASS_KEY=your_pass_key
- PASS_MAIL=your_mail
- NODE_ENV=your_secret_key

---

## 🚀 Running the Server:-

- cd server
- npm install
- npm run dev
- Server runs on: http://localhost:5000

---

## 📡 API Routes Documentation:-

**🔐 Authentication Routes**

| Method | Endpoint                     | Description               | Auth Required  | Body Params           |
| ------ | ---------------------------- | ------------------------- | -------------  | --------------------- |
| POST   | `/register`                  | Register new user         | ❌             | name, email, password |
| POST   | `/login`                     | Login user                | ❌             | email, password       |
| POST   | `/logout`                    | Logout user               | ✅             | —                     |
| POST   | `/forgot-password`           | Send reset password email | ❌             | email                 |
| POST   | `/reset-password/:id/:token` | Reset password            | ❌             | newPassword           |
| GET    | `/check-auth`                | Verify logged-in user     | ✅             | —                     |


**👤 User Profile Routes**

- Base Path: /api/user

| Method | Endpoint   | Description                | Auth Required | Body Params                     |
| ------ | ---------- | -------------------------- | ------------- | ------------------------------- |
| GET    | `/profile` | Get logged-in user profile | ✅            | —                               |
| PUT    | `/profile` | Update user profile        | ✅            | userName, email, phone, address |


**🛒 Shop - Products Routes**

- Base Path: /api/shop/products

| Method | Endpoint   | Description           | Auth Required | Query / Params               |
| ------ | ---------- | --------------------- | ------------- | ---------------------------- |
| GET    | `/get`     | Get filtered products | ❌            | category, price, etc (query) |
| GET    | `/get/:id` | Get product details   | ❌            | id (URL param)               |


**🔎 Shop - Search Routes**

- Base Path: /api/shop/search

| Method | Endpoint    | Description                | Auth Required | Params  |
| ------ | ----------- | -------------------------- | ------------- | ------- |
| GET    | `/:keyword` | Search products by keyword | ❌            | keyword |


**🛍 Shop - Cart Routes**

- Base Path: /api/shop/cart

| Method | Endpoint              | Description           | Auth Required | Body / Params          |
| ------ | --------------------- | --------------------- | ------------- | ---------------------- |
| POST   | `/add`                | Add product to cart   | ❌            | userId, productId, qty |
| GET    | `/get/:userId`        | Get cart items        | ❌            | userId                 |
| PUT    | `/update-cart`        | Update cart quantity  | ❌            | userId, productId, qty |
| DELETE | `/:userId/:productId` | Remove item from cart | ❌            | userId, productId      |


**📦 Shop - Order Routes**

- Base Path: /api/shop/order

| Method | Endpoint        | Description         | Auth Required | Body / Params   |
| ------ | --------------- | ------------------- | ------------- | --------------- |
| POST   | `/create`       | Create new order    | ❌            | order details   |
| POST   | `/capture`      | Capture payment     | ❌            | payment details |
| GET    | `/list/:userId` | Get all user orders | ❌            | userId          |
| GET    | `/details/:id`  | Get order details   | ❌            | orderId         |


**🏠 Shop - Address Routes**

- Base Path: /api/shop/address

| Method | Endpoint                     | Description        | Auth Required | Body / Params     |
| ------ | ---------------------------- | ------------------ | ------------- | ----------------- |
| POST   | `/add`                       | Add new address    | ❌            | address details   |
| GET    | `/get/:userId`               | Get user addresses | ❌            | userId            |
| PUT    | `/update/:userId/:addressId` | Update address     | ❌            | updated address   |
| DELETE | `/delete/:userId/:addressId` | Delete address     | ❌            | userId, addressId |


**⭐ Shop - Review Routes**

- Base Path: /api/shop/review

| Method | Endpoint      | Description         | Auth Required | Body / Params             |
| ------ | ------------- | ------------------- | ------------- | ------------------------- |
| POST   | `/add`        | Add product review  | ❌            | productId, rating, review |
| GET    | `/:productId` | Get product reviews | ❌            | productId                 |


**❤️ Wishlist Routes**

- Base Path: /api/wishlist

| Method | Endpoint | Description                  | Auth Required | Body / Params   |
| ------ | -------- | ---------------------------- | ------------- | --------------- |
| GET    | `/`      | Get user wishlist            | ✅            | —               |
| POST   | `/`      | Add product to wishlist      | ✅            | _id (productId) |
| DELETE | `/:id`   | Remove product from wishlist | ✅            | productId       |


**🛠 Admin - Products Routes**

- Base Path: /api/admin/products

| Method | Endpoint      | Description      | Auth Required                  | Body / Params |
| ------ | ------------- | ---------------- | -----------------------------  | ------------- |
| POST   | `/add`        | Add new product  | ❌ (Should be Admin Protected) | product data  |
| PUT    | `/edit/:id`   | Edit product     | ❌ (Should be Admin Protected) | product data  |
| DELETE | `/delete/:id` | Delete product   | ❌ (Should be Admin Protected) | productId     |
| GET    | `/get`        | Get all products | ❌                             | —             |


**📊 Admin - Orders Routes**

- Base Path: /api/admin/orders

| Method | Endpoint                | Description                | Auth Required                 | Params           |
| ------ | ----------------------- | -------------------------- | ----------------------------- | ---------------- |
| GET    | `/get`                  | Get all orders (All users) | ❌ (Should be Admin Protected) | —                |
| GET    | `/details/:id/:adminid` | Get specific order details | ❌ (Should be Admin Protected) | orderId, adminId |
| PUT    | `/update/:id`           | Update order status        | ❌ (Should be Admin Protected) | orderId          |


**🖼 Common Feature Routes**

- Base Path: /api/common/feature

| Method | Endpoint | Description          | Auth Required | Body / Params |
| ------ | -------- | -------------------- | ------------- | ------------- |
| POST   | `/`      | Add feature image    | ❌             | image data    |
| GET    | `/get`   | Get feature images   | ❌             | —             |
| DELETE | `/:id`   | Delete feature image | ❌             | imageId       |

---

## 🔐 Authentication & Authorization:-

- Clerk middleware (if integrated)

- Role-based access control (Recruiter / Job Seeker)

---

## 🗄 Database Models:-

- User

- Company

- Jobs

- Job Applications

---

## 🧪 Testing APIs:-

**You can test APIs using:**

- Postman

- Thunder Client

---

## 🌍 Deployment:-

**Recommended:**

- Render

- Railway

- Cyclic

**Make sure to:**

- Add environment variables

- Allow CORS for frontend domain

---

## ⚠️ Common Errors:-

**404 Error**

Check:

- Correct route path

- Backend URL in frontend

- Environment variables

**MongoDB Connection Failed**

Check:

- IP whitelist in MongoDB Atlas

- Correct connection string

---

## 👨‍💻 Developed By:-

- Vignesh R

- Full Stack Developer (MERN)

---






