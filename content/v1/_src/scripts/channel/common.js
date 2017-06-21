$(function() {
    fixScreen();
    indexSlide();
    lineItemHover();
    indexNewOrderSlide();
    indexMoreRoute();
    indexViewMore(); //下拉查看更多
    indexSideBarScroll(); //侧边栏滚动
    uzLazy(["j_lazy", "main-tab-mod", "freedom-sytle-mod"]);
    shtMouseover();
    indexAjaxLoadItems(); //ajax 载入边栏信息

    //loadVideoPic();

});

winLoadFix(function() {
    _ug.hotview.set(); //数据热点统计
});

function indexViewMore() {
    $('.more-wrap').on('mouseenter', function() {
        var o = $(this);
        o.addClass('more-wrap-on');
    }).on('mouseleave', function() {
        var o = $(this);
        o.removeClass('more-wrap-on');
    });
}

function indexMoreRoute() {
    $('#j_bannerMod').find('.banner-side-nav').on('mouseenter', function() {
        var o = $(this);
        o.find('.more-bar').addClass('more-bar-on');
        o.find('.other-nav').show();
    }).on('mouseleave', function() {
        var o = $(this);
        o.find('.more-bar').removeClass('more-bar-on');
        o.find('.other-nav').hide();
    });
}

function lineItemHover() {
    $('.main-mod-bd').on('mouseenter', '.line-mod-item', function() {
        var o = $(this);
        o.addClass('line-mod-item-on');
    }).on('mouseleave', '.line-mod-item', function() {
        var o = $(this);
        o.removeClass('line-mod-item-on');
    });

    $('.sale-line-list').on('mouseenter', '.line-mod-item', function() {
        var o = $(this);
        o.addClass('line-mod-item-on');
    }).on('mouseleave', '.line-mod-item', function() {
        var o = $(this);
        o.removeClass('line-mod-item-on');
    });
}

function indexSlide() {
    var oMBS = $('.J_main_banner_slide');
    var playTime = 5000;
    var pauseTime = 1000;
    if (!oMBS.get(0)) {
        return;
    }
    //主体
    oMBS.slides({
        preload: false,
        currentClass: 'on',
        fadeSpeed: 300,
        effect: 'fade',
        crossfade: true,
        hoverPause: false,
        pause: pauseTime,
        play: playTime + pauseTime,
        generatePagination: false,
        animationStart: function() {
            // oMBS.find('.selftrip-pagination-wrap').find('.mask').css({'width': 0}).hide();
        },
        animationComplete: function() {
            // oMBS.find('.selftrip-pagination-wrap').find('.on').children('.mask').show().animate({
            //     'width': '100%'
            // }, playTime);
        },
        slidesLoaded: function() {
            // oMBS.find('.selftrip-pagination-wrap').find('li').eq(0).children('.mask').show().animate({
            //     'width': '100%'
            // }, playTime);
        }
    });

    //优惠
    var oSLL = $('#j_saleLineList');
    oSLL.slides({
        preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
        currentClass: 'on',
        fadeSpeed: 500,
        effect: 'slide',
        hoverPause: true,
        pause: 1000,
        play: 0,
        generateNextPrev: true,
        generatePagination: false,
        slidesLoaded: function() {
            var slideItems = oSLL.find('.slides_control').children();
            if (slideItems.length > 1) {
                oSLL.find('.prev, .next').css('display', 'block');
            }
        }
    });

    //优惠
    $('#j_groupPurchase').slides({
        currentClass: 'on',
        fadeSpeed: 300,
        effect: 'fade',
        crossfade: true,
        hoverPause: false,
        pause: 1000,
        play: 6000,
        generateNextPrev: true,
        generatePagination: false
    });

    var gpTrigger = $('#j_groupPurchaseTrigger');
    var groupPurchase = $('#j_groupPurchase');
    var gpLength = groupPurchase.find('.item').length;

    gpTrigger.on('click', function() {
        groupPurchase.find('.next').click();
    });
    if (gpLength === 1) {
        gpTrigger.hide();
    }

    //跟团游尾单
    $('#j_lastOrder').slides({
        currentClass: 'on',
        fadeSpeed: 300,
        effect: 'fade',
        crossfade: true,
        hoverPause: false,
        pause: 1000,
        play: 6000,
        generateNextPrev: true,
        generatePagination: false
    });

    var loTrigger = $('#j_lastOrderTrigger');
    var lastOrder = $('#j_lastOrder');
    var loLength = lastOrder.find('.item').length;

    loTrigger.on('click', function() {
        lastOrder.find('.next').click();
    });
    if (loLength === 1) {
        loTrigger.hide();
    }



    //点击转换mouseenter
    $('.slides_container').each(function() {
        var o = $(this);
        var opa = o.next('.pagination');
        if (!opa.get(0)) {
            opa = o.next('.pagination-wrap').find('.pagination');
        }

        if (opa.get(0)) {
            opa.find('li').on('mouseenter', function() {
                var oo = $(this);
                oo.find('a').click();
            });
        }

    });

}

