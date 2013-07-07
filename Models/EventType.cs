using System;
using System.Collections.Generic;

namespace Schedule.Web.Models
{
    public class EventHelper
    {
        public static EventType TryParse(string eventType)
        {
            return (EventType)Enum.Parse(typeof(EventType), eventType);
        }

        public static EventType TryParse(int eventType)
        {
            return (EventType)eventType;
        }

        public static Dictionary<int, String> GetTypes()
        {
            Dictionary<int, string> EventTypes = new Dictionary<int, string>();
            int i = 0;
            foreach (var item in typeof(EventType).GetEnumNames())
            {
                EventTypes.Add(i++, item);
            }
            return EventTypes;
        }
    }

    public enum EventType
    {
        Coverage,
        Scheduled,
        Vacation,
        Training,
        Meeting
    }
}
