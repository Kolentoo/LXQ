/*
 * @Author: lxq
 * @Date:   2016-07-27 00:40:13
 * @Last Modified by:   jonas hsiao
 * @Last Modified time: 2016-08-23 13:30:52
 */
var subject,navigation,nav,conBox,list,item,hdtop,conttop,hdata;
var myexports = {};

_util.file.load(_uzm.domain.cdnRandom() + '/content/libs/plugin/jqueryrotate/jqueryrotate.js', function() {
    myexports.rotateGet();
});

myexports.init = function() {
    subject = $('#j_subject');
    navigation = $('#j_nav');
    nav = navigation.find('.nav-list');
    conBox = subject.find('.cont-box');
    list = $('.tab-list');
    item = subject.find('.bd').find('.item');
    hdtop = subject.find('.hd').offset().top;
    conttop = subject.find('.cont5-box').offset().top;
    hdata = $('#hidRequestData');

    myexports.tab();
    myexports.navigation();
    myexports.tabList();
    myexports.sectime();
    myexports.actpop();
    // myexports.saveRoute();
    // myexports.GetSignInfo();
};

myexports.tab = function() {
    list.on('click', function() {
        var o = $(this);
        var oindex = o.index();
        var os = o.siblings();
        var items = item.eq(oindex).siblings();
        o.addClass('on');
        os.removeClass('on');
        item.eq(oindex).removeClass('hide');
        items.addClass('hide');
        $('body,html').scrollTop(conttop);
    });
};

