using Calendar.Data;
using Microsoft.AspNet.SignalR;
using Schedule.Web.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Schedule.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICalendarRepository _db;

        public HomeController(ICalendarRepository db)
        {
            _db = db;
        }

        public ActionResult Index(string id = "all")
        {
            var temp = _db.Shifts;
            List<string> theList = new List<string>();
            foreach (var item in temp)
            {
                if (!theList.Contains(item.TeamName))
                {
                    theList.Add(item.TeamName);
                }
            }
            theList.Add("all");
            ViewBag.Teams = theList;
            return View();
        }
    }
}
