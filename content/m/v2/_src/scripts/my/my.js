"use strict";

var myexports = {};

var oPhoneId = null;
var oSource = null;
var oVersion = null;
var oUserId = null;

myexports.init = function () {

    oPhoneId = $("#hdphoneId").val();
    oSource = $("#hdsource").val();
    oVersion = $("#hdversion").val();
    oUserId = $("#hduserId").val();

    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
        window.slider.api('j_topSlider', 'j_topSliderWrap', 5000, true);
        window.slider.api('j_fullColumnSlider', 'j_fullColumn', 5000, true);
    });

    myexports.user();
    myexports.checkInPop();
    myexports.checkIn();
    myexports.unitShare();
    myexports.exchangeStore();
    myexports.submitAddressForm();
    myexports.appleActivityTips();
    myexports.myTab();
};

myexports.user = function () {
    var userid = _uzm.user.userid;
    if (userid) {
        $('#j_userUnlogin').hide();
        $('#j_userLogin').show();
    } else {
        $('#j_userUnlogin').show();
        $('#j_userLogin').hide();
    }
};

var _popBox = function (obj, closeNode) {
    closeNode = closeNode || '.j_popClose';
    _uzm.mask.show();
    obj.css({ 'opacity': 1, 'z-index': 1000 }).on('click', closeNode, function () {
        _uzm.mask.hide();
        obj.css({ 'opacity': 0, 'z-index': -1 });
    });
};

myexports.checkInPop = function () {

    //分享成功
    var isCheck = $('#j_activityItems').find('.earn-ud').attr('data-ischeck');
    if (isCheck == '1') {
        $('#j_popUdAdd .pop-hd').find("img").attr('src', 'http://r01.uzaicdn.com/content/m/v2/images/my/icon55.png');
        _popBox($('#j_popUdAdd'));
    }

    $('#j_btnRule').on('click', function () {
        _popBox($('#j_popRuleBox'));
    });

    $('#j_pushMoney').on('click', function () {
        _popBox($('#j_popGetBox'));
    });

    //        $('#j_gain').on('click', function () {
    //            _popBox($('#j_popGetBox'));
    //        });

    //        $('#j_submitAddress').on('click', function () {
    //            _popBox($('#j_popGetBox'));
    //        });

    //        $('#j_btnCheckin').on('click', function () {
    //            _popBox($('#j_popUdAdd'));
    //        });
    //赚U点
    $('#j_activityItems').on('click', '.earn-ud', function () {
        if (oUserId > 0) {
            if (isCheck == '2') {
                $('#j_popShareBox').find('a').text("已分享").attr('href', '#');
            }
            _popBox($('#j_popShareBox'));
        } else {
            $.ajax({
                url: '/Sign/CheckLogin',
                type: 'Post',
                dataType: 'json',
                data: { version: oVersion, phoneid: oPhoneId, source: oSource, userId: oUserId, ran: Math.random() },
                //data: { version: '5.3.5', phoneid: '823482302939823', source: 'android', userId: 1664916, ran: Math.random() },
                success: function (data) {
                    if (data.Status == 1) {
                        if (isCheck == '2') {
                            $('#j_popShareBox').find('a').text("已分享");
                            $('#j_popShareBox').find('a').attr('href', '#');
                        }
                        _popBox($('#j_popShareBox'));
                    } else {
                        location.href = data.Url;
                    }
                }
            });
        }
    });
    //分享立减
    $('#j_activityItems').on('click', '.shared', function () {
        if (oUserId > 0) {
            if (isCheck == '2') {
                $('#j_popShareBox').find('a').text("已分享");
                $('#j_popShareBox').find('a').attr('href', '#');
            }
            _popBox($('#j_popShareBox'));
        } else {
            $.ajax({
                url: '/Sign/CheckLogin',
                type: 'Post',
                dataType: 'json',
                data: { version: oVersion, phoneid: oPhoneId, source: oSource, userId: oUserId, ran: Math.random() },
                //data: { version: '5.3.5', phoneid: '823482302939823', source: 'android', userId: 1664916, ran: Math.random() },
                success: function (data) {
                    if (data.Status == 1) {
                        if (isCheck == '2') {
                            $('#j_popShareBox').find('a').text("已分享");
                            $('#j_popShareBox').find('a').attr('href', '#');
                        }
                        _popBox($('#j_popShareBox'));
                    } else {
                        location.href = data.Url;
                    }
                }
            });
        }
    });
    $('#j_popShareBox').find('a').click(function () {
        _uzm.mask.hide();
        $('#j_popShareBox').css({ 'opacity': 0, 'z-index': -1 });
        return true;
    });
};

