/*
** 银联绑定支付使用
** 李云 2013-08-28 
** Copyright Uzai.com
*/
var ajaxUrl = "/UpopBindPayAjaxNew.action";
if($('#IsOrder2017').val() == '1') {
    url = "/outbound/UpopBindPayAjax.action";
}
$.ajaxSetup({
    async: false
});
$(function () {
    //下拉改变卡号时，对应上方图片及卡型进行改变
    $("#selCardId").change(function () {
        var selOpt = $("#selCardId").find("option:selected");
        $("#payType").attr("src", selOpt.attr("ImgSrc"));
        $("#payType").next().text($(this).val());

        $("#cardNumber").val($.trim(selOpt.attr("cardNumber")));
        $("#accNo").val($.trim(selOpt.attr("accNo")));
        $("#bindInfo").val($.trim(selOpt.attr("bindInfo")));
        $("#cardAttr").val($.trim(selOpt.attr("cardAttr")));
        $("#issInsCode").val($.trim(selOpt.attr("issInsCode")));
        $("#customerInfo").val($.trim(selOpt.attr("customerInfo"))); //为加密后数据 用户短信支付时使用
    });

    //获取手机验证码
    $("#sendSms").click(function () {
        var selOpt = $("#selCardId").find("option:selected");
        var param = {
            "outTradeNo": $.trim($("#hdOutTradeNo").val()),
            "orderAmount": $.trim($("#hdorderAmount").val()),
            "orderNo": $.trim($("#hdOrderNo").val()),
            "cardNumber": $.trim(selOpt.attr("cardNumber")),
            "accNo": $.trim(selOpt.attr("accNo")),
            "bindInfo": $.trim(selOpt.attr("bindInfo")),
            "cardAttr": $.trim(selOpt.attr("cardAttr")),
            "issInsCode": $.trim(selOpt.attr("issInsCode")),
            "customerInfo": $.trim(selOpt.attr("customerInfo"))//为加密后数据
        };
        $.ajax({
            type: "POST",
            data: param,
            cache: false,
            url: ajaxUrl + "?method=sendSms",
            success: function (d) {
                var data = eval("(" + d + ")")//orderId
                if (data.flag == "Y") {
                    $("#hdOrderId").val(data.orderId); //需与后续消费交易订单号一致 发送短信验证码和确认支付时的订单号必须一致,当发送成功后做记录在此，支付时获取
                    $("#spSendMsg").css("color", "green");
                    $("#spSendMsg").show();
                    $("#spSendMsg").text("验证码已发送到您的手机");
                }
                else {
                    $("#spSendMsg").css("color", "red");
                    $("#spSendMsg").show();
                    $("#spSendMsg").text(data.msg);
                }
            },
            error: function () {
                $("#spSendMsg").css("color", "red");
                $("#spSendMsg").show();
                $("#spSendMsg").text("发送失败，请重新发送");
            }
        }); //end ajax
    });

    //短信验证进行支付
    $("#btnSubPay").click(function () {
        if ($.trim($("#smsCode").val()) == "") {
            $("#spSendMsg").css("color", "red");
            $("#spSendMsg").show();
            $("#spSendMsg").text("请输入您收到的短信验证码");
            return false;
        } else {

            var selOpt = $("#selCardId").find("option:selected");
            $("#payType").attr("src", selOpt.attr("ImgSrc"));
            $("#payType").next().text($(this).val());

            $("#cardNumber").val($.trim(selOpt.attr("cardNumber")));
            $("#accNo").val($.trim(selOpt.attr("accNo")));
            $("#bindInfo").val($.trim(selOpt.attr("bindInfo")));
            $("#cardAttr").val($.trim(selOpt.attr("cardAttr")));
            $("#issInsCode").val($.trim(selOpt.attr("issInsCode")));
            $("#customerInfo").val($.trim(selOpt.attr("customerInfo"))); //为加密后数据 用户短信支付时使用
            /*
            var contl = $("#selCardId");
            var toUrl = "/UpopBindSMSPay?issInsCode=" + $.trim(contl.attr("issInsCode"))
            + "&cardAttr=" + $.trim(contl.attr("cardAttr"))
            + "&accNo=" + $.trim(contl.attr("accNo"))
            + "&customerInfo=" + $.trim(contl.attr("customerInfo"))
            + "&cardNumber=" + $.trim(contl.attr("cardNumber"))
            + "&bindInfo=" + $.trim(contl.attr("bindInfo"))
            */
            $('#formpay').attr("action", "/UpopBindSMSPayNew/");
            if($('#IsOrder2017').val() == '1') {
                $('#formpay').attr("action", "/outbound/UpopBindSMSPay/");
            }
            $('#formpay').removeAttr("target");
            $('#formpay').submit();
            editWidget_contract("");
            return false;
        }
    });
});
//解除绑定关系
function DeleteBind(bindId, accNo, controlId) {
    if (confirm("确认要删除绑定关系么？")) {
        $.ajax({
            type: "POST",
            cache: false,
            data: { "bindId": $.trim(bindId), "accNo": $.trim(accNo) },
            url: "/DelUpopBindPayAjaxNew.action",
            success: function (d) {
                var data = eval("(" + d + ")")
                if (data.flag == "Y") {
                    $("#spAltMsg").text(data.msg);
                    $("#spAltMsg").css("color", "green");
                    $("#spAltMsg").show();
                    $("#" + controlId).remove();
                    $("#cardNum").text(parseInt($.trim($("#cardNum").text()) - 1));
                }
                else {
                    $("#spAltMsg").text(data.msg);
                    $("#spAltMsg").css("color", "red");
                    $("#spAltMsg").show();
                }
            },
            error: function () {
                $("#spAltMsg").text("失败，请稍后再试！！");
                $("#spAltMsg").css("color", "red");
                $("#spAltMsg").show();
            }
        });  //end ajax
    }
}

function editWidget_contract(targeturl) {
    window.scrollTo(0, 0);
    var width = document.documentElement.clientWidth + document.documentElement.scrollLeft;
    var height = document.documentElement.clientHeight + document.documentElement.scrollTop;
    var layer = document.createElement('div');
    layer.style.zIndex = 999;
    layer.id = 'layer_contract';
    layer.style.position = 'absolute';
    layer.style.top = '0px';
    layer.style.left = '0px';
    layer.style.height = document.documentElement.scrollHeight + 'px';
    layer.style.width = width + 'px';
    layer.style.backgroundColor = 'black';
    layer.style.opacity = '.3';
    layer.style.filter += ("progid:DXImageTransform.Microsoft.Alpha(opacity=30)");
    document.body.style.position = 'static';
    document.body.appendChild(layer);

    var size = { 'height': 540, 'width': 890 };
    var iframe = document.createElement('iframe');
    iframe.name = 'Widget Editor';
    iframe.id = 'WidgetEditor_contract';
    iframe.scrolling = "no";
    iframe.src = targeturl;
    iframe.style.height = size.height + 'px';
    iframe.style.width = size.width + 'px';
    iframe.style.position = 'absolute';
    iframe.style.zIndex = 1000;
    iframe.style.border = "2px";
    iframe.frameBorder = "0px";
    iframe.marginwidth = "0";
    iframe.marginheight = "0";
    iframe.style.top = ((height + document.documentElement.scrollTop) / 2) - (size.height / 2) + 10 + 'px';
    iframe.style.left = (width / 2) - (size.width / 2) + 'px';
    document.body.appendChild(iframe);
}