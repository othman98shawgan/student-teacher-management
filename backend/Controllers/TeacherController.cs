using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/teacher")]
[ApiController]
[Authorize(Roles = "Teacher")]
public class TeacherController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TeacherController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost("assignments")]
    public async Task<IActionResult> CreateAssignment([FromBody] AssignmentCreateDto dto)
    {
        var user = await _userManager.GetUserAsync(User);

        var assignment = new Assignment
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            CreatedById = user.Id
        };

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment created", assignment.Id });
    }

    [HttpGet("assignments")]
    public async Task<IActionResult> GetMyAssignments()
    {
        var user = await _userManager.GetUserAsync(User);

        var assignments = await _context.Assignments
            .Where(a => a.CreatedById == user.Id)
            .Select(a => new AssignmentDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                DueDate = a.DueDate
            })
            .ToListAsync();

        return Ok(assignments);
    }

    [HttpPut("assignments/{id}")]
    public async Task<IActionResult> EditAssignment(int id, [FromBody] AssignmentCreateDto dto)
    {
        var user = await _userManager.GetUserAsync(User);
        var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == id && a.CreatedById == user.Id);

        if (assignment == null)
        {
            return NotFound("Assignment not found or not yours.");
        }

        assignment.Title = dto.Title;
        assignment.Description = dto.Description;
        assignment.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment updated." });
    }

    [HttpDelete("assignments/{id}")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        var assignment = await _context.Assignments.Include(a => a.Submissions).FirstOrDefaultAsync(a => a.Id == id && a.CreatedById == user.Id);


        if (assignment == null)
        {
            return NotFound("Assignment not found or not yours.");
        }
        if (assignment.Submissions.Count != 0)
        {
            return BadRequest("Cannot delete assignment. It has student submissions.");
        }

        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment deleted." });
    }

    [HttpGet("assignments/{assignmentId}/submissions")]
    public async Task<IActionResult> GetSubmissionsForAssignment(int assignmentId)
    {
        var user = await _userManager.GetUserAsync(User);

        var assignment = await _context.Assignments
            .Include(a => a.Submissions)
            .ThenInclude(s => s.Student)
            .FirstOrDefaultAsync(a => a.Id == assignmentId && a.CreatedById == user.Id);

        if (assignment == null)
        {
            return NotFound("Assignment not found or not owned by you.");
        }

        var results = assignment.Submissions.Select(s => new
        {
            s.Id,
            StudentEmail = s.Student.Email,
            s.AssignmentId,
            s.SubmissionUrl,
            s.SubmittedAt,
            s.Grade
        });

        return Ok(results);
    }

    [HttpPost("grade")]
    public async Task<IActionResult> GradeSubmission([FromBody] GradeSubmissionDto dto)
    {
        var user = await _userManager.GetUserAsync(User);

        var submission = await _context.StudentAssignments
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == dto.SubmissionId);

        if (submission == null)
        {
            return NotFound("Submission not found.");
        }

        if (submission.Assignment.CreatedById != user.Id)
        {
            return Forbid("You are not allowed to grade this submission.");
        }

        submission.Grade = dto.Grade;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Grade updated successfully." });
    }
}
