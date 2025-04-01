# 🎓 Student-Teacher Management System

A full-stack web application for managing students, teachers, and assignments with role-based access.

---

## 🧱 Tech Stack

- ⚙️ **Backend:** ASP.NET Core (.NET 8)
- ⚛️ **Frontend:** React + TypeScript + Vite
- 💾 **Database:** SQL Server (via Entity Framework Core)

---

## 📁 Project Structure

```
student-teacher-management/
├── backend/         # ASP.NET Core Web API
├── frontend/        # React frontend with Vite
├── run.bat          # Windows script to install & run both
└── README.md
```

---

## 🧰 Prerequisites

Make sure these are installed before starting:

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js + npm](https://nodejs.org/)
- [Git Bash](https://git-scm.com/downloads) or PowerShell
- [Visual Studio Code](https://code.visualstudio.com/) or another IDE

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/student-teacher-management.git
cd student-teacher-management
```

### 2️⃣ Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update
```

> 🛠 If `dotnet ef` is not recognized, install the CLI globally:

```bash
dotnet tool install --global dotnet-ef
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Project (Windows)

Double-click the `run.bat` file in the root of the project. It will:

- 🔧 Restore dependencies
- 🧠 Run database migrations
- 🚀 Start the **backend** (`https://localhost:7178`)
- 💻 Start the **frontend** (`http://localhost:5173`)

Two PowerShell windows will open — one for each service.

---

## 📫 Postman Collection

Import the full API into Postman using:

📁 `StudentTeacherAPI.postman_collection.json`

> After logging in, set `{{token}}` in your environment for protected routes.

---

## 📚 API Overview
| Endpoint                                      | Method | Role     | Description                          |
|-----------------------------------------------|--------|----------|--------------------------------------|
| `/api/auth/register`                          | POST   | All      | Register a new user                  |
| `/api/auth/login`                             | POST   | All      | Login (Student & Teacher)            |
| `/api/auth/me`                                | GET    | Authenticated | Get current user profile        |
| `/api/teacher/assignments`                    | POST   | Teacher  | Create assignment                    |
| `/api/teacher/assignments`                    | GET    | Teacher  | Get teacher's assignments            |
| `/api/teacher/assignments/{id}`               | PUT    | Teacher  | Edit assignment                      |
| `/api/teacher/assignments/{id}`               | DELETE | Teacher  | Delete assignment                    |
| `/api/teacher/assignments/{id}/submissions`   | GET    | Teacher  | View submissions for assignment      |
| `/api/teacher/grade`                          | POST   | Teacher  | Grade a student submission           |
| `/api/student/assignments`                    | GET    | Student  | View all available assignments       |
| `/api/student/submit`                         | POST   | Student  | Submit assignment                    |
| `/api/student/submissions`                    | GET    | Student  | View student submissions & grades    |
| `/health`                                     | GET    | Public   | Health check                         |

---

## 📝 Notes

- Backend runs on both `https://localhost:7178` and `http://localhost:5105`.
- Frontend uses Vite and runs on `http://localhost:5173`.
- Role-based access control is implemented using ASP.NET Identity.
- You can customize roles/permissions in `backend/Program.cs` or `Startup.cs`.
