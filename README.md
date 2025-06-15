# 🏨 Hotel Management System

A full-stack Hotel Management System built with **React.js**, **FastAPI**, and **SQLite**. The frontend is deployed on **Vercel**.

## 📌 Features

- User authentication and role-based access (Admin, Staff, Guest)
- Room booking and availability management
- Customer check-in/check-out
- Invoice generation and payment tracking
- Dashboard for analytics and management

## 🛠️ Tech Stack

| Layer      | Technology     |
|------------|----------------|
| Frontend   | React.js       |
| Backend    | FastAPI        |
| Database   | SQLite         |
| Hosting    | Vercel (Frontend) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/hotel-management-system.git
cd hotel-management-system
```

### 2. Backend Setup (FastAPI)

```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
uvicorn main:app --reload

```
- The API will be available at: `http://127.0.0.1:8000`
  
### 3. Frontend Setup (React.js)

```
cd ../frontend
npm install
npm start
```
- The frontend will run at: `http://localhost:3000`

### 4. Database

- SQLite is used as the local database.
- A pre-configured SQLite database file should be present or generated upon first backend run.

---

## 🌐 Live Demo

Frontend is hosted on **Vercel**:  
[https://hotel-management-system.vercel.app](https://fast-hotel.vercel.app/)  

---

## 📦 Dependencies

### Backend

- `fastapi`
- `uvicorn`
- `sqlite3`
- `pydantic`

### Frontend

- `react`
- `axios`
- `react-router-dom`
- `tailwindcss` *(optional)*

---
