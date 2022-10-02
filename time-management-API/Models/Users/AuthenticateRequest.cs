using System.ComponentModel.DataAnnotations;

namespace time_management_API.Models.Users
{
    public class AuthenticateRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
