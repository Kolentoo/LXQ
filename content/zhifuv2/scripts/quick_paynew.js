var url = "/QuickPayAjaxNew.action";
if($('#IsOrder2017').val() == '1') {
    url = "/outbound/QuickPayAjax.action";
}
var tempParam = "";
var regNumber = /^[0-9]*$/;
var partten = /^[\u4e00-\u9fa5A-Za-z]*$/;
var regId = /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/;

history.forward();
//短信倒计时
var noteval = 60;
var boo = true;
function autoTime() {
    if (!boo) {
        noteval--;
        $("#btnFirstSendSMS,#btnSecondSendSMS").attr("style", "background-color:#C1BEBF")
        $("#btnFirstSendSMS,#btnSecondSendSMS").html(noteval + '秒后可再次获取');
        if (noteval <= 0) {
            clearAutoTime();
        }
    }
}
//清除短信倒计时
function clearAutoTime() {
    $("#btnFirstSendSMS,#btnSecondSendSMS").attr("style", "background-color:#e5004f");
    $("#btnFirstSendSMS,#btnSecondSendSMS").removeAttr("disabled");
    $("#btnFirstSendSMS,#btnSecondSendSMS").html('获取验证码');
    noteval = 60;
    boo = true;
    clearInterval(noteTimer);
}