myexports.navigation = function() {
    nav.on('click', function() {
        var t = $(this);
        var ts = t.siblings('li');
        t.addClass('on');
        ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').scrollTop(stop);
    });
    $('.back').on('click', function() {
        $('body,html').scrollTop(0);
    });
    $(window).scroll(function() {
        var w = $(window).scrollTop();
        if (w >= 600) {
            navigation.addClass('nav-on');
        } else {
            navigation.removeClass('nav-on');
        }
        if (w >= hdtop) {
            $('.head-box').addClass('ul-on');
        } else {
            $('.head-box').removeClass('ul-on');
        }
        $('.cont-box').each(function(a, b) {
            var ctop = $(this).offset().top;
            if (w > ctop - 30) {
                navigation.find('.nav-list').removeClass('on');
                navigation.find('.nav-list').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");
};

myexports.tabList = function() {
    $('.box-list').on('click', function() {
        var t = $(this);
        var tindex = t.index();
        var tlist = $('.tab-list').eq(tindex).siblings();
        $('body,html').scrollTop(conttop);
        $('.tab-list').eq(tindex).addClass('on');
        tlist.removeClass('on');
    });
};

myexports.actpop = function() {
    $('.cont1-box').find('.rb').on('click',function(){
        $('.ms-pop').show();
        _uzm.mask.show();
    });
    $('.cont2-box').find('.rb').on('click',function(){
        $('.qd-pop').show();
        _uzm.mask.show();
    });
    $('.cont4-box').find('.rb').on('click',function(){
        $('.ych-pop').show();
        _uzm.mask.show();
    });

    $('.p-close').on('click', function() {
        $('.popb').hide();
        _uzm.mask.hide();
    });
};

// 秒杀
myexports.sectime = function() {
    var tbar = subject.find('.timer');
    var nowTime = 0;
    var _unitCountdown = function(obj, time) {
        var op = obj.parents('.sec-route');
        var oTian = obj.find('.tian');
        var oShi = obj.find('.shi');
        var oFen = obj.find('.fen');
        var oMiao = obj.find('.miao');
        var dst = obj.attr('data-starttime');
        var det = obj.attr('data-endtime');
        var startTime = parseInt(Date.parse(dst), 10);
        var endTime = parseInt(Date.parse(dst), 10);
        // var endTime = parseInt(Date.parse(dst), 10);
        var iValue1 = startTime - time;
        var iValue2 = endTime - time;

        var secPro = subject.find('.sec-route');
        var btnTxt = subject.find('.sec-btn');
        var phref = btnTxt.find('a').attr("href");
        var pid = btnTxt.attr('data-id');
        var timeout;
        var _unitCD = function(cha) {
            var seconds = cha / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            oTian.text(days);
            oShi.text(hours % 24);
            oFen.text(minutes % 60);
            oMiao.text(Math.floor(seconds % 60));
        };

        time += 1000;
        if (iValue1 > 0) {
            _unitCD(iValue1);
        } else if (iValue1 <= 0) {
            !iValue1 && _unitCD(iValue1);
            op.addClass('sec-ing').removeClass('sec-prev');
            /*$.ajax({
                type: 'GET',
                url: '',
                data: { },
                dataType: 'json',
                async: false,
                cache: false,
                success: function(data) {
                    if (data) {
                        var rtc = data.RemainTicketCount;
                        if (!rtc) {
                            op.addClass('sec-over').removeClass('sec-ing');
                            clearTimeout(timeout);
                        }
                    }
                },
                error: function() {
                }
            });*/
            $.ajax({
                type: 'GET',
                url: _uzm.domain.wapi + '/api/UzaiSpike/GetEntitySpikeById',
                data: { 'id': pid },
                dataType: 'jsonp',
                async: false,
                cache: false,
                success: function(data) {
                    if (data) {
                        var rtc = data.RemainTicketCount;
                        if (!rtc) {
                            secPro.addClass('sec-over').removeClass('sec-ing').removeClass('sec-prev');
                            btnTxt.html('<p class="p3">已售罄</p>');
                            clearTimeout(timeout);
                        } else {
                            secPro.addClass('sec-ing');
                            btnTxt.html('<a href="' + phref + '" class="p2">立即抢购</a>');
                        }
                    }
                },
                error: function() {
                }
            });
        }

        timeout = setTimeout(function() {
            _unitCountdown(obj, time);
        }, 1000);

    };

    // 获取服务器日期
    $.ajax({
        url: _uzm.domain.wapi + '/api/UzaiIPHelp/GetDate/',
        type: 'GET',
        dataType: "jsonp",
        cache: false,
        success: function(tm) {
            var nowDate;
            tm = tm.replace(/-/g, '/');
            nowTime = parseInt(Date.parse(tm), 10);
            nowDate = tm.split(' ')[0];
            tbar.each(function() {
                var oThis = $(this);
                _unitCountdown(oThis, nowTime);
            });

            myexports.signIn(tm);
            // 签到、转盘初始化
            (function() {
                var box = $('.cont2-box');
                var record = box.find('.qd-box').find('.qd-record');
                var items = box.find('.qd-body').find('.b-list');
                var startDate = parseInt(Date.parse('2016/8/8 00:00:00'), 10);
                var endDate = parseInt(Date.parse('2016/9/18 23:59:59'), 10);
                // var startDate = parseInt(Date.parse('2016/7/8 00:00:00'), 10);
                // var endDate = parseInt(Date.parse('2016/8/18 23:59:59'), 10);

                if (nowTime < startDate) {
                    record.find('.p2').text('8.8开始');
                } else if (nowTime > endDate) {
                    record.find('.p2').text('已结束');
                } else if (nowTime >= startDate && nowTime <= endDate) {
                    if (parseInt(hdata.attr('data-userid'), 10)) {
                        myexports.getSignInRecord(nowDate);
                    } else {
                        items.each(function(i) {
                            var o = $(this);
                            var qdData = o.find('.qd-data');
                            var sDate = qdData.attr('sign-data');
                            var iDate = Date.parse(sDate);
                            var iNowDate = Date.parse(nowDate);
                            var index;

                            if (iDate < iNowDate) {
                                o.addClass('qd-lose').find('.qd-icon').find('.s1').text('');
                            } else if (iDate === iNowDate) {
                                index = o.index();
                                o.addClass('btn-today');
                                record.find('.timer').text(qdData.text()); // 当天日期
                                for (var k = 0; k < 4 ; k++) {
                                    if (k === 0) {
                                        items.eq(index + k).find('.qd-icon').find('.s1').text(1);
                                        record.find('.p1').find('em').text(1); // 当日签到得抽奖数
                                    } else if (k > 0) {
                                        items.eq(index + k).find('.qd-icon').find('.s1').text(2);
                                    }
                                }
                                return false;
                            }
                        });
                    }
                }
            })();
        }
    });
};

myexports.rotateGet = function() {
    $('#j_dialBox').find('.btn-start').rotate({
        bind: {
            click: function() {
                var oThis = $(this);
                var oCount = oThis.find('.number').find('em');
                if (oCount.text()<=0) {
                    _uzm.pop.toast("没有抽奖机会");
                    return;
                }
                oThis.addClass('btn-off');

                $.ajax({
                    url: "/ActiveCode/Lottery",
                    type: 'POST',
                    data: {
                        "userid": hdata.attr('data-userid'),
                        "version": hdata.attr('data-version'),
                        "phoneid": hdata.attr('data-phoneid'),
                        "source": hdata.attr('data-source'),
                        "channel": hdata.attr('data-channel'),
                        "city": hdata.attr('data-city'),
                        "pass": hdata.attr('data-pass'),
                        "t":  hdata.attr('data-t'),
                        "tamper": hdata.attr('data-tamper'),
                        "orangilUrl": hdata.attr('data-orangilUrl')
                    },
                    dataType: "json",
                    success: function(data) {
                        //data.Status(状态0非正常抽奖（不在日期范围内，未签到），1抽中奖品，2未抽中奖品，-1未登录，-2操作异常) data.Msg(返回消息) data.Url(未登录时的登录地址)
                        //data.PrizeName(中奖名称) data.Position(中奖位置)
                        switch (data.Status) {
                            case 1:
                                myexports.rotateSet(data.Position, data.PrizeName);
                                oCount.text(parseInt(oCount.text(), 10) - 1);
                                break;
                            case 2:
                                myexports.rotateSet(data.Position, data.PrizeName);
                                oCount.text(parseInt(oCount.text(), 10) - 1);
                                break;
                            case -1:
                                location.href = data.Url;
                                break;
                            default:
                                _uzm.pop.toast(data.Msg);
                                oThis.removeClass('btn-off');
                                break;
                        }
                    },
                    error: function() {
                        _uzm.pop.toast("操作失败，请稍后再试！");
                        oThis.removeClass('btn-off');
                    }
                });
            }
        }
    });
};

myexports.rotateSet = function(key, prizeName) {
    var lBox = $('#j_dialBox');
    var rotateMod = lBox.find('.rotate-mod');
    var btnStart = lBox.find('.btn-start');
    var dItem = lBox.find('.dot-item');
    var unitAngle = 45;
    var timeOut = function() { //超时函数
        var i = 0;
        var j = 0;
        var drt = 10000; // 持续时间
        var cycle = 6; // 圈数
        var speed = drt / cycle / 16; // 16个灯，78.125
        var Time = setInterval(function() { // 跑马灯
            if (i === 16) {
                i = 0;
                j = 16;
            }
            if (i === 0) {
                j = 15;
            } else {
                j = i - 1;
            }
            dItem.eq(j).removeClass('on');
            dItem.eq(i).addClass('on');
            i++;
        }, speed);
        rotateMod.rotate({
            angle: 0,
            duration: drt,
            animateTo: cycle * 360, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的
            step: function(ang) {
                if (ang >= 360 - key * unitAngle - unitAngle + cycle * 360) { // 跑马灯停止
                    clearInterval(Time);
                    dItem.removeClass('on');
                }
            },
            callback: function() {
                // code
                btnStart.removeClass('btn-off');
            }
        });
    };
    var rotateFunc = function(awards, angle, prizeName) { //awards:奖项，angle:奖项对应的角度
        var i = 0;
        var j = 0;
        var drt = 5000; // 持续时间
        var cycle = 4; // 圈数
        var speed = drt / cycle / 16; // 16个灯，78.125
        var Time = setInterval(function() { // 跑马灯
            if (i === 16) {
                i = 0;
                j = 16;
            }
            if (i === 0) {
                j = 15;
            } else {
                j = i - 1;
            }
            dItem.eq(j).removeClass('on');
            dItem.eq(i).addClass('on');
            i++;
        }, speed - speed / (16 - awards * 2));
        rotateMod.stopRotate();
        rotateMod.rotate({
            angle: 0,
            duration: drt,
            animateTo: angle + cycle * 360, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
            step: function(ang) {
                if (ang >= angle - unitAngle + cycle * 360) { // 跑马灯停止
                    clearInterval(Time);
                    dItem.removeClass('on');
                }
            },
            callback: function() {
                switch(awards) {
                    case 1: // 100元
                        _uzm.mask.show();
                        $('#j_popHb100').show();
                        break;
                    case 2: // 国内游
                        _uzm.mask.show();
                        $('#j_popGny').show();
                        break;
                    case 3: // 500元
                        _uzm.mask.show();
                        $('#j_popHb500').show();
                        break;
                    case 4: // 未中奖
                        _uzm.mask.show();
                        $('#j_popNull').show();
                        break;
                    case 5: // 200元
                        _uzm.mask.show();
                        $('#j_popHb200').show();
                        break;
                    case 6: // 演唱会门票
                        _uzm.mask.show();
                        $('#j_popMsds').show();
                        break;
                    case 7: // 欧洲游
                        _uzm.mask.show();
                        $('#j_popOzy').show();
                        break;
                    case 8: // 迪士尼门票
                        _uzm.mask.show();
                        $('#j_popDsn').show();
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
        rotateFunc(key, 360 - key * unitAngle, prizeName);
    }
};

myexports.getSignInRecord = function(nowDate, cb) { // 签到记录
    var box = $('.cont2-box');
    var qdBox = box.find('.qd-box');
    var date = new Date(nowDate);
    var sNowDay = (date.getMonth() + 1) + '.' + date.getDate();

    qdBox.find('.qd-record').find('.timer').text(sNowDay); // 当天日期

    $.ajax({
        type: 'GET',
        url: _uzm.domain.wapi+'/api/UzaiActivity/GetSignInfo',
        data: {
            'UserId': hdata.attr('data-userid'),
            'ActivityId': hdata.attr('data-activityid')
        },
        dataType: 'jsonp',
        async: false,
        cache: false,
        success: function(data) {
            var items = box.find('.qd-body').find('.b-list');
            var db = $('#j_dialBox');
            var signDay = data.SignDay;

            if (data) {
                qdBox.find('.qd-con2').find('em').text(signDay); // 已连续签到
                db.find('.btn-start').find('.number').find('em').text(data.ChouJiangCount); // 抽奖机会
                items.each(function(i) {
                    var o = $(this);
                    var sDate = o.find('.qd-data').attr('sign-data');
                    var iDate = Date.parse(sDate);
                    var iNowDate = Date.parse(nowDate);
                    var asList = data.UzaiActivitySignList;
                    var iLen = asList.length;
                    var index, k, oPrev, nowNum, iSd;


                    for (var j = 0; j < iLen; j++) {
                        iSd = Date.parse(asList[j].SignDate.split('T')[0].replace(/-/g, '/'));
                        if (iDate === iSd) {
                            o.addClass('qd-ing').find('.qd-icon').find('.s1').text(asList[j].Fields1);
                        }
                    }

                    if (iDate < iNowDate) { // 之前
                        !o.hasClass('qd-ing') && o.addClass('qd-lose').find('.qd-icon').find('.s1').text('');
                    } else if (iDate === iNowDate) { // 当天
                        oPrev = o.prev();
                        index = o.index();

                        !o.hasClass('qd-ing') && o.addClass('btn-today');

                        if (o.hasClass('qd-ing')) {
                            nowNum = parseInt(o.find('.qd-icon').find('.s1').text(), 10);
                            qdBox.find('.qd-con1').find('.p1').find('em').text(nowNum); // 当日签到得抽奖数
                            qdBox.find('.qd-record').addClass('qd-on');
                            for (k = 1; k <= 4 - signDay; k++) {
                                if (signDay >= 1) {
                                    items.eq(index + k).find('.qd-icon').find('.s1').text(2);
                                }
                            }
                        } else if (oPrev.hasClass('qd-ing')) {

                            for (k = 0; k < 4 - signDay; k++) {
                                if (signDay >= 1) {
                                    items.eq(index + k).find('.qd-icon').find('.s1').text(2);
                                    qdBox.find('.qd-con1').find('.p1').find('em').text(2); // 当日签到得抽奖数
                                }
                            }
                        } else {
                            for (k = 0; k < 4 - signDay; k++) {
                                if (k === 0) {
                                    items.eq(index + k).find('.qd-icon').find('.s1').text(1);
                                    qdBox.find('.qd-con1').find('.p1').find('em').text(1); // 当日签到得抽奖数
                                } else if (k > 0) {
                                    items.eq(index + k).find('.qd-icon').find('.s1').text(2);
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
};

// 签到
myexports.signIn = function(date) {
    var box = $('.cont2-box');
    var qdBody = box.find('.qd-body');
    var qdRecord = subject.find('.qd-record');
    var startDate = parseInt(Date.parse('2016/8/8 00:00:00'), 10);
    var endDate = parseInt(Date.parse('2016/9/18 23:59:59'), 10);
    // var startDate = parseInt(Date.parse('2016/7/8 00:00:00'), 10);
    // var endDate = parseInt(Date.parse('2016/8/18 23:59:59'), 10);
    var nowTime = parseInt(Date.parse(date), 10);
    var nowDate = date.split(' ')[0];

    qdRecord.on('click', function() {
        var o = $(this);

        if (o.hasClass('sign-off')) {
            return;
        }
        if (parseInt(hdata.attr('data-userid'), 10)) {
            if (nowTime >= startDate && nowTime <= endDate) {
                myexports.getSignInRecord(nowDate);
            }
        }
        o.addClass('sign-off');
        $.ajax({
            url: "/ActiveCode/SignIn",
            type: 'POST',
            data: {
                "userid": hdata.attr('data-userid'),
                "version":hdata.attr('data-version'),
                "phoneid": hdata.attr('data-phoneid'),
                "source": hdata.attr('data-source'),
                "channel": hdata.attr('data-channel'),
                "city": hdata.attr('data-city'),
                "pass": hdata.attr('data-pass'),
                "t": hdata.attr('data-t'),
                "tamper": hdata.attr('data-tamper'),
                "orangilUrl": hdata.attr('data-orangilUrl')
            },
            dataType: "json",
            success: function(data) {
                //data.Status(状态 格式（0签到失败，1签到成功，-1未登录，-2操作异常）) data.Msg(返回消息 格式（"签到成功"）) data .SignDates(已签到日期格式：2016-07-18;2016-07-20;2016-07-21;)data.SignDay(连续签到天数 格式（整型数字）) data.ChouJiangCount(可抽奖次数 格式（整型数字）)
                switch (data.Status) {
                    case 1:
                        o.addClass('qd-on');
                        qdBody.find('.qd-data').each(function(){
                            var oThis = $(this);
                            var sd = oThis.attr('sign-data');
                            if (Date.parse(nowDate) === Date.parse(sd)) {
                                oThis.parent().addClass('qd-ing');
                                return false;
                            }
                        });
                        box.find('.qd-box').find('.qd-con2').find('em').text(data.SignDay); // 已连续签到
                        $('#j_dialBox').find('.btn-start').find('.number').find('em').text(data.ChouJiangCount); // 抽奖机会
                        break;
                    case -1:
                        location.href = data.Url;
                        break;
                    default:
                        _uzm.pop.toast(data.Msg);
                        break;
                }
                o.removeClass('sign-off');
            },
            error: function() {
                _uzm.pop.toast("操作失败，请稍后再试！");
                o.removeClass('sign-off');
            }
        });
    });

    qdBody.on('click', '.btn-today', function() {
        var o = $(this);

        if (o.hasClass('today-off')) {
            return;
        }
        if (parseInt(hdata.attr('data-userid'), 10)) {
            if (nowTime >= startDate && nowTime <= endDate) {
                myexports.getSignInRecord(nowDate);
            }
        }
        o.addClass('today-off');
        $.ajax({
            url: "/ActiveCode/SignIn",
            type: 'POST',
            data: {
                "userid": hdata.attr('data-userid'),
                "version":hdata.attr('data-version'),
                "phoneid": hdata.attr('data-phoneid'),
                "source": hdata.attr('data-source'),
                "channel": hdata.attr('data-channel'),
                "city": hdata.attr('data-city'),
                "pass": hdata.attr('data-pass'),
                "t": hdata.attr('data-t'),
                "tamper": hdata.attr('data-tamper'),
                "orangilUrl": hdata.attr('data-orangilUrl')
            },
            dataType: "json",
            success: function(data) {
                //data.Status(状态 格式（0签到失败，1签到成功，-1未登录，-2操作异常）) data.Msg(返回消息 格式（"签到成功"）) data .SignDates(已签到日期格式：2016-07-18;2016-07-20;2016-07-21;)data.SignDay(连续签到天数 格式（整型数字）) data.ChouJiangCount(可抽奖次数 格式（整型数字）)
                switch (data.Status) {
                    case 1:
                        qdRecord.addClass('qd-on');
                        o.addClass('qd-ing');
                        box.find('.qd-box').find('.qd-con2').find('em').text(data.SignDay); // 已连续签到
                        $('#j_dialBox').find('.btn-start').find('.number').find('em').text(data.ChouJiangCount); // 抽奖机会
                        break;
                    case -1:
                        location.href = data.Url;
                        break;
                    default:
                        _uzm.pop.toast(data.Msg);
                        break;
                }
                o.removeClass('today-off');
            },
            error: function() {
                _uzm.pop.toast("操作失败，请稍后再试！");
                o.removeClass('today-off');
            }
        });
    });
};

//获取签到信息
myexports.GetSignInfo = function() {
    var myDate = new Date();
    var nyear = myDate.getFullYear();
    var qdData = subject.find('.qd-data').text();
    var qdData2 = qdData.replace('.', '/');
    var qdtime = nyear+'/'+qdData2;
    var qdhm = Date.parse(qdtime);


    var signData = '2016-08-08;2016-08-09;2016-08-11;2016-08-13;';
    var signData1 = signData.split(';');
    var signData2 = signData.replace(/-/g,'/');
    var signhm = Date.parse(signData2);
    var slast = signData1[signData1.length-2];
    var slast1 = slast.replace(/-/g,'/');

    $('.qd-data').each(function(){
        var sd = $(this).attr('sign-data');
        var sd1 = new RegExp(sd);
        var tp =$(this).parent();
        if(sd1.test(signData2)){
            tp.addClass('qd-ing');
        }
        if (slast1===sd) {
            tp.addClass('qd-ing');
            var tpindex = tp.index();
            tp.each(function(){
                // $(this).prevAll().addClass('qd-ing');
            });
        }
    });

    // if (qdhm === signhm) {
    //     $(this).addClass('qd-ing');
    //     $('[sign-data=signData2]').addClass('qd-ing');
    // }else if(qdhm > signhm){
    //     // $(this).removeClass('qd-ing');
    //     $('.qd-data').each(function(){
    //         var sd = $(this).attr('sign-data');
    //         if(signData2==sd){
    //             $(this).parent().addClass('qd-ing');
    //         }
    //     });
    // }else{
    //     $('[sign-data=signData2]').addClass('qd-lose').removeClass('qd-ing');
    // }

    $.ajax({
        url: "/ActiveCode/SignIn",
        type: 'POST',
        data: { "UserId": hdata.attr("data-userid"), "ActivityId":hdata.attr("data-activityid")},
        dataType: "json",
        success: function (data) {
            //data.Success
            //data.Message = "获取成功",
            //data.SignDates(已签到日期格式：2016-07-18;2016-07-20;2016-07-21;)
            //data.SignDay(连续签到天数)
            //data.ChouJiangCount(可抽奖次数)
            if (data.Success&&data.Message === "获取成功") {
                var signData = data.SignDates;
                var signData2 = signData.replace(/-/g, '/');
                var signhm = Date.parse(signData2);

                // if (qdtime === signData2) {
                //     $('.qd-prev').each(function(){
                //         $('.qd-prev').addClass('qd-ing');
                //     });
                // }

            }

        },
        error: function () {
            // _uzm.pop.toast("操作失败，请稍后再试！");
        }
    });
};

// 收藏线路
// myexports.saveRoute = function () {

//     $('.r-btn').on('click', function () {
//         var o = $(this);
//         var pid = o.attr("pid");
//         var op1 = o.find('.p1');

//         //check login
//         if (o.hasClass('save-on')) {
//             $.ajax({
//                 url: "/ActiveCode/DeleteFavoriteProduct",
//                 type: 'POST',
//                 data: {
//                     "userid": hdata.attr('data-userid'),
//                     "version":hdata.attr('data-version'),
//                     "phoneid": hdata.attr('data-phoneid'),
//                     "source": hdata.attr('data-source'),
//                     "channel": hdata.attr('data-channel'),
//                     "city": hdata.attr('data-city'),
//                     "pass": hdata.attr('data-pass'),
//                     "t": hdata.attr('data-t'),
//                     "tamper": hdata.attr('data-tamper'),
//                     "orangilUrl": hdata.attr('data-orangilUrl'),
//                     "pid":pid
//                 },
//                 dataType: "json",
//                 success: function(data) {
//                     //data.Status(状态 格式（0签到失败，1签到成功，-1未登录，-2操作异常）) data.Msg(返回消息 格式（"签到成功"）) data .SignDates(已签到日期格式：2016-07-18;2016-07-20;2016-07-21;)data.SignDay(连续签到天数 格式（整型数字）) data.ChouJiangCount(可抽奖次数 格式（整型数字）)
//                     switch (data.Status) {
//                         case 1:
//                             o.removeClass('save-on');
//                             _uzm.pop.toast('取消收藏成功');
//                             op1.text('立即收藏');
//                             break;
//                         case -1:
//                             location.href = data.Url;
//                             break;
//                         case 0:
//                             _uzm.pop.toast('取消失败');
//                             break;
//                         case -2:
//                             _uzm.pop.toast('取消失败');
//                             break;
//                         default:
//                             _uzm.pop.toast(data.Msg);
//                             break;
//                     }
//                 },
//                 error: function() {
//                     _uzm.pop.toast("操作失败，请稍后再试！");
//                 }
//             });

//         } else {
//             $.ajax({
//                 url: "/ActiveCode/AddFavoriteProduct",
//                 type: 'POST',
//                 data: {
//                     "userid": hdata.attr('data-userid'),
//                     "version":hdata.attr('data-version'),
//                     "phoneid": hdata.attr('data-phoneid'),
//                     "source": hdata.attr('data-source'),
//                     "channel": hdata.attr('data-channel'),
//                     "city": hdata.attr('data-city'),
//                     "pass": hdata.attr('data-pass'),
//                     "t": hdata.attr('data-t'),
//                     "tamper": hdata.attr('data-tamper'),
//                     "orangilUrl": hdata.attr('data-orangilUrl'),
//                     "pid":pid
//                 },
//                 dataType: "json",
//                 success: function(data) {
//                     //data.Status(状态 格式（0签到失败，1签到成功，-1未登录，-2操作异常）) data.Msg(返回消息 格式（"签到成功"）) data .SignDates(已签到日期格式：2016-07-18;2016-07-20;2016-07-21;)data.SignDay(连续签到天数 格式（整型数字）) data.ChouJiangCount(可抽奖次数 格式（整型数字）)
//                     switch (data.Status) {
//                         case 1:
//                             o.addClass('save-on');
//                             _uzm.pop.toast('收藏成功');
//                             op1.text('收藏成功');
//                             break;
//                         case -1:
//                             location.href = data.Url;
//                             break;
//                         case 0:
//                             _uzm.pop.toast('收藏失败');
//                             break;
//                         case -2:
//                             _uzm.pop.toast('收藏失败');
//                             break;
//                         default:
//                             _uzm.pop.toast(data.Msg);
//                             break;
//                     }
//                 },
//                 error: function() {
//                     _uzm.pop.toast("操作失败，请稍后再试！");
//                 }
//             });
//         }




//     });
// };

$(function() {
    myexports.init();
});