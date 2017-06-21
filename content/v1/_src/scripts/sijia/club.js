$(function () {
    clubSlide();
    clubTab('j_activityMain');
});

function clubSlide() {
    var oBS = $('#j_bannerSlides');
    oBS.slides({
        preload: true,
        preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
        currentClass: 'on',
        fadeSpeed: 300,
        effect: 'fade',
        crossfade: true,
        hoverPause: false,
        pause: 1000,
        play: 6000,
        generatePagination: true
    });
    oBS.find('.slides_control').css({ 'width': '100%' });

    $('.slides_container').each(function () {
        var o = $(this);
        var opa = o.next('.pagination');

        if (opa.get(0)) {
            opa.find('li').on('mouseenter', function () {
                var oo = $(this);
                oo.find('a').click();
            });
        }

    });
}

function clubTab(obj){
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    o.find('.bd').find('.item').eq(0).show();
    o.find('.hd').on('click','li',function () {
        var oThis = $(this);
        var oIndex = oThis.index();
        oThis.addClass('on').siblings().removeClass('on');
        oThis.parents('.hd').next('.bd').find('.item').hide().eq(oIndex).show();
    });
}