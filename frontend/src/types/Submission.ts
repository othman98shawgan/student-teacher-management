export interface Submission {
  id: number;
  assignmentTitle: string;
  assignmentId: number;
  submissionUrl: string;
  submittedAt: string;
  grade: string | null;
  studentEmail: string;
}
