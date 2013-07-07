using System;

namespace Schedule.Web.Models
{
    public interface ICalEvent
    {
        int Id { get; set; }
        EventType WorkType { get; set; }
        string EmployeeName { get; set; }
        string TeamName { get; set; }
        DateTime StartTime { get; set; }
        DateTime EndTime { get; set; }
        bool AllDay { get; set; }
        string Notes { get; set; }
    }
}
