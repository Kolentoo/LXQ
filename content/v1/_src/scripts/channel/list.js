/*
* @Author: jonas hsiao
* @Date:   2016-04-22 13:03:42
* @Last Modified by:   lxq
* @Last Modified time: 2016-08-23 11:30:28
*/

'use strict';

$(function () {
    leftFold();
    themeFold();
    mainRouteFold();
    themeSlides();
    departmDateEmpty();
    uzLazy(['j_lazy', 'j_mainRoute']);
    huojiaPager();
    gHoverEvent($('#j_priceRangeBd'));
    huojiaSizerFix();
    describeFolding();
    priceFilter();
    startDayFilter();
    thirdAd();//供应商ad
    //listSideAd();
    //pageHit();
    if ($('.hot-line-bar').get(0)) { // side 对齐修复
        $('#j_jhSide').css({ 'padding-top': 0 });
    }
    _uzw.ui.tab('other-city-tab');
    ziyouban();
});

winLoadFix(function () {
    _ug.hotview.set(); //数据热点统计
});

function leftFold() {
    var wrap = $('#j_jhSide');

    wrap.find('.switch').on('click', function () {
        var o = $(this);
        var oNext = o.parent('h3').parent('dt').next('dd');
        var nexts = wrap.find('.jingdian-items').find('dd');

        wrap.find('.switch').not(o).text('展开');
        nexts.hide();

        if (o.text() === '收起') {
            oNext.hide();
            o.text('展开');
        } else {
            oNext.show();
            o.text('收起');
        }

    });
}

function themeFold() {
    var box = $('.j_dropSwitch');
    var icon = box.find('.switch');
    var wrap = $('.j_themeSwitch');
    var wih = wrap.find('.theme-inner').height();
    var btnSwitch = wrap.find('.switch');

    icon.on('click', function () {
        var o = $(this);
        var oem = o.find('em');
        var ot = o.find('i');
        var hides = o.parent().siblings('.theme-items').find('.hide');
        if (ot.hasClass('arrow-bottom')) {
            oem.text('收起');
            hides.css({ 'display': 'inline-block' });
            ot.attr('class', 'arrow-top');
        } else {
            oem.text('展开');
            hides.hide();
            ot.attr('class', 'arrow-bottom');
        }
    });

    if (wih > 56) {
        btnSwitch.css({ 'display': 'inline-block' });
        wrap.find('.theme-items').addClass('theme-items-cut');
    }

    btnSwitch.on('click', function () {
        var o = $(this);
        var oem = o.find('em');
        var ot = o.find('i');
        var items = o.parent().siblings('.theme-items');
        if (ot.hasClass('arrow-bottom')) {
            oem.text('收起');
            ot.attr('class', 'arrow-top');
            items.removeClass('theme-items-cut');
        } else {
            oem.text('展开');
            ot.attr('class', 'arrow-bottom');
            items.addClass('theme-items-cut');
        }
    });
}

function mainRouteFold() {
    var route = $('#j_mainRoute');
    route.find('.switch').on('click', function () {
        var o = $(this);
        var oem = o.find('em');
        var otxt = oem.text();
        var orsd = o.find('.residue');
        var obox = o.parents('dd').find('.line-list');
        if (otxt === '展开更多') {
            oem.text('收起');
            orsd.hide();
            o.find('i').attr('class', 'arrow-top');
            obox.find('li.hide').show();
        } else {
            oem.text('展开更多');
            orsd.show();
            o.find('i').attr('class', 'arrow-bottom');
            obox.find('li.hide').hide();
        }
    });

}

//热门主题
function themeSlides() {
    if ($('.theme-slides').get(0)) {
        $('.theme-slides').slides({
            effect: '',
            crossfade: true,
            play: 5000,
            pause: 2500,
            hoverPause: true,
            generatePagination: false
        });
    }
}

function departmDateEmpty(){
    var oCancel = $('#J_cancel');
    oCancel.on('click',function () {
        oCancel.siblings('.num-box').val('');
    });
}

