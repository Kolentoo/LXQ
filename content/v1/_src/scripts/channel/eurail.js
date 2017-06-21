var trainCountrySelect = null;
var trainSelect = null;

try {
    document.domain = 'uzai.com';
} catch (e) {

}

var eurailLoader = {
    show: function () {
        var al = $('#j_ajaxLoader');

        if (!al.get(0)) {
            $('body').append('<div id="j_ajaxLoader"><img src="//r.uzaicdn.com/content/v1/images/common/loader.gif" alt="loader"></div>');
            al = $('#j_ajaxLoader');
        }
        al.show();
        fixIe6('j_ajaxLoader');
    },
    hide: function () {
        $('#j_ajaxLoader').hide();
    }
};

$(function () {

    if (typeof (comTrainCity) != 'undefined') {
        comTrainCity();
        searchControlBar();
    }

    if (typeof (comTrainCountry) != 'undefined') {
        comTrainCountry();
        countryControl();
    }

    _uzw.ui.tab('j_bannerTab', function (index, obj) {
        $('#j_lrfTips').html('');
    });

    _uzw.ui.tab('j_passIntroTab');
    tipsInfo();
    contentSwitch();
    eurailPager();
    eurailSlides();
    eurailPop();
    eurailSearch();
    multiCalendar();
    indexSubmit();

    euSelector();
    euTimer();

    listFilter();
    listFilterSorter();

    fixInputErr();

});

function fixInputErr() {
    $(document).on('blur', '.input-err', function () {
        var oThis = $(this);
        oThis.removeClass('input-err');

        var tip = $('#j_lrfTips');
        tip.text('');
    });
}

var eurailPageLoad = function () {
    if ($('#j_popPassStates').get(0)) {
        FourCountry.Init("eurail");
    }
};

if (window.addEventListener) {
    window.addEventListener('load', function () {
        eurailPageLoad();
    }, false);
} else {
    window.attachEvent('onload', function () {
        eurailPageLoad();
    });
}

function searchControlBar() {

    var ocityNode = $('#j_jpCityListNode');
    var oswitch = $('.j_switchCity');

    //switch city
    oswitch.on('click', function () {

        var o = $(this);
        var op = o.parents('.item-city');

        var ipt1 = op.find('.cities-select-wrap').eq(0).find('.fill');
        var ipt1h = ipt1.siblings('input:hidden');

        var ipt2 = op.find('.cities-select-wrap').eq(1).find('.fill');
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

    $('input[data-cities-trigger]').on('focus', function () {
        var o = $(this);
        var on = o.next('input[type=hidden]');

        $('.cities-select-mod').hide();
        $('#j_jpAllCityFilter').remove();

        var op = o.parent('.cities-select-wrap');
        $('.cities-select-wrap').css({ 'z-index': 'auto' });

        var ocity = o.siblings('.cities-select-mod');
        ocity.after('<ul class="hide city-filter-mod" id="j_jpAllCityFilter"></ul>');
        trainSelect = $('#j_jpAllCityFilter');

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
            //将城市列表第一个选项填充进input
            trainSelect.find('li').not('.li-none').eq(0).click();
            trainSelect.remove();
        });

        ocity.find('.close-wrap').on('click', function () {
            ocity.hide();
            op.css({ 'z-index': 'auto' });
        });

    });
}

function countryControl() {

    var ocityNode = $('#j_jpCountryListNode');

    $('input[data-countries-trigger]').on('focus', function () {
        var o = $(this);
        var on = o.next('input[type=hidden]');

        $('.countries-select-mod').hide();
        $('#j_jpAllCountryFilter').remove();

        var op = o.parent('.countries-select-wrap');
        var ocity = o.siblings('.countries-select-mod');

        ocity.after('<ul class="hide city-filter-mod" id="j_jpAllCountryFilter"></ul>');
        trainCountrySelect = $('#j_jpAllCountryFilter');

        var ocityInnerNode = ocity.find('.countries-select-tab');

        if (!ocityInnerNode.get(0)) {
            ocity.html(ocityNode.html());
            _uzw.ui.tab('countries-select-tab');
            ocity.find('.select-item').on('click', function () {
                var oo = $(this);
                var oot = oo.find('.s1').text();
                var ooc = oo.attr('data-code');
                o.val(oot);
                on.val(ooc);
                ocity.hide();
                op.css({ 'z-index': 'auto' });
            });
        }

        ocity.show();
        op.css({ 'z-index': 10 });

        blankFix('countries-select-wrap', 'countries-select-mod', function () {
            op.css({ 'z-index': 'auto' });
            //将城市列表第一个选项填充进input
            trainCountrySelect.find('li').not('.li-none').eq(0).click();
            trainCountrySelect.remove();
        });
        ocity.find('.close-wrap').on('click', function () {
            ocity.hide();
            op.css({ 'z-index': 'auto' });
        });

    });
}


function eurailPager() {
    var pagers = $('.fn-pager');
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
                    //console.log(currentPage);
                    //console.log(allPage);
                }
            });
        });
    }
}

