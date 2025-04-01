import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Modal from "../../Modal";
import { Assignment } from "../../../types/Assignment";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
  onEdited: () => void;
}

export default function EditAssignmentModal({ token, onClose, onEdited }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

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
    const assignment = assignments.find((a) => a.id === selectedId);
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueDate(assignment.dueDate.split("T")[0]);
    }
  }, [selectedId, assignments]);

  const handleEdit = async () => {
    if (!selectedId) return;
    try {
      await api.put(
        `/teacher/assignments/${selectedId}`,
        {
          title,
          description,
          dueDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onEdited();
      onClose();
    } catch (error) {
      const err = error as AxiosError;
      alert(err.response?.data || "Failed to update assignment.");
    }
  };

  const isFormDisabled = selectedId === null;

  return (
    <Modal title="Edit Assignment" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEdit();
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
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isFormDisabled}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isFormDisabled}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          disabled={isFormDisabled}
        />

        <button type="submit" disabled={isFormDisabled} style={{ backgroundColor: "#ff9800" }}>
          Save Changes
        </button>
      </form>
    </Modal>
  );
}
