using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class StudentAssignment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AssignmentId { get; set; }

    [ForeignKey("AssignmentId")]
    public Assignment Assignment { get; set; }

    [Required]
    public string StudentId { get; set; }

    [ForeignKey("StudentId")]
    public ApplicationUser Student { get; set; }

    [Required]
    public string SubmissionUrl { get; set; }

    public DateTime SubmittedAt { get; set; }

    public string? Grade { get; set; }
}
