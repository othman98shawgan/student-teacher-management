using System.ComponentModel.DataAnnotations;

public class StudentAssignmentSubmitDto
{
    [Required]
    public int AssignmentId { get; set; }

    [Required]
    public string SubmissionUrl { get; set; }  // file link.
}
