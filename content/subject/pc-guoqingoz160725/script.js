/*
* @Author: jonas hsiao
* @Date:   2016-07-25 14:46:49
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-08-22 16:09:22
*/

'use strict';

try {
    document.domain = 'uzai.com';
} catch (e) {

}

var _up = {
    collect: {
        check: function (btn, pid) {
            var ck = _uzw.cookie.get('uzwRouteFav');
            if (ck) {
                var ckArr = ck.split('|');
                var b = $.inArray(pid, ckArr);
                if (b > -1) {
                    btn.addClass('btn-save').text('已收藏');
                } else {
                    if (_uzw.user.userid) {
                        $.ajax({
                            type: "GET",
                            url: "http://sh.uzai.com/ashx/ashx_Favourite.ashx?type=1&pid=" + pid,
                            dataType: 'jsonp',
                            success: function (msg) {
                                if (msg && msg == "1") {   //已收藏
                                    btn.addClass('btn-save').text('已收藏');
                                    ckArr.push(pid);
                                    _uzw.cookie.set('uzwRouteFav', ckArr.join('|'));
                                }
                            },
                            error: function () {
                                //alert();
                            }
                        });
                    }
                }
            }
        },
        add: function (btn, pid, pcode, sPrice, tid, pname) {
            var ck = _uzw.cookie.get('uzwRouteFav');

            btn = btn || _up.collect.param.btn;
            pid = pid || _up.collect.param.pid;
            pcode = pcode || _up.collect.param.pcode;
            sPrice = sPrice || _up.collect.param.sPrice;
            tid = tid || _up.collect.param.tid;
            pname = pname || _up.collect.param.pname;
            _uzw.user.refresh();

            //国双统计代码【收藏线路】
            // if (typeof _gsq == 'object') {
            //     _gsq.push(["T", "GWD-002793", "trackEvent", window.location, "收藏路线", pName]);
            // }

            $.ajax({
                type: "GET",
                url: "http://sh.uzai.com/ashx/ashx_Favourite.ashx?type=2&pid=" + pid + '&pCode=' + pcode + '&price=' + sPrice + '&tid=' + tid + '&pName=' + pname,
                dataType: 'jsonp',
                success: function (msg) {
                    if (msg && (parseInt(msg.result, 10) > 0 || parseInt(msg.result, 10) == -1)) {
                        //收藏成功 || 已收藏
                        // productInterest(2);//猜你喜欢收集我的收藏数据
                        btn.addClass('btn-save').text('已收藏');
                        if (ck) {
                            var ckArr = ck.split('|');
                            ckArr.push(pid);
                            _uzw.cookie.set('uzwRouteFav', ckArr.join('|'));

                        } else {
                            _uzw.cookie.set('uzwRouteFav', pid);
                        }

                    }
                    else {
                        alert("对不起，收藏失败，请重新收藏！");
                    }
                },
                error: function () {
                    alert("对不起，收藏失败，请重新收藏！");
                }
            });
        },
        cancle: function (btn, pid) {
            var ck = _uzw.cookie.get('uzwRouteFav');

            btn = btn || _up.collect.param.btn;
            pid = pid || _up.collect.param.pid;
            _uzw.user.refresh();

            $.ajax({
                type: "GET",
                url: "http://sh.uzai.com/ashx/ashx_Favourite.ashx?type=3&pid=" + pid,
                dataType: 'jsonp',
                success: function (msg) {
                    if (msg && (parseInt(msg.result, 10) > 0 || parseInt(msg.result, 10) == -1)) {   //取消收藏成功
                        btn.removeClass('btn-save').text('立即收藏');

                        if (ck) {
                            var ckArr = ck.split('|');
                            var b = $.inArray(pid, ckArr);
                            if (b > -1) {
                                ckArr.splice(b, 1);//删除取消值
                                _uzw.cookie.set('uzwRouteFav', ckArr.join('|'));
                            }
                        }
                    }
                    else {
                        alert("取消收藏失败，请重试！");
                    }
                }
            });
        },
        param: {
            btn: {},
            pid: {},
            pcode: {},
            sPrice: {},
            tid: {},
            pname: {}
        }
    }
};