myexports.checkIn = function () {

    var _popBox = function (obj, closeNode) {
        closeNode = closeNode || '.j_popClose';
        _uzm.mask.show();
        obj.css({ 'opacity': 1, 'z-index': 1000 }).on('click', closeNode, function () {
            _uzm.mask.hide();
            obj.css({ 'opacity': 0, 'z-index': -1 });
        });
    };
    var btn = $('#j_btnCheckin');
    //签到
    btn.on('click', function () {
        var oThis = $(this);
        //防止用户重复请求
        if (oThis.attr('disabled') == 'disabled')
            return false;
        $.ajax({
            url: '/Sign/SignUser',
            type: 'Post',
            dataType: 'json',
            data: { version: oVersion, phoneid: oPhoneId, source: oSource, userId: oUserId, ran: Math.random() },
            //data: { version: '5.3.5', phoneid: '823482302939823', source: 'android', userId: 1664916, ran: Math.random() },
            success: function (data) {
                var ds = parseInt(data.Status, 10);
                if (ds == 1) {
                    $("#SignTodayAmount").html(data.Amount);
                    $("#SignTotalAmount").html(data.TotalAmount);
                    oThis.attr('disabled', 'disabled');
                    oThis.addClass('btn-disabled');
                    oThis.val("今日已签");
                    $('#j_popUdAdd .pop-hd').find("img").attr('src', 'http://r01.uzaicdn.com/content/m/v2/images/my/icon54.png');
                    _popBox($('#j_popUdAdd'));
                } else if (ds == -1) {
                    location.href = data.Url;
                }
                else if (ds === 0) {
                    location.href = data.Url;
                } else if (ds == -2) {
                    _uzm.pop.toast(data.Msg);
                    _uzm.mask.hide();
                }
                else {
                    _uzm.mask.hide();
                }
            }
        });
    });


};

myexports.unitShare = function () {
    var oEB = $('.j_explainBox'),
        oCI = oEB.find('.cont-inner'),
        oSB = oEB.find('.switch-bar'),
        num = 63;

    oCI.each(function () {
        var oThis = $(this);
        var oSwitch = oThis.parent('.explain-cont').siblings('.switch-bar');

        if (oThis.height() <= num) {
            oSwitch.hide();
        }
    });

    oSB.on('click', function () {
        var oThis = $(this),
            ec = oThis.siblings('.explain-cont');
        if (ec.hasClass('cut')) {
            oThis.find('.switch').addClass('on').text('收起');
            ec.removeClass('cut');
        } else {
            oThis.find('.switch').removeClass('on').text('更多');
            ec.addClass('cut');
        }

        // if (ec.text() === '更多') {
        //     oThis.find('.switch').addClass('on').text('收起');
        //     ec.css({'height': 'auto', 'overflow': 'hidden'});
        // } else {
        //     oThis.find('.switch').removeClass('on').text('更多');
        //     ec.css({'height': num, 'overflow': 'auto'});
        // }
    });
};

var _popTipsEs = function (sCont, sFoot, tipsClass) {
    sCont = (typeof sCont === 'undefined') ? '' : sCont;
    sFoot = (typeof sFoot === 'undefined') ? '' : sFoot;
    tipsClass = (typeof tipsClass === 'undefined') ? '' : tipsClass;
    var hGather = [];

    $('#j_popTipsEs').remove();

    hGather.push('<div id="j_popTipsEs" class="pop-tips-es pop-mod">');
    hGather.push('<div class="pop-inner">');
    hGather.push('<div class="tips-cont ' + tipsClass + '">');
    hGather.push('<dl class="cont-txt tc">' + sCont + '</dl>');
    hGather.push('<i class="pop-close j_popClose"></i>');
    hGather.push('</div>');
    hGather.push('<div class="pop-ft tc mt15">' + sFoot + '</div>');
    hGather.push('</div>');
    hGather.push('</div>');
    $('body').append(hGather.join(''));

    var popBox = $('#j_popTipsEs');

    popBox.css({ 'opacity': 1, 'z-index': 1000 });
    popBox.on('click', '.j_popClose', function () {
        popBox.css({ 'opacity': 0, 'z-index': -1 });
        // popBox.remove();
        hGather = [];
    });
};

