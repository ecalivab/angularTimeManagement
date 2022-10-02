using Microsoft.EntityFrameworkCore;
using time_management_API.Models.Users;

namespace time_management_API.DataAccess
{
    public class TimeManagementContext: DbContext
    {
        public TimeManagementContext()
        { 
        }
        public TimeManagementContext(DbContextOptions<TimeManagementContext> options) : base(options)
        {
        }

        public DbSet<User> User { get; set; }

    }
}
