using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Schedule.Web.Hubs
{
    public class MoreDate
    {
        public virtual string team { get; set; }
        public virtual DateTime start { get; set; }
        public virtual DateTime end { get; set; }
    }
}
