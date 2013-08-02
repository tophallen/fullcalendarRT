fullcalendarRT
==============

fullcalendarRT is a real-time version of Adam Shaw's fullcalendar (https://github.com/arshaw/fullcalendar)
with signalR as the real-time framework, built on a MVC site

### Features

- Full Support for IE7++, Firefox, and Chrome
- Simultaneous event editing handling
- support for slower connections
- knockout.js view model
- unlimited team and group support
- perfect for teams in an org and individuals in a team
- support for multiple timezones
- viewable but not editable in mobile devices with modern browsers
- all data is pushed through hub pipeline in signalr, no webapi or ajax calls

The data is managed and stored in the project with the Entity Framework
and SQL, but it wouldn't be hard to impletement a NoSQL db with this.

Events are pushed to groups, which you join by url.
i.e. `http://hostname/test` will only show events that are part of the test group etc.
the only exception to this rule is that `http://hostname/all` or `http://hostname/` will
show all events from all teams. `http://hostname/` will prompt you to pick a team to view, 
but all is one of the options.

To see individual persons or event types within a team you can use `http://hostname/test#foobar`
the hash will filter for only events on that team with the title of the hash making it easier to have
users or specific projects within the same team
	
I built this as a team calendar at work, we just needed a simple scheduler, and with the way it scales
for different teams, it is just what we wanted.

I have a demo set up for this
- [http://calendar.tophallen.com] (http://calendar.tophallen.com)

to enable browser-side logging:
in ~/js/month/calendardata.js set `self.enableLogging = ko.observable(true);` (it's at line 9) or you can
type `http://hostname/?debug=true` to override the setting in the js file on a per load basis. 
This will enable logging for both signalR and viewModel, along with the C# back-end.
To disable logging set this to false or don't add `?debug=true` to the url

If you use this in a production environment, you will want to change `EnableDetailedErrors = false` 
in App_Start\PushConfig for the hub configuration

You can get this project up and running [http://github.com/tophallen/fullcalendarRT/wiki] (http://github.com/tophallen/fullcalendarRT/wiki)

