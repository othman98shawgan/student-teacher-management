import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Modal from "../../Modal";
import { Assignment } from "../../../types/Assignment";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
}

export default function ViewAssignmentsModal({ token, onClose }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/teacher/assignments", {
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

  return (
    <Modal title="Available Assignments" onClose={onClose}>
      <ul style={{ marginTop: "1rem" }}>
        {assignments.map((a) => (
          <li key={a.id} style={{ marginBottom: "1rem" }}>
            <strong>
              {a.title} (id:{a.id})
            </strong>
            <br />
            Description: {a.description}
            <br />
            Due Date: {new Date(a.dueDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
