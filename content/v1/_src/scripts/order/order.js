/*
* @Author: jonas hsiao
* @Date:   2016-04-07 16:15:02
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-11-17 16:05:34
*/
'use strict';

var globalCountrySelect = null;
var _orderCheckTips = {
    show: function (obj, s, cb) {
        var tw = obj.parent('.tb-wrap');
        var ml = '';
        var sb = '';

        if (tw.get(0)) {
            s && tw.find('.err-tips-cont').text(s);
            tw.find('.err-tips').show();
        } else {
            if (obj.hasClass('ml10')) {
                obj.removeClass('ml10');
                ml = 'ml10';
            } else if (obj.hasClass('ml5')) {
                obj.removeClass('ml5');
                ml = 'ml5';
            }

            sb += '<span class="err-tips">';
            sb += '<span class="err-tips-cont f666 f12">' + s + '</span>';
            sb += '<span class="arrow-icon f14 songti lh1"><em>◆</em><i>◆</i></span>';
            sb += '</span>';

            obj.wrap('<span class="tb-wrap ' + ml + '"></span>');
            obj.parent('.tb-wrap').append(sb);
        }

        if (cb) {
            cb();
        }
    },
    hide: function (obj, cb) {
        obj.parent('.tb-wrap').find('.err-tips').hide();

        if (cb) {
            cb();
        }
    }
};

$(function () {
    orderSide();
    tab('j_orderTab', function() {
        var oOT = $('.j_orderTab');
        //解决ie8 box-fix标签内元素高度变化，main-box标签高度撑不开bug
        if (_util.check.isIE678 && oOT.hasClass('store-tab')) {
            var oMB = oOT.parents('.main-box');
            oMB.css({'visibility': 'visible'});
        }
    });
    tipsInfo();
    selectList();
    multiCalendar();
    countryControl();
    orderInvoice();
    orderRefund();
    orderStore();
    contentSwitch();
    unitGanged();

    if (typeof (window.comGlobalCountry) != 'undefined') {
        window.comGlobalCountry();
    }

    fixInputErr();

    if (typeof PCAS == 'function') {
        new PCAS("province", "city", "area");
        $('select[name=area1]').get(0) && new PCAS("province1", "city1", "area1");
    }
    loadStoreDialogCity();
});


function fixInputErr() {
    $(document).on('blur', '.input-err', function () {
        var oThis = $(this);
        oThis.removeClass('input-err');

        var tip = $('#j_lrfTips');
        tip.text('');
    });
}

function orderSide() {
    var side = $('#j_side'),
        mbh = side.siblings('.main-box').height(),
        oOLB = side.find('.order-listing-box'),
        ycsMod = side.find('.ycs-mod'),
        yim = side.find('.ycs-info-mod');

    if (oOLB.get(0)) {
        if (!ycsMod.get(0)) {
            var dBar = oOLB.find('.deposit-bar'); // 订金条
            var dboh = 0;
            if (dBar.get(0)) {
                dboh = dBar.outerHeight(true);
            }
            var oOL = oOLB.find('.order-listing'),
                oOF = $('.order-footer'),
                olh = oOL.height(),
                ot = oOLB.offset().top,
                iDH = document.documentElement.clientHeight,
                iCount = iDH - 117 - dboh,
                iEnd = 0,
                olbh = 0;

            olh > iCount ? oOL.height(iCount) : '';
            olbh = oOLB.outerHeight();
            iEnd = (oOF.get(0) ? oOF.offset().top - olbh - 25 : 0);

            $(window).scroll(function() {
                unitScroll();
            });

            var unitScroll = function() {
                var w = $(window);
                var st = w.scrollTop();

                if (mbh > olbh) {
                    if (st >= ot) {
                        if (iEnd !== 0 && st >= iEnd) {
                            oOLB.css({
                                'position': 'absolute',
                                'top': iEnd
                            });
                        } else if (_util.check.isIE6) {
                            oOLB.css({
                                'top': st,
                                'position': 'absolute'
                            });
                        } else {
                            oOLB.css({
                                'top': 0,
                                'position': 'fixed'
                            });
                        }
                    } else {
                        oOLB.css({
                            'top': 0,
                            'position': 'static'
                        });
                    }
                }
            };
            unitScroll();
        }
    }
}

