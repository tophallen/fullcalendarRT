fullcalendarRT
==============

Using fullCalendar (created by Adam Shaw) I plugged it into signalR 
and made a real-time updating team/group based calendar.

The data is managed and stored in the project with the Entity Framework
and SQL, but it wouldn't be hard to impletement a NoSQL db with this.
Events are pushed to groups, which you join by url.

i.e. http://localhost/test will only show events that are part of the test group etc.
the only exception to this rule is that http://localhost/all or http://localhost/ will
show all events from all teams. http://localhost/ will prompt you to pick a team to view, 
but all is one of the options.
	
I built this as a team calendar at work, we just needed a simple scheduler, and with the way it scales
for different teams, it is just what we wanted.

Next in this proj is repeating events...