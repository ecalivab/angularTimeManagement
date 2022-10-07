using time_management_API.Models.TimeTables;

namespace time_management_API.Models.Users
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        // Navigation Property
        public virtual ICollection<TimeTable> TimeTable { get; set; }

    }
}
