using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
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
        [HttpGet("get/{id}/{month}/{year}")]
        public IActionResult GetTable(int id, int month, int year)
        {
            TimeTableRequest request = new()
            {
                UserId = id,
                Month = month,
                Year = year,
            };

            List<TimeTableResponse> response = _timeTableService.GetByUserIdMonthYear(request);
            return Ok(response);

        }
        [AllowAnonymous]
        [HttpDelete("delete/{id}/{month}/{year}")]
        public IActionResult DeleteTimeTable(int id, int month, int year) 
        {
            TimeTableRequest request = new()
            {
                UserId = id,
                Month = month,
                Year = year,
            };
            _timeTableService.DeleteByUserIdMonthYear(request);
            return Ok(new { message = "Table return to default" });
        }
    }
}
