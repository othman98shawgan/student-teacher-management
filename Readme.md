# Student-Teacher Management System

A full-stack role-based web application for managing students, teachers, and assignments.

## 🧱 Tech Stack
- **Backend:** ASP.NET Core (.NET 8)
- **Frontend:** React + TypeScript + Vite

---

## 📁 Project Structure
```
student-teacher-management/
├── backend/       # ASP.NET Core API
├── frontend/      # React frontend
├── run.sh         # Script to run both frontend and backend
└── README.md
```

---

## ⚙️ Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js LTS](https://nodejs.org/en)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) (optional)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/student-teacher-management.git
cd student-teacher-management
```

### 2. Install Dependencies

#### Backend
```bash
cd backend

dotnet restore
```

#### Frontend
```bash
cd ../frontend

npm install  # or yarn
```

---

## 🏁 Run Both Projects Together

Use the provided script:

### ✅ macOS/Linux:
```bash
chmod +x run.sh
./run.sh
```

### ✅ Windows (PowerShell):
Run backend and frontend manually in separate terminals or convert the script.

---

## 🧪 Running Manually

### Backend
```bash
cd backend
dotnet run --urls "https://localhost:7178;http://localhost:5105"
```

### Frontend
```bash
cd frontend
npm run dev
```
Frontend will run at `http://localhost:5173`

---

## 📌 Notes
- Make sure the backend is reachable from the frontend (CORS is configured).
- If using HTTPS locally, accept the .NET dev certificate when prompted.

---

## 🧠 Default Roles
- `Student`
- `Teacher`

Choose the role during registration.

---

## 📬 Contact
For questions, open an issue or email: [oth1998@gmail.com](mailto:oth1998@gmail.com)

---

Happy Hacking! 🎓💻

