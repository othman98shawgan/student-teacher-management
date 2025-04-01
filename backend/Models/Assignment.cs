using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Assignment
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; }

    [MaxLength(1000)]
    public string Description { get; set; }

    public DateTime DueDate { get; set; }

    [Required]
    public string CreatedById { get; set; }

    [ForeignKey("CreatedById")]
    public ApplicationUser CreatedBy { get; set; }

    public ICollection<StudentAssignment> Submissions { get; set; }
}
