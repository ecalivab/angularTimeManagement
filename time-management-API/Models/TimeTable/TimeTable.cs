using time_management_API.Models.Users; 
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace time_management_API.Models.TimeTables
{
    public class TimeTable
    {
        private DateTime _dateWOTime;
        public int TimeTableId { get; set; }
        public DateTime Date { 
            get => _dateWOTime;
            set => _dateWOTime = value.ToUniversalTime().Date;
        }    
        public int Day { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int Hours { get; set; }
        public int Rol { get; set; }
        public bool Holiday { get; set; }
        public bool Office { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        // Navigation Property
        [JsonIgnore]
        public virtual User? User { get; set; }

    }
}
