"use strict";

var myexports = {};

myexports.init = function () {
    myexports.drop();
    myexports.choose();
    myexports.loadCity();
    myexports.submitForm();
    myexports.customFilter();
};

//载入cookie 城市 
myexports.loadCity = function () {
    var ck = _uzm.cookie.get('uzmCity');
    $('#j_startCity').val('');
    ck && $('#j_startCity').val(ck.split('-')[0]);
};

//下拉
myexports.drop = function () {
    $('#j_customize').find('dd').on('click', function () {
        var o = $(this);
        var on = o.next('.drop');
        if (on.css('display') == 'none') {
            o.addClass('on');
            on.show();
        } else {
            o.removeClass('on');
            on.hide();
        }
    });
};

//选择
myexports.choose = function () {
    $('#j_customize').find('.drop').find('li').on('click', function () {
        var o = $(this);
        var opd = o.parents('.drop').prev('dd');
        var ohide = opd.find('input');
        var ospn = opd.find('span');

        var os = o.siblings('li');
        var ot = $.trim(o.text());

        os.removeClass('on');
        o.addClass('on');

        o.parents('.drop').prev('.on').removeClass('on');

        //fix value
        ohide.val(ot);
        ospn.text(ot);
        o.parents('.drop').hide();

    });
};

//提交表单
myexports.submitForm = function () {

    var pop = function (obj, v) {
        _uzm.pop.toast(v);
        //obj.focus();
    };

    $('#j_btnSubmit').on('click', function () {

        var obtn = $(this);

        if (obtn.hasClass('btn-off') || obtn.val() == '已完成') {
            return;
        }

        var sb = [];
        var push = function (obj, name) {
            if (obj.val()) {
                sb.push(name + '=' + obj.val());
            }
        };

        var b = true;

        var startcityname = $('input[name=startcityname]');
        var locationName = $('input[name=locationName]');
        var goDate = $('input[name=goDate]');
        var goDays = $('input[name=goDays]');
        var goType = $('input[name=goType]');
        var hotelType = $('input[name=hotelType]');
        var priceType = $('input[name=priceType]');
        var person = $('input[name=person]');
        var son = $('input[name=son]');
        var username = $('input[name=username]');
        var mobile = $('input[name=mobile]');
        var email = $('input[name=email]');

        if (!startcityname.val()) {
            pop(startcityname, '请填写出发城市');
            return false;
        } else {
            push(startcityname, 'startcityname');
        }

        if (!locationName.val()) {
            pop(locationName, '请填写目的地');
            return false;
        }
        else {
            push(locationName, 'locationName');
        }



        if (!goDate.val()) {
            pop(goDate, '请选择出发日期');
            return false;
        } else {
            var rd = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();//今天
            var myd = goDate.val().replace('年', '/').replace('月', '/').replace('-', '/').replace('-', '/');
            if (Date.parse(myd) < Date.parse(rd)) {
                pop(goDate, '出发日期大于等于今天');
                return false;
            }
            else {
                push(goDate, 'goDate');
            }
        }

        if (goDays.val()) {
            push(goDays, 'goDays');
        } else {
            pop(goDays, '请选择行程天数');
            var dp = goDays.parent('dd');
            if (!dp.hasClass('on')) {
                dp.click();
            }
            return false;
        }

        if (!priceType.val()) {
            pop(priceType, '请填写人均预算');
            return false;
        } else {
            push(priceType, 'priceType');
        }

        if (!person.val()) {
            pop(person, '请填写成人数');
            return false;
        } else if (parseInt(person.val(),10) < 2) {
            pop(person, '成人数最小为2人');
            return false;
        } else {
            push(person, 'person');
        }

        if (son.val()) {
            push(son, 'son');
        }

        if (!username.val()) {
            pop(username, '请输入姓名');
            return false;
        } else {
            push(username, 'username');
        }

        if (!mobile.val()) {
            pop(mobile, '请填写手机号');
            return false;
        } else {
            if (!_uzm.regexForm.mobile(mobile.val())) {
                pop(mobile, '请填写正确的手机号');
                return false;
            } else {
                push(mobile, 'mobile');
            }
        }

        if (!email.val()) {
            pop(email, '请填写正确的邮箱');
            return false;
        } else {
            if (!_uzm.regexForm.email(email.val())) {
                pop(email, '请填写正确的邮箱');
                return false;
            } else {
                push(email, 'email');
            }
        }




        if (goType.val()) {
            push(goType, 'goType');
        }

        if (hotelType.val()) {
            push(hotelType, 'hotelType');
        }


        //提交表单
        var u = "/dzsubmit";
        $.ajax({
            url: u,
            type: 'POST',
            data: sb.join('&'),
            dataType: 'json',
            beforeSend: function () {
                obtn.val('提交中...');
                obtn.addClass('btn-off');
            },
            success: function (data) {
                if (data.MC == '1000') {
                    obtn.val('已完成');
                    obtn.addClass('btn-off');
                    _uzm.pop.confirm('<div class="tit f18 mb5">温馨提示</div><p style="text-align:left;" class="f15">您已成功提交定制信息，旅游管家会在1个工作日内以021-33977886联系您，请您保持手机畅通。</p>');

                    window._gsCallback && window._gsCallback(data);

                    //_uzm.pop.toast('您的需求已提交');
                } else {
                    obtn.val('提交');
                    obtn.removeClass('btn-off');
                    _uzm.pop.toast('提交失败');
                }
            },
            error: function () {
                obtn.val('提交');
                obtn.removeClass('btn-off');
            }
        });
    });
};

