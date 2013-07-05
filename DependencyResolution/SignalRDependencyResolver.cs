using Microsoft.AspNet.SignalR;
using StructureMap;
using StructureMap.Configuration.DSL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schedule.Web.DependencyResolution
{
    public class SignalRDependencyResolver : DefaultDependencyResolver
    {
        private IContainer _container;

        public SignalRDependencyResolver(IContainer container)
        {
            _container = container;
        }

        public override object GetService(Type serviceType)
        {
            object service = null;
            if (!serviceType.IsAbstract && !serviceType.IsInterface &&
                serviceType.IsClass)
            {
                service = _container.GetInstance(serviceType);
            }
            else
            {
                service = _container.TryGetInstance(serviceType) ??
                    base.GetService(serviceType);
            }
            return service;
        }

        public override IEnumerable<object> GetServices(Type serviceType)
        {
            var objects = _container.GetAllInstances(serviceType).Cast<object>();
            return objects.Concat(base.GetServices(serviceType));
        }
    }

    public class ExtensionsRegistry : Registry
    {
        public ExtensionsRegistry()
        {
            For<IDependencyResolver>().Add<SignalRDependencyResolver>();
        }
    }
}