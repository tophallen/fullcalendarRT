using Schedule.Web.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hosting;
using Microsoft.AspNet.SignalR.Infrastructure;
using Owin;
using Schedule.Web.DependencyResolution;
using Schedule.Web.Hubs;
using Schedule.Web.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Routing;

namespace Schedule.Web
{
    public static class Push
    {
        public static void Config()
        {
            GlobalHost.DependencyResolver.Register(typeof(EventHub),
                () => new EventHub(new DataContext()));


            RouteTable.Routes.MapHubs("push", 
                new HubConfiguration { EnableJavaScriptProxies = true, 
                    EnableCrossDomain = true, EnableDetailedErrors = true });
        }
    }
}