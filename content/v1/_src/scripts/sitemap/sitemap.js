$(function () {
    sitemapFixedNav();
});

function sitemapFixedNav() {
    var box = $('#j_navList');
    var wrap = box.parent('.nav-wrap');
    var oh = box.height();
    var items = $('.mod-hd');

    $(window).scroll(function () {
        unitScroll();
    });

    var unitScroll = function () {
        var w = $(window);
        var st = w.scrollTop();
        var ot = wrap.offset().top;
        if (st >= ot) {
            if (_util.check.isIE6) {
                box.css({ 'top': st, 'position': 'absolute' });
            } else {
                box.css({ 'top': 0, 'position': 'fixed' });
            }
            unitCheck(st);
        } else {
            box.css({ 'top': 'auto', 'position': 'static' });
        }
    };

    var unitCheck = function (st) {
        items.each(function (k, v) {
            var o = $(this);
            var oot = o.offset().top;
            if (st > oot - oh - 1) {
                box.find('li').removeClass('on');
                box.find('li').eq(k).addClass('on');
                return true;
            }
        });
    };

    var unitSkip = function () {
        box.find('li').on('click', function () {
            var oli = $(this);
            var oindex = oli.index();
            var olis = oli.siblings('li');
            var skipNode = items.eq(oindex);
            var oot = skipNode.offset().top;
            $('body,html').animate({ scrollTop: oot - oh }, 800);
        });
    };

    unitSkip();
    unitScroll();
}