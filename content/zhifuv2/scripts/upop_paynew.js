var url = "/UpopPayAjaxNew.action";
var url_ = " /AuthPayNew";
if($('#IsOrder2017').val() == '1') {
    url = "/outbound/UpopPayAjax.action";
    url_ = "/outbound/AuthPay";
}
$.ajaxSetup({
    async: false
});
$(function () {
    //    run();             //加载页面时启动定时器   
    //    var interval;
    //    function run() {
    //        interval = setInterval(Hidden, "5000");
    //    }
    $("#sendSms").click(function () {
        if (!CheckCard()) {
            return false;
        } else {
            CheckOpen(1);
        }
    });

    $("#linkTips").click(function () {
        if ($("#cardNumber").val() == "") {
            ShowErrorMsg("cardNumber", "银行卡号不能为空");
            return false;
        }
        else if (!luhmCheck($("#cardNumber").val())) {
            ShowErrorMsg("cardNumber", "请输入正确的银行卡号");
            return false;
        }
        HideErrorMsg("cardNumber");
        $('#formpay').attr("action", " /UpopActivateFontForm/");
        $('#formpay').submit()
    });

    $("#cardNumber").blur(function () {
        if ($("#cardNumber").val() == "") {
            ShowErrorMsg("cardNumber", "银行卡号不能为空");
            return false;
        }
        else if (!luhmCheck($("#cardNumber").val())) {
            ShowErrorMsg("cardNumber", "请输入正确的银行卡号");
            return false;
        }
        HideErrorMsg("cardNumber");
    })
    $("#SureBt").click(function () {
                if (!CheckCard()) {
                    return false;
                }
                if (!CheckSMS()) {
                    return false;
                }
        $(".body_shade,.storage").show();  //显示loading
        $('#formpay').attr("action", url_);
        $('#formpay').attr("target", "");
        $('#formpay').submit();
        editWidget_contract("");
    });


});
var ParaJson = new Object();
function CheckOpen(type) {
    var flag = false;
    //AJAX请求
    var CardNumber = $.trim($("#cardNumber").val());
    var result = {
        "outTradeNo": $.trim($("#hdOutTradeNo").val()),
        "CardNumber": CardNumber
    };
    if (type == 0) {
        $.ajax({
            type: 'POST',
            url: url + "?method=CheckCard",
            data: result,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.flag == "Y") {
                    //已经开通业务，发送短信验证码
                    flag = true;
                    var phone = data.phone;
                    ParaJson = {
                        "outTradeNo": $.trim($("#hdOutTradeNo").val()),
                        "CardNumber": CardNumber,
                        "phoneNumber": phone,
                        "orderAmount": $.trim($("#hdorderAmount").val())
                    };
                }
                else {
                    ShowErrorMsg("cardNumber", data.msg);
                }
            }
        });
    } else if (type == 2) {
        //1.验证是否是银行活动
        if ($("#IsBankPreferential").val() == 1) {
               if ($("#CardBin").val() == "") {
                   flag = true; //并不需要验证卡bin,没有卡bin限制
               } else {
               var isCheck = false;
                   var cardPart = $("#CardBin").val().replace("，",",").split(',');
                   for (var i = 0; i < cardPart.length; i++) {
                       var CardNumberPart = $("#cardNumber").val().substring(0, cardPart[i].length);
                       if (cardPart.indexOf(CardNumberPart) >= 0) {
                           isCheck = true;
                           break;
                       }
                   }
                   if (isCheck) {
                       //3.验证单卡可使用人数和单卡可用订单数
                       var dataParam = {
                           "OrderCode": $("#OrderCode").val(),
                           "CardNumber": $("#cardNumber").val(),
                           "CardBin": $("#CardBin").val(),
                           "SingleCardAdults": $("#SingleCardAdults").val(),
                           "SingleCardOrders": $("#SingleCardOrders").val(),
                           "IsBankPreferential": $("#IsBankPreferential").val(),
                           "BankPreferentialID": $("#BankPreferentialID").val(),
                           "ValuationWay": $("#ValuationWay").val(),
                           "OrderPerson": $("#OrderPerson").val(),
                           "ChildCount": $("#ChildCount").val(),
                           "AdaptationGroup": $("#AdaptationGroup").val()
                       }
                       $.ajax({
                           type: 'POST',
                           url: url + "?method=CheckCardBin",
                           data: dataParam,
                           async: false,
                           dataType: "json",
                           success: function (data) {
                               if (data.Flag == true) {
                                   flag = true;
                               }
                               else {
                                   ShowErrorMsg("cardNumber", data.Msg);
                               }
                           }
                       });
                   } else {
                       ShowErrorMsg("cardNumber", "不满足优惠活动的卡号限制");
                   }
               }
            } else {
               //并不是银行活动
                flag = true;
            }   
    } else {
        if (ParaJson.phoneNumber != "") {
            SendSMS(ParaJson);
        }

    }
    return flag;
}