function indexNewOrderSlide() {
    //最新动态 jsonp
    var obj = $('#j_latestOrder');
    var objUl = obj.find('.inner');

    var time = new Date();
    var type = $("#pageTypeIntValue").val() ? $("#pageTypeIntValue").val() : 1;

    $.ajax({
        type: 'GET',
        url: '/ashx/ashx_LvyoucnNewBooking.ashx?city=' + _ug.cityID + '&type=' + type + '&time=' + time.getYear() + time.getMonth() + time.getDay() + time.getHours(),
        cache: false,
        success: function(data) {
            if (data) {
                var item = eval("(" + data + ")");
                if (item.length) {
                    var sb = [];
                    for (var j = 0; j < item.length; j++) {
                        var meta = item[j];
                        sb.push("<dl class='book-item pb10 pl10 pr10'><dt class='f14 pt5'><a target='_blank' href='" + meta.ProductUrl + "'>" + meta.tree + "</a></dt><dd class='pt5'><span>[" + meta.time + "分钟前]</span><sapn class='pl10'>" + meta.UserName + "</sapn><span class='pl10'>预订了</span></dd><dd class='book-item-cont pt5'><a target='_blank' href='" + meta.ProductUrl + "' title='" + meta.ProductName + "'>" + meta.ProductName.substr(0, 30) + "...</a></dd></dl>");
                    }

                    objUl.html(sb.join(''));
                    if (objUl.find('dl').length) {
                        var Hotnews = function() {
                            var height = objUl.find('dl').eq(0).outerHeight();
                            objUl.animate({
                                marginTop: -height + 'px'
                            }, 500, function() {
                                var ofirst = objUl.find("dl:first");
                                objUl.css({
                                    'margin-top': '0'
                                });
                                objUl.append(ofirst); //如果一个被选中的元素被插入到另外一个地方，这是移动而不是复制：
                            });
                        };
                        var Utimer = setInterval(Hotnews, 4000);
                        obj.hover(function() {
                            if (Utimer) {
                                clearInterval(Utimer);
                                Utimer = null;
                            }
                        }, function() {
                            Utimer = setInterval(Hotnews, 4000);
                        });
                    }

                }

            } else {

            }
        },
        error: function() {}
    });
}

function fixScreen() {
    var w = screen.width;
    var sideFixNav = $('#j_sideFixNav');

    if (w <= 1024) {
        sideFixNav.hide();
    }

    if (w <= 1152) {
        $('.J_main_banner_slide').width(540);
        $('.main-banner-slide .slides_container a img').width(540);
        $('.sale-line-list').find('.line-mod-item').width(182);
        $('.sale-line-list').find('.line-item img').height(135);
    }

    if (w == 1280 && sideFixNav.get(0)) {
        sideFixNav.css({
            'margin-left': 0,
            'left': 0
        });

        $('body').append('<style>.w{width:1140px;}</style>');
        $('.newTop-search').css({ 'width': 465 });
        $('.newTop-srh-input').css({ 'width': 215 });
        $('.J-autocomp').css({ 'width': 225, 'left': 77 });
        if (_util.check.isIE6) {
            $('#J_searchDestinationBox').width(378);
            $('#j_advancedSearch').find('.advanced-search-mod').width(465);
        }

        $('.J_main_banner_slide').width(680);
        $('.main-banner-slide .slides_container a img').width(680);
        $('.sale-line-list').find('.line-mod-item').width(217);
        $('.sale-line-list').find('.line-item img').height(163);
    }
}


