var ccFlag = false; // 验证图形验证码是否正确

var userexports = {};

userexports.init = function () {

    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        tab.init('j_forget');
        tab.init('j_depositCard');
        tab.init('j_myUb');
        tab.init('j_usuallyInfoTab');
        tab.init('j_loginTab');
    });

    userexports.login();
    userexports.reg();
    userexports.findPwd();
    userexports.updPwd();
    userexports.pwdSwitch();
    userexports.invitationCode();
    userexports.quickRegister();
    userexports.usuallyInfo();
    $('.user-form').on('submit', function () {
        return false;
    });
};

var checkCaptcha = function (o) { // 验证图形验证码
    var ov = o.val();
    var intR = "^([+-]?)\\d*\\.?\\d+$"; //数字
    var nv = _util.string.replaceAll(ov, ' ', '');

    if (!ov) {
        _uzm.pop.toast('请输入图形验证码！');
        o.focus();
        ccFlag = false;
    } else if (nv.match(intR)) {
        $.ajax({
            type: 'POST',
            url: '/mobile/validatePassCode',
            dataType: 'json',
            cache: false,
            async: false,
            data: {
                'txtPassCode': nv
            },
            success: function (data) {
                if (data.status === 1) {
                    ccFlag = true;
                } else {
                    _uzm.pop.toast(data.msg);
                    o.focus();
                    ccFlag = false;
                }
            }
        });
    } else {
        _uzm.pop.toast('图形验证码不正确，请重新输入！');
        o.focus();
        ccFlag = false;
    }
};

// 密码可见开关
userexports.pwdSwitch = function () {
    $('.pwd-switch').on('click', function () {
        var oThis = $(this);
        var pwd = oThis.parent().find('[name=password]');
        if (oThis.hasClass('pwd-switch-on')) {
            pwd.attr('type', 'password');
            oThis.removeClass('pwd-switch-on');
        } else {
            pwd.attr('type', 'text');
            oThis.addClass('pwd-switch-on');
        }
    });
};

userexports.addValidator = function (obj) { // 添加图形验证码
    var cbar = $('.check-bar');
    if (!obj.find('.check-bar').get(0)) {
        var cbLen = cbar.length;
        var sHtml = '';

        sHtml +=
        '<li class="list-item clearfix">' +
            '<i class="icon-pen fl"></i>';
        if (cbLen > 1) {
            sHtml += '<label class="item-bd"><input type="tel" class="textbox check-bar f14 g10" id="txtPassCode' + (cbLen - 1) + '" name="txtPassCode" placeholder="请输入图形验证码" maxlength="4"></label>';
        } else {
            sHtml += '<label class="item-bd"><input type="tel" class="textbox check-bar f14 g10" id="txtPassCode" name="txtPassCode" placeholder="请输入图形验证码" maxlength="4"></label>';
        }
        sHtml += '<span class="change-code item-side"><img src="/code" alt="看不清，换一张" onclick="javascript: this.src = \'/code?\' + Math.random()" /></span>' +
    '</li>';
        obj.find('.forms-listing').append(sHtml);
        $('.check-bar').focus();
    }
};

