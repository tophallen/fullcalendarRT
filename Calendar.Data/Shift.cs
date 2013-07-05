using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Calendar.Data
{
    public class Shift : IShift
    {
        public Shift()
        {
            this.WorkType = ShiftType.Scheduled;
        }

        public Shift(IShift results)
        {
            this.CoverageNeeded = results.CoverageNeeded;
            this.CoveringOtherShift = results.CoveringOtherShift;
            this.EmployeeName = results.EmployeeName;
            this.EndTime = results.EndTime;
            this.Id = results.Id;
            this.StartTime = results.StartTime;
            this.WorkType = results.WorkType;
            this.TeamName = results.TeamName;
            this.AllDay = results.AllDay;
        }
        public virtual int Id { get; set; }
        public virtual string EmployeeName { get; set; }
        public virtual string TeamName { get; set; }
        public virtual ShiftType WorkType { get; set; }
        public virtual DateTime StartTime { get; set; }
        public virtual DateTime EndTime { get; set; }
        public virtual bool CoveringOtherShift { get; set; }
        public virtual bool CoverageNeeded { get; set; }
        public virtual bool AllDay { get; set; }
    }
}
