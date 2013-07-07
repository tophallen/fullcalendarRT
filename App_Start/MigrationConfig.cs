using Schedule.Web.Migrations;
using System.Data.Entity.Migrations;

namespace Schedule.Web
{
    public class MigrationConfig
    {
        public static void Initialize()
        {
            var migrator = new DbMigrator(new Configuration());
            migrator.Update();
        }
    }
}