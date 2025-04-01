import { useState } from "react";
import Modal from "../../Modal";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
  onCreated: () => void; // callback to refresh the list
}

export default function CreateAssignmentModal({ token, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/teacher/assignments",
        { title, description, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onCreated(); // refresh assignment list
      onClose(); // close modal
    } catch {
      alert("Failed to create assignment.");
    }
  };

  return (
    <Modal title="Create Assignment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        <button type="submit" style={{ backgroundColor: "#4caf50" }}>
          Create
        </button>
      </form>
    </Modal>
  );
}
