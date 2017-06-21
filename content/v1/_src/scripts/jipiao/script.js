/*
* @Author: jonas hsiao
* @Date:   2016-01-29 18:23:29
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-10-14 11:12:21
*/
'use strict';

var globalCitySelect = null;

winLoadFix(searchControlBar);

$(function () {
    jipiaoSlides();
    multiCalendar();
    listFilter();
    listFilterSorter();
    tipsInfo();
    _uzw.ui.tab('j_specialTicketTab');
    window.comGlobalCity && window.comGlobalCity();
    indexSubmit();
    pageOrder();//点击预订

    fixInputErr();
    contentSwitch();
});


function fixInputErr() {
    $(document).on('blur', '.input-err', function () {
        var oThis = $(this);
        oThis.removeClass('input-err');

        var tip = $('#j_lrfTips');
        tip.text('');
    });
}

function jipiaoSlides() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        oBS.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 6000,
            generatePagination: true
        });
        oBS.find('.slides_control').css({ 'width': '100%' });
    }
}

function multiCalendar() {

    var obox = $('#j_formsListing');
    var oway = $('#j_roundTrip');

    if (!obox.get(0)) {
        obox = $('#j_jipiaoListSearch');
    }

    if (!oway.get(0)) {
        oway = $('#j_switchWay');
    }

    $('input[data-multi-calendar]').on('focus', function () {

        //清空错误提示
        $('#j_lrfTips').html('');

        $('.cities-select-mod').hide();
        $('#j_jpAllCityFilter').hide();

        var o = $(this);
        var otag = o.attr('data-tag');

        $('.after-calendar').hide();

        var op = o.parent();
        var ac = op.find('.after-calendar');

        if (!ac.get(0)) {
            o.after('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            ac = op.find('.after-calendar');
            var cfg = {
                jsonpUrl: '',
                latestDate: '',//初始最近班期
                extCallBack: function (year, month) {
                    //选中
                    ac.find('.item').on('click', function () {
                        var oi = $(this);
                        var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray');
                        if (!oiExp) {
                            var oiY = oi.attr('data-year');
                            var oiM = oi.attr('data-month');
                            var oiD = oi.attr('data-day');
                            o.val(oiY + '-' + oiM + '-' + oiD);
                            ac.hide();
                            op.css({ 'z-index': 'auto' });
                        }
                    });
                },
                preCallback: function (year, month) {//上月下月预回调
                    //console.log(year, month);
                }
            };
            ac.jsonMultiCalendar(cfg);
        }

        ac.show();
        op.css({ 'z-index': 10 });

        blankFix('j_afterCalendarWrap', 'after-calendar', function () {
            op.css({ 'z-index': 'auto' });
        });//点击其它部分隐藏

        //fade
        if (otag == 'end') {
            var oradio = oway.find('.control-radio[data-trip="round"]');
            if (!oradio.get(0)) {
                oway.val('round');
                oradio = oway;
            }
            _switchRoundTrip(oradio, obox);
            ac.show();
        }

    });
}

//单选radio,select事件
function _switchRoundTrip(obj,box) {
    if (!obj.get(0) || !box.get(0)) {
        return;
    }

    var o = obj;
    var oi = o.children('input');
    var os = o.siblings('.control-radio');
    var oway = o.attr('data-trip');

    if (!oway) {
        oway = o.val();
    }

    box.find('.after-calendar').hide();

    os.removeClass('control-radio-on');
    os.find('input').val('0');
    o.addClass('control-radio-on');
    oi.val('1');

    if (oway == 'single') {
        box.find('.fade').addClass('fade-on');
        box.find('input[data-tag="end"]').val('');
    } else {
        box.find('.fade').removeClass('fade-on');
    }
}

function searchControlBar() {

    var ocityNode = $('#j_jpCityListNode');
    var oformList = $('#j_formsListing');
    var otrip = $('#j_roundTrip');
    var oswitch = $('#j_switchCity');
    var osearchList = $('#j_jipiaoListSearch');
    var osearchWay = $('#j_switchWay');
    if (osearchList.get(0)) {
        var osearchWrap = osearchList.parent('.jipiao-list-search-wrap');
        var slH = osearchList.height();
        var unitScroll = function () {
            var w = $(window);
            var st = w.scrollTop();
            var swT = osearchWrap.offset().top;

            if (st >= swT) {
                if (_util.check.isIE6) { //!window.XMLHttpRequest
                    osearchList.css({ 'top': st });
                }
                osearchList.addClass('search-fixed');
            } else {
                osearchList.removeClass('search-fixed');
            }
        };

        osearchWrap.height(slH);
        unitScroll();

        $(window).scroll(function () {
            unitScroll();
        });
    }

    $('input[data-cities-trigger]').on('focus', function () {
        var o = $(this);
        var on = o.next('input[type=hidden]');

        $('.cities-select-mod').hide();
        $('#j_jpAllCityFilter').remove();

        var op = o.parent('.cities-select-wrap');
        var ocity = o.siblings('.cities-select-mod');
        ocity.after('<ul class="hide city-filter-mod" id="j_jpAllCityFilter"></ul>');

        globalCitySelect = $('#j_jpAllCityFilter');

        var ocityInnerNode = ocity.find('.cities-select-tab');

        if (!ocityInnerNode.get(0)) {
            ocity.html(ocityNode.html());
            _uzw.ui.tab('cities-select-tab');
            ocity.find('.select-item').on('click', function () {
                var oo = $(this);
                var oot = oo.text();
                var ooc = oo.attr('data-code');

                o.val(oot);
                on.val(ooc);
                ocity.hide();
                op.css({ 'z-index': 'auto' });
            });
        }

        ocity.show();
        op.css({ 'z-index': 10 });

        blankFix('cities-select-wrap', 'cities-select-mod', function () {
            op.css({ 'z-index': 'auto' });
            $.trim(o.val()) && globalCitySelect.find('li').not('.li-none').eq(0).click(); //将城市列表第一个选项填充进input
            globalCitySelect.remove();
        });

        ocity.find('.close-wrap').on('click', function () {
            ocity.hide();
            op.css({ 'z-index': 'auto' });
        });

    });

    //switch city
    oswitch.on('click', function () {

        var o = $(this);
        var op = o.parents('.g2');
        var ipt1 = op.prev('.g4').find('input[data-cities-trigger]');
        var ipt1h = ipt1.siblings('input:hidden');

        var ipt2 = op.next('.g4').find('input[data-cities-trigger]');
        var ipt2h = ipt2.siblings('input:hidden');

        var ipt1V = ipt1.val();
        var ipt2V = ipt2.val();

        var ipt1VH = ipt1h.val();
        var ipt2VH = ipt2h.val();

        ipt1.val(ipt2V);
        ipt2.val(ipt1V);

        ipt1h.val(ipt2VH);
        ipt2h.val(ipt1VH);



    });

    //switch way
    otrip.find('.control-radio').on('click', function () {
        var o = $(this);
        _switchRoundTrip(o,oformList);
    });

    //switch way
    osearchWay.on('change', function () {
        var o = $(this);
        _switchRoundTrip(o, osearchList);
    });

    oformList.find('.cabin-select').children('li').on('click', function () {
        var o = $(this);
        var op = o.parents('.select-wrap');
        var opp = op.prev('.db-info-bar');
        var oppi = opp.children('input');
        oppi.val(o.text());
        op.hide();
    });

    // default start city
    var dct = oformList.find('input[data-cities-trigger]').eq(0);
    if (dct.get(0)) {
        var sCity = _ug.cityCN;
        var sc = oformList.find('input[name=startcity]');
        var _getCityData = function () {
            var lrLen = window.listRealGlobalCity.length; //listReal: 热门城市 数据集中英文
            for (var i = 0; i < lrLen; i++) {
                var item = window.listRealGlobalCity[i];
                var a = item.a.toUpperCase();
                var b = item.b.toUpperCase();
                // var c = item.c.toUpperCase();
                // var d = item.d.toUpperCase();

                if (b.indexOf(sCity) > -1) {
                    return a;
                }
            }
        };

        dct.val(sCity);
        sc.val(_getCityData());

        if (!dct.val() || !sc.val()) {
            dct.val('北京');
            sc.val('BJS');
        }
    }
}

function listFilter() {
    var bar = $('#j_slideFilterBar');
    var ffm = $('#j_flightFiltrateMod');
    var filtList = ffm.find('.filtrate-list');

    //check one
    bar.find('label').on('click', function () {
        var o = $(this);
        var op = o.parents('dd');
        var oc = o.children('.control-checkbox');

        //op.find('.control-checkbox').removeClass('control-checkbox-on');

        if (oc.hasClass('control-checkbox-on')) {
            oc.removeClass('control-checkbox-on');
        } else {
            oc.addClass('control-checkbox-on');
        }

        unitFilter();

    });

    //clear all
    bar.find('.clear-all').on('click', function () {
        var o = $(this);
        bar.find('.control-checkbox').removeClass('control-checkbox-on');

        unitFilter();

    });

    ffm.find('.sort-bar').find('.btn-switch').on('click', function () {
        var oThis = $(this);
        var oEm = oThis.find('em');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
            // oThis.attr('rel', 'data-taxprice=0');
            oEm.text('不含税价格');
        } else {
            oThis.addClass('on');
            // oThis.attr('rel', 'data-taxprice=1');
            oEm.text('含税价格');
        }

        // unitFilter();

    });

    filtList.on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oOII = oThis.parents('.flight-info').next('.other-info-items');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
            oOII.hide();
        } else {
            oThis.addClass('on');
            oOII.show();
        }
        fixIe8(oThis.parents('.main-box'));
    });

    filtList.on('mouseenter', '.transfer-list', function () {
        var oThis = $(this);
        oThis.find('.transfer-info-items').show();
        oThis.parents('.flight-info').css({ 'z-index': 10 });
    }).on('mouseleave', '.transfer-list', function () {
        var oThis = $(this);
        oThis.find('.transfer-info-items').hide();
        oThis.parents('.flight-info').css({ 'z-index': 'auto' });
    });

}

