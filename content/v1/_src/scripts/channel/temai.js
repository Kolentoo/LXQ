/*
 * @Author: lxq
 * @Date:   2015-09-14 16:03:48
 * @Last Modified by:   lxq
 * @Last Modified time: 2016-06-29 14:28:25
 */

'use strict';

$(function () {
    tmRules();
    tmSlider();
    tmTab();
    tmMenu();
    tmAdapter();
    tmCountDown();
    uzLazy(['discount-content']);
});

function tmRules(){
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

function tmSlider() {
    var sw = window.screen.width;
    if (sw <= 1366) {
        var menu = $('#j_menu');
        menu.remove();
    }

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

function tmTab() {
    _uzw.ui.tab('J_tab', function (index, obj) {
        var items = obj.children('.bd').children('.item');
        var imgs = items.eq(index).find('img[data-original]');
        imgs.each(function (k, v) {
            var oimg = $(this);
            var oda = oimg.attr('data-original');
            oimg.attr('src', oda);
        });
    });
}

function tmMenu() {
    var jmenu = $("#j_menu");
    var lis = jmenu.find('li');
    var sub = $('.sub');

    if (!$('.substance').get(0)) {
        return;
    }

    var sub1 = $('.substance').offset().top;

    var unitRem = function () {
        lis.each(function (k, v) {
            var li = $(this);
            li.removeClass('m' + (k + 1) + '-on');
        });
    };

    var unitAdd = function (index) {
        lis.eq(index).addClass('m' + (index + 1) + '-on');
    };

    $(window).scroll(function () {
        if (_util.check.isIE6) {
            return;
        }
        var w = $(window).scrollTop();
        if (w <= sub1) {
            jmenu.css({
                'position': 'absolute',
                'top': '710px'
            });
        } else {
            jmenu.css({
                'position': 'fixed',
                'top': '60px'
            });
        }
        sub.each(function (a, b) {
            var subtop = $(this).offset().top;
            if (w >= subtop) {
                unitRem();
                unitAdd(a);
            }
        });
    }).trigger("scroll");


    jmenu.find('li').on('click', function () {
        var t = $(this);
        var tindex = t.index();
        var pointer = t.siblings('li');
        var section = sub.eq(tindex);
        var sectiontop = section.offset().top;
        $('body,html').animate({
            scrollTop: sectiontop + 10
        }, 900, 'linear', function () {
            unitRem();
            unitAdd(tindex);
        });
    });
}

function tmAdapter() {
    var sw = screen.width;
}

function tmCountDown() {
    var wrap = $('.substance');
    var timers = wrap.find('.timer');

    var df = _util.apis.getServerDate();
    var nowTime = 0;
    if (timers.get(0)) {
        df.done(function (tm) {
            tm = tm.replace(/-/g, '/');
            nowTime = parseInt(Date.parse(tm), 10);

            setInterval(function () {
                nowTime += 1000;
            },1000);

            var unitCountdown = function (o) {
                var oTian = o.find('.tian');
                var oShi = o.find('.shi');
                var oFen = o.find('.fen');
                var oMiao = o.find('.miao');

                var endTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-endtime'), '-', '/')), 10);
                var startTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-starttime'), '-', '/')), 10);

                var valueE = endTime - nowTime;
                var valueS = startTime - nowTime;

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
                if (valueS > 0 && valueE > 0) {
                    _unitCD(valueS);
                } else if (valueS < 0 && valueE > 0) {
                    _unitCD(valueE);
                } else if (valueS < 0 && valueE === 0) {
                    window.location.reload();
                } else {

                }
            };

            timers.each(function (k, v) {
                var o = $(this);
                setInterval(function () {
                    unitCountdown(o);
                }, 1000);
            });

        });
    }
}



