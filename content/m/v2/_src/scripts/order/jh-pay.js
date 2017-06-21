/*
* @Author: lxq
* @Date:   2016-09-14 14:00:49
* @Last Modified by:   lxq
* @Last Modified time: 2016-09-21 11:24:16
*/

'use strict';

var exportsorder = {};

exportsorder.init = function () {
    exportsorder.argeement();
    exportsorder.countDown();
    exportsorder.check();
};

$(function () {
    exportsorder.init();
});

exportsorder.argeement = function () {
    var jhBox = $('#j_jh');
    var agreement = jhBox.find('.user-agreement');
    var orderSection = jhBox.find('.order-section');
    var vm = jhBox.find('.order-section').find('.m-validate');
    $('.agree-btn').on('click', function () {
        agreement.addClass('user-on');
        orderSection.addClass('order-off');
        $('body,html').scrollTop(0);
    });
    $('.agree-close').on('click', function () {
        agreement.removeClass('user-on');
        orderSection.removeClass('order-off');
    });
    vm.on('click', function () {
        var o = $(this);
        o.toggleClass('vm-on');
        var op = o.parents('.jh-box');
        var vmo = op.find('.vm-on');
        var vl = vmo.length;
        if (vl <= 4) {
            $('.order-btn').addClass('order-over');
        } else if (vl === 5) {
            $('.order-btn').removeClass('order-over');
        }
    });
};

exportsorder.countDown = function () {
    var jhBox = $('#j_jh');
    var c1 = jhBox.find('.c1');
    var c2 = jhBox.find('.c2');
    var c2em = jhBox.find('.c2').find('em');
    c1.on('click', function () {
        c1.hide();
        c2.show();
        var ctxt = c2.text();
        c2em.text('59');
        var i = 58;
        var time = setInterval(function () {
            if (i === 0) {
                clearInterval(time);
                c1.show();
                c2.hide();
            }
            c2em.text(i--);
        }, 1000);
        jQuery.post("/HSBCAjax.action", getFirstPayFormJson(), callback, 'json');
        function callback(data) {
            if (data.flag == "N") {
                _uzm.pop.snackbar('发送失败，请稍候再尝试');
            } else {
                $("#hdtraceNo").attr("value", data.traceNo);
                $("#hdinvioceNo").attr("value", data.invioceNo);
                $("#hdaddData").attr("value", data.addData);
                _uzm.pop.snackbar('验证码已发送到您开户的手机上');
            }
        }
    });
};

function getFirstPayFormJson() {
    var result = {
        "OrderCode": $.trim($("#hdOrderCode").val()),
        "cardNo": $.trim($("#txtCardNo").val()),
        "expiryDate": $.trim($("#txtexpiryDate").val()),
        "cardHolderName": $.trim($("#txtcardHolderName").val())
    };
    return result;
}