var _hjSkip = function () {
    var o = $('#j_sortBar');
    var otop = o.offset().top;
    $('body,html').animate({ scrollTop: otop }, 500);
};

//货架分页
function huojiaPager() {

    var _pagerThumb = function (currentPage, allPage) {
        var sb = [];
        var o = $('#hjPagerThumb');
        var pager = $('#hjPager');
        sb.push("<span class='mr10'>" + currentPage + "/" + allPage + "页</span>");
        sb.push("<a href='javascript:void(0);' class='btn-item tc vm lh1 prev off' data-num=" + (currentPage - 1) + " ><span class='arrow-box'><i class='arrow-left'>&nbsp;</i></span></a> ");
        sb.push("<a href='javascript:void(0);' class='btn-item tc vm lh1 next' data-num=" + (currentPage + 1) + " >下一页<span class='arrow-box pl5'><i class='arrow-right'>&nbsp;</i></span></a>");
        o.html(sb.join(''));

        //清除所有off
        o.find('.btn-item').removeClass('off');

        if (currentPage == 1) {
            o.find('.prev').addClass('off');
        }
        else if (currentPage == allPage) {
            o.find('.next').addClass('off');
        }

        o.find('.btn-item').on('click', function () {
            var oo = $(this);
            if (!oo.hasClass('off')) {
                var num = oo.attr('data-num');
                var pa = pager.find('a[rel=' + num + ']');
                if (pa.length) {
                    pa.eq(0).click();
                }
            }
            return false;
        });

    };

    //pager
    $('#hjPager').uzPager({
        pageSize: 15,
        targetNode: $('#j_mainRoute'),
        onInit: function (allPage) {
            //console.log('pager 初始化完成');
            //console.log(allPage);
            _pagerThumb(1, parseInt(allPage, 10));
        },
        onCallback: function (currentPage, allPage) {
            _pagerThumb(parseInt(currentPage, 10), parseInt(allPage, 10));
            _hjSkip();
        }
    });

    //chrome ie checkbox fix

    $('#j_sortBar').find('input:checkbox').on('change', function (e) {
        var url = $(this).parent('a').attr('href');
        window.location.href = url;
    });

}

//筛选器固定顶部条
function huojiaSizerFix() {
    var oMR = $('#j_mainRoute');
    var oMRTop = oMR.offset().top;
    var oSFW = $('.sizer-fix-wrap');
    var oSF = $('#j_sizerFix');
    var unitScroll = function () {
        var w = $(window);
        var st = w.scrollTop();
        if (st > oMRTop) {
            if (!window.XMLHttpRequest) {
                oSFW.css({ 'top': st });
            } else {
                oSFW.addClass('sizer-fixed');
            }
        } else {
            oSFW.removeClass('sizer-fixed');
        }
    };

    oSF.find('li').on('mouseenter', function () {
        var oThis = $(this);
        oSF.find('li').removeClass("on");
        oThis.addClass("on");
    });

    oSFW.on('mouseleave', function () {
        oSFW.find('li').removeClass("on");
    });

    unitScroll();

    $(window).scroll(function () {
        unitScroll();
    });
}

//页面底部描述折叠效果
function describeFolding() {
    var oDB = $('#j_describeBox');

    oDB.find('.arrow').on('click', function () {
        var o=$(this);

        if(o.hasClass('arrow-on')){
            o.removeClass('arrow-on');
            oDB.find('.describe-box-inner').addClass('cut');
        } else{
            o.addClass('arrow-on');
            oDB.find('.describe-box-inner').removeClass('cut');
        }
    });

}

