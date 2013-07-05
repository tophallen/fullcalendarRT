using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Schedule.Web.Models
{
    public interface ICalendarRepository
    {
        IQueryable<Shift> Shifts { get; }

        void Save();

        void Add(Shift item);

        void Modify(Shift item, Shift old);

        void Remove<T>(T entity);

        void Dispose();
    }
}
