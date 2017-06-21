/*
* @Author: jonas hsiao
* @Date:   2016-09-01 14:17:27
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-09-14 13:26:45
*/

'use strict';

$(function() {
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/unveil.js', function () {
        window.unveil.init('line-items');
    });
    listSwiper();
    listSizer();
    listSidebar();
    listSearch();
    unitFixed();
    contentSwitch();
});

function listSwiper() {
    var wrap = $('#j_swiperContainer');
    if (wrap.get(0)) {
        _util.file.load(_uzm.domain.cdnRandom() + '/content/libs/plugin/swiper/swiper-3.3.1.min.js', function () {
            wrap.swiper({
                pagination: '.pagination',
                paginationClickable: true,
                slidesPerView: 'auto',
                loop: true
            });
        });
    }
}

function listSearch() {
    var topSearch = $('#j_topSearch');
    var history = topSearch.find('.search-history');

    topSearch.find('.search-bar').find('input[type=search]').focus();

    history.on('click', '.btn-empty', function() {
        var oThis = $(this);
        oThis.parent('.history-hd').siblings('.history-bd').remove();
        history.hide();
    });
}

function listSizer() {
    var sizerBar = $('#j_sizerBar');
    var sizerList = sizerBar.find('.bar-list');
    var sizerItems = sizerBar.find('.sizer-items');
    var sizerBox = $('#j_sizerBox');

    sizerList.children('.list-item').on('click', function() {
        var oThis = $(this);
        var menuWrap = oThis.siblings('.menu-wrap');

        if (!oThis.hasClass('menu-wrap') && menuWrap.hasClass('on')) { // 点击非分类选项时，还原分类状态
            menuWrap.removeClass('on');
            _uzm.mask.hide();
            sizerBar.removeClass('sizer-bar-on');
        }
    });

    sizerList.find('.menu-wrap').find('.menu-hd').on('click', function() { // 分类
        var oThis = $(this);
        var op = oThis.parents('.menu-wrap');
        var zidx = sizerBar.css('z-index');

        op.siblings().removeClass('on');

        if (op.hasClass('on')) {
            op.removeClass('on');
            _uzm.mask.hide();
            sizerBar.removeClass('sizer-bar-on');
        } else {
            op.addClass('on');
            _uzm.mask.show(function() {
                $('.fn-mask').on('click', function() { // 点击遮罩层隐藏分类
                    op.removeClass('on');
                    _uzm.mask.hide(function() {
                        $('.fn-mask').off('click');
                    });
                    sizerBar.removeClass('sizer-bar-on');
                });
            });
            sizerBar.addClass('sizer-bar-on');
        }
    });

    sizerList.find('.sort-item').on('click', function() { // 排序
        var oThis = $(this);
        var sort = oThis.find('.item-txt');
        var dataType = sort.attr('data-sort');

        oThis.addClass('on').siblings().removeClass('on').find('.item-txt').removeClass('sort-up').removeClass('sort-down').addClass('sort-null');

        if (sort.hasClass('sort-up')) {
            sort.removeClass('sort-up').addClass('sort-down');
        } else if (sort.hasClass('sort-down')) {
            sort.removeClass('sort-down').addClass('sort-up');
        } else {
            if (dataType === 'up') {
                sort.removeClass('sort-null').addClass('sort-up');
            } else if (dataType === 'down') {
                sort.removeClass('sort-null').addClass('sort-down');
            }
        }
    });

    // 筛选
    sizerList.find('.filter-item').on('click', function() {
        var oThis = $(this);
        _uzm.mask.show(function() {
            $('.fn-mask').on('click', function() { // 点击遮罩层隐藏筛选
                _uzm.mask.hide(function() {
                    $('.fn-mask').off('click');
                });
                sizerBox.removeClass('sizer-box-on');
            });
        });
        sizerBox.addClass('sizer-box-on').on('click', '.btn-affirm', function() {
            _uzm.mask.hide();
            sizerBox.removeClass('sizer-box-on');
        });
    });

    sizerBox.find('.sizer-items').on('click', '.sizer-item', function() {
        var oThis = $(this);
        var op = oThis.parent('.item-bd');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
        } else if (oThis.hasClass('all-item')) {
            oThis.addClass('on').siblings().removeClass('on');
        } else {
            if (op.find('.on').length >= 5) {
                _uzm.pop.toast('最多只能选择5个');
                return false;
            }
            oThis.addClass('on').siblings('.all-item').removeClass('on');
        }
    });

    sizerBox.find('.btn-affirm').on('click', function() {
        var sHtml = '';
        var items = sizerBox.find('.sizer-items').find('.item-bd').find('.on').not('.all-item');
        var minPrice = $('#j_minPrice').val();
        var maxPrice = $('#j_maxPrice').val();

        items.each(function() {
            var oThis = $(this);
            sHtml += '<span class="sizer-item">' + oThis.html() + '</span>';
        });
        if (minPrice || maxPrice) {
            sHtml += '<span class="sizer-item">' + minPrice + '-' + maxPrice + '<i class="item-icon"></i></span>';
        }
        if (sHtml) {
            sizerItems.show().find('.bar-main').html(sHtml);
        } else {
            sizerItems.hide();
        }
    });

    sizerBox.find('.btn-reset').on('click', function() {
        sizerBox.find('.sizer-items').find('.item-bd').find('.on').removeClass('on');
        $('#j_minPrice').val('');
        $('#j_maxPrice').val('');
    });

    // 已选择的筛选项
    sizerItems.find('.btn-empty').on('click', function() {
        var oThis = $(this);
        oThis.parent('.bar-side').siblings('.bar-main').empty();
        sizerItems.hide();
    });

    sizerItems.find('.sizer-item').on('click', function() {
        var oThis = $(this);
        oThis.detach();
        if (!sizerItems.find('.sizer-item').length) {
            sizerItems.hide();
        }
    });
}

function listSidebar() {
    var sidebar = $('#j_sidebarList');
    sidebar.find('.back-top').on('click', function() {
        var oThis = $(this);
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
}

function unitFixed() {
    var w = $(window);
    var header = $('#j_fnHeader');
    var sizerBar = $('#j_sizerBar');
    var sizerWrap = sizerBar.parent('.sizer-bar-wrap');
    var swt, sbh, oh;

    w.on('scroll', function() {
        var st = w.scrollTop();

        if (header.get(0)) {
            oh = header.outerHeight(true);
            if (st >= swt - oh) {
                header.css({ 'position': 'absolute', 'top': swt - oh, 'z-index': 10 });
            } else {
                header.css({ 'position': 'fixed', 'top': 0, 'z-index': 10 }).parent().css({ 'padding-top': oh });
            }
        }

        if (sizerBar.get(0)) {
            swt = sizerWrap.offset().top;
            sbh = sizerBar.height();
            if (st >= swt) {
                sizerBar.addClass('sizer-bar-fixed');
                sizerWrap.height(sbh);
            } else {
                sizerBar.removeClass('sizer-bar-fixed');
                sizerWrap.height('auto');
            }
        }
    });
}

function contentSwitch() {
    var sizerBox = $('#j_sizerBox');
    sizerBox.find('.btn-switch').on('click', function() {
        var oThis = $(this);
        var items = oThis.next('.item-bd');

        if (oThis.hasClass('on')) {
            oThis.removeClass('on');
            items.addClass('cut-box');
        } else {
            oThis.addClass('on');
            items.removeClass('cut-box');
        }
    });
}