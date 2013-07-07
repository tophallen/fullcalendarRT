using Microsoft.AspNet.SignalR;
using Schedule.Web.Hubs;
using Schedule.Web.Infrastructure;
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