function eurailSlides() {
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
        oBS.find('.slides_control').css({ 'width': '100%' });
    }
    var ds = $('#j_dateSlides');
    var dsLen = 0;

    var lion = ds.find('.slide-item').find('li.on');
    var ind = lion.parent('.slide-item').index();

    if (ds.get(0)) {
        ds.slides({
            currentClass: 'on',
            next: 'btn-next',
            prev: 'btn-prev',
            slideSpeed: 300,
            slideEasing: "easeOutQuad",
            effect: 'slide',
            hoverPause: false,
            pause: 1000,
            start: (ind + 1) || 1,
            play: 0,
            generateNextPrev: false,
            generatePagination: false,
            slidesLoaded: function () {
                var si = ds.find('.slide-item');
                si.width(ds.width() - 70);

                dsLen = ds.find('.slide-item').length;

                //bind trigger
                ds.find('.btn-item').removeClass('btn-off');

                if (ind === 0) {
                    ds.find('.ds-btn-prev').addClass('btn-off');
                }

                //next
                ds.find('.ds-btn-next').on('click', function () {
                    var obx = $(this);
                    if (!obx.hasClass('btn-off')) {
                        ds.find('.btn-next').click();
                    }
                });
                //prev
                ds.find('.ds-btn-prev').on('click', function () {
                    var obx = $(this);
                    if (!obx.hasClass('btn-off')) {
                        ds.find('.btn-prev').click();
                    }
                });

            },
            animationComplete: function (idx) {
                ds.find('.btn-item').removeClass('btn-off');
                if (idx === dsLen) {
                    ds.find('.ds-btn-next').addClass('btn-off');
                }else if (idx === 1) {
                    ds.find('.ds-btn-prev').addClass('btn-off');
                }
            }
        });
    }
}

function eurailPop() {
    $('.j_ageExplain').on('click', function () {
        uiPop('j_popAgeExplain');
    });
    $('#j_passStates').on('click', function () {
        uiPop('j_popPassStates', '.pop-eurail');
    });
    /*$('#j_passInfoTable').on('click', '.btn-order', function () {
        uiPop('j_popPpeopleNum', '.pop-people-num', function (obj) {
            obj.find('.j_ageExplain').on('click', function () {
                if ($('#j_popPpeopleNum:visible').get(0)) {
                    $('#j_popAgeExplain').on('click', '.j_popClose', function () {
                        _uzw.ui.mask.show();
                    });
                }
            });
        });
        return false;
    });*/
}

function eurailSearch() {
    var otab = $('#j_bannerTab');
    var otrip = otab.find('.j_roundTrip');
    var oee = $('#j_eurailSizer').find('.eurail-search');
    var osearchWay = $('#j_switchWay');

    //switch way
    otrip.find('.control-radio').on('click', function () {
        var o = $(this);
        _switchRoundTrip(o, otab);
    });

    //switch way
    osearchWay.on('change', function () {
        var o = $(this);
        _switchRoundTrip(o, oee);
    });
}

