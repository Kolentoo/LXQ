/*
 * @Author: lxq
 * @Date:   2016-02-01 13:18:36
 * @Last Modified by:   jonas hsiao
 * @Last Modified time: 2016-07-06 10:25:44
 */

"use strict";

$(function() {
    consultation();
    jfranking();
    hySlider();
    hybanner();
    hyadjustment();
    clubTab();
    clubPop();
    uzLazy(['oration-con', 'leaguer', 'integral-pro']);

    hynav();
    jfproduct();
    jfpager();
    unitTiny($('.chart-show').find('.album-carousel'));
    jfnumber($('.j_gtNumControl'));
    // clubarrow();
    prochoose();
    jfpic();
    typic();
    var sw = window.screen.width;
    if (sw <= 1156) {
        hyroute();
    } else {
        hyroute();
    }
});

function jfranking() {
    var rank = $('#j_ranking');
    var rl = rank.find('.rank-list');
    rl.on('mouseenter', function() {
        var t = $(this);
        t.addClass('rank-list-on').siblings().removeClass('rank-list-on');
    });
}

function imgLazyload(obj) {
    var img = obj.find('img[data-original]');
    if (img.length) {
        img.each(function() {
            var oThis = $(this);
            var sSrc = oThis.attr('data-original');
            if (sSrc != oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
}

function clubTab() {
    $('.j_tab').find('.next').on('click', function() { // 处理延迟加载图片
        var oThis = $(this),
            item = oThis.parents('.j_tab').find('.bd').children('.item').eq(0);
        imgLazyload(item);
    });
    _uzw.ui.tab('j_tab', function(idx, obj) {
        var item = obj.find('.bd').children('.item').eq(idx);
        imgLazyload(item);
    });
}

function clubPop() {
    var pcg = $('#j_popCommentGallery');
    $('#j_memberMien').find('.leaguer-route').on('click', '.leaguer-pro', function() {
        var oThis = $(this);
        var oId = oThis.attr('data-id');

        pcg.addClass('pop-gallery-on').on('click', '.j_popClose', function() { // 关闭弹框
            pcg.removeClass('pop-gallery-on');
        });

        $.ajax({
            type: 'GET',
            url: '/MemberClub/GetContentByID/' + oId,
            dataType: 'json',
            success: function(data) {
                if (data) {
                    var dLen = data.length;
                    var piHtml = '';
                    if (dLen) {
                        for (var i = 0; i < dLen; i++) {
                            var item = data[i];
                            piHtml += '<li class="pic-item"><span class="pic-wrap"><img data-src="" src="//r.uzaicdn.com/content/m/images/common/gray.gif" data-original="' + item.ImageUrl + '" alt=""></span></li>';
                        }
                        pcg.find('.overview').append(piHtml);
                        pcg.find('.photo-viewer').find('img').attr('src', data[0].ImageUrl.replace('/h/170', '/h/700'));
                        clubCommentGallery();
                    }
                }
            },
            error: function() {
                // var data = '[{"ImageUrl": "http://r06.uzaicdn.com/memberfile/20160301104600654.jpg?imageView2/2/h/170/format/jpg","ImageDescribe": "日本迪斯尼安心6日"}]';
                // var data = JSON.parse(data);
                // if (data) {
                //     var dLen = data.length;
                //     var piHtml = '';
                //     for (var i = 0; i < dLen; i++) {
                //         var item = data[i];
                //         piHtml += '<li class="pic-item"><span class="pic-wrap"><img data-src="" src="//r.uzaicdn.com/content/m/images/common/gray.gif" data-original="' + item.ImageUrl +
                //             '" alt=""></span></li>';
                //     }
                //     pcg.find('.overview').append(piHtml);
                //     pcg.find('.photo-viewer').find('img').attr('src', data[0].ImageUrl.replace('/h/170', '/h/700'));
                //     clubCommentGallery();
                // }
            }
        });
    });
}

function clubCommentGallery() {
    var cg = $('#j_popCommentGallery');
    if (cg.get(0)) {
        var thumb = cg.find('.thumbnails');
        var tCarousel = thumb.find('.thumbnails-carousel');
        var liLen = thumb.find('.pic-item').length;
        var pv = cg.find('.photo-viewer');
        var pvImg = pv.find('img');
        var pp = cg.find('.photo-prev');
        var pn = cg.find('.photo-next');
        var resizeLock = false;
        var db = document.body;
        var oCarousel = null;
        var _unitCarousel = function() {
            tCarousel.addClass('carousel-on').tinycarousel({
                axis: 'x',
                infinite: false
            }).find('.pic-item').eq(0).addClass('on');

            !pp.hasClass('hide') && pp.addClass('hide');
            pn.hasClass('hide') && pn.removeClass('hide');

            tCarousel.find('.mirrored').remove();
            // 处理延迟加载图片
            tCarousel.find('.next').on('click', function() {
                var oThis = $(this),
                    imgs = oThis.siblings('.viewport').find('img[data-original]');
                imgs.each(function() {
                    var ot = $(this),
                        oUrl = ot.attr('data-original');
                    if (ot.attr('src') != oUrl) {
                        ot.attr('src', oUrl);
                    }
                });
            });

            oCarousel = tCarousel.data('plugin_tinycarousel');
        };

        if (_util.check.isIE6) {
            var cgw = cg.width();
            var cgh = cg.height();
            pv.width(cgw - 40);
            pv.height(cgh - 40);
        }

        liLen === 1 && pn.hide();

        pv.find('img').fitImage({
            'enlarge': false
        }, function() {
            $(this).fadeIn(100);
            pv.hasClass('loading') && pv.removeClass('loading');
        });

        // 缩略图
        thumb.on('click', '.pic-item', function() {
            var o = $(this);
            var oImg = o.find('img');
            var opic = oImg.attr('src');
            var os = o.siblings('.pic-item');
            var iIndex = o.index();
            var ohit = oImg.attr('data-hit');
            var oid = oImg.attr('data-id');

            os.removeClass('on');
            o.addClass('on');

            pv.addClass('loading').empty().append('<img src="' + opic.replace('/h/170', '/h/700') + '" alt="">').imagesLoaded(function() {
                var oThis = $(this);
                oThis.width();
                oThis.fitImage({
                    'enlarge': false,
                    'realHeight': oThis.height(),
                    'realWidth': oThis.width()
                }, function() {
                    $(this).fadeIn(100);
                    pv.hasClass('loading') && pv.removeClass('loading');
                });
            });

            // 处理按钮
            if (iIndex <= 0) {
                pp.addClass('hide');
                pn.hasClass('hide') && pn.removeClass('hide');
            } else if (iIndex >= liLen - 1) {
                pn.addClass('hide');
                pp.hasClass('hide') && pp.removeClass('hide');
            } else {
                pn.hasClass('hide') && pn.removeClass('hide');
                pp.hasClass('hide') && pp.removeClass('hide');
            }
        }).on('mouseenter', function() {
            var oThis = $(this);
            if (!oThis.hasClass('thumbnails-on')) {
                oThis.addClass('thumbnails-on');
            }
        }).on('mouseleave', function() {
            var oThis = $(this);
            oThis.removeClass('thumbnails-on');
        }).find('img').each(function() {
            var oThis = $(this);
            if (oThis.width() > 90) {
                oThis.cutImage({
                    'enlarge': false
                });
            }
        });

        cg.on('click', '.j_popClose', function() { // 关闭弹框清除数据
            cg.find('.overview').empty();
            cg.find('.photo-viewer').addClass('loading').find('img').attr({
                'src': '',
                'style': ''
            });
        }).find('.btn-photo').on('click', function() { // 上下图片按钮
            var oThis = $(this);
            var liOn = thumb.find('li.on');
            var onIndex = liOn.index();

            if (oThis.hasClass('photo-prev') && onIndex) {
                liOn.prev('.pic-item').trigger('click');
                onIndex === 1 && oThis.addClass('hide');
                pn.hasClass('hide') && pn.removeClass('hide');
            } else if (oThis.hasClass('photo-next') && onIndex < liLen - 1) {
                liOn.next('.pic-item').trigger('click');
                onIndex === liLen - 2 && oThis.addClass('hide');
                pp.hasClass('hide') && pp.removeClass('hide');
            }
        });

        $(window).on('resize', function() { // reset image size when window resizes
            clearTimeout(resizeLock);
            resizeLock = setTimeout(function() {
                var fiData = {};
                if (_util.check.isIE6) {
                    fiData = {
                        'enlarge': false,
                        'height': db.offsetHeight - 40,
                        'width': db.offsetWidth - 380
                    };
                } else {
                    fiData = {
                        'enlarge': false
                    };
                }
                pv.find('img').fitImage(fiData);

                tCarousel.find('.mirrored').remove();
                oCarousel && oCarousel.move(0);
            }, 50);
        });

        uzLazy('j_popCommentGallery');
        _unitCarousel();
    }
}

function consultation() {
    var pagers = $('.fn-pager');

    pagers.each(function() {
        var pager = $(this);
        var pageSize = parseInt(pager.attr('data-pagesize'), 10);
        var pageItems = parseInt(pager.attr('data-counts'), 10);

        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems, //列表条数
            targetNode: pager.siblings('.pager-target-node'),
            onInit: function() {},
            onCallback: function(currentPage, allPage) {}
        });
    });
}

function hySlider() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        var siLen = oBS.find('.slide-item').length;
        if (siLen > 1) {
            oBS.slides({
                currentClass: 'on',
                fadeSpeed: 300,
                effect: 'fade',
                crossfade: true,
                hoverPause: true,
                pause: 1000,
                play: 6000,
                generatePagination: true,
                generateNextPrev: false
            });
        }
    }
}

