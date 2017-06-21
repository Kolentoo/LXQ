/*
 * @Author: LXQ
 * @Date:   2015-10-23 13:08:03
 * @Last Modified time: 2016-04-13 15:29:30
 */
'use strict';

winLoadFix(function () {
    scenicSlide();
    picOperate();

    if ($('.report-intro1').get(0)) {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;

        window.Calendar(year, month, 1).show(document.getElementById("div_Calendar"), 0, "", false, true, true);
    }
});


$(function() {
    moreRoute();
    startCity();
    uzLazy(['j_proBox', 'j_picDetail', 'j_spotPic', 'j_figurePic', 'j_travleRecord', 'j_dinforBox']);
    scenicColumn();//分栏+分页
    seasonChoice();
    dropCrumb();
    _uzw.ui.tab('j_tab',function(index, otab){
        var ss = otab.find('.item').eq(index).find('.strage-slides');
        if (ss.get(0)) {
            unitSlides(ss);
        }
    });
    fixedMenu();
    tinycarouselSlide();
    otherCity();
    strage();
    cityChoice();
    moreCon();
    screening();
    scenicCalendar();
});

//更多行程
function moreRoute() {
    $('#j_proBox').on('click', '.more-d3', function () {
        var o = $(this);
        o.toggleClass('on');
        // var m1 = o.children('.m1');
        var m4 = o.find('.m4');
        var morei = o.siblings('.hide');
        if (o.hasClass('on')) {
            o.parent('.s2').removeClass('on');
            morei.show();
            m4.text('收起');
        } else {
            o.parent('.s2').addClass('on');
            morei.hide();
            m4.text('展开');
        }
    });
}

//节点分栏
function scenicColumn() {

    var allNode = $('#j_proBox').find('.item').first().children('.pager-target-node');
    var allLis = allNode.children('ul').children('li');
    var allTabNode = $('#j_tab').find('.route-more').children('li');

    allTabNode.each(function (k,v) {
        if(k>0){
            var o = $(this);
            var otag = o.attr('data-tag');
            var cnode= $('#j_proBox').find('.item').eq(k);//current item node
            allLis.each(function (m, n) {
                var oo = $(this);
                var ootag = oo.attr('data-tag');
                if (ootag == otag) {
                    cnode.find('ul').append(oo.clone());
                }
            });
        }

    });

    scenicPager();
}

//旅游佳季-切换出发城市
function startCity() {
    var sc = $('#j_sc');
    sc.find('.c1').on('click', function () {
        var o = $(this);
        var ot = o.find('.s4').text() || o.text();
        sc.find('.cs1').text(ot);

        var cityid = o.attr('data-id');
        var cidx = $('#j_tab').find('.route-more').children('.on').index();
        var ctab = $('#j_proBox').children('.item').eq(cidx);
        var cnodes = ctab.children('.pager-target-node');
        var arr = [];
        if (cityid == '9999') {
            arr.push("");
        } else {
            arr.push("data-city=" + cityid);
        }

        if (arr && arr.length) {
            scenicSorter(cnodes, arr.join(''));
        }

    });

    sc.on('mouseenter', function () {
        var o = $(this);
        o.find('.cf2').show();
        o.find('.cf1').children('.down').addClass('on');
    }).on('mouseleave', function () {
        var o = $(this);
        o.find('.cf2').hide();
        o.find('.cf1').children('.down').removeClass('on');
    });

}

//轮播
function scenicSlide() {
    var nearSides = $('#j_nearbySlides');
    var picSlides = $('#j_picSlides');
    var criticismSlides = $('#j_criticismSlides');
    var strageSlides = $('.strage-slides');
    if (criticismSlides.get(0)) {
        criticismSlides.slides({
            width: 250,
            height: 160,
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 600,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 4000,
            generatePagination: true
        });
    }

    if (picSlides.get(0)) {
        $('#j_picSlides').slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 4000,
            generatePagination: true
        });
    }

    if (nearSides.get(0)) {
        nearSides.slides({
            width: 320,
            height: 200,
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 600,
            effect: 'side',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 4000,
            generatePagination: true
        });
    }

}

