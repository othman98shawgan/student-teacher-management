using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/student")]
[ApiController]
[Authorize(Roles = "Student")]
public class StudentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public StudentController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("assignments")]
    public async Task<IActionResult> GetAvailableAssignments()
    {
        var assignments = await _context.Assignments
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

    [HttpGet("submissions")]
    public async Task<IActionResult> GetMySubmissions()
    {
        var user = await _userManager.GetUserAsync(User);

        var submissions = await _context.StudentAssignments
            .Where(s => s.StudentId == user.Id)
            .Include(s => s.Assignment)
            .Select(s => new
            {
                s.Id,
                AssignmentId = s.AssignmentId,
                AssignmentTitle = s.Assignment.Title,
                s.SubmissionUrl,
                s.SubmittedAt,
                s.Grade
            })
            .ToListAsync();

        return Ok(submissions);
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitAssignment([FromBody] StudentAssignmentSubmitDto dto)
    {
        var user = await _userManager.GetUserAsync(User);

        var existing = await _context.StudentAssignments
            .FirstOrDefaultAsync(s => s.AssignmentId == dto.AssignmentId && s.StudentId == user.Id);

        if (existing != null)
        {
            return BadRequest("You have already submitted this assignment.");
        }

        var submission = new StudentAssignment
        {
            AssignmentId = dto.AssignmentId,
            StudentId = user.Id,
            SubmissionUrl = dto.SubmissionUrl,
            SubmittedAt = DateTime.UtcNow,
            Grade = null
        };

        _context.StudentAssignments.Add(submission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment submitted successfully." });
    }
}
