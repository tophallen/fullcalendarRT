using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Calendar.Data
{
    public class ShiftHelper
    {
        public static ShiftType TryParse(string shiftType)
        {
            ShiftType shift;
            int value;
            switch (shiftType)
            {
                case "Coverage":
                    value = 0;
                    break;
                case "Scheduled":
                    value = 1;
                    break;
                case "Vacation":
                    value = 2;
                    break;
                case "Training":
                    value = 3;
                    break;
                case "Meeting":
                    value = 4;
                    break;
                default:
                    return ShiftType.Scheduled;
            }
            shift = (ShiftType)value;
            return shift;
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
