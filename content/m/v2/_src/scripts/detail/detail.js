"use strict";

var detailexports = {};

detailexports.init = function () {

    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        window.tab.init('j_journeyInfosTab');
    });

    detailexports.zoomPic('j_expertComment', 'pic-list');
    detailexports.zoomPic('j_proCommentList', 'j_picList');
    detailexports.imgLazyLoad('j_expertComment');
    detailexports.imgLazyLoad('j_proCommentList');
    detailexports.contentSwitch();

    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
        detailexports.detailSlider();
    });

    detailexports.detailPop();
    detailexports.detailJourney();
    detailexports.loadComment();
    detailexports.horizontalSize($('#j_expertComment'), 'j_picList', 10);
};

//展开收起内容
detailexports.contentSwitch = function () {
    var rmb = $('#j_routeMeritBox');
    var clist = rmb.find('.recomm-box').find('.cont-list');
    var sbar = clist.siblings('.switch-bar');
    var ilb = $('#j_infoListBox');

    if (clist.height() > 48) {
        sbar.show();
        !clist.hasClass('cut') && clist.addClass('cut');
    }

    sbar.on('click', function () {
        var o = $(this);
        if (!o.hasClass('on')) {
            o.addClass('on');
            clist.removeClass('cut');
        } else {
            o.removeClass('on');
            clist.addClass('cut');
        }
    });

    ilb.find('.switch').on('click', function () {
        var o = $(this);
        var os = o.siblings('.switch');
        var conts = ilb.find('.info-bd');
        var oNext = o.next('.info-bd');

        if (o.hasClass('on')) {
            o.removeClass('on');
            oNext.hide();
        } else {
            os.removeClass('on');
            o.addClass('on');
            conts.hide();
            oNext.show();

            //图片延迟加载
            var imgs = oNext.find('img[data-original]');
            imgs.each(function (k, v) {
                var oo = $(this);
                oo.attr('src', oo.attr('data-original'));
            });

        }
    });
};

//图片延迟加载
detailexports.imgLazyLoad = function (obj) {
    var el = $('#' + obj);
    if (!el.get(0)) {
        el = $('.' + obj);
    }
    el.find('img[data-src]').each(function () {
        var o = $(this);
        var sSrc = o.attr('data-src');
        if (sSrc !== o.attr('src')) {
            o.attr('src', sSrc);
        }
    });
};

//初始化图片点击事件
detailexports.zoomPic = function (scope, section) {

    var zw = $('.zp-wrap');
    if (!zw.get(0)) {
        $('body').append("<div class='zp-wrap'></div>");
        zw = $('.zp-wrap');
    }
    var el = $('#' + scope);
    if (!el.get(0)) {
        el = $('.' + scope);
    }

    el.find('.' + section).on('click', 'img', function () {
        zw.find('img').remove();

        var sw = screen.width;
        var sh = screen.height;
        var w = sw > sh ? sw : sh;

        var o = $(this);
        var osrc = o.attr('src');
        var oNsrc = osrc.replace('w=93&h=100', 'w=640');
        var cfg = {
            'max-width': sw,
            'max-height': sh,
            'width': '100%'
        };

        zw.append("<img />");
        zw.find('img').attr('src', oNsrc).css(cfg);
        zw.css({
            'left': '0'
        });

        zw.on('click', function () {
            zw.css({
                'left': '100%'
            });
            zw.find('img').remove();
        });

    });
};

detailexports.detailSlider = function () {
    var psw = $('#j_journeyDetail').find('.picture-slider-wrap');
    if (psw.get(0)) {
        psw.each(function () {
            var oThis = $(this);
            var oid = oThis.attr('id');
            var ps = oThis.find('.picture-slider');
            var subid = ps.attr('id');
            var nb = oThis.find('.num-bar');
            var siLen = oThis.find('.slider-item').length;

            if (siLen > 1) {
                nb.css({ 'display': 'block' }).find('.sum').text(siLen);
            }
            window.slider.api(subid, oid, 0, true, false, function (i) {
                nb.find('.now').text(i + 1);
            });
        });
    }

};

