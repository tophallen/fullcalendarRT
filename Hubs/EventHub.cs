﻿using System;
using System.Linq;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Schedule.Web.Models;
using System.Collections.Generic;

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
            var obj = CalendarEvent.ToDatabase(data);
            var old = _db.Shifts.Single(c => c.Id == obj.Id);
            _db.Modify(obj as CalEvent, old);
            _db.Save();
            data = CalendarEvent.FromDatabase(obj);
            if (old.TeamName != data.description)
            {
                if (old.TeamName == "all")
                {
                    Clients.All.removeEvent(old);
                }
                else
                {
                    Clients.Group(old.TeamName).removeEvent(CalendarEvent.FromDatabase(old));
                    try
                    {
                        Clients.Group(old.TeamName + "#" + old.EmployeeName)
                            .removeEvent(CalendarEvent.FromDatabase(old));
                    }
                    catch (Exception e)
                    {
                        Clients.Caller.logger(e.Message, 2);
                    }
                }
                if (data.description != "all")
                {
                    Clients.Group(data.description).newEvent(data);
                }
            }
            if (data.description != "all")
            {
                Clients.Group(data.description).modifyEvent(data);
                Clients.Group("all").modifyEvent(data);
                try
                {
                    Clients.Group(data.description + "#" + data.title).modifyEvent(data);
                }
                catch (Exception e)
                {
                    Clients.Caller.logger(e.Message, 2);
                }
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
            var obj = CalendarEvent.ToDatabase(data);
            _db.Add(obj as CalEvent);
            _db.Save();
            data = CalendarEvent.FromDatabase(obj);
            if (data.description != "all")
            {
                Clients.Group(data.description).newEvent(data);
                try
                {
                    Clients.Group(data.description + "#" + data.title).newEvent(data);
                }
                catch (Exception e) {
                    Clients.Caller.logger(e.Message, 2);
                }
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
            if (!dateInfo.team.Contains("#"))
            {
                try
                {
                    IQueryable<CalEvent> items;
                    IQueryable<CalEvent> LongItems;
                    IQueryable<CalEvent> Ongoing;
                    IQueryable<CalEvent> broadcastItems;
                    if (dateInfo.team != "all")
                    {
                        items = _db.Shifts.Where(c => c.TeamName == dateInfo.team
                            && c.StartTime >= dateInfo.start
                            && c.StartTime <= dateInfo.end);
                        LongItems = _db.Shifts.Where(c => c.TeamName == dateInfo.team
                            && c.EndTime >= dateInfo.start
                            && c.EndTime <= dateInfo.end);
                        Ongoing = _db.Shifts.Where(c => c.TeamName == dateInfo.team
                            && c.StartTime <= dateInfo.start
                            && c.EndTime >= dateInfo.end);
                        try
                        {
                            broadcastItems = _db.Shifts.Where(c => c.TeamName == "all"
                                && c.StartTime >= dateInfo.start
                                && c.StartTime <= dateInfo.end);
                            foreach (var item in broadcastItems)
                            {
                                var data = CalendarEvent.FromDatabase(item);
                                Clients.Caller.newEvent(data);
                            }
                        }
                        catch (Exception e)
                        {
                            Clients.Caller.logger(e.Message, 2);
                        }
                    }
                    else
                    {
                        items = _db.Shifts.Where(c => c.StartTime >= dateInfo.start
                            && c.StartTime <= dateInfo.end);
                        LongItems = _db.Shifts.Where(c => c.EndTime >= dateInfo.start
                            && c.EndTime <= dateInfo.end);
                        Ongoing = _db.Shifts.Where(c => c.StartTime <= dateInfo.start
                            && c.EndTime >= dateInfo.end);
                    }
                    var AllItems =  items.ToList();
                    foreach (var item in LongItems)
                    {
                        if (!AllItems.Contains(item))
                            AllItems.Add(item);
                    }
                    foreach (var item in Ongoing)
                    {
                        if (!AllItems.Contains(item))
                            AllItems.Add(item);
                    }
                    foreach (var item in AllItems)
                    {
                        var data = CalendarEvent.FromDatabase(item);
                        Clients.Caller.newEvent(data);
                    }
                }
                catch (Exception e)
                {
                    Clients.Caller.logger(e.Message, 2);
                }
            }
            else
            {
                var hash = dateInfo.team.Split('#')[1];
                var team = dateInfo.team.Split('#')[0];
                try
                {
                    IQueryable<CalEvent> items;
                    IQueryable<CalEvent> LongItems;
                    IQueryable<CalEvent> Ongoing;
                    IQueryable<CalEvent> broadcastItems;
                        items = _db.Shifts.Where(c => c.EmployeeName == hash 
                            && c.TeamName == team
                            && c.StartTime >= dateInfo.start
                            && c.StartTime <= dateInfo.end);
                    LongItems = _db.Shifts.Where(c => c.EmployeeName == hash
                            && c.TeamName == team
                            && c.EndTime >= dateInfo.start
                            && c.EndTime <= dateInfo.end);
                    Ongoing = _db.Shifts.Where(c => c.EmployeeName == hash
                            && c.TeamName == dateInfo.team
                            && c.StartTime <= dateInfo.start
                            && c.EndTime >= dateInfo.end);
                        try
                        {
                            broadcastItems = _db.Shifts.Where(c => c.TeamName == "all"
                                && c.StartTime >= dateInfo.start
                                && c.StartTime <= dateInfo.end);
                            foreach (var item in broadcastItems)
                            {
                                var data = CalendarEvent.FromDatabase(item);
                                Clients.Caller.newEvent(data);
                            }
                        }
                        catch (Exception e)
                        {
                            Clients.Caller.logger(e.Message, 2);
                        }
                        var AllItems = items.ToList();
                        foreach (var item in LongItems)
                        {
                            if (!AllItems.Contains(item))
                                AllItems.Add(item);
                        }
                        foreach (var item in Ongoing)
                        {
                            if (!AllItems.Contains(item))
                                AllItems.Add(item);
                        }
                        foreach (var item in AllItems)
                        {
                            var data = CalendarEvent.FromDatabase(item);
                            Clients.Caller.newEvent(data);
                        }
                }
                catch (Exception e)
                {
                    Clients.Caller.logger(e.Message, 2);
                }
            }
        }

        public void Logger(string log, int errorType)
        {
            Clients.Caller.logger(log, errorType);
        }

        async public Task JoinGroup(string Group)
        {
            Clients.Caller.logger("Connected to Group", 3);
            var id = Context.ConnectionId;
            await Groups.Add(id, Group);
        }

        async public Task LeaveGroup(string Group)
        {
            Clients.Caller.logger("Disconnected from Group", 3);
            await Groups.Remove(Context.ConnectionId, Group);
        }

        public override Task OnDisconnected()
        {
            var path = Context.Request.Url.AbsolutePath.Split('/');
            var group = path[path.Length - 1];
            Groups.Remove(Context.ConnectionId, group);
            Clients.Caller.logger("Disconnected from Server", 1);
            return base.OnDisconnected();
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            Clients.Caller.logger("Connected to Server", 1);
            return base.OnConnected();
        }
    }
}