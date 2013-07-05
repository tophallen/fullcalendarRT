namespace Schedule.Web.Migrations
{
    using Calendar.Data;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Schedule.Web.Infrastructure.DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Schedule.Web.Infrastructure.DataContext context)
        {
            var date = DateTime.Now;
            context.Shifts.AddOrUpdate(
                new Shift
                {
                    TeamName = "test",
                    CoverageNeeded = false,
                    CoveringOtherShift = false,
                    EmployeeName = "Chris Allen",
                    StartTime = new DateTime(date.Year, date.Month, date.Day, date.Hour, 0, 0, DateTimeKind.Utc).AddDays(6),
                    EndTime = new DateTime(date.Year, date.Month, date.Day, date.Hour, 0, 0, DateTimeKind.Utc).AddDays(6).AddHours(2),
                    WorkType = ShiftType.Scheduled
                });
        }
    }
}
