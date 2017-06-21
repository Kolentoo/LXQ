"use strict";

var orderexports = {};

orderexports.init = function () {

    orderexports.submit();
    orderexports.math();

    var pid = $('#pid').val();

    var box = $('#j_smartCalendar');

    var cfg = {

        jsonpUrl: 'https://sh.uzai.com/ashx/ashx_Calendar.ashx?pid=' + pid + '&type=1',
        isSmart: false,
        latestDate: $('#hidFirstDay').val(),
        extCallBack: function (year, month) { //扩展方法
            //trigger
            var items = box.find('.item');
            var ablock = box.find('a.block');

            ablock.each(function (k, v) {
                var o = $(this);
                o.on('click', function () {
                    var op = o.parents('.item');
                    var ops = op.parents('.calendarBox').find('.item');
                    ops.removeClass('item-on');
                    op.addClass('item-on');

                    orderexports.chooseSchdule(o);
                    orderexports.sum();
                    orderexports.loadBonus(o);
                    orderexports.fixGroupID(o);

                });
            });

            //第一个选中
            orderexports.initFirstSchdule();
            orderexports.sum();

        },
        preCallback: function (year, month) { //回调方法

        }
    };

    if (box.get(0)) {
        box.jsonCalendar(cfg);
    }

};

orderexports.initFirstSchdule = function () {
    var box = $('#j_smartCalendar');
    var ablock = box.find('.item').find('a.block').eq(0);
    if (!ablock.get(0)) {
        return;
    }

    var item = ablock.parents('.item');
    item.addClass('item-on');

    var price = ablock.find('.price').text().replace('￥', '');
    var cprice = ablock.find('.cprice').text().replace('￥', '');

    var bnc = $('#j_numControl');
    var cli = bnc.find('li').eq(0);
    var eli = bnc.find('li').eq(1);

    cli.find('span').find('i').text(price);
    eli.find('span').find('i').text(cprice);

    ablock.trigger('click');

};

//选中第一个班期
orderexports.chooseSchdule = function (obj) {
    var box = $('#j_smartCalendar');
    var ablock = obj;
    if (!ablock.get(0)) {
        return;
    }

    var item = ablock.parents('.item');
    item.addClass('item-on');

    var price = ablock.find('.price').text().replace('￥', '');
    var cprice = ablock.find('.cprice').text().replace('￥', '');

    var bnc = $('#j_numControl');
    var cli = bnc.find('li').eq(0);
    var eli = bnc.find('li').eq(1);

    cli.find('span').find('i').text(price);
    eli.find('span').find('i').text(cprice);

    orderexports.sum();

};

//金额统计
orderexports.sum = function () {
    var box = $('#j_orderSummary');
    var bnc = $('#j_numControl');
    var cli = bnc.find('li').eq(0);
    var eli = bnc.find('li').eq(1);
    var pa = $('#j_prepaidAmount');

    if (!cli.get(0)) {
        return;
    }

    var cv = parseInt(cli.find('input.s2').val(), 10);
    var ev = parseInt(eli.find('input.s2').val(), 10);

    var cprice = parseInt(cli.find('span').find('i').text(), 10);
    var eprice = parseInt(eli.find('span').find('i').text(), 10);

    if (!ev) {
        ev = 0;
    }

    //统计
    box.find('.info').find('b').text((cv * cprice) + (ev * eprice));

    if (pa.get(0)) { // 预付总额，愚人节活动
        pa.find('em').text((cv + ev) * 41); // 41，预付金41元/人
    }
};

//人数操作
orderexports.math = function () {
    var minP = parseInt($('#hid_minperson').val(), 10) || 1;
    var maxP = parseInt($('#hid_maxpersn').val(), 10) || 99;
    var oMath = $('#j_numControl').find('.fn-math');

    oMath.each(function () {
        var oThis = $(this);
        var oi = oThis.find('input');
        var dp = oi.attr('data-type');
        var ov = parseInt(oi.val(), 10);
        var s1 = oThis.find('.s1');

        if (dp == 'adult' && ov <= minP) {
            s1.toggleClass('disabled');
            oi.toggleClass('disabled');
        } else if (dp == 'child' && ov < minP) {
            s1.toggleClass('disabled');
            oi.toggleClass('disabled');
        } else if (ov > maxP) {
            var s3 = oThis.find('.s3');
            s3.toggleClass('disabled');
            oi.toggleClass('disabled');
        }
    });

    oMath.find('span').on('click', function () {
        var o = $(this);
        var oi = o.siblings('input');//输入框
        var os = o.parent('.fn-math').find('span');

        var dp = oi.attr('data-type');
        var ov = parseInt(oi.val(), 10);

        //判断成人

        //判断儿童

        if (o.hasClass('s3')) {
            //+操作
            ov = parseInt(oi.val(), 10);

            if (ov <= maxP) {
                if (ov === maxP) {
                    o.addClass('disabled');
                    oi.addClass('disabled');
                } else {
                    os.removeClass('disabled');
                    oi.removeClass('disabled');
                }
                oi.val(ov + 1);
            }
        } else if (o.hasClass('s1')) {
            //-操作
            ov = parseInt(oi.val(), 10);

            if (dp == 'adult') {
                //成人减
                if (ov > parseInt(minP, 10)) {
                    if (ov === minP + 1) {
                        o.addClass('disabled');
                        oi.addClass('disabled');
                    } else {
                        os.removeClass('disabled');
                        oi.removeClass('disabled');
                    }
                    oi.val(ov - 1);
                } else {
                    _uzm.pop.toast('成人最少填写' + minP + '人');
                    return;
                }
            } else {
                //儿童减
                if (ov >= 1) { // 儿童最小值为0
                    if (ov === 1) {
                        o.addClass('disabled');
                        oi.addClass('disabled');
                    } else {
                        os.removeClass('disabled');
                        oi.removeClass('disabled');
                    }
                    oi.val(ov - 1);
                }
            }
        }

        //计算
        orderexports.sum();

    });
};

