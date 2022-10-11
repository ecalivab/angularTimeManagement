using System.Linq;
using time_management_API.DataAccess;
using time_management_API.Helpers;
using time_management_API.Models.TimeTables;

namespace time_management_API.Services
{

    public interface ITimeTableService
    {       
        List<TimeTableResponse> GetByUserIdMonthYear(TimeTableRequest request);
        void DeleteByUserIdMonthYear(TimeTableRequest request);
        void SaveTable(List<TimeTable> request);
    }
    public class TimeTableService: ITimeTableService
    {
        private readonly TimeManagementContext _context;

        public TimeTableService(TimeManagementContext context)
        {
            _context = context;
        }

        public List<TimeTableResponse> GetByUserIdMonthYear(TimeTableRequest request)
        {
            List<TimeTableResponse> table = _context.TimeTable
                .Where(row => row.UserId == request.UserId && row.Month == request.Month && row.Year == request.Year)
                .Select(row => new TimeTableResponse() { Date = row.Date, Hours = row.Hours, Rol = row.Rol, Holiday = row.Holiday, Office = row.Office })
                .ToList();

            return table;
        }

        public void SaveTable(List<TimeTable> model)
        {
            /* I will only safe the not default values on the DB that means (hour=8, Office=1, Holiday=0, Rol=0)
               for the user to reset a value to default I delete the current monthly table and save the new values.
             */

            if (model == null && model?.Count <= 0)
                throw new AppException("Table is corrupted");

            int UserId = model.FirstOrDefault().UserId;

            if (UserId == null || _context.User.Find(UserId) == null)
                throw new KeyNotFoundException("User not found");

            TimeTableRequest deleteRequest = new()
            {
                UserId = UserId,
                Month  = model.FirstOrDefault().Month,
                Year = model.FirstOrDefault().Year,
            };

            DeleteByUserIdMonthYear(deleteRequest);
            _context.AddRange(model);
            _context.SaveChanges();

        }
        public void DeleteByUserIdMonthYear(TimeTableRequest request) 
        {
            // Works for small datasets because it save the data in memory for lager datasets better use sqlcommand execution
            List<TimeTable> rowsToRemove = _context.TimeTable.Where(
                row => row.UserId == request.UserId && row.Month == request.Month && row.Year == request.Year).ToList();

            // Remove only if it find a row in the DB
            if(rowsToRemove != null && rowsToRemove.Count > 0) 
            {
                _context.TimeTable.RemoveRange(rowsToRemove);
                _context.SaveChanges();
            }
          
        }

    }
}
