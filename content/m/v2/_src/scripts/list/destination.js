/*
* @Author: jonas hsiao
* @Date:   2016-09-05 16:51:31
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-09-09 13:57:06
*/

'use strict';

$(function() {
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/unveil.js', function () {
        window.unveil.init('j_destTab');
    });
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        window.tab.init('j_destTab', function (index, obj) {
            var item = obj.find('.bd').children('.item').eq(index);
            imgLazyload(item);
        });
    });
    contentSwitch();
});

function imgLazyload(obj) {
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
}

function contentSwitch() {
    var destTab = $('#j_destTab');
    destTab.find('.btn-switch').on('click', function() {
        var oThis = $(this);
        var items = oThis.parents('.more-bar').siblings('.items-list');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on').text('更多');
            items.addClass('cut-box');
        } else {
            oThis.addClass('on').text('收起');
            items.removeClass('cut-box');
        }
    });
}