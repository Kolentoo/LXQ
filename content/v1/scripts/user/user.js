try {
    document.domain = 'uzai.com';
} catch (e) {

}

$(function () {
    _uzw.ui.tab('j_loginTab', function (index) {
        $('#j_lrfTips').text('');
        $('#j_tabStatus').val(index);
    });
    checkTabStatus();
    getFlexPwd();
    regProtocal();
    agreeProtocal();
    userReg();
    userLogin();
    userFindPWD();
    fnCheck();
    fixPlaceHolder();
    unionLogin();
});

function checkTabStatus() {
    var ov = $('#j_tabStatus').val();
    if (ov == '1') {
        var hdlis = $('.j_loginTab').children('.hd').find('li');
        var bditems = $('.j_loginTab').children('.bd').find('.item');

        hdlis.removeClass('on');
        hdlis.eq(1).addClass('on');

        bditems.hide();
        bditems.eq(1).show();
    }
}

//fix ie6789 placeholder
function fixPlaceHolder() {
    var form = $('.wrap-user');
    _fixPlaceHolder(form);
}

//获取动态密码
function getFlexPwd() {
    var gfp = $('.j_getFlexPwd');
    var gfpi = gfp.children('i');
    var flag = "loginPassword";
    // var ckName = 'uzwGetFlexPwdNum'; //获取次数

    //start  登录注册绑定中，有两个获取动态密码的按钮
    //判断是登录，还是注册的，传递到后台保存不同的手机验证码类型
    $('.j_getFlexPwd').click(function () {
        gfp = $(this);
    });
    // end

    // var _addValidator = function () { // 添加验证码
    //     var ck = parseInt(_uzw.cookie.get(ckName), 10);
    //     if (ck >= 2) {
    //         $('.forms-listing').find('.li-code').show();
    //         gfp.addClass('time-off');
    //         gfp.parents('form').find('input[name=txtPassCode]').focus();
    //     }
    // };

    $('.wrap-user').find('.li-code').show();
    $('.wrap-user').find('#code').show();
    gfp.addClass('time-off');

    //进入页面，立刻倒计时
    var u = location.href.toLowerCase();

    //start  判断是否是注册页面的获取手机验证码
    if (u.indexOf('/register') > -1) {
        flag = 'register';
    }
    //end
    if (u.indexOf('/mobilefindpassword') > -1) {
        flag = "findPassword";
        _unitTimeOut(gfpi, 59, function () {
            gfp.removeClass('time-on time-ing time-off').text('获取码证码');
        });
    }

    //发送动态密码
    var _unitSendFlexPwd = function (v, callback) {

        //start
        flag = "loginPassword"; //默认为登录验证码
        if (u.indexOf('/mobilefindpassword') > -1) {//找回密码验证码
            flag = "findPassword";
        }
        var form_id = gfp.parents("form").attr("id"); //获取发送验证码对象form id
        if (form_id == "j_fromReg" || form_id == "register" || u.indexOf('/register') > -1) { //快速预定，注册并绑定，注册
            flag = 'register';
        }
        var passCode = gfp.parents("form").find("[name='txtPassCode']");  //获取图形验证码对象
        var li = passCode.parents("li"); //获取图形验证码父li
        var grapCode = li.hasClass("hide"); //判断图形验证码是否隐藏
        var pwd = gfp.parents("form").find("[name='pwd']");
        //end

        if (v) {
            $.ajax({
                url: _uzw.domain.u + '/reg/SendMobileCode',
                type: 'GET',
                cache: false,
                dataType: "jsonp",
                data: { "type": flag, "txtPhone": v, "grapCode": grapCode, "codeType": "checkCode", "validatorType": "form", "clientid": "txtValidator", "txtValidator": passCode.val() },
                success: function (data) {
                    if (data) {
                        if (data.status == 1) {
                            callback && callback();
                        } else {
                            //start  错误信息提示
                            if (gfp.parents("form").find("[id='j_lrfTips']").get(0)) {
                                $('#j_lrfTips').text(data.msg);
                            } else if (gfp.parents("form").find("[id='j_lrfTipsOdd']").get(0)) {
                                $('#j_lrfTipsOdd').text(data.msg);
                            }
                            pwd.parent().children(".info").remove();
                            pwd.parent().children(".err-info").remove();
                            if (pageType == 'unBind') { //判断是登录注册绑定页，还是其它页，错误样式不一样
                                pwd.parent().append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>' + data.msg + '</span>');
                            } else {
                                pwd.parent().append('<span class="info">' + data.msg + '</span>'); //pzx
                            }
                            if (flag === 'findPassword' && data.status == 2) { // 找回密码页，需要输入图形验证码
                                passCode.val('').parent('.code-wrap').removeClass('hide');
                                passCode.focus();
                            }
                            //end
                        }
                    }
                }
            });
        }
    };
    gfp.on('click', function () {

        var o = $(this);
        var num = o.attr("data-num"); //，判断次数是如果不是第一次，获取验证码按钮变成重新获取
        if (typeof (num) == "undefined") {
            num = 0;
        }
        var op = o.parents('form');
        var os = op.find('input[name=txtPhone]'); //target input
        var passCode = op.find('input[name=txtPassCode]');
        if (!os.get(0)) {
            os = op.find('input[name=txtPhoneMail]');
        }
        var nv = os.val() || op.find('.s-mobile').attr('data-mobile');

        if (gfp.hasClass('time-off')) {
            os.focus();
        }

        if (gfp.hasClass('time-on') || gfp.hasClass('time-off')) {
            return;
        }

        if (nv) {
            if (_uzw.regexForm.mobile(nv)) {
                if (!passCode.val() && !$(op.find('li')[3]).hasClass('hide') && flag !== 'findPassword') {
                    passCode.focus();
                } else if (!o.hasClass('time-on') || !o.hasClass('time-off')) { // 默认时、图形验证码不正确时为灰色不可点击状态（time-off）,正在倒计时（time-on）
                    // var hackCK = parseInt(_uzw.cookie.get(ckName), 10);
                    // if (hackCK) {
                    //     _uzw.cookie.set(ckName, ++hackCK, 1);
                    //     _addValidator();
                    // } else {
                    //     _uzw.cookie.set(ckName, 1, 1);
                    // }
                    //ajax api 发送动态密码
                    _unitSendFlexPwd(nv, function () {
                        o.addClass('time-on');
                        o.html('<i>59</i>秒');
                        o.attr("data-num", parseInt(num, 10) + 1); //点击按钮次数+1

                        //清空输入框
                        //os.val('');
                        var oi = o.find('i');
                        _unitTimeOut(oi, 59, function () {
                            //点击次数大于0按钮变成重新获取
                            var dnum = o.attr("data-num");
                            o.removeClass('time-on');
                            o.removeClass('time-ing');
                            if (parseInt(dnum, 10) > 0) {
                                o.removeClass('time-off');
                                o.text('重新获取');
                            } else {
                                o.text('获取动态密码');
                            }
                        });

                    });
                }
            } else {
                os.focus();
            }
        } else {
            os.focus();
        }
    });
}

