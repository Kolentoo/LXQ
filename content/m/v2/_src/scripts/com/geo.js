//geo
"use strict";

var geo = {};

geo.init = function (wp='j_fnHeader') {
    var geo = navigator.geolocation;
    var el = $('#' + wp);
    if (!el.get(0)) {
        el = $('.' + wp);
    }

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
        el.find('.city').text('上海');

        //存入cookie
        _uzm.cookie.set('uzmCity', '上海-2-sh');

    };

    //处理成功
    var suc = function (position) {
        var coords = position.coords;
        var lat = coords.latitude;
        var lon = coords.longitude;
        //wapi.uzai.com
        var u = _uzm.domain.wapi + "/api/UzaiIPHelp/GEOCode/?jingdu=" + lat + "&weidu=" + lon;
        $.ajax({
            url: u,
            type: 'GET',
            dataType: "jsonp",
            success: function (msg) {
                if (msg) {
                    var {status,result} = msg;
                    if (status === 'OK') {
                        var city = result.addressComponent.city.replace('市', '');
                        el.find('.city').text(city);
                    }
                } else {
                    el.find('.city').text('上海');
                }
                //存入cookie
                _uzm.cookie.set('uzmCity', el.find('.city').text());
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
        el.find('.city').text('上海');
        console.log('not support Geolocation!');
    }
};