//滚动函数
(function($){
    $.fn.marqueeFn = function(e){
        e = $.extend({speed:1},e);
        var marquee = $(this);
        var oUl = $(marquee).find("ul");
        var oLi = $(oUl).find("li");
        var mWidth=(oLi.outerWidth() * oLi.length < marquee.innerWidth());
        if (!mWidth) {
            var x = 1,scrollDelay = e.speed,marqueeId = setInterval(scrollFunc,scrollDelay);

            oLi.clone().appendTo(oUl);
            oLi = $(oUl).find("li");
            oUl.css("width",oLi.outerWidth() * oLi.length);
            oUl.hover(function(){
                clearInterval(marqueeId);
            },function(){
                marqueeId = setInterval(scrollFunc,scrollDelay);
            });
        }
        function scrollFunc(){
            marquee.scrollLeft() >= oUl.outerWidth()/2 || marquee.scrollLeft() >= oUl.outerWidth() - marquee.innerWidth() ? marquee.scrollLeft(0) : marquee.scrollLeft(marquee.scrollLeft() + x);
        }
    };
})(jQuery);

//大区，省国家，景区页面点击量+1
function pageHit() {
    var path = document.location.pathname;
    var pathArr = path.split('/');
    var nArr = [];
    for (var i = 0; i < pathArr.length; i++) {
        var item = pathArr[i];
        if (item) {
            nArr.push(item);
        }
    }

    var k = "";
    var v = "";
    k == nArr[0];
    if (nArr.length == 2) {
        v = nArr[1].split('-')[1];
    }

    var tag = "k=" + k + (v) ? '&v=' + v : "";

    if (nArr.length) {
        $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiHit/?' + tag,
            type: 'GET',
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            cache: true,
            success: function (data) {

            }
        });
    }

}

//清除出发日期
function startDayFilter() {
    $('.J_searchDateClear').on('click', function () {
        var o = $(this);
        var os = o.siblings('.num-box');
        os.val('');
    });
}



function priceFilter() {

    //单元货架 filter事件
    var unitHJFilter = function (v1, v2) {

        v1 = v1 || 1;
        v2 = v2 || 999999;

        var sortCondition = "data-price-tag='" + v1 + "-" + v2 + "'";

        //从克隆节点处悠哉tag值
        if ($('#j_mainRoute_copy').get(0)) {
            unitModifyTag('j_mainRoute_copy', v1, v2);
        } else {
            unitModifyTag('j_mainRoute', v1, v2);
        }

        initSorter('data-price', sortCondition);
    };

    //从克隆节点处悠哉tag值
    var unitModifyTag = function (node, v1, v2) {
        $('#' + node).find('li').each(function () {
            var oo = $(this);
            var oprice = oo.attr('data-price');
            if (parseInt(oprice, 10) >= parseInt(v1, 10) && parseInt(oprice, 10) <= parseInt(v2, 10)) {
                oo.attr('data-price-tag', v1 + "-" + v2);
            }
        });
    };


    //input 回车
    $('.price-range-bd').find('input:text').on('keyup', function (event) {
        var o = $(this);
        var op = o.parent('.num-box');
        var obtn = op.siblings('.confirm');
        if (event.keyCode == 13) {
            obtn.click();
        }
    });

    $('.J_priceDateBtn').on('click', function () {
        var o = $(this);
        var os = o.parent('.price-range-bd');
        var osli = os.parent('.price-range');
        var i1 = $.trim(os.find('input').eq(0).val());
        var i2 = $.trim(os.find('input').eq(1).val());

        if (i1 && i2) {
            if (parseInt(i1, 10) > parseInt(i2, 10)) {
                return;
            } else if (parseInt(i1, 10) < 0) {
                return;
            }

            //两处input值同步
            var inputsBox = "";
            if (osli.get(0)) {
                inputsBox = $('#j_sizerFix').find('.price-range-bd');
            } else {
                inputsBox = $('#j_sortBar').find('.price-range-bd');
            }
            inputsBox.find('input').eq(0).val(i1);
            inputsBox.find('input').eq(1).val(i2);

            unitHJFilter(i1, i2);
        } else if (!i1 && !i2) {
            unitHJFilter();
        }
        return false;
    });


    $('.J_priceDateClear').on('click', function () {
        var o = $(this);
        $('.price-range-bd').find('input').val('');
        unitHJFilter();
    });

    var initSorter = function (tag, sortCondition) {
        //IE6无相关操作 兼容问题
        if (_util.check.isIE6) {
            return;
        }

        //重置
        $('#j_mainRoute').find('li').show();

        $('#j_mainRoute').uzSorter({
            sortBy: sortCondition,
            sortAscTag: tag,
            sortAscKey: 'asc',
            onInit: function () {
            },
            onCallback: function () {
                //分页
                huojiaPager();
                //跳转
                _hjSkip();
            }
        });



    };

}

