$(function() {
    japanSlide();
    japanCarousel();
    japanTab();
    hoverEvent();
    uzLazy(['line-mod', 'hot-scenic-mod', 'essence-review']);
});

function japanSlide() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        oBS.slides({
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: false,
            pause: 1000,
            play: 6000,
            generateNextPrev: false,
            generatePagination: false,
            slidesLoaded: function () {
                var ow = screen.width,
                    oImg = oBS.find('.slide-item').find('img');
                if (ow <= 1152) {
                    oImg.css({
                        'position': 'absolute',
                        'left': -95
                    });
                }
                oBS.find('.slide-item').width(oBS.width());
            }
        });
        //点击转换mouseenter
        oBS.find('.slides_container').each(function() {
            var o = $(this);
            var opa = o.next('.pagination');

            if (opa.get(0)) {
                opa.find('li').on('mouseenter', function() {
                    var oo = $(this);
                    oo.find('a').click();
                });
            }
        });
    }
}

//徘徊事件，主要解决IE6问题
function hoverEvent() {
    var sideNav = $('.banner-mod').find('.side-nav');
    sideNav.on('mouseenter', '.side-nav-item', function() {
        var o = $(this);
        o.addClass('on');
    }).on('mouseleave', '.side-nav-item', function() {
        var o = $(this);
        o.removeClass('on');
    });
}

function japanCarousel() {
    var ow = screen.width,
        tac = $('#j_taCarousel'),
        oRL = $('#j_recommList');
    if (ow <= 1152) {
        tac.find('.carousel-item').css({'width': 188, 'margin-right': 15});
        oRL.find('.line-item').css({'width': 229, 'margin-right': 16});
    }

    tac.tinycarousel({
        axis: 'x',
        infinite: false
    });
    oRL.tinycarousel({
        axis: 'x',
        infinite: false
    });
}

function japanTab() {
    var oMMT = $('.main-mod-tab'),
        ohd = oMMT.find('.hd');

    ohd.find('li').on('click', function() {
        var o = $(this);
        var os = o.siblings('li');
        var index = o.index();

        os.removeClass('on');
        o.addClass('on');

        var obd = o.parents('.mod-hd').siblings('.bd');
        var items = obd.children('.item');
        items.hide();

        items.eq(index).show();

        var imgs = items.eq(index).find('.line-mod').find('img'),
            img = imgs.eq(0);

        if (img.attr('data-original') != img.attr('src')) {
            imgs.each(function () {
                var oImg = $(this),
                    sSrc = oImg.attr('data-original');
                if (sSrc != oImg.attr('src')) {
                    oImg.attr('src', sSrc);
                }
            });
        }
    });
}