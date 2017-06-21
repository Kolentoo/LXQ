/*
* @Author: jonas hsiao
* @Date:   2016-06-22 14:29:32
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-06-23 09:43:42
*/

'use strict';

$(function() {
    uzLazy(['j_topGallery', 'main-mod']);
    axGallery();
    modSlides();
    gHoverEvent($('#j_topGallery').find('.list-item'));
    gHoverEvent($('.gallery-items').find('.gallery-item'));
    gHoverEvent($('.pic-items').find('.pic-item'));
});

function axGallery() {
    var items = $('#j_topGallery').find('.gallery-list').find('.list-item');
    var iLen = items.length;
    var i = 0;
    var picItems = $('#j_azPicItems').find('.pic-item');
    var piLen = picItems.length;
    var j = 0;

    setInterval(function() {
        if (i >= iLen) {
            i = 0;
        }
        items.removeClass('on').eq(i).addClass('on');
        i++;

        j = parseInt(Math.random() * piLen, 10);
        picItems.removeClass('on').eq(j).addClass('on');
    }, 2000);
}

function modSlides() {
    var ms = $('#j_modSlides');
    ms.find('.list-item').on('mouseenter', function() {
        var oThis = $(this);
        var big = oThis.find('img').attr('data-big');
        var hd = oThis.find('.item-hd').text();
        var bd = oThis.find('.item-bd').text();
        var main = ms.find('.pic-main');

        ms.find('.list-item').removeClass('on');
        oThis.addClass('on');
        main.find('img').attr('src', big);
        main.find('.cont-hd').text(hd);
        main.find('.cont-bd').text(bd);
    });
}