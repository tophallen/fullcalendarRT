fullcalendarRT
==============

fullcalendarRT is a real-time version of Adam Shaw's fullcalendar (https://github.com/arshaw/fullcalendar)
with signalR as the real-time framework, built on a MVC site

### Features

- Support for IE10, Firefox, and Chrome
- Simultaneous event editing handling
- support for slower connections
- knockout.js view updating outside of fullcalendar
- unlimited team and group support
- perfect for teams in an org or individuals in a team
- also works for individuals within a team within an org

note: IE8 works, but still has a couple bugs being worked out.

The data is managed and stored in the project with the Entity Framework
and SQL, but it wouldn't be hard to impletement a NoSQL db with this.

Events are pushed to groups, which you join by url.
i.e. `http://localhost/test` will only show events that are part of the test group etc.
the only exception to this rule is that `http://localhost/all` or `http://localhost/` will
show all events from all teams. `http://localhost/` will prompt you to pick a team to view, 
but all is one of the options.

To see individual persons or event types within a team you can use `http://localhost/test#foobar`
the hash will filter for only events on that team with the title of the hash making it easier to have
users or specific projects within the same team
	
I built this as a team calendar at work, we just needed a simple scheduler, and with the way it scales
for different teams, it is just what we wanted.

I have a demo set up for this
- [http://calendar.tophallen.com] (http://calendar.tophallen.com)

to enable logging:
in ~/js/month/calendardata.js set `self.enableLogging = ko.observable(true);` (it's at line 9) or you can
type `http://hostname/?debug=true` to override the setting in the js file
to true, this will enable logging for both signalR and viewModel, along with the C# hub and the controllers
to disable logging set this to false

If you use this in a production environment, you will want to change `EnableDetailedErrors = false` 
in App_Start\PushConfig for the hub configuration

You can get this project up and running [http://github.com/tophallen/fullcalendarRT/wiki/Getting-Started] (http://github.com/tophallen/fullcalendarRT/wiki/Getting-Started)