function unitFilter() {
    var ffm = $('#j_flightFiltrateMod');
    var params = getFilteredParams();

    var itemon = ffm.find('.bar-main').children('.on');
    var tag = itemon.attr('rel');
    var oi = itemon.children('i');
    if (tag == 'data-index') {
        initSorter(params, 'data-index', 'asc');
    } else {
        initSorter(params, tag, oi.hasClass('sort-up') ? 'asc' : 'desc');
    }
}

function listFilterSorter() {
    var filterBar = $('#j_flightFiltrateMod');
    var sortitems = filterBar.find('.bar-main').find('span');

    sortitems.on('click', function (k, v) {
        var o = $(this);
        var os = o.siblings('.sort-item');
        var params = getFilteredParams();

        os.removeClass('on');
        o.addClass('on');

        //移除非当前，所有down up 箭头
        os.find('.icon-sort').removeClass('sort-up').removeClass('sort-down');

        var oi = o.find('.icon-sort');
        if (oi.hasClass('sort-down')) {
            oi.removeClass('sort-down');
            oi.addClass('sort-up');
        } else if (oi.hasClass('sort-up')) {
            oi.removeClass('sort-up');
            oi.addClass('sort-down');
        } else {
            oi.addClass('sort-down');
        }

        unitFilter();
    });
}

