$(function () {
    uzLazy(['line-pic']);
    listSlide();
    initPager();
    listTips();
    contentSwitch();
});

function listSlide() {
    var oBS = $('#j_bannerSlides');
    if (oBS.get(0)) {
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
            var opa = o.siblings('.pagination');

            if (opa.get(0)) {
                opa.find('li').on('mouseenter', function () {
                    var oo = $(this);
                    oo.find('a').click();
                });
            }

        });
    }
}

function initPager() {
    var pager = $('#j_fnPager');
    var pageSize = parseInt(pager.attr('data-pagesize'), 10);
    var pageItems = parseInt(pager.attr('data-counts'), 10);
    if (pager.get(0)) {
        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems,//列表条数
            targetNode: pager.siblings('.pager-target-node'),
            onInit: function () {
            },
            onCallback: function (currentPage, allPage) {
                skipFilterPosition();
            }
        });
    }
}

function skipFilterPosition() {
    var o = $('#j_sizerMod');
    var otop = o.offset().top;
    $('body,html').animate({ scrollTop: otop }, 500);
}

function listTips() {
    var sortLine = $('#j_sortLine');

    sortLine.find('.favorable-bar').on('mouseenter', '.bar-side', function() {
        var oThis = $(this);
        oThis.find('.popup-info').show();
    }).on('mouseleave', '.bar-side', function() {
        var oThis = $(this);
        oThis.find('.popup-info').hide();
    });
}

function contentSwitch() {
    var sizerMod = $('#j_sizerMod');

    sizerMod.find('.choice-items').each(function () {
        var oThis = $(this);
        if (oThis.height() > 38 && !oThis.hasClass('items-cut')) {
            oThis.addClass('items-cut');
            oThis.before('<span class="btn-switch fr"><em class="vm">展开</em><i class="border-arrow ml5 vm">&nbsp;</i></span>');
        }
    });

    sizerMod.find('.choice-section').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var choiceItems = oThis.siblings('.choice-items');

        if (oThis.hasClass('switch-on')) {
            oThis.removeClass('switch-on').find('em').text('展开');
            choiceItems.addClass('items-cut');
        } else {
            oThis.addClass('switch-on').find('em').text('收起');
            choiceItems.removeClass('items-cut');
        }
    });
}