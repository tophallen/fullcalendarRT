using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Schedule.Web.Models
{
    public class ShiftHelper
    {
        public static ShiftType TryParse(string shiftType)
        {
            return (ShiftType)Enum.Parse(typeof(ShiftType), shiftType);
        }

        public static ShiftType TryParse(int shiftType)
        {
            return (ShiftType)shiftType;
        }

        public static Dictionary<int, String> GetTypes()
        {
            Dictionary<int, string> WorkTypes = new Dictionary<int, string>();
            int i = 0;
            foreach (var item in typeof(ShiftType).GetEnumNames())
            {
                WorkTypes.Add(i++, item);
            }
            return WorkTypes;
        }
    }

    public enum ShiftType
    {
        Coverage,
        Scheduled,
        Vacation,
        Training,
        Meeting
    }
}
