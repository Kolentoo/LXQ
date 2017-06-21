$(function() {
    weidanData(); //尾单数据
    indexSlide();
    fixScreen();
    //indexUserInfo();
    indexNewOrderSlide();
    lineItemHover();
    // loadInfiAd();
    indexConTab();
    destinationTab();
    uzLazy(['j_lazy', 'line-item', 'bj-sale-list', 'j_bjMainTab']);
    indexLazyLoadFooterSlide();
    //index3rdAd();
});

winLoadFix(function() {
    _ug.hotview.set(); //数据热点统计
});

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

function destinationTab() {

    var o = $('.recommend-destination');

    o.find('.recommend-destination-bd .item').eq(0).show();
    o.find('.main-mod-hd li').on('mouseenter', function() {
        var oThis = $(this);
        var index = oThis.index();
        oThis.addClass('on').siblings().removeClass('on');
        o.find('.bd .item').hide().eq(index).show();
    });

}

function indexSlide() {
    var w = screen.width,
        bmSlides = $('#j_bjBmSlides'),
        mainTab = $('.j_bjMainTab'),
        eComment = $('.bj-expert-comment'),
        oImg = bmSlides.find('.slide-item').find('img');

    var _exchangeSrc = function(oimg) {
        if (!oimg.get(0)) {
            return;
        }
        var mypicsrc = oimg.attr('src');
        var mypicori = oimg.attr('data-original');
        if (mypicsrc && mypicsrc.indexOf('gray.gif') > -1) {
            oimg.attr('src', mypicori);
        }
    };

    var mfr = Math.floor(Math.random() * 6 + 1);
    var lens = 0;

    if (bmSlides.get(0)) {
        bmSlides.slides({
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: false,
            pause: 1000,
            play: 6000,
            start: mfr,
            generatePagination: false,
            generateNextPrev: true,
            animationStart: function(idx) {
                if (idx === lens) {
                    idx = 0;
                }
                var idxn2 = idx + 1;
                if (idxn2 === lens) {
                    idxn2 = 0;
                }
                var cimg = bmSlides.find('.slides_control').children('a').eq(idx).children('img');
                var cimg2 = bmSlides.find('.slides_control').children('a').eq(idxn2).children('img');
                _exchangeSrc(cimg);
                _exchangeSrc(cimg2);
            },
            slidesLoaded: function() {
                if (w <= 1152) {
                    oImg.css({
                        'position': 'absolute',
                        'left': -95
                    });
                }

                lens = bmSlides.find('.slides_control').children('.slide-item').length;

                lens = lens > 8 ? 8 : lens; // 最多展示8个
                bmSlides.find('.pagination-wrap').addClass('pagination-items-' + lens);

                // bind click event
                bmSlides.find('.pagination').find('li').on('mouseenter', function() {
                    var o = $(this);
                    var idx = o.index();
                    o.find('a').trigger('click');
                    var mypic = bmSlides.find('.slides_control').children('a').eq(idx).children('img');
                    _exchangeSrc(mypic);
                });

                var mypic2 = bmSlides.find('.slides_control').children('a').eq(mfr - 1).children('img');
                _exchangeSrc(mypic2);
            }
        });

    }

    mainTab.find('.item:first').find('img[data-original]').lazyload({
        effect: "fadeIn"
    });

    eComment.find('img[data-original]').lazyload({
        effect: "fadeIn",
        load: function() {
            var oThis = $(this),
                tpw = oThis.parent().width(),
                tph = oThis.parent().height(),
                tw = oThis.width(),
                th;

            if (oThis.attr('data-original') === oThis.attr('src')) {
                if (tw > tpw) {
                    oThis.css({
                        'left': -(tw - tpw) / 2,
                        'width': tw
                    });
                } else if (tw < tpw) {
                    oThis.css({
                        'width': '100%',
                        'height': 'auto'
                    });
                    th = oThis.height();
                    oThis.css({
                        'top': -(th - tph) / 2
                    });
                }
            }
        }
    });

    mainTab.children('.hd').find('.hd-item').on('click', function() {
        var o = $(this);
        var os = o.siblings('.hd-item');
        var index = o.index() - 1;

        os.removeClass('on');
        o.addClass('on');

        var obd = o.parents('.hd').siblings('.bd');
        var items = obd.children('.tab-bd-box').children('.item');

        items.hide();
        items.eq(index).show();

        var oImgs = items.eq(index).find('img[data-original]'),
            oImg = oImgs.eq(0);

        if (oImg.attr('data-original') !== oImg.attr('src')) {
            oImgs.each(function() {
                var oThis = $(this);
                oThis.attr('src', oThis.attr('data-original'));
            });
        }
    });

    if (w <= 1152) {
        mainTab.find('.main-side-link').hide();
        mainTab.find('.bd').css({
            'padding-left': 55
        });
    }

    //手机二维码
    $('.J_mobile_code_slide').slides({
        currentClass: 'on',
        fadeSpeed: 2500,
        effect: 'slide',
        crossfade: true,
        hoverPause: true,
        pause: 1000,
        play: 0,
        generatePagination: false
    });

    //主体侧边
    $('.J_main_side_slide').slides({
        currentClass: 'on',
        fadeSpeed: 600,
        effect: 'fade',
        crossfade: true,
        hoverPause: true,
        pause: 1000,
        generatePagination: true
    });

    // 点击改为mouseenter
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

function indexUserInfo() {
    var uid = _uzw.user.userid;
    var uname = _uzw.user.userName;
    var ubox = $('#j_indexLoginBox');
    var ua = '';

    //展示登录注册与否
    if (uid) {
        ubox.find('.login-fd').eq(0).hide();
        ubox.find('.login-fd').eq(1).show();
        ua = '<a href="https://u.uzai.com/manage/Index">' + uname + '</a>';
        $('#j_indexUserName').text('').append(ua);
        $.ajax({
            type: "GET",
            cache: false,
            async: false,
            url: _uzw.domain.u + '/GetUserPushMessage',
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "UserPushMessage",
            success: function(msg) {
                ubox.find('.member-order').find('.num').html(msg[0].ordernum);
                ubox.find('.member-comment').find('.num').html(msg[0].backnu);
                ubox.find('.member-icon').find('img').attr('src', msg[0].userHeadUrl);
            }
        });

    } else {
        ubox.find('.login-fd').eq(1).hide();
        ubox.find('.login-fd').eq(0).show();
    }

    //switch city
}

function indexNewOrderSlide() {
    //最新动态 jsonp
    var obj = $('#j_slideIndexBar');
    var objUl = obj.find('ul');

    var hts = $('#hid_Trees').val();
    if (!hts) {
        return;
    }

    var _scroll = function() {
        if (objUl.find('li').length) {
            var Hotnews = function() {
                var height = objUl.find('li').eq(0).outerHeight();
                objUl.animate({
                    marginTop: -height + 'px'
                }, 500, function() {
                    var ofirst = objUl.find("li:first");
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
    };

    $.ajax({
        type: 'GET',
        url: '/ashx/ashx_GetIndexOrder.ashx?city=' + _ug.cityID + '&treeIDs=' + hts,
        cache: false,
        dataType: 'json',
        success: function(data) {
            if (data) {
                var d = data.list;
                var sb = [];
                if (d && d.length) {
                    for (var i = 0; i < d.length; i++) {
                        var item = d[i].order;
                        if (item) {
                            for (var j = 0; j < item.length; j++) {
                                var meta = item[j];
                                sb.push("<li><p class='p1'>" + meta.Time + "分钟前 " + meta.UserName + " 预订了</p><p class='p2'><a target='_blank' href='" + meta.URL + "' target='_blank'>" + meta.ProductName + "</a></p></li>");
                            }
                        }
                    }
                    objUl.html(sb.join(''));
                    _scroll();
                }
            } else {

            }
        },
        error: function() {}
    });


}

function indexConTab() {

    //父tab
    var par = $('.main-mod');
    par.find('.main-mod-hd').find('li').on('mouseenter', function() {
        var o = $(this);
        var index = o.index();
        var oMainMod = o.parents('.main-mod');

        o.addClass('on').siblings('li').removeClass('on');

        var items = o.parents('.main-mod-hd').next('.main-mod-bd').children('.item');
        items.hide();
        items.eq(index).show();

        if (index > 0) {
            imgLazyload(oMainMod, index, 0);
        }
    });


    //子tab
    //modify ajax
    par.find('.main-mod-bd').on('click', '.hot-destination-items a', function() {

        var o = $(this);
        var oid = o.attr('data-key'); //id值

        var index = o.index();
        var oMainMod = o.parents('.main-mod');
        var parIndex = 0;
        parIndex = o.parents('.item').index();
        o.addClass('on').siblings('a').removeClass('on');

        var items = o.parents('.hot-destination').next('.hot-destination-box').find('.line-mod-list').children('.item');
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
        var firstItemA = firstItem.find('.line-info').find('a');
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
                    sb.push('<ul>');

                    for (var i = 0; i < d.length; i++) {

                        var item = d[i];
                        var id = item.ID;
                        var pn = item.ProductName;
                        var pu = item.ProductURL + firstTag;
                        var ne = item.NameExtension;
                        var mp = item.MinPrice;
                        var tl = item.TalkLevel;
                        var tb = item.TalkBack;
                        var gd = item.GoDate;
                        var pt = parseInt(item.PicTreeID, 10);


                        var imgID = parseInt(item.ImageID, 10);
                        var imgTID = parseInt(item.ImageTreeID, 10);

                        var imgStr = item.ShowPicTree;

                        sb.push("<li class='line-mod-item mod-box ml10 mt10'>");

                        sb.push("<a target='_blank' href='" + pu + "'>");
                        sb.push("<div class='line-item'><img alt='' src='//r.uzaicdn.com/content/m/images/common/gray.gif' data-original='" + imgStr + "' />");
                        sb.push("<div class='line-item-hd-wrap'><div class='line-item-hd clearfix'>");
                        sb.push("<p title='" + pn + "' class='hd-txt f666'>" + pn + "</p>");
                        sb.push("<span class='line-item-price icon-index png'><span class='price-mod orange pl5 pr5'><i class='price b'>￥<em class='f14'>" + mp + "</em></i>起</span></span>");
                        sb.push("</div></div></div>");
                        sb.push("</a>");

                        sb.push("<div class='line-item-hover line-item-hover'>");

                        sb.push("<a target='_blank' href='" + pu + "'><div class='mask'>&nbsp;</div></a>");

                        sb.push("<div class='line-info'>");

                        sb.push("<a target='_blank' href='" + pu + "'>");
                        sb.push("<dl>");
                        sb.push("<dt class='line-info-hd f666 pt10 pl5 pr5'><p title='" + pn + "'>" + pn + "</p></dt>");
                        sb.push("<dd class='mt5 pl5 pr5 clearfix'>");
                        sb.push("<div class='line-hd-cont f666 fl'><p class='f999 clearfix'><span class='fl'>满意：" + tl + "</span><span class='fr pr5'>评论：" + tb + "</span></p></div>");
                        sb.push("<div class='price-box fr'><p><ins class='price-mod orange lh1'><i class='price b'>￥<em class='f14'>" + mp + "</em></i>起</ins></p></div>");
                        sb.push("</dd>");
                        sb.push("</dl>");
                        sb.push("</a>");

                        sb.push("<div class='line-info-fd f666 mt5 pl5 pr5 clearfix'>");
                        sb.push("<div class='line-days fl'><a href=\"" + pu + "\" target=\"_blank\"><p title='最近班期：" + gd + "' class='hd-txt pointer'>最近班期:<label class='pointer'>" + gd + "</label></p></a></div>");
                        sb.push("<p onclick='window.open(\"" + pu + "\")' class='all-days pointer fr'><i class='icon-calendar ml10 mr5 vm'>&nbsp;</i>更多班期</p>");
                        sb.push("</div>");
                        sb.push("</div>");

                        sb.push("</div>");

                        sb.push("</div>");

                        sb.push("</li>");

                    }
                    sb.push('</ul>');
                    curremtItem.html(sb.join(''));
                }
                imgLazyload(oMainMod, parIndex, index);

            },
            complete: function() {
                //console.log('complete');
            }
        });



        return false;
    });

}

function weidanData() {

    //线路尾单切换
    var timerWrap = $('#sidebar-timer');
    if (!timerWrap.get(0)) {
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/ashx/ashx_EndOrder.ashx?startcity=' + _ug.cityID + '&type=New',
        success: function(data) {

            var timerBox = $('#sidebar-timer-box');
            var ts = timerWrap.prev('.travel-sale');

            if (data != 'empty') {
                $("#sidebar-timer .slides_container").html(data);
                $("#sidebar-timer").show();

                if (timerWrap.find('.item').length) {

                    weiDanTimeHandle(); //尾单倒计时

                    ts.find('.line-mod-item').eq(4).hide();
                    timerBox.slides({
                        fadeSpeed: 2500,
                        effect: 'slide',
                        crossfade: true,
                        hoverPause: true,
                        play: 7000,
                        pause: 2500,
                        currentClass: 'on',
                        generatePagination: true
                    });
                } else {
                    timerWrap.hide();
                    ts.width('auto');
                }

            } else {
                timerWrap.hide();
                ts.width('auto');
            }
        },
        error: function() {}
    });
}