detailexports.detailPop = function () {
    var jd = $('#j_journeyDetail');
    var _popFavorableInfo = function () {
        var oDA = $('#detail-aside');

        oDA
            .show()
            .css({
                'left': '0'
            })
            .on('click', function () {
                oDA.css({
                    'left': '100%'
                });
            });
    };
    var hib = $('#j_hotelInfoBox');
    hib.find('.info-list').on('click', '.list-item', function () {
        detailexports.hotelInfoShow($(this).index());
        var hsw = $('#j_hotelSliderWrap');
        if (hsw.get(0)) {
            var oNB = hsw.find('.num-bar');
            var iSILen = hsw.find('.slider-item').length;

            oNB.find('.sum').text(iSILen);
            window.slider.api('j_hotelSlider', 'j_hotelSliderWrap', 5000, true, false, function (i) {
                oNB.find('.now').text(i + 1);
            });
        }
        var phd = $('#j_popHotelDetail');
        phd.css({ 'opacity': 1, 'z-index': 1000 }).on('click', '.j_popClose', function () {
            phd.css({ 'opacity': 0, 'z-index': -1 });
        });
    });

    var bjs = $('#j_btnJourneySummary');
    bjs.on('click', function () {
        var oThis = $(this);
        var pjs = $('#j_popJourneySummary');

        oThis.css({ 'bottom': '-100%' });
        pjs.css({ 'left': 0 }).on('click', function () {
            var oThis = $(this);
            oThis.css({ 'left': '-100%' });
            bjs.css({ 'bottom': '18%' });
        }).find('.summary-list').on('click', '.item-wrap', function () {
            var oThis = $(this);
            var iIndex = oThis.index();
            var items = jd.children('.journey-item');
            var skipNode = items.eq(iIndex);
            var oot = skipNode.offset().top;
            $('body, html').scrollTop(oot);
        });
    });

    $('#j_detailInfos').find('.favorable-bar').on('click', '.bar-side', function () {
        _popFavorableInfo();
    });

    $('#j_orderDetail').find('.favorable-bar').on('click', function () {
        _popFavorableInfo();
    });

    //新版备用勿删
    //$('#j_orderDetail').find('.favorable-bar').on('click', function () {
    //    var pf = $('#j_popFavorable');
    //    _uzm.mask.show();
    //    pf.css({ 'bottom': 0 }).on('click', '.j_popClose', function () {
    //        _uzm.mask.hide();
    //        pf.css({ 'bottom': '-100%' });
    //    });
    //});

};

detailexports.hotelInfoShow = function (num) {
    var json = $("#j_hotelInfoBox").find("li").eq(num).children(".hide-json").text();
    json = eval("(" + json + ")");
    if (json && typeof json !== "undefined") {
        var sliderBox = $('#j_hotelSlider').find('.slider-inner');
        var sliderItem = [];
        for (var i = 0; json.HotelImages.length > i; i++) {
            //sliderItem.push('<div class="slider-item"><img src="http://10.1.13.214/content/m/v2/images/detail/pic12.jpg" alt=""></div>');
            sliderItem.push('<div class="slider-item"><img src="' + json.HotelImages[i] + '" alt=""></div>');
        }
        sliderBox.append(sliderItem.join(''));
        if (json.Hnam) {
            if (new RegExp(/^[A-Za-z]+$/).test(json.Hname)) {
                $('#j_popHotelDetail').find('.hotel-hd').html('<p>' + json.Hname + '</p>');
            } else {
                $('#j_popHotelDetail').find('.hotel-hd').html('<p class="f15">' + json.Hname + '</p>');
            }
        }
        if (json.Star) {
            $('.hotel-info-items>dl').eq(0).find('.item-bd').text(detailexports.GetStarTxt(json.Star));
        } else {
            $('.hotel-info-items>dl').eq(0).remove();
        }
        if (json.Rname) {
            $('.hotel-info-items>dl').eq(1).find('.item-bd').text(json.Rname);
        } else {
            $('.hotel-info-items>dl').eq(1).remove();
        }
        if (json.Breakfast) {
            $('.hotel-info-items>dl').eq(2).find('.item-bd').text(json.Breakfast);
        }
        else {
            $('.hotel-info-items>dl').eq(2).remove();
        }
        if (json.Address) {
            $('.hotel-info-items>dl').eq(3).find('.item-bd').text(json.Address);
        }
        else {
            $('.hotel-info-items>dl').eq(3).remove();
        }
        if (json.Hsynopsis) {
            $('.hotel-intro').find('.intro-bd').html(json.Hsynopsis.replace(/\r\n/g, '<br/>'));
        } else {
            $('.hotel-intro').remove();
        }
    }
};

