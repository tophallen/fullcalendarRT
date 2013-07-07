namespace Schedule.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class renamed : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CalEvents",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EmployeeName = c.String(),
                        TeamName = c.String(),
                        WorkType = c.Int(nullable: false),
                        StartTime = c.DateTime(nullable: false),
                        EndTime = c.DateTime(nullable: false),
                        AllDay = c.Boolean(nullable: false),
                        Notes = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            DropTable("dbo.Shifts");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Shifts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EmployeeName = c.String(),
                        TeamName = c.String(),
                        WorkType = c.Int(nullable: false),
                        StartTime = c.DateTime(nullable: false),
                        EndTime = c.DateTime(nullable: false),
                        CoveringOtherShift = c.Boolean(nullable: false),
                        CoverageNeeded = c.Boolean(nullable: false),
                        AllDay = c.Boolean(nullable: false),
                        Notes = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            DropTable("dbo.CalEvents");
        }
    }
}