//尾单倒计时
function weiDanTimeHandle() {

    setInterval(function() {
        var nowtime = new Date().getTime();
        //var endtime = new Date($(this).attr("endtime")).getTime(); //取结束日期(毫秒值)
        $("#sidebar-timer .item").each(function(k, v) {
            var o = $(this);
            nowtime = nowtime + 1000;
            var endtime = new Date(o.attr("endtime")).getTime(); //取结束日期(毫秒值)

            var youtime = endtime - nowtime; //还有多久(毫秒值)
            var seconds = youtime / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            var CDay = days;
            if (CDay.toString().length == 1) {
                CDay = "0" + CDay;
            }
            var CHour = hours % 24;
            if (CHour.toString().length == 1) {
                CHour = "0" + CHour;
            }
            var CMinute = minutes % 60;
            if (CMinute.toString().length == 1) {
                CMinute = "0" + CMinute;
            }
            var CSecond = Math.floor(seconds % 60); //"%"是取余运算，可以理解为60进一后取余数，然后只要余数。
            if (CSecond.toString().length == 1) {
                CSecond = "0" + CSecond;
            }

            if (endtime <= nowtime) {

            } else {
                o.find('.item-time').find('.tian').find('b').text(CDay);
                o.find('.item-time').find('.shi').find('b').text(CHour);
                o.find('.item-time').find('.fen').find('b').text(CMinute);
                o.find('.item-time').find('.miao').find('b').text(CSecond);
            }
        });
    }, 1000);

}

