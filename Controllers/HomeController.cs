using Schedule.Web.Models;
using Microsoft.AspNet.SignalR;
using Schedule.Web.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Schedule.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICalendarRepository _db;
        private IHubContext _context;

        public HomeController(ICalendarRepository db)
        {
            _context = GlobalHost.ConnectionManager.GetHubContext<EventHub>();
            _db = db;
        }

        public ActionResult Index(string id = "all")
        {
            IQueryable<CalEvent> EventList;
            List<string> TeamList = new List<string>();
            try
            {
                EventList = _db.Shifts;
                foreach (var item in EventList)
                {
                    if (!TeamList.Contains(item.TeamName))
                    {
                        TeamList.Add(item.TeamName);
                    }
                }
            }
            catch (Exception e)
            {
                _context.Clients.All.logger(e.Message, "error");
            }
            if (!TeamList.Contains("all"))
            {
                TeamList.Add("all");
            }
            ViewBag.Teams = TeamList;
            try
            {
                ViewBag.typeEvent = EventHelper.GetTypes().Values;
            }
            catch (Exception e)
            {
                _context.Clients.All.logger(e.Message, "error");
            }
            return View();
        }
    }
}