orderexports.submit = function () {
    $('#ordersubmit').on('click', function () {

        if (!_uzm.user.userid) {
            location.href = _uzm.domain.u + "/mobile/login?reUrl=" + location.href;
            return;
        }

        var cbox = $('#j_smartCalendar');
        var nbox = $('#j_numControl');
        var item = cbox.find('.item-on');
        var ablock = item.find('a.block');

        if (!item) {
            _uzm.pop.toast('请选择日期');
            return false;
        }

        var cli = nbox.find('li').eq(0);
        var cv = cli.find('input.s2').val();

        var eli = nbox.find('li').eq(1);
        var ev = eli.find('input.s2').val();


        if (cv == '0') {
            _uzm.pop.toast('请选择成人数');
            return false;
        }

        var year = item.attr('data-year');
        var month = item.attr('data-month');
        var day = item.attr('data-day');

        var date = year + '-' + month + '-' + day;

        var price = ablock.find('.price').text().replace('￥', '');
        var cprice = ablock.find('.cprice').text().replace('￥', '');

        var uid = _uzm.user.userid;

        var tid = $('#tid').val();
        var pid = $('#pid').val();

        //tid 2 自由行
        //tid 1 跟团游               2014-12-18出发日期   2成人人数 0 儿童人数 858成人价格 3190儿童价格 80698产品id 255428用户id
        var skipUrl = "";
        if (tid == '2') {
            //自由行
            skipUrl = "https://www.uzai.com/trip/wapproc_oneNew/" + pid + "?goDate=" + date + "&personNum=" + cv + "&childNum=" + ev + "";
        } else if (tid == '1') {
            //跟团游
            skipUrl = _uzm.domain.buy + "/touch_one/" + date + "/" + cv + "/" + ev + "/" + price + "/" + cprice + "/" + pid + "/" + uid + ".html?phoneid=";
        } else if (tid == '3') {
            //邮轮
            skipUrl = "https://www.uzai.com/youlun/Cabin/Room?ProductID=" + pid + "&goDate=" + date;
        }

        if (skipUrl) {
            //提交订单
            location.href = skipUrl;
        }

    });
};

//载入优惠信息
orderexports.loadBonus = function (lb) {
    if (lb) {
        var bonusWrp = $('#detail-aside');
        var wrp = $('.favorable-bar');

        var tags = function (obj) {
            var str = [];
            if (obj.get(0)) {
                var item = obj.find('.cheap-item');

                item.each(function (k, v) {
                    var oo = $(this);
                    var dprice = parseInt(oo.attr('data-price'), 10);
                    var max = oo.attr('data-max');
                    var desc = oo.attr('data-desc');
                    var tag = oo.attr('data-tag');
                    var txtTrim = "";

                    if (k === 0) {
                        //load first bonus;
                        wrp.html("<span class='bar-main f666 fl'>优惠：<em class='red f13'>" + desc + "</em></span><span class='bar-side f999 fr'>更多（" + item.length + "）</span>");
                    }
                    if (dprice) {
                        txtTrim = "<p><b class='t" + max + "'>立减￥" + dprice + "</b></p>";
                    }
                    str.push("<div class='clearfix item'><div class='fl mr10 i-tit'><i class='i-tg'>" + tag + "</i></div><div class='fl i-txt'>" + txtTrim + "<p>" + desc + "</p></div></div>");
                });
            }

            if (str.length) {
                return "<div class='cheap-items'>" + str.join('') + "</div>";
            }

            return "";
        };
        var cutTxt = lb.find('.cut').text();
        if (cutTxt == '紧张') {
            $('.calendar-tips-bar').show();
        } else {
            $('.calendar-tips-bar').hide();
        }
        bonusWrp.find('.detail-aside-inner').find('.inner').html(tags(lb));

        var bitmes = bonusWrp.find('.cheap-items').children('.item');
        if (bitmes.length) {
            wrp.show();
        } else {
            wrp.hide();
        }

    }
};

//处理多行程
orderexports.fixGroupID = function (lb) {
    if (lb) {
        var gids = $('#hidJgids').val();
        try {
            var objGids = JSON.parse(gids);
            for (var i in objGids) {
                if (objGids.hasOwnProperty(i)) {
                    var gid = lb.find('.group-id').text();
                    if (gid && gid == objGids[i]) {
                        $('#hidJgid').val(i);
                        $('.calendar-tips-bar').show();
                        $('.calendar-tips-bar').find('a').attr('href', '/jounery-' + $('#pid').val() + '.html?sd=' + lb.children('.date').text() + '&jgid=' + gid);
                        $('.calendar-tips-bar').find('a').text('行程' + i);
                    }
                }
            }
        } catch (e) {

        }
    }
};

$(function () {
    orderexports.init();
});