$(function () {
    //    $(".focusInput input[type='text']").focus(function() {
    //        $(this).parent().find("span.iphoneCheck").show();
    //    });
    //    $(".focusInput input[type='text']").blur(function() {
    //        $(this).parent().find("span.iphoneCheck").hide();
    //    });
    //首次支付发送短信
    $("#btnFirstSendSMS").click(function () {
        if (boo) {
            var payFormJson = getFirstPayFormJson();
            if (!validateFirstPayForm(payFormJson)) {//验证参数
                return;
            }
            boo = false;
            //$(this).removeClass("GetnoteCur");
            $(this).attr("disabled", "disabled");
            noteTimer = setInterval(autoTime, 1000);

            firstSendSMS(payFormJson);
        };
    });
    //首次支付是否同意协议书
    $('input[name="firstPayAgree"]').click(function () {
        if ($(this).is(':checked')) {
            $('#btnFirstPaySubmit').removeAttr('disabled').attr("style", "background-color:#e5004f");
        }
        else {
            $('#btnFirstPaySubmit').attr('disabled', 'disabled').attr("style", "background-color:#C1BEBF");
        }
    });
    //首次支付
    $("#btnFirstPaySubmit").click(function () {
        var payFormJson = getFirstPayFormJson();
        if (!validateFirstPayForm(payFormJson)) {//验证参数
            return;
        }
        var token = $("#hdToken").val();
        if (token == "") {
            alert("请先获取短信验证码");
            return;
        } else {
            $("#spanSMSCode").text("");
        }

        if (payFormJson.hName == null || payFormJson.hName == '' || typeof (payFormJson.hName) == typeof (undefined)) {
            payFormJson.hName = '匿名';
        }
        if (payFormJson.hId == null || payFormJson.hId == '' || typeof (payFormJson.hId) == typeof (undefined)) {
            payFormJson.hId = '000000000000000000';
        }

        var submitValue = payFormJson.cardNo + payFormJson.hName + payFormJson.idType + payFormJson.hId + (payFormJson.years + payFormJson.months) + payFormJson.phone + payFormJson.cvv2;
        if (tempParam != submitValue) {
            alert("请重新获取短信验证码");
            return;
        }

        var smsCode = $("#txtSMSCode").val();
        if (smsCode == "") {
            ShowErrorMsg("txtSMSCode", "请填写短信验证码");
            $("#txtSMSCode").focus();
            return;
        } else {
            HideErrorMsg("txtSMSCode");
        }
        $(".body_shade,.storage").show();  //显示loading
        $('#btnFirstPaySubmit').attr('disabled', 'disabled').attr("style", "background-color:#C1BEBF");
        $("#formpay").submit();
    });
    //绑定输入卡号信息
    $('#txtCardNo').blur(function () {
        var cardNo = $("#txtCardNo").val();
        if (cardNo == '') {
            ShowErrorMsg("txtCardNo", "请填写有效的卡号");
            $("#txtCardNo").focus();
            return;
        } else if (cardNo.length < 15) {
            ShowErrorMsg("txtCardNo", "卡号长度位数不足");
            $("#txtCardNo").focus();
            return;
        } else if (!regNumber.test(cardNo)) {
            ShowErrorMsg("txtCardNo", "卡号格式不正确");
            $("#txtCardNo").focus();
            return;
        } else {
            HideErrorMsg("txtCardNo");
        }

    });
    //第二次支付发送短信验证码
    $("#btnSecondSendSMS").click(function () {
        if (boo) {
            var result = {
                "UserID": $('#UserID').val(),
                "BankCVV": $('#BankCVV').val(),
                "BankCode": $('#BankCode').val(),
                "OrderID": $('#OrderID').val(),
                "Money": $('#Money').val(),
                "RefNumber": $("#RefNumber").val(),
                "StorablePan": $("#StorablePan").val()
            };

            if (result.BankCVV == "") {
                ShowErrorMsg("BankCVV", "请输入卡验证码");
                $("#BankCVV").focus();
                return false;
            } else if (!regNumber.test(result.BankCVV)) {
                ShowErrorMsg("BankCVV", "卡验证码格式不正确");
                $("#BankCVV").focus();
                return false;
            } else if (result.BankCVV.length != 3) {
                ShowErrorMsg("BankCVV", "卡验证码必须为3位数字");
                $("#BankCVV").focus();
                return false;
            } else {
                HideErrorMsg("BankCVV");
            }

            boo = false;
            //$(this).removeClass("GetnoteCur");
            $(this).attr("disable", "disable");
            noteTimer = setInterval(autoTime, 1000);

            SetNote(result)
        }
    });
    $('#BankCVV').blur(function () {
        var cardNo = $("#BankCVV").val();
        if (cardNo == '') {
            ShowErrorMsg("BankCVV", "请填写有效的验证码");
            return;
        } else {
            HideErrorMsg("BankCVV");
        }
    });

    $('#BankNote').blur(function () {
        var cardNo = $("#BankNote").val();
        if (cardNo == '') {
            ShowErrorMsg("BankNote", "请填写有效的验证码");
            return;
        } else {
            HideErrorMsg("BankNote");
        }
    });
    $("#txtName").blur(function () {
        if ($("#txtName").val() == "") {
            ShowErrorMsg("txtName", "请填写真实姓名");
            $("#txtName").focus();
            return false;
        } else {
            HideErrorMsg("txtName");
        }
    });
    $("#txtId").blur(function () {
        if ($("#txtId").val() == "") {
            ShowErrorMsg("txtId", "请填写有效证件号码");
            $("#txtId").focus();
            return false;
        } else {
            HideErrorMsg("txtId");
        }
    });
    //付款
    $("#btnSubmit").click(function () {
        if (CheckInfo()) {
            $("#formpay").submit();
        }
        else {
            return false;
        }
    });
});
//显示错误信息-by renkaili 2016-7-23
function ShowErrorMsg(obj,msg) {
    $("#" + obj).parent().css('position', 'relative')
    $("#" + obj).addClass('error');
    if (!$("#" + obj).next().hasClass('error_entry')) $("#" + obj).after('<div class="error_entry" style="display: block">' + msg + '</div>');
    //$('.activity_desc').show();
}
//隐藏错误信息-by renkaili 2016-7-23
function HideErrorMsg(obj) {
    $("#" + obj).removeClass('error');
    $("#" + obj).next('.error_entry').remove();
    //$('.activity_desc').hide();
}
//******************************************** 首次支付 ********************************************

function firstSendSMS(payFormJson) {

    $("#hdToken").attr("value", "");
    $("#spanSMSCode").text("");
    $("#spanSMSCode").css("color", "red");
    jQuery.post(url + "?method=fisrt_get_dyn", payFormJson, callback, 'json');
    function callback(data) {
        if (data.flag == "N") {
            if (data.msg != "") {
                alert(data.msg);
            }
            clearAutoTime();

        } else if (data.flag == "Y") {
            $("#hdtraceNo").attr("value", data.traceNo);
            $("#hdinvioceNo").attr("value", data.invioceNo);
            $("#hdaddData").attr("value", data.addData);
            $("#hdToken").attr("value", data.token);
            //$("#spanSMSCode").css("color", "green");
            alert("短信验证码已发送到您的手机上");
            tempParam = payFormJson.cardNo + payFormJson.hName + payFormJson.idType + payFormJson.hId + (payFormJson.years + payFormJson.months) + payFormJson.phone + payFormJson.cvv2;
        } else {
            alert(data.msg);
        }
    }
}