$(function () {
    unitDate();
    unitBreathe();
    initWelfare();
    rotateGet();
    saveRoute();
    sideNavFixed();
    uzLazy(['j_seckillActivity', 'line-list', 'j_lineTab', 'dest-list']);
    _uzw.ui.tab('j_lineTab', function(index, obj) {
        imgLazyload(obj);
    });
});

function imgLazyload(obj) {
    var img = obj.find('img[data-original]');
    if (img.length) {
        img.each(function () {
            var oThis = $(this);
            var sSrc = oThis.attr('data-original');
            if (sSrc != oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
}

function popMod(obj, parentClass, cb) {
    var xAxis = $(window).height() / 2;
    parentClass = parentClass || '.pop-info-mod';

    cb && cb(obj);
    _uzw.ui.mask.show();
    $('.fn-mask').css({ 'opacity': '.8' });
    obj.addClass('pop-mod-on').on('click', '.j_popClose', function () {
        var oThis = $(this);
        oThis.parents(parentClass).removeClass('pop-mod-on');
        _uzw.ui.mask.hide();
    });

    //IE6下的定位
    if (_util.check.isIE6) {
        obj.css('top', $(document).scrollTop() + xAxis);
        $(window).on('scroll', function () {
            obj.css('top', $(document).scrollTop() + xAxis);
        });
    }
}

function unitBreathe() {
    var items = $('#j_ticketBox').find('.star-list').find('.list-item');
    var iLen = items.length;
    var i = 0;

    setInterval(function() {
        i = parseInt(Math.random() * iLen, 10);
        items.removeClass('on').eq(i).addClass('on');
    }, 2000);
}

function unitDate() {
    var sa = $('#j_seckillActivity');
    var df = _util.apis.getServerDate();
    var nowTime = 0;
    var nowDate;
    var _unitCD = function (cha, obj) { //单元处理
        var oTian = obj.find('.num-day');
        var oShi = obj.find('.num-hour');
        var oFen = obj.find('.num-minute');
        var oMiao = obj.find('.num-second');
        var seconds = cha / 1000;
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var tian = days;
        var shi = hours % 24;
        var fen = minutes % 60;
        var miao = Math.floor(seconds % 60);

        tian = (tian < 10) ? ('0' + tian) : tian;
        shi = (shi < 10) ? ('0' + shi) : shi;
        fen = (fen < 10) ? ('0' + fen) : fen;
        miao = (miao < 10) ? ('0' + miao) : miao;

        oTian.html('<i>' + tian + '</i>');
        oShi.html('<i>' + shi + '</i>');
        oFen.html('<i>' + fen + '</i>');
        oMiao.html('<i>' + miao + '</i>');
    };

    // 获取服务器日期
    df.done(function (tm) {
        var bars = sa.find('.foreshow-line').find('.timer-bar');

        tm = tm.replace(/-/g, '/');
        nowTime = parseInt(Date.parse(tm), 10);
        nowDate = tm.split(' ')[0];

        signIn(tm);

        bars.each(function() {
            var oThis = $(this);
            var _unitCountdown = function (obj, time) {
                var startTime = parseInt(Date.parse(obj.attr('data-startTime').replace(/-/g, '/')), 10);
                var valueS = startTime - time;
                var timeout = setTimeout(function() {
                    _unitCountdown(obj, time);
                }, 1000);

                time += 1000;

                if (valueS >= 0) {
                    _unitCD(valueS, obj);
                } else if (valueS < 0) {
                    clearTimeout(timeout);
                }
            };
            _unitCountdown(oThis, nowTime);
        });

        (function() {
            var aBox = sa.find('.activity-box');
            var bar = aBox.find('.timer-bar');
            var line = aBox.find('.seckill-line');
            var btn = line.find('.btn-item');
            var startTime = parseInt(Date.parse(bar.attr('data-startTime').replace(/-/g, '/')), 10);
            var pid = aBox.find('.seckill-box').attr('data-id');
            var _unitCountdown = function (time) {
                var valueS = startTime - time;
                var timeout = setTimeout(function() {
                    _unitCountdown(time);
                }, 1000);

                time += 1000;

                if (valueS > 0) {
                    _unitCD(valueS, bar);
                } else if (valueS <= 0) {
                    !valueS && _unitCD(valueS, bar);
                    line.addClass('line-ing').removeClass('line-pre');
                    btn.removeClass('btn-save').text('立即抢购');
                    bar.hide();

                    $.ajax({
                        type: 'GET',
                        url: _uzw.domain.wapi + '/api/UzaiSpike/GetEntitySpikeById',
                        data: { 'id': pid },
                        dataType: 'jsonp',
                        async: false,
                        cache: false,
                        success: function(data) {
                            if (data) {
                                if (!data.RemainTicketCount) {
                                    line.addClass('line-end').removeClass('line-ing');
                                    btn.removeClass('btn-save').text('已售罄');
                                    clearTimeout(timeout);
                                }
                            }
                        },
                        error: function() {
                        }
                    });
                }
            };
            _unitCountdown(nowTime);
        })();
    });
}

// 签到、转盘初始化
function initWelfare() {
    var df = _util.apis.getServerDate();
    var nowTime, nowDate;
    var oSb = $('#j_signBox');
    var items = oSb.find('.date-list').find('.list-item');
    var startDate = parseInt(Date.parse('2016/8/8 00:00:00'), 10);
    var endDate = parseInt(Date.parse('2016/9/18 23:59:59'), 10);

    // 获取服务器日期
    df.done(function (tm) {
        tm = tm.replace(/-/g, '/');
        nowTime = parseInt(Date.parse(tm), 10);
        nowDate = tm.split(' ')[0];

        if (nowTime >= startDate && nowTime <= endDate) {
            _uzw.user.refresh();
            if (_uzw.user.userid) {
                getSignInRecord(nowDate);
            } else {
                items.each(function(i) {
                    var o = $(this);
                    var sDate = o.attr('data-date');
                    var iDate = Date.parse(sDate);
                    var iNowDate = Date.parse(nowDate);
                    var index;

                    if (iDate < iNowDate) { // 今天之前
                        o.addClass('item-off').find('.bd-cont').text('');
                    } else if (iDate === iNowDate) { // 今天
                        index = o.index();
                        o.addClass('btn-today');

                        for (var k = 0; k < 4 ; k++) {
                            if (k === 0) {
                                items.eq(index + k).find('.bd-cont').text('+1');
                                oSb.find('.sb-hd').find('.sign-info').find('.si-bd').find('i').text(1); // 当日签到得抽奖数
                            } else if (k > 0) {
                                items.eq(index + k).find('.bd-cont').text('+2');
                            }
                        }
                        return false;
                    }
                });
            }
        }
    });
}

// 签到记录
function getSignInRecord(date, cb) {
    var hdata = $('#hiddendata');
    $.ajax({
        type: 'GET',
        url: _uzw.domain.wapi + '/api/UzaiActivity/GetSignInfo',
        data: {
            'UserId': _uzw.user.userid,
            'ActivityId': hdata.attr('data-activityid')
        },
        dataType: 'jsonp',
        async: false,
        cache: false,
        success: function(data) {
            var oSb = $('#j_signBox');
            var items = oSb.find('.date-list').find('.list-item');
            var lb = $('#j_lotteryBox');
            var sbhd = oSb.find('.sb-hd');
            var signInfo = sbhd.find('.sign-info');
            var signDay = data.SignDay;

            if (data) {
                sbhd.find('.info-bd').find('em').text(signDay); // 已连续签到
                lb.find('.dial-wrap').find('.btn-start').find('.cont-bd').find('i').text(data.ChouJiangCount); // 抽奖机会
                items.each(function(i) {
                    var o = $(this);
                    var sDate = o.attr('data-date');
                    var iDate = Date.parse(sDate);
                    var iNowDate = Date.parse(date);
                    var asList = data.UzaiActivitySignList;
                    var iLen = asList.length;
                    var index, k, oPrev, nowNum, iSd;

                    for (var j = 0; j < iLen; j++) {
                        iSd = Date.parse(asList[j].SignDate.split('T')[0].replace(/-/g, '/'));
                        if (iDate === iSd) {
                            o.removeClass('item-off').addClass('item-on').find('.bd-cont').text('+' + asList[j].Fields1);
                        }
                    }

                    if (iDate < iNowDate) { // 今天之前
                        !o.hasClass('item-on') && o.addClass('item-off').find('.bd-cont').text('');
                    } else if (iDate === iNowDate) { // 今天
                        oPrev = o.prev();
                        index = o.index();

                        !o.hasClass('item-on') && o.addClass('btn-today');

                        if (o.hasClass('item-on')) { // 今天是否签到
                            nowNum =  parseInt(o.find('.bd-cont').text(), 10);
                            signInfo.addClass('on').find('.si-hd').text('');
                            signInfo.find('.si-bd').find('i').text(nowNum); // 当日签到得抽奖数
                            for (k = 1; k <= 4 - signDay; k++) {
                                if (signDay >= 1) {
                                    items.eq(index + k).find('.bd-cont').text('+2');
                                }
                            }
                        } else if (oPrev.hasClass('item-on')) { // 昨天是否签到
                            for (k = 0; k < 4 - signDay; k++) {
                                if (signDay >= 1) {
                                    items.eq(index + k).find('.bd-cont').text('+2');
                                    signInfo.find('.si-bd').find('i').text(2); // 当日签到得抽奖数
                                }
                            }
                        } else {
                            for (k = 0; k < 4 - signDay; k++) {
                                if (k === 0) {
                                    items.eq(index + k).find('.bd-cont').text('+1');
                                    signInfo.find('.si-bd').find('i').text(1); // 当日签到得抽奖数
                                } else if (k > 0) {
                                    items.eq(index + k).find('.bd-cont').text('+2');
                                }
                            }
                        }
                        return false;
                    }
                });
                cb && cb(data);
            }
        },
        error: function() {
        }
    });
}

// 签到
function signIn(date) {
    var oLb = $('#j_lotteryBox');
    var oSb = $('#j_signBox');
    var sbhd = oSb.find('.sb-hd');
    var oem = sbhd.find('.info-bd').find('em');
    var signInfo = sbhd.find('.sign-info');
    var items = oSb.find('.date-list').find('.list-item');
    var hdata = $('#hiddendata');
    var startDate = parseInt(Date.parse('2016/8/8 00:00:00'), 10);
    var endDate = parseInt(Date.parse('2016/9/18 23:59:59'), 10);
    var nowDate = date.split(' ')[0];
    var nowTime = parseInt(Date.parse(date), 10);

    signInfo.on('click', function() {
        var oThis = $(this);

        if (oThis.hasClass('sign-off')) {
            return;
        }
        _uzw.user.refresh();
        if (!_uzw.user.userid) {
            _uzw.iframe.pop(_uzw.domain.u + '/QuickLoginV1?actionName=initWelfare', 640, 280); // 快速登录
        } else {
            if (nowTime >= startDate && nowTime <= endDate) {
                getSignInRecord(nowDate);
            }
            oThis.addClass('sign-off');
            $.ajax({ // 用户签到
                type: 'GET',
                url: _uzw.domain.wapi + '/api/UzaiActivity/SignIn',
                data: {
                    'UserId': _uzw.user.userid,
                    'ActivityId': hdata.attr('data-activityid')
                },
                dataType: 'jsonp',
                async: false,
                cache: false,
                success: function(data) {
                    var oi = oLb.find('.dial-wrap').find('.btn-start').find('.cont-bd').find('i');
                    if (data) {
                        if (data.Success) {
                            oThis.addClass('on').find('.si-hd').text('');
                            items.each(function(i) {
                                var o = $(this);
                                var sDate = o.attr('data-date');
                                if (Date.parse(nowDate) === Date.parse(sDate)) {
                                    o.addClass('item-on');
                                    return false;
                                }
                            });
                            oem.text(parseInt(oem.text(), 10) + 1); // 已连续签到
                            oi.text(parseInt(oi.text(), 10) + data.ChouJiangCount); // 抽奖机会
                        } else {
                            alert(data.Message);
                        }
                    }
                    oThis.removeClass('sign-off');
                },
                error: function() {
                    oThis.removeClass('sign-off');
                }
            });
        }
    });

    oSb.on('click', '.btn-today', function() {
        var oThis = $(this);

        if (oThis.hasClass('today-off')) {
            return;
        }
        _uzw.user.refresh();
        if (!_uzw.user.userid) {
            _uzw.iframe.pop(_uzw.domain.u + '/QuickLoginV1?actionName=initWelfare', 640, 280); // 快速登录
        } else {
            if (nowTime >= startDate && nowTime <= endDate) {
                getSignInRecord(nowDate);
            }
            oThis.addClass('today-off');
            $.ajax({ // 用户签到
                type: 'GET',
                url: _uzw.domain.wapi + '/api/UzaiActivity/SignIn',
                data: {
                    'UserId': _uzw.user.userid,
                    'ActivityId': hdata.attr('data-activityid')
                },
                dataType: 'jsonp',
                async: false,
                cache: false,
                success: function(data) {
                    var oi = oLb.find('.dial-wrap').find('.btn-start').find('.cont-bd').find('i');
                    if (data) {
                        if (data.Success) {
                            signInfo.addClass('on').find('.si-hd').text('');
                            oThis.addClass('item-on');
                            oem.text(parseInt(oem.text(), 10) + 1); // 已连续签到
                            oi.text(parseInt(oi.text(), 10) + data.ChouJiangCount); // 抽奖机会
                        } else {
                            alert(data.Message);
                        }
                    }
                    oThis.removeClass('today-off');
                },
                error: function() {
                    oThis.removeClass('today-off');
                }
            });
        }
    });
}

function rotateGet () {
    var hdata = $('#hiddendata');
    $('#j_lotteryBox').find('.btn-start').rotate({
        bind: {
            click: function () {
                var oThis = $(this);

                if (oThis.hasClass('btn-off')) {
                    return;
                }
                if (_util.check.isIE6) {
                    alert('当前浏览器版本不支持此效果，建议您升级浏览器版本！');
                    return;
                }
                _uzw.user.refresh();
                if (!_uzw.user.userid) {
                    _uzw.iframe.pop(_uzw.domain.u + '/QuickLoginV1?actionName=initWelfare', 640, 280); // 快速登录
                } else {
                    if (parseInt(oThis.find('.cont-bd').find('i').text(), 10) <= 0) {
                        alert('没有抽奖机会');
                        return;
                    }
                    oThis.addClass('btn-off');
                    $.ajax({ // 抽奖
                        url: _uzw.domain.wapi + '/api/UzaiActivity/LotteryDraw',
                        type: 'GET',
                        dataType: 'jsonp',
                        async: true,
                        data: {
                            'UserId': _uzw.user.userid,
                            'ActivityId': hdata.attr('data-activityid'),
                            'CityId': hdata.attr('data-cityid')
                        },
                        success: function (data) {
                            var oCount = oThis.find('.cont-bd').find('i');
                            if (data) {
                                if (data.Success) {
                                    if (!data.Position) {
                                        rotateSet(4, data.PrizeName); // 未中奖
                                    } else {
                                        rotateSet(data.Position, data.PrizeName); // 中奖
                                    }
                                    oCount.text(parseInt(oCount.text(), 10) - 1);
                                } else {
                                    alert(data.Message);
                                    oThis.removeClass('btn-off');
                                }
                            }
                        },
                        error: function() {
                            oThis.removeClass('btn-off');
                        }
                    });
                }
            }
        }
    });
}

function rotateSet(key, prizeName) {
    var lBox = $('#j_lotteryBox');
    var rotateMod = lBox.find('.rotate-mod');
    var btnStart = lBox.find('.btn-start');
    var dItem = lBox.find('.dot-item');
    var unitAngle = 45;
    var timeOut = function () { //超时函数
        var i = 0;
        var j = 0;
        var drt = 10000; // 持续时间
        var cycle = 6; // 圈数
        var speed = drt / cycle / 24; // 24个灯，78.125
        var Time = setInterval(function() { // 跑马灯
            if (i === 24) {
                i = 0;
                j = 24;
            }
            if (i === 0) {
                j = 15;
            } else {
                j = i - 1;
            }
            dItem.eq(j).removeClass('on');
            dItem.eq(i).addClass('on');
            i++;
        }, speed * 1.5);
        rotateMod.rotate({
            angle: 0,
            duration: drt,
            animateTo: cycle * 360, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的
            step: function (ang) {
                if (ang >= 360 - key * unitAngle - unitAngle + cycle * 360) { // 跑马灯停止
                    clearInterval(Time);
                    dItem.removeClass('on');
                }
            },
            callback: function () {
                // code
                btnStart.removeClass('btn-off');
            }
        });
    };
    var rotateFunc = function (awards, angle, prizeName) { //awards:奖项，angle:奖项对应的角度
        var i = 0;
        var j = 0;
        var drt = 5000; // 持续时间
        var cycle = 4; // 圈数
        var speed = drt / cycle / 24; // 24个灯，78.125
        var Time = setInterval(function() { // 跑马灯
            if (i === 24) {
                i = 0;
                j = 24;
            }
            if (i === 0) {
                j = 15;
            } else {
                j = i - 1;
            }
            dItem.eq(j).removeClass('on');
            dItem.eq(i).addClass('on');
            i++;
        }, (speed - speed / (24 - awards * 3)) * 1.5);
        rotateMod.stopRotate();
        rotateMod.rotate({
            angle: 0,
            duration: drt,
            animateTo: angle + cycle * 360, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
            step: function (ang) {
                if (ang >= angle - unitAngle + cycle * 360) { // 跑马灯停止
                    clearInterval(Time);
                    dItem.removeClass('on');
                }
            },
            callback: function () {
                switch(awards) {
                    case 1: // 100元
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">100元</dt><dd class="f24 pt5">红包</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您，红包已放入“会员中心”');
                            obj.find('.btn-bar').html('<a href="https://u.uzai.com/manage/ShareWinning" class="btn-item white f24 b">立即查看</a>');
                        });
                        break;
                    case 2: // 国内游
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">国内游</dt><dd class="f24 pt5">免费国内旅游</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您！请您联系10109898客服中心，<br/>确认奖品兑换事宜！');
                            obj.find('.btn-bar').html('<span class="btn-item white f24 b j_popClose">确认</span>');
                        });
                        break;
                    case 3: // 500元
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">500元</dt><dd class="f24 pt5">红包</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您！<br/>500元红包可购买2016年国庆欧洲游');
                            obj.find('.btn-bar').html('<a href="http://www.uzai.com/subject/ouzhou" class="btn-item white f24 b">去看看</a>');
                        });
                        break;
                    case 4: // 未中奖
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">～～</dt><dd class="f24 pt5">什么也没有</dd><dd class="icon-adorn png"></dd>');
                            obj.find('.info-bar').find('.txt').text('无数奖品散落人间，总能抢到一个的！');
                            obj.find('.btn-bar').html('<span class="btn-item white f24 b j_popClose">再来一次</span>');
                        });
                        break;
                    case 5: // 200元
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">200元</dt><dd class="f24 pt5">红包</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您，红包已放入“会员中心”');
                            obj.find('.btn-bar').html('<a href="https://u.uzai.com/manage/ShareWinning" class="btn-item white f24 b">立即查看</a>');
                        });
                        break;
                    case 6: // 演唱会门票
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">门票</dt><dd class="f20 pt5">梅赛德斯演唱会</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您！请您联系10109898客服中心，<br/>确认奖品兑换事宜！');
                            obj.find('.btn-bar').html('<span class="btn-item white f24 b j_popClose">确认</span>');
                        });
                        break;
                    case 7: // 欧洲游
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">欧洲游</dt><dd class="f20 pt5">免费国庆欧洲游</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您！请您联系10109898客服中心，<br/>确认奖品兑换事宜！');
                            obj.find('.btn-bar').html('<span class="btn-item white f24 b j_popClose">确认</span>');
                        });
                        break;
                    case 8: // 迪士尼门票
                        popMod($('#j_popInfoMod'), null, function(obj) {
                            obj.find('.cont-hd').html('<dt class="f48">门票</dt><dd class="f24 pt5">迪士尼乐园</dd>');
                            obj.find('.info-bar').find('.txt').html('恭喜您！请您联系10109898客服中心，<br/>确认奖品兑换事宜！');
                            obj.find('.btn-bar').html('<span class="btn-item white f24 b j_popClose">确认</span>');
                        });
                        break;
                    default:
                        alert('操作失败，请稍后再试！');
                        break;
                }
                btnStart.removeClass('btn-off');
            }
        });
    };

    if (!key) {
        timeOut();
    } else {
        rotateFunc(key, 360 - (key - 1) * unitAngle - 22.5, prizeName);
    }
}

