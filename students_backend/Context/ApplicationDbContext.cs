using Microsoft.EntityFrameworkCore;

namespace YourNamespace
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
    }

    public class Student
    {
        public int Id { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Group { get; set; }
    }
}