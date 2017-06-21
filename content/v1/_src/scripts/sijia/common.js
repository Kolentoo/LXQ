/*
* @Author: jonas hsiao
* @Date:   2016-12-06 16:05:11
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2017-03-21 12:54:45
*/

'use strict';

$(function () {
    uzLazy(['intro-mod', 'theme-recomm']);
    udNavFixed();
    udSlide();
    udPager();
    udCarousel();
    udFixIe6();
});

function udSlide() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        oBS.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: false,
            pause: 1000,
            play: 6000,
            generatePagination: true
        });
        oBS.find('.slides_control').css({ 'width': '100%' });

        $('.slides_container').each(function () {
            var o = $(this);
            var opa = o.siblings('.pagination');

            if (opa.get(0)) {
                opa.find('li').on('mouseenter', function () {
                    var oo = $(this);
                    oo.find('a').click();
                });
            }

        });
    }
}

function udPager() {
    var pagers = $('.fn-pager');
    var rootNode = $('html, body');
    if (pagers.get(0)) {
        pagers.each(function () {
            var pager = $(this);
            var pageSize = parseInt(pager.attr('data-pagesize'), 10);
            var pageItems = parseInt(pager.attr('data-counts'), 10);

            pager.uzPager({
                pageSize: pageSize,
                pageItems: pageItems,//列表条数
                targetNode: pager.siblings('.pager-target-node'),
                onInit: function () {
                    //console.log('pager 初始化完成');
                },
                onCallback: function (currentPage, allPage) {
                    //分页事件 ajax or dom handle
                    var caseMod = $('.case-mod');
                    var ot;

                    if (caseMod.get(0) && pager.siblings('.case-list').get(0)) {
                        ot = caseMod.offset().top;
                        rootNode.animate({
                            scrollTop: ot
                        }, 800);
                    }
                }
            });
        });
    }
}

function udCarousel() {
    //图片滚动
    var carousel = $('#j_themeCarousel');
    var cw = carousel.width();
    var wrap = carousel.parent('.theme-carousel-wrap');

    if (carousel.get(0)) {
        carousel.find('.theme-item').width(cw / 4);
        carousel
            .jcarousel({
                wrap: 'circular',
                animation: 800
            })
            .jcarouselAutoscroll({
                interval: 10000,
                target: '+=4'
            })
            .on('mouseover', function() {
                var oThis = $(this);
                oThis.jcarouselAutoscroll('stop');
            })
            .on('mouseout', function() {
                var oThis = $(this);
                oThis.jcarouselAutoscroll('start');
            });

        wrap.find('.btn-prev')
            .jcarouselControl({
                target: '-=1'
            });

        wrap.find('.btn-next')
            .jcarouselControl({
                target: '+=1'
            });
    }
}

function udFixIe6() {
    var themeItems = $('.theme-items');
    if (_util.check.isIE6 && themeItems.get(0)) {
        themeItems.each(function() {
            var oThis = $(this);
            // var item = oThis.find('.theme-item');
            oThis.height(oThis.height());
        });
    }
}

function udNavFixed() {
    var box = $('#j_sideNavbar');
    var items = $('.main-hd');
    var unitScroll, unitCheck, unitSkip, ot;

    if (box.get(0)) {
        ot = box.offset().top;

        unitScroll = function () {
            var w = $(window);
            var st = w.scrollTop();
            if (st >= ot) {
                if (_util.check.isIE6) {
                    box.css({ 'top': st - ot + 50, 'position': 'absolute' });
                } else {
                    box.css({ 'top': 0, 'position': 'fixed' });
                }
                unitCheck(st);
            } else {
                box.css({ 'top': 'auto', 'position': 'absolute' });
            }
        };

        unitCheck = function (st) {
            items.each(function (k, v) {
                var o = $(this);
                var oot = o.offset().top;
                if (st > oot - 1) {
                    box.find('li').removeClass('on');
                    box.find('li').eq(k).addClass('on');
                    return true;
                }
            });
        };

        unitSkip = function () {
            box.find('li').on('click', function () {
                var oli = $(this);
                var oindex = oli.index();

                var skipNode = items.eq(oindex);
                var oot = skipNode.offset().top;
                $('body,html').animate({ scrollTop: oot }, 800);
            });
        };

        unitSkip();
        unitScroll();

        $(window).scroll(function () {
            unitScroll();
        });
    }
}