userexports.reg = function () {
    var reg = /^\d{4}$/;
    $('#j_regSubmit').on('click', function () {
        var oThis = $(this);
        //            if (oThis.hasClass('btn-off')) {
        //                return false;
        //            }
        var un = $('#username').val();
        var cp = $('#captcha').val();
        var pw = $('#password').val();
        var MRegToken = $('#MRegToken').val();

        if (!un) {
            _uzm.pop.toast('请输入手机号');
            return false;
        } else if (!new RegExp(_uzm.regex.mobile).test(un)) {
            _uzm.pop.toast('手机号格式不正确，请重新输入');
            return false;

        } else if (!cp) {
            _uzm.pop.toast('请输入验证码');
            return false;
        } else if (!reg.test(cp)) {
            _uzm.pop.toast('验证码格式不正确，请重新输入');
            return false;

        } else if (!pw) {
            _uzm.pop.toast('请输入密码');
            return false;
        }

        $.ajax({
            cache: false,
            async: false,
            type: "POST",
            data: { "username": un, "captcha": cp, "password": pw,'MRegToken':MRegToken},
            url: "/mobile/UserRegReset",
            beforeSend: function (XMLHttpRequest) {
                oThis.attr('disabled', 'true').addClass('btn-off');
            },
            success: function (data) {
                if (data == "success") {

                    /*if (_gsq=='object') {
                        var scp = "1";
                        if (_uzm.regexForm.mobile(un)) {
                            scp = "1";
                        } else if (_uzm.regexForm.email(un)) {
                            scp = "2";
                        } else {
                            scp = "3";
                        }
                        _gsq.push(["T", "GWD-002800", "setCustomProperty", scp, un]);//数字“1”不可改
                        _gsq.push(["T", "GWD-002800", "track", "/targetpage/wap/regok"]);
                        _gsq.push(["T", "GWD-002800", "trackEvent", "注册方式", "注册成功", "M站"]);
                    }*/

                    var url = window.unescape(location.href.toLowerCase());
                    _uzm.user.refresh();
                    var id = _uzm.user.userid;
                    var p = url.split('reurl=')[1];
                    //注册成功后，点击确定跳转至
                    _uzm.pop.confirm('注册成功', function () {
                        if (p) {
                            window.location.href = p.replace('*.', id + '.');
                        } else {
                            window.location.href = _uzm.domain.m;
                        }
                    });
                }
                if (data && data != "success") {
                    _uzm.pop.toast(data);
                    oThis.removeAttr('disabled').removeClass('btn-off');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _uzm.pop.toast("状态：" + textStatus + "；出错提示：" + errorThrown);
                oThis.removeAttr('disabled').removeClass('btn-off');
            }
        });
    });

    // 联合注册并绑定
    $('#j_bindReg').find('.btn-item[type=submit]').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        var un = op.find('input[name=username]').val();
        var cp = op.find('input[name=captcha]').val();
        var pwd = op.find('input[name=password]').val();
        var otpc = op.find('input[name=txtPassCode]');
        var MLoginToken = op.find('input[name=MLoginToken]').val();
        var tpc = otpc.val();

        if (!un) {
            _uzm.pop.toast('请输入手机号！');
            return false;
        } else if (!_uzm.regexForm.mobile(un)) {
            _uzm.pop.toast('手机号格式不正确，请重新输入！');
            return false;
        } else if (!cp) {
            _uzm.pop.toast('请输入动态密码！');
            return false;
        } else if (!pwd) {
            _uzm.pop.toast('请输入密码！');
            return false;
        } else if (pwd.length < 6 || pwd.length > 16) {
            _uzm.pop.toast('请输入6-16位密码！');
            return false;
        }
        if (otpc.get(0)) { // 如果存在图形验证码
            ccFlag = false;
            checkCaptcha(otpc);
            if (!ccFlag) {
                return false;
            }
        } else {
            tpc = '';
        }

        $.ajax({
            cache: false,
            async: false,
            type: 'POST',
            url: '/mobile/UnionBindRegisterMobile',
            data: { 'txtPhone': un, 'pwd': cp, 'txtPwd1': pwd, 'txtPassCode': tpc},
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                oThis.attr('disabled', 'true').addClass('btn-off');
            },
            success: function (data) {
                if (data.status === 2) { // 如果需要图形验证码
                    // 添加验证码
                    _uzm.pop.toast(data.msg);
                    //userexports.addValidator(op);
                } else if (data.status === 1) {
                    var url = window.unescape(location.href.toLowerCase());
                    _uzm.user.refresh();
                    var id = _uzm.user.userid;
                    var p = url.split('reurl=')[1];

                    // 注册成功后，点击确定跳转至
                    _uzm.pop.confirm('注册成功', function () {
                        if (p) {
                            window.location.href = p.replace('*.', id + '.');
                        } else {
                            window.location.href = data.msg;
                        }
                    });
                } else {
                    _uzm.pop.toast(data.msg);
                }
                oThis.removeAttr('disabled').removeClass('btn-off');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // _uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                oThis.removeAttr('disabled').removeClass('btn-off');
            }
        });
    });
};