function thirdAd() {
    var travelType = $("#hid_TravelClass").val();
    var city = $("#hid_City").val();
    var AreaTreeID = $("#hid_AreaTreeID").val();
    var IsArea = $("#hid_IsArea").val();
    var box = $('#j_hotLineBar');
    if (AreaTreeID && IsArea && city && travelType) {
        $.ajax({
            url: _uzw.domain.wapi + "/api/UzaiProNonstop/?city=" + city + "&travelClass=" + travelType + "&AreaTreeID=" + AreaTreeID + "&IsArea=" + IsArea,
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            success: function (list) {
                var html = "";
                if (list.length) {
                    for (var i = 0; i < list.length && i < 4; i++) {
                        var pro = list[i];
                        var proUrl = "/ProNonstop/?url=" + pro.ProductUrl + "&CPrice=" + pro.ClickPrice + "&city=" + city + "&travelType=" + travelType + "&AreaTreeID=" + AreaTreeID + "&IsArea=" + IsArea + "&ProductID=" + pro.ProductID;
                        html += "<li";
                        if (i === 0) {
                            html += " class='first'";
                        }
                        html += "><a target='_blank' href='" + proUrl + "'><figure class='hot-line'>";
                        html += "<img alt='" + pro.Title + "' src='" + pro.Pic + "'>";
                        html += "<p class='hot-tag'><i class='icon-hot-tag png'>热推</i></p><figcaption class='hot-line-hd pt5'>" + pro.Title + "</figcaption>";
                        html += "<div class='hot-line-footer clearfix'>";
                        if (pro.TalkLevel != "0") {
                            html += "<span class='satisficing f999 fl'>满意度：" + pro.TalkLevel + "%</span>";
                        }
                        html += "<span class='price orange fr'><i>￥<em class='f20'>" + pro.MinPrice + "</em></i>起</span></div></figure></a></li>";
                    }
                }
                if (html) {
                    if (box.get(0)) {
                        $('#j_hotLineBar').find('ul').html(html);
                    }
                    else {
                        $(".main-box").prepend("<div id='j_hotLineBar' class=\"hot-line-bar main-fix\"><span class=\"hot-line-tag f20 yahei tc\">悠哉推荐</span><ul class=\"clearfix\">" + html + "</ul></div>");
                    }
                }
                else {
                    //$('#j_hotLineBar').remove();
                }
            }
        });
    }
}