var _unitTimeOut = function (obj, max, callback) {
    var st = setInterval(function () {
        if (max >= 0) {
            obj.text(max--);
        } else {
            if (callback) {
                clearInterval(st);
                callback();
            }
        }

    }, 1000);
};

function regProtocal() {
    $('#j_protocalTrigger').on('click', function () {
        var o = $(this);
        _uzw.ui.mask.show(function () {
            var wp = $('#j_regProtocalWrap');
            wp.show();
            wp.find('.close').on('click', function () {
                _uzw.ui.mask.hide(function () {
                    wp.hide();
                });
            });
        });
    });
}

function pageRedirect() {
    var o = $('#j_pageReturn');
    if ($("[name='hidden_UpPageURL']").val().indexOf("outbound/proc_one/") !== -1) {
        try {
            _uzw.user.reload();
        } catch (e) {

        }
        window.setTimeout(function () {
            location.href = $("[name='hidden_UpPageURL']").val();
        }, 2000);

        return;
    }


    if (o.get(0)) {
        _unitTimeOut(o, 5, function () {
            location.href = _uzw.domain.u + "/reguser";
        });
    }
}

var _fixPlaceHolder = function (form) {

    if (!form.get(0)) {
        return;
    }

    var txts = form.find('input');

    //处理input:text IE6789 focus blur事件
    var unitFB = function (o) {
        if (o.attr('type') == 'text') {
            var oph = o.attr('placeholder');
            o.val(oph);
            o.on('focus', function () {
                var ov = o.val();
                if (ov == oph) {
                    o.val('');
                }
            }).on('blur', function () {
                var ov = o.val();
                if (!ov) {
                    o.val(oph);
                }
            });
        }
    };

    //处理input:password IE6789 focus blur事件
    var unitFBPWD = function (o) {
        //新生成的input添加事件
        if (o.attr('type') == 'password') {
            var ocls = o.attr('class');
            var oname = o.attr('name');
            var oid = o.attr('id');
            var oph = o.attr('placeholder');
            var ostyle = o.attr('style');

            o.after('<input type="text" value="' + oph + '" style="' + ostyle + '" class="' + ocls + '" placeholder="' + oph + '" name="' + oname + 'Copy"  id="' + oid + 'Copy" />');
            o.hide();

            var on = o.next('input:text');
            on.on('focus', function () {
                var oo = $(this);
                o.show();
                o.focus();
                oo.hide();
            });

            o.on('blur', function () {
                var ov = o.val();
                if (!ov) {
                    o.hide();
                    on.show();
                }
            });

        }
    };

    //placeholder hack
    if (_util.check.isIE678 || _util.check.isIE9) {
        txts.each(function (k, v) {
            var o = $(this);
            unitFBPWD(o);
            unitFB(o);
        });
    }
};