userexports.login = function () {
    // 普通登录
    $('#j_userLogin').find('.btn-item[type=submit]').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        var un = op.find('input[name=username]').val();
        var pwd = op.find('input[name=password]').val();
        var otpc = op.find('input[name=txtPassCode]');
        var MLoginToken = op.find('input[name=MLoginToken]').val();
        var tpc = otpc.val();

        if (!un) {
            _uzm.pop.toast('请输入手机号/邮箱/众信账号！');
            return false;
        } else if (!pwd) {
            _uzm.pop.toast('请输入密码！');
            return false;
        } else if (pwd.length < 6 || pwd.length > 16) {
            _uzm.pop.toast('请输入6-16位密码！');
            return false;
        }
        if (otpc.get(0)) { // 如果存在图形验证码
            ccFlag = false;
            checkCaptcha(otpc);
            if (!ccFlag) {
                return false;
            }
        } else {
            tpc = '';
        }

        $.ajax({
            cache: false,
            async: false,
            type: 'POST',
            url: '/mobile/loginuserNew',
            data: { 'username': un, 'password': pwd, 'txtPassCode': tpc, 'MLoginToken': MLoginToken},
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                oThis.attr('disabled', 'true').addClass('btn-off');
            },
            success: function (data) {
                // console.log(data);
                if (data.status === 2) { // 如果需要图形验证码
                    // 添加验证码
                    _uzm.pop.toast(data.msg);
                    //userexports.addValidator(op);
                } else if (data.status === 1) {
                    var url = window.unescape(location.href.toLowerCase());
                    _uzm.user.refresh();
                    var id = _uzm.user.userid;
                    var p = url.split('reurl=')[1];

                    // 登录成功后跳转至
                    if (p) {
                        window.location.href = p.replace('*.', id + '.');
                    } else {
                        window.location.href = data.msg;
                    }
                } else {
                    _uzm.pop.toast(data.msg);
                }
                oThis.removeAttr('disabled').removeClass('btn-off');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // _uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                oThis.removeAttr('disabled').removeClass('btn-off');
            }
        });
    });

    // 动态密码登录
    $('#j_dynamicLogin').find('.btn-item[type=submit]').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        var un = op.find('input[name=username]').val();
        var cp = op.find('input[name=captcha]').val();
        var otpc = op.find('input[name=txtPassCode]');
        var tpc = otpc.val();

        if (!un) {
            _uzm.pop.toast('请输入手机号！');
            return false;
        } else if (!_uzm.regexForm.mobile(un)) {
            _uzm.pop.toast('手机号格式不正确，请重新输入！');
            return false;
        } else if (!cp) {
            _uzm.pop.toast('请输入动态密码！');
            return false;
        }
        if (!otpc.get(0)) { // 如果不存在图形验证码
            tpc = '';
        }

        $.ajax({
            cache: false,
            async: false,
            type: 'POST',
            url: '/mobile/MobileDynamicLogin',
            data: { 'txtPhone': un, 'pwd': cp, 'txtPassCode': tpc },
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                oThis.attr('disabled', 'true').addClass('btn-off');
            },
            success: function (data) {
                if (data.status === 1) {
                    var url = window.unescape(location.href.toLowerCase());
                    _uzm.user.refresh();
                    var id = _uzm.user.userid;
                    var p = url.split('reurl=')[1];

                    // 登录成功后跳转至
                    if (p) {
                        window.location.href = p.replace('*.', id + '.');
                    } else {
                        window.location.href = data.msg;
                    }
                } else {
                    _uzm.pop.toast(data.msg);
                }
                oThis.removeAttr('disabled').removeClass('btn-off');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // _uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                oThis.removeAttr('disabled').removeClass('btn-off');
            }
        });
    });

    // 联合登录并绑定
    $('#j_bindLogin').find('.btn-item[type=submit]').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        var un = op.find('input[name=username]').val();
        var pwd = op.find('input[name=password]').val();
        var otpc = op.find('input[name=txtPassCode]');
        var tpc = otpc.val();

        if (!un) {
            _uzm.pop.toast('请输入手机号/邮箱/众信账号！');
            return false;
        } else if (!pwd) {
            _uzm.pop.toast('请输入密码！');
            return false;
        } else if (pwd.length < 6 || pwd.length > 16) {
            _uzm.pop.toast('请输入6-16位密码！');
            return false;
        }
        if (otpc.get(0)) { // 如果存在图形验证码
            ccFlag = false;
            checkCaptcha(otpc);
            if (!ccFlag) {
                return false;
            }
        } else {
            tpc = '';
        }

        $.ajax({
            cache: false,
            async: false,
            type: 'POST',
            url: '/mobile/UnionBindLoginMobile',
            data: { 'txtPhoneMail': un, 'txtPwd2': pwd, 'txtPassCode': tpc, 'subBind': false },
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                oThis.attr('disabled', 'true').addClass('btn-off');
            },
            success: function (data) {
                if (data.status === -1) {
                    // 重新登录
                    window.location.href = data.msg;
                } else if (data.status === -3) { // 如果需要图形验证码
                    // 添加验证码
                    _uzm.pop.toast(data.msg);
                    //userexports.addValidator(op);
                } else if (data.status === -6) { // 帐号已绑定
                    _uzm.pop.prompt(data.msg, function (flag) { // 是否替换
                        if (flag) {
                            $.ajax({
                                cache: false,
                                async: false,
                                type: 'POST',
                                url: '/mobile/UnionBindLoginMobile',
                                data: { 'txtPhoneMail': un, 'txtPwd2': pwd, 'txtPassCode': tpc, 'subBind': flag },
                                dataType: 'json',
                                success: function (data) {
                                    if (data.status === -1) {
                                        // 重新登录
                                        window.location.href = data.msg;
                                    } else if (data.status === 1) {
                                        var url = window.unescape(location.href.toLowerCase());
                                        _uzm.user.refresh();
                                        var id = _uzm.user.userid;
                                        var p = url.split('reurl=')[1];

                                        // 登录成功后跳转至
                                        if (p) {
                                            window.location.href = p.replace('*.', id + '.');
                                        } else {
                                            window.location.href = data.msg;
                                        }
                                    } else {
                                        _uzm.pop.toast(data.msg);
                                    }
                                }
                            });
                        }
                    });
                } else if (data.status === 1) {
                    var url = window.unescape(location.href.toLowerCase());
                    _uzm.user.refresh();
                    var id = _uzm.user.userid;
                    var p = url.split('reurl=')[1];

                    // 登录成功后跳转至
                    if (p) {
                        window.location.href = p.replace('*.', id + '.');
                    } else {
                        window.location.href = data.msg;
                    }
                } else {
                    _uzm.pop.toast(data.msg);
                }
                oThis.removeAttr('disabled').removeClass('btn-off');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // _uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                oThis.removeAttr('disabled').removeClass('btn-off');
            }
        });
    });
};