function indexSideBarScroll() {
    var box = $('#j_sideFixNav');
    var mh = $('.main-box').find('.main-hd').eq(0);

    if (!mh.get(0)) {
        return;
    }

    var ot = mh.offset().top;

    $(window).scroll(function() {
        unitScroll();
    });

    var unitScroll = function() {
        var w = $(window);
        var st = w.scrollTop();
        if (st >= ot) {
            box
                .css({
                    'top': 0,
                    'position': 'fixed'
                })
                .addClass('sfn-on');
            unitCheck(st);
        } else {
            box
                .css({
                    'top': -ot,
                    'position': 'absolute'
                })
                .removeClass('sfn-on');
        }
    };

    var unitCheck = function(st) {
        $('.main-hd').each(function(k, v) {
            var o = $(this);
            if (o.get(0)) {
                var oot = o.offset().top;
                if (st > oot - 1) {
                    box.find('li').removeClass('on');
                    box.find('li').eq(k).addClass('on');
                    return true;
                }
            }
        });
    };

    var unitSkip = function() {
        box.find('li').on('click', function() {
            var oli = $(this);
            var oindex = oli.index();

            var olis = oli.siblings('li');
            //olis.removeClass('on');
            //oli.addClass('on');

            var skipNode = $('.main-hd').eq(oindex);
            if (skipNode.get(0)) {
                var oot = skipNode.offset().top;
                $('body,html').animate({
                    scrollTop: oot
                }, 800);
            }
        });
    };

    unitSkip();
    unitScroll();
}

//切换选项时加载图片
function imgLazyload(oMainMod, parIndex, subIndex) {
    var imgUrl = '';
    var imgItems = oMainMod.find('.main-mod-bd').children('.item').eq(parIndex).find('.line-mod-list').children('.item').eq(subIndex).find('img');
    var imgNum = imgItems.length;

    for (var i = 0; i <= imgNum; i++) {
        imgUrl = imgItems.eq(i).attr('data-original');
        imgItems.eq(i).attr('src', imgUrl);
    }
}

//侧边热门旅游鼠标悬停事件
function shtMouseover() {
    $('.side-hot-travel .hot-item').on('mouseover', function() {
        var oThis = $(this);
        oThis.siblings().removeClass('on');
        oThis.addClass('on');
    });
}