function hybanner() {
    var sw = window.screen.width;
    var leaguer = $('#j_leaguer');
    var bs = leaguer.find('.banner-sides');
    var si = leaguer.find('.slide-item');
    if (sw <= 1367) {
        // bs.addClass('banner-sides-s');
        // si.addClass('slide-item-s');
    }
}

function hyroute() {
    var item = $('.j_tab').find('.bd').children('.item:visible');
    var lt = item.find('.leaguer-type1');
    var lb3LT = $('.leaguer-box3').find('.leaguer-type1');
    var _unitCarousel = function(obj, item) {
        if (obj.get(0)) {
            var ltLen = item.length;
            if (ltLen > 3) {
                obj.tinycarousel({
                    axis: 'x',
                    infinite: false,
                    buttons: true
                });
            }
        }
    };

    if (lt.get(0)) {
        lt.each(function() {
            var oThis = $(this);
            var ltItem = oThis.find('.pro-cup');
            // ltItem = ltItem.get(0) ? ltItem : oThis.find('.leaguer-pro');

            if (ltItem.get(0)) {
                oThis.tinycarousel({
                    axis: 'x',
                    infinite: false,
                    buttons: true
                });
            } else {
                _unitCarousel(oThis, oThis.find('.leaguer-pro'));
            }
        });
    }

    _unitCarousel(lb3LT, lb3LT.find('.leaguer-pro'));

    _uzw.ui.tab('j_tab', function(idx, obj) {
        var oItem = obj.find('.item').eq(idx).find('.leaguer-type1');
        if (oItem.get(0)) {
            oItem.tinycarousel({
                axis: 'x',
                infinite: false
            });
        }
    });
}

