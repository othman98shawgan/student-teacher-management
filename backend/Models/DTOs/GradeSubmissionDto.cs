using System.ComponentModel.DataAnnotations;

public class GradeSubmissionDto
{
    [Required]
    public int SubmissionId { get; set; }

    [Required]
    public string Grade { get; set; }
}
