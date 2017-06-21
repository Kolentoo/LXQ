"use strict";

$(function () {
    var dlist = $('.j_gAppDownload');
    var ur = location.href.toLowerCase();

    if (_uzm.mobile.isWeiXin) {

        dlist.html('<a href="' + ur + '" >下载APP</a>');

        dlist.find('a').on('click', function () {
            _uzm.ui.wxTopTip.show(function () {
                $('.fn-mask').on('click', function () {
                    _uzm.mask.hide(function () {
                        _uzm.ui.wxTopTip.hide();
                    });
                });
            });
            return false;
        });
        return;
    }

    if (_uzm.mobile.isIphone) {
        dlist.html('<a href="' + _uzm.pkg.iphone + '"  onclick="ga(' + "send" + ', ' + "event" + ', ' + "app_m" + ', ' + "click" + ', ' + "iphone_download" + ');">下载APP</a>');
    } else if (_uzm.mobile.isIpad) {
        dlist.html('<a href="' + _uzm.pkg.ipad + '"  onclick="ga(' + "send" + ', ' + "event" + ', ' + "app_m" + ', ' + "click" + ', ' + "ipad_download" + ');">下载APP</a>');
    } else {
        var apk = {
            tt: 'UzaiTralvel_V5.4.5_TouTiaofeeds1.apk',
            zht1: 'UzaiTralvel_V5.4.5_ZhiHuiTui1.apk',
            zht2: 'UzaiTralvel_V5.4.5_ZhiHuiTui2.apk',
            b1: 'UzaiTralvel_V5.4.6_BeiY1.apk',
            b2: 'UzaiTralvel_V5.4.6_BeiY2.apk',
            b3: 'UzaiTralvel_V5.4.6_BeiY3.apk',
            b4: 'UzaiTralvel_V5.4.6_BeiY4.apk'
        };
        var tag = _util.url.get('s');
        var tagv = apk[tag];
        var url = 'http://mobile.uzai.com:8080/';
        if (!tagv) {
            tagv = '悠哉旅游.apk';
        }
        dlist.html('<a href="' + (url + tagv) + '" download="悠哉旅游.apk"  onclick="ga(' + "send" + ', ' + "event" + ', ' + "app_m" + ', ' + "click" + ', ' + "android_download" + ');">下载APP</a>');
    }
});