userexports.findPwd = function () {
    // 按钮倒计时
    var _countdown = function (obj) {
        var btnRegain = obj.next('.btn-regain');
        var iTime = btnRegain.find('i');
        var _CI = 0;

        if (_CI) {
            clearInterval(_CI);
        }

        obj.hide();
        btnRegain.show();

        _CI = setInterval(function () {
            if (iTime.get(0)) {
                var t = parseInt(iTime.text(), 10);
                if (t <= 0) {
                    obj.show();
                    btnRegain.hide();
                    iTime.text(60);
                    clearInterval(_CI);
                } else {
                    iTime.text(t -= 1);
                }
            }
        }, 1000);
    };
    var _unitCountdown = function (obj) {
        var ot = obj.val();
        var iTime = 60;
        var _CI = 0;

        if (_CI) {
            clearInterval(_CI);
        }

        _CI = setInterval(function () {
            if (iTime <= 1) {
                iTime = 60;
                obj.removeClass('btn-off').val(ot);
                clearInterval(_CI);
            } else {
                iTime = --iTime;
                obj.addClass('btn-off').val(iTime + '后重新发送');
            }
        }, 1000);
    };

    // 注册获取短信验证码
    $('#j_sendCheckCode').on('click', function() {
        var oThis = $(this);
        var un = $('#username').val();

        if (oThis.parents('.user-form').get(0)) {
            return;
        }
        //彭胜锴 20161115 添加图形验证码
        var graphic = $('input[name=verificationCode]').val();
        if (!graphic) {
            _uzm.pop.toast('请输入图形验证码');
            return;
        }
        if (!un) {
            _uzm.pop.toast('请输入手机号');
            return;
        } else if (_uzm.regexForm.mobile(un)) {
            $.ajax({
                type: "POST",
                cache: false,
                async: false,
                data: { "username": un,'verificationCode':graphic },
                url: "/mobile/SendMobileRegCheckCode",
                success: function (data) {
                    if (data == "success") {
                        _uzm.pop.toast('验证码已通过短信发给您，请注意查收');
                        _countdown(oThis);
                    } else {
                        _uzm.pop.toast(data);
                    }
                }
            });
        } else {
            _uzm.pop.toast('手机号格式不正确，请重新输入！');
            return false;
        }
    });

    // 获取动态密码
    $('#j_sendCheckCode').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        if (!op.get(0) || oThis.hasClass('btn-off')) {
            return;
        }
        var dt = oThis.attr('data-type');
        var oun = op.find('input[name=username]');
        var un = oun.val();
        var otpc = op.find('input[name=txtPassCode]');
        var tpc = otpc.val();

        //彭胜锴 20161115 添加图形验证码
        var graphic = $('input[name=verificationCode]').val();
        if (!graphic) {
            _uzm.pop.toast('请输入图形验证码');
            return;
        }



        var _sendCheckCode = function () {
            $.ajax({
                type: "POST",
                cache: false,
                async: false,
                data: { "txtPhone": un, 'type': dt, 'txtPassCode': tpc ,'verificationCode':graphic},
                dataType: 'json',
                url: "/mobile/SendMobileCode",
                success: function (data) {
                    if (data.status === 2) { // 如果需要图形验证码
                        // 添加验证码
                        _uzm.pop.toast(data.msg);
                        //userexports.addValidator(op);
                    } else if (data.status === 1) {
                        _uzm.pop.toast('动态密码已通过短信发给您，请注意查收');
                        _unitCountdown(oThis);
                    } else {
                        _uzm.pop.toast(data.msg);
                    }
                }
            });
        };

        if (!oun.get(0)) {
            un = op.find('.mobile-bar').find('em').text();
        }

        if (!un) {
            _uzm.pop.toast('请输入手机号!');
            return;
        } else if (_uzm.regexForm.mobile(un)) {
            if (otpc.get(0)) { // 如果存在图形验证码
                ccFlag = false;
                checkCaptcha(otpc);
                // 验证成功后发送动态密码
                ccFlag && _sendCheckCode();
            } else {
                tpc = '';
                _sendCheckCode();
            }
        } else {
            _uzm.pop.toast('手机号格式不正确，请重新输入！');
            return;
        }
    });

    // 密码找回 发送验证至手机或邮箱
    $('#j_sendCheck').on('click', function () {
        var oThis = $(this);
        var un = $('#username').val();
        var mobile = _uzm.regex.mobile;
        var email = _uzm.regex.email;
        var isValid1 = new RegExp(mobile).test(un);
        var isValid2 = new RegExp(email).test(un);
        var graphic = $('input[name=verificationCode]').val();
        if (!graphic) {
            _uzm.pop.toast('请输入图形验证码');
            return;
        }


        if (!un) {
            _uzm.pop.toast('请输入手机号/邮箱');
            return;
        } else if (isValid1) {
            $.ajax({
                type: "POST",
                cache: false,
                async: false,
                data: { "username": un,"verificationCode":graphic },
                url: "/mobile/SendMobileFindPasswordCheckCode",
                beforeSend: function (XMLHttpRequest) {
                    $('#j_sendCheck').attr('disabled', 'true');
                    $('#j_sendCheck').addClass('btn-off');
                },
                success: function (data) {
                    if (data == "success") {
                        $('#j_sendCheck').removeClass('btn-off');
                        $('#j_sendCheck').removeAttr('disabled');
                        _uzm.pop.confirm('验证码已通过短信发给您，请注意查收', function () {
                            //点击确定跳转
                            location.href = '/mobile/UpdateMobilePassword?txtPhone=' + un;
                        });
                        _countdown($('#j_gainCheckCode'));
                    } else {
                        _uzm.pop.toast(data);
                        $('#j_sendCheck').removeClass('btn-off');
                        $('#j_sendCheck').removeAttr('disabled');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _uzm.pop.toast("状态：" + textStatus + "；出错提示：" + errorThrown);
                    $('#j_sendCheck').removeClass('btn-off');
                    $('#j_sendCheck').removeAttr('disabled');
                }
            });
        } else if (isValid2) {
            $.ajax({
                type: "POST",
                cache: false,
                async: false,
                data: { "username": un },
                url: "/mobile/SendEmailResetPassword",
                beforeSend: function (XMLHttpRequest) {
                    $('#j_sendCheck').attr('disabled', 'true');
                    $('#j_sendCheck').addClass('btn-off');
                },
                success: function (data) {
                    if (data == "success") {
                        _uzm.pop.toast('验证链接已通过邮件发送给您，请24小时内通过邮件内的验证链接修改密码');
                    } else {
                        _uzm.pop.toast(data);
                    }
                    $('#j_sendCheck').removeClass('btn-off');
                    $('#j_sendCheck').removeAttr('disabled');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _uzm.pop.toast("状态：" + textStatus + "；出错提示：" + errorThrown);
                    $('#j_sendCheck').removeClass('btn-off');
                    $('#j_sendCheck').removeAttr('disabled');
                }
            });
        }
        else {
            _uzm.pop.toast('格式不正确，请重新输入');
            return false;
        }
    });

    // 密码找回 短信验证码重新发送
    $('#j_gainCheckCode').on('click', function () {
        var oThis = $(this);
        var un = $('#hidPhone').val();
        var mobile = _uzm.regex.mobile;
        var isValid1 = new RegExp(mobile).test(un);
        var graphic = $('input[name=verificationCode]').val();
        if (!graphic) {
            _uzm.pop.toast('请输入图形验证码');
            return;
        }

        if (!un) {
            _uzm.pop.toast('请输入手机号');
            return;
        } else if (isValid1) {
            $.ajax({
                type: "POST",
                cache: false,
                async: false,
                data: { "username": un ,"verificationCode":graphic},
                url: "/mobile/SendMobileFindPasswordCheckCode",
                success: function (data) {
                    if (data == "success") {
                        _uzm.pop.toast("验证码已通过短信发给您，请注意查收");
                        _countdown(oThis);
                    } else {
                        _uzm.pop.toast(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _uzm.pop.toast("状态：" + textStatus + "；出错提示：" + errorThrown);
                }
            });
        }
        else {
            _uzm.pop.toast('手机号格式不正确，请重新输入！');
            return false;
        }
    });
};

userexports.updPwd = function () {
    // 通过手机修改密码
    $('#j_resetPwdMobile').on('click', function () {
        var reg = /^\d{4}$/;
        var username = $("#hidPhone").val();
        var cp = $('#captcha').val();
        var pw = $('#password').val();
        var MResetToken = $('#MResetToken').val();
        if (!username) {
            _uzm.pop.toast('输入手机号不正确，请重新找回密码');
            return false;
        } else if (!cp) {
            _uzm.pop.toast('请输入验证码');
            return false;
        } else if (!reg.test(cp)) {
            _uzm.pop.toast('验证码格式不正确，请重新输入');
            return false;

        } else if (!pw) {
            _uzm.pop.toast('请输入密码');
            return;
        }

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            data: { "username": username, "password": pw, "captcha": cp, 'MResetToken': MResetToken},
            url: "/mobile/UpdateMobilePassword",
            // beforeSend: function (XMLHttpRequest) {
            //$('#j_resetPwdMobile').attr('disabled', 'true');
            //$('#j_resetPwdMobile').addClass('btn-off');
            //},
            success: function (data) {
                if (data == "success") {
                    _uzm.pop.confirm('重置密码成功', function () {
                        //重置密码成功后，点击确定跳转
                        //window.location.href = _uzm.domain.u + "/mobile/order";
                        window.location.href = "/mobile/order";
                    });
                }
                else {
                    _uzm.pop.toast(data);
                    //$('#j_resetPwdMobile').removeClass('btn-off');
                    //$('#j_resetPwdMobile').removeAttr('disabled');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _uzm.pop.toast("状态：" + textStatus + "；出错提示：" + errorThrown);
                //$('#j_resetPwdMobile').removeClass('btn-off');
                //$('#j_resetPwdMobile').removeAttr('disabled');
            }
        });
    });

    // 通过邮箱修改密码
    $('#j_resetPwdMail').on('click', function () {
        var email = $("#username").val();
        var pw = $('#password').val();
        if (!pw) {
            _uzm.pop.toast('请输入密码');
            return;
        }

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            data: { "email": email, "password": pw },
            url: "/mobile/EmailResetPassword",
            beforeSend: function (XMLHttpRequest) {
                $('#j_resetPwdMail').attr('disabled', 'true');
                $('#j_resetPwdMail').addClass('btn-off');
            },
            success: function (data) {
                if (data == "success") {
                    _uzm.pop.confirm('重置密码成功', function () {
                        //重置密码成功后，点击确定跳转
                        window.location.href = _uzm.domain.u + "/mobile/login";
                    });
                }
                else {
                    _uzm.pop.toast(data);
                    $('#j_resetPwdMail').removeClass('btn-off');
                    $('#j_resetPwdMail').removeAttr('disabled');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _uzm.pop.toast("状态：" + textStatus + "；出错提示：" + errorThrown);
                $('#j_resetPwdMail').removeClass('btn-off');
                $('#j_resetPwdMail').removeAttr('disabled');
            }
        });
    });

    //会员卡密码修改
    $('#j_mcPwdModify').on('click', function () {
        var oldPwd = $('#oldPwd').val();
        var newPwd = $('#newPwd').val();
        var rePwd = $('#rePwd').val();

        if (!oldPwd) {
            _uzm.pop.toast('请输入旧密码');
            return;
        } else if (!newPwd) {
            _uzm.pop.toast('请输入新密码');
            return;
        } else if (!rePwd) {
            _uzm.pop.toast('请输入确认密码');
            return;
        } else if (newPwd != rePwd) {
            _uzm.pop.toast('请输入确认密码');
            return;
        }

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            data: { "oldPwd": oldPwd, "newPwd": newPwd, "rePwd": rePwd },
            url: "",
            success: function (data) {
                if (data == "success") {
                    _uzm.pop.confirm('修改成功！');
                }
                else {
                    _uzm.pop.toast(data);
                }

            }
        });
    });

    //储值卡密码修改
    $('#j_dcPwdModify').on('click', function () {
        var cardNum1 = $('#cardNum1').val();
        var oldPwd = $('#oldPwd').val();
        var newPwd = $('#newPwd').val();
        var rePwd = $('#rePwd').val();

        if (!cardNum1) {
            _uzm.pop.toast('请输入卡号');
            return;
        } else if (!oldPwd) {
            _uzm.pop.toast('请输入旧密码');
            return;
        } else if (!newPwd) {
            _uzm.pop.toast('请输入新密码');
            return;
        } else if (!rePwd) {
            _uzm.pop.toast('请输入确认密码');
            return;
        } else if (newPwd != rePwd) {
            _uzm.pop.toast('请输入确认密码');
            return;
        }

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            data: { "cardNum1": cardNum1, "oldPwd": oldPwd, "newPwd": newPwd, "rePwd": rePwd },
            url: "",
            success: function (data) {
                if (data == "success") {
                    _uzm.pop.confirm('修改成功！');
                }
                else {
                    _uzm.pop.toast(data);
                }

            }
        });
    });

    // 验证旧手机
    $('#j_verifyOldMobile').find('.btn-item[type=submit]').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        var un = op.find('.mobile-bar').find('em').text();
        var cp = op.find('input[name=captcha]').val();
        var otpc = op.find('input[name=txtPassCode]');
        var tpc = otpc.val();

        if (!cp) {
            _uzm.pop.toast('请输入动态密码！');
            return false;
        } else {
            if (otpc.get(0)) { // 如果存在图形验证码
                ccFlag = false;
                checkCaptcha(otpc);
                if (!ccFlag) {
                    return false;
                }
            } else {
                tpc = '';
            }

            $.ajax({
                type: 'POST',
                cache: false,
                async: false,
                data: { 'txtPhone': un, 'validateCode': cp, 'txtPassCode ': tpc },
                dataType: 'json',
                url: '/mobile/ModifyMobileStep1',
                beforeSend: function (XMLHttpRequest) {
                    oThis.attr('disabled', 'true').addClass('btn-off');
                },
                success: function (data) {
                    if (data.status === 2) { // 如果需要图形验证码
                        // 添加验证码
                        _uzm.pop.toast(data.msg);
                        //userexports.addValidator(op);
                    } else if (data.status === 1) {
                        // 验证成功后跳转至
                        window.location.href = data.msg;
                    } else {
                        _uzm.pop.toast(data.msg);
                    }
                    oThis.removeAttr('disabled').removeClass('btn-off');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // _uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                    oThis.removeAttr('disabled').removeClass('btn-off');
                }
            });
        }
    });

    // 修改手机
    $('#j_modifyMobile').find('.btn-item[type=submit]').on('click', function () {
        var oThis = $(this);
        var op = oThis.parents('.user-form');
        var un = op.find('input[name=username]').val();
        var cp = op.find('input[name=captcha]').val();
        var otpc = op.find('input[name=txtPassCode]');
        var tpc = otpc.val();

        if (!un) {
            _uzm.pop.toast('请输入手机号！');
            return false;
        } else if (!_uzm.regexForm.mobile(un)) {
            _uzm.pop.toast('手机号格式不正确，请重新输入！');
            return false;
        } else if (!cp) {
            _uzm.pop.toast('请输入动态密码！');
            return false;
        } else {
            if (otpc.get(0)) { // 如果存在图形验证码
                ccFlag = false;
                checkCaptcha(otpc);
                if (!ccFlag) {
                    return false;
                }
            } else {
                tpc = '';
            }

            $.ajax({
                type: 'POST',
                cache: false,
                async: false,
                data: { 'txtPhone': un, 'validateCode': cp, 'txtPassCode ': tpc },
                dataType: 'json',
                url: '/mobile/ValidateOrModifyMobile',
                beforeSend: function (XMLHttpRequest) {
                    oThis.attr('disabled', 'true').addClass('btn-off');
                },
                success: function (data) {
                    if (data.status === -1) {
                        // 重新登录
                        window.location.href = data.msg;
                    } else if (data.status === 2) { // 如果需要图形验证码
                        // 添加验证码
                        _uzm.pop.toast(data.msg);
                        //userexports.addValidator(op);
                    } else if (data.status === 1) {
                        _uzm.pop.confirm('修改手机成功', function () {
                            //点击确定跳转至个人信息页
                            window.location.href = data.msg;
                        });
                    } else {
                        _uzm.pop.toast(data.msg);
                    }
                    oThis.removeAttr('disabled').removeClass('btn-off');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // _uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                    oThis.removeAttr('disabled').removeClass('btn-off');
                }
            });
        }
    });
};