function hyadjustment() {
    var sw = screen.width;
    var leaguer = $('#j_leaguer');
    var lp = leaguer.find('.leaguer-pro');
    var pc = leaguer.find('.pro-cup');
    var vp = leaguer.find('.viewport');
    if (sw <= 1156) {
        lp.addClass('leaguer-pro-s').removeClass('leaguer-pro-b');
        pc.addClass('pro-cup-s').removeClass('pro-cup-b');
        vp.addClass('viewport-s');
    }
}

// 图片已加载
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

function hynav() {
    var pt = $('#j_presentType');
    var pl = pt.find('.present-list');
    pl.on('mouseenter', function() {
        var t = $(this);
        t.find('.type-detail').show();
        t.addClass('present-list-on');
        t.find('.list').addClass('list-on');
    });
    pl.on('mouseleave', function() {
        var t = $(this);
        t.find('.type-detail').hide();
        t.removeClass('present-list-on');
        t.find('.list').removeClass('list-on');
    });
}

function jfproduct() {
    var sw = screen.width;
    var jc = $('#j_integralCon');
    var pl = jc.find('.pro-list');
    var dc = $('#j_detailCon');
    var cs = dc.find('.chart-show');
    var vp = dc.find('.viewport');
    var pd = dc.find('.pic-detail');
    var prev = dc.find('.prev');
    var next = dc.find('.next');
    var pi = dc.find('.pro-infor');
    if (sw <= 1156) {
        // pl.addClass('pro-list-s');
        cs.addClass('chart-show-s');
        vp.addClass('viewport-s');
        pd.addClass('pic-detail-s');
        prev.addClass('prev-s');
        next.addClass('next-s');
        pi.addClass('pro-infor-s');
    }
}

