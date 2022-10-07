using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using time_management_API.Models.TimeTables;
using time_management_API.Models.Users;
using time_management_API.Services;

namespace time_management_API.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowAll")]
    [ApiController]
    public class TimeTableController : ControllerBase
    {
        private ITimeTableService _timeTableService;

        public TimeTableController(ITimeTableService timeTableService)
        {
            _timeTableService = timeTableService;
        }


        [AllowAnonymous]
        [HttpPost("save")]
        public IActionResult SaveTable (List<TimeTable> request)
        {
            _timeTableService.SaveTable(request);
            return Ok(new { message = "Save Time Table successful" });
        }

        [AllowAnonymous]
        [HttpGet("get")]
        public IActionResult GetTable(TimeTableRequest request)
        {
            List<TimeTable> response = _timeTableService.GetByUserIdMonthYear(request);
            return Ok(response);

        }
    }
}
