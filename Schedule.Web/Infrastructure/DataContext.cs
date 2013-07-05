using Calendar.Data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using System.Linq;
using System.Web;

namespace Schedule.Web.Infrastructure
{
    public class DataContext : DbContext, ICalendarRepository
    {
        public DataContext()
            : base("DefaultConnection")
        {

        }

        private bool _disposed;

        public DbSet<Shift> Shifts { get; set; }

        #region methods
        
        void ICalendarRepository.Save()
        {
            SaveChanges();
        }

        void ICalendarRepository.Add(Shift item)
        {
            Shifts.Add(item);
        }

        void ICalendarRepository.Modify(Shift item, Shift old)
        {
            Detach(old);
            this.Shifts.Attach(item);
            this.Entry(item).State = System.Data.EntityState.Modified;
        }

        void ICalendarRepository.Remove<T>(T entity)
        {
            Delete(entity);
        }

        void Delete<T>(T entity)
        {
            ObjectContext context = ((IObjectContextAdapter)this).ObjectContext;
            context.DeleteObject(entity);
        }

        void Detach<T>(T entity)
        {
            ObjectContext context = ((IObjectContextAdapter)this).ObjectContext;
            context.Detach(entity);
        }
        #endregion

        void ICalendarRepository.Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual new void Dispose(bool disposing)
        {
            if (!this._disposed)
            {
                if (disposing)
                {
                    this.Dispose();
                }
                _disposed = true;
            }
        }

        #region properties

        IQueryable<Shift> ICalendarRepository.Shifts
        {
            get { return Shifts; }
        }
        #endregion
    }
}