var LRF = {
    checkAccount: function (clientID, PM, parentNode) {

        //start  判断图形验证码是否隐藏
        var code = parentNode.parents('form').find("[id='code']");
        var hideCode = code.hasClass("hide");
        var validateToken = _uzw.cookie.get("ValidateToken");
        //end

        //ajax
        $.ajax({
            url: _uzw.domain.u + '/reg/Validation',
            cache: false,
            dataType: 'jsonp',
            data: { "clientid": clientID, "txtPhoneMail": PM, "ValidateToken": validateToken },
            success: function (data) {
                if (pageType == 'reg') {
                    if (data.status == '0') {
                        parentNode.append('<span class="ok"></span>');
                        //start  判断只有输入图形验证码正确才能点击获取验证码
                        if (hideCode) {
                            parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-off');
                        } else {
                            if (!code.find(".info").get(0) && code.find("input:first").val()) {
                                parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-off');
                            }
                        }
                        $("#pwd").removeAttr("disabled");
                        parentNode.parents('form').find(".btn-step-one").addClass("reg-next");
                        //end
                    } else if (data.status == '1') {
                        parentNode.siblings('.info-tips').show();
                        $("#pwd").attr("disabled", "disabled");
                        $("#pwd").val("");
                        var op = $("#pwd").parent();
                        op.children('.info').remove();
                        op.children('.ok').remove();
                        parentNode.parents('form').find(".btn-step-one").addClass("reg-next");
                        //start  验证码错误时发送验证码按钮变灰
                        parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-on').addClass('time-off');
                        //end
                    } else {
                        parentNode.append('<span class="info">' + data.msg + '</span>');
                    }
                } else if (pageType == 'findpassword') {
                    if (data.status == '1') {
                        parentNode.append('<span class="ok"></span>');
                    } else {
                        parentNode.append('<span class="info">' + data.msg + '</span>');
                    }
                } else if (pageType == 'unBind') { // 登录并绑定页面

                    //start  光标离开时判断用户名，判断是登录并绑定，还是注册并绑定
                    var id = parentNode.find("input").attr("id");  //找到联合登录页面中，是注册联合判断还是登录联合用户名判断
                    if (id == "txtPhone") {//注册绑定

                        if (data.status == '1') {
                            parentNode.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>帐号已注册，请在右侧登录并绑定</span>');
                            parentNode.parents('form').find('.j_getFlexPwd').addClass('time-off');

                        } else {
                            parentNode.append('<span class="ok-info" style="right:62px;"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                            if (hideCode) {
                                parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-off');
                            } else {
                                if (!code.find(".err-info").get(0) && code.find("input:first").val()) {
                                    parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-off');
                                }
                            }
                        }

                    } else if (id == "txtPhoneMail") { //登录绑定
                        if (data.status == '0') {
                            parentNode.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>帐号未注册，请在左侧注册并绑定</span>');
                            parentNode.parents('form').find('.j_getFlexPwd').addClass('time-off');
                        } else {
                            parentNode.append('<span class="ok-info"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                            if (hideCode) {
                                parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-off');
                            } else {
                                if (!code.find(".err-info").get(0) && code.find("input:first").val()) {
                                    parentNode.parents('form').find('.j_getFlexPwd').removeClass('time-off');
                                }
                            }
                        }
                    }
                    //end
                }
            }
        });
    },
    phone: function (o, cb) {
        var op = o.parent('li');
        if (!op.get(0)) {
            op = o.parent('.tb-wrap'); //新版注册有大改动
        }
        var ov = o.val();
        var oph = o.attr('placeholder');

        //remove info
        op.children('.info').remove();
        op.children('.ok').remove();

        op.siblings('.info-tips').hide();

        o.removeClass('input-err');
        op.children('.info-err').remove();
        // start  给发送短信按钮默为调为灰
        op.parents('form').find('.j_getFlexPwd').addClass('time-off');
        // end
        if (ov && ov != oph) {
            if (!_uzw.regexForm.mobile(ov)) {
                if (pageType == 'login' || pageType == 'reg') {
                    op.append('<span class="info">手机格式错误</span>');
                    //start  如果手机号错误，注册中的下一步按钮为灰
                    op.parents('form').find(".btn-step-one").addClass("reg-next");
                    //end
                }
            } else {
                if (pageType == 'reg') {
                    LRF.checkAccount('txtPhoneMail', ov, op);
                }
                cb && cb();
            }
        }
    },
    phoneMail: function (o) {
        var op = o.parent('li');
        var ov = o.val();
        var oph = o.attr('placeholder');

        //remove info
        op.children('.info').remove();
        op.children('.ok').remove();

        if (ov && ov != oph) {
            if (_uzw.regexForm.email(ov) || _uzw.regexForm.mobile(ov)) {
                if (pageType == 'reg') {
                    LRF.checkAccount('txtPhoneMail', ov, op);
                }
            } else {
                if (pageType == 'findpassword' || pageType == 'reg') {
                    op.append('<span class="info">手机号/邮箱格式错误</span>');
                }
            }
        }
    },
    pwd: function (o) {
        //var op = o.parent('li');
        var op = o.parent();
        var ov = o.val();
        var oph = o.attr('placeholder');

        //remove info
        op.children('.info').remove();
        op.children('.ok').remove();

        //start  注册第二步中的按钮变灰
        var form = op.parents("form");
        form.find(".btn-step-two").addClass("reg-next");

        //注册中判断两次密码
        var rePwd = $("#txtRePwd").val();
        if (typeof (rePwd) !== 'undefined' && rePwd) {
            if (ov != rePwd) {
                $("#txtRePwd").parent().children('.info').remove();
                $("#txtRePwd").parent().children('.ok').remove();
                $("#txtRePwd").parent().append('<span class="info">确认密码不一致</span>');

            }
        }
        //end

        if (ov && ov != oph) {
            if (pageType == 'reg' || pageType == 'findpassword') {
                if (ov.length >= 6 && ov.length <= 16) {
                    op.append('<span class="ok"></span>');
                } else {
                    op.append('<span class="info">6-16位字母/数字/符号</span>');
                }
            }
        }
    },
    repwd: function (o, ot) {
        //var op = o.parent('li');
        var op = o.parent();
        var ov = o.val();
        var oph = o.attr('placeholder');

        //remove info
        op.children('.info').remove();
        op.children('.ok').remove();

        //start  注册第二步中的按钮变灰
        var form = op.parents("form");
        form.find(".btn-step-two").addClass("reg-next");
        //end

        var otv = ot.val();

        if (ov && ov != oph) {
            if (ov.length >= 6 && ov.length <= 16) {
                if (ov == otv) {
                    if (pageType == 'reg' || pageType == 'findpassword') {
                        op.append('<span class="ok"></span>');
                        //start  输入正确下一步按钮变红
                        form.find(".btn-step-two").removeClass("reg-next");
                        //end
                    }
                } else {
                    op.append('<span class="info">确认密码不一致</span>');
                }
            } else {  // 不符合要求提示
                op.append('<span class="info">6-16位字母/数字/符号</span>');
            }
        }
    },
    //start  手机验证码离开时验证是否正确
    checkPhoneCode: function (o, userType) {
        var op = o.parent();
        var ov = o.val();
        var oph = o.attr('placeholder');

        //remove info
        op.children('.info').remove();
        op.children('.ok').remove();

        var form = op.parents("form");

        var form_id = form.attr("id");
        var phone;

        if (form_id == "j_fromBind") {
            phone = form.find("input[id='txtPhoneMail']");
        } else {
            phone = form.find("input[id='txtPhone']");
        }

        if (!phone.get(0)) {
            phone = form.find("input[name='txtPhone']");
        }
        var pwd = form.find("[id='pwd']").val();
        var code = form.find("[id='code']");
        // var code_true;
        // if (code.get(0)) {
        //    code_true = code.hasClass("hide");
        // }

        form.find(".btn-step-one").addClass("reg-next");

        if (ov && ov != oph) {
            var intR = "^([+-]?)\\d*\\.?\\d+$"; //数字
            if (ov.match(intR)) {
                $.ajax({
                    url: _uzw.domain.u + '/ashx/ashxValidatorCode.ashx', //_uzw.domain.u    -pzx
                    dataType: 'jsonp',
                    cache: false,
                    data: { "codeType": "mobileCode", "mobile": phone.val(), "validatorCode": ov, "userType": userType },
                    success: function (data) {
                        if (pageType == "unBind") { //联合登录与注册

                            if (data.status == '1') {
                                op.append('<span class="ok-info" style="right:-30px;"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                                form.find('.j_getFlexPwd').removeClass('time-off');
                            } else {
                                op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>' + data.msg + '</span>');
                            }
                        } else {
                            if (data.status == '1') {
                                op.append('<span class="ok"></span>');
                                form.find(".btn-step-one").removeClass("reg-next");

                            } else {
                                op.append('<span class="info">' + data.msg + '</span>');
                                //form.find('.j_getFlexPwd').addClass('time-off');
                            }
                        }
                    }
                });
            } else {
                if (pageType == "unBind") {
                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>手机验证码错误</span>');
                } else {
                    op.append('<span class="info">手机验证码错误</span>');
                }
            }
        } else {
            if (pageType == "unBind") {
                op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>输入手机验证码</span>');
            } else {
                op.append('<span class="info">输入手机验证码</span>');
            }

        }

    },
    //end
    checkCode: function (o) {
        //var op = o.parent('li');
        var op = o.parent();
        var ov = o.val();
        var oph = o.attr('placeholder');

        //remove info
        op.children('.info').remove();
        op.children('.ok').remove();

        //start
        var form = op.parents("form");
        form.find(".btn-step-one").addClass("reg-next");
        var pwd = form.find("[id='pwd']").val();
        //end

        //普通登陆，弹出登录验证码部分不做验证码验证

        if (ov && ov != oph) {
            var intR = "^([+-]?)\\d*\\.?\\d+$"; //数字
            if (ov.match(intR)) {
                if (pageType == 'reg' || pageType == "unBind" || pageType == "login") { // 登录，注册都进行验证码验证
                    //ajax
                    $.ajax({
                        url: _uzw.domain.u + '/ashx/ashxValidatorCode.ashx', // _uzw.domain.u +
                        dataType: 'jsonp',
                        cache: false,
                        data: { "codeType": "checkCode", "validatorType": "form", "clientid": "txtValidator", "txtValidator": ov },
                        success: function (data) {
                            //start  联合登录绑定验证码验证
                            if (pageType == "unBind") {

                                if (data.status == '1') {
                                    op.append('<span class="ok-info" style="right:-30px;"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                                    form.find('.j_getFlexPwd').removeClass('time-off');

                                } else {
                                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>' + data.msg + '</span>');
                                    form.find('.j_getFlexPwd').addClass('time-off');
                                }

                            } else {
                                // end
                                if (data.status == '1') {
                                    op.append('<span class="ok"></span>');
                                    //start  输入正确短信验证按钮变红或注册中的下一步按钮变红
                                    //wcm update 验证手机号下的是否已存在
                                    var phoneExist = $("#txtPhone").parents(".item-bd").find("p.info-tips").css("display") == "block"; //手机号是否已存在
                                    if (!phoneExist) {
                                        form.find('.j_getFlexPwd').removeClass('time-off');
                                    }
                                    if (!form.find(".info").get(0) && pwd) {
                                        form.find(".btn-step-one").removeClass("reg-next");
                                    }
                                    //end
                                } else {
                                    op.append('<span class="info">' + data.msg + '</span>');
                                    // ，输入错误短信按钮变灰
                                    form.find('.j_getFlexPwd').addClass('time-off');
                                }
                            }
                        }
                    });
                }
            } else {
                if (pageType == 'reg') {
                    op.append('<span class="info">验证码错误</span>');
                }
            }
        }
    }
};

//注册
function userReg() {

    if (window.pageType && pageType == 'reg') {
        var form = $('.wrap-user');
        var tips = $('#j_lrfTips');
        //name
        form.find('input[name=txtPhone]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.phone(o);
        });

        //pwd
        form.find('input[name=txtPwd]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.pwd(o);
        });

        //repwd
        form.find('input[name=txtRePwd]').on('blur', function () {
            var o = $(this);
            var ot = form.find('input[name=txtPwd]');
            tips.text('');
            LRF.repwd(o, ot);
        });

        //check code
        form.find('input[name=txtValidator]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkCode(o);
        });
        //check code
        form.find('input[name=txtPassCode]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkCode(o);
        });

        //start  光标离开时检查手机验证码是否正确
        form.find('input[name=pwd]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkPhoneCode(o, "A");
        });
        //end
    }

}

