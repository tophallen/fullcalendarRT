///<reference path="~/js/libs/_references.js" />
/*********************************/
/*        Browser Check          */
/*********************************/
var opCheck = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
var browser = {
    isOpera: opCheck,                                   // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    isFirefox: typeof InstallTrigger !== 'undefined',   // Firefox 1.0+
    isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
                                                        // At least Safari 3+: "[object HTMLElementConstructor]"
    isChrome: !!window.chrome && !opCheck,              // Chrome 1+
    isIE: /*@cc_on!@*/false || document.documentMode    // At least IE6
}
if (typeof browser.isIE == 'undefined') { browser.isIE = false; }

$("#endDate").attr('data-bind', 'value: legacyEndDate');
$("#endTime").attr('data-bind', 'value: legacyEndTime');
$("#startDate").attr('data-bind', 'value: legacyStartDate');
$("#startTime").attr('data-bind', 'value: legacyStartTime');

//logging types enum for self.logger();
var logAs = { Warning: 1, Error: 2, Info: 3, Debug: 4, Log: 5 };

$(function initDialogs() {
    $("#dialogNewEvent").dialog({
        title: "",
        autoOpen: false,
        modal: true,
        width: 475,
        draggable: true,
        resizable: true
    });
    $("#pickTeam").dialog({
        title: "",
        height: 150,
        width:150,
        autoOpen: false,
        modal: true,
        draggable: true,
        resizable: true,
        buttons: {
            "Pick Team": function () {
                window.location.pathname = '/' + my.vm.redirectTeam();
                $(this).dialog('close');
            }
        }
    });
});

setTimeout(function () {
    my.vm.logger("Chrome: " + browser.isChrome, logAs.Info),
    my.vm.logger("Firefox: " + browser.isFirefox, logAs.Info),
    my.vm.logger("IE: " + browser.isIE, logAs.Info),
    my.vm.logger("Opera: " + browser.isOpera, logAs.Info),
    my.vm.logger("Mobile Browser:" + isMobile, logAs.Info),
    my.vm.logger("version:" + browserVersionNumber, logAs.Info);
    $("#shiftType option").each(function () {
        my.vm.workTypeCollection().push($(this).val());
    });
}, 500
);