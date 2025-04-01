import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Modal from "../../Modal";
import { Assignment } from "../../../types/Assignment";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function SubmitAssignmentModal({ token, onClose, onSubmitted }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentId, setAssignmentId] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/student/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (error) {
        const err = error as AxiosError;
        alert(err.response?.data || "Failed to load assignments.");
      }
    };
    fetchAssignments();
  }, [token]);

  const handleSubmit = async () => {
    if (!assignmentId || !submissionUrl.trim()) return;
    try {
      await api.post(
        "/student/submit",
        { assignmentId, submissionUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSubmitted();
      setAssignmentId(null);
      setSubmissionUrl("");
      onClose();
    } catch (error) {
      const err = error as AxiosError;
      alert(err.response?.data || "Failed to submit assignment.");
    }
  };

  return (
    <Modal title="Submit Assignment" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="modal-form"
      >
        <select value={assignmentId ?? ""} onChange={(e) => setAssignmentId(parseInt(e.target.value))} required>
          <option value="" disabled>
            Select assignment
          </option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <input
          type="url"
          placeholder="Submission URL"
          value={submissionUrl}
          onChange={(e) => setSubmissionUrl(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}
