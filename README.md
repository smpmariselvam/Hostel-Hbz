
# 🏨 Hostel Hub – Hostel Management System

## 🔗 GitHub Repository

👉 https://github.com/smpmariselvam/Hostel-hub.git

---

## 📌 Description

Hostel Hub is a full-stack hostel management system built using **Node.js, Express, MongoDB Atlas, and Next.js**.

It provides a complete solution for managing hostel operations including rooms, bookings, food, payments, complaints, chat system, and notifications with secure authentication.

---

## 🚀 Features (Current Working System)

### 🔐 Authentication

* User Registration & Login (JWT)
* Secure cookie-based authentication

### 🏨 Core Modules

* 🏠 Room Management
* 📅 Booking System
* 🍽️ Food Menu Management
* 💳 Payment Processing
* 📝 Complaint System
* 🔔 Notifications System

### 👥 Roles & Panels

* 👑 Admin Panel (includes complaint management)
* 👨‍🔧 Staff Operations
* 👤 Customer Operations

### 💬 Communication

* Public Chat System (real-time ready)
* Chat statistics (Admin)
* Clear chat functionality

---

## 🛠 Tech Stack

### Backend

📦 Dependencies
bcryptjs
cors
csv-parser
dotenv
express
jsonwebtoken
mongoose
multer
nodemailer
pdfkit
qrcode
socket.io
⚙️ Dev Dependency
nodemon
🚀 Install Command

Install all dependencies:

npm install bcryptjs cors csv-parser dotenv express jsonwebtoken mongoose multer nodemailer pdfkit qrcode socket.io

Install dev dependency:

npm install -D nodemon

### Frontend

* 📦 Dependencies
react
react-dom
react-router-dom
axios
socket.io-client
react-calendar
react-datepicker
react-toastify
react-modal
lucide-react
framer-motion
qrcode
react-qr-code
react-hot-toast
⚙️ Dev Dependencies
@vitejs/plugin-react
vite
tailwindcss
autoprefixer
🚀 Install Command

Run this for dependencies:

npm install react react-dom react-router-dom axios socket.io-client react-calendar 
react-datepicker react-toastify react-modal lucide-react framer-motion qrcode react-qr-code react-hot-toast

Run this for dev dependencies:

npm install -D @vitejs/plugin-react vite tailwindcss autoprefixer

---

## ⚙️ Environment Configuration

Create a `.env` file inside **server/**:

```env
MONGO_URI=your_mongodb_connection
PORT=5000
JWT_SECRET=your_secret_key
CORS_ORIGIN=https:Frontend link here
SOCKET_CORS_ORIGIN=https:Frontend link here
```
Create a MongoDB Atlas cluster and connect it to the project. Within Atlas, 
navigate to the users collection and update the role of the specified user to admin.

After making this change, return to the application and log in to the admin panel using the updated credentials.

Admin Login Details:

AdminUsername: vikramTM@gmail.com
AdminPassword: 1234567
---

## ▶️ Running the Project

### Backend

```bash
git clone https://github.com/smpmariselvam/Hostel-hub.git
cd Hostel-hub/server
npm install
npm run start
```

✅ Server runs on: `http://localhost:5000`

---

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔌 Server Status (Live Configuration)

* 🚀 Port: **5000**
* 🌍 Environment: **development**
* 🗄️ MongoDB: **Connected (Atlas)**
* 🔒 JWT: **Configured**
* 🌐 CORS: **https://hostel-hub-lbcu.onrender.com**

---

## 📡 API Endpoints

### 🔐 Authentication

* `/api/auth/*`

### 🏨 Core APIs

* `/api/rooms/*`
* `/api/bookings/*`
* `/api/food/*`
* `/api/payments/*`

### 👥 User & Roles

* `/api/customer/*`
* `/api/staff/*`
* `/api/admin/*`

### 📝 Complaints

* `/api/complaints/*`

### 🔔 Notifications

* `/api/notifications/*`

### 💬 Chat System

* `/api/chat/*`

---

## 💬 Public Chat API

* `GET /api/chat/public-chat`
* `GET /api/chat/:id/messages`
* `POST /api/chat/:id/messages`
* `POST /api/chat/:id/clear` (Admin only)
* `GET /api/chat/:id/stats` (Admin only)

---

## 📁 Folder Structure

```bash
Hostel-hub/
│
├── server/
├── frontend/
└── README.md
```

---

## 🚧 Future Improvements

* 📊 Dashboard analytics
* 📱 Mobile responsiveness
* 🔔 Real-time notifications
* 🧾 Invoice system

---

..............................................................................................................................................

                                      Admin id name & mail ,password just use this 
                                ............................................................................
Admin login id & password
name : Admin
email : Admin01@example.com
password : admin01123
...............................................................................................................................................

                                        cutomer id name & mail ,password just use this 
                               ...............................................................................
customer login id & password
name : user01
email : user01@example.com
password : user01123
................................................................................................................................................

## 🤝 Contribution

Feel free to fork and contribute to this project.................


Please visit the website at https://hostel-hub-lbcu.onrender.com
.
Kindly register using your email address and create a password, then proceed to log in using the same credentials.

---

## 📜 License

MIT License
