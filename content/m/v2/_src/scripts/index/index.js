"use strict";

var indexexports = {};

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
    window.slider.api("j_topSlider", "j_topSliderWrap", 5000, true);
});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/fixcity.js', function () {
    window.fixcity.init('j_topMenu');
});

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/search.js', function () {
    window.search.init();
});

indexexports.init = function () {
    indexexports.topMenu();
    //indexexports.noticeGs();
    indexexports.downTip();
    indexexports.indexNotice();
};

indexexports.topMenu = function () {
    var oTM = $('#j_topMenu');
    var oML = oTM.find('.menu-list');
    var oMask = oTM.next('.lucency-mask');
    oTM.find('.menu-more').on('click', function () {
        var o = $(this);
        o.hide();
        oML
            .show()
            .on('click', '.btn-search', function () {
                var psm = $('#j_popSearchMod');
                var hb = $('html, body');

                // indexexports.loadAutocomplete();
                indexexports.searchHot();
                indexexports.searchHistory();

                hb.css({ 'overflow-y': 'hidden', 'height': '100%' });

                //弹出搜索
                psm
                    .css({ 'opacity': 1, 'z-index': 1000 })
                    .on('click', '.j_popClose', function () {
                        psm.css({ 'opacity': 0, 'z-index': -1 });
                        oMask.hide();
                        oML.hide();
                        o.show();
                        hb.css({ 'overflow-y': 'auto', 'height': 'auto' });
                    });
            });

        oMask
            .show()
            .on('click', function () {
                var oThis = $(this);
                oThis.hide();
                oML.hide();
                o.show();
            }); // 关闭菜单列表
    });
};

indexexports.downTip = function () {

    var cfh = location.href.toLowerCase();
    if (cfh.indexOf('coffee.uzai.com') > -1) {
        return;
    }

    var ckName = "uzmAppNotice";
    var dt = null;
    if (_uzm.cookie.get(ckName)) {
        return;
    }

    var sb = [];
    sb.push("<section class='app-download-bar p5 clearfix'>");
    sb.push("<a href='#' class='close'>&times;</a>");
    sb.push("<div class='app-logo fl'><img src='http://r.uzaicdn.com/content/m/v2/images/index/logo-app.png' alt='' width='39'></div>");
    sb.push("<div class='btn-box fr pt10 pr10'><a href='http://m.uzai.com/download' class='btn-app f13'>马上下载</a></div>");
    sb.push("<dl class='app-cont'>");
    sb.push("<dt class='f16'>众信悠哉旅游</dt>");
    sb.push("<dd class='f999 f13'>更多功能尽在手机APP</dd>");
    sb.push("</dl>");
    sb.push("</section>");
    $('#j_topSliderWrap').before(sb.join(''));

    dt = $('.app-download-bar');
    dt.find('.close').on('click', function () {
        var o = $(this);
        _uzm.cookie.set(ckName, '1', 7);
        dt.hide();
    });

};

// 改色
indexexports.noticeGs = function () {
    var ckName = 'uzmNotice909';
    if (_uzm.cookie.get(ckName)) {
        return;
    }

    var sb = [];
    sb.push('<div class="notice-gs tc hide" id="j_noticeGs">');
    sb.push('<div class="d1"><img src="http://r.uzaicdn.com/content/v1/images/common/mascot2.png" alt="" width="40" class="vm"></div>');
    sb.push('<div class="d2 f13 white">');
    sb.push('<p>11年来， 你旅行的足迹，<br>陪伴着悠哉的每一次成长、每一次辉煌<br />时代的变幻让大家感到过迷茫，<br>但我们一直都没有放弃追逐旅行的梦想</p>');
    sb.push('<p>2015年悠哉与国内首家A股上市民营旅行社<br>众信旅游（股票代码002707）<br>缔结战略合作伙伴关系<br />共同整合旅游和地面服务资源，<br>合力打造O2O模式旅游度假开放平台</p>');
    sb.push('<p>今天，悠哉网将以全新的形象，<br>呈现在新老用户面前<br />我们将用线上线下结合的方式<br>继续为用户提供更多、<br>更便捷的旅游及出境生活服务</p>');
    sb.push('</div>');
    sb.push('<div class="d3"><span class="btn-start f13 white close">轻触开启全新旅程</span></div>');
    sb.push('</div>');

    $('body').append(sb.join(''));
    var ong = $('#j_noticeGs');

    _uzm.mask.show();
    ong.fadeIn('slow');

    ong.find('.close').on('click', function () {
        ong.fadeOut('slow');
        _uzm.mask.hide();
        _uzm.cookie.set(ckName, '1', 300);
    });
};

