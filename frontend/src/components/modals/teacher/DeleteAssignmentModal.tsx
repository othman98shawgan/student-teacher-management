import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Modal from "../../Modal";
import { Assignment } from "../../../types/Assignment";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteAssignmentModal({ token, onClose, onDeleted }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/teacher/assignments/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted();
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(
        axiosError.response?.data + "\nPlease contact Administrator." ||
          "Failed to delete assignment. Please contact Administrator."
      );
    }
  };

  return (
    <Modal title="Delete Assignment" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
        className="modal-form"
      >
        <select value={selectedId ?? ""} onChange={(e) => setSelectedId(parseInt(e.target.value))} required>
          <option value="" disabled>
            Select an assignment
          </option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!selectedId} style={{ backgroundColor: "#f44336", color: "white" }}>
          Delete
        </button>
      </form>
    </Modal>
  );
}