userexports.findBalance = function () {
    //查询余额
    $('#j_findBalance').on('click', function () {
        var cardNum = $('#cardNum').val();
        var password = $('#password').val();

        if (!cardNum) {
            _uzm.pop.toast('请输入卡号');
            return;
        } else if (!password) {
            _uzm.pop.toast('请输入密码');
            return;
        }

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            data: { "cardNum": cardNum, "password": password },
            url: "",
            success: function (data) {
                if (data == "success") {
                }
                else {
                    _uzm.pop.toast(data);
                }

            }
        });
    });
};

//邀请码
userexports.invitationCode = function () {
    $('#j_invitation').on('click', function () {
        _uzm.pop.prompt('<p class="invitation-code"><input type="text" class="textbox tc" placeholder="请输入邀请码"></p>');
    });
};

//快速注册
userexports.quickRegister = function () {
    var rb = $('#j_registerBox');
    var pri = $('#j_popRegisterInfo');

    //谢婷婷 20160712 活动注册成功弹窗修改
    var regSpan = $('.air-success');
    var regDiv = $('.popup-success');

    var _CI = 0;
    var _ajaxLoader = {
        show: function () {
            var css = {
                'opacity': 1,
                'z-index': 1000
            };
            $('#j_ajaxLoader').remove();
            $('body').append('<div id="j_ajaxLoader"></div>');
            $('#j_ajaxLoader').css(css);
        },
        hide: function () {
            $('#j_ajaxLoader').css({ 'opacity': 0, 'z-index': -1 });
        }
    };

    rb.find('.btn-gain').on('click', function () {
        var oThis = $(this);
        //表单验证
        var mobile = $('input[name=mobile]').val();
        var r = _uzm.regex.mobile;
        var isValid = new RegExp(r).test(mobile);
        //彭胜锴 20161115 增加图形验证
        var graphic = $('input[name=verificationCode]').val();
        if (!graphic) {
            _uzm.pop.toast('请输入图形验证码');
            return;
        }

        if (oThis.hasClass('btn-disabled')) {
            return;
        }

        if (!mobile) {
            _uzm.pop.toast('请输入手机号');
            return;
        } else if (!isValid) {
            _uzm.pop.toast('请输入正确的手机号');
            return;
        }

        _uzm.mask.show();
        _ajaxLoader.show();
        //按钮倒计时
        var _countdown = function () {
            var regainBar = rb.find('.regain-bar');
            var iTime = regainBar.find('i');

            if (_CI) {
                clearInterval(_CI);
            }

            oThis.attr('disabled', 'disabled').addClass('btn-disabled');
            regainBar.show();

            _CI = setInterval(function () {
                if (iTime.get(0)) {
                    var t = parseInt(iTime.text(), 10);
                    iTime.text(t -= 1);
                }
            }, 1000);

            setTimeout(function () {
                oThis.removeAttr('disabled').removeClass('btn-disabled');
                regainBar.hide();
                iTime.text(60);
                clearInterval(_CI);
            }, 60000);
        };

        //异步获取验证码
        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            data: { "txtPhone": mobile, "type": "register", "txtCheckCode": "none","verificationCode":graphic },
            url: "/SendMobileCheckCode",
            success: function (data) {
                _uzm.mask.hide();
                _ajaxLoader.hide();
                switch (data) {
                    case "-5":
                        _uzm.pop.toast('验证码不能为空');
                        break;
                    case "-6":
                        _uzm.pop.toast('验证码错误');
                        break;
                    case "-2":
                        //_uzm.pop.toast('该号码已经注册');
                        goToLogin();
                        break;
                    case "-1":
                        _uzm.pop.toast('验证码发送过于频繁，请明天再试');
                        break;
                    case "true":
                        //直接倒计时
                        _uzm.pop.toast('验证码已发送');
                        _countdown();
                        break;
                    default:
                        _uzm.pop.toast('发送失败');
                        break;
                }
            },
            error: function () {
                _uzm.mask.hide();
                _ajaxLoader.hide();
                _uzm.pop.toast('网络异常');
                return;
            }
        });
    });

    rb.find('.btn-submit').on('click', function () {
        $(this).focus();//onblur
        var mobile = $('input[name=mobile]').val();
        var valCode = $('input[name=validateCode]').val();
        var actCode = $('input[name=activityCode]').val();
        var verificationCode = $('input[name=verificationCode]').val();
        var r = _uzm.regex.mobile;
        var isValid = new RegExp(r).test(mobile);
        var sb = [];

        if (!mobile) {
            _uzm.pop.toast('请输入手机号');
            return false;
        } else if (!isValid) {
            _uzm.pop.toast('请输入正确的手机号');
            return false;
        }

        _uzm.mask.show();
        _ajaxLoader.show();

        //提交表单
        var u = "/mobile/ActivityRegAsy";
        $.ajax({
            url: u,
            type: 'POST',
            data: "mobile=" + mobile + "&validateCode=" + valCode + "&activityCode=" + actCode +'&verificationCode='+verificationCode,
            success: function (data) {
                _uzm.mask.hide();
                _ajaxLoader.hide();
                if (data && data == 'success') {
                    _uzm.mask.show();
                    $('.fn-mask').css({ 'height': '100%' });
                    //活动注册 弹框修改
                    //pri.show();
                    regSpan.show();
                    regDiv.show();
                    setTimeout(function () {
                        _uzm.mask.hide();
                        //pri.hide();
                        regSpan.hide();
                        regDiv.hide();
                        location.href = _uzm.domain.m;
                    }, 3000);
                    regDiv.on('click', function () {
                        _uzm.mask.hide();
                        regSpan.hide();
                        regDiv.hide();
                        location.href = _uzm.domain.m;
                    });
                    //pri.on('click', function () {
                    //    _uzm.mask.hide();
                    //    pri.hide();
                    //    location.href = _uzm.domain.m;
                    //});
                } else {
                    _uzm.pop.toast(data);
                }
            },
            error: function () {
                _uzm.mask.hide();
                _ajaxLoader.hide();
                _uzm.pop.toast('注册失败');
            }
        });
        return false;
    });
};

