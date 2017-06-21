
/*
* elasticPicture
* versions: 1.0
* @Author: jonas hsiao
* @Date:   2015-12-31 15:26:16
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2017-03-20 16:47:00
*/

;(function ($) {
    var realWidth;
    var realHeight;
    var setCutSize = function(objW, objH, w, h, para) {
        var ratio = objW / objH;
        var enlarge = ('enlarge' in para) ? para.enlarge : true;
        if (ratio > w / h) { // 如果高度相等，图片宽度大于父容器宽度；如果宽度相等，图片高度小于父容器高度
            var adjH = (h > objH) ? enlarge ? h : objH : h;
            $(this).css({
                'height': Math.round(adjH),
                'width': Math.round(adjH * ratio),
                'left': Math.floor((w - adjH * ratio) / 2),
                'top': Math.floor((h - adjH) / 2)
            });
        } else {
            var adjW = (w > objW) ? enlarge ? w : objW : w;
            $(this).css({
                'width': Math.round(adjW),
                'height': Math.round(adjW / ratio),
                'top': Math.floor((h - w / ratio) * 0.618),
                'left': Math.floor((w - adjW) / 2)
            });
        }
        if ($(this).css('position') == 'static') {
            $(this).css('position', 'relative');
        }
    };
    var setFitSize = function(objW, objH, w, h, para) {
        var ratio = objW / objH;
        var enlarge = ('enlarge' in para) ? para.enlarge : true;
        if (ratio > w / h) { // 如果高度相等，图片宽度大于父容器宽度；如果宽度相等，图片高度小于父容器高度
            var adjW = (w > objW) ? enlarge ? w : objW : w;
            $(this).css({
                'width': Math.round(adjW),
                'height': Math.round(adjW / ratio),
                'left': (adjW == objW && !enlarge) ? Math.floor((w - adjW) / 2) : 0,
                'top': Math.floor((h - adjW / ratio) / 2)
            });
        } else {
            var adjH = (h > objH) ? enlarge ? h : objH : h;
            $(this).css({
                'height': Math.round(adjH),
                'width': Math.round(adjH * ratio),
                'left': Math.floor((w - adjH * ratio) / 2),
                'top': (adjH == objH && !enlarge) ? Math.floor((h - adjH) / 2) : 0
            });
        }
        if ($(this).css('position') == 'static') {
            $(this).css('position', 'relative');
        }
    };
    var doAfter = function (after) {
        $(this).unbind('.cutFit');
        switch (typeof after) {
            case 'object':
                $(this).css(after);
                break;
            case 'function':
                after.call(this);
                break;
        }
    };
    jQuery.fn.extend({
        cutImage: function(PARA, AFTER) {
            var para = PARA || {};
            para.method = 'cut';
            this.cutFit(para, AFTER);
            return this;
        },
        fitImage: function(PARA, AFTER) {
            var para = PARA || {};
            para.method = 'fit';
            this.cutFit(para, AFTER);
            return this;
        },
        cutFit: function(PARA, AFTER) {
            if (this.length === 0)
                return this;
            var _m = (PARA && 'method' in PARA) ? PARA.method.toLowerCase() : 'cut';
            var method;
            switch (_m) {
                case 'fit':
                    method = setFitSize;
                    break;
                case 'cut':
                    method = setCutSize;
                    break;
                default:
                    return this;
            }
            var ratio = false;
            var w = (PARA) ? PARA.width || $(this).parent().outerWidth() : $(this).parent().outerWidth();
            var h = (PARA) ? PARA.height || $(this).parent().outerHeight() : $(this).parent().outerHeight();
            if (!this[0].height || !this[0].width) {
                var img_loaded = false;
                $(this).bind('load.cutFit', function() {
                    img_loaded = true;

                    var this_width, realWidth, this_height, realHeight;
                    this_width = realWidth = $(this).width();
                    this_height = realHeight = $(this).height();

                    method.call(this, this_width, this_height, w, h, PARA || {});
                    doAfter.call(this, AFTER);
                    return this;
                });
                if (img_loaded === false && this[0].complete) {

                    var this_width, realWidth, this_height, realHeight;
                    this_width = realWidth = this.width();
                    this_height = realHeight = this.height();

                    method.call(this, this_width, this_height, w, h, PARA || {});
                    doAfter.call(this, AFTER);
                    return this;
                }
            } else {
                $(this).each(function() {
                    realWidth = PARA ? PARA.realWidth || realWidth : realWidth;
                    realHeight = PARA ? PARA.realHeight || realHeight : realHeight;
                    method.call(this, ('naturalWidth' in this) ? this.naturalWidth : realWidth || this.width, ('naturalHeight' in this) ? this.naturalHeight : realHeight || this.height, w, h, PARA || {});
                    doAfter.call(this, AFTER);
                });
                return this;
            }
        }
    });
})(jQuery);