function SendSMS(ParaJson) {
    $.ajax({
        type: 'POST',
        url: url + "?method=SendSMS",
        data: ParaJson,
        async: true,
        dataType: "json",
        success: function (data) {
            if (data.flag == "Y") {
                $("#sendSms").attr("disabled", "disabled");
                noteTimer = setInterval(autoTime, 1000);
            }
            else {
                ShowErrorMsg("smsCode", data.msg);
            }
        }
    });
}
//短信倒计时
var noteval = 60;
function autoTime() {
  noteval--;
  $("#sendSms").attr("style", "background-color:#C1BEBF")
  $("#sendSms").html("短信发送成功，"+noteval + '秒后可再次获取');
  if (noteval <= 0) {
      clearAutoTime();
  }
}
//清除短信倒计时
function clearAutoTime() {
    $("#sendSms").attr("style", "background-color:#e5004f");
    $("#sendSms").removeAttr("disabled");
    $("#sendSms").html('获取手机验证码');
    noteval = 60;
    clearInterval(noteTimer);
}
//定时隐藏提示
function Hidden() {
    $("#spanSMSCode").hide();
    $("#ErrorMsg").hide();
}

//验证卡号
function CheckCard() {
    if ($("#cardNumber").val() == "") {
        ShowErrorMsg("cardNumber", "银行卡号不能为空");
        return false;
    }
    else if (!luhmCheck($("#cardNumber").val())) {
        ShowErrorMsg("cardNumber", "请输入正确的银行卡号");
        return false;
    } else if (!CheckOpen(2)) {
        //验证卡bin
        return false;
    }
    //验证卡号是否开通
    else if (!CheckOpen(0)) {
        return false;
    } else {
        HideErrorMsg("cardNumber");
        return true;
    }


}

//验证短信验证码
function CheckSMS() {
    CheckCard();
    if ($("#smsCode").val() == "") {
        ShowErrorMsg("smsCode", "验证码不能为空");
        return false;
    }
    else if ($("#smsCode").val().length != 6) {
        ShowErrorMsg("smsCode", "请输入正确的验证码");
        return false;
    } else {
    HideErrorMsg("smsCode");
        return true;
    }
}

//银行卡验证方法
function luhmCheck(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array();  //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9

    var arrOuShu = new Array();  //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
                arrJiShu.push(parseInt(newArr[j]) * 2);
            else
                arrJiShu2.push(parseInt(newArr[j]) * 2);
        }
        else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算Luhm值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;

    if (lastNum == luhm) {
        return true;
    }
    else {
        return false;
    }
}


function editWidget_contract(targeturl) {
    window.scrollTo(0, 0);
    var width = document.documentElement.clientWidth + document.documentElement.scrollLeft;
    var height = document.documentElement.clientHeight + document.documentElement.scrollTop;
    var layer = document.createElement('div');
    layer.style.zIndex = 2;
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
    iframe.style.zIndex = 4;
    iframe.style.border = "2px";
    iframe.frameBorder = "0px";
    iframe.marginwidth = "0";
    iframe.marginheight = "0";
    iframe.style.top = ((height + document.documentElement.scrollTop) / 2) - (size.height / 2) + 10 + 'px';
    iframe.style.left = (width / 2) - (size.width / 2) + 'px';
    document.body.appendChild(iframe);
}
//显示错误信息-by renkaili 2016-7-23
function ShowErrorMsg(obj, msg) {
    $("#" + obj).parent().css('position', 'relative')
    $("#" + obj).addClass('error');
    if (!$("#" + obj).hasClass('error_entry')) $("#" + obj).after('<div class="error_entry">' + msg + '</div>');
    //$('.activity_desc').show();
}
//隐藏错误信息-by renkaili 2016-7-23
function HideErrorMsg(obj) {
    $("#" + obj).removeClass('error');
    $("#" + obj).next('.error_entry').remove();
    //$('.activity_desc').hide();
}
function showPreferentialDis() {
    $(".activity_desc_m").show();
}
function hidePreferentialDis() {
    $(".activity_desc_m").hide();
}