// 常用信息
userexports.usuallyInfo = function () {
    $('.usually-info').on('click', '.certify-item .side-del', function () {
        var oThis = $(this);
        oThis.parent('.certify-item').remove();
    });

    $('#j_addCertify').on('click', function () {
        var oThis = $(this);
        var sHtml = '';

        sHtml +=
        '<div class="certify-item slice-mod mt10 clearfix">' +
            '<span class="side-del fl"><i class="del-icon"></i></span>' +
            '<ul class="forms-listing f14">' +
                '<li class="list-item clearfix">' +
                    '<label class="select-wrap">' +
                        '<select name="" id="" class="select-box f14">' +
                            '<option value="">护照</option>' +
                            '<option value="">身份证</option>' +
                            '<option value="">港澳通行证</option>' +
                            '<option value="">台胞证</option>' +
                            '<option value="">回乡证</option>' +
                            '<option value="">军人证</option>' +
                        '</select>' +
                    '</label>' +
                    '<span class="side-tips f999 fr">须与证件一致</span>' +
                '</li>' +
                '<li class="list-item"><label class="item-bd"><em class="info-hd f666">证件有效期</em><input type="date" class="textbox f14 tr g10" placeholder="须与证件一致"></label></li>' +
                '<li class="list-item"><label class="item-bd"><em class="info-hd f666">证件签发地</em><input type="text" class="textbox f14 tr g10" placeholder="须与证件一致"></label></li>' +
            '</ul>' +
        '</div>';

        oThis.parent().before(sHtml);
    });
};

$(function () {
    userexports.init();
});