function unitSlides(obj) {
    if (!obj.hasClass('slideed')) {
        obj.addClass('slideed').slides({
            width: 200,
            height: 150,
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 600,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 4000,
            generatePagination: true
        });
    }
}
//分页
function scenicPager() {
    var fnPager = $('.fn-pager');

    fnPager.each(function(k,v) {
        var commentPic = $('.notice-comment').find('.comment-con:visible').find('.commentPic');

        var pager = $(this);
        var pageSize = parseInt(pager.attr('data-pagesize'), 10);
        var pageItems = parseInt(pager.attr('data-counts'), 10);

        var pagerS = pager.siblings('.pager-target-node');
        var pid = pagerS.attr('id');

        var pnode = null;
        if ($('#' + pid + '_copy').get(0)) {
            pnode = $('#' + pid);
        } else {
            pnode = pagerS;
        }

        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems,
            targetNode: pnode,
            onInit: function() {},
            onCallback: function(currentPage, allPage) {
                if (commentPic.get(0)) {
                    commentPic.tinycarousel({
                        axis: 'x',
                        infinite: false
                    });
                }

                //skip current offset position
                var tb = $('#j_tab');
                if (tb.get(0)) {
                    var tp = tb.offset().top;
                    $('html,body').animate({ scrollTop: tp }, 800);
                }

            }
        });
    });

}

//sorter by city
function scenicSorter(list, tag) {
    if (list.get(0)) {
        if (_util.check.isIE6) {
            return;
        }
        list.uzSorter({
            sortBy: tag || '',
            targetNull: "<div class='lh3 tc yahei f24 f666'><i class='icon-uz vm icon-hotels png'></i><span class='f666 f24'>没有信息！</span></div>",
            tragetAjaxText: "<p class='lh3 tc yahei f24 f666'>数据载入中...</p>",
            onInit: function () {

            },
            onCallback: function () {
                scenicPager();
            }
        });
    }
}