function fixScreen() {
    var w = screen.width;
    if (w <= 1152) {
        $('.banner-side-mod').hide();
        $('.main-side-slide').hide();
        $('.J_main_banner_slide').width(770);
        $('.J_main_banner_slide').find('.slides_control').css({
            'width': 'auto'
        });
        $('.line-mod-item').width(244);
        $('.travel-sale').css({
            'width': 'auto'
        });
        $('.sale-line-list').find('.line-mod-item').width(240);
        $('.main-banner-slide .slides_container a img').width(770);
        $('.main-mod-bd .line-list').css({
            'width': 'auto'
        });
    }
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


/*function loadInfiAd() {
    return;
    var initDate = ['3-21', '4-18', '5-16', '6-20', '7-18', '8-15', '9-19', '10-17', '11-14', '12-19'];
    var y = new Date().getFullYear();
    if (y > 2014) {
        return;
    }
    var m = new Date().getMonth() + 1;
    var d = new Date().getDate();
    var md = m + '-' + d;

    for (var i = 0; i < initDate.length; i++) {
        if (md === initDate[i]) {
            $('body').append("<div id='j_infi'><a rel='nofollow' onclick=\"ga('send', 'event', 'pc', 'click', 'infiniti')\" target='_blank' href='http://www.infiniti.com.cn/q50l.html'><img src='/content/common/infi418.jpg'></a><a class='close'>关闭</a></div>");
            break;
        }
    }

    $('#j_infi').on('click', '.close', function() {
        $('#j_infi').hide();
    });

}*/

function indexLazyLoadFooterSlide() {

    $.fn.imagesLoaded = function(callback) {
        var elems = this.find('img'),
            len = elems.length;
        elems.bind('load', function() {
            if (--len <= 0) {
                callback.call(elems, this);
            }
        }).each(function() {
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


    var wrap = $('#j_carouselBar');
    if (!wrap.get(0)) {
        return;
    }

    var indexHandleFooterSlide = function() {
        wrap.imagesLoaded(function() {
            var imgs = wrap.find('img');
            imgs.each(function(k, v) {
                var o = $(this);
                var ow = o.width();
                o.parents('li').width(ow + 10);
            });
            stepcarousel.setup({
                galleryid: 'j_carouselBar', //id of carousel DIV
                beltclass: 'expert-comment-items', //class of inner "belt" DIV containing all the panel DIVs
                panelclass: 'item', //class of panel DIVs each holding content
                autostep: {
                    enable: false,
                    moveby: 1,
                    pause: 3000
                },
                panelbehavior: {
                    speed: 300,
                    wraparound: false,
                    persist: false
                },
                defaultbuttons: {
                    enable: true,
                    moveby: 1
                },
                statusvars: ['statusA', 'statusB', 'statusC'], // Register 3 "status" variables
                contenttype: ['inline'] // content type <--No comma following the very last parameter, always!
            });

        });
        wrap.attr('data-loaded', '1');
    };

    //单元滚动事件
    var unitScroll = function() {
        var top = $(window).scrollTop();
        var topFlag = wrap.offset().top;
        var winHeight = screen.height;
        if (top >= topFlag - winHeight) {
            if (!wrap.attr('data-loaded')) {
                $('#j_carouselBar').find('img').each(function(k, v) {
                    var o = $(this);
                    var osrc = o.data('original');
                    o.attr('src', osrc);
                });
                indexHandleFooterSlide();
                wrap.attr('data-loaded', '1');
            }
        }
    };

    unitScroll();
    $(window).scroll(function() {
        unitScroll();
    });

}



function index3rdAd() {
    $('.expert-comment-wrap').after("<div class='w index3rdAd'><a target='_blank' href='//www.uzai.com/subject/hb#shanghaigongshangju'><img src='/content/common/green.jpg' /></a></div>");
}