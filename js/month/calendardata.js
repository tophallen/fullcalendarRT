///<reference path="~/js/libs/_references.js" />

/*********************************/
/*      Knockout ViewModel       */
/*********************************/
var viewModel = function () {
    var self = this;

    // enable logging here or override with '?debug=true' in url
    self.enableLogging = ko.observable(false);
    
    // the logger can take any object and put it into a JSON string for debugging in any browser 
    //(IE, has trouble with logging objects and functions) and a second param is a number representing
    //the way it should be logged - see logAs enum for types
    self.logger = function (error, errorType) {
        if (self.enableLogging()) {
            if (typeof error === 'object' || typeof error === 'function') {
                error = ko.toJSON(error);
            }
            if (errorType !== 4) {
                error = "[" + new Date().toLocaleTimeString() + "] " + error;
            }
            if (typeof errorType != 'undefined' || errorType != "") {
                switch (errorType) {
                    case 2:
                        console.error(error);
                        break;
                    case 1:
                        console.warn(error);
                        break;
                    case 5:
                        console.log(error);
                        break;
                    case 3:
                        console.info(error);
                        break;
                    default:
                        if (window.console.debug) {
                            window.console.debug(error);
                        } else {
                            Debug.write(error);
                        }
                        break;
                }
            } else {
                console.error(error);
            }
        }
    };

    //variable declaration for viewModel
    self.showError = ko.observable("");
    self.theItem = ko.observable();
    self.userName = ko.observable();
    self.shiftType = ko.observable();
    self.shiftStartTime = ko.observable();
    self.shiftEndTime = ko.observable();
    self.showDelete = ko.observable(false);
    self.dialogTitle = ko.observable("Create a New Event.");
    self.addButtonValue = ko.observable("Create");
    self.workTypeCollection = ko.observableArray();
    self.allDay = ko.observable(false);
    self.theItem = ko.observable();
    self.showTeamOption = ko.observable(false);
    self.selectedTeam = ko.observable();
    self.isLive = ko.observable(false);
    self.event = "";
    self.calendar = "";
    self.calendarHolder = ko.observableArray([]);
    self.redirectTeam = ko.observable();
    self.eventList = ko.observableArray([]);
    self.selectedNotes = ko.observable();
    self.showTitle = ko.observable(true);
    self.titleFromHash = ko.observable("");
    self.ratio = ko.observable(.7);
    self.legacyStartDate = ko.observable();
    self.legacyStartTime = ko.observable();
    self.legacyEndDate = ko.observable();
    self.legacyEndTime = ko.observable();

    /*********************************/
    /*        Event Handling         */
    /*********************************/

    //for new events, this will push the event to the calendar UI
    self.pushEvents = function (event) {
        self.eventList.push(event);
        $('#calendar').fullCalendar('renderEvent', event, false);
    };

    //for events already in the calendar, this will grab the old item and update it
    self.pushModifyEvent = function (event) {
        self.logger(event, logAs.Error);
        if (!ieEightMinus) {
            var temper = self.eventList.remove(function (data) {
                return data.id == event.id;
            });
        } else {
            try {
                var temper = self.eventList.remove(function (data) {
                    return data.id == event.id;
                });
            } catch (e) {
                var temper = self.theItem();
            }
        }
        self.logger(temper, logAs.Warning);
        var temp = $("#calendar").fullCalendar('clientEvents', function (data) {
            return data.id == event.id;
        });
        self.logger(temp, logAs.Info);
        var temp1 = temp[0];
        if (ieEightMinus) {
            temp1.title = event.title;
            temp1.start = localEventDateParse(event.start);
            temp1.end = localEventDateParse(event.end);
            temp1.description = event.description;
            temp1.allDay = event.allDay;
            temp1.className = event.className;
            temp1.note = event.note;
            self.logger(temp1, logAs.Info);
            $('#calendar').fullCalendar('removeEvents', temp1.id);
            $('#calendar').fullCalendar('renderEvent', temp1, false);
        } else {
            temp1.title = event.title;
            temp1.start = localEventDateParse(event.start);
            temp1.end = localEventDateParse(event.end);
            temp1.description = event.description;
            temp1.allDay = event.allDay;
            temp1.className = event.className;
            temp1.note = event.note;
            self.logger(temp1, logAs.Info);
            $('#calendar').fullCalendar('updateEvent', temp1);
        }
        try {
            if (temp1.id == self.theItem().id) {
                self.whileChanged(temp1);
            }
        } catch (e) {
        }
        if (ieEightMinus) {
            self.eventList.push(temp1[0]);
        } else {
            self.eventList.push(temp1);
        }
    }

    //for removing events from the calendar
    self.pushRemoveEvent = function (event) {
        if (ieEightMinus) {
            try {
                self.eventList.remove(function (data) { return data.id == event.id; });
            }
            catch (e) { }
        } else {
            self.eventList.remove(function (data) { return data.id == event.id; });
        }
        $("#calendar").fullCalendar('removeEvents', function (data) { return data.id == event.id; })
    }

    //updates other parts of the UI if the event in question is being updated on multiple clients
    //this helps with concurrency issues and keeps the user in the know about event changes
    self.whileChanged = function (event) {
        self.showError("");
        self.theItem(event);
        self.userName(event.title);
        self.shiftType(event.className[0]);
        self.legacyStartDate(dateSplitter(event.start));
        self.legacyStartTime(timeSplitter(event.start));
        self.selectedTeam(event.description);
        self.selectedNotes(event.note);
        try {
            self.allDay(event.allDay);
        } catch (e) {
        }
        try {
            self.legacyEndDate(dateSplitter(event.end));
            self.legacyEndTime(timeSplitter(event.end));
        } catch (e) {
            // no end date, we can live with that ... for now
        }
    };

    //for when a user clicks add or save in the editor dialog, this collects the data from the dialog
    //and adds it to the data, if it is an already existing event, then it is sent to modify the event,
    //if it is a new event it will push this to the new event pipeline
    self.submitEvent = function () {
        var tempstart;
        var tempend;
            tempstart = dateCombiner(self.legacyStartDate(), self.legacyStartTime());
            tempend = dateCombiner(self.legacyEndDate(), self.legacyEndTime());
        var theItem = {
            start: tempstart,
            end: tempend,
            allDay: self.allDay(),
            className: [self.shiftType()],
            description: "",
            title: self.userName(),
            note: self.selectedNotes()
        };
        if (self.showTeamOption()) { theItem.description = self.selectedTeam(); }
        else { theItem.description = self.groupName().split('#')[0]; }
        try {
            theItem.id = self.theItem().id;
        } catch (e) { theItem.id = 0; }
        try {
            var temper = self.eventList.remove(function (data) {
                return data.id == self.theItem().id;
            });
            if (typeof (temper[0]) == 'undefined') {
                temper = { start: "", end: "", id: "", allDay: "", className: "", description: "", title: "" };
            }
            else { temper = temper[0]; }
        } catch (e) {
            temper = {
                start: "", end: "", id: "", allDay: "", className: "",
                description: "", title: ""
            };
        }
        temper.start = tempstart;
        temper.end = tempend;
        temper.id = theItem.id;
        temper.allDay = self.allDay();
        temper.className = [self.shiftType()];
        temper.note = self.selectedNotes();
        if (self.showTeamOption()) { temper.description = self.selectedTeam(); }
        else { temper.description = self.groupName().split('#')[0]; }
        temper.title = self.userName();
        if (self.userName().length <= 1) { self.showError("What's the name of it?"); }
        else {
            if (validateTimes(tempstart, tempend)) {
                self.showError("Your dates are a little odd...");
            } else {
                self.showError("");
                var event = theItem;
                self.theItem(event);
                self.logger(event, logAs.Log);
                if (self.showDelete()) {
                    self.event.server.modifyEvent(event).done(function () {
                        $("#dialogNewEvent").dialog('close');
                    }).fail(function (error) {
                        self.showError("There was something wrong with posting, try again or contact help.");
                    });
                } else {
                    self.event.server.newEvents(event).done(function () {
                        $("#dialogNewEvent").dialog('close');
                    }).fail(function (error) {
                        self.showError("There was something wrong with posting, try again or contact help.");
                    });
                }
            }
        }
    };

    //for non-commitally leaving the dialog to edit or create an event.
    self.cancelEvent = function () {
        $("#dialogNewEvent").dialog('close');
    };

    self.deleteEvent = function () {
        var eventAll = self.eventList.remove(function (data) { return data.id == self.theItem().id });
        self.eventList.push(eventAll[0]);
        var event = eventAll[0];
        self.event.server.removeEvent({
            id: event.id,
            title: event.title,
            allDay: event.allDay,
            start: event.start,
            end: event.end,
            className: event.className,
            description: event.description,
            note: event.note
        }).done(function () {
        }).fail(function (error) {
            console.error("Error my friend");
        });
        $("#dialogNewEvent").dialog('close');
    };

    /*********************************/
    /*          The Calendar         */
    /*********************************/

    // see the fullCalendar documentation if you want to know what is being done here
    $(document).ready(function () {
        window.onresize = function () {
            var val = (window.outerWidth / window.outerHeight) * 1.35;
            $('#calendar').fullCalendar('option', 'aspectRatio', val);
        };
        var date = new Date();
        var editable = true,
            rightButtons = '',
            defaultView = 'agendaDay',
            ratio = .7,
            dayForm = 'dddd, MMM d, yyyy',
            menuOpt = 'prev,next today';
        if (!isMobile) {
            rightButtons = 'month,agendaWeek,agendaDay';
            defaultView = 'month';
        } else { editable = false; dayForm = 'MMM d, yyyy'; rightButtons = 'today'; menuOpt = 'prev,next'; }
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        self.calendar = $('#calendar').fullCalendar({
            theme: true,
            header: {
                left: menuOpt,
                center: 'title',
                right: rightButtons
            },
            titleFormat: {
                day: dayForm
            },
            defaultView: defaultView,
            editable: editable,
            weekMode: 'liquid',
            aspectRatio: (window.outerWidth / window.outerHeight) * 1.35,
            timeFormat: {
                '': 'H(:mm){ - H(:mm)}'
            },
            eventSource: self.calendarHolder,
            events: function (start, end, callback) {
                //checks if signalR pipeline is running to prevent unneeded exceptions
                if (self.isLive()) {
                    self.event.server.getMoreEvents({
                        team: self.groupName(),
                        start: start,
                        end: end
                    });
                }
            },
            eventResize: function (event, dayDelta, minuteDelta, jsEvent, ui, view) {
                if (!ieEightMinus) {
                    var temper = self.eventList.remove(function (data) {
                        return data.id == event.id;
                    });
                    self.eventList.push(temper[0]);
                } else {
                    try {
                        var temper = self.eventList.remove(function (data) {
                            return data.id == event.id;
                        });
                        self.eventList.push(temper[0]);
                    } catch (e) {

                    }
                }
                self.event.server.modifyEvent({
                    id: event.id,
                    title: event.title,
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                    className: event.className,
                    description: event.description,
                    note: event.note
                }).done(function () {
                }).fail(function (error) {
                    revertFunc();
                });
            },
            eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
                if (!ieEightMinus) {
                    var temper = self.eventList.remove(function (data) {
                        return data.id == event.id;
                    });
                    self.eventList.push(temper[0]);
                } else {
                    try {
                        var temper = self.eventList.remove(function (data) {
                            return data.id == event.id;
                        });
                        self.eventList.push(temper[0]);
                    } catch (e) {

                    }
                }
                self.event.server.modifyEvent({
                    id: event.id,
                    title: event.title,
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                    className: event.className,
                    description: event.description,
                    note: event.note
                }).done(function () {

                }).fail(function (error) {
                    self.logger("Unable to persist the change", logAs.Error);
                    revertFunc();
                });
            },
            eventRender: function (event, element, view) {
                if ((view.name === "agendaWeek" || view.name === "agendaDay")
                    && !event.allDay && event.note != null) {
                    element.find('.fc-event-inner').append("<div class='fc-event-note'>" + event.note + "</div>");
                }
            },
            dayClick: function (date, allDay, jsEvent, view) {
                if (!isMobile) {
                    self.showError("");
                    if (self.showTitle()) {
                        self.userName("");
                    } else {
                        self.userName(self.titleFromHash());
                    }
                    var start = new Date();
                    var end = new Date();
                    self.selectedNotes("");
                    if (allDay) {
                        start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0);
                        end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0, 0);
                    } else {
                        start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
                        end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, date.getMinutes(), 0);
                    }
                    self.legacyStartDate(dateSplitter(start));
                    self.legacyStartTime(timeSplitter(start));
                    self.legacyEndDate(dateSplitter(end));
                    self.legacyEndTime(timeSplitter(end));
                    self.showDelete(false);
                    self.allDay(allDay);
                    if (self.groupName() != "all") {
                        self.selectedTeam(self.groupName().split('#')[0]);
                    }
                    self.addButtonValue("Create");
                    self.dialogTitle("New Event.");
                    $("#dialogNewEvent").dialog("open");
                }
            },
            eventClick: function (calEvent, jsEvent, view) {
                self.showError("");
                self.theItem(calEvent);
                self.userName(calEvent.title);
                self.shiftType(calEvent.className[0]);
                self.legacyStartDate(dateSplitter(calEvent.start));
                self.legacyStartTime(timeSplitter(calEvent.start));
                self.selectedNotes(calEvent.note);
                self.selectedTeam(calEvent.description);
                try {
                    self.allDay(calEvent.allDay);
                } catch (e) {
                }
                try {
                    self.legacyEndDate(dateSplitter(calEvent.end));
                    self.legacyEndTime(timeSplitter(calEvent.end));
                } catch (e) {
                    // no end date, we can live with that ... for now
                }
                self.addButtonValue("Save");
                self.dialogTitle("Edit Event.");
                self.showDelete(true);
                $("#dialogNewEvent").dialog("open");
            }
        });

    });

    /*********************************/
    /*      SignalR Initializer      */
    /*********************************/
    self.signalHook = function () {
        if (window.location.search.match(/debug=true/)) {
            self.enableLogging(true);
        }
        $.connection.hub.logging = self.enableLogging();

        self.event = $.connection.eventHub;
        self.event.client.newEvent = self.pushEvents;
        self.event.client.modifyEvent = self.pushModifyEvent;
        self.event.client.removeEvent = self.pushRemoveEvent;
        self.event.client.logger = self.logger;
        $.connection.hub.start().done(function () {
            self.groupNameGetter();
        }).fail(function (error) {
            self.logger(error, logAs.Error);
        });
    }();

    self.groupName = ko.observable("");
    self.groupNameGetter = function () {
        var hash = location.hash.replace('#', '');
        var gn = window.location.pathname.replace(/[/]/g, '');
        if (gn.length <= 1) {
            gn = "all";
            self.showTeamOption(true);
            $("#pickTeam").dialog('open');
        } else if (gn == "all") {
            self.showTeamOption(true);
        }
        if (hash != "") {
            self.groupName(gn + "#" + hash);
            self.showTitle(false);
            self.titleFromHash(hash);
        } else {
            self.groupName(gn);
            self.showTitle(true);
            self.titleFromHash("");
        }
        self.event.server.joinGroup(self.groupName()).done(function () {
            self.isLive(true);
            self.logger("Joined group: " + self.groupName(), logAs.Info);
            $('#calendar').fullCalendar('refetchEvents');
        }).fail(function (error) {
            self.logger("There was something wrong with joining, try again or contact help.", logAs.Error);
        });
    };
    self.hashGetter = function () {
        var gn = location.hash.replace('#','');
        self.event.server.leaveGroup(self.groupName()).done(function () {
            if (gn == "") {
                self.groupName(window.location.pathname.replace(/[/]/g, ''));
                self.showTitle(true);
                self.titleFromHash("");
            } else {
                self.groupName(window.location.pathname.replace(/[/]/g, '') + "#" + gn);
                self.showTitle(false);
                self.titleFromHash(gn);
            }
            self.event.server.joinGroup(gn).done(function () {
                self.isLive(true);
                self.logger("Joined group: " + self.groupName(), logAs.Info);
                $('#calendar').fullCalendar('refetchEvents');
            }).fail(function (error) {
                self.logger("There was something wrong with joining, try again or contact help.", logAs.Error);
            });
        }).fail(function (error) { self.logger("Failed to leave the group", logAs.Error); });
    };
    window.onhashchange = function () { self.hashGetter(); }
};