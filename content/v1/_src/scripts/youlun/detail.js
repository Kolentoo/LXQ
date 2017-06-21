$(function () {
    ylSlide();
    ylPop();
    ylTab('tab-detail');
    ylRouteHover();
    ylDeskSlide();
});


//详细页
function ylSlide() {

    //精选邮轮滚动
    easySlide('j_ylRouteBar', 'prev', 'next', 1, 3);

    if ($('#j_introSlides').find('img').length > 1) {
        $('#j_introSlides').slides({
            currentClass: 'on',
            fadeSpeed: 600,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 6000,
            generatePagination: false
        });
    }
}

function ylPop() {

    //点击浏览甲板
    $('.J_deck').on('click', function () {
        var xAxis = 50;
        popMod('pop-deck', xAxis);
        fixIe6('pop-deck', xAxis);

        var o = $(this);
        var op = o.parent('.deck-items');
        var index = 0;
        if (op.get(0)) {
            index = o.index();
        }

        $('#j_carouselBarSlide').find('.deck-items').find('li').eq(index).click();

        return false;
    });

    //点击查看更多价格
    $('.J_more_price').on('click', function () {
        var oThis = $(this);
        popTips(oThis.parent());
    });

}

//游轮详细页主体选项卡
function ylTab(obj) {
    var box = $('#' + obj);
    if (!box.get(0)) {
        box = $('.' + obj);
    }
    box.find('.bd .item').eq(0).show();
    box.find('.hd li').on('click', function () {
        var o = $(this);
        var index = o.index();
        o.addClass('on').siblings().removeClass('on');
        o.parent('.hd').next('.bd').find('.item').hide().eq(index).show();
    });

}

//弹出提示框
function popTips(o) {
    var oTisp = o.find('.pop-tips');

    oTisp.show();
    oTisp.find('.tips-colse').on('click', function () {
        oTisp.hide();
    });

}

function ylRouteHover() {
    var bar = $('#j_ylRouteBar');
    bar.find('li').mouseenter(function () {
        var o = $(this);
        var os = o.siblings('li');
        o.find('.line-item').addClass('on');
        os.find('.line-item').removeClass('on');

    }).mouseleave(function () {
        var o = $(this);
        var os = o.siblings('li');
        o.find('.line-item').removeClass('on');
        os.find('.line-item').removeClass('on');
    });
}

function ylDeskSlide() {
    var box = $('#j_carouselBarSlide');
    var txt=box.find('.deck-items');
    var prev = box.find('.prev');
    var next = box.find('.next');
    var focus = box.find('.deck-pic').find('img');
    var focusTxt = box.find('dt');

    var max = txt.find('li').length;

    txt.find('li').click('on', function () {
        var o = $(this);
        var index = o.index();

        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');

        unitSlide(index);
    });

    prev.on('click', function () {
        var o = $(this);
        var index = unitGetIndex();
        txt.find('li').eq(index - 1).click();
    });

    next.on('click', function () {
        var o = $(this);
        var index = unitGetIndex();
        txt.find('li').eq(index + 1).click();
    });


    var unitGetIndex = function () {
        var o = txt.find('li.on');
        return o.index();
    };

    var unitSlide = function (index) {
        focus.fadeOut('slow', function () {
            var li = txt.find('li').eq(index);
            var src = li.attr('data-src');
            var tx = $.trim(li.text());

            focusTxt.text(tx);
            focus.attr('src', src);
            focus.fadeIn('slow');

            if (index === max - 1) {
                next.addClass('off');
            } else if (index < max - 1 && index > 0) {
                prev.removeClass('off');
                next.removeClass('off');
            } else if (index === 0) {
                prev.addClass('off');
            }

        });
    };





}













