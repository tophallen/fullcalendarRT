using Schedule.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schedule.Web.Models
{

    public class CalendarEvent
    {
        public static CalendarEvent FromDatabase(IShift shift)
        {
            var data = new CalendarEvent
            {
                start = shift.StartTime,
                end = shift.EndTime,
                className = new[] { shift.WorkType.ToString() },
                description = shift.TeamName,
                title = shift.EmployeeName,
                id = shift.Id,
                allDay = shift.AllDay
            };

            return data;
        }

        public static IShift ToDatabase(CalendarEvent data)
        {
            if (!data.allDay.HasValue)
            {
                data.allDay = false;
            }
            DateTime tempEnd;
            if (data.end.HasValue)
            {
                tempEnd = data.end.Value.ToLocalTime(); //new DateTime(data.end.Value.Year, data.end.Value.Month,
                    //data.end.Value.Day, data.end.Value.Hour, data.end.Value.Minute,
                    //data.end.Value.Second, DateTimeKind.Utc);
            }
            else
            {
                tempEnd = data.start.AddHours(1).ToLocalTime();//new DateTime(data.start.Year, data.start.Month, data.start.Day,
                //data.start.Hour, data.start.Minute, data.start.Second, DateTimeKind.Utc).AddHours(1);
            }
            DateTime tempStart = data.start.ToLocalTime();//new DateTime(data.start.Year, data.start.Month, data.start.Day,
                //data.start.Hour, data.start.Minute, data.start.Second, DateTimeKind.Utc);
            var shift = new Shift
            {
                StartTime = tempStart,
                EndTime = tempEnd,
                WorkType = ShiftHelper.TryParse(data.className[0]),
                EmployeeName = data.title,
                Id = data.id.Value,
                TeamName = data.description,
                AllDay = data.allDay.Value
            };

            return shift;
        }

        public virtual int? id { get; set; }
        public virtual string title { get; set; }
        public virtual bool? allDay { get; set; }
        public virtual DateTime start { get; set; }
        public virtual DateTime? end { get; set; }
        public virtual string[] className { get; set; }
        public virtual string description { get; set; }
    }
}