function saveRoute() {
    var sa = $('#j_seckillActivity');
    var _initSave = function(obj, pid, pcode, sPrice, tid, pname) {
        _up.collect.param.btn = obj;
        _up.collect.param.pid = pid;
        _up.collect.param.pcode = pcode;
        _up.collect.param.sPrice = sPrice;
        _up.collect.param.tid = tid;
        _up.collect.param.pname = pname;
        //检测收藏
        _up.collect.check(obj, pid);

        if (obj.hasClass('btn-save')) {
            //取消
            if (!_uzw.user.userid) {
                _uzw.iframe.pop(_uzw.domain.u + "/QuickLoginV1?actionName=_up.collect.cancle");
            } else {
                _up.collect.cancle(obj, pid);
            }
        } else {
            //添加收藏
            if (!_uzw.user.userid) {
                _uzw.iframe.pop(_uzw.domain.u + "/QuickLoginV1?actionName=_up.collect.add");
            } else {
                _up.collect.add(obj, pid, pcode, sPrice, tid, pname);
            }
        }
    };

    sa.find('.activity-box').on('click', '.btn-item', function() {
        var oThis = $(this);
        var op = oThis.parents('.seckill-box');
        var pid = op.attr('data-pid');
        var pcode = op.attr('data-code');
        var tid = op.attr('data-tclass');
        var pname = op.attr('data-pname');
        var sPrice = op.find('.info-bar').find('del').text().split('￥')[1];
        if (oThis.parents('.seckill-line').hasClass('line-pre')) {
            _initSave(oThis, pid, pcode, sPrice, tid, pname);
            return false;
        }
    });

    sa.find('.line-list').on('click', '.btn-pre', function() {
        var oThis = $(this);
        var op = oThis.parents('.list-item');
        var pid = op.attr('data-pid');
        var pcode = op.attr('data-code');
        var tid = op.attr('data-tclass');
        var pname = op.attr('data-pname');
        var sPrice = op.find('.info-bar').find('del').text().split('￥')[1];
        _initSave(oThis, pid, pcode, sPrice, tid, pname);
        return false;
    });

    sa.on('mouseenter', '.btn-save', function () {
        var o = $(this);
        o.text('取消收藏');
    }).on('mouseleave', '.btn-save', function () {
        var o = $(this);
        o.text('已收藏');
    });
}