function tipsInfo() {
    var jod = $('.jipiao-order-detail');
    var _hoverTips = function (obj, tNodeClass) {
        obj.on('mouseenter', '.' + tNodeClass, function () {
            var oThis = $(this);
            oThis.addClass(tNodeClass + '-on');
        }).on('mouseleave', '.' + tNodeClass, function () {
            var oThis = $(this);
            oThis.removeClass(tNodeClass + '-on');
        });
    };

    _hoverTips($('#j_sortList'), 'hover-wrap');
    _hoverTips($('.travel-order'), 'hover-wrap');
    _hoverTips($('.jipiao-order-detail'), 'detail-info');

    var oPF = $('.j_powerFloat');
    //提示poptip
    if (oPF.get(0)) {
        oPF.powerFloat({
            reverseSharp: true
        });
    }

    var sortList = $('#j_sortList');
    var tgqRule = $('#j_tgqRule');

    sortList.on('mouseenter', '.j_powerFloat', function () {
        var oThis = $(this);
        var rei = oThis.parents('.ii-main').find('.rule-explain-items').clone();
        tgqRule.empty().append(rei);
    });
}

//获取tag参数列表
function getFilteredParams() {
    var rels = [];
    $('#j_slideFilterBar').find('.filter-item').each(function (k, v) {
        var o = $(this);
        var tmp = [];
        o.find('.control-checkbox-on').each(function (m, n) {
            var oo = $(this);
            var oot = oo.attr('rel');
            tmp.push(oot);
        });
        if (tmp.length) {
            rels.push(tmp.join('|'));
        }

    });

    //含税
    // var tax = $('#j_flightFiltrateMod').find('.sort-bar').find('.bar-side').children('.btn-switch');
    // if (tax.get(0)) {
    //     rels.push(tax.attr('rel'));
    // }

    return rels.join(',');
}


