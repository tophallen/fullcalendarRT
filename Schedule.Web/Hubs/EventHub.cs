using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Schedule.Web.Models;
using Calendar.Data;

namespace Schedule.Web.Hubs
{
    public class EventHub : Hub
    {
        private readonly ICalendarRepository _db;

        public EventHub(ICalendarRepository db)
        {
            _db = db;
        }

        public void ModifyEvent(CalendarEvent data)
        {
            var caller = Context.ConnectionId;
            var offset = DateTimeOffset.Now.Offset.Hours;
            data.start = data.start.ToUniversalTime();
            if (data.end.HasValue)
                data.end = data.end.Value.ToUniversalTime();
            if (data.description == null)
                data.description = "all";
            //handle data to db here
            var obj = CalendarEvent.ToDatabase(data);
            var old = _db.Shifts.Single(c => c.Id == obj.Id);
            _db.Modify(obj as Shift, old);
            _db.Save();
            data = CalendarEvent.FromDatabase(obj);
            if (data.description != "all")
            {
                Clients.Group(data.description).modifyEvent(data);
                Clients.Group("all").modifyEvent(data);
            }
            else
            {
                Clients.All.modifyEvent(data);
            }
        }

        public void NewEvents(CalendarEvent theEvent)
        {
            var caller = Context.ConnectionId;
            var data = theEvent;
            if (data.description == null)
                data.description = "all";
            //handle data to db here
            var obj = CalendarEvent.ToDatabase(data);
            _db.Add(obj as Shift);
            _db.Save();
            data = CalendarEvent.FromDatabase(obj);
            if (data.description != "all")
            {
                Clients.Group(data.description).newEvent(data);
                Clients.Group("all").newEvent(data);
            }
            else
            {
                Clients.All.newEvent(data);
            }
        }

        public void RemoveEvent(CalendarEvent data)
        {
            Clients.All.removeEvent(data);
            var obj = CalendarEvent.ToDatabase(data);
            var old = _db.Shifts.Single(c => c.Id == obj.Id);
            _db.Remove(old);
            _db.Save();
        }

        public void GetMoreEvents(MoreDate dateInfo)
        {
            try
            {
                IQueryable<Shift> items;
                if (dateInfo.team != "all")
                {
                    items = _db.Shifts.Where(c => c.TeamName == dateInfo.team
                        && c.StartTime >= dateInfo.start
                        && c.StartTime <= dateInfo.end);
                }
                else
                {
                    items = _db.Shifts.Where(c => c.StartTime >= dateInfo.start
                        && c.StartTime <= dateInfo.end);
                }
                foreach (var item in items)
                {
                    var data = CalendarEvent.FromDatabase(item);
                    Clients.Caller.newEvent(data);
                }
            }
            catch (Exception)
            {

            }
        }

        async public Task JoinGroup(string Group)
        {
            var id = Context.ConnectionId;
            await Groups.Add(id, Group);
            //try
            //{
            //    IQueryable<Shift> items;
            //    if (Group != "all")
            //    {
            //        items = _db.Shifts.Where(c => c.TeamName == Group 
            //            && c.StartTime.Month == DateTime.Now.Month);
            //    }
            //    else
            //    {
            //        items = _db.Shifts.Where(c => c.StartTime.Month == DateTime.Now.Month);
            //    }
            //    foreach (var item in items)
            //    {
            //        var data = CalendarEvent.FromDatabase(item);
            //        Clients.Caller.newEvent(data);
            //    }
            //}
            //catch (Exception)
            //{

            //}
        }

        async public Task LeaveGroup(string Group)
        {
            await Groups.Remove(Context.ConnectionId, Group);
        }

        public override Task OnDisconnected()
        {
            var path = Context.Request.Url.AbsolutePath.Split('/');
            var group = path[path.Length - 1];
            Groups.Remove(Context.ConnectionId, group);
            return base.OnDisconnected();
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            return base.OnConnected();
        }
    }
}