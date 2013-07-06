using Schedule.Web.Migrations;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

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