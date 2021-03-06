﻿using System;

namespace Schedule.Web.Models
{

    public class CalendarEvent
    {
        public static CalendarEvent FromDatabase(ICalEvent shift)
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

        public static ICalEvent ToDatabase(CalendarEvent data)
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
            var calEvent = new CalEvent
            {
                StartTime = tempStart,
                EndTime = tempEnd,
                WorkType = EventHelper.TryParse(data.className[0]),
                EmployeeName = data.title,
                Id = data.id.Value,
                TeamName = data.description,
                AllDay = data.allDay.Value,
                Notes = data.note
            };

            return calEvent;
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