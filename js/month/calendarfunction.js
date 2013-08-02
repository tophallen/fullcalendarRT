///<reference path="~/js/libs/_references.js" />

/*********************************/
/*     Date Parsing/Handlers     */
/*********************************/
validateTimes = function (startDate, endDate) {
    return new Date(startDate).getTime() >= new Date(endDate).getTime();
};

dateSplitter = function (date) {
    date = new Date(date);
    var month = date.getMonth() + 1;
    return self.checkTimeParsing(month) + "/" + self.checkTimeParsing(date.getDate()) +
        "/" + date.getFullYear();
};

timeSplitter = function (date) {
    date = new Date(date);
    return date.getHours() + ":" + self.checkTimeParsing(date.getMinutes());
};

//This function needs some work, as this will return a
dateCombiner = function (date, time) {
    var mdy = date.split('/'),
        hm = time.split(':');
    //my.vm.logger(new Date(mdy[2], mdy[0], mdy[1], hm[0], hm[1], 0), logAs.Info);
    return new Date(mdy[2], mdy[0] - 1, mdy[1], hm[0], hm[1], 0);
};

localEventDateParse = function (newDate) {
    my.vm.logger(newDate, logAs.Info);
    return newDate;
};

localEventDatePreventShift = function (date) {
    date = new Date(date);
    var offset = date.getTimezoneOffset() / 60;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
        date.getHours() + offset, date.getMinutes(), date.getSeconds());
};

checkTimeParsing = function (i) {
    return (i < 10 ? '0' : '') + i;
}

function makeUniversalTime(e) {
    if (!e.start.match(/Z/))
        e.start = e.start + "Z";
    if (!e.end.match(/Z/))
        e.end = e.end + "Z";
    return e;
}