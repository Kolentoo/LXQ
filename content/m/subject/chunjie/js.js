window.onload = function () {
    var u = location.href;
    if (u.indexOf('slide') > -1) {

    } else {
        location.href = location.href.replace('#', '') + '#slide-1';
    }

    var oFW = $('#j_fsvsWrap');
    var items = oFW.find('.section-item');
    var arrow = $('.arrow');
    var top = $('.top');

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

            var items = $('#j_fsvsWrap').find('.section-item');
            items.each(function (k, v) {
                var oo = $(this);
                var nc = 'section-item-' + (k + 1) + '-on';
                oo.removeClass(nc);
            });

            var iLen = items.length;
            if (index === 0) {
                arrow.hide();
                top.hide();
            } else {
                arrow.show();
                top.show();
            }
            if (index === iLen - 1) {
                arrow.hide();
            } else {
                arrow.show();
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

    //点击剪头滚动
    arrow.on('tap', function () {
        var o = $(this);
        var index = $('#fsvs-pagination').find('li.active').index();
        if (index <= 3) {
            $('#fsvs-pagination').find('li').eq(index + 1).click();
        } else {
            $('#fsvs-pagination').find('li').eq(0).click();
        }
    });

    top.on('tap', function () {
        $('#fsvs-pagination').find('li').eq(0).click();
    });

    $('.box').find('li').on('tap', function () {
        var o = $(this);
        var oa = o.find('a');
        var oah = oa.attr('href');
        location.href = oah;
    })

}

