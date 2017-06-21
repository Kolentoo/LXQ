winLoadFix(groupNavFixed);

$(function() {
    uzLazy(['line-mod', 'carousel-case', 'line-pic', 'j_albumCarousel', 'j_galleryBox']);
    groupSlide();
    groupCarousel();
    groupTab();
    groupPop();
    groupSideWriteNeed();
});

function groupSlide() {
    var oTBanner = $('#j_topBanner');

    if (oTBanner.get(0)) {
        oTBanner.slides({
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 6000,
            generatePagination: true,
            slidesLoaded: function() {
                var ow = screen.width,
                    oSItem = oTBanner.find('.slide-item');
                oSItem.width(ow);
            }
        });
    }

    //点击转换mouseenter
    $('.slides_container').each(function() {
        var o = $(this);
        var opa = o.siblings('.pagination');

        if (opa.get(0)) {
            opa.find('li').on('mouseenter', function() {
                var oo = $(this);
                oo.find('a').click();
            });
        }

    });
}

function groupCarousel() {
    var ow = screen.width,
        oSC = $('#j_serviceCarousel'),
        oUC = $('#j_userCarousel'),
        oMC = $('.j_mainCarousel'),
        oAC = $('.j_albumCarousel');

    if (ow <= 1152) {
        oMC.find('.carousel-item').css({'width': 214, 'margin-right': 17});
        oAC.find('.carousel-item').css({'width': 166, 'margin-right': 8});
        oUC.find('.user-list').children('li').css({'width': 112, 'margin-right': 8});
    }

    if (oSC.get(0)) {
        var scLen = oSC.find('.overview').children('.service-item').length,
            scBtn = oSC.find('.buttons'),
            xAxis = 50;
        if (scLen > 5) {
            oSC.tinycarousel({
                axis: 'x',
                interval: true,
                intervalTime: 3000,
                animation: true,
                animationTime: 1000
            });

            //自动滚动相关处理
            oSC
                .on('mouseenter', function() {
                    var oThis = $(this);
                    oThis.data("plugin_tinycarousel").stop();
                })
                .on('mouseleave', function() {
                    var oThis = $(this);
                    oThis.data("plugin_tinycarousel").start();
                });
        } else {
            scBtn.hide();
        }

        oSC.on('click', '.service-item', function() {
            popMod('j_popNeedBox', xAxis);
            fixIe6('j_popNeedBox', xAxis);
        });
    }

    if (oUC.get(0)) {
        oUC.tinycarousel({
            axis: 'x',
            infinite: false
        });
    }

    if (oAC.get(0)) {
        var acLen = oAC.find('.overview').children('.carousel-item').length,
            acBtn = oAC.find('.buttons');

        if (acLen > 4) {
            oAC.tinycarousel({
                axis: 'x',
                interval: true,
                intervalTime: 3000,
                animation: true,
                animationTime: 1000
            });

            //自动滚动相关处理
            oAC
                .on('mouseenter', function() {
                    var oThis = $(this);
                    oThis.data("plugin_tinycarousel").stop();
                })
                .on('mouseleave', function() {
                    var oThis = $(this);
                    oThis.data("plugin_tinycarousel").start();
                });
        } else {
            acBtn.hide();
        }
        imgPreview(oAC, 'data-original');
    }
}

function groupTab() {
    var _unitCarousel = function(obj) {
        if (obj.get(0)) {
            obj.tinycarousel({
                axis: 'x',
                infinite: false
            });
        }
    };
    var oMMT = $('.j_mainModTab'),
        oNT = $('#j_needTab'),
        oItem = oMMT.find('.main-mod-bd').children('.bd').children('.item').eq(0),
        oMC = oItem.find('.j_mainCarousel'),
        ntLis = oNT.find('.hd').find('li'),
        ntItems = oNT.find('.bd').find('.item');

    //处理延迟加载图片
    oMC.find('.next').on('click', function() {
        var oThis = $(this),
            imgs = oThis.siblings('.viewport').find('img[data-original]');

        imgs.each(function() {
            var ot = $(this),
                oUrl = ot.attr('data-original');
            if (ot.attr('src') != oUrl){
                ot.attr('src', oUrl);
            }
        });
    });
    _unitCarousel(oMC);
    oItem.show();

    oMMT.find('.hd').on('click','li',function () {
        var oThis = $(this),
            iIndex = oThis.index(),
            items = oThis.parents('.main-mod-hd').siblings('.main-mod-bd').children('.bd').children('.item');

        oThis.addClass('on').siblings().removeClass('on');
        items.hide().eq(iIndex).show();

        var imgs = items.eq(iIndex).find('img[data-original]'),
            oImg = imgs.eq(0);
        //处理延迟加载图片
        if (oImg.attr('src') != oImg.attr('data-original')) {
            imgs.each(function() {
                var ot = $(this),
                    oUrl = ot.attr('data-original');

                ot.attr('src', oUrl);
            });
            _unitCarousel(items.eq(iIndex).find('.j_mainCarousel'));
        }
    });

    oNT.find('.btn-next').on('click', function() {
        var oThis = $(this),
            iIndex = oThis.parents('.item').index();

        ntItems.eq(iIndex).hide();
        ntItems.eq(iIndex + 1).show();
        ntLis.eq(iIndex).removeClass('on');
        ntLis.eq(iIndex + 1).addClass('on');
    });

    oNT.find('.btn-prev').on('click', function() {
        var oThis = $(this),
            iIndex = oThis.parents('.item').index();

        ntItems.eq(iIndex).hide();
        ntItems.eq(iIndex - 1).show();
        ntLis.eq(iIndex).removeClass('on');
        ntLis.eq(iIndex - 1).addClass('on');
    });
}
function groupPop() {
    var xAxis = 50;

    $('.j_btnNeed').on('click', function() {
        popMod('j_popNeedBox', xAxis);
        fixIe6('j_popNeedBox', xAxis);
    });

    $('#j_needTab').find('.btn-submit').on('click', function() {
        popMod('j_popSubmitBox', xAxis);
        fixIe6('j_popSubmitBox', xAxis);
    });
}