//原子筛选
function initSorter(tag, atag, akey) {
    var list = $('#j_sortList');
    var filterBar = $('#j_slideFilterBar');
    //console.log(tag, '~', atag, '~', akey);

    if (list.get(0)) {
        if (_util.check.isIE6) {
            return;
        }
        // 清除展开状态
        list.find('.btn-switch').removeClass('on');
        list.find('.other-info-items').hide();

        list.uzSorter({
            sortBy: tag || '',
            sortAscTag: atag || '',
            sortAscKey: akey || 'asc',
            targetNull: "<div class='fruitless-box bg-white tc yahei'><i class='icon-uz vm icon-hotels png'></i><span class='f666 f24'>抱歉!暂无信息</span></div>",
            tragetAjaxText: "<p class='lh3 tc yahei f24 f666'>数据载入中...</p>",
            onInit: function () {
            },
            onCallback: function () {
                fixIe8($('.main-box'));

                var lcdrs = list.children('.filtrate-list').children('.filtrate-item');
                var lnum = lcdrs.length;
                var filterNums = $('#j_filterNums');

                filterNums.find('.i1').text(lnum);
                filterNums.find('.i2').text(lcdrs.filter('[data-zturn=0]').length);

                var oPF = list.find('.j_powerFloat');
                if (oPF.get(0)) {
                    oPF.powerFloat({ //提示poptip
                        reverseSharp: true
                    });
                }
            }
        });
    }
}

function indexSubmit() {
    var fom = $('#flightForm');
    var tip = $('#j_lrfTips');

    var hstartcity = fom.find('input[name=startcity]');
    var hendcity = fom.find('input[name=endcity]');

    var startcity = hstartcity.prev('.textbox');
    var endcity = hendcity.prev('.textbox');

    var fromDate = fom.find('input[name=fromDate]');
    var retDate = fom.find('input[name=retDate]');

    var adultCount = fom.find('select[name=adult]');
    var childCount = fom.find('select[name=child]');

    tip.text('');
    if (!tip.get(0)) {
        tip = {
            text: function (v) {
                v && window.alert(v);
            }
        };
    }

    adultCount.on('focus', function () {
        var o = $(this);
        tip.text('');
    });

    childCount.on('focus', function () {
        var o = $(this);
        tip.text('');
    });

    fom.on('submit', function () {
        var adultVal = parseInt($.trim(adultCount.val()), 10);
        var childVal = parseInt($.trim(childCount.val()), 10);

        if (!$.trim(startcity.val())) {
            startcity.focus();
            return false;
        } else if (!$.trim(hstartcity.val())) {
            tip.text('出发城市不存在！');
            startcity.focus();
            return false;
        } else if (!$.trim(endcity.val())) {
            endcity.focus();
            return false;
        } else if (!$.trim(hendcity.val())) {
            tip.text('抵达城市不存在！');
            endcity.focus();
            return false;
        } else if (!$.trim(fromDate.val())) {
            fromDate.focus();
            return false;
        } else if ($.trim(startcity.val()) === $.trim(endcity.val())) {
            tip.text('出发城市与到达城市不能相同！');
            return false;
        } else if ($.trim(retDate.val())) {
            if (Date.parse($.trim(fromDate.val()).replace(/-/g, "/")) > Date.parse($.trim(retDate.val()).replace(/-/g, "/"))) {
                tip.text('返回日期必须大于等于出发日期！');
                return false;
            }
        }

        if (!adultVal && !childVal) {
            tip.text('请选择出行人数！');
            return false;
        } else if (!adultVal && childVal) {
            tip.text('儿童单独乘机需直接向航空公司购票！');
            return false;
        } else if (adultVal) {
            if (adultVal + childVal > 9) {
                tip.text('乘客人数须小于等于9人！');
                return false;
            } else if (childVal / 2 > adultVal) {
                tip.text('目前只支持1个成人最多携带2名儿童！');
                return false;
            }
        }
        return true;
    });
}