detailexports.detailJourney = function () {
    var jd = $('#j_journeyDetail');

    if (jd.get(0)) {
        var bjs = $('#j_btnJourneySummary');
        var jiLen = jd.find('.journey-item').length;

        if (jiLen > 5) {
            bjs.show();
        } else {
            bjs.hide();
        }
    }
};

detailexports.loadComment = function () {
    var box = $('#j_proCommentList');
    detailexports.horizontalSize(box, 'j_picList', 10);
    box.find('.more-comment').on('click', function () {
        var o = $(this);
        var op = parseInt(o.attr('data-page'), 10);
        var pid = $("input#pid").val();
        var count = 10;
        var startCity = 2;
        if (o.text() == '暂无更多点评') {
            return;
        }
        $.ajax({
            type: "GET",
            async: false,
            url: '/ashx/GetTalkBackList.ashx?ProductID=' + pid + '&Count=' + count + '&PageIndex=' + op + '&startcity=' + startCity + '&rad=' + Math.random(),
            dataType: 'json',
            success: function (msg) {
                var iLen = msg.TalkBacks.length;
                if (iLen) {
                    for (var i = 0; i < iLen; i++) {

                        var item=msg.TalkBacks[i];

                        var data = '<li class="comment-item mb10 p10">';
                        data += `<div class="comment-item-hd f999 mb5 pb5 clearfix"><i class="fl mr10 f14 f333">${item.UserName}</i><span class="cacsi fl">满意度 <i class="f10 vm">${item.Satisfaction}%</i></span><span class="post-time fr">点评时间：<em class="f10">${item.TalkBackTime}</em></span></div>`;
                        data += `<div class="comment-item-cont mb5">${item.TalkBackContent}</div>`;

                        if (item.CommentImages) {
                            data += '<div class="comment-item-pic"><ul class="pic-list j_picList clearfix">';
                            var picLength = item.CommentImages.length;
                            var pics = item.CommentImages;
                            for (var j = 0; j < picLength; j++) {
                                data += `<li><img src="${pics[j].Url.split('&')[0]}&h=300&t=2" alt="${pics[j].Name}" /></li>`;
                            }
                            data += "</ul></div>";
                        }

                        data += "</li>";

                        box.children('ul').append(data);
                        o.attr('data-page', op + 1);
                    }
                } else {
                    o.text('暂无更多点评');
                }
            },
            error: function () { }
        });
        detailexports.horizontalSize(box, 'j_picList', 10);
        detailexports.zoomPic('j_proCommentList', 'j_picList');
        return false;
    });
};

//初始化容器宽度
detailexports.horizontalSize = function (scope, section, interval) {
    scope.imagesLoaded(function () {
        scope.find('.' + section).each(function () {
            var o = $(this);
            var iw = 0;
            o.children().each(function () {
                var oThis = $(this);
                iw += oThis.width() + interval;
            });
            o.width(iw);
        });
    });
};

detailexports.GetStarTxt = function (star) {
    switch (star) {
        case 1:
            return "三星";
        case 2:
            return "四星";
        case 3:
            return "五星";
        case 4:
            return "度假型酒店式公寓";
        case 5:
            return "特色度假酒店";
        case 6:
            return "三星（国际）";
        case 7:
            return "四星（国际）";
        case 8:
            return "五星（国际）";
        case 9:
            return "六星（国际）";
        case 10:
            return "七星（国际）";
        case 11:
            return "特色客栈";
        default:
            return "暂无信息";
    }
};

//图片已加载
$.fn.imagesLoaded = function (callback) {
    var elems = this.find('img'),
        len = elems.length;
    elems.bind('load', function () {
        if (--len <= 0) {
            callback.call(elems, this);
        }
    }).each(function () {
        // cached images don't fire load sometimes, so we reset src.
        if (this.complete || this.complete === undefined) {
            var src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            this.src = src;
        }
    });

    return this;
};
$(function () {
    detailexports.init();
});
