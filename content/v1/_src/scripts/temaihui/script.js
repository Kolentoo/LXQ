$(function() {
    $('#j_fullScreenSlides').slides({
        effect: 'fade',
        crossfade: true,
        play: 5000,
        pause: 1000,
        fadeSpeed: 1000,
        hoverPause: true,
        generatePagination: true,
        currentClass: 'on'
    });
    uzLazy(['line-pic']);
    scrollFixed();
});

function scrollFixed() {
    var ow = screen.width;
    var box = $('#j_fixSideCode');
    var ot = 0;
    var fsSlides = $('#j_fullScreenSlides');
    var fssTop = fsSlides.offset().top;
    var item = fsSlides.find('.item');
    var oMI = $('#j_mainInner');
    var miTop = oMI.offset().top;
    var oUF = $('.global-footer');

    ot = miTop;
    box.css({
        'top': ot
    });

    fsSlides.find('.slides_control').css({
        'width': '100%'
    });
    if (ow <= 1200) {
        box.hide();
    }

    $(window).scroll(function() {
        unitScroll();
    });

    var unitScroll = function () {
        var w = $(window);
        var wh = w.height();
        var st = w.scrollTop();
        var bh = box.height();
        var ib = 160;//box距离底部为160
        var iNum = st + wh - bh - ib;
        var iEnd = oUF.offset().top - bh - ib - 15;

        if (iNum >= ot && iNum <= iEnd) {
            if (_util.check.isIE6) {
                box.css({
                    'top': iNum,
                    'position': 'absolute'
                });
            } else {
                box.css({
                    'top': 'auto',
                    'bottom': '160px',
                    'position': 'fixed'
                });
            }
        } else if (iNum >= iEnd) {
            if (iNum - iEnd <= ib) {
                iEnd = iNum - ib;
            }
            box.css({
                'top': iEnd + ib,
                'bottom': 'auto',
                'position': 'absolute'
            });
        } else {
            box.css({
                'top': ot,
                'bottom': 'auto',
                'position': 'absolute'
            });
        }
        if (st >= fssTop) {
            if (_util.check.isIE6) {
                fsSlides.css({
                    'position': 'absolute'
                });
            } else {
                fsSlides.css({
                    'position': 'fixed'
                });
            }
            item.css({
                'background-attachment': 'fixed'
            });
        } else {
            fsSlides.css({
                'position': 'absolute'
            });
            item.css({
                'background-attachment': 'scroll'
            });
        }
    };
    unitScroll();
}