exportsorder.check = function () {
    var jhBox = $('#j_jh');
    var obtn = jhBox.find('.order-btn');
    var partten = /^[\u4e00-\u9fa5A-Za-z]*$/;

    var ipt = jhBox.find('.message-group').find('input');
    var vm1 = jhBox.find(".m-list1").find('.m-validate');
    var vm2 = jhBox.find(".m-list2").find('.m-validate');
    var vm3 = jhBox.find(".m-list3").find('.m-validate');
    var vm4 = jhBox.find(".m-list4").find('.m-validate');

    var ccard = jhBox.find('.credit-card');
    var utime = jhBox.find('.use-time');
    var phone = jhBox.find('.phone');
    var cname = jhBox.find('.use-name');

    $('.credit-card').blur(function () {
        if (!ccard.val()) {
            _uzm.pop.snackbar('请输入卡号');
            return false;
        } else {
            if (ccard.val()) {
                var reg = /^\d{16}$/g;
                if (!reg.test(ccard.val())) {
                    _uzm.pop.snackbar('请提供正确的银行卡卡号');
                    vm1.addClass('hide').removeClass('vm-on');
                    return false;
                }
                else {
                    vm1.removeClass('hide').addClass('vm-on');
                }
            } else {
                vm1.removeClass('hide').addClass('vm-on');

            }
        }
    });

    $('.use-time').blur(function () {
        if (!utime.val()) {
            _uzm.pop.snackbar('请输入有效期');
            vm2.addClass('hide').removeClass('vm-on');
            return false;
        } else {
            vm2.removeClass('hide').addClass('vm-on');
        }
    });

    $('.phone').blur(function () {
        if (!phone.val()) {
            _uzm.pop.snackbar('请输入验证码');
            vm3.addClass('hide').removeClass('vm-on');
            return false;
        } else {
            var msg = /^\d{6}$/g;
            if (!msg.test(phone.val())) {
                _uzm.pop.snackbar('请输入正确的验证码');
                vm3.addClass('hide').removeClass('vm-on');
                return false;
            } else {
                vm3.removeClass('hide').addClass('vm-on');
            }

        }
    });

    $('.use-name').blur(function () {
        if (!cname.val()) {
            _uzm.pop.snackbar('请输入姓名');
            vm4.addClass('hide').removeClass('vm-on');
            return false;
        } else {
            if (!partten.test(cname.val())) {
                _uzm.pop.snackbar('姓名格式不正确');
                return false;
            } else {
                vm4.removeClass('hide').addClass('vm-on');
            }

        }
    });

    function getPayHSBCJson() {
        var result = {
            "OrderCode": $.trim($("#hdOrderCode").val()),
            "invioceNo": $.trim($("#hdinvioceNo").val()),
            "traceNo": $.trim($("#hdtraceNo").val()),
            "addData": $.trim($("#hdaddData").val()),
            "CardNo": $.trim($("#hdCardNo").val()),
            "expiryDate": $.trim($("#hdexpiryDate").val()),
            "cardHolderName": $.trim($("#txtcardHolderName").val()),
            "phone": $.trim($("#phone").val())
        };
        return result;
    }

    ipt.blur(function () {
        var t = $(this);
        var tp = t.parents('.jh-box');
        var vmo = tp.find('.vm-on');
        var vl = vmo.length;
        if (vl <= 4) {
            $('.order-btn').addClass('order-over');
        } else if (vl === 5) {
            $('.order-btn').removeClass('order-over');
        }
    });


    if (obtn.get(0)) {
        obtn.on('click', function () {
            var sb = [];
            var _push = function (obj, name) {
                if (obj.val()) {
                    sb.push(name + '=' + obj.val());
                }
            };

            if ($('.vm-no').hasClass('vm-on')) {
                if (!ccard.val()) {
                    _uzm.pop.snackbar('请输入卡号');
                    return false;
                } else {
                    if (ccard.val()) {
                        var reg = /^\d{16}$/g;
                        if (!reg.test(ccard.val())) {
                            _uzm.pop.snackbar('请提供正确的银行卡卡号');
                            vm1.addClass('hide');
                            return false;
                        }
                        else {
                            vm1.removeClass('hide');
                        }
                    } else {
                        vm1.removeClass('hide');
                    }
                }

                if (!utime.val()) {
                    _uzm.pop.snackbar('请输入有效期');
                    vm2.addClass('hide');
                    return false;
                } else {
                    vm2.removeClass('hide');
                }

                if (!phone.val()) {
                    _uzm.pop.snackbar('请输入验证码');
                    vm3.addClass('hide');
                    return false;
                } else {
                    vm3.removeClass('hide');
                }

                if (!cname.val()) {
                    _uzm.pop.snackbar('请输入姓名');
                    vm4.addClass('hide');
                    return false;
                } else {
                    vm4.removeClass('hide');
                }
                $("#hdCardNo").val($("#txtCardNo").val());
                $("#hdexpiryDate").val($("#txtexpiryDate").val());
                pay();
            } else {
                return false;
            }


        var data = {
            ccard: ccard.val(),
            utime: utime.val(),
            phone: phone.val(),
            cname: cname.val()
        };

        obtn.children('a').text('正在提交...');
        if(obtn.children('a').text() === "正在提交..."){
            return false;
        }

        $.ajax({
            type: "post",
            data: data,
            url: "/PayHSBCResult.action",
            success: function (msg) {
                window.location.href = "http://pay.uzai.com/PayHSBCSuccess";
            },
            error: function () {
                _uzm.pop.snackbar('预订失败！请核对您填写的信息或联系客服');
            }
        });




        });
    }

    function pay() {
        jQuery.post("/PayHSBCResult.action", getPayHSBCJson(), payHSBCcallback, 'json');
        function payHSBCcallback(data) {
            if (data.flag) {
                window.location.href = "http://pay.uzai.com/PayHSBCSuccess";
            } else {
                _uzm.pop.snackbar('预订失败！请核对您填写的信息或联系客服');
            }
        }
    }
};