function groupNavFixed() {
    var box = $('#j_caseModItems');
    if (box.get(0)) {
        var boxW = box.width(),
            mods = box.find('.mod-hd'),
            bar = box.find('.case-mod-nav'),
            barH = bar.height();

        bar.find('li').on('click', function() {
            var o = $(this),
                index = o.index(),
                oo = mods.eq(index),
                ooTop = oo.offset().top;

            $('body,html').animate({
                scrollTop: ooTop - barH
            }, 800);

        });

        //上色
        var _fixColor = function (index) {
            var lis = bar.find('li');
            lis.removeClass('on');
            lis.eq(index).addClass('on');
        };

        var _unitScroll = function () {
            var o = $(window),
                st = o.scrollTop(),
                initTop = box.offset().top;

            if (st >= initTop) {
                if (_util.check.isIE6) {
                    bar.css({
                        'top': st,
                        'position': 'absolute'
                    });
                } else {
                    bar.css({
                        'position': 'fixed',
                        'top': '0'
                    });
                }
                bar.width(boxW - 2);
            } else {
                bar.css({
                    'position': 'static',
                    'top': 'auto'
                });
            }

            mods.each(function (k, v) {
                var oo = $(this);
                var ooTop = oo.offset().top;
                if (ooTop - barH - 1 <= st) {
                    _fixColor(k);
                }
            });
        };

        $(window).scroll(function() {
            _unitScroll();
        });

        //页面初始定位
        _unitScroll();
    }
}

function groupSideWriteNeed() {
    var oFWN = $('#fixedWriteNeed'),
        oIFWN = $('#indexFixedWriteNeed'),
        oMM = $('.main-mod-1');

    var sideslipEffect = function(obj) {
        obj.on('mouseenter', function () {
            var oo = $(this);
            oo.addClass("fixed-wn-on");
        }).on('mouseleave', function () {
            var oo = $(this);
            oo.removeClass("fixed-wn-on");
        });
    };

    if (oMM.get(0)) {
        var _unitScroll = function () {
            var o = $(window),
                st = o.scrollTop(),
                mmTop = oMM.offset().top;

            if (st >= mmTop) {
                oIFWN.show();
                sideslipEffect(oIFWN);
            } else {
                oIFWN.hide();
            }
        };

        $(window).scroll(function() {
            _unitScroll();
        });
    }

    sideslipEffect(oFWN);
}

//弹出框
function popMod(obj, xAxis) {

    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    var pop = o.parent();

    pop.children('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-close').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).on("scroll", function() {
        fixIe6(obj, xAxis);
    });
}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    if (_util.check.isIE6) {
        o.css("top", $(document).scrollTop() + xAxis);
    }
}

function imgPreview(obj, srcAttr) {
    var $container = $('<div/>').attr('id', 'imgPreviewContainer').append('<img/>').hide().css('position', 'absolute').appendTo('body'),
        $img = $('img', $container),
        $imgs = obj.find('img[' + srcAttr + ']');

    $imgs.on('mousemove', function (e) {
        var iX = $(window).width() - $container.width() - 50;
        var xAxis = e.pageX > iX ? iX : e.pageX + 10;
        $container.css({
            top: e.pageY + 10,
            left: xAxis,
            zIndex: 99
        });
    }).hover(function () {
        var oThis = $(this);
        $container.show();
        $img.load(function () {
            $img.show().animate({
                opacity: 1
            }, 300);
        }).attr('src', oThis.attr(srcAttr));
    }, function () {
        $container.hide();
        $img.unbind('load').attr('src', '').hide().stop().css({
            opacity: 0
        });
    });
}