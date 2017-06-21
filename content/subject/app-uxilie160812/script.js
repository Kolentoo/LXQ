/*
* @Author: jonas hsiao
* @Date:   2016-08-12 10:52:42
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-08-16 11:01:37
*/

var myexports = {};

_util.file.load(_uzm.domain.cdnRandom() + '/content/libs/plugin/swiper/swiper-3.3.1.min.js', function () {
    var mySwiper = new Swiper('#j_swiperContainer',{
        slidesPerView: 'auto'
        // loop: true
    });
});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/unveil.js', function () {
    unveil.init('u-list');
    unveil.init('j_swiperContainer');
    unveil.init('j_lineTab');
});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
    tab.init('j_lineTab', function (index, obj) {
        var item = obj.find('.bd').children('.item').eq(index);
        myexports.imgLazyload(item);
    });
});

myexports.init = function () {
    $('#j_swiperContainer').find('.swiper-slide').on('click', function() {
        var oThis = $(this);
        var index = oThis.index();
        myexports.popMod($('#j_popinfoMod' + (index + 1)));
    });
};

myexports.imgLazyload = function (obj) {
    var img = obj.find('img[data-src]');
    if (img.length) {
        img.each(function () {
            var oThis = $(this);
            var sSrc = oThis.attr('data-src');
            if (sSrc !== oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
};

myexports.popMod = function (obj, cb) {
    cb && cb(obj);
    _uzm.mask.show();
    obj.addClass('pop-mod-on').on('click', '.j_popClose', function () {
        _uzm.mask.hide();
        obj.removeClass('pop-mod-on');
    });
};

$(function() {
    myexports.init();
});