function sideNavFixed() {
    var box = $('#j_fixedNav');
    if (!box.get(0)) {
        return;
    }
    var ot = box.offset().top;
    var items = $('.main-mod');

    $(window).scroll(function () {
        unitScroll();
    });

    var unitScroll = function () {
        var w = $(window);
        var st = w.scrollTop();
        if (st >= ot) {
            if (_util.check.isIE6) { //!window.XMLHttpRequest
                box.css({ 'top': st, 'position': 'absolute' });
            } else {
                box.css({ 'top': 0, 'position': 'fixed' });
            }
            unitCheck(st);
        } else {
            box.css({ 'top': ot, 'position': 'absolute' });
        }
    };

    var unitCheck = function (st) {
        items.each(function (k,v) {
            var o = $(this);
            var oot = o.offset().top;
            if (st > oot - 1) {
                box.find('li').removeClass('on');
                box.find('li').eq(k).addClass('on');
                return true;
            }
        });
    };

    var unitSkip = function () {
        box.find('li').on('click',function(){
            var oli = $(this);
            var oindex = oli.index();

            var skipNode = items.eq(oindex);
            var oot = skipNode.offset().top;
            $('body,html').animate({ scrollTop: oot }, 800);
        });
    };
    unitSkip();
    unitScroll();
}