window.onload = function () {
    var u = location.href;
    if (u.indexOf('slide') > -1) {

    } else {
        location.href = location.href.replace('#', '') + '#slide-1';
    }

    var oFW = $('#j_fsvsWrap');
    var items = oFW.find('.section-item');
    var bottom = $('#j_summary');
    var oTI = $('#j_topIcon');
    var slider = $.fn.fsvs({
        speed: 1000,
        bodyID: 'j_fsvsWrap',
        selector: '> .section-item',
        mouseSwipeDisance: 40,
        afterSlide: function (index) {

            var items = $('#j_fsvsWrap').find('.section-item');
            var nc = 'section-item-' + (index + 1) + '-on';
            var oo = items.eq(index);
            if (oo.hasClass(nc)) {
                return;
            }
            oo.addClass(nc);



        },
        beforeSlide: function (index) {

            window.scrollTo(0, 1);

            $('.menu-wrap').hide();

            var items = $('#j_fsvsWrap').find('.section-item');
            items.each(function (k, v) {
                var oo = $(this);
                var nc = 'section-item-' + (k + 1) + '-on';
                oo.removeClass(nc);
            });


            var iLen = items.length;
            if (index === 0) {
                bottom.hide();
                oTI.removeClass('on');
            } else {
                bottom.show();
                oTI.addClass('on');
            }
            if (index === iLen - 1) {
                oTI.hide();
            } else {
                oTI.show();
            }
        },
        endSlide: function () { },
        mouseWheelEvents: true,
        mouseWheelDelay: false,
        mouseDragEvents: true,
        touchEvents: true,
        arrowKeyEvents: true,
        pagination: true,
        nthClasses: false,
        detectHash: true
    });
    //slider.slideUp();
    //slider.slideDown();
    //slider.slideToIndex( index );

    //点击剪头滚动
    oTI.on('tap', function () {
        var o = $(this);
        var index = $('#fsvs-pagination').find('li.active').index();
        if (index <= 3) {
            $('#fsvs-pagination').find('li').eq(index + 1).click();
        } else {
            $('#fsvs-pagination').find('li').eq(0).click();
        }
    });

    popMod();
}

function popMod() {
    var oBottom = $('#j_summary');
    var oLeft = oBottom.find('.bar-item').eq(0).find('.menu-list').find('li');
    var oRight = oBottom.find('.bar-item').eq(1).find('.menu-list').find('li');
    var oPM = $('.pop-mod');
    var oPW = $('#j_popWish');
    var oPUI = $('#j_popUzaiInfo');
    var oPWF = $('#j_popWelfare');
    var oPD = $('#j_popDuty');

    oBottom.find('.bar-item').children('a').on('tap', function () {
        var oThis = $(this);
        var oMW = oThis.next('.menu-wrap');
        if (oMW.hasClass('on')) {
            oMW.hide().removeClass('on');
        } else {
            oMW.show().addClass('on');
        }
    });
    oPM.on('tap', function () {
        var oThis = $(this);
        oThis.hide();
    });
    oLeft.eq(1).on('tap', function () {
        oPM.hide();
        oPW.show();
    });
    oLeft.eq(2).on('tap', function () {
        oPM.hide();
        oPUI.show();
    });
    oRight.eq(1).on('tap', function () {
        oPM.hide();
        oPWF.show();
    });
    oRight.eq(2).on('tap', function () {
        oPM.hide();
        oPD.show();
    });
}