///<reference path="../_references.js" />
/*********************************/
/*        Browser Check          */
/*********************************/
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6
if (!isChrome) {
    $("#endDate").attr('data-bind', 'value: legacyEndDate');
    $("#endTime").attr('data-bind', 'value: legacyEndTime');
    $("#startDate").attr('data-bind', 'value: legacyStartDate');
    $("#startTime").attr('data-bind', 'value: legacyStartTime');
}

/*********************************/
/*      Knockout ViewModel       */
/*********************************/
var viewModel = function () {
    var self = this;

    // enable logging here
    self.enableLogging = ko.observable(false);

    //dialogs
    self.newEventTrigger = function () {
        $("#dialogNewEvent").dialog({
            title: "",
            autoOpen: false,
            modal: true,
            width: 475,
            draggable: true,
            resizable: true
        }).dialog("widget").find(".ui-dialog-title").hide();
        $("#pickTeam").dialog({
            title: "Pick Team:",
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: true,
            buttons: {
                "Pick Team": function () {
                    window.location.pathname = '/' + self.redirectTeam();
                    $(this).dialog('close');
                }
            }
        });
    }();
    //variable declaration for viewModel
    self.showError = ko.observable("");
    self.repeatCount = ko.observable(1);
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

    //for IE and Firefox
    self.legacyStartDate = ko.observable();
    self.legacyStartTime = ko.observable();
    self.legacyEndDate = ko.observable();
    self.legacyEndTime = ko.observable();

    /*********************************/
    /*        Event Handling         */
    /*********************************/
    self.pushEvents = function (event) {
        self.logger(event, "info");
        self.eventList.push(event);
        $('#calendar').fullCalendar('renderEvent', event, false);
    };

    self.pushModifyEvent = function (event) {
        var temper = self.eventList.remove(function (data) {
                return data.id == event.id;
        });
        var temp = $("#calendar").fullCalendar('clientEvents', function (data) {
            return data.id == event.id;
        });
        var temp1 = temp[0];
        temp1.title = event.title;
        temp1.start = self.localEventDateParse(event.start);
        temp1.end = self.localEventDateParse(event.end);
        temp1.description = event.description;
        temp1.allDay = event.allDay;
        temp1.className = event.className;
        temp1.note = event.note;
        $('#calendar').fullCalendar('updateEvent', temp1);
        try {
            if (temp1.id == self.theItem().id) {
                self.whileChanged(temp1);
            }
        } catch (e) {
        }
        self.eventList.push({
            start: temp1.start,
            end: temp1.end,
            id: temp1.id,
            allDay: temp1.allDay,
            className: [temp1.className],
            description: temp1.description,
            title: temp1.title,
            note: temp1.note
        });
    }

    self.pushRemoveEvent = function (event) {
        self.eventList.remove(function (data) { return data.id == event.id; });
        $("#calendar").fullCalendar('removeEvents', function (data) { return data.id == event.id; })
    }

    self.whileChanged = function (event) {
        self.showError("");
        self.theItem(event);
        self.userName(event.title);
        self.shiftType(event.className[0]);
        if (isChrome) {
            self.shiftStartTime(self.htmlInputDate(event.start));
        } else {
            self.legacyStartDate(self.dateSplitter(event.start));
            self.legacyStartTime(self.timeSplitter(event.start));
        }
        self.selectedTeam(event.description);
        self.selectedNotes(event.note);
        try {
            self.allDay(event.allDay);
        } catch (e) {
        }
        try {
            if (isChrome) {
                self.shiftEndTime(self.htmlInputDate(event.end));
            } else {
                self.legacyEndDate(self.dateSplitter(event.end));
                self.legacyEndTime(self.timeSplitter(event.end));
            }
        } catch (e) {
            // no end date, we can live with that ... for now
        }
    };

    self.submitEvent = function () {
        var tempstart;
        var tempend;
        if (isChrome) {
            tempstart = self.localEventDatePreventShift(self.shiftStartTime());
            tempend = self.localEventDatePreventShift(self.shiftEndTime());
        } else {
            tempstart = self.dateCombiner(self.legacyStartDate(), self.legacyStartTime());
            tempend = self.dateCombiner(self.legacyEndDate(), self.legacyEndTime());
        }
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
        } catch (e) { temper = { start: "", end: "", id: "", allDay: "", className: "", description: "", title: "" }; }
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
            if (!self.validateTimes(tempstart, tempend)) {
                self.showError("Your dates are a little odd...");
            } else {
                self.showError("");
                var event = theItem;
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
            console.log("Error my friend");
        });
        $("#dialogNewEvent").dialog('close');
    };

    /*********************************/
    /*          The Calendar         */
    /*********************************/
    $(document).ready(function () {
        var editable = !ieEightMinus;
        var rightButtons = '';
        var defaultView = 'agendaDay';
        var ratio = .7;
        if (!isMobile) {
            rightButtons = 'month,agendaWeek,agendaDay';
            defaultView = 'month';
            ratio = 2;
            editable = false;
        }
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        self.calendar = $('#calendar').fullCalendar({
            theme: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: rightButtons
            },
            defaultView: defaultView,
            editable: editable,
            weekMode: 'liquid',
            aspectRatio: ratio,
            timeFormat: {
                '': 'H(:mm){ - H(:mm)}'
            },
            eventSource: self.calendarHolder,
            events: function (start, end, callback) {
                if (self.isLive()) {
                    self.event.server.getMoreEvents({
                        team: self.groupName(),
                        start: start,
                        end: end
                    });
                }
            },
            eventResize: function (event, dayDelta, minuteDelta, jsEvent, ui, view) {
                var temper = self.eventList.remove(function (data) {
                    return data.id == event.id;
                });
                var endTemp = self.dropDeltaShift(dayDelta, minuteDelta, event.end);
                self.eventList.push(temper[0]);
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
            eventDragStart: function (event, jsEvent, ui, view) {
                //possibly capture the start of a drag, if needed
            },
            eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
                var temper = self.eventList.remove(function (data) {
                    return data.id == event.id;
                });
                var endTemp = self.dropDeltaShift(dayDelta, minuteDelta, event.end);
                self.eventList.push(temper[0]);
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
                    self.logger("Unable to persist the change", "warning");
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
                self.showError("");
                self.userName("");
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
                if (isChrome) {
                    self.shiftStartTime(self.htmlInputDate(start));
                    self.shiftEndTime(self.htmlInputDate(end));
                } else {
                    self.legacyStartDate(self.dateSplitter(start));
                    self.legacyStartTime(self.timeSplitter(start));
                    self.legacyEndDate(self.dateSplitter(end));
                    self.legacyEndTime(self.timeSplitter(end));
                }
                self.showDelete(false);
                self.allDay(allDay);
                if (self.groupName() != "all") {
                    self.selectedTeam(self.groupName().split('#')[0]);
                }
                self.repeatCount(getRepeats(null));
                self.addButtonValue("Create");
                self.dialogTitle("New Event.");
                $("#dialogNewEvent").dialog("open");
            },
            eventClick: function (calEvent, jsEvent, view) {
                self.showError("");
                self.theItem(calEvent);
                self.userName(calEvent.title);
                self.shiftType(calEvent.className[0]);
                if (isChrome) {
                    self.shiftStartTime(self.htmlInputDate(calEvent.start));
                } else {
                    self.legacyStartDate(self.dateSplitter(calEvent.start));
                    self.legacyStartTime(self.timeSplitter(calEvent.start));
                }
                self.selectedNotes(calEvent.note);
                self.selectedTeam(calEvent.description);
                try {
                    self.allDay(calEvent.allDay);
                } catch (e) {
                }
                try {
                    if (isChrome) {
                        self.shiftEndTime(self.htmlInputDate(calEvent.end));
                    } else {
                        self.legacyEndDate(self.dateSplitter(calEvent.end));
                        self.legacyEndTime(self.timeSplitter(calEvent.end));
                    }
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
    /*     Date Parsing/Handlers     */
    /*********************************/
    self.validateTimes = function (startDate, endDate) {
        var startTime = new Date(startDate).valueOf();
        var endTime = new Date(endDate).valueOf();
        if (startTime >= endTime) { return false; }
        else { return true; }
    };
    self.htmlInputDate = function (date) {
        var day = date.getDate();
        var themonth = date.getMonth();
        var theyear = date.getFullYear();
        var jDate = date;
        var hourItem = self.checkTimeParsing(jDate.getHours());
        var dayItem = self.checkTimeParsing(parseInt(day));
        var monthItem = self.checkTimeParsing(parseInt(themonth) + 1);
        var minutes = self.checkTimeParsing(jDate.getMinutes());
        var retVal = theyear + "-" + monthItem.toString() + "-" + dayItem.toString() + "T" + hourItem.toString() + ":" + minutes.toString() +":00";
        return retVal;
    }

    self.dropDeltaShift = function (deltaDay, deltaMinute, date) {
        try {
            var hold = new Date(date);
            var parse = new Date(hold.getUTCFullYear(), hold.getUTCMonth(), hold.getUTCDate() + deltaDay,
                hold.getHours(), hold.getMinutes() + deltaMinute, hold.getSeconds());
            return parse;
        } catch (e) {
            return null;
        }
    };

    self.dateSplitter = function (date) {
        date = new Date(date);
        var month = date.getMonth() + 1;
        return month + "/" + date.getDate() + "/" + date.getFullYear();
    };

    self.timeSplitter = function (date) {
        date = new Date(date);
        return date.getHours() + ":" + self.checkTimeParsing(date.getMinutes());
    };

    self.dateCombiner = function (date, time) {
        var mdy = date.split('/');
        var hm = time.split(':');
        self.logger(new Date(mdy[2], mdy[0], mdy[1], hm[0], hm[1], 0).toDateString(), "info");
        return new Date(mdy[2], mdy[0] - 1, mdy[1], hm[0], hm[1], 0);
    };

    self.localEventDateParse = function (date) {
        date = new Date(date);
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds());
    };

    self.localEventDatePreventShift = function (date) {
        date = new Date(date);
        var offset = date.getTimezoneOffset() / 60;
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getHours() + offset, date.getMinutes(), date.getSeconds());
    };

    self.localEventDateRepeat = function (date) {
        date = new Date(date);
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 7,
            date.getHours(), date.getMinutes(), date.getSeconds()).toUTCString();
    };

    self.checkTimeParsing = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function getRepeats(event) {
        var count = 1;
        for (var i = 0; i < self.eventList().length; i++) {
            try {
                if (self.eventList()[i].id == event.id && typeof self.eventList()[i].id !== 'undefined') {
                    count++;
                }
            } catch (e) {
            }
        }
        if (count > 1) { count--; }
        return count;
    }

    self.loadWorkTypes = function () {
        $.ajax({
            type: 'GET',
            url: '/Api/Events/WorkTypes',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data, textStatus, jqXHR) {
                    var shifties = ko.toJS(data);
                    $.each(shifties, function (index, value) {
                        self.workTypeCollection().push(value);
                    });
                }
            }
        });
        //Query String Checks - besides debug
    }();

    /*********************************/
    /*      SignalR Initializer      */
    /*********************************/
    self.logger = function (error, errorType) {
        if (self.enableLogging()) {
            if (typeof errorType != 'undefined' || errorType != "") {
                switch (errorType) {
                    case "error":
                        console.error(error);
                        break;
                    case "warning":
                        console.warn(error);
                        break;
                    case "log":
                        console.log(error);
                        break;
                    case "info":
                        if (window.console.debug) {
                            window.console.debug(error);
                        } else {
                            console.info(error);
                        }
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
            self.logger(error);
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
        } else {
            self.groupName(gn);
        }
        self.event.server.joinGroup(self.groupName()).done(function () {
            self.isLive(true);
            self.logger("Joined group: " + self.groupName());
            $('#calendar').fullCalendar('refetchEvents');
        }).fail(function (error) {
            self.logger("There was something wrong with joining, try again or contact help.");
        });
    };
    self.hashGetter = function () {
        var gn = location.hash.replace('#','');
        self.event.server.leaveGroup(self.groupName()).done(function () {
            if (gn == "") { self.groupName(window.location.pathname.replace(/[/]/g, '')); } else {
                self.groupName(window.location.pathname.replace(/[/]/g, '') + "#" + gn);
            }
            self.event.server.joinGroup(gn).done(function () {
                self.isLive(true);
                self.logger("Joined group: " + self.groupName());
                $('#calendar').fullCalendar('refetchEvents');
            }).fail(function (error) {
                self.logger("There was something wrong with joining, try again or contact help.");
            });
        }).fail(function (error) { self.logger("Failed to leave the group"); });
    };
    window.onhashchange = function () { self.hashGetter(); }
};