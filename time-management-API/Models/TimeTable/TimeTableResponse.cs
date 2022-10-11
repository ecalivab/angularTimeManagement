namespace time_management_API.Models.TimeTables
{
    public class TimeTableResponse
    {
        public DateTime Date { get; set; }      
        public int Hours { get; set; }
        public int Rol { get; set; }
        public bool Holiday { get; set; }
        public bool Office { get; set; }
    }
}