//登录
function userLogin() {

    if (window.pageType && pageType == 'login') {
        var form = $('.wrap-user');
        var tips = $('#j_lrfTips');

        //name
        form.find('input[name=username]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.phoneMail(o);
        });

        //pwd
        form.find('input[name=password]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.pwd(o);
        });

        //phone
        form.find('input[name=txtPhone]').on('blur', function () {
            var o = $(this);
            var time = o.parents('ul').find('.time');
            tips.text('');
            !time.hasClass('time-off') && time.addClass('time-off');
            LRF.phone(o, function () {
                //start ，判断图片验证码是否显示，手机验证码按钮变灰
                var code = form.find("[id='code']");
                var hideCode = code.hasClass("hide");
                if (hideCode) {
                    time.hasClass('time-off') && time.removeClass('time-off');
                } else {
                    if (!code.find(".info").get(0) && code.find("input:first").val() !== '') {
                        time.hasClass('time-off') && time.removeClass('time-off');
                    }
                }
                //end
            });
        });

        //check code
        form.find('input[name=txtPassCode]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkCode(o);
        });

        //password code
        form.find('input[name=pwd]').on('blur', function () {
            var o = $(this);
            tips.text('');
            // LRF.checkCode(o);  //注释
            //start  检查手机验证码
            if (o.parents("form").attr("id") == "register") {
                LRF.checkPhoneCode(o, "A");
            } else {
                LRF.checkPhoneCode(o, "D");
            }
            //end
        });
    }

}

//找回密码
function userFindPWD() {
    if (typeof (pageType) != 'undefined' && pageType == 'findpassword') {
        var form = $('.wrap-user');
        var tips = $('#j_lrfTips');

        //name
        form.find('input[name=txtPhoneMail]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.phoneMail(o);
        });

        //check code
        form.find('input[name=txtCheckCode]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkCode(o);
        });

        //check code
        form.find('input[name=txtPassCode]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkCode(o);
        });

        //check code
        form.find('input[name=txtValidator]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.checkCode(o);
        });

        //pwd
        form.find('input[name=txtPwd]').on('blur', function () {
            var o = $(this);
            tips.text('');
            LRF.pwd(o);
        });

        //repwd
        form.find('input[name=txtRePwd]').on('blur', function () {
            var o = $(this);
            var ot = form.find('input[name=txtPwd]');
            tips.text('');
            LRF.repwd(o, ot);
        });
    }
}

