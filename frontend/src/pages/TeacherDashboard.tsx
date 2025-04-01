import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Assignment } from "../types/Assignment";
import CreateAssignmentModal from "../components/modals/teacher/CreateAssignmentModal";
import DeleteAssignmentModal from "../components/modals/teacher/DeleteAssignmentModal";
import EditAssignmentModal from "../components/modals/teacher/EditAssignmentModal";
import ViewAssignmentsModal from "../components/modals/teacher/ViewAssignmentsModal";
import GradeAssignmentModal from "../components/modals/teacher/GradeAssignmentModal";
import api from "../api/axiosInstance";

export default function TeacherDashboard() {
  const { token, logout } = useAuth();
  const [, setAssignments] = useState<Assignment[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const operations = [
    { label: "Create Assignment", action: () => openModal("create"), className: "btn-create" },
    { label: "Delete Assignment", action: () => openModal("delete"), className: "btn-delete" },
    { label: "Edit Assignment", action: () => openModal("edit"), className: "btn-edit" },
    { label: "View  Assignments", action: () => openModal("view"), className: "btn-view" },
    { label: "Grade Submissions", action: () => openModal("grade"), className: "btn-grade" },
  ];

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

  const fetchAssignments = async () => {
    try {
      const res = await api.get("/teacher/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error("Fetch assignments failed:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchAssignments();
    }
  }, [token]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
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

      <main className="dashboard-content teacher-grid">
        {operations.map((op, index) => (
          <button key={index} className={`dashboard-btn ${op.className}`} onClick={op.action}>
            {op.label}
          </button>
        ))}
      </main>

      {token && activeModal === "create" && (
        <CreateAssignmentModal token={token} onClose={closeModal} onCreated={fetchAssignments} />
      )}
      {token && activeModal === "delete" && (
        <DeleteAssignmentModal token={token} onClose={closeModal} onDeleted={fetchAssignments} />
      )}
      {token && activeModal === "edit" && (
        <EditAssignmentModal token={token} onClose={closeModal} onEdited={fetchAssignments} />
      )}
      {token && activeModal === "view" && <ViewAssignmentsModal token={token} onClose={closeModal} />}
      {token && activeModal === "grade" && (
        <GradeAssignmentModal token={token} onClose={closeModal} onGraded={fetchAssignments} />
      )}
    </div>
  );
}
