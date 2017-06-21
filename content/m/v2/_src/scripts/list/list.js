"use strict";

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
    window.tab.init('j_destinationFilter');
    window.tab.init('j_detailFilter');
});

var list = $('#j_list');

var listexports = {};

listexports.init = function () {
    if ($('.fn-header').css('display') == 'none') {
        list.css({ 'top': '0' });
    }

    if (!list.children('.hd').get(0)) {
        $('#wrapper1').css({ 'top': '0' });
    }

    list.css({ 'top': ($('.g-download-tip').outerHeight() + ($('#j_fnHeader').is(':visible') ? $('#j_fnHeader').outerHeight() : 0)) });

    window.onload = function () {
        listexports.initData();
        listexports.change();
        listexports.record();
        listexports.submitDetail();
        listexports.submitOrder();
        listexports.unitSearch();
    };
};

listexports.initData = function () {
    var box = list;
    var bd = box.find('.bd');
    var hd = box.find('.hd');
    var lis = bd.find('li');
    if (lis.length <= 14) {
        $('#pullUp1').remove();
        //box.find('.bd').after("<div id='j_listNone' class='lh2 tc f22'>没有了...</div>");
    }
    if (!hd.get(0)) {
        $('#wrapper1').css({ 'top': '0' });
    }
};

listexports.change = function () {

    //change footer tab
    $('#j_ft').find('ul').find('li').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        var index = o.index();

        os.removeClass('on');
        o.addClass('on');

        var items = $('#j_listFilter').children('.item');
        items.hide();
        items.eq(index).show();

        listexports.mask.pop();

    });

    //choose
    $('#j_destinationFilter').find('.bd').find('.item').find('li').on('click', function () {
        var o = $(this);
        var ot = $.trim(o.text());
        var os = o.siblings('li');

        os.removeClass('on');
        if (ot != '不限') {
            o.addClass('on');
        }
    });

    //choose
    $('#j_detailFilter').find('.bd').find('.item').find('li').on('click', function () {
        var o = $(this);
        var ot = $.trim(o.text());
        var os = o.siblings('li');

        var bds = o.parents('.bd');

        os.removeClass('on');
        if (ot != '不限') {
            listexports.watch(o);
            o.addClass('on');
        } else {
            bds.find('i').remove();
        }

    });

    $('#j_detailFilter').find('.item').find('input[type=date]').on('blur', function () {
        var o = $(this);
        var ov = o.val();
        if (ov) {
            $('#j_detailFilter').find('.hd').find('.on').append('<i></i>');
        }
    });

    //reset
    $('#j_detailFilter').find('.bar').find('.reset').on('click', function () {
        var o = $(this);
        $('#j_detailFilter').find('.on').removeClass('on');
        $('#j_detailFilter').find('li').find('i').remove();
        $('#j_detailFilter').find('.ct').find('input').val('').attr('type', 'text');
    });

    $('#j_pricenumFilter').find('li').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
    });

};

//hide footer filter
listexports.clear = function () {
    $('#j_listFilter').children('.item').hide();
};

//fix radius corner
listexports.watch = function (o) {

    var bd = o.parents('.bd');
    var hd = bd.siblings('.hd');
    var oli = hd.find('.on');
    var olis = oli.siblings('li');

    //add radius flag
    oli.find('i').remove();
    oli.append('<i></i>');
};

listexports.mask = {};

listexports.mask.pop = function () {
    listexports.mask.remove();
    var oo = "<div class='fn-mask'></div>";
    $('body').append(oo);
    $('.fn-mask').show();
    listexports.mask.touch();//绑定 touch
};

listexports.mask.remove = function () {
    $('.fn-mask').remove();
};

listexports.mask.touch = function () {
    $('.fn-mask').on('click', function () {
        listexports.backspace();
    });
};

//状态回退
listexports.backspace = function () {
    listexports.mask.remove();
    $('#j_listFilter').children('.item').hide();
    $('#j_ft').find('.on').removeClass('on');
};

//添加搜索记录
listexports.record = function () {
    var url = location.href.toLowerCase();
    var word = _util.url.get('word') || _util.url.get('wd');

    if (word) {
        var tag = decodeURIComponent(word);
        var ck = _uzm.cookie.get('uzmChooseSpot');
        if (ck) {
            var nck = ck + '|' + tag;
            // var nArr = _util.array.unique(nck.split('|'));
            var nArr = _util.array.unique(nck.split('|'));

            //检测数组长度
            if (nArr.length > 6) {
                nArr.shift();
            }
            _uzm.cookie.set('uzmChooseSpot', nArr.join('|'));
        } else {
            _uzm.cookie.set('uzmChooseSpot', tag);
        }
    }
};

