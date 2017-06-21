$(function () {
    cmControlBar();
    cmScroll();
    cmSlider();
});

function cmControlBar() {
    $('#j_cmH1').find('.control-bar').on('click', function () {
        var o = $(this);
        if (o.hasClass('control-bar-on')) {
            o.removeClass('control-bar-on');
            $('#j_cmMain').removeClass('cm-main-on');
        } else {
            o.addClass('control-bar-on');
            $('#j_cmMain').addClass('cm-main-on');
        }
    });
}

function cmScroll() {
    var jm = $('#j_cmMain');
    var jn = $('#j_cmNav');
    var jmTop = jm.offset().top;
    var jnTop = jn.offset().top;
    var mods = jm.children('.content').find('.mod');
    var navs = jm.children('.sidebar').find('li');

    var unitScroll = function () {
        var ow = $(window);
        var os = ow.scrollTop();

        if (os >= jmTop) {
            jm.find('.sidebar').addClass('sidebar-on');
        } else {
            jm.find('.sidebar').removeClass('sidebar-on');
        }

        if (os >= jnTop) {
            jn.addClass('cm-nav-on');
        } else {
            jn.removeClass('cm-nav-on');
        }

        unitCheck(os);

    };

    var unitCheck = function (st) {
        mods.each(function (k, v) {
            var o = $(this);
            var oot = o.offset().top;

            if (st > oot - 1) {
                navs.removeClass('on');
                navs.eq(k).addClass('on');
                return true;
            }
        });
    };


    var skipTag = function () {
        navs.on('click', function () {
            var o = $(this);
            var index = o.index();
            var ot = mods.eq(index).offset().top;
            $('body,html').animate({ scrollTop: ot }, 800);

            navs.removeClass('on');
            o.addClass('on');
        });
    };

    unitScroll();
    skipTag();

    $(window).scroll(function () {
        unitScroll();
    });

    $(window).resize(function () {
        unitScroll();
        cmSlider();
    });
}

function cmSlider() {
    var jm = $('#j_cmMain');
    jm.find('.slider').each(function (k,v) {
        var o = $(this);
        var pgn = o.next('.pagination');
        var ems = pgn.find('em');
        var mySwipe = "mySwipe" + k;
        mySwipe = new Swipe(o.get(0), {
            startSlide: 0,
            speed: 400+(k*50),
            auto: 3000 + (k * 1000),
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            callback: function (index, elem) {
                ems.removeClass('on');
                ems.eq(index).addClass('on');
            },
            transitionEnd: function (index, elem) { }
        });
        ems.on('click', function () {
            var oo = $(this);
            var index = oo.index();
            mySwipe.slide(index);
        });
    });
}