function tab(obj, eve) {
    var el = $('#' + obj);
    !el.get(0) ? el = $('.' + obj) : '';
    if (el.get(0)) {
        var ohd = el.children('.hd');
        !ohd.get(0) ? ohd = el.children().children('.hd') : '';

        ohd.find('li').on('click', function() {
            var o = $(this),
                index = o.index(),
                os = o.siblings('li'),
                obd = o.parents('.hd').siblings('.bd'),
                items = obd.children('.item');
            os.removeClass('on');
            o.addClass('on');
            items.hide().eq(index).show();

            if (eve) {
                eve();
            }
        });
    }
}

function tipsInfo() {
    var _tipsBar = function(obj) {
        var el = $('.' + obj);
        if (el.get(0)) {
            el.each(function() {
                var oThis = $(this),
                    oh = oThis.height();
                oThis.find('.tips-close').css({'line-height': oh + 'px'});
            });
            el.find('.tips-close').on('click', function() {
                var oThis = $(this);
                oThis.parents('.j_tipsBar').detach();
            });
        }
    };
    _tipsBar('j_tipsBar');

    var _hoverTips = function() {
        $('.travel-order')
            .on('mouseover', '.hover-wrap', function() {
                var oThis = $(this);
                oThis.addClass('hover-wrap-on');
            })
            .on('mouseout', '.hover-wrap', function() {
                var oThis = $(this);
                oThis.removeClass('hover-wrap-on');
            });
    };
    _hoverTips();

    $('.important-tips').on('click', '.close-wrap', function() { // 重要提示关闭
        var oThis = $(this);
        oThis.parents('.important-tips').detach();
    });

    var oPF = $('.J_powerFloat');
    //提示poptip
    if (oPF.get(0)) {
        oPF.powerFloat({
            reverseSharp: true
        });
    }
}

function selectList() {
    var oSI = $('.j_selectItems'),
        oDB = $('.datalist-box'),
        dbw = oDB.width();

    oSI.find('li').on('click', function() {
        var oThis = $(this),
            os = oThis.siblings();

        os.removeClass('on');
        oThis.addClass('on');
    });

    oDB.find('.textbox')
        .on('focus', function() {
            var oThis = $(this),
                oSLO = oDB.find('.select-list-on');

            oSLO.hide();
            oDB.css({'z-index': 'auto'});
            oThis.siblings('.select-list').show().addClass('select-list-on');
            oThis.parent().css({
                'z-index': 100
            });
        }).on('change', function() {
             var oThis = $(this);
             oThis.siblings('.select-list').hide().removeClass('select-list-on');
             oThis.parent().css({
                 'z-index': 'auto'
             });
         })
        .width(dbw - 10);
}

//订单loading效果
var orderLoading = {
    show: function () {
        $('.order-loading').remove();
        $('body').append("<div class='order-loading'><img src='" + _uzw.ui.preloader + "' </div>");
        var oOL = $('.order-loading');
        if (_util.check.isIE6) {
            var w = $(window);
            var unitScroll = function () {
                oOL.css({ 'top': w.scrollTop() + w.height() / 2 - 15 });
            };

            oOL.show();
            unitScroll();

            $(window).scroll(function () {
                unitScroll();
            });
        } else {
            oOL.show();
        }
    },
    hide: function () {
        $('.order-loading').hide();
    }
};