function indexAjaxLoadItems() {
    $('.main-tab-mod').find('.main-tab-hd').find('li').on('click', function() {
        var o = $(this);
        var oid = o.attr('data-key'); //id值
        var op = o.parents('.main-tab-mod');
        var index = o.index();

        o.addClass('on').siblings('li').removeClass('on');

        var items = op.find('.main-tab-bd').children('.item');
        items.hide();
        var curremtItem = items.eq(index);
        curremtItem.show();

        if (index === 0) {
            return;
        }

        //已经ajax请求过
        if (curremtItem.find('li').length) {
            return;
        }

        var firstItem = items.eq(0);
        var firstItemA = firstItem.find('.line-pic').find('a');
        var firstItemAHref = firstItemA.attr('href');
        var firstTag = firstItemAHref.split('#')[1];

        if (firstTag) {
            firstTag = "#" + firstTag;
        } else {
            firstTag = "";
        }

        //676
        $.ajax({
            url: _uzw.domain.wapi + '/api/UzaiProduct/?id=' + oid + '&city=' + _ug.cityID,
            type: 'GET',
            dataType: "jsonp",
            cache: true,
            beforeSend: function() {
                //console.log('beforeSend');
            },
            success: function(d) {

                if (d.length) {
                    var sb = [];
                    var sb2 = [];
                    sb2.push("<div class='line-list-wrap fl'>");
                    sb2.push("<ul class='line-list clearfix'>");
                    for (var i = 0; i < d.length; i++) {

                        var item = d[i];
                        var id = item.ID;
                        var pn = item.ProductName;
                        var pu = item.ProductURL + firstTag;
                        var ne = item.NameExtension;
                        var mp = item.MinPrice;
                        var tl = parseInt(item.TalkLevel, 10);
                        var tb = item.TalkBack;
                        var gd = item.GoDate;
                        var gd1, gd2;
                        if (gd) {
                            gd1 = gd.split(',')[0];
                            gd2 = gd.split(',')[1];
                        }

                        var imgStr = item.ShowPicTree;

                        var pub = item.PresentedUB;
                        var sm = item.SpecialrateMark.split('￥')[1];

                        //"PresentedUB":0
                        //"SpecialrateMark":"减￥470"

                        var spub = pub ? "<label class='tag-benefit f14'><span class='white yahei pl5 pr5'>送</span><i class='price pl5 pr5'><em>" + pub + "</em></i></label>" : "";
                        var ssm = sm ? "<label class='tag-benefit f14'><span class='white yahei pl5 pr5'>最高减</span><i class='price pl5 pr5'>￥<em>" + sm + "</em></i></label>" : "";

                        var pt = item.PicTreeID;

                        if (i === 0) {
                            sb.push("<dl class='hot-line fl'>");
                            sb.push("<dd class='line-pic p10'><a target='_blank' href=" + pu + ">");
                            sb.push("<img alt='' src='" + imgStr + "'  /></a></dd>");
                            sb.push("<dt class='line-hd b pl10 pr10'><a href=" + pu + " >" + pn + "</a></dt>");
                            sb.push("<dd class='f999 pl10 pr10 pt10'>" + ne + "</dd>");
                            sb.push("<dd class='f666 pl10 pr10 pt10'>");
                            sb.push("<p>");
                            tl !== 0 && sb.push("<span class='mr10'>满意度：<em>" + tl + "%</em></span>");
                            tb !== 0 && sb.push("<sapn class='mr10'><em>" + tb + "</em>人点评</sapn>");
                            sb.push("</p>");
                            sb.push("<p>");
                            if (gd1) {
                                sb.push("<a target='_blank' href=" + pu + ">");
                                sb.push("<span class='mr10 pointer'>班期：<label>" + gd1 + "</label>");
                                gd2 && sb.push(", <label class='pointer'>" + gd2 + "</label>");
                                sb.push("</span>");
                                sb.push("</a>");
                            }
                            sb.push("<a class='all-days mr10' href='javascript:void(0);' onclick='window.open(\"" + pu + "\")' >");
                            sb.push("<i class='icon-calendar mr5 vm'>&nbsp;</i>更多班期");
                            sb.push("</a>");
                            sb.push("</p>");
                            sb.push("</dd>");
                            sb.push("<dd class='pl10 pr10 pt10 clearfix'>");
                            sb.push("<div class='fl'>");
                            sb.push(spub + ssm);
                            sb.push("</div>");
                            sb.push("<div class='price-mod orange fr'><i class='price f14 b'>￥<em>" + mp + "</em></i>起</div>");
                            sb.push("</dd>");
                            sb.push("</dl>");
                        } else if (i <= 4) {
                            if (i === 3) {
                                sb2.push('</ul>');
                                sb2.push("<ul class='line-list clearfix'>");
                            }
                            sb2.push("<li>");
                            sb2.push("<div class='line-itme mr10 pt10'>");
                            sb2.push("<div class='line-pic'>");
                            sb2.push("<a target='_blank' href=" + pu + ">");
                            sb2.push("<img alt='' src='" + imgStr + "'>");
                            sb2.push("<div class='line-hd'>");
                            sb2.push("<div class='mask'>&nbsp;</div>");
                            sb2.push("<p class='line-hd-cont pt5 pb5 pl10 pr10' title='pn'>" + pn + "</p>");
                            sb2.push("</div>");
                            sb2.push("</a>");
                            sb2.push("</div>");
                            sb2.push("<div class='line-fd pl10 pr10 clearfix'>");
                            sb2.push("<div class='days-box f666 fl'>");
                            if (gd1) {
                                sb2.push("<a onclick='window.open(\"" + pu + "\")' class='pointer' href='javascript:void(0);'>班期：<label class='pointer' title='" + gd1);
                                gd2 && sb2.push("," + gd2);
                                sb2.push("'>" + gd1);
                                gd2 && sb2.push("," + gd2);
                                sb2.push("</label><span class='all-days pl10'><span class='arrow arrow-right songti lh1'><em>◆</em><i>◆</i></span></span></a>");
                            }
                            sb2.push("</div>");
                            sb2.push("<div class='price-mod orange fr'><i class='price f14 b'>￥<em>" + mp + "</em></i>起</div>");
                            sb2.push("</div>");
                            sb2.push("</div>");
                            sb2.push("</li>");
                        }

                    }
                    sb2.push('</ul>');
                    sb2.push("</div>");
                    curremtItem.html(sb.join('') + sb2.join(''));
                }

            },
            complete: function() {
                //console.log('complete');
            }
        });

        return false;
    });
}

function loadVideoPic() {
    var ur = location.pathname.toLowerCase();
    if (ur.indexOf('selftrip/guonei') > -1) {
        var box = $('#j_bannerMod').children('.banner-side-pict').children('.side-pic').eq(0);
        var boxImg = box.find('img');
        var src = boxImg.attr('src');
        box.html("<i></i><img src='" + src + "' />");

        box.on('click', function() {
            ga('send', 'event', 'c-domestic-free', ' video', '全部');
            _uzw.ui.mask.show();
            $('.pop-chanel-video').remove();
            $('body').append("<div class='ui-pop pop-chanel-video'><i class='pop-close'>&times;</i><iframe height=400 width=640 src='http://player.youku.com/embed/XMTQ1ODEwOTI0MA==' frameborder=0 allowfullscreen></iframe></div>");
            $('.pop-chanel-video').find('.pop-close').on('click', function() {
                $('.pop-chanel-video').remove();
                _uzw.ui.mask.hide();
                ga('send', 'event', 'c-domestic-free', ' video', '关闭');
            });
        });
    }
}