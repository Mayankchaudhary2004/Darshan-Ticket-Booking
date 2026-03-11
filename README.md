# 🛕 DarshanEase — Temple Darshan Ticket Booking App

**DarshanEase** is a full-stack MERN web application that allows devotees to explore temples, view available darshan slots, book tickets online, and make donations — all from the comfort of their home.

![DarshanEase Preview](./preview.png)

## 🌟 Features

- 🔐 **JWT Authentication** with role-based access (USER, ADMIN, ORGANIZER)
- 🛕 **Temple Browsing** with search and pagination
- 📅 **Darshan Slot Booking** — select date, pooja type, and number of tickets
- 🎫 **Booking Management** — view and cancel bookings
- 💛 **Donations** — contribute to temples with purpose selection
- 🛡️ **Admin Dashboard** — manage temples, slots, bookings, and users
- 📱 **Fully Responsive** design with saffron/gold temple theme

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Bootstrap 5, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |
| Notifications | React Toastify |

## 📁 Project Structure

```
Darshan ticket booking app/
├── backend/
│   ├── config/        # MongoDB connection
│   ├── controllers/   # Route logic (auth, temple, slot, booking, donation, admin)
│   ├── middleware/    # JWT auth, role guard, error handler
│   ├── models/        # User, Temple, DarshanSlot, Booking, Donation
│   ├── routes/        # Express routers
│   ├── seed.js        # Database seeder
│   └── server.js      # Entry point
└── frontend/
    └── src/
        ├── api/       # Axios instance + API functions
        ├── components/ # Navbar, Footer, ProtectedRoute
        ├── context/   # AuthContext
        └── pages/     # All page components
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/darshanease.git
cd darshanease
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb://localhost:27017/darshanease
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

### 3. Seed the Database

```bash
node seed.js
```

This creates:
- 🔐 Admin: `admin@darshanease.in` / `admin123`
- 👤 User: `user@darshanease.in` / `user123`
- 🛕 6 major Indian temples
- 📅 Darshan slots for the next 15 days

### 4. Start Backend

```bash
npm run dev   # runs on http://localhost:5000
```

### 5. Setup & Start Frontend

```bash
cd ../frontend
npm install
npm run dev   # runs on http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| GET | `/api/temples` | Public |
| POST | `/api/temples` | Admin/Organizer |
| GET | `/api/slots/temple/:id` | Public |
| POST | `/api/slots` | Admin/Organizer |
| POST | `/api/bookings` | User |
| GET | `/api/bookings/my` | Private |
| PUT | `/api/bookings/:id/cancel` | Private |
| POST | `/api/donations` | Private |
| GET | `/api/admin/dashboard` | Admin |

## 👥 Roles

| Role | Permissions |
|------|------------|
| **USER** | Browse temples, book darshan, manage own bookings, donate |
| **ORGANIZER** | All USER permissions + create/manage temples & slots |
| **ADMIN** | Full access including user management and all data |

## 📸 Screenshots

The app features a premium temple-themed design with:
- Deep purple/indigo hero section
- Saffron (🟠) primary color
- Gold accent highlights
- Smooth animations and hover effects

## 📄 License

MIT License — feel free to use and modify!

---

*Made with ❤️ for devotees across India 🙏*