//排序
listexports.submitOrder = function () {
    var box = $('#j_pricenumFilter');
    box.find('li').on('click', function () {
        var o = $(this);
        var order = o.attr('data-order');
        var sb = [];

        var url = document.location.href.replace('#', '');
        var day = _util.url.get('day');
        var price = _util.url.get('price');
        var date = _util.url.get('date');
        var ext = _util.url.get('ext');
        var word = _util.url.get('word');
        var wd = _util.url.get('wd');
        var keyword = _util.url.get('keyword');

        if (day) {
            sb.push('day=' + day);
        }

        if (price) {
            sb.push('price=' + price);
        }

        if (date) {
            sb.push('date=' + date);
        }

        if (ext) {
            sb.push('ext=' + ext);
        }

        if (order) {
            sb.push('order=' + order);
        }

        if (word) {
            sb.push('word=' + word);
        }

        if (wd) {
            sb.push('wd=' + wd);
        }

        if (keyword) {
            sb.push('keyword=' + keyword);
        }

        var params = sb.join('&');
        if (params) {
            location.href = location.pathname + '?' + params;
        } else {
            location.href = location.pathname;
        }

    });
};


//精准搜索提交
listexports.submitDetail = function () {
    var box = $('#j_detailFilter');
    var url = location.href.replace('#', '');
    box.find('.bar').find('.ok').on('click', function () {
        var o = $(this);
        var ul = box.find('.hd').find('ul');
        var lis = box.find('.bd').find('.on');
        var sb = [];
        lis.each(function () {
            var oo = $(this);
            var oot = $.trim(oo.attr('data-eq'));
            if (!oot) {
                oot = $.trim(_util.string.replaceAll(oo.val(), '-', '/'));
            }
            var oop = oo.parents('.item');
            var oopA = oop.attr('data-key');
            if (oot) {
                sb.push(oopA + '=' + oot);//时间
            }

            var order = _util.url.get('order');
            if (order) {
                sb.push('order=' + order);
            }

            var word = _util.url.get('word');
            if (word) {
                sb.push('word=' + word);
            }

            var keyword = _util.url.get('keyword');
            if (keyword) {
                sb.push('keyword=' + keyword);
            }

        });

        var params = null;
        if (sb && sb.length) {
            params = _util.array.unique(sb).join('&');
        }

        if (params) {
            location.href = location.pathname + '?' + params;
        } else {
            location.href = location.pathname;
        }
    });
};

listexports.unitSearch = function() {
    var popSearch = $('.pop-search-mod');

    $('#j_fnHeader').find('.search').on('click', function () {
        var keyList = $('.keywords-list');
        var uzaiChooseSpot = decodeURI(api.getCookie('uzmChooseSpot'), 'decodeURIComponent');

        popSearch.css({ 'opacity': 1, 'z-index' : 1000 });
        popSearch.find('.bar-main').find('input').focus();
        if (uzaiChooseSpot === null || uzaiChooseSpot === 'null' || uzaiChooseSpot === '' || uzaiChooseSpot === undefined || uzaiChooseSpot === 'undefined') {
            keyList.html('');
        }
        else {
            var uzaiChooseSpots = uzaiChooseSpot.split('|').reverse();
            var html = '';
            for (var i = 0; i < uzaiChooseSpots.length; i++) {
                if (i < 2) {
                    html += '<li class="list-item border-top"><a href="/wd/?word=' + uzaiChooseSpots[i] + '"><i class="icon-item"></i><em class="item-cont">' + uzaiChooseSpots[i] + '</em></a><i class="item-close"></i> </li>';
                } else {
                    break;
                }
            }

            keyList.html(html);
            keyList.find('.item-close').on('click', function () {
                var itemClose = $(this),
                    keyList = itemClose.parent('.list-item'),
                    itemCont = keyList.find('.item-cont').text();
                for (var i = 0; i < uzaiChooseSpots.length; i++) {
                    if (uzaiChooseSpots[i] === itemCont) {
                        uzaiChooseSpots.splice(i, 1);
                        api.setCookie('uzmChooseSpot', encodeURIComponent(uzaiChooseSpots.join('|')));

                        keyList.remove();
                        keyList.find('.list-item').length || keyList.css({display: 'none'});
                    }
                }
            });
        }
    });

    popSearch.find('.btn-cancel').on('click', function () {
        $('.pop-search-mod').css({ 'opacity': 0, 'z-index' : -1 });
    });
};

$(function () {
    listexports.init();
});
