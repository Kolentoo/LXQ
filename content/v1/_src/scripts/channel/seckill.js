/*
* @Author: lxq
* @Date:   2016-06-29 09:48:14
* @Last Modified by:   lxq
* @Last Modified time: 2016-10-13 15:21:51
*/

'use strict';

$(function () {
    secCountdown();
    tmRules();
    bannerShow();
    uzLazy(['discount-content']);
});

function secCountdown() {
    var wrap = $('#j_discount');
    var timers = wrap.find('.timer');
    if (timers.get(0)) {
        var df = _util.apis.getServerDate();
        var nowTime = 0;
        df.done(function (tm) {
            var unitCountdown = function (o, si, time) {
                var op = o.parents('.pb');
                var oTian = o.find('.tian');
                var oShi = o.find('.shi');
                var oFen = o.find('.fen');
                var oMiao = o.find('.miao');

                var endTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-endtime'), '-', '/')), 10);
                var startTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-starttime'), '-', '/')), 10);
                var endskTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-skendtime'), '-', '/')), 10);

                var valueE = endTime - nowTime;
                var valueS = startTime - nowTime;
                var valueA = endskTime - nowTime;

                var _unitCD = function (cha) {
                    var seconds = cha / 1000;
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    var days = Math.floor(hours / 24);

                    oTian.text(days);
                    oShi.text(hours % 24);
                    oFen.text(minutes % 60);
                    oMiao.text(Math.floor(seconds % 60));
                };

                var dataFlag = op.attr("data-supplierflag");
                var datapro = op.attr("data-product");
                var cut = op.attr('data-cut');
                var oem = op.find('.status').children('em');

                if (valueS > 0) {
                    _unitCD(valueS);
                    op.addClass('pro-prev');
                } else if (valueS === 0) {
                    valueS === 0 && _unitCD(valueS);
                    op.addClass('pro-ing').removeClass('pro-prev');
                    op.find('.btn').children('a').text('立即预订');
                    op.find('.mb10').text('距离结束');

                    if (dataFlag == '008') {
                        op.addClass('bj-ing');
                    }

                } else if (valueS < 0 && valueA > 0) {
                    _unitCD(valueS);
                    _unitCD(valueA);
                    op.find('.mb10').text('距离结束');
                    op.removeClass('prev');
                    if (dataFlag == '008') {
                        op.addClass('bj-ing');
                    }
                    if (cut > 0) {
                        op.addClass('pro-ing');
                        op.find('.btn').children('a').text('立即预订');
                    } else {
                        op.removeClass('pro-ing').addClass('pro-over');
                        op.find('.btn').children('a').text('查看相关产品');
                        op.find('.status').text('已抢完');
                        op.find('.progress').css('width', '100%');
                        op.find('.btn').children('a').attr('href', '/TeMaiHui/SearchRelatedProduct?productid=' + datapro);
                        clearTimeout(si);
                    }

                } else if (valueA <= 0) {
                    op.removeClass('pro-ing').addClass('pro-over');
                    op.find('.btn').children('a').text('查看相关产品');
                    op.find('.btn').children('a').attr('href', '/TeMaiHui/SearchRelatedProduct?productid=' + datapro);
                    op.find('.status').text('已抢完');
                    op.find('.progress').css('width', '100%');
                    clearTimeout(si);
                }

                if (valueE > 0) {
                    _unitCD(valueE);
                    op.addClass('pro-ing');
                } else if (valueE <= 0) {
                    op.removeClass('pro-ing').addClass('pro-over');
                    op.find('.book').find('a').removeAttr('href');
                    op.find('.book').find('a').text('已抢完');
                    op.find('.name').find('a').removeAttr('href');
                    op.find('.progress').css('width', '100%');
                    op.find('.status').text('已抢完');
                    clearTimeout(si);
                }

            };

            tm = tm.replace(/-/g, '/');
            nowTime = parseInt(Date.parse(tm), 10);

            timers.each(function (k, v) {
                var o = $(this);
                var si = setInterval(function () {
                    unitCountdown(o, si);
                }, 1000);
            });

            setInterval(function () {
                nowTime += 1000;
            }, 1000);
        });
    }
}

function tmRules() {
    var sr = $('#j_saleRules');
    var ri = sr.find('.rules-icon');
    var rules2 = sr.find('.rules2');
    ri.mouseenter(function () {
        rules2.show();
    });
    ri.mouseout(function () {
        rules2.hide();
    });
}


function bannerShow() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        oBS.slides({
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 6000,
            generatePagination: true
        });
        oBS.find('.slides_control').css({
            'width': '100%'
        });
    }
}