function pageOrder() {

    try {
        document.domain = 'uzai.com';
    } catch (e) {

    }

    var u = location.href.toLowerCase();

    var startcity = _util.url.get('startcity');
    var endcity = _util.url.get('endcity');
    var fromdate = _util.url.get('fromdate');
    var retdate = _util.url.get('retdate');

    $("#fromCity").val(window.getCityByCode(startcity));
    $("#em-fromcity").text(window.getCityByCode(startcity));

    $("#toCity").val(window.getCityByCode(endcity));
    $("#em-tocity").text(window.getCityByCode(endcity));

    if (retdate) {
        $('#j_jipiaoListSearch').find('.fade-on').removeClass('fade-on').removeClass('fade');
        $('#j_switchWay').val('round');
    }

    $('input[name=fromDate]').val(fromdate);
    $('input[name=retDate]').val(retdate);

    var flt = $('#j_sortList');

    flt.on('click', '.btn-order', function() {
        if (_uzw.user.userid) {
            var token = $(this).attr("token");
            var flightClass = $('#hid_FlightClass').val();
            var adultNum = $('#hid_AdultNum').val();
            var childNum = $('#hid_ChildNum').val();
            $.ajax({
                type: "POST",
                dataType: "json",
                url: '/UzaiFlight/Verify',
                data: {
                    "token": token,
                    "flightClass": flightClass,
                    "adultNum": adultNum,
                    "childNum": childNum
                },
                beforeSend: function() {
                    initPop('pop-check');
                },
                success: function(data) {
                    if (data.status == 1) {
                        initPop('pop-disable');
                        var pd = $('.pop-disable');
                        var ct = pd.find('.downcount');
                        var ctv = parseInt(ct.text(), 10);
                        var num = 5;
                        var tt = setInterval(function() {
                            ct.text(--num);
                            if (num === 0) {
                                _uzw.ui.mask.hide();
                                pd.hide();
                                ct.text(5);
                                clearInterval(tt);
                                $('#flightForm').submit(); //提交表单
                            }
                        }, 1000);
                    } else {
                        $("#hid_token").val(token);
                        $("#bookFrom").submit();
                    }
                }
            });
        } else {
            _uzw.iframe.pop("http://u.uzai.com/QuickLogin?actionName=DoSubmit&tel=", 640, 315);
            return;
        }
    });
}

function contentSwitch() {
    var fList = $('#j_formsListing');
    var btnSwitch = $('#j_slideFilterBar').find('.side-filter').find('.switch');
    var ps = btnSwitch.parent('dt').next('dd').children('p');
    var psLen = ps.length;

    fList.find('.btn-switch').on('click', function () {
        var oThis = $(this);
        var aSearch = oThis.parents('.ft-bar').find('.advanced-search');

        if (oThis.hasClass('on')) {
            aSearch.hide();
            oThis.removeClass('on');
        } else {
            aSearch.show();
            oThis.addClass('on');
        }
    });

    btnSwitch.on('click', function() {
        var oThis = $(this),
            arrow = oThis.find('.border-arrow'),
            op = oThis.parent('dt').next('dd').children('p').eq(4).nextAll();
        if (arrow.hasClass('on')) {
            arrow.removeClass('on');
            op.hide();
        } else {
            arrow.addClass('on');
            op.show();
        }
    });

    if (psLen > 5) {
        ps.eq(4).nextAll().hide();
    } else {
        btnSwitch.hide();
    }
}

function DoSubmit() {
    _uzw.user.refresh();
}

//close pop
function closePop() {
    $('.pop-close').on('click', function () {
        var o = $(this);
        var op = o.parent('.pop-tips-mod');
        _uzw.ui.mask.hide();
        op.hide();
    });
}

//pop
function initPop(o) {
    $(".pop-tips-mod").hide();
    _uzw.ui.mask.show();
    var oo = $('.' + o);
    oo.show();
    closePop();
}

//解决ie8 box-fix标签内元素高度变化，main-box标签高度撑不开bug
function fixIe8(obj) {
    if (_util.check.isIE678) {
        obj.hasClass('visibility-fix') ? obj.removeClass('visibility-fix') : obj.addClass('visibility-fix');
    }
}
