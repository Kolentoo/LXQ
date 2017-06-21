define(function (require, exports, module) {
    exports.init = function () {
        exports.rush();
    };

    exports.rush = function () {
        setInterval('rushEndTime()', 60000);
    };

});

var rushEndTime = function () {
    var nowtime = new Date().getTime();
    //var endtime = new Date($(this).attr("endtime")).getTime(); //取结束日期(毫秒值)
    $("#wrapper").find('.rush-timer-wrap').each(function (k, v) {
        var o = $(this);
        nowtime = nowtime + 1000;
        var endtime = new Date(o.data("endtime")).getTime(); //取结束日期(毫秒值)
        var youtime = endtime - nowtime; //还有多久(毫秒值)
        var seconds = youtime / 1000;
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var CDay = days;
        if (CDay.toString().length == 1) {
            CDay = "0" + CDay;
        }
        var CHour = hours % 24;
        if (CHour.toString().length == 1) {
            CHour = "0" + CHour;
        }
        var CMinute = minutes % 60;
        if (CMinute.toString().length == 1) {
            CMinute = "0" + CMinute;
        }
        var CSecond = Math.floor(seconds % 60); //"%"是取余运算，可以理解为60进一后取余数，然后只要余数。
        if (CSecond.toString().length == 1) {
            CSecond = "0" + CSecond;
        }

        if (endtime <= nowtime) {
        }
        else {
            var ot = o.find('.rush-timer-box');
            ot.find('.tian').find('span').text(CDay);
            ot.find('.shi').find('span').text(CHour);
            ot.find('.fen').find('span').text(CMinute);
            //ot.find('.miao').find('span').text(CSecond);
            //console.log(CDay + ":" + CHour + ":"+CMinute);
        }
    });
};