function getFirstPayFormJson() {
    var result = {
        "outTradeNo": $.trim($("#hdOutTradeNo").val()),
        "bankNo": $.trim($("#hdBankNo").val()),
        "cardNo": $.trim($("#txtCardNo").val()),
        "cardType": $("#hdCardType").val(),
        "hName": $.trim($("#txtName").val()),
        "idType": $("#slIdType").val(),
        "hId": $.trim($("#txtId").val()),
        "months": $("#slExpiredDateMonth").val(),
        "years": $("#slExpiredDateYear").val(),
        "phone": $.trim($("#txtPhone").val()),
        "cvv2": $.trim($("#txtCvv2").val()),
        "orderNo": $.trim($("#hdOrderNo").val()),
        "hdMoney": $.trim($("#hdMoney").val())
    };
    return result;
}

function validateFirstPayForm(payFormJson) {
    if (typeof (payFormJson) == typeof (undefined) || payFormJson == null) {
       alert("出现系统错误，请联系悠哉客服！");
        return false;
    }
    //卡号
    $("#spanCardNo").text("");
    if (payFormJson.cardNo == '') {
        ShowErrorMsg("txtCardNo", "请填写有效的卡号");
        $("#txtCardNo").focus();
        return false;
    } else if (!regNumber.test(payFormJson.cardNo)) {
        ShowErrorMsg("txtCardNo", "卡号格式不正确");
        $("#txtCardNo").focus();
        return false;
    } else {
        HideErrorMsg("txtCardNo");
    }
    if (payFormJson.cardNo.length < 15) {
        ShowErrorMsg("txtCardNo", "卡号长度位数不足");
        $("#txtCardNo").focus();
        return false;
    } else {
        HideErrorMsg("txtCardNo");
    }
    //姓名证件
    $("#spanName").text("");
    $("#spanId").text("");
    if (payFormJson.bankNo != 'BOC') {
        if (payFormJson.hName == '') {
            ShowErrorMsg("txtName", "请填写真实姓名");
            $("#txtName").focus();
            return false;
        }
        if (payFormJson.hId == '') {
            ShowErrorMsg("txtId", "请填写有效证件号码");
            $("#txtId").focus();
            return false;
        }
    }
    if (!partten.test(payFormJson.hName)) {
        ShowErrorMsg("txtName", "姓名格式不正确");
        $("#txtName").focus();
        return false;
    } else {
       HideErrorMsg("txtName");
    }
    if (payFormJson.hId.length > 0 && !regId.test(payFormJson.hId)) {
        ShowErrorMsg("txtId", "有效证件号码格式不正确");
        $("#txtId").focus();
        return false;
    } else if (payFormJson.hId.length > 0 && payFormJson.hId.length != 15 && payFormJson.hId.length != 18) {
        ShowErrorMsg("txtId", "身份证号码是15或18位");
        $("#txtId").focus();
        return false;
    } else {
       HideErrorMsg("txtId");
   }
   if (payFormJson.months == "" || payFormJson.years == "") {
       ShowErrorMsg("yearError", "请选择有效期");
       if (payFormJson.months == "") {
           $("#slExpiredDateMonth").focus();
       } else {
           $("#slExpiredDateYear").focus();
       }
       return false;
   }
    //卡验证码
    if (payFormJson.cvv2 == "") {
        ShowErrorMsg("txtCvv2", "请填写卡验证码");
        $("#txtCvv2").focus();
        return false;
    } else if (!regNumber.test(payFormJson.cvv2)) {
        ShowErrorMsg("txtCvv2", "卡验证码格式不正确");
        $("#txtCvv2").focus();
        return false;
    } else if (payFormJson.cvv2.length < 3) {
        ShowErrorMsg("txtCvv2", "卡验证码必须为3位数字");
        $("#txtCvv2").focus();
        return false;
    } else {
        HideErrorMsg("txtCvv2");
    }
    //手机
    if (payFormJson.phone == '') {
        ShowErrorMsg("txtPhone", "请填写手机号码");
        $("#txtPhone").focus();
        return false;
    } else if (payFormJson.phone.length != 11) {
        ShowErrorMsg("txtPhone", "手机号必须为11位数字");
        $("#txtPhone").focus();
        return false;
    } else if (!regNumber.test(payFormJson.phone)) {
        ShowErrorMsg("txtPhone", "手机号格式不正确");
        $("#txtPhone").focus();
        return false;
    } else {
        HideErrorMsg("txtPhone");
    }
    return true;
}
function RQcheck(RQ) {
    var date = RQ;
    var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

    if (result == null)
        return false;
    var d = new Date(result[1], result[3] - 1, result[4]);
    return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);

}
//********************************************end 首次支付********************************************



