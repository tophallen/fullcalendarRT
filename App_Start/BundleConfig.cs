using System.Web;
using System.Web.Optimization;

namespace Schedule.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/json2").Include(
                        "~/js/libs/json2.js"));

            bundles.Add(new ScriptBundle("~/js/jquery").Include(
                        "~/js/month/jquery-{version}.js",
                        "~/js/month/jquery-ui-{version}.custom.js"));

            bundles.Add(new ScriptBundle("~/js/jqueryval").Include(
                        "~/js/libs/jquery.unobtrusive*",
                        "~/js/libs/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/js/knockout").Include(
                        "~/js/libs/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/js/calendar").Include(
                        "~/js/month/fullcalendar.js"));

            bundles.Add(new ScriptBundle("~/js/data").Include(
                "~/js/month/calendarinit.js",
                "~/js/month/calendarfunction.js",
                "~/js/month/calendardata.js"));

            bundles.Add(new ScriptBundle("~/js/signalr").Include(
                        "~/js/libs/jquery.signalR*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/js/modernizr").Include(
                        "~/js/libs/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/css/site.css"));

            bundles.Add(new StyleBundle("~/css/calendar").Include(
                "~/css/month/fullcalendar.css",
                "~/css/month/theme.css",
                "~/css/month/eventTypes.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/css/themes/base/jquery-ui-1.10.3.custom.css"));
        }
    }
}