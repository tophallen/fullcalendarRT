fullcalendarRT
==============

fullcalendarRT is a real-time version of Adam Shaw's fullcalendar
with signalR as the real-time framework, built on a MVC site

### Features

- Support for IE10, Firefox, and Chrome
- Simultaneous event editing handling
- support for slower connections
- knockout.js view updating outside of fullcalendar
- unlimited team and group support
- perfect for teams in an org or individuals in a team

The data is managed and stored in the project with the Entity Framework
and SQL, but it wouldn't be hard to impletement a NoSQL db with this.

Events are pushed to groups, which you join by url.
i.e. http://localhost/test will only show events that are part of the test group etc.
the only exception to this rule is that http://localhost/all or http://localhost/ will
show all events from all teams. http://localhost/ will prompt you to pick a team to view, 
but all is one of the options.
	
I built this as a team calendar at work, we just needed a simple scheduler, and with the way it scales
for different teams, it is just what we wanted.

I have a demo set up for this
- http://calendar.tophallen.com

[cal]: http://calendar.tophallen.com

More features and support to come.
