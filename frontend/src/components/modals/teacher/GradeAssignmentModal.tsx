import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Modal from "../../Modal";
import { Assignment } from "../../../types/Assignment";
import { Submission } from "../../../types/Submission";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
  onGraded: () => void;
}

export default function GradeAssignmentModal({ token, onClose, onGraded }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/teacher/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch {
        console.error("Failed to load assignments");
      }
    };
    fetchAssignments();
  }, [token]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedAssignmentId) return;
      try {
        const res = await api.get(`/teacher/assignments/${selectedAssignmentId}/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
      } catch (error) {
        const err = error as AxiosError;
        alert(err.response?.data || "Failed to load submissions.");
      }
    };
    fetchSubmissions();
  }, [selectedAssignmentId, token]);

  const handleGradeSubmit = async () => {
    if (!gradingSubmission) return;
    try {
      await api.post(
        "/teacher/grade",
        {
          submissionId: gradingSubmission.id,
          grade: gradeValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onGraded();
      setSubmissions((prev) => prev.map((s) => (s.id === gradingSubmission.id ? { ...s, grade: gradeValue } : s)));
      setGradingSubmission(null);
      setGradeValue("");
    } catch (error) {
      const err = error as AxiosError;
      alert(err.response?.data || "Failed to submit grade.");
    }
  };

  return (
    <Modal title="Grade Assignment" onClose={onClose}>
      <div className="modal-form">
        <select
          value={selectedAssignmentId ?? ""}
          onChange={(e) => {
            setGradingSubmission(null);
            setSelectedAssignmentId(parseInt(e.target.value));
          }}
          required
        >
          <option value="" disabled>
            Select an assignment
          </option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>

        {submissions.length > 0 ? (
          <ul style={{ marginTop: "1rem" }}>
            {submissions.map((s) => (
              <li
                key={s.id}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}
              >
                <div>
                  <strong>{s.studentEmail}</strong> — Grade: {s.grade ?? "Not Graded"}
                  <br />
                  <a href={s.submissionUrl} target="_blank" rel="noopener noreferrer">
                    View Submission
                  </a>
                </div>
                <button onClick={() => setGradingSubmission(s)}>Grade</button>
              </li>
            ))}
          </ul>
        ):
          <p style={{ marginTop: "1rem" }}>No submissions for this assignment.</p>
        }

        {gradingSubmission && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              Grading <strong>{gradingSubmission.studentEmail}</strong>'s submission
            </p>
            <input
              type="text"
              placeholder="Enter grade (e.g. 85)"
              value={gradeValue}
              onChange={(e) => setGradeValue(e.target.value)}
            />
            <button onClick={handleGradeSubmit} disabled={!gradeValue.trim()} style={{ marginLeft: "0.5rem" }}>
              Submit Grade
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
