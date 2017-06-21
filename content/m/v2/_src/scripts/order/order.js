"use strict";

var exportsorder = {};

exportsorder.init = function () {
    exportsorder.tabInit();
    exportsorder.priceDetail();
    exportsorder.keyboardFix();
    exportsorder.couPoppup();
    exportsorder.couponTips();
};

$(function () {
    exportsorder.init();
});

exportsorder.tabInit = function () {
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        var oCT = $('#j_currencyTab');
        if (oCT.get(0)) {
            window.tab.init('j_currencyTab');
        }
        var oOT = $('#j_orderTab');
        if (oOT.get(0)) {
            window.tab.init('j_orderTab');
        }
    });
};

exportsorder.priceDetail = function () {
    var oOPD = $('#j_orderPriceDetail'),
        oOS = $('#j_orderSummary');
    if (oOPD.get(0)) {
        oOS.find('.info-price').on('click', function () {
            var oThis = $(this);

            if (oThis.hasClass('info-price-on')) {
                oThis.removeClass('info-price-on');
                oOPD.css({ 'bottom': '-100%' }).hide();
                _uzm.mask.hide();
            } else {
                oThis.addClass('info-price-on');
                oOPD.css({ 'bottom': 46 }).show();
                _uzm.mask.show();
                var oMask = $('.fn-mask');
                oMask.css({ 'z-index': 800 }).on('click', function () {
                    oThis.removeClass('info-price-on');
                    oOPD.css({ 'bottom': '-100%' }).hide();
                    _uzm.mask.hide();
                });
            }
        });
    }
};

// fix ios 软键盘弹出fixed失效bug
exportsorder.keyboardFix = function () {
    var obj = $('.j_keyboardFix');
    if ((_uzm.mobile.isIpad || _uzm.mobile.isIphone) && obj.get(0)) {
        obj.each(function () {
            var o = this
            , docTouchend = function (event) {
                if (event.target != o) {
                    o.blur();
                    document.removeEventListener('touchend', docTouchend, false);
                }
            };
            o.addEventListener('focus', function () {
                document.addEventListener('touchend', docTouchend, false);
            }, false);
        });
    }
};

exportsorder.couPoppup = function () {
    var rb = $('#j_recordBox');
    var ps = $('#j_popZxStore');
    var mi = rb.find('.more-infor');
    var mt = rb.find('.more-tips');
    var cd = rb.find('.coupon-detail');
    var dc = $('.discount-code');
    var cc = $('#j_chooseCoupon');
    var cr = $('.coupon-record');
    var py = $('#j_popYhq');
    var pc = py.find('.pop-close');

    if (rb.get(0)) {
        mi.on('click', function () {
            var t = $(this);
            t.prev('.discount-tips').toggle();
            t.toggleClass('on');
        });
        cc.on('click', function () {
            py.addClass('pop-yhq-on');
            cr.addClass('coupon-on').removeClass('coupon-out');
        });
        pc.on('click', function () {
            cr.removeClass('coupon-on').addClass('coupon-out');
            py.removeClass('pop-yhq-on');
        });
        cd.on('click', function () {
            cr.addClass('coupon-out').removeClass('coupon-on');
            py.removeClass('pop-yhq-on');
            var o = $(this);
            var ot = o.children('h2').children('i').text();
            o.parent('.coupon-item').addClass('coupon-item-on');
            o.parent().siblings().removeClass('coupon-item-on');
            dc.val(ot);

            //fix 点击后就直接使用
            dc.prop('disable', true);
            cc.siblings('.use-bar').find('.bar-btn').text('使用').removeAttr('disabled').click();

        });
    }
};

exportsorder.couponTips = function () {
    var currencyTab = $('#j_currencyTab');
    if (currencyTab.get(0)) {
        var ct = $('.couponTips-box');
        var list3 = $('.currency-list');
        var list = list3.siblings();
        list3.on('click', function () {
            ct.removeClass('hide');
        });
        list.on('click', function () {
            ct.addClass('hide');
        });
    }
};