myexports.submitAddressForm = function () {
    $('#j_submitAddressnew').on('click', function () {
        var o = $(this);
        if ($.trim($("#txtReceiveName").val()).length === 0) {
            _uzm.pop.toast("收件人不能为空");
            return;
        }
        if ($.trim($("#txtprovince option").not(function () {
            return !this.selected;
        }).text()).length === 0 || $("#txtprovince option").not(function () {
            return !this.selected;
        }).text() == '--请选择省份--') {
            _uzm.pop.toast("请选择省份");
            return;
        }
        if ($.trim($("#txtcity option").not(function () {
            return !this.selected;
        }).text()).length === 0 || $("#txtcity option").not(
            function () {
            return !this.selected;
        }).text() == '--请选择城市--') {
            _uzm.pop.toast("请选择城市");
            return;
        }
        if ($.trim($("#txtarea option").not(function () {
            return !this.selected;
        }).text()).length === 0 || $("#txtarea option").not(function () {
            return !this.selected;
        }).text() == '--请选择地区--') {
            _uzm.pop.toast("请选择地区");
            return;
        }
        if ($.trim($("#txtReceiveAddr").val()).length === 0) {
            _uzm.pop.toast("请输入收货地址");
            return;
        }
        //if ($.trim($("#txtPhone").val()).length === 0) {
        //    _uzm.pop.toast("请填写电话");
        //    return;
        //}
        if ($.trim($("#txtMobile").val()).length === 0) {
            _uzm.pop.toast("请填写手机");
            return;
        }
        if ($.trim($("#txtZip").val()).length === 0) {
            _uzm.pop.toast("请填写邮政编码");
            return;
        }
        var addr = $("#txtprovince option").not(function () {
            return !this.selected;
        }).text() + $("#txtcity option").not(function () {
            return !this.selected;
        }).text() + $("#txtarea option").not(function () {
            return !this.selected;
        }).text() + $("#txtReceiveAddr").val();
        //$("#form").serializeArray()
        _uzm.mask.show();
        $.ajax({
            url: '/sign/SignShopRecordInfoSubmit',
            type: 'Post',
            dataType: 'json',
            data: {
                ReceiveName: $("#txtReceiveName").val(),
                ReceiveAddr: addr,
                mobile: $("#txtMobile").val(),
                zip: $("#txtZip").val(),
                userid: $("#txtUserId").val(),
                prizeId: $("#txtResultId").val(),
                version: $("#hdversion").val(),
                phoneid: $("#hdphoneid").val(),
                source: $("#hdsource").val(),
                channel: $("#hdchannel").val(),
                city: $("#hdcity").val(),
                pass: $("#hdpass").val(),
                t: $("#hdt").val(),
                tamper: $("#hdtamper").val(),
                ran: Math.random()
            },
            success: function (data) {
                var ds = data.Status;
                if (ds == 1) {
                    _popBox($('#j_popGetBox'));
                    return;
                } else if (ds === 0) {
                    _uzm.mask.hide();
                    location.href = data.Url;
                } else if (ds == -2) {
                    _uzm.mask.hide();
                    location.href = data.Url;
                }
                else if (ds == -1) {
                    _uzm.mask.hide();
                    _uzm.pop.toast(data.Msg);
                    return;
                }
            }
        });
        //$('#j_view').on('click', function () {
        //    var oo = $(this);
        //    $('#j_lotteryPop').hide();
        //});
    });
};