//********************************************begin 第二次支付********************************************


//验证相关必填信息
function CheckInfo() {
    //获取银行校检码
    var cvv = $('#BankCVV').val();
    //获取短信验证码
    var BankNote = $('#BankNote').val();
    //获取返回的note
    var note = $('#token').val();

    if (cvv == "") {
        ShowErrorMsg("BankCVV", "请输入卡验证码");
        return false;
    } else if (!regNumber.test(cvv)) {
        ShowErrorMsg("BankCVV", "卡验证码格式不正确");
        return false;
    } else if (cvv.length != 3) {
        ShowErrorMsg("BankCVV", "卡验证码必须为3位数字");
        return false;
    }
    else if (note == "") {
        //不满足付款条件
        alert("请先发送短信验证码");
        return false;
    }
    else if (BankNote == "") {
        alert("请填写短信验证码");
        return false;
    }
    else {
        $(".body_shade,.storage").show();  //显示loading
        $('#btnSubmit').attr('disabled', 'disabled').attr("style", "background-color:#C1BEBF");
        $('#btnSubmit').val("付款中...");
        $("#formpay").submit();
        return true;
    }

}

function CheckMsg() {

    if ($('input[name="Istrue"]').is(':checked')) {
        $('#btnSubmit').removeAttr('disabled').attr("style", "background-color:#e5004f");
    }
    else {
        $('#btnSubmit').attr('disabled', 'disabled').attr("style", "background-color:#C1BEBF");
    }

}




//发送手机验证码
function SetNote(result) {

    jQuery.post(url + "?method=second_get_dyn", result, callback, 'json');
    function callback(data) {
        if (data.flag == "N") {
            if (data.msg != "") {
                alert(data.msg);
            }
            clearAutoTime();
        } else if (data.flag == "Y") {
            $("#token").attr("value", data.token);
            //$("#spanSMSCode").attr("style", "color:green");
            alert("短信验证码已发送到您的手机上");
            tempParam = result.UserID + result.BankCVV + result.BankCode + result.OrderID + result.Money;
        } else {
            $("#spanSMSCode").text(data.msg);
            $("#btnFirstSendSMS").removeAttr("disable");
        }
    }
}




//重新选择银行 李平飞 2012-9-14
function SelectAgain() {
    //删除默认的银行重新选择
    var UserID = $('#UserID').val();
    var result = {
        "UserID": UserID
    };
    var orderid = $('#OrderID').val();
    jQuery.post(url + "?method=UserPayDelete", result, callback, 'json');
    function callback(data) {
        if (data.flag == "Y") {
            window.location.href = "/proc_four/" + orderid + "";
        }
        else {
            $("#ErrorMsg").text(data.msg);
        }
    }
}


//********************************************end   第二次支付********************************************

$('.section-select').click(function () {
    $(this).children('.section-select_option').show();
    return false;
})
$('.section-select .section-select_option a').click(function () {
    $(this).parentsUntil('.section-select').eq($(this).parentsUntil('.section-select').length - 1).parent().children('span').html($(this).html());
    $('.section-select_option').hide();
    if ($(this).html() == '男') {
        $(this).parentsUntil('.fill_main_m').eq($(this).parentsUntil('.fill_main_m').length - 1).prev().addClass('boy').removeClass('girl');
    } else {
        $(this).parentsUntil('.fill_main_m').eq($(this).parentsUntil('.fill_main_m').length - 1).prev().addClass('girl').removeClass('boy');
    }
    return false;
})
$(document).click(function () {
    $('.section-select_option').hide();
})
function DateChange(e, type) {
    HideErrorMsg("yearError");
    if (type == 1) {
        $("#slExpiredDateMonth").val($(e).html());
    } else {
        var year = $(e).html().substring(2, 4);
       $("#slExpiredDateYear").val(year);
    }
}