function jfpager() {
    var pagers = $('.fn-pager');

    pagers.each(function() {
        var pager = $(this);
        var pageSize = parseInt(pager.attr('data-pagesize'), 10);
        var pageItems = parseInt(pager.attr('data-counts'), 10);

        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems, //列表条数
            targetNode: pager.siblings('.pager-target-node'),
            onInit: function() {},
            onCallback: function(currentPage, allPage) {}
        });
    });
}

function unitTiny(obj) {
    if (obj.get(0)) {
        obj.tinycarousel({
            axis: 'x',
            infinite: false,
            bullets: true,
            buttons: true
        });
    }
}

function jfnumber(obj) {
    if (obj.get(0)) {
        obj.find('a').on('click', function() {
            var o = $(this);
            var t = o.siblings('input');
            var v = parseInt(t.val(), 10);
            if (o.hasClass('btn-up')) {
                //加操作
                if (v <= 9998) {
                    t.val(v + 1);
                }
            } else if (o.hasClass('btn-down')) {
                //减操作
                if (v >= 1) {
                    t.val(v - 1);
                }
            }

            return false;
        });
    }
}

function clubarrow() {
    var leaguer = $('#j_leaguer');
    var lw = leaguer.find('.leaguer-wrap');
    var btns = lw.find('.buttons');
    lw.on('mouseenter', function() {
        $(this).find('.buttons').show();
    });
    lw.on('mouseleave', function() {
        $(this).find('.buttons').hide();
    });
}

function prochoose() {
    var ct = $('#j_chooseType');
    var tc = ct.find('.ct1').find('.type-detail').find('.type-color');
    tc.on('click', function() {
        var oThis = $(this);
        if (oThis.hasClass('type-color-on')) {
            oThis.removeClass('type-color-on');
        } else {
            oThis.addClass('type-color-on');
        }
        oThis.parent().siblings().children().removeClass('type-color-on');
        var details = $("#j_chooseType .item");
        var attrArr = "";
        for (var i = 0; i < details.length; i++) {
            if ($(details[i]).find('.type-color-on').length == 1) {
                attrArr += $(details[i]).find('.title').text() + '=' + $(details[i]).find('.type-color-on .value').text() + ",";
            }
        }
        $.ajax({
            url: "/mall/getstock",
            data: {
                productId: $('#productId').val(),
                attributes: attrArr
            },
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data && parseInt(data.Code, 10) === 0) {
                    $("#stock").html(data.Stock);
                }
            }
        });
    });
}

function jfpic() {
    var wrap = $('.chart-show');
    wrap.find('.overview').find('li').on('click', function() {
        var o = $(this);
        var opic = o.find('img').attr('data-src');
        var os = o.siblings('li');
        var oCM = wrap.find('.img-box');
        os.removeClass('on');
        o.addClass('on');
        oCM.children('img').attr('src', opic);
    });
}

function typic() {
    var lw = $('.leaguer-wrap');
    lw.find('.next').on('click', function() {
        var oThis = $(this),
            imgs = oThis.siblings('.viewport').find('img[data-original]');
        imgs.each(function() {
            var ot = $(this),
                oUrl = ot.attr('data-original');
            if (ot.attr('src') != oUrl) {
                ot.attr('src', oUrl);
            }
        });
    });
}
