using Calendar.Data;
using Schedule.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Schedule.Web.Controllers
{
    public class EventsController : ApiController
    {

        [ActionName("Update")]
        public HttpResponseMessage Post(CalendarEvent data)
        {
            var response = new HttpResponseMessage();
            //handle the object here
            if (data != null)
            {
                response.StatusCode = HttpStatusCode.OK;
            }
            else
            {
                response.StatusCode = HttpStatusCode.BadRequest;
            }
            return response;
        }

        [ActionName("WorkTypes")]
        public Dictionary<int, String> GetWorkTypes()
        {
            Dictionary<int, string> WorkTypes = new Dictionary<int, string>();
            WorkTypes.Add(0, ShiftType.Coverage.ToString());
            WorkTypes.Add(1, ShiftType.Scheduled.ToString());
            WorkTypes.Add(2, ShiftType.Vacation.ToString());
            WorkTypes.Add(3, ShiftType.Training.ToString());
            WorkTypes.Add(4, ShiftType.Meeting.ToString());
            return WorkTypes;
        }
    }
}
