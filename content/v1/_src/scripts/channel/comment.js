/*
* @Author: jonas hsiao
* @Date:   2016-07-22 10:43:07
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2017-03-03 17:55:56
*/

'use strict';

$(function() {
    contentSwitch();
    commentPopup();
    uzLazy(['line-list', 'j_commentInfoMod']);
});

// callback  : 图片载入后执行回调函数
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

function contentSwitch() {
    var sdm = $('#j_sideDestMod');
    sdm.on('click', '.btn-switch', function() {
        var oThis = $(this);
        var txt = oThis.find('.btn-cont');
        var arrow = oThis.find('.arrow-mod');
        var op = oThis.parents('.mod-hd');
        var hds = op.siblings('.mod-hd');
        var item = op.next('.mod-bd');

        hds.find('.arrow-mod').removeClass('on');
        hds.find('.btn-cont').text('展开');
        sdm.find('.mod-bd').hide();

        if (arrow.hasClass('on')) {
            arrow.removeClass('on');
            txt.text('展开');
            item.hide();
        } else {
            arrow.addClass('on');
            txt.text('收起');
            item.show();
        }
    });
}

function commentControl(index) {
    var control = $('#j_popupCommentControl');
    var focusPhoto = control.find('.focus-photo').find('img');
    var describe = control.find('.photo-describe');
    var pager = control.find('.pager-info');
    var carousel = $('#j_photoCarousel');
    var photos = carousel.find('.photo-item');
    var photoNum = photos.length;
    var wrap = carousel.parent('.photo-carousel-wrap');
    var _elasticPhoto = function(pic) {
        var ph = pic.height();
        var pw = pic.width();
        var ratio = ph / pw;

        if (ratio < 0.75) { // 容器高宽比例：0.75
            // 使图片垂直居中
            pic.attr('style', 'height: auto; width: 100%; position: absolute; left: 0; top: 50%;');
            pic.css('margin-top', -pic.height() / 2); // 减去当前图片高度的一半
        } else {
            pic.removeAttr('style');
        }
    };
    var _unitPhotoCarousel = function() { // 图片滚动
        var _scrollPosition = function(obj, idx) {
            // Arguments:
            // 1. The method to call
            // 2. The index of the item (note that indexes are 0-based)
            // 3. A flag telling jCarousel jumping to the index without animation
            obj.jcarousel('scroll', idx, false);
        };

        if (carousel.get(0)) {
            carousel
                .on('jcarousel:createend', function() {
                    _scrollPosition($(this), index);
                })
                .on('jcarousel:reloadend', function() {
                    _scrollPosition($(this), index);
                })
                .jcarousel({
                    vertical: true
                });

            wrap.find('.btn-prev')
                .on('jcarouselcontrol:active', function() {
                    $(this).removeClass('btn-off');
                })
                .on('jcarouselcontrol:inactive', function() {
                    $(this).addClass('btn-off');
                })
                .jcarouselControl({
                    target: '-=5'
                });

            wrap.find('.btn-next')
                .on('jcarouselcontrol:active', function() {
                    $(this).removeClass('btn-off');
                })
                .on('jcarouselcontrol:inactive', function() {
                    $(this).addClass('btn-off');
                })
                .jcarouselControl({
                    target: '+=5'
                });
        }
    };

    // 控件初始化
    pager.find('i').text(photoNum);
    _elasticPhoto(focusPhoto);
    _unitPhotoCarousel();

    photos.imagesLoaded(function() {
        photos.each(function() {
            var o = $(this);
            _elasticPhoto(o.find('img'));
        });
    }).on('click', function () { // 点击缩略图
        var o = $(this);
        var oImg = o.find('img');
        var iIndex = o.index();
        var os = o.siblings('.photo-item');
        var sSrc = oImg.attr('src');
        var sAlt = oImg.attr('alt');

        os.removeClass('on');
        o.addClass('on');

        focusPhoto.attr('src', sSrc);
        _elasticPhoto(focusPhoto);
        describe.text(sAlt).attr('title', sAlt);
        pager.find('em').text(iIndex + 1);
    });
}

function commentPopup() {
    var infoMod = $('#j_commentInfoMod');
    var commentCont = infoMod.find('.comment-cont');
    var picItems = commentCont.find('.pic-list').find('.list-item');
    var itemsLen = picItems.length;
    var popup = $('#j_popupCommentControl');
    var focusPhoto, describe, pager, photo;
    var _initPopupNode = function() {
        var contText = commentCont.find('.cont-text').text();
        var sNode = '';
        var photoNode = '';

        if (!popup.get(0)) {
            sNode =
            '<div class="popup-comment-control hide" id="j_popupCommentControl">' +
                '<span class="popup-close j_popupClose j_popClose"><i class="close-icon">&times;</i></span>' +
                '<div class="control-gallery clearfix">' +
                    '<div class="gallery-main">' +
                        '<p class="focus-photo tc"><img src="" alt=""></p>' +
                        '<div class="info-bar f14 clearfix">' +
                            '<span class="pager-info f999 fr"><em class="f666"></em>／<i></i></span>' +
                            '<div class="info-main">' +
                                '<p class="photo-describe ellipsis" title=""></p>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="photo-carousel-wrap">' +
                        '<p class="btn-item btn-prev"><span class="arrow-mod songti"><em>◆</em><i>◆</i></span></p>' +
                        '<div class="photo-carousel" id="j_photoCarousel">' +
                            '<ul class="photo-list tc">' +
                            '</ul>' +
                        '</div>' +
                        '<p class="btn-item btn-next"><span class="arrow-mod songti"><em>◆</em><i>◆</i></span></p>' +
                    '</div>' +
                '</div>' +
                '<div class="comment-cont f666 f14 mt10"></div>' +
            '</div>';

            $('body').append(sNode);
            popup = $('#j_popupCommentControl');

            picItems.each(function() {
                var oThis = $(this);
                var descr = oThis.attr('data-sub-html');
                var sSrc = oThis.find('img').attr('data-original');

                photoNode +=
                '<li class="photo-item">' +
                    '<img src="' + sSrc + '" alt="' + descr + '">' +
                '</li>';
            });

            popup.find('.photo-list').html(photoNode);
            popup.find('.comment-cont').text(contText);
        }
    };

    _initPopupNode();

    focusPhoto = popup.find('.focus-photo').find('img');
    describe = popup.find('.photo-describe');
    pager = popup.find('.pager-info');
    photo = popup.find('.photo-list').children('.photo-item');

    picItems.find('img').on('click', function() { // 点击页面上点评图片
        var oThis = $(this);
        var op = oThis.parents('.list-item');
        var iIndex = op.index();
        var picDescr = op.attr('data-sub-html');
        var bigPic = op.attr('data-src');

        focusPhoto.attr('src', bigPic);
        describe.text(picDescr).attr('title', picDescr);
        pager.find('em').text(iIndex + 1);
        photo.eq(iIndex).addClass('on').siblings('.photo-item').removeClass('on');
        _uzw.ui.pop('j_popupCommentControl', '.popup-comment-control');
        commentControl(iIndex);
    });
}