//图轮图换及查看原图
function picOperate() {
    var sw = screen.width;
    var operate = $('#j_albumCarousel');
    var carItem = $('.carousel-item');
    var pop = $('#j_popOperate');
    var vPic = $('#j_verticalPic');
    var nb = $('#j_nearbyBox');
    var viewli = vPic.find('.view-box').children('li');
    var nh = nb.find('.nearby-hotel1');
    var poph = -pop.height() / 2;
    var popw = -pop.width() / 2;
    var commentPic = $('.notice-comment').find('.comment-con:visible').find('.commentPic');
    if (sw <= 1152) {
        operate.find('.carousel-item').css({
            'width': '384px'
        });
        operate.find('.view-chart').children('li').css({
            'width':'116px'
        });
        viewli.css({
            'margin-bottom':'4px'
        });
        commentPic.find('.album-pic').css({
            'width': '128px'
        });
        commentPic.find('.viewport').css({
            'width': '438px'
        });
    }
    if (operate.get(0)) {
        operate.tinycarousel({
            axis: 'x',
            infinite: false
        });
    }
    carItem.on('click', function() {
        pop.removeClass('hide');
        pop.css({
            'margin-left': popw + 'px',
            'margin-top': poph + 'px'
        });
        _uzw.ui.mask.show();
        $('.fn-mask').on('click', function() {
            pop.addClass('hide');
            _uzw.ui.mask.hide();
        });
        $('.j_popClose').on('click', function() {
            pop.addClass('hide');
            _uzw.ui.mask.hide();
        });
    });
    if (commentPic.get(0)) {
        commentPic.tinycarousel({
            axis: 'x',
            infinite: false
        });
    }
    if (vPic.get(0)) {
        vPic.tinycarousel({
            axis: 'y',
            infinite: false
        });
    }
    viewli.on('click', function () {
        var o = $(this);
        var ot = o.text();
        nh.text(ot);
    });
}
//当季线路-季节选择
function seasonChoice() {
    var ss = $('#j_ss');
    var dc = $('#j_dropCity');
    var dm = $('#j_dropMonth');
    var dcli = dc.find('.drop-city').children('li');
    var dmli = dm.find('.drop-month').children('li');
    ss.find('.c1').on('click', function() {
        var o = $(this);
        var ot = o.text();
        ss.find('.cs').text(ot);
    });
    ss.find('.c1').on('click', function() {
        $('.cf2').hide();
    });
    ss.on('mouseenter', function() {
        $('.cf2').show();
        $('.cf1').children('.down').addClass('on');
    }).on('mouseleave', function() {
        $('.cf2').hide();
        $('.cf1').children('.down').removeClass('on');
    });
    dc.on('mouseenter', function() {
        $('.drop-city').show();
    }).on('mouseleave', function() {
        $('.drop-city').hide();
    });
    dcli.on('click', function () {
        $('.drop-city').hide();
    });
    dm.on('mouseenter', function() {
        $('.drop-month').show();
    }).on('mouseleave', function() {
        $('.drop-month').hide();
    });
    dmli.on('click', function () {
        $('.drop-month').hide();
    });
}
//当季线路-面包屑
function dropCrumb() {
    var sSelect = $('#j_sSelect');
    var dSelect1 = $('#j_dropSelect1');
    var dSelect3 = $('#j_dropSelect3');
    var dSelect5 = $('#j_dropSelect5');
    var dSelect7 = $('#j_dropSelect7');
    sSelect.on('mouseenter', function() {
        $('.season-select2').show();
    }).on('mouseleave', function() {
        $('.season-select2').hide();
    });
    dSelect1.on('mouseenter', function() {
        $('.raiders-select2').show();
    }).on('mouseleave', function() {
        $('.raiders-select2').hide();
    });
    dSelect3.on('mouseenter', function() {
        $('.raiders-select4').show();
    }).on('mouseleave', function() {
        $('.raiders-select4').hide();
    });
    dSelect5.on('mouseenter', function() {
        $('.raiders-select6').show();
    }).on('mouseleave', function() {
        $('.raiders-select6').hide();
    });
    dSelect7.on('mouseenter', function() {
        $('.raiders-select8').show();
    }).on('mouseleave', function() {
        $('.raiders-select8').hide();
    });
}
//酒店详情-导航
function fixedMenu() {
    var hotelMenu = $('#j_hotelMenu');
    if (hotelMenu.get(0)) {
        var hmenuHeight = hotelMenu.height();
        var infor = $('.infor');
        var infortop = infor.offset().top;
        var conRight = $('.con-right').width();
        $(window).scroll(function () {
            if (_util.check.isIE6) {
                return;
            }
            var w = $(window).scrollTop();
            if (w <= infortop) {
                hotelMenu.css({
                    'position': 'static',
                    'width': '100%'
                });
            } else {
                hotelMenu.css({
                    'position': 'fixed',
                    'top': 0,
                    'z-index': 10,
                    'width': conRight
                });
            }
            infor.each(function (a, b) {
                var infortop = $(this).offset().top;
                if (w >= infortop - hmenuHeight + 2) {
                    hotelMenu.find('li').removeClass('on');
                    hotelMenu.find('li').eq(a).addClass('on');
                }
            });
        }).trigger("scroll");
    }
    hotelMenu.find('li').on('click', function() {
        var o = $(this);
        var oindex = o.index();
        var section = infor.eq(oindex);
        var stop = section.offset().top;
        o.addClass('on').siblings().removeClass('on');
        $('body,html').animate({
            scrollTop: stop - hmenuHeight + 5
        }, 900);
    });
}
// 酒店详情轮播图
function tinycarouselSlide() {
    var wrap = $('.hotelpic-intro1');
    var nb = $('#j_nearbyBox');
    var vPic = $('#j_verticalPic');
    var sw = screen.width;
    if (sw <= 1152) {
        var overview = wrap.find('.overview');
        overview.find('li').css({
            'margin-right': '6px'
        });
        vPic.find('.viewport').css({
            'height': "281px"
        });
    }
    var codeFocus = $('#j_sliderCodeFocus');
    if (codeFocus.get(0)) {
        $('#j_sliderCodeFocus').tinycarousel();
    }
    wrap.find('.overview').find('li').on('click', function() {
        var o = $(this);
        var opic = o.find('img').attr('data-src');
        var os = o.siblings('li');
        var oCM = wrap.children('.carousel-main');
        os.removeClass('on');
        o.addClass('on');
        oCM.children('img').attr('src', opic);
    });
    nb.find('.overview').find('li').on('click', function () {
        var t = $(this);
        var tchart = t.find('img').attr('data-src');
        var tmain = nb.children('.carousel-main');
        tmain.children('img').attr('src', tchart);
        t.addClass('on').siblings().removeClass('on');
        t.parent('.view-box').siblings().children().removeClass('on');
    });

}
//点评-出发城市
function otherCity() {
    var oc = $('#j_city');
    if (oc.get(0)) {
        oc.find('.m1').on('click', function () {
            $('.other-city').toggle();
            $(this).toggleClass('on');
        });
        oc.find('.c1').on('click', function () {
            var o = $(this);
            var ot = o.text();
            $('.city').text(ot);
            $('.other-city').hide();
        });
    }
}
//查看行程
function strage() {
    var pl = $('#j_productList');
    var moreStrage = pl.find('.strage-txt');
    moreStrage.on('click', function() {
        var o = $(this);
        var ps = o.parents('tr.f14').next('.pro-strage');
        ps.toggle();
        o.parent().toggleClass('on');
        unitSlides(ps.find('.bd').children('.item').eq(0).find('.strage-slides'));
    });
    $('.strage-close').on('click', function() {
        var o = $(this);
        o.parents('.pro-strage').hide();
        o.parents('.pro-strage').prev().find('.t1').removeClass('on');
    });
}
//天气预报-其他城市
function cityChoice() {
    var oc = $('.other-city');
    oc.on('click', function() {
        $(this).next().toggle();
        $(this).find('.down').toggleClass('on');
    });
    $('.confirm').on('click', function() {
        $(this).parents('.city-select').hide();
    });
    //城市下拉
    if (typeof PCAS=='function') {
        new PCAS("select_Province", "select_Province_city", '上海市', '市辖区');
    }
}
//详细内容
function moreCon() {
    var mc = $('#j_moreCon');
    var mt = $('#j_moreTxt');
    if (mc.get(0)) {
        var tips2 = $('.tips2');
        mc.on('click', function() {
            if (tips2.is(":hidden")) {
                mc.find('.p1').text('收起');
            } else {
                mc.find('.p1').text('详细内容');
            }
            tips2.toggle();
            mc.children('.arrow-more').toggleClass('on');
            $('.attention-right').find('.attention-tips').toggleClass('edging');
        });
    }
    if (mt.get(0)) {
        mt.find('.more-txt').on('click', function () {
            var p3 = mt.find('.p2');
            if (p3.is(":hidden")) {
                mt.find('.p3').text('收起');
            } else {
                mt.find('.p3').text('更多');
            }
            mt.find('.p2').toggle();
            $(this).toggleClass('on');
        });
    }
}
//线路筛选
function screening() {
    var screen = $('#j_screen');
    var routeSort = $('#j_routeSort');
    screen.children('.filter').find('.c1').on('click', function () {
        $(this).addClass('on').siblings().removeClass('on');
    });
    routeSort.find('.s2').on('click', function () {
        $(this).toggleClass('on');
    });
    routeSort.find('.s3').on('click', function () {
        $(this).toggleClass('chosen');
    });
}
//选择日期
function scenicCalendar(){
    var sdate = "J_sdate";
    var edate = "J_edate";
    var maxDate = "2020-01-01";
    $("#" + sdate).unbind().bind("focus", function () {
        window.WdatePicker({ errDealMode: 1, el: sdate, dateFmt: 'yyyy/MM/dd', minDate: '%y-%M-#{%d+1}', maxDate: '#F{$dp.$D(\'' + edate + '\')||\'' + maxDate + '\'}' });
    });
    $("#" + edate).unbind().bind("focus", function () {
        window.WdatePicker({ errDealMode: 1, el: edate, dateFmt: 'yyyy/MM/dd', minDate: '#F{$dp.$D(\'' + sdate + '\')||\'%y-%M-#{%d+1}\'}', maxDate: maxDate });
    });
}