function fnCheck() {
    $('.fn-check').on('click', function () {
        var o = $(this);
        var oc = o.hasClass('fn-check-on');
        if (oc) {
            o.removeClass('fn-check-on');
            $('#cooktime').val(0);
        } else {
            o.addClass('fn-check-on');
            $('#cooktime').val(1);
        }
    });
}

function unionLogin() {
    var ulb = $('.union-login-box');
    if (ulb.get(0)) {

        var formReg = $('#j_fromReg');
        var formBind = $('#j_fromBind'); //联合登陆

        var tname1 = $("#txtPhone");
        var tname2 = $("#txtPhoneMail");

        var tpwd1 = $("#txtPwd1");
        var tpwd2 = $("#txtPwd2");

        var trpwd = $("#txtRePwd");

        var tvd1 = formReg.find("input[name=txtPassCode]");
        var tvd2 = formBind.find("input[name=txtPassCode]");

        //start ，手机验证码
        var phoneCode1 = formReg.find("input[name='pwd']");
        var phoneCode2 = formBind.find("input[name='pwd']");
        //end

        var tips1 = formReg.find('.err-tips');
        var tips2 = formBind.find('.err-tips');

        var jgfp1 = formReg.find('.j_getFlexPwd');
        var jgfp2 = formBind.find('.j_getFlexPwd');

        //功能已取消
        //checkPwdLevel();

        var _unitFocus = function (o) {
            o.focus();
            return false;
        };

        ulb.find('.login-hd').find('input[type="radio"]').on('change', function () {
            var oThis = $(this);
            ulb.find('.login-bd').hide();
            oThis.parents('.login-hd').next('.login-bd').show();
        }).eq(0).prop('checked', true);

        $('#agreement').on('change', function () {

            var oThis = $(this);
            var bs = formReg.find('.btn-submit');

            if (!oThis.prop('checked')) {
                bs.attr('disabled', 'disabled').addClass('btn-off');
            } else {
                bs.removeAttr('disabled').removeClass('btn-off');
            }
        }).prop('checked', true);

        //用户名blur
        var ckUserName = function (node, tip, flexPwdNode, tp) {
            node.on('blur', function () {
                var o = $(this);
                var ov = o.val();
                var op = o.parent();
                tip.text('');
                o.siblings('.err-info').remove();
                o.siblings('.ok-info').remove();
                if (!ov) {
                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>' + ((tp == 'mobile') ? "请填写手机号" : "请填写手机号/邮箱") + '</span>');
                    flexPwdNode.addClass('time-off');
                } else {
                    if (tp == 'mobile') {
                        if (!_uzw.regexForm.mobile(ov)) {
                            op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>手机格式错误</span>');
                            flexPwdNode.addClass('time-off');
                        } else {  //start ，如果输入正确，检查账号是否注册
                            LRF.checkAccount('txtPhoneMail', ov, op); //检查帐号是否注册提示
                            if (!op.children(".err-info")) {
                                flexPwdNode.removeClass('time-off');
                            }
                        } //end
                    } else if (tp == 'mobile-email') {
                        if (!(_uzw.regexForm.email(ov) || _uzw.regexForm.mobile(ov))) {
                            op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>手机号/邮箱格式错误</span>');
                            flexPwdNode.addClass('time-off');
                        } else { //start  输入正确在进行验证账号是否注册提示
                            if (_uzw.regexForm.email(ov)) {
                                $("#phoneCode").find(".err-info").remove(); //去掉错误信息
                                $("#phoneCode").addClass("hide"); //隐藏手机验证码
                            } else {
                                $("#phoneCode").removeClass("hide"); //显示手机验证码
                            }
                            op.children(".ok-info").remove();
                            LRF.checkAccount('txtPhoneMail', ov, op); //检查帐号是否注册提示
                            if (!op.children(".err-info")) {
                                flexPwdNode.removeClass('time-off');
                            }
                        } //end
                    } else {
                        op.append('<span class="ok-info"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                        //start  如果不有错误才删除样式
                        if (!op.children(".err-info")) {

                            flexPwdNode.removeClass('time-off');
                        }
                        //end
                        //flexPwdNode.removeClass('time-off');
                    }
                }
            });
        };
        ckUserName(tname1, tips1, jgfp1, 'mobile');

        //账号密码 blur
        var ckPwd = function (node, tip) {
            node.on('blur', function () {
                var o = $(this);
                var ov = o.val();
                var op = o.parent();
                var ol = ov.length;
                tip.text('');
                o.siblings('.err-info').remove();
                o.siblings('.ok-info').remove();
                if (!ov) {
                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>请填写密码</span>');
                } else if (!(ol >= 6 && ol <= 16)) {
                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>6-16位字母/数字/符号</span>');
                } else {
                    if (op.find("input[name='txtPwd2']").get(0)) {
                        op.append('<span class="ok-info"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                    } else {
                        op.append('<span class="ok-info" style="right:62px"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                    }
                }
            });
        };
        ckPwd(tpwd1, tips1);

        //repwd
        trpwd.on('blur', function () {
            var o = $(this);
            var ov = o.val();
            var op = o.parent();
            var ov1 = tpwd1.val();
            tips1.text('');
            o.siblings('.err-info').remove();
            o.siblings('.ok-info').remove();
            if (ov != ov1) {
                op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>密码不一致</span>');
            } else {
                op.append('<span class="ok-info"><i class="icon-ok mr10 vm icons-user png"></i></span>');
            }
        });

        //start  手机验证码blur
        var ckPhoneCode = function (node, tip, userType) {
            node.on('blur', function () {
                var o = $(this);
                var ov = o.val();
                var op = o.parent();
                tip.text('');
                o.siblings('.err-info').remove();
                o.siblings('.ok-info').remove();
                if (!ov) {
                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>请填写手机验证码</span>');
                } else {

                    LRF.checkPhoneCode(o, userType);
                    //op.append('<span class="ok-info"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                }
            });
        };

        //手机验证码
        ckPhoneCode(phoneCode1, tips1, "A");
        //end

        //验证码blur
        var ckPassCode = function (node, tip) {
            node.on('blur', function () {
                var o = $(this);
                var ov = o.val();
                var op = o.parent();
                tip.text('');
                o.siblings('.err-info').remove();
                o.siblings('.ok-info').remove();
                if (!ov) {
                    op.append('<span class="err-info"><i class="icon-warn mr10 vm icons-user png"></i>请填写验证码</span>');
                } else {
                    //start  检查验证码
                    LRF.checkCode(o);
                    //op.append('<span class="ok-info"><i class="icon-ok mr10 vm icons-user png"></i></span>');
                }
            });
        };

        //验证码1
        ckPassCode(tvd1, tips1);

        formReg.on('submit', function () {
            var nv = $.trim(tname1.val());
            var pv = $.trim(tpwd1.val());
            var pl = pv.length;
            // var rpv = $.trim(trpwd.val());
            // var vv = $.trim(tvd.val());


            //username mobile email
            if ((!_uzw.regexForm.email(nv) && !_uzw.regexForm.mobile(nv)) || tname1.siblings('.err-info').get(0)) {
                return _unitFocus(tname1);
            }

            //password
            if (!pv || !(pl >= 6 && pl <= 16) || tpwd1.siblings('.err-info').get(0)) {
                return _unitFocus(tpwd1);
            }

            //repassword
            //，新版的登录注册绑定，没有该项了
            //            if (!rpv || trpwd.siblings('.err-info').get(0)) {
            //                return _unitFocus(trpwd);
            //            }

            //            if (pv != rpv || tpwd1.siblings('.err-info').get(0)) {
            //                return _unitFocus(tpwd1);
            //            }

            //            if (!vv || tvd.siblings('.err-info').get(0)) {
            //                return _unitFocus(tvd);
            //            }

            if (typeof _gsq == 'object') {
                var scp = "1";
                if (_uzw.regexForm.mobile(nv)) {
                    scp = "1";
                } else if (_uzw.regexForm.email(nv)) {
                    scp = "2";
                } else {
                    scp = "3";
                }

                _gsq.push(["T", "GWD-002793", "setCustomProperty", scp, nv]); //数字“1”不可改
                _gsq.push(["T", "GWD-002793", "track", "/targetpage/pc/regok"]);
                _gsq.push(["T", "GWD-002793", "trackEvent", "注册方式", "注册成功", "PC"]);
            }

            return true;
        });

        //name
        ckUserName(tname2, tips2, jgfp2, 'mobile-email');

        //pwd
        ckPwd(tpwd2, tips2);

        //stare  手机验证码1
        ckPhoneCode(phoneCode2, tips1, "D");
        //end

        //验证码2
        ckPassCode(tvd2, tips2);

        formBind.on('submit', function () {
            var nv = $.trim(tname2.val());
            var pv = $.trim(tpwd2.val());
            var pl = pv.length;

            //username mobile email
            if ((!_uzw.regexForm.email(nv) && !_uzw.regexForm.mobile(nv)) || tname2.siblings('.err-info').get(0)) {
                return _unitFocus(tname2);
            }

            //password
            if (!pv || !(pl >= 6 && pl <= 16) || tpwd2.siblings('.err-info').get(0)) {
                return _unitFocus(tpwd2);
            }

            //start  如果有错误信息不让提交
            if ($(this).find(".err-info").get(0)) {
                return false;
            }
            //end

            return true;
        });
    }
}

//检查密码强度
function checkPwdLevel() {
    var tpwd1 = $('#txtPwd1');
    tpwd1.on('keyup', function () {
        var o = $(this);
        var ov = $.trim(o.val());
        var os = $('#j_pwdLevel');
        var level = checkStrong(ov); //检查密码强度等级
        switch (level) {
            case 0:
                os.removeClass('pwd-level-on');
                break;
            case 1:
                os.find('.level-item').removeClass('on');
                os.addClass('pwd-level-on').find('.s1').addClass('on');
                break;
            case 2:
                os.find('.level-item').removeClass('on');
                os.addClass('pwd-level-on').find('.s2').addClass('on');
                break;
            default:
                os.find('.level-item').removeClass('on');
                os.addClass('pwd-level-on').find('.s3').addClass('on');
        }
    });
}

//返回强度级别
function checkStrong(sPW) {
    //判断输入密码的类型
    var _charMode = function (iN) {
        if (iN >= 48 && iN <= 57) //数字
            return 1;
        if (iN >= 65 && iN <= 90) //大写
            return 2;
        if (iN >= 97 && iN <= 122) //小写
            return 4;
        else
            return 8;
    };
    //bitTotal函数,计算密码模式
    var _bitTotal = function (num) {
        modes = 0;
        for (i = 0; i < 4; i++) {
            if (num & 1) modes++;
            num >>>= 1;
        }
        return modes;
    };

    if (sPW.length <= 5) {
        return 0; //密码太短
    }
    Modes = 0;
    for (i = 0; i < sPW.length; i++) {
        //密码模式
        Modes |= _charMode(sPW.charCodeAt(i));
    }
    return _bitTotal(Modes);
}

//弹出登录
function popLogin() {
    //check pagetype
    if (window.pageType && pageType != 'login') {
        return;
    }

    //init error
    var tips = $('#j_lrfTips');
    if ($.trim(tips.text())) {
        if ($.trim(tips.text()).indexOf('请于24小时后重试') > -1) {
            $("#btn_DynamicLogin").css("background", "#EDEDED").attr("disabled", "disabled");
        }
    }

    //init username
    if (_uzw.user.userid) {
        $("#txtName").val(_uzw.user.userName || _uzw.user.Mobile);
        $("#txtPhone").val(_uzw.user.Mobile);
    }

    //close pop window
    $(".login-inner .close").click(function () {
        parent._uzw.iframe.close();
    });

    //set quicklogin url
    $(".qqdl").attr("href", "/Oauth/QQOauthNew2.aspx?refUrl=" + encodeURIComponent(window.top.location.href));
    $(".wbdl").attr("href", "/Oauth/SinaLogOn.aspx?refUrl=" + encodeURIComponent(window.top.location.href));

    /**快速预订**/
    $("#register").on('submit', function () {
        var fom = $(this);
        var txtPhone = $('#txtPhone');
        var pwd = $('#regpwd');
        var pwdPH = pwd.attr('placeholder');

        var txtPC = fom.find("input[name=txtPassCode]");
        var txtPCPH = txtPC.attr('placeholder');

        if (!_uzw.regexForm.mobile(txtPhone.val())) {
            txtPhone.focus();
            return false;
        }
        if (!$.trim(pwd.val()) || $.trim(pwd.val()) == pwdPH) {
            pwd.focus();
            return false;
        }
        //输错密码>=3次
        var dn = $.trim(txtPC.attr("data-num"));
        var dnv = $.trim(txtPC.val());
        if (dn && parseInt(dn, 10) >= 3) {
            if (!dnv || dnv == txtPCPH) {
                txtPC.focus();
                return false;
            }
        }
        //验证码
        fom.append("<input type='hidden'  name='keyUserCount' value='" + dn + "' />");

        //start  添加点击获取手机验证码的次数
        var data_num = $("#regCode").attr("data-num");
        fom.append("<input type='hidden'  name='data_num' value='" + data_num + "' />");
        //end
        return true;
    });

    /**登录**/
    $("#login").on('submit', function () {
        var name = $("#txtName");
        var pwd = $("#txtPwd");

        var namePH = name.attr('placeholder');
        var pwdPH = pwd.attr('placeholder');

        if (!$.trim(name.val()) || $.trim(name.val()) == namePH) {
            name.focus();
            return false;
        }
        if (!$.trim(pwd.val()) || $.trim(pwd.val()) == pwdPH) {
            if (_util.check.isIE678 || _util.check.isIE9) {
                pwd.next('input').focus();
            } else {
                pwd.focus();
            }
            return false;
        }
        return true;
    });

    /**动态登录**/
    /*$("#frmDynamic").on('submit', function () {
    var name = $("#txtPhone2").get(0) ? $("#txtPhone2") : $("#txtPhone");
    var pwd = $("#pwd");

    var namePH = name.attr('placeholder');
    var pwdPH = pwd.attr('placeholder');

    if (!_uzw.regexForm.mobile(name.val())) {
    name.focus();
    return false;
    }
    if (!$.trim(pwd.val()) || $.trim(pwd.val()) == pwdPH) {
    if (_util.check.isIE678 || _util.check.isIE9) {
    pwd.next('input').focus();
    } else {
    pwd.focus();
    }
    return false;
    }

    return true;

    });*/

}

//普通登陆
function comLogin() {

    if (window.pageType && pageType != 'login') {
        return;
    }

    if (_uzw.user.userid) {
        $("#username").val(_uzw.user.userName);
        $("#txtPhone").val(_uzw.user.Mobile);
    }

    $('#j_reguserFom').on('submit', function () {
        var fom = $(this);
        $('#j_lrfTips').text('');
        var username = $("#username");
        var password = $("#password");
        var txtPC = fom.find("input[name=txtPassCode]");

        var usernamePH = username.attr('placeholder');
        var passwordPH = password.attr('placeholder');
        var txtPCPH = txtPC.attr('placeholder');

        if (!$.trim(username.val()) || $.trim(username.val()) == usernamePH) {
            username.focus();
            return false;
        }
        if (!$.trim(password.val()) || $.trim(password.val()) == passwordPH) {
            if (_util.check.isIE678 || _util.check.isIE9) {
                password.next('input').focus();
            } else {
                password.focus();
            }
            return false;
        }
        //输错密码>=3次
        var dn = $.trim(txtPC.attr("data-num"));
        var dnv = $.trim(txtPC.val());
        if (dn && parseInt(dn, 10) >= 3) {
            if (!dnv || dnv == txtPCPH) {
                txtPC.focus();
                return false;
            }
        }
        //验证码
        fom.append("<input type='hidden'  name='keyUserCount' value='" + dn + "' />");

        if (typeof _gsq == 'object') {

            var scp = "1";
            var nv = $.trim(username.val());
            if (_uzw.regexForm.mobile(nv)) {
                scp = "1";
            } else if (_uzw.regexForm.email(nv)) {
                scp = "2";
            } else {
                scp = "3";
            }

            _gsq.push(["T", "GWD-002793", "setCustomProperty", scp, nv]); //数字“1”不可改
            _gsq.push(["T", "GWD-002793", "track", "/targetpage/pc/loginok"]);

            var pcTp = "";
            var ur = location.href.toLowerCase();
            if (ur.indexOf('/reguser') > -1) {
                pcTp = "PC-p";
            } else if (ur.indexOf('/quickloginv1') > -1) {
                pcTp = "PC-y";
            } else if (ur.indexOf('/quicklogin') > -1) {
                pcTp = "PC-t";
            } else {
                pcTp = "PC-p";
            }

            _gsq.push(["T", "GWD-002793", "trackEvent", "普通登录", "登录成功", pcTp]);

        }

        return true;
    });

    $('#j_mobileReguserFom').on('submit', function () {
        var fom = $(this);
        $('#j_lrfTips').text('');
        var phone = $("#txtPhone");
        var pwd = $("#pwd");

        var phonePH = phone.attr('placeholder');
        var pwdPH = pwd.attr('placeholder');
        var txtPC = fom.find("input[name=txtPassCode]");

        if (!_uzw.regexForm.mobile(phone.val()) || $.trim(phone.val()) == phonePH) {
            phone.focus();
            return false;
        }
        if (!$.trim(pwd.val()) || $.trim(pwd.val()) == pwdPH) {
            if (_util.check.isIE678 || _util.check.isIE9) {
                pwd.next('input').focus();
            } else {
                pwd.focus();
            }
            return false;
        }
        //输错密码>=3次
        var dn = $.trim(txtPC.attr("data-num"));
        var dnv = $.trim(txtPC.val());
        if (dn && parseInt(dn, 10) >= 3) {
            if (!dnv || dnv == txtPCPH) {
                txtPC.focus();
                return false;
            }
        }
        //验证码
        fom.append("<input type='hidden'  name='keyUserCount' value='" + dn + "' />");

        if (typeof _gsq == 'object') {
            var scp = "1";
            var nv = $.trim(phone.val());
            if (_uzw.regexForm.mobile(nv)) {
                scp = "1";
            } else if (_uzw.regexForm.email(nv)) {
                scp = "2";
            } else {
                scp = "3";
            }
            _gsq.push(["T", "GWD-002793", "setCustomProperty", scp, nv]); //数字“1”不可改
            _gsq.push(["T", "GWD-002793", "track", "/targetpage/pc/loginok"]);
            _gsq.push(["T", "GWD-002793", "trackEvent", "动态密码登录", "登录成功", "PC"]);
        }

        return true;
    });

}

//普通注册
function comReg() {

    if (window.pageType && pageType != 'reg') {
        return;
    }

    var tab = $('#j_regTab');
    var form = $('#j_fromReg');
    var tname = $("#txtPhone");
    var pwd = $('#pwd'); //短信验证码

    var tvd = form.find("input[name=txtPassCode]");

    var btnOne = form.find('.btn-step-one'); //common button
    var btnTwo = form.find('.btn-step-two'); //common button

    var tpwd = $("#txtPwd");
    var trpwd = $("#txtRePwd");

    var tvdPH = tvd.attr('placeholder');
    var tpwdPH = tpwd.attr('placeholder');
    var trpwdPH = trpwd.attr('placeholder');

    var tip1 = $('#j_lrfTips1');
    var tip2 = $('#j_lrfTips2');

    var _unitFocus = function (o) {
        var ot = o.attr('type');
        if ((_util.check.isIE678 || _util.check.isIE9) && ot == 'password') {
            o.next('input').focus();
        }
        else {
            o.focus();
            //start  提示错误
            o.parent().children(".info").remove();
            o.parent().append('<span class="info">输入错误</span>');
            //end
        }
        return false;
    };

    var changeTab = function (idx) {
        var lis = tab.children('.hd').find('li');
        lis.removeClass('on');
        lis.eq(idx).addClass('on');

        var items = form.children('.item');
        items.hide();
        items.eq(idx).show();
    };

    btnOne.on('click', function () {

        //start ，按钮为灰色不能点
        var btn_one = $(this);
        if (btn_one.hasClass("reg-next")) {
            return;
        }
        //end

        var ov = $.trim(tname.val());

        //username mobile email
        if ((!_uzw.regexForm.mobile(ov)) || tname.siblings('.info').get(0)) {
            return _unitFocus(tname);
        } else if (!pwd.val()) {//短信验证码
            return _unitFocus(pwd);
        } else if (!tvd.parents("li").hasClass("hide") && !$.trim(tvd.val())) {  //start
            if (!$.trim(tvd.val()) || $.trim(tvd.val()) == tvdPH || tvd.siblings('.info').get(0)) { //
                return _unitFocus(tvd);
            }
        } else {  //end

            //start  注册第一步提交
            var grapCode = tvd.parents("li").hasClass("hide"); //判断图型验证是不是显示 -pzx
            $.ajax({
                type: 'get',
                cache: false,
                data: { phone: ov, phoneCode: pwd.val(), grapCode: tvd.val(), grapHide: grapCode },
                url: _uzw.domain.u + '/reg/Register_One',
                success: function (data) {
                    if (!data) {
                        changeTab(1);
                    } else if (data == "-1") { //表示多次提交，多次提交后显示图形验证友
                        tvd.parents("li").removeClass("hide"); //显示图形验证码

                        tvd.parent().children('.info').remove();
                    } else if (data == "-2") {
                        $("#pwd").parent().append('<span class="info">输入错误</span>');
                    } else {
                        $("#j_lrfTips1").text(data);
                    }
                }
            });
            //end
        }
    });



    btnTwo.on('click', function () {

        if (btnTwo.val() !== '下一步') {
            return;
        }

        //start  按钮为灰色不能点击
        var btn_two = $(this);
        if (btn_two.hasClass("reg-next")) {
            return;
        }
        //end

        var ov = $.trim(tname.val());

        //password
        if (!$.trim(tpwd.val()) || $.trim(tpwd.val()) == tpwdPH || !($.trim(tpwd.val()).length >= 6 && $.trim(tpwd.val()).length <= 16) || tpwd.siblings('.info').get(0)) {
            return _unitFocus(tpwd);
        }

        //repassword
        if (!$.trim(trpwd.val()) || $.trim(trpwd.val()) == trpwdPH || trpwd.siblings('.info').get(0)) {
            return _unitFocus(trpwd);
        }

        if ($.trim(tpwd.val()) != $.trim(trpwd.val()) || tpwd.siblings('.info').get(0)) {
            return _unitFocus(trpwd);
        }

        btnTwo.val("注册中……");
        btnTwo.addClass('reg-ing');


        //start ，注册第二步提交
        var grapCode = tvd.val(); //获取验证码
        var phoneCode = $("#pwd").val();
        //ajax check
        $.ajax({
            type: 'get',
            cache: false,
            data: { phone: ov, pwd_one: tpwd.val(), pwd_two: trpwd.val(), grapCode: grapCode, phoneCode: phoneCode },
            url: _uzw.domain.u + '/reg/Register_Two',
            success: function (data) {
                if (!data) {
                    changeTab(2);
                    pageRedirect();
                } else {
                    $("#j_lrfTips2").text(data);
                }
            },
            complete: function () {
                //btnTwo.val("下一步");
                //btnTwo.removeClass('reg-ing');
            }
        });
        //end

        if (typeof _gsq == 'object') {
            var scp = "1";
            if (_uzw.regexForm.mobile(ov)) {
                scp = "1";
            } else if (_uzw.regexForm.email(ov)) {
                scp = "2";
            } else {
                scp = "3";
            }

            _gsq.push(["T", "GWD-002793", "setCustomProperty", scp, ov]); //数字“1”不可改
            _gsq.push(["T", "GWD-002793", "track", "/targetpage/pc/regok"]);
            _gsq.push(["T", "GWD-002793", "trackEvent", "注册方式", "注册成功", "PC"]);
        }

        return true;

    });

}

function agreeProtocal() {
    //30天内自动登录
    $("#agreement").click(function () {
        if ($(this).hasClass("fn-check-on")) {
            $("#btnReg").hide();
            $("#btnReg2").val("注册");
            $("#btnReg2").show();
        } else {
            $("#btnReg").show();
            $("#btnReg2").hide();
        }
    });
}