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
                allDay = shift.AllDay,
                note = shift.Notes
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
                tempEnd = data.end.Value.ToLocalTime();
            }
            else
            {
                tempEnd = data.start.AddHours(1).ToLocalTime();
            }
            DateTime tempStart = data.start.ToLocalTime();
            var shift = new Shift
            {
                StartTime = tempStart,
                EndTime = tempEnd,
                WorkType = ShiftHelper.TryParse(data.className[0]),
                EmployeeName = data.title,
                Id = data.id.Value,
                TeamName = data.description,
                AllDay = data.allDay.Value,
                Notes = data.note
            };
            if (shift.WorkType == ShiftType.Coverage)
            {
                shift.CoveringOtherShift = true;
            }
            if (shift.WorkType == ShiftType.Vacation)
            {
                shift.CoverageNeeded = true;
            }

            return shift;
        }

        public virtual int? id { get; set; }
        public virtual string title { get; set; }
        public virtual bool? allDay { get; set; }
        public virtual DateTime start { get; set; }
        public virtual DateTime? end { get; set; }
        public virtual string[] className { get; set; }
        public virtual string description { get; set; }
        public virtual string note { get; set; }
    }
}