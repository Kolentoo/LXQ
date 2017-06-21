"use strict";

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/fixcity.js', function () {
    window.fixCity && window.fixCity.init('j_current');
});

var myexports = {};

myexports.city = [];

//历史记录
myexports.history = function () {
    var ck = _uzm.cookie.get('uzmChooseCity');
    $('#j_history').find('dd').remove();
    if (ck) {
        var arr = ck.split('|');
        var sb = arr.map(item=> {
            var blocks = item.split('-');
            return "<dd data-id='" + blocks[1] + "' data-city='" + blocks[2] + "' >" + blocks[0] + "</dd>";
        });
        $('#j_history').find('dt').after(sb.join(''));
    } else {
        $('#j_history').remove();
    }
};

myexports.search = function () {

    var ci = 0;
    var unitKeyUp = function (obj) {
        var o = obj;
        var ov = $.trim(o.val());

        if (ov) {
            $('#j_searchData').show();
            myexports.fix3();
            myexports.marry(ov.toLowerCase());
        } else {
            myexports.up3();
            $('#j_searchData').hide();
        }
    };

    $('#j_chooseList').find('input').on('focus', function () {
        var o = $(this);
        var os = o.siblings('i');
        var ov = $.trim(o.val());
        if (ov) {
            if (ov == '输入城市名或首字母查询') {
                o.val('');
                os.hide();
            } else {
                os.hide();
            }
        } else {
            o.val('输入城市名或首字母查询');
            os.show();
        }

        //监听
        ci = setInterval(function () {
            unitKeyUp(o);
        }, 10);

    }).on('blur', function () {
        var o = $(this);
        var os = o.siblings('i');
        var ov = $.trim(o.val());
        if (ov) {
            if (ov == '输入城市名或首字母查询') {
                os.show();
            } else {
                os.hide();
            }
        } else {
            o.val('输入城市名或首字母查询');
            os.show();
        }
        //清除
        if (ci) {
            clearInterval(ci);
        }

    });

    //即时搜索
    $('#j_chooseList').find('input').on('keyup', function () {
        var o = $(this);
        unitKeyUp(o);
    });

};

myexports.marry = function (v) {
    if (v) {
        var sb = myexports.city.filter(item=> item.indexOf(v) > -1);

        //添加节点
        var nd = sb.map(item=> {
            var blocks = item.split('-');
            return "<dd data-city='" + blocks[2] + "' data-id='" + blocks[1] + "' >" + blocks[0] + "</dd>";
        });

        $('#j_searchData').find('dl').html(nd.join(''));
    }
};

//休理小三
myexports.fix3 = function () {
    $('#j_chooseList').find('.bd').hide();
    $('#j_chooseList').find('.hd').hide();

};

//小三归位
myexports.up3 = function () {
    $('#j_chooseList').find('.bd').show();
    $('#j_chooseList').find('.hd').show();

};

//载入城市
myexports.load = function () {
    var lis = $('#j_chooseList').find('.alpha').find('dd');
    lis.each(function () {
        var o = $(this);
        var ot = $.trim(o.text());
        var oid = o.attr('data-id');
        var oci = o.attr('data-city');

        if (ot) {
            myexports.city.push(ot + '-' + oid + '-' + oci);
        }
    });
};

//点击选中城市
myexports.bang = function () {
    $('#j_chooseList').on('click', 'dd', function () {
        var o = $(this);
        var ov = $.trim(o.text());
        var oid = o.attr('data-id');
        var ocity = o.attr('data-city');

        var ant = ov + '-' + oid + '-' + ocity;

        var ck = _uzm.cookie.get('uzmChooseCity');
        if (ck) {
            var nck = ck + '|' + ant;
            var nArr = _util.array.unique(nck.split('|'));

            //检测数组长度
            nArr.length > 3 && nArr.shift();
            
            _uzm.cookie.set('uzmChooseCity', nArr.join('|'));

        } else {
            _uzm.cookie.set('uzmChooseCity', ant);
        }

        _uzm.cookie.set('uzmCity', ant);

        myexports.history();

        var city = _uzm.cookie.get('uzmCity');

        var url = 'http://' + location.host + location.pathname + location.search;
        var u = url.toLowerCase().split('?url=')[1];
        if (u) {
            if (city) {
                location.href = u.replace('city', city.split('-')[2]);
            }
        } else {
            //返回首页
            if (city) {
                location.href = "/" + city.split('-')[2];
            } else {
                location.href = "/";
            }
        }

    });
};

myexports.scroll = function () {
    var unitScroll = function () {
        var o = $(window);
        var ot = o.scrollTop();
        var ohd = $('#j_chooseList').find('.hd');
        if (ot > 92) {
            ohd.css({ 'top': '0' });
        } else {
            ohd.css({ 'top': '92px' });
        }
    };
    unitScroll();
    $(window).scroll(function () {
        unitScroll();
    });
};

myexports.init = function () {

    myexports.history();
    myexports.scroll();
    myexports.search();
    myexports.load();//载入城市
    myexports.bang();

};
$(function () {
    myexports.init();
});

