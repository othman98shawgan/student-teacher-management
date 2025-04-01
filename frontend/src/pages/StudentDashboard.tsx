import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SubmitAssignmentModal from "../components/modals/student/SbumitAssignmentModal";
import ViewStudentAssignments from "../components/modals/student/ViewStudentAssignmentsModal";
import api from "../api/axiosInstance";

export default function StudentDashboard() {
  const { token, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.fullName);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const operations = [
    { label: "View Assignments", action: () => openModal("view"), className: "btn-view" },
    { label: "Submit Assignment", action: () => openModal("submit"), className: "btn-create" },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Student Dashboard</h1>
      </header>

      <div className="profile-corner">
        <div className="avatar" onClick={toggleDropdown}></div>
        {showDropdown && (
          <div className="dropdown">
            <p>{userName}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <main className="dashboard-content student-grid">
        {operations.map((op, index) => (
          <button key={index} className={`dashboard-btn ${op.className}`} onClick={op.action}>
            {op.label}
          </button>
        ))}
      </main>
      {token && activeModal === "view" && <ViewStudentAssignments token={token} onClose={closeModal} />}

      {token && activeModal === "submit" && (
        <SubmitAssignmentModal token={token} onClose={closeModal} onSubmitted={() => {}} />
      )}
    </div>
  );
}