myexports.exchangeStore = function () {
    var oCM = $(".exchange-store-detail");
    //领取奖品
    oCM.on('click', '.btn-exchange', function () {
        var oThis = $(this);
        var oLI = oCM;
        var oSN = oLI.find('.surplus-num');
        var sCN = parseInt($("#hidcount").val(), 10);//个人点数
        var sNC = parseInt($("#hidpcount").val(), 10);//耗点数
        var sSN = parseInt($("#hidpnum").val(), 10);//剩余数量
        var sName = oLI.find('.bar-main').text();//产品名称
        var sImg = oLI.find('img').attr('src');//产品图片
        // var sIntro = oLI.find('.item-main').text();//产品简介
        var sPrizeId = $("#hdprizeId").val();//产品ID

        var sUserId = $("#hdUserId").val();
        var sVersion = $("#hdVersion").val();
        var sPhoneId = $("#hdPhoneid").val();
        var sSource = $("#hdSource").val();
        var sResultId = $("#hdResultId");
        var PrizeType = $("#hdPrizeType").val();//产品类别_popTipsEs
        //if (sSN <= 0) {
        //    var sCont = '<dt class="txt-hd f19">啊偶</dt><dd class="txt-bd f15">已兑换完</dd>';
        //    var sFoot = '';
        //    var tipsClass = 'tips-error';
        //    _popTipsEs(sCont, sFoot, tipsClass);
        //}
        if (sCN < sNC) {
            var sCont = '<dt class="txt-hd f19">啊偶</dt><dd class="txt-bd f15">点数不足</dd>';
            var sFoot = '<a href="/sign/index/" class="btn-item bg-f60 white f20">快去赚U点</a>';
            var tipsClass = 'tips-error';
            _popTipsEs(sCont, sFoot, tipsClass);
        } else {
            //   var name = sName;
            //   var img = '<img src="' + sImg + '" alt="" style="width:77px;">';
            //   var intro = '<div class="intro-hd f14 b tc">简介</div><div class="intro-bd f11">' + sIntro + '</div>';
            //通用优惠券和优惠券跳转到兑换页面  实物请求兑换并跳转到填写地址
            //实物
            $.ajax({
                url: '/sign/SignShopGetPrize/',
                type: 'Post',
                dataType: 'json',
                data: { version: sVersion, phoneid: sPhoneId, source: sSource, prizeId: sPrizeId, userId: sUserId, ran: Math.random() },
                success: function (data) {
                    if (parseInt(data.Status, 10) === -3) {
                        _uzm.pop.toast(data.Msg);
                        return;
                    }
                    else if (parseInt(data.Status, 10) === -2) {
                        _uzm.mask.hide();
                        location.href = data.Url;
                        return;
                    }
                    else if (parseInt(data.Status, 10) === -1) {
                        _uzm.pop.toast(data.Msg);
                        return;
                    }
                    else if (parseInt(data.Status, 10) === 0) {
                        _uzm.mask.hide();
                        location.href = data.Url;
                        return;
                    }
                    else if (parseInt(data.Status, 10) === 2) {//实物 跳转到填写地址
                        // alert(data.Url);
                        // alert(data.PrizeType);
                        if (parseInt(data.PrizeType, 10) === 1) {
                            location.href = data.Url;
                            //跳转到填写地址页面
                            // var sFoot = '<a href="' + data.Url + '" class="btn-item bg-f60 white f20">兑换</a>';
                            //  _popExchangeInfo(name, img, intro, sFoot);
                        }
                        else if (parseInt(data.PrizeType, 10) == 3 || parseInt(data.PrizeType, 10) == 2) {

                            location.href = data.Url;
                        }
                    }
                }
            });
        }
    });
};

myexports.appleActivityTips = function () {
    if (_uzm.mobile.isIpad || _uzm.mobile.isIphone) {
        $('.ft-copyright').append('<p class="ap-tips-bar f14 tc">所有奖品和活动均与苹果公司无关</p>');
        $('#j_popRuleBox').find('.pop-bd').children('.cont-box').append('<p> 7.所有奖品与活动均与苹果公司无关。</p>');
    }
};

myexports.myTab = function () {
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        var dtab = $('#j_tab');
        var md = dtab.find('.more-infor');
        md.on('click', function () {
            var t = $(this);
            t.prev('.discount-tips').toggle();
            t.toggleClass('on');
        });

        window.tab.init('j_tab');
    });

};

$(function () {
    myexports.init();

    //  ios 550 紧急处理 phoneid 拿不到的情况 Begin 
    var source = _util.url.get('source'),
        devicetype = _util.url.get('devicetype');

    if (source == 'iphone' || devicetype == 'ios') {

        var hybridversion = _util.url.get('hybridversion');
        if (hybridversion == '3') {
            var sosPhoneid = $("#hdphoneId").val();
            _uzm.cookie.set('sosphoneid', sosPhoneid);
        }


    }
    //  ios 550 紧急处理 phoneid 拿不到的情况 End

});


