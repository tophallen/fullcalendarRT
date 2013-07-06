﻿using Schedule.Web.Models;
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
            IQueryable<Shift> temp;
            List<string> theList = new List<string>();
            try
            {
                temp = _db.Shifts;
                foreach (var item in temp)
                {
                    if (!theList.Contains(item.TeamName))
                    {
                        theList.Add(item.TeamName);
                    }
                }
            }
            catch (Exception e)
            {
                var context = GlobalHost.ConnectionManager.GetHubContext<EventHub>();
                context.Clients.All.logger(e.Message, "error");
            }
            if (!theList.Contains("all"))
            {
                theList.Add("all");
            }
            ViewBag.Teams = theList;
            return View();
        }
    }
}
