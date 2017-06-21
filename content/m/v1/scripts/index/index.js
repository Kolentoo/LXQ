
_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v1/scripts/com/search.js', function () {

});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
    slider.api("j_indexFocus", "j_indexFocusWrap", 5000, true);//详细页面banners
});

 
var geo = navigator.geolocation;

//处理失败
var err = function (error) {
    switch (error.code) {
        case error.TIMEOUT:
            console.log("A timeout occured! Please try again!");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log('We can\'t detect your location. Sorry!');
            break;
        case error.PERMISSION_DENIED:
            console.log('Please allow geolocation access for this to work.');
            break;
        case error.UNKNOWN_ERROR:
            console.log('An unknown error occured!');
            break;
    }
    $('#j_fnHeader').find('.city').text('上海');
};

//处理成功
var suc = function (position) {
    var coords = position.coords;
    var lat = coords.latitude;
    var lon = coords.longitude;
    //wapi.uzai.com
    var u = "http://10.1.3.203:2323/api/UzaiIPHelp/GEOCode/?jingdu=" + lat + "&weidu=" + lon;
    $.ajax({
        url: u,
        type: 'GET',
        dataType: "jsonp",
        success: function (msg) {
            if (msg) {
                if (msg.status === 'OK') {
                    var city = msg.result.addressComponent.city.replace('市', '');
                    $('#j_fnHeader').find('.city').text(city);
                }
            } else {
                $('#j_fnHeader').find('.city').text('上海');
            }
        }
    });

};

if (geo) {
    geo.getCurrentPosition(suc, err, {
        // 指示浏览器获取高精度的位置，默认为false
        enableHighAcuracy: true,
        // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
        timeout: 5000,
        // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
        maximumAge: 3000
    });
} else {
    console.log('not support Geolocation!');
}

var rushEndTime = function () {
    var nowtime = new Date().getTime();
    //var endtime = new Date($(this).attr("endtime")).getTime(); //取结束日期(毫秒值)
    $("#j_indexRush").find('.rush-timer-wrap').each(function (k, v) {
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


setInterval(function () {
    rushEndTime();
}, 60000);
