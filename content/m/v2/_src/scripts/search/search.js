"use strict";

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/search.js', function () {
    if (typeof search !== 'undefined') {
        window.search && window.search.init();
    }
});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/fixcity.js', function () {
    if (typeof fixcity !== 'undefined') {
        window.fixcity && window.fixcity.init('serach-city');
    }
});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
    if (typeof slider !== 'undefined') {
        window.slider && window.slider.api("j_searchFocus", "j_searchFocusWrap", 5000, true);//详细页面banners
    }
});

//清除搜索记录
var clear = function () {
    $('#j_clearHistory').on('click', function () {
        $('.ac_results').remove();
        _uzm.cookie.del('uzmChooseSpot');
        //_uzm.pop.toast('搜索记录清除成功！');
    });
};

//载入搜索记录
var load = function () {
    $('#j_searchBox').on('focus', function () {
        var o = $(this);
        var ot = o.offset().top + 27;
        var ol = o.offset().left;
        var ow = o.width() - 7;

        var ck = _uzm.cookie.get('uzmChooseSpot');
        $('.ac_results').remove();

        if (ck) {
            var arr = ck.split('|');
            var sb = [];
            sb.push("<div class='ac_results'><ul>");
            arr.forEach(function (item, idx, arrs) {
                sb.push("<li><a href='/wd/?source=搜索&word=" + item + "'>" + item + "</a></li>");
            });
            sb.push("<li class='clear tc' id='j_clearHistory' >清除历史记录</li>");
            sb.push("</ul></div>");
            $('body').append(sb.join(''));

            $('.ac_results').css({ 'position': 'absolute', 'left': ol, 'top': ot, 'width': ow });

            clear();
        }
    });
};
 
$(function () {
    load();
});

