using System;

namespace Schedule.Web.Models
{
    public class CalEvent : ICalEvent
    {
        public CalEvent()
        {
            this.WorkType = EventType.Scheduled;
        }

        public CalEvent(ICalEvent results)
        {
            this.EmployeeName = results.EmployeeName;
            this.EndTime = results.EndTime;
            this.Id = results.Id;
            this.StartTime = results.StartTime;
            this.WorkType = results.WorkType;
            this.TeamName = results.TeamName;
            this.AllDay = results.AllDay;
            this.Notes = results.Notes;
        }
        public virtual int Id { get; set; }
        public virtual string EmployeeName { get; set; }
        public virtual string TeamName { get; set; }
        public virtual EventType WorkType { get; set; }
        public virtual DateTime StartTime { get; set; }
        public virtual DateTime EndTime { get; set; }
        public virtual bool AllDay { get; set; }
        public virtual string Notes { get; set; }
    }
}
