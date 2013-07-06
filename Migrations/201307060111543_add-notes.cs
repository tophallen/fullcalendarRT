namespace Schedule.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addnotes : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Shifts", "Notes", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Shifts", "Notes");
        }
    }
}