function multiCalendar() {

    var obox = $('#j_bannerTab');
    var oway = obox.find('.j_roundTrip');

    if (!obox.get(0)) {
        obox = $('#j_eurailSizer').find('.eurail-search');
    }

    if (!oway.get(0)) {
        oway = obox.find('#j_switchWay');
    }

    $('input[data-multi-calendar]').on('focus', function () {

        $('#j_lrfTips').html('');

        var o = $(this);
        var otag = o.attr('data-tag');
        var op = o.parent();
        var ac = op.find('.after-calendar');

        $('.after-calendar').hide();

        $('.j_afterCalendarWrap').css({ 'z-index': 'auto' });

        if (!ac.get(0)) {
            o.after('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            ac = op.find('.after-calendar');
            var cfg = {
                jsonpUrl: '',
                latestDate: '',//初始最近班期
                skipDays: 7,
                extCallBack: function (year, month) {
                    //选中
                    ac.find('.item').on('click', function () {
                        var oi = $(this);
                        var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray') || oi.hasClass('item-unused');
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

        //fade 点击返程日期是触发
        if (otag == 'end') {
            var oradio = oway.find('.control-radio[data-trip="round"]');
            if (!oradio.get(0)) {
                oway.val('0');
                //oway.parent().find('.timelow').val('');
                oradio = oway;
            }
            _switchRoundTrip(oradio, obox);
            ac.show();
        }

        ac.show();
        op.css({ 'z-index': 10 });

        blankFix('j_afterCalendarWrap', 'after-calendar', function () {
            op.css({ 'z-index': 'auto' });
        });//点击其它部分隐藏

    });
}

//单选radio,select事件
function _switchRoundTrip(obj, box) {
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
    o.addClass('control-radio-on');

    //set checked
    o.find('input').prop('checked', true);

    if (oway == 'single' || oway == 1) {
        box.find('.fade').addClass('fade-on');
        box.find('input[data-tag="end"]').val('');
    } else {
        box.find('.fade').removeClass('fade-on');
    }
}

function tipsInfo() {
    var _hoverTips = function (obj) {
        obj.on('mouseenter', '.hover-wrap', function () {
            var oThis = $(this);
            oThis.addClass('hover-wrap-on');
        }).on('mouseleave', '.hover-wrap', function () {
            var oThis = $(this);
            oThis.removeClass('hover-wrap-on');
        });
    };
    _hoverTips($('.j_infoTable'));
    _hoverTips($('#j_eurailSizer'));
    _hoverTips($('#j_passIntroTab'));

    var pf = $('.j_powerFloat');
    if (pf.get(0)) {
        pf.powerFloat({
            reverseSharp: true
        });
    }
}

function contentSwitch() {
    var es = $('#j_eurailSizer');
    es.find('.searched-bar').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oES = oThis.parents('.searched-bar').siblings('.eurail-search');
        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
            oES.hide();
        } else {
            oThis.addClass('on');
            oES.show();
        }


    });

    $('.j_infoTable').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oCont = oThis.find('.switch-cont');
        var oAM = oThis.find('.arrow-mod');
        var oHide = oThis.parents('.item-row').siblings('.hide');
        if (oAM.hasClass('on')) {
            oAM.removeClass('on');
            oCont.text('更多');
            oHide.hide();
        } else {
            oAM.addClass('on');
            oCont.text('收起');
            oHide.show();
        }
        var oMB = $('.main-box');
        //解决ie8 box-fix标签内元素高度变化，main-box标签高度撑不开bug
        if (_util.check.isIE678 && oMB.get(0)) {
            oMB.hasClass('visibility-fix') ? oMB.removeClass('visibility-fix') : oMB.addClass('visibility-fix');
        }
    });
}

function uiPop(node, parentClass, cb, yAxis) {
    var obj = $('#' + node);
    yAxis = yAxis || $(window).height() / 2;
    parentClass = parentClass || '.ui-pop';
    obj = (!obj.get(0)) ? $('.' + node) : obj;

    _uzw.ui.mask.show();
    obj.show();
    obj.on('click', '.j_popClose', function () {
        var oThis = $(this);
        oThis.parents(parentClass).hide();
        _uzw.ui.mask.hide();
    });

    if (cb) {
        cb(obj);
    }

    //IE6下的定位
    if (_util.check.isIE6) {
        obj.css('top', $(document).scrollTop() + yAxis);
        $(window).on('scroll', function () {
            obj.css('top', $(document).scrollTop() + yAxis);
        });
    }
}

//IE6下的定位
function fixIe6(node, yAxis) {
    var o = $('#' + node);

    o = o.get(0) ? o : $('.' + node);
    yAxis = yAxis || $(window).height() / 2;

    if (_util.check.isIE6) {
        o.css('top', $(document).scrollTop() + yAxis);
        $(window).on('scroll', function () {
            o.css('top', $(document).scrollTop() + yAxis);
        });
    }
}

function indexSubmit() {

    var _initRadio = function () {
        var jrt = $('.j_roundTrip');
        if (jrt.get(0)) {
            jrt.find('.control-radio').removeClass('control-radio-on');
            jrt.find('input[name=roundtripMode]').prop('checked', false);
            jrt.each(function (k, v) {
                var o = $(this);
                o.find('.control-radio').first().addClass('control-radio-on');
                o.find('input[name=roundtripMode]').first().prop('checked', true);
            });

            $('input[name=returnDate]').val('');
        }
    };
    _initRadio();

    var fomOW = $('#onewayform');
    var fomTP = $('#tongpiaoform');
    var fomSF = $('#seatform');

    var _unitForm = function (fom) {

        if (!fom.get(0)) {
            return;
        }

        var tip = $('#j_lrfTips');
        tip.text('');

        if (!tip.get(0)) {
            tip = {
                text: function (v) {
                    alert(v);
                }
            };
        }

        //点对点火车票
        var hstartcity = fom.find('input[name=fromcity]');
        var hendcity = fom.find('input[name=endcity]');

        var startcity = hstartcity.prev('input');
        var endcity = hendcity.prev('input');

        var fromDate = fom.find('input[name=departureDate]');
        var retDate = fom.find('input[name=returnDate]');

        var person = 0;

        fom.on('submit', function () {

            if (fom.attr('id') == 'onewayform' || fom.attr('id') == 'seatform') {
                var oway = fom.find('select[name=roundtripMode]');
                if (!oway.get(0)) {
                    oway = fom.find('input[name=roundtripMode]:checked');
                }

                var owayv = oway.val();

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
                } else if ($.trim(startcity.val()) == $.trim(endcity.val())) {
                    tip.text('出发城市与到达城市不能相同！');
                    return false;
                } else if ((owayv == '0' || owayv == 'round') && !$.trim(retDate.val())) {
                    retDate.focus();
                    return false;
                } else if ($.trim(retDate.val())) {
                    if (Date.parse($.trim(fromDate.val()).replace(/-/g, "/")) > Date.parse($.trim(retDate.val()).replace(/-/g, "/"))) {
                        tip.text('返回日期必须大于等于出发日期！');
                        return false;
                    }
                }

                var psg = fom.find("input[name=passenger]").val();
                var psgArr = psg.split('|');


                for (var i = 0; i < psgArr.length; i++) {
                    person += parseInt(psgArr[i], 10);
                }
            }

            if (fom.attr('id') == 'onewayform') {
                if (person === 0) {
                    tip.text("人数不能为0");
                    return false;
                }

                if (person > 9) {
                    tip.text("人数不能超过9人");
                    return false;
                }

                if (retDate.val()) {
                    fom.attr("action", "/RoundWaySearch/GoRoundSearch");
                }
                else {
                    fom.attr("action", "/OneWay/OneWaySearch");
                }
            } else if (fom.attr('id') == 'seatform') {
                if (person === 0) {
                    tip.text("人数不能为0");
                    return false;
                }
                if (retDate.val()) {
                    fom.attr("action", "/SeatRoundWay/GoSeatSearch");
                }
                else {
                    fom.attr("action", "/SeatOneWay/OneWaySearch");
                }
            } else if (fom.attr('id') == 'tongpiaoform') {

                var hctyname = fom.find('input[name=countryName]');
                var ctyname = hctyname.prev('input');

                if (!$.trim(ctyname.val())) {
                    ctyname.focus();
                    return false;
                } else if (!$.trim(hctyname.val())) {
                    tip.text('通票国家不存在！');
                    ctyname.focus();
                    return false;
                }
            }

            return true;
        });
    };

    _unitForm(fomOW);
    _unitForm(fomTP);
    _unitForm(fomSF);

}


