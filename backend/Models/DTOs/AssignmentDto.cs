using System.ComponentModel.DataAnnotations;

public class AssignmentDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
}
public class AssignmentCreateDto
{
    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
}