indexexports.indexNotice = function () {

    //预热时间
    var _noticePreScope = {
        start: '2016/02/06 00:00:00',
        end: '2016/02/13 23:59:59'
    };
    //真实时间
    var _noticeScope = {
        start: '2016/01/15 23:00:00',
        end: '2016/01/16 06:00:00'
    };

    var _noticeInGAP = function (timeScope) {
        var nd = Date.parse(new Date());
        var ndstart = Date.parse(timeScope.start);
        var ndend = Date.parse(timeScope.end);
        if (nd >= ndstart && nd <= ndend) {
            return true;
        }
        return false;
    };

    if (_noticeInGAP(_noticePreScope)) {
        var _noticePop = function () {

            var ckName = 'uzmNoticeCj2016';
            if (_uzm.cookie.get(ckName)) {
                return;
            }

            var ckCity = _uzm.cookie.get('uzmCity');
            if ((ckCity.indexOf('sh') === -1)) {
                return;
            }

            // 春节公告
            var words = "<div class='tl'><div class='tc f18 pb5' style='line-height:20px;'>尊敬的用户您好：春节期间本网站呼叫中心工作时间调整：2月6日工作时间8点-18点，2月7号-2月13号工作时间9点-18点，由此给您带来的不便，敬请谅解。</div>";
            _uzm.mask.show();

            _uzm.pop.confirm(words, function () {
                _uzm.mask.hide();
                _uzm.cookie.set(ckName, "1", 7);
            });

        };
        _noticePop();//弹出通栏通告

        if (_noticeInGAP(_noticeScope)) {
            var zxFlag = $('#hidSupplierFlag').val();
            if (zxFlag == '008') {
                var btnos = $('#ordersubmit');
                btnos.hide();
                btnos.after("<input class='btn-order-maintain lh3 fr btn g5' type='button' value='维护中...' />");
            }
        }
    }
};

indexexports.searchHot = function () {
    var psm = $('#j_popSearchMod');
    $.ajax({
        type: 'GET',
        url: '',
        dataType: 'json',
        success: function (data) {
            var iLen = data.length;
            if (iLen) {
                var sb = '';
                for (var i = 0; i < iLen; i++) {
                    var item = data[i];
                    sb += '<a href="#" class="hot-item">' + item + '</a>';
                }
                psm.find('.hot-items').html(sb);
            } else {
                psm.find('.hot-items');
            }
        }
    });
};

//搜索记录
indexexports.searchHistory = function () {
    var ckName = 'uzmChooseSpot';
    var ck = _uzm.cookie.get(ckName);

    if (ck) {
        var psm = $('#j_popSearchMod');
        var ts = psm.find('.top-search');
        var kl = psm.find('.keywords-list');
        var arr = ck.split('|').reverse();
        var arrLen = arr.length;
        var sb = [];

        kl.remove();

        sb.push('<ul class="keywords-list f666 f14">');
        arr.forEach(function (item, idx, arr) {
            if (idx < 2) {
                sb.push('<li class="list-item"><a href="/wd/?word=' + item + '"><i class="icon-item mr10 vm"></i><em class="item-cont vm">' + item + '</em></a><i class="item-close"></i></li>');
            }
        });
        sb.push('</ul>');
        ts.after(sb.join(''));

        kl = psm.find('.keywords-list');
        kl.find('.item-close').on('click', function () { // 删除当前搜索记录
            var oThis = $(this);
            var li = oThis.parent('.list-item');
            var icTxt = li.find('.item-cont').text();

            arrLen = arr.length;

            for (var i = 0; i < arrLen; i++) {
                if (arr[i] === icTxt) {
                    arr.splice(i, 1);
                }
            }
            _uzm.cookie.set(ckName, arr.join('|'));
            li.remove();

            if (!kl.find('.list-item').length) {
                kl.css({ 'display': 'none' });
            }
        });
    }
};

//载入自动完成数据
indexexports.loadAutocomplete = function () {
    $('#j_searchBox').on('focus', function () {
        var o = $(this);
        var ck = _uzm.cookie.get('uzmChooseSpot');

        $('.ac_results').remove();

        if (ck) {
            var arr = ck.split('|');
            var sb = [];
            sb.push("<div class='ac_results'><ul>");
            arr.forEach(function (item, idx) {
                sb.push("<li><a href='/wd/?word=" + item + "'>" + item + "</a></li>");
            });
            sb.push("</ul></div>");
            $('body').append(sb.join(''));
        }
    }).focus();
};

$(function () {
    indexexports.init();
});