//判断数据是否正在载入
function checkDataStatus() {
    var ldr = $('#j_erLoading');
    var ldr2 = $('#j_sortList_loader');
    if (ldr.get(0) || ldr2.get(0)) {
        alert('数据载入中，请稍等');
        return false;
    }
    return true;
}

function ticketList(trainType,backType) {

    //MoreTrain、MoreSeat

    var u = location.href.toLowerCase();

    var fom = $('#j_switchWay').parents('form');

    var hfct = fom.find('input[name=fromcity]');
    var hect = fom.find('input[name=endcity]');

    var fct = hfct.prev('input');
    var ect = hect.prev('input');

    var dtlow = fom.find('input[name=departureTimeLow]');
    var rtlow = fom.find('input[name=returnTimeLow]');

    rtlow.on('focus', function () {
        $(this).parents('.fade').removeClass('fade-on');
        $('#j_switchWay').val('0');
    });

    var fromCityCode = _util.url.get('fromcity').toUpperCase() || $("#hdfromCityCode").val().toUpperCase();
    var toCityCode = _util.url.get('endcity').toUpperCase() || $("#hdtoCityCode").val().toUpperCase();

    hfct.val(fromCityCode);
    ect.val(toCityCode);

    fct.val(getCityByCode(fromCityCode));
    ect.val(getCityByCode(toCityCode));

    var psg = _util.url.get('passenger');

    var myPsg = "";
    if ($('#hdadult').get(0)) {
        myPsg = parseInt($('#hdadult').val(), 10) + '|' + parseInt($('#hdchild').val(), 10) + '|' + parseInt($('#hdyouth').val(), 10) + '|' + parseInt($('#hdsenior').val(), 10);
    } else if ($('#hdnPassHolders').get(0)){
        myPsg=$("#hdnPassHolders").val();
    }else{
        myPsg=decodeURI(psg);
    }

    var phv = myPsg;
    var rpv = _util.url.get('roundtripmode') || $("#hdroundtripMode").val();

    var ddv = _util.url.get('departuredate') || $("#hddepartureDate").val();
    var rdv = _util.url.get('returndate') || $("#hdreturnDate").val();

    var dtlv = _util.url.get('departuretimelow') || $("#departureTimeLow").val();
    var rtlv = _util.url.get('returntimelow') || $("#returnTimeLow").val();

    $("#j_switchWay").val(rpv);

    if (rpv === '0') {
        fom.find('.fade').removeClass('fade-on');
    } else {
        fom.find('.fade').addClass('fade-on');
    }

    var roundtripMode = rpv;

    var departureDate = ddv;
    var returnDate = rdv;

    var departureTimelow = dtlv;
    var returnTimeLow = rtlv;

    var hdgotrain = $("#hdgotrain").val();
    var hdgojounery = $("#hdgojounery").val();

    var latestTrainNumber = '';
    var latestTrainDepartureTime = '';

    var ulWrap = $('#j_sortList').children('ul');
    var nMore = $('#j_moreTrainInfo');
    var jps = $('#j_piaoSwitcher');

    //检查票务情况
    var _unitCheckPiao = function () {
        var liSource = $('#j_sortList_copy');
        if (!liSource.get(0)) {
            liSource = $('#j_sortList');
        }
        var lisLen = liSource.children('.filtrate-list').children('li').length;
        var lisP0 = liSource.children('.filtrate-list').children('li[data-piao=0]').length;
        var lisP1 = liSource.children('.filtrate-list').children('li[data-piao=1]').length;

        //console.log(lisLen, lisP0, lisP1);

        if (lisLen > 0 && (lisP0 == lisLen || lisP1 == lisLen)) {
            jps.find('.bs-item').hide();
            jps.attr('rel', "");
        } else {
            if (lisLen === 0) {
                jps.find('.bs-item').hide();
                jps.attr('rel', "");
            } else {
                jps.find('.bs-item').show();
                jps.attr('rel', "data-piao=1");
            }
        }
    };

    //清除选中筛选条件
    var _unitClearFilter = function () {

        //清空节点
        $('#j_sortList_null').remove();
        //ulWrap.empty();

        //还原条件状态
        var bar = $('#j_sortConditions');
        var bls = bar.find('.sort-list');
        bls.find('li').removeClass('on');
        var blsCK = bls.find('li').find('input:checkbox');

        bls.find('li').eq(0).addClass('on');
        bls.find('li').eq(0).find('i').removeClass('sort-down').addClass('sort-up');

        blsCK.prop('checked', false);
        blsCK.parent('.item-cont').attr('rel', '');
        jps.attr('rel', "data-piao=1");


    };

    var _unitAjaxData = function (searchtype, latestTrainNumber, latestTrainDepartureTime) {

        $('#j_erNull').remove();

        var cfg = {};
        if (phv != '0') {
            cfg.passenger = phv;
        }

        if (roundtripMode) {
            cfg.roundtripMode = roundtripMode;
        }
        if (departureDate) {
            cfg.departureDate = departureDate;
        }
        if (returnDate) {
            cfg.returnDate = returnDate;
        }
        if (fromCityCode) {
            cfg.fromCityCode = fromCityCode;
        }
        if (toCityCode) {
            cfg.toCityCode = toCityCode;
        }

        if (departureTimelow) {
            cfg.departureTimelow = departureTimelow;
        }
        if (returnTimeLow) {
            cfg.returnTimeLow = returnTimeLow;
        }
        if (latestTrainNumber) {
            cfg.latestTrainNumber = latestTrainNumber;
        }
        if (latestTrainDepartureTime) {
            cfg.latestTrainDepartureTime = latestTrainDepartureTime;
        }
        if (searchtype) {
            cfg.searchtype = searchtype;
        }
        if (backType) {
            cfg.type = backType;
        }
        if (hdgotrain) {
            cfg.hdgotrain = hdgotrain;
        }
        if (hdgojounery) {
            cfg.hdgojounery = hdgojounery;
        }

        var dfr = $.ajax({
            url: "/" + trainType + "/GetMoreTrain",
            type: "POST",
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                $('#j_erLoading').remove();
                ulWrap.append("<div id='j_erLoading'><p class='tc yahei f24 f666'><img src='//r.uzaicdn.com/content/v1/images/common/loader.gif' />数据载入中...</p></div>");
            },
            data: cfg
        });
        return dfr;
    };

    var _unitAjaxDone = function (msg) {

        $('#j_erLoading').remove();

        tipsInfo();//二次绑定事件

        if (!msg && !msg.length) {
            nMore.remove();
            $('#j_erNull').remove();
            $('#j_sortList_null').remove();
            ulWrap.after("<div id='j_erNull'><div class='fruitless-box bg-white tc yahei'><i class='icon-uz vm icon-hotels png'></i><span class='f666 f24'>很抱歉!暂时无法找到您要的欧铁信息</span></div></div>");
            jps.find('.bs-item').hide();
            jps.attr('rel', "");
        } else {

            $('#j_erNull').remove();

            var state = msg.state;
            if (!parseInt(state, 0)) {
                nMore.remove();
            } else {
                nMore.show();
            }

            ulWrap.append(msg.html);
            latestTrainNumber = msg.latestTrainNumber;
            latestTrainDepartureTime = msg.latestTrainDepartureTime;
        }

        _unitCheckPiao();
    };

    //进入页面 请求api 得到数据
    _unitAjaxData(1, '', '').done(function (msg) {
        _unitAjaxDone(msg);
    });

    //点击更多
    $(".j_infoTable").parent().on('click', '#getmore', function () {

        _unitClearFilter();

        if ($('#j_sortList_copy').get(0)) {
            ulWrap.html($('#j_sortList_copy').find('ul').html());
            $('#j_sortList_copy').remove();
        }

        nMore.hide();

        _unitAjaxData(2, latestTrainNumber, latestTrainDepartureTime).done(function (msg) {
            _unitAjaxDone(msg);
        });

    });

    //点击日期
    $('#j_dateSlides').find("li").click(function () {

        if (checkDataStatus() === false) {
            return;
        }

        var oli = $(this);
        var odate = oli.attr("data-date");
        var olis = $('#j_dateSlides').find("li");
        olis.removeClass('on');
        oli.addClass("on");

        //还原j_moreTrainInfo
        if (!$('#j_moreTrainInfo').get(0)) {
            $('.j_infoTable').after("<p  id='j_moreTrainInfo' class='more-train-info tc mt10'><span class='btn-more f16' id='getmore' data-page='2'>点击查看更多...</span></p>");
            nMore = $('#j_moreTrainInfo');
        }

        nMore.hide();
        ulWrap.empty();
        $('#j_sortList_copy').remove();
        departureDate = odate;

        _unitClearFilter();

        _unitAjaxData(1, '', '').done(function (msg) {
            //赋值隐藏域
            $('#hddepartureDate').val(departureDate);
            _unitAjaxDone(msg);
        });

    });

}