//初始化生成全部节点
myexports.renderInitAllNode = function (index) {
    var oSCA = $('#j_sjCustomAutocomp');
    var oWrap = oSCA.parent();
    var oIO = $("#IsOut");

    var _initNode = function (cityList) {
        var tlLen = cityList.length;

        oSCA.empty().hide();
        oWrap.css({ 'z-index': 'auto' });

        var html = cityList.map(function (item, idx, arr) {
            return "<li><span class='s0'>" + item.cityurl + "</span><span class='s1'>" + item.name + "</span></li>";
        });
        oSCA.append(html);
    };

    if (index === 1) {
        oIO.val(0);
        _initNode(window.sjCityList.data.domestic.cityList);
    } else {
        oIO.val(1);
        _initNode(window.sjCityList.data.intercity.cityList);
    }

    oSCA.find('li').on('mouseenter', function () {
        var o = $(this);
        oSCA.find('li').removeClass('on');
        o.addClass('on');
    });

};

//共用autocomplete
myexports.customFilter = function () {
    var oSCA = $('#j_sjCustomAutocomp');
    var oWrap = oSCA.parent();
    var oTD = $('#txtDestiation');

    myexports.renderInitAllNode(0);

    //即时输入智能filter
    var unitKeyEvent = function (o) {
        var scaLi = oSCA.find('li');
        var ov = $.trim(o.val().toUpperCase());

        if (!ov) {
            o.focus();
            oSCA.hide();
            oWrap.css({ 'z-index': 'auto' });
            return;
        }

        var ot = o.offset().top;
        var ol = o.offset().left;
        var oh = o.height();

        oSCA.show();
        oWrap.css({ 'z-index': 10 });
        oSCA.find('.li-none').remove();

        scaLi.each(function (k, v) {
            var oo = $(this);
            var oot = oo.text().toUpperCase();
            var ootAbb = oo.find('s0').text();
            if (oot.indexOf(ov) > -1) {
                oo.show();
                // console.log(oot);
            } else {
                oo.hide();
            }
        });

        var initLis = [];

        oSCA.find('li').each(function (k, v) {
            var oo = $(this);
            if (oo.css('display') === 'list-item') {
                initLis.push(oo);
            }
        });

        var lisLen = initLis.length;

        if (lisLen === 0) {
            oSCA.hide();
            oWrap.css({ 'z-index': 'auto' });
        } else if (lisLen === 1) {
            if (oSCA.find('.s1').text() === $.trim(o.val().toUpperCase())) {
                oSCA.hide();
                oWrap.css({ 'z-index': 'auto' });
            }
        } else if (lisLen > 15) {
            for (var i = 0; i < initLis.length; i++) {
                var item = initLis[i];
                if (i >= 15) {
                    item.hide();
                }
            }
        }

        //绑定点击事件
        scaLi.off('click');
        oSCA.find('li').on('click', function () {
            var node = $(this);
            if (node.css('display') == 'list-item') {
                var ncn = node.find('.s1').text();
                o.val(ncn); //设置值
                oSCA.hide();
                oWrap.css({ 'z-index': 'auto' });
                oSCA.find('.on').removeClass('on');
            }
        });

    };

    //autocomplete筛选
    oTD.on('keyup', function (e) {
        var o = $(this);
        unitKeyEvent(o);
    });

    //全局关闭
    $(document).click(function (event) {
        if ($(event.target).attr("id") != "txtDestiation") {
            oSCA.hide();
            oWrap.css({ 'z-index': 'auto' });
        }
    });
};

$(function () {
    myexports.init();
});