function multiCalendar() {
    $('input[data-multi-calendar]').on('focus', function () {
        var o = $(this);
        var ur=location.href.toLowerCase();
        $('.after-calendar').hide();

        var op = o.parent();
        var ac = op.find('.after-calendar');

        if (!ac.get(0)) {
            o.after('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            ac = op.find('.after-calendar');
            var cfg = {
                jsonpUrl: '',
                latestDate: '',//初始最近班期
                skipDays: ur.indexOf('otrains.uzai.com') > -1 ? 7 : 0,
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

        blankFix('j_afterCalendarWrap', 'after-calendar');//点击其它部分隐藏

    });
}

function countryControl() {

    var ocityNode = $('#j_jpCountryListNode');

    $('.main-box').on('focus', 'input[data-countries-trigger]', function () {
        var o = $(this);
        var on = o.next('input[type=hidden]');

        $('.countries-select-mod').hide();
        $('#j_jpAllCountryFilter').remove();

        var op = o.parent('.countries-select-wrap');
        var ocity = o.siblings('.countries-select-mod');

        ocity.after('<ul class="hide city-filter-mod" id="j_jpAllCountryFilter"></ul>');
        globalCountrySelect = $('#j_jpAllCountryFilter');

        var ocityInnerNode = ocity.find('.countries-select-tab');

        if (!ocityInnerNode.get(0)) {
            ocity.html(ocityNode.html());
            _uzw.ui.tab('countries-select-tab');
            ocity.find('.select-item').on('click', function () {
                var oo = $(this);
                var oot = oo.find('.s1').text();
                var ooc = oo.attr('data-code');
                var oop = oo.parents('.tips');
                var valid = oop.Validform();

                o.val(oot);
                on.val(ooc);
                ocity.hide();
                op.css({ 'z-index': 'auto' });

                if (valid.check(false, 'input[data-countries-trigger]')) { // 验证通过，清除提示信息 Validform
                    oop.find('.Validform_checktip').removeClass('Validform_wrong').addClass('Validform_right').text('');
                }
            });
        }

        ocity.show();
        op.css({ 'z-index': 10 });

        blankFix('countries-select-wrap', 'countries-select-mod', function () {
            op.css({ 'z-index': 'auto' });
            //将城市列表第一个选项填充进input
            $.trim(o.val()) && globalCountrySelect.find('li').not('.li-none').eq(0).click();
            globalCountrySelect.remove();
        });
        ocity.find('.close-wrap').on('click', function () {
            ocity.hide();
            op.css({ 'z-index': 'auto' });
        });

    }).on('blur', 'input[data-countries-trigger]', function() { // 清空无效值
        var o = $(this);
        var nullmsg = o.attr('nullmsg');
        var op = o.parent('.countries-select-wrap');
        var hiddenVal = o.next('input[type=hidden]').val();
        var filter = $('#j_jpAllCountryFilter');
        var valid = op.Validform();

        filter.find('.li-none').get(0) && o.val('');
        op.css({ 'z-index': 'auto' });
        if (!valid.check(false, 'input[data-countries-trigger]')) { // 验证不通过，显示提示信息 Validform
            op.find('.Validform_checktip').removeClass('Validform_right').addClass('Validform_wrong').text(nullmsg);
        }
    });
}

function orderInvoice() {
    var nni = document.getElementById('noNeedInvoice');
    nni && (nni.checked = true);
    $('#needInvoice').on('focus', function () {
        var oThis = $(this);
        oThis.parents('.info-listing').find('.hide').show();
    });
    $('#noNeedInvoice').on('focus', function () {
        var oThis = $(this);
        oThis.parents('.info-listing').find('.hide').hide();
    });

    var wi = document.getElementById('whetherInvoice');
    wi && (wi.checked = false);
    $('#whetherInvoice').on('change', function () {
        var oThis = $(this);
        var il = oThis.parents('.invoice-info').find('.info-listing');

        if (wi.checked) {
            il.show();
        } else {
            il.hide();
        }
    });

    var sc = document.getElementById('sameContacts');
    sc && (sc.checked = true);
    $('#sameContacts').on('focus', function () {
        var oThis = $(this);
        oThis.parents('li').find('.hide').hide();
    });
    $('#notSameContacts').on('focus', function () {
        var oThis = $(this);
        oThis.parents('li').find('.hide').show();
    });
}

function orderRefund() {
    var rm = $('.refund-main');
    if (rm.get(0)) {
        var sh = rm.find('.side').outerHeight();
        var rb = rm.find('.refund-box');
        if (sh > rb.outerHeight()) {
            rb.outerHeight(sh);
        }
    }
}

function orderStore() {
    var psi = $('#j_popStoreInfo');
    var ss = $('#j_selectingStore');
    var sc = $('#j_storeChoose');
    var oSS = $('#selectedStore');
    var selectCont = sc.find('.selecting-cont');
    var modify = selectCont.siblings('.btn-modify');
    var store = $('.store-item');
    var iSV = null;
    var _popStoreInfo = function () {
        _uzw.ui.mask.show();
        psi.show().on('click', '.j_popClose', function () {
            _uzw.ui.mask.hide();
            psi.hide();
        });
        fixIe6('j_popStoreInfo');
    };

    $('#j_btnStore').on('click', function () {
        _popStoreInfo();
    });

    modify.on('click', function () {
        _popStoreInfo();
    });

    store.on('click', function () {
        var oThis = $(this);
        store.removeClass('on');
        oThis.addClass('on');
    });

    sc.on('click', '.store-item', function () {
        var oThis = $(this);
        var shTxt = oThis.find('.store-hd').text();

        selectCont.text(shTxt);
        iSV = oThis.find('input[name=cbStore]').val();
        oSS.val(iSV);
        modify.hasClass('hide') && modify.removeClass('hide');
    });

    psi.on('click', '.store-item', function () {
        var oThis = $(this);
        var shTxt = oThis.find('.store-hd').text();
        ss.val(shTxt);
        iSV = oThis.find('input[name=cbStore]').val();
    }).on('click', '.btn-confirm', function () {
        var oThis = $(this);
        var ssVal = $.trim(ss.val());
        ssVal && selectCont.text(ssVal);
        oSS.val(iSV);
        modify.hasClass('hide') && modify.removeClass('hide');
    });
}

function contentSwitch() {
    var side = $('#j_side');

    side.find('.order-listing-box').find('.switch').on('click', function() {
        var oThis = $(this),
            arrow = oThis.find('.border-arrow'),
            oOLW = oThis.parents('.mod-item-hd').next('.mod-item-bd').find('.order-listing-wrap');
        if (arrow.hasClass('on')) {
            arrow.removeClass('on');
            oOLW.hide();
        } else {
            arrow.addClass('on');
            oOLW.show();
        }
    });

    side.find('.side-jipiao').find('.switch').on('click', function() {
        var oThis = $(this),
            arrow = oThis.find('.border-arrow'),
            items = oThis.parents('.mod-item-hd').next('.mod-item-bd').find('.line-item');
        if (arrow.hasClass('on')) {
            arrow.removeClass('on');
            items.hide();
        } else {
            arrow.addClass('on');
            items.show();
        }
    });

    var ail = $('#j_addrInfoListing');
    if (ail.get(0)) {
        var addr = ail.find('input[name=addr]');
        var oHide = ail.find('table.hide');
        var _hideContSwitch = function(obj) {
            obj.on('focus', function () {
                var oThis = $(this);
                var op = oThis.parents('li');

                this.checked = true;
                op.find('.hide-cont').show();
                op.siblings('li').find('.hide-cont').hide();
            });
        };

        addr[1].checked && oHide.show().parents('li').siblings('li').find('.hide-cont').hide();
        _hideContSwitch(addr.eq(0));
        _hideContSwitch(addr.eq(1));
    }

    var wv = document.getElementById('whetherVoucher');
    wv && (wv.checked = false);
    $('#whetherVoucher').on('change', function () {
        var oThis = $(this);
        var hide = oThis.parents('.reimburse-info').find('.hide');

        if (wv.checked) {
            hide.show();
        } else {
            hide.hide();
        }
    });

    // 更改乘机人数
    var chgPassenger = $('#j_changePassengerBar');
    var errTips = chgPassenger.find('.err-tips');
    var selAdult = $('#selAdult');
    var selChild = $('#selChild');

    selAdult.on('focus', function () {
        errTips.text('');
    });

    selChild.on('focus', function () {
        errTips.text('');
    });

    chgPassenger.on('click', '.btn-change', function() {
        chgPassenger.addClass('change-passenger-on');
    }).on('click', '.btn-cancel', function() {
        chgPassenger.removeClass('change-passenger-on');
    }).on('click', '.btn-confirm', function() {
        var adultVal = parseInt($.trim(selAdult.val()), 10);
        var childVal = parseInt($.trim(selChild.val()), 10);
        var hidParams = $('#hidParamaters');
        var flag = true;
        var confirmVal;

        chgPassenger.find('.select-box').each(function() {
            var oThis = $(this);

            if (oThis.val() !== oThis.attr('data-init-num')) { // 当前值不等初始值
                flag = false;
            }
        });

        if (flag) {
            chgPassenger.removeClass('change-passenger-on');
        } else if (!adultVal && !childVal) {
            errTips.text('请选择出行人数！');
            return false;
        } else if (!adultVal && childVal) {
            errTips.text('儿童单独乘机需直接向航空公司购票！');
            return false;
        } else if (adultVal) {
            if (adultVal + childVal > 9) {
                errTips.text('乘客人数须小于等于9人！');
                return false;
            } else if (childVal / 2 > adultVal) {
                errTips.text('目前只支持1个成人最多携带2名儿童！');
                return false;
            } else {
                confirmVal = window.confirm('乘客发生变动，需重新查询');
                if (confirmVal) { // 点击确定按钮
                    window.location.href = '/UzaiFlight/List?startcity=' + hidParams.attr('data-startcity') + '&endcity=' + hidParams.attr('data-endcity') + '&fromDate=' + hidParams.attr('data-fromDate') + '&retDate=' + hidParams.attr('data-retDate') + '&adult=' + adultVal + '&child=' + childVal + '&cabin=' + hidParams.attr('data-cabin') + '';
                }
            }
        }
    });
}

function unitGanged() {
    var ail = $('#j_addrInfoListing');
    if (ail.get(0)) {
        var sltCity = ail.find('select[name=sltCity]')
        ,   sltArea = sltCity.siblings('select[name=sltArea]')
        ,   sltShop = sltCity.siblings('select[name=sltShop]');

        $.ajax({
            type:'GET',
            cache:'false',
            url:'/mall/GetAddressList',
            dataType:'json',
            success: function(d){
                var data = d.listCity
                ,   dcLen = data.length
                ,   addr = sltCity.siblings('address')
                ,   addrName = addr.find('.addr-name')
                ,   dArea = []
                ,   dShop = []
                ,   pHtml = ''
                ,   idx = 0;
                var _setChild = function (childObj, childArr) { // 设置子选项
                    var daLen = childArr.length;
                    var cHtml = '';

                    childObj[0].length = 0; // 清空子选项
                    for (var i = 0; i < daLen; i++) {
                        cHtml += '<option value="' + childArr[i] +'">' + childArr[i] +'</option>';
                    }
                    return cHtml;
                };
                var _setArea = function (list, index) { // 设置地区
                    var areas = list[index].listArea;
                    var dArr = [];
                    for (var i in areas) {
                        dArr[i] = areas[i].AreaName;
                    }
                    var sHtml = _setChild(sltArea, dArr);

                    sltArea.append(sHtml);
                    _setShop(areas, 0); // 默认选中第一个地区
                };
                var _setShop = function (list, index) { // 设置门店
                    var shops = list[index].listStore;
                    var dArr = [];
                    for (var i in shops) {
                        dArr[i] = shops[i].StoreName;
                    }
                    var sHtml = _setChild(sltShop, dArr);

                    sltShop.append(sHtml);
                    _setShopAddr(shops, 0); // 默认选中第一个门店
                };
                var _setShopAddr = function (list, index) { // 设置门店地址
                    addrName.val(list[index].StoreAddress);
                };

                if (data) {
                    for (var j = 0; j < dcLen; j++) { // 生成城市选项
                        if (d.IPAddress.indexOf(data[j].cityName) >= 0) {
                            idx = j;
                        }
                        pHtml += '<option value="' + data[j].cityName +'">' + data[j].cityName +'</option>';
                    }

                    sltCity.append(pHtml).on('change', function () { // 更改城市
                        var index = this.selectedIndex;
                        dArea = data[index].listArea;
                        _setArea(data, index);
                    });

                    sltArea.on('change', function () { // 更改区
                        var index = this.selectedIndex;
                        !dArea.length && (dArea = data[idx].listArea);
                        dShop = dArea[index].listStore;
                        _setShop(dArea, index);
                    });

                    sltShop.on('change', function () { // 更改店
                        var index = this.selectedIndex;
                        !dArea.length && (dArea = data[idx].listArea);
                        !dShop.length && (dShop = dArea[0].listStore);
                        _setShopAddr(dShop, index);
                    });

                    // 默认选中城市
                    _setArea(data, idx);
                    sltCity.find('option').eq(idx).prop('selected', 'selected');
                }
            },
            error: function(res){
            }
        });
    }
}

// 解决ie8 box-fix标签内元素高度变化，main-box标签高度撑不开bug
function fixIe8(obj) {
    if (_util.check.isIE678) {
        obj.hasClass('visibility-fix') ? obj.removeClass('visibility-fix') : obj.addClass('visibility-fix');
    }
}

// IE6下的定位
function fixIe6(node, xAxis) {
    var o = $('#' + node);

    o = o.get(0) ? o : $('.' + node);
    xAxis = xAxis || $(window).height() / 2;

    if (_util.check.isIE6) {
        o.css('top', $(document).scrollTop() + xAxis);
        $(window).on('scroll', function () {
            o.css('top', $(document).scrollTop() + xAxis);
        });
    }
}

function loadStoreDialogCity() {
    //选择门店dialog当前门店城市选中
    var storeId = $('#selectedStore').val();
    if (storeId > 0) {
        var obj = $($('#j_popStoreInfo').find('input[name="cbStore"][value="' + storeId + '"]').parent()[0]);
        var cityId = obj.attr('data-city');
        var areaName = obj.attr('data-area');
        if (cityId > 0) {
            $('#selectStoreCity').val(cityId);  

            setTimeout(function () {
                $('#selectStoreArea').val(areaName);  
                document.getElementById('selectStoreArea').onchange();
                obj.click();
            }, 500);
        }
    }
}