function listFilter() {

    var esizer = $('#j_eurailSizer');
    var bar = $('#j_sortConditions');

    var pswc = $('#j_piaoSwitcher');


    //直达
    var lblc = bar.find('.sort-list').find('label.item-cont');
    lblc.find('input:checkbox').on('change', function () {

        var o = $(this);

        if (!checkDataStatus()) {
            o.prop('checked', !o.prop('checked'));
            return false;
        }

        $('#j_erLoading').remove();
        $('#j_sortList_loader').remove();


        if(o.prop('checked')){
            lblc.attr('rel', "data-zhida=0");
        }else{
            lblc.attr('rel', "");
        }
        unitFilter();
    });

    //普通票 定位票
    pswc.find('.bs-item').on('click', function () {

        if (!checkDataStatus()) {
            return false;
        }

        $('#j_erLoading').remove();
        $('#j_sortList_loader').remove();

        var o = $(this);
        var oidx = o.index();
        var os = o.siblings('.bs-item');

        if (o.hasClass('on')) {
            return;
        }

        os.removeClass('on');
        o.addClass('on');

        if (oidx === 0) {
            pswc.attr('rel', "data-piao=1");
        } else {
            pswc.attr('rel', "data-piao=0");
        }

        unitFilter();

    });

}

function unitFilter() {
    var ffm = $('#j_sortConditions');
    var params = getFilteredParams();

    var itemon = ffm.find('.sort-list').children('.on').find('span.sort-cont');
    var tag = itemon.attr('rel');
    var oi = itemon.children('i');

    $('#j_moreTrainInfo').hide();

    if (tag == 'data-index') {
        initSorter(params, 'data-index', 'asc');
    } else {
        initSorter(params, tag, oi.hasClass('sort-up') ? 'asc' : 'desc');
    }
}

function listFilterSorter() {
    var sortitems = $('#j_sortConditions').find('.sort-list').find('span.sort-cont');

    sortitems.on('click', function (k, v) {

        if (!checkDataStatus()) {
            return false;
        }

        var o = $(this);
        var op = o.parent('.sort-item');
        var os = op.siblings('.sort-item');
        var params = getFilteredParams();

        os.removeClass('on');
        op.addClass('on');

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

//获取tag参数列表
function getFilteredParams() {
    var rels = [];

    //直达
    var zd = $('#j_sortConditions').find('label.item-cont');
    if (zd.attr('rel')) {
        rels.push(zd.attr('rel'));
    }

    //含税
    var jps=$('#j_piaoSwitcher');
    if (jps.children('.bs-item').eq(0).css('display') == 'block') {
        rels.push(jps.attr('rel'));
    }

    return rels.join(',');
}

//原子筛选
function initSorter(tag, atag, akey) {
    var list = $('#j_sortList');
    //console.log(tag, '~', atag, '~', akey);

    if (list.get(0)) {
        if (_util.check.isIE6) {
            return;
        }
        list.uzSorter({
            sortBy: tag || '',
            sortAscTag: atag || '',
            sortAscKey: akey || 'asc',
            targetNull: "<div class='fruitless-box bg-white tc yahei'><i class='icon-uz vm icon-hotels png'></i><span class='f666 f24'>很抱歉!暂时无法找到您要的欧铁信息</span></div>",
            tragetAjaxText: "<p class='tc yahei f24 f666'><img src='//r.uzaicdn.com/content/v1/images/common/loader.gif' />数据载入中...</p>",
            onInit: function () {
                $('#j_erNull').remove();
            },
            onCallback: function () {
                fixIe8($('.main-box'));
                $('#j_moreTrainInfo').show();
                $('#j_erNull').remove();
            }
        });
    }
}


//单程提交订单
function onwaySearchSubmit(obj) {

    if (_uzw.user.userid) {
        //车厢内容
        var hidgotrian = $(obj).parent().parent().find("input.hidseat").val();
        //alert(hidgotrian);
        console.info("单程座位内容");
        console.info(hidgotrian);
        var hdjounery = $(obj).parent().parent().find("input.hidjounery").val();
        console.info("单程行程内容");
        var TrainJson = $(obj).parent().parent().find("input.hidorderpost").val();
        console.info(TrainJson);
        $("#TrainJson").val(TrainJson);
        console.info(hdjounery);
        //行程内容
        //alert("单程提交");
        $("#trainform").submit();
    } else {
        _uzw.iframe.pop("http://u.uzai.com/QuickLogin?actionName=_uzw.user.refresh", 640, 315);
    }

}

function roundsubmit(obj) {
    if (_uzw.user.userid) {
        var gotrain = $("#hdgotrain").val();
        console.info("去程座位内容");
        console.info(gotrain);
        var gojounery = $("#hdgojounery").val();
        console.info("去程行程内容");
        console.info(gojounery);
        var backtrain = $(obj).parent().parent().find("input.hidseat").val();
        console.info("回程座位内容");
        console.info(backtrain);
        var backjounery = $(obj).parent().parent().find("input.hidjounery").val();
        console.info("回程行程内容");
        console.info(backjounery);
        $("#hdbacktrain").val(backtrain);
        $("#hdbackjounery").val(backjounery);
        var TrainJson = $(obj).parent().parent().find("input.hidorderpost").val();
        console.info(TrainJson);
        $("#TrainJson").val(TrainJson);
        //提交订单
        //alert("往返提交订单");
        $("#trainform").submit();
    } else {
        _uzw.iframe.pop("http://u.uzai.com/QuickLogin?actionName=_uzw.user.refresh", 640, 315);
    }
}

function gotrain(obj) {
    if (_uzw.user.userid) {
        //提交到回程
        //得到隐藏hidden数据
        var hdadult = $("#hdadult").val();//成人
        var hdyouth = $("#hdyouth").val();//青年
        var hdchild = $("#hdchild").val();//儿童
        var hdsenior = $("#hdsenior").val();//老者
        var hddepartureDate = $("#hddepartureDate").val();
        var hddepartureTimeLow = $("#hddepartureTimeLow").val();
        var hdfromCityCode = $("#hdfromCityCode").val();
        var hdtoCityCode = $("#hdtoCityCode").val();
        var hdroundtripMode = $("#hdroundtripMode").val();
        var hdreturnDate = $("#hdreturnDate").val();
        var hdreturnTimeLow = $("#hdreturnTimeLow").val();
        var hidgotrian = $(obj).parent().parent().find("input.hidseat").val();
        //alert(hidgotrian);
        var hdjounery = $(obj).parent().parent().find("input.hidjounery").val();
        //alert(hdjounery);
        $("#hdgotrain").val(hidgotrian);
        $("#hdjounery").val(hdjounery);
        $("#trainform").submit();
    } else {
        _uzw.iframe.pop("http://u.uzai.com/QuickLogin?actionName=_uzw.user.refresh", 640, 315);
    }
}

function euSelector() {
    var euselWrap = $('.tb-wrap-selector');
    euselWrap.find('li').find('span').on('click', function () {
        var o = $(this);
        var ot = o.siblings('input');
        var otv = parseInt(ot.val(), 10);
        if (o.hasClass('num-cut')) {
            if (otv >= 1) {
                ot.val(otv - 1);
            }
        } else {
            var allIpt = o.parents('ul').find('input');
            var sb = 0;
            allIpt.each(function (k,v) {
                var oo = $(this);
                sb += parseInt(oo.val(), 10);
            });
            if (otv <= 8 && sb <= 8) {
                ot.val(otv + 1);
            }
        }
        //set target value
        var ops = o.parents('.eu-selector');
        _unitSumPassenger(ops);
    });

    var _unitSumPassenger = function (obj) {
        var ipts = obj.find('input');
        var sb = [];
        var sbv = [];
        ipts.each(function () {
            var oo = $(this);
            var oot = oo.attr('data-tag');
            var oov = parseInt(oo.val(), 10);
            if (oov > 0) {
                sb.push(oov + oot + ' ');
            }
            sbv.push(oov);
        });
        var os = obj.siblings('.passenger');
        os.val(sb.join(''));
        os.next('input:hidden').val(sbv.join('|'));
    };

    euselWrap.find('.passenger').on('focus', function () {
        var o = $(this);
        o.siblings('.eu-selector').show();
        blankFix('tb-wrap-selector', 'eu-selector', function () {

        });
    });

    //pop rules
    euselWrap.find('.rules').on('click', function () {
        uiPop('j_popAgeExplain');
    });

}

function euTimer() {
    var eslow = $('#j_eurailSizer').find('.timelow');

    eslow.on('focus', function () {
        var o = $(this);
        var es = o.siblings('.eu-timer');
        es.show();

        var _initPos = function () {
            var lion = es.find('.hours').find('.on');
            var liidx = lion.index();
            es.find('.hours').scrollTop(25 * (liidx - 2));
        };

        _initPos();

        es.find('li').on('click', function () {
            var oo = $(this);
            var op = oo.parent();

            var ot = oo.text();
            var os = oo.siblings('li');
            os.removeClass('on');
            oo.addClass('on');

            if (op.hasClass('minutes')) {
                es.hide();
            }

            var lions = es.find('.on');
            o.val(lions.eq(0).text() + ':' + lions.eq(1).text());

            //set width eu-timer;
            _initPos();

        });

        blankFix('tb-wrap-timer', 'eu-timer', function () {

        });

    });
}

//解决ie8 box-fix标签内元素高度变化，main-box标签高度撑不开bug
function fixIe8(obj) {
    if (_util.check.isIE678) {
        obj.hasClass('visibility-fix') ? obj.removeClass('visibility-fix') : obj.addClass('visibility-fix');
    }
}


//四国通票搜索
var FourCountry = {
    Init: function (pageType) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: '/PassTicket/GetTicketCountry',
            success: function (data) {
                if (data) {
                    FourCountry.BindSelect(data.fourCountryList);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert("状态：" + textStatus + "；出错提示：" + errorThrown);
            }
        });
    },
    BindSelect: function (countryList) {
        var firstCountry = $("#firstCountry"), secondCountry = $("#secondCountry"), thirdCountry = $("#thirdCountry"), fourthCountry = $("#fourthCountry");
        var option = '';
        for (var i = 0; countryList.length > i; i++) {
            option += "<option value=" + countryList[i].countryCode + ">" + countryList[i].countryName + "</option>";
        }
        firstCountry.append(option);
        firstCountry.change(function () {
            var countryNames = [];
            countryNames.push($(this).find("option:selected").text());
            FourCountry.SelectAppend(secondCountry, countryList, countryNames);
            FourCountry.BtnStatus(firstCountry, secondCountry, thirdCountry, fourthCountry);
        });
        //绑定和第一个和第二个相邻的国家
        secondCountry.change(function () {
            var countryNames = [];
            countryNames.push($(this).find("option:selected").text());
            countryNames.push(firstCountry.find("option:selected").text());
            FourCountry.SelectAppend(thirdCountry, countryList, countryNames);
            FourCountry.BtnStatus(firstCountry, secondCountry, thirdCountry, fourthCountry);
        });
        thirdCountry.change(function () {
            var countryNames = [];
            countryNames.push($(this).find("option:selected").text());
            countryNames.push(firstCountry.find("option:selected").text());
            countryNames.push(secondCountry.find("option:selected").text());
            FourCountry.SelectAppend(fourthCountry, countryList, countryNames);
            FourCountry.BtnStatus(firstCountry, secondCountry, thirdCountry, fourthCountry);
        });
        fourthCountry.change(function () {
            FourCountry.BtnStatus(firstCountry, secondCountry, thirdCountry, fourthCountry);
            FourCountry.GoSearch(firstCountry, secondCountry, thirdCountry, fourthCountry);
        });
    },
    SelectAppend: function (oSel, countrylist, countryNames) {
        var countryArray = FourCountry.CountryArray(countrylist, countryNames);
        if (countryArray && countryArray.length) {
            oSel.empty();
            var option = '<option value="">请选择</option>';
            for (var i = 0; countryArray.length > i; i++) {
                option += "<option value=" + countryArray[i].countryCode + ">" + countryArray[i].countryName + "</option>";
            }
            oSel.append(option);
        }
    },
    CountryArray: function (countrylist, countryNames) {
        var result = [];
        var hash = {}; //用一个hashtable的结构记录已有的元素
        if (countrylist && countryNames.length) {
            for (var i = 0; countryNames.length > i; i++) {
                for (var j = 0; countrylist.length > j; j++) {
                    if (countrylist[j].countryName == countryNames[i]) {
                        for (var k = 0; countrylist[j].fourCountryList.length > k; k++) {
                            if (!hash[countrylist[j].fourCountryList[k].countryName]) {
                                result.push(countrylist[j].fourCountryList[k]);
                                hash[countrylist[j].fourCountryList[k].countryName] = true;
                            }
                        }
                        continue;
                    }
                }
            }
            //去除当前已选国家
            for (var m = 0; countryNames.length > m; m++) {
                for (var n = 0; result.length > n; ++n) {
                    if (countryNames[m] == result[n].countryName) {
                        result.splice(n, 1);
                    }
                }
            }
        }

        return result;
    },
    BtnStatus: function (firstCountry, secondCountry, thirdCountry, fourthCountry) {
        if (firstCountry.val() && secondCountry.val() && thirdCountry.val() && fourthCountry.val()) {
            if ($(".btn-affirm").hasClass("btn-off")) {
                $(".btn-affirm").removeClass("btn-off");
                $(".btn-affirm").removeAttr('disabled');
            }
        }
        else {
            if (!$(".btn-affirm").hasClass("btn-off")) {
                $(".btn-affirm").addClass("btn-off");
                $(".btn-affirm").attr("disabled", "true");
            }
        }
    },
    GoSearch: function (firstCountry, secondCountry, thirdCountry, fourthCountry) {
        var firstCountryVal = firstCountry.find("option:selected").val();
        var secondCountryVal = secondCountry.find("option:selected").val();
        var thirdCountryVal = thirdCountry.find("option:selected").val();
        var fourthCountryVal = fourthCountry.find("option:selected").val();
        if (firstCountryVal && secondCountryVal && thirdCountryVal && fourthCountryVal) {
            $(".btn-affirm").on("click", function () {
                var url = '/PassDetails?countryCode=' + firstCountryVal + "-" + secondCountryVal + "-" + thirdCountryVal + "-" + fourthCountryVal;
                window.location.href = url;
            });
        }
    }
};
