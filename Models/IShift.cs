using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Schedule.Web.Models
{
    public interface IShift
    {
        int Id { get; set; }
        ShiftType WorkType { get; set; }
        string EmployeeName { get; set; }
        string TeamName { get; set; }
        DateTime StartTime { get; set; }
        DateTime EndTime { get; set; }
        bool CoveringOtherShift { get; set; }
        bool CoverageNeeded { get; set; }
        bool AllDay { get; set; }
    }
}
