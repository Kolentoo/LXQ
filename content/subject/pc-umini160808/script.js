/*
* @Author: jonas hsiao
* @Date:   2016-08-08 15:24:36
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-08-10 17:10:52
*/

'use strict';

$(function() {
    uzLazy(['j_carouselBar', 'j_lineTab', 'index-mod', 'j_noremInfos']);
    _uzw.ui.tab('j_lineTab', function(index, obj) {
        imgLazyload(obj.find('.bd').children('.item').eq(index));
    });
    topCarousel();
    normNav();
    contentSwitch();
});

function imgLazyload(obj) {
    var img = obj.find('img[data-original]');
    if (img.length) {
        img.each(function () {
            var oThis = $(this);
            var sSrc = oThis.attr('data-original');
            if (sSrc !== oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
}

function topCarousel() {
    var otc = $('#j_topCarousel');
    var ocb = $('#j_carouselBar');
    var cbItems = ocb.find('.norm-list').find('.list-item');

    if (otc.get(0)) {
        stepcarousel.setup({
            galleryid: 'j_carouselBar', //id of carousel DIV
            beltclass: 'norm-list', //class of inner "belt" DIV containing all the panel DIVs
            panelclass: 'list-item', //class of panel DIVs each holding content
            autostep: {
                enable: false,
                moveby: 1,
                pause: 3000
            },
            panelbehavior: {
                speed: 300,
                wraparound: true,
                persist: false
            },
            defaultbuttons: {
                enable: true,
                moveby: 4
            },
            statusvars: ['statusA', 'statusB', 'statusC'], // Register 3 "status" variables
            contenttype: ['inline'] // content type <--No comma following the very last parameter, always!
        });
        ocb.on('click', '.btn-item', function() {
            var oThis = $(this);
            var normList = oThis.parents('.carousel-bar').find('.norm-list');
            imgLazyload(normList);
        });
        otc.find('.norm-items').find('.norm-item').on('click', function() {
            var oThis = $(this);
            var index = oThis.index();

            oThis.addClass('on').siblings().removeClass('on');
            cbItems.removeClass('on').eq(index).addClass('on');
            stepcarousel.stepTo('j_carouselBar', index + 1);
            imgLazyload(cbItems);
        });
        gHoverEvent(cbItems);
    }
}

function normNav() {
    var box = $('#j_noremInfos');
    var items = box.find('.norem-list').find('.list-item');

    box.find('.norm-items').find('.norm-item').on('click',function(){
        var o = $(this);
        var oindex = o.index();
        var skipNode = items.eq(oindex);
        var oot = skipNode.offset().top;

        o.addClass('on').siblings().removeClass('on');
        skipNode.addClass('on').siblings().removeClass('on');
        $('body,html').animate({ scrollTop: oot - 150 }, 800);
    });
    gHoverEvent(items);
}

function contentSwitch() {
    $('#j_noremInfos').find('.norem-list').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oArr = oThis.find('.arrow-mod');
        var os = oThis.siblings('.hide-cont');
        var op = oThis.parents('.list-item');

        if (oArr.hasClass('on')) {
            oArr.removeClass('on');
            op.removeClass('item-on');
            os.hide();
        } else {
            oArr.addClass('on');
            op.addClass('item-on');
            os.show();
        }
    });
}