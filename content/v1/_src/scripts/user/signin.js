/*
* @Author: lxq
* @Date:   2015-12-31 13:16:12
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-04-13 13:13:44
*/

'use strict';

try {
    document.domain = 'uzai.com';
} catch (e) {

}

$(function () {
    bannerSlider();
    _uzw.ui.tab('j_tab');
    signinPager();
    signinEnter();
    arrowTips();
});


function bannerSlider() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
        oBS.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: true,
            pause: 1000,
            play: 6000,
            generatePagination: true
        });
        oBS.find('.slides_control').css({
            'width': '100%'
        });
    }
}

function signinPager() {
    var pagers = $('.fn-pager');

    pagers.each(function () {
        var pager = $(this);
        var pageSize = parseInt(pager.attr('data-pagesize'), 10);
        var pageItems = parseInt(pager.attr('data-counts'), 10);

        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems,//列表条数
            targetNode: pager.siblings('.pager-target-node'),
            onInit: function () {
                //console.log('pager 初始化完成');
            },
            onCallback: function (currentPage, allPage) {
                //分页事件 ajax or dom handle
                //console.log(currentPage);
                //console.log(allPage);
            }
        });
    });
}


function signinEnter(){
    var sj = $('.newCity-phone').find('.icon-common-top');
    sj.after('<a class="signin-enter" href="">'+'签到有惊喜'+'</a>');
}


function arrowTips(){
    var ec = $('#j_exchange');
    var tips = ec.find('.p5').find('.s3');
    tips.on('mouseenter', function () {
        var o = $(this);
        o.parents('.p5').next().show();
    });
    tips.on('mouseout', function () {
        var o = $(this);
        o.parents('.p5').next().hide();
    });
}

