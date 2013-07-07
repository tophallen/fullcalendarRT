using System.Linq;

namespace Schedule.Web.Models
{
    public interface ICalendarRepository
    {
        IQueryable<CalEvent> Shifts { get; }

        void Save();

        void Add(CalEvent item);

        void Modify(CalEvent item, CalEvent old);

        void Remove<T>(T entity);

        void Dispose();
    }
}
