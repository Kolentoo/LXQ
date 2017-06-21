/*
* @Author: jonas hsiao
* @Date:   2016-09-20 11:19:39
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-10-28 18:29:06
*/

'use strict';

$(function () {
    unitTraffic();
    userRegister();
    unitTips();
});

function unitTips() {
    var gainflow = $('.gain-flow');
    if (gainflow.get(0)) {
        gainflow.find('.btn-more').on('click', function () {
            _uzm.pop.toast('敬请期待');
            return false;
        });
    }
}

function unitTraffic() {
    var flow = $('#j_flowBox');
    var water = flow.find('.box-water');
    if (flow.get(0)) {
        $.ajax({
            type: 'GET',
            cache: false,
            async: false,
            url: '/ashx/SongLiuliangRest.ashx',
            success: function (data) {
                var ratio = parseInt(data, 10);
                if (ratio < 1 / 5) {
                    water.addClass('water-null');
                } else if (ratio < 1 / 4) {
                    water.addClass('water-fifth');
                } else if (ratio < 1 / 2) {
                    water.addClass('water-quarter');
                } else if (ratio < 3 / 4) {
                    water.addClass('water-half');
                }
            }
        });
    }
}

function userRegister() {
    var regist = $('#j_userRegister');
    var isCorrectUrl = $('input[name=IsCorrectUrl]');
    var _unitCountdown = function (obj) {
        var ot = obj.text();
        var iTime = 60;
        var _CI = 0;

        if (_CI) {
            clearInterval(_CI);
        }

        _CI = setInterval(function () {
            if (iTime <= 1) {
                iTime = 60;
                obj.removeClass('btn-off').text(ot);
                clearInterval(_CI);
            } else {
                iTime = --iTime;
                obj.addClass('btn-off').text(iTime + '后重发');
            }
        }, 1000);
    };

    if (regist.get(0)) {
        if (!isCorrectUrl.val()) {
            _uzm.pop.confirm(isCorrectUrl.attr('data-tips'));
        }

        regist.find('.btn-submit').on('click', function () { // 注册
            var oThis = $(this);
            var username = $('#username').val();
            var captcha = $('#captcha').val();
            var password = $('#password').val();
            var invitorMobile = $('input[name=invitorMobile]').val();
            var phoneId = $('input[name=phoneid]').val();
            var code = $('input[name=code]').val();
            var reg = /^\d{4}$/;

            if (!username) {
                _uzm.pop.snackbar('请输入手机号！');
                return false;
            } else if (!_uzm.regexForm.mobile(username)) {
                _uzm.pop.snackbar('手机号格式不正确，请重新输入！');
                return false;
            } else if (!captcha) {
                _uzm.pop.snackbar('请输入短信验证码！');
                return false;
            } else if (!reg.test(captcha)) {
                _uzm.pop.snackbar('短信验证码格式不正确，请重新输入！');
                return false;
            } else if (!password) {
                _uzm.pop.snackbar('请输入密码！');
                return false;
            } else if (password.length < 6 || password.length > 16) {
                _uzm.pop.snackbar('请输入6-16位密码！');
                return false;
            }

            $.ajax({
                cache: false,
                async: false,
                timeout : 60000, 
                type: 'POST',
                url: '/ashx/SongLiuliangRegister.ashx',
                data: { 'Mobile': username, 'Password': password, 'Captcha': captcha, 'InvitorMobile': invitorMobile, 'PhoneId': phoneId, 'code': code },
                dataType: 'json',
                beforeSend: function (XMLHttpRequest) {
                    oThis.attr('disabled', 'true').addClass('btn-off');
                },
                success: function (data) {
                    try {
                        //alert("data:"+data);
                        //alert("data.msg:"+data.msg);
                        if (data.result === 6) {
                            var url = window.unescape(location.href.toLowerCase());
                            _uzm.user.refresh();
                            var id = _uzm.user.userid;
                            var p = url.split('reurl=')[1];
                            //alert("id:"+id);
                            //alert("p:"+p);
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
                    }
                    catch (e) {
                        //alert(e);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert('状态：' + textStatus + '；出错提示：' + errorThrown);
                    //_uzm.pop.toast('状态：' + textStatus + '；出错提示：' + errorThrown);
                    oThis.removeAttr('disabled').removeClass('btn-off');
                }
            });

        });

        regist.find('.btn-gain').on('click', function () { // 获取验证码
            var oThis = $(this);
            var username = $('#username').val();

            if (oThis.hasClass('btn-off')) {
                return;
            }
            var graphic = $('input[name=verificationCode]').val();
            if (!graphic) {
                _uzm.pop.toast('请输入图形验证码');
                return;
            }


            if (!username) {
                _uzm.pop.snackbar('请输入手机号！');
                return;
            } else if (_uzm.regexForm.mobile(username)) {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    async: false,
                    data: { 'username': username, "verificationCode": graphic },
                    url: '/reg/SendMobileRegCheckCode',
                    success: function (data) {
                        if (data === 'success') {
                            _uzm.pop.toast('验证码已通过短信发给您，请注意查收！');
                            _unitCountdown(oThis);
                        } else {
                            _uzm.pop.toast(data);
                        }
                    }
                });
            } else {
                _uzm.pop.snackbar('手机号格式不正确，请重新输入！');
                return false;
            }
        });
    }
}