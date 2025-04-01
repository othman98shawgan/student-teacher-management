import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Modal from "../../Modal";
import { Assignment } from "../../../types/Assignment";
import { Submission } from "../../../types/Submission";
import api from "../../../api/axiosInstance";

interface Props {
  token: string;
  onClose: () => void;
}

export default function ViewStudentAssignments({ token, onClose }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assignments
        const assignmentsRes = await api.get("/student/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort assignments by due date (ascending)
        const sortedAssignments = assignmentsRes.data.sort(
          (a: Assignment, b: Assignment) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        setAssignments(sortedAssignments);

        // Fetch all submissions
        const submissionsRes = await api.get("/student/submissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(submissionsRes.data);
      } catch (error) {
        const err = error as AxiosError;
        alert(err.response?.data || "Failed to load data.");
      }
    };
    fetchData();
  }, [token]);

  const getSubmissionForAssignment = (assignmentId: number) => {
    return submissions.find((s) => s.assignmentId == assignmentId);
  };

  return (
    <Modal title="My Assignments" onClose={onClose}>
      <div className="modal-form">
        <div className="assignments-table-container">
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Due Date</th>
                <th>Submitted</th>
                <th>Grade</th>
                <th>Submission</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => {
                const submission = getSubmissionForAssignment(assignment.id);
                return (
                  <tr key={assignment.id}>
                    <td>{assignment.title}</td>
                    <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td>{submission ? new Date(submission.submittedAt).toLocaleDateString() : "—"}</td>
                    <td>{submission?.grade ?? "—"}</td>
                    <td>
                      {submission?.submissionUrl ? (
                        <a
                          href={submission.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="submission-link"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