function listSideAd() {
    var url = window.location.href;
    var u1 = 'http://www.uzai.com/rihan/japan-11414';
    var u2 = 'http://sh.uzai.com/outbound/japan-c-11414.html';
    var ckName = 'uzwMMJapanTour';
    var sHtml = '';
    var sf = {};
    var ot = 0;
    if (_ug.city !== 'sh') {
        return;
    }
    if (url.indexOf(u1) >= 0 || url.indexOf(u2) >= 0) { // 列表页，孟孟日本之旅活动
        sHtml +=
        '<div id="j_sideFixedJp" class="side-fixed-jp yahei">' +
            '<span class="icon-wrap icon-wrap-off">' +
                '<i class="icon-1"></i>' +
            '</span>' +
            '<div class="side-cont">' +
                '<i class="icon-2 png"></i>' +
                '<i class="icon-3 png"></i>' +
                '<i class="icon-4 png"></i>' +
                '<a href="//www.uzai.com/subject/mmrby" class="cont-hd white f18 b" target="_blank">查看美“侣”同款线路</a>' +
                '<span class="btn-fold pointer white f18 b tc">收起</span>' +
                '<embed src="http://player.youku.com/player.php/sid/XMTU2MDM0MjMyMA==/v.swf" type="application/x-shockwave-flash" allowFullScreen="true" quality="high" allowScriptAccess="always" class="side-video" />' +
            '</div>' +
            '<span class="btn-unfold pointer white f18 b tc">跟着孟孟游日本<span class="btn-cont">展开</span><i class="icon-item png"></i></span>' +
        '</div>';

        $('body').append(sHtml);

        sf = $('#j_sideFixedJp');
        ot = sf.offset().top;

        if (_uzw.cookie.get(ckName)) {
            sf.addClass('side-fixed-jp-on').find('.icon-wrap').addClass('icon-wrap-off');
            sf.find('.side-cont').removeClass('side-cont-on');
            sf.find('.btn-unfold').addClass('btn-unfold-on');
        } else {
            sf.find('.icon-wrap').removeClass('icon-wrap-off');
            sf.find('.side-cont').addClass('side-cont-on');
        }

        setTimeout(function () {
           sf.addClass('side-fixed-jp-on');
        }, 500);

        sf.find('.btn-fold').on('click', function () {
            var oThis = $(this);
            var op = oThis.parents('.side-cont');
            op.removeClass('side-cont-on').siblings('.icon-wrap').addClass('icon-wrap-off').siblings('.btn-unfold').addClass('btn-unfold-on');
            _uzw.cookie.set(ckName, "1", 1);
        });

        sf.find('.btn-unfold').on('click', function () {
            var oThis = $(this);
            oThis.removeClass('btn-unfold-on').siblings('.icon-wrap').removeClass('icon-wrap-off').siblings('.side-cont').addClass('side-cont-on');
        });

        if (_util.check.isIE6) {
            $(window).scroll(function () {
                var w = $(window);
                var st = w.scrollTop();

                if (st > 0) {
                    sf.css({ 'top': st + ot });
                }
            });
        }

        var oAM = $('#J_appMask');
        var oAMA = $('#J_appMaskArr');
        var amCKName = 'uzwAppNotice';
        var sfbs = 230; // side fixed init bottom value
        var sfbe = 110; // side fixed bottom value for app mask close
        if (sf.get(0)) {

            oAMA.on('click', function () {
                var o = $(this);
                sf.animate({ 'bottom': sfbs }, 800);
            });

            //close
            oAM.find('.app-mask-close').on('click', function () {
                sf.animate({ 'bottom': sfbe }, 800);
            });

            if (_uzw.cookie.get(amCKName)) {
                sf.css({ 'bottom': sfbe });
            } else {
                sf.css({ 'bottom': sfbs });
            }
        }
    }
}


//境外拼团筛选
function ziyouban(){
    var choiceItem = $('#j_choiceItem');
    var itemList = choiceItem.find('.other-city-box').find('a');
    var jwswitch = choiceItem.find('.recommend-city').find('.switch');
    var hotCity = choiceItem.find('.theme-items');
    itemList.on('click',function(){
        var o = $(this);
        var ot = o.text();
        var os = o.siblings();
        var op = o.parent();
        var ops = op.siblings();
        o.addClass('on');
        os.removeClass('on');
        ops.find('a').removeClass('on');
        hotCity.find('.hot-list').removeClass('on');
        hotCity.find('.hide').text(ot).addClass('on').show();
    });

    jwswitch.on('click',function(){
        $('.other-city-box').toggle();
    });

    var otherList = $('.jwct').siblings();
    $('.jwct').on('click',function(){
        $('.recommend-city').children('.hide').show();
    });
    otherList.on('click',function(){
        $('.recommend-city').children('.hide').hide();
        $('.other-city-box').hide();
    });
}