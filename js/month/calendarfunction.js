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

dateCombiner = function (date, time) {
    var mdy = date.split('/'),
        hm = time.split(':');
    my.vm.logger(new Date(mdy[2], mdy[0], mdy[1], hm[0], hm[1], 0), logAs.Info);
    return new Date(mdy[2], mdy[0] - 1, mdy[1], hm[0], hm[1], 0);
};

localEventDateParse = function (date) {
    my.vm.logger(date.split('T')[1].split(':')[2].split('-')[1], logAs.Info);
    if (!ieEightMinus) {
        date = new Date(date);
        my.vm.logger(date, logAs.Info);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds());
    } else {
        //! - <= IE8 fix
        var forParse = date.split('T');
        var time = {
            year: forParse[0].split('-')[0],
            month: forParse[0].split('-')[1],
            day: forParse[0].split('-')[2],
            hour: forParse[1].split(':')[0],
            minute: forParse[1].split(':')[1],
            seconds: forParse[1].split(':')[2].split('-')[0],
            offset: forParse[1].split(':')[2].split('-')[1]
        };
        my.vm.logger(time, logAs.Info);
        return time.year + "-" + time.month + "-" + time.day + "T" + time.hour +
            ":" + time.minute + ":" + time.seconds + "Z";
    }
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