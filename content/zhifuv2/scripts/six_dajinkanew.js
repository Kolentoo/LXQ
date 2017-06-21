var addCound = 1;
$(function () {
    //**初始化**//
    init_1();
    //**增加代金卡**//
    giftCard();
   
});
function btn_Submit() {
    var total = $("#txtHTotal").val(); //总金额
    var cartmoney = $("#SpanTotalCartMoney").text(); //代金卡支付金额
    var over = $("#SpanOverCartMoney").text(); //剩余支付
    if (cartmoney == "0" || cartmoney == "0.00") {
        alert("请使用您的代金卡进行支付，或者选择其他的支付方式！");
        return false;
    }
    $("#txtHCartMoney").val(cartmoney); //存储
    $("#txtHOverMoney").val(over); //存储
    var cartlist = ""; //代金卡使用拼接字符串如”卡号Id,抵扣金额$卡号Id,抵扣金额“
    $("input[id^='txtHidden_CartId_']").each(function () {
        var id = $(this).attr("id");
        var growId = id.substr(id.lastIndexOf("_") + 1); //Id，不重复
        var money = $("#txtHidden_Money_" + growId).val(); //抵扣金额
        if ($(this).val() != "" && money != "") {
            //已使用
            cartlist += $(this).val() + "@" + money + "$";
        }
    });
    if (cartlist != "") {
        cartlist = cartlist.substr(0, cartlist.length - 1);
    }
    $("#txtHCartList").val(cartlist); //存储
    //$.md({ modal: "#xs2" }); //遮罩层
    $(".body_shade,.storage").show();  //显示loading
}
//代金卡
function giftCard() {
    var card_div = $('.main_card_m').eq(0);
    if (card_div != null) {
        $('#add_card').on('click', function () {
            var random = getRandomNum();
            var sb = [];
            sb.push('<div class="bfefcf9"><div class="main_card_f bof1"><a href="javascript:void(0)" class="card_close"></a><div class="main_card_f1"><span class="main_card_f1_span">悠哉旅游卡</span>');
            sb.push('<div class="entry"><input type="text" maxlength="15"  placeholder="请输入卡号" id="txtCartNumber_' + (addCound + 1) + '" /></div></div>');
            sb.push('<div class="main_card_f2"><span class="main_card_f1_span">支付密码' + random.split("-")[0] + '-' + random.split("-")[1] + '-' + random.split("-")[2] + '</span><div class="entry"><input type="password" maxlength="2" id="txtCartPwdOne_' + (addCound + 1) + '" /><input type="password" maxlength="2" id="txtCartPwdTwo_' + (addCound + 1) + '" /><input type="password" maxlength="2" id="txtCartPwdThree_' + (addCound + 1) + '"/></div></div>');

            sb.push('<div class="main_card_f6"><span class="main_card_f1_span"></span><div class="entry"><input type="button" id="btn_CartPwd_' + (addCound + 1) + '" value="确认"/></div></div>');
            sb.push('<div class="main_card_f3"><span class="main_card_f1_span">余额</span><div class="num">¥<span id="spanCartAmt_' + (addCound + 1) + '">0</span></div></div>');
            sb.push('<div class="main_card_f4"><span class="main_card_f1_span">使用金额</span><div class="entry"><input type="text" maxlength="6"id="txtCartMoney_' + (addCound + 1) + '"/></div></div>');

            sb.push('<div class="main_card_f5"><span class="main_card_f1_span"></span>');
            sb.push('<div class="entry"><input type="button" value="使用" id="btn_CartTrue_' + (addCound + 1) + '"/></div></div>');
            sb.push('<input type="hidden" id="txtHiddenRemainAmt_' + (addCound + 1) + '"  />');
            sb.push('<input type="hidden"  id="txtHiddenRomdan_' + (addCound + 1) + '" value="' + random + '" />');
            sb.push('<input type="hidden" id="txtHidden_Money_' + (addCound + 1) + '" />');
            sb.push('<input type="hidden" id="txtHidden_CartId_' + (addCound + 1) + '"  />');
            sb.push('<div class="clear"></div></div></div>');

            card_div.append(sb.join(''));

            $('.card_close').on('click', function () {
                $(this).parent().remove();
                sumAll();
                return false;
            })

            AutoPwd();
            AutoTrue();
            addCound++;
        });
    }
}

//**生成三组随机码**//
function getRandomNum() {
    var num = ""; //5以内的数字
    for (var i = 0; i < 3; i++) {
        num += parseInt(Math.random() * 5 + 1) + ",";
    }
    num = num.substring(0, num.length - 1);
    var tmpCh = "";
    for (var i = 0; i < 3; i++) {
        tmpCh += String.fromCharCode(Math.floor(Math.random() * 5) + "A".charCodeAt(0)) + ",";
    }
    tmpCh = tmpCh.substring(0, tmpCh.length - 1);
    var numList = num.split(",");
    var tmpChList = tmpCh.split(",");
    var str = "";
    for (var i = 0; i < numList.length; i++) {
        str += tmpChList[i] + numList[i] + "-";
    }
    str = str.substring(0, str.length - 1);
    return str;
}
//**页面初始化**//
function init_1() {
    var random = getRandomNum();
    $("#bigcode_1").text("" + random.split("-")[0] + " - " + random.split("-")[1] + " - " + random.split("-")[2] + "");
    $("#txtHiddenRomdan_1").val(random);
    AutoPwd();
    AutoTrue();
}

//**注册确认密码事件**//
function AutoPwd() {
    var aurl = '/CheckGiftCardNew/';
    if($('#IsOrder2017').val() == '1') {
        aurl = '/outbound/CheckGiftCard/'
    }
    $("input[id^='btn_CartPwd_']").unbind("click");
    $("input[id^='btn_CartPwd_']").click(function () {
        var id = $(this).attr("id");
        var growId = id.substr(id.lastIndexOf("_") + 1); //Id，不重复
        var number = $("#txtCartNumber_" + growId).val(); //卡号
        var one = $("#txtCartPwdOne_" + growId).val(); //密码1
        var two = $("#txtCartPwdTwo_" + growId).val(); //密码2
        var three = $("#txtCartPwdThree_" + growId).val(); //密码3
        var random = $("#txtHiddenRomdan_" + growId).val(); //随机字母
        //判断是否使用重复的卡号
        var countd = 0;
        $("input[id^='txtCartNumber_']").each(function () {
            if ($.trim($(this).val()) != "" && ($.trim($(this).val()) == $.trim(number))) {
                countd++;
            }
        });
        if (countd > 1) {
            //说明多次使用
            alert("不可多次使用同一个卡号！");
            return;
        }
        if ($.trim(number) == "") {
            alert("请输入代金卡卡号！");
            $("#txtCartNumber_" + growId).focus();
            return;
        }
        if ($.trim(one) == "" || !checkNum(one)) {
            alert("请按照数字提示输入相应密码！[数字]");
            $("#txtCartPwdOne_" + growId).focus();
            return;
        }
        if ($.trim(two) == "" || !checkNum(two)) {
            alert("请按照数字提示输入相应密码！[数字]");
            $("#txtCartPwdTwo_" + growId).focus();
            return;
        }
        if ($.trim(three) == "" || !checkNum(three)) {
            alert("请按照数字提示输入相应密码！[数字]");
            $("#txtCartPwdThree_" + growId).focus();
            return;
        }
        $.ajax({
            type: "post",
            url: aurl + number + "/" + random + "/" + one + "-" + two + "-" + three,
            success: function (msg) {
                if (msg.indexOf("S_") >= 0) {
                    if (msg == "S_Error") {
                        alert("操作异常！");
                    }
                    else if (msg == "S_SError") {
                        alert("卡号或者密码错误！");
                    }
                    else if (msg == "S_Not_activate") {
                        alert("该卡未激活，请联系客服！");
                    }
                    else if (msg == "S_Not_enable") {
                        alert("该卡已失效！");
                    }
                    else if (msg == "S_Not_date") {
                        alert("该卡已过期！");
                    }
                    $("#spanCartAmt_" + growId).text("0"); //显示余额
                    $("#txtHiddenRemainAmt_" + growId).val(""); //隐藏余额
                    $("#txtHidden_CartId_" + growId).val(""); //卡号
                }
                else {
                    $("#txtHidden_CartId_" + growId).val(msg.split(',')[0]); //卡号Id
                    $("#txtHiddenRemainAmt_" + growId).val(msg.split(',')[1]); //卡号余额
                    $("#spanCartAmt_" + growId).text(msg.split(',')[1]); //显示余额
                }
                //清空后面的如果已经输入的余额
                $("#txtCartMoney_" + growId).val(""); //抵扣金额文本框
                $("#txtHidden_Money_" + growId).val(""); //抵扣金额隐藏域
                sumAll(); //重新计算
            } //end success
        }); // end $.ajax
    });
}
//**支付按钮事件**//
function AutoTrue() {
    var numsReg = new RegExp(/^[0-9]\d*$/); //正整数
    $("input[id^='btn_CartTrue_']").unbind("click");
    $("input[id^='btn_CartTrue_']").click(function() {
        var id = $(this).attr("id");
        var growId = id.substr(id.lastIndexOf("_") + 1); //Id，不重复
        var giftId = $("#txtHidden_CartId_" + growId).val(); //代金卡Id
        var remainAmt = $("#txtHiddenRemainAmt_" + growId).val(); //卡号余额
        var money = $("#txtCartMoney_" + growId).val(); //抵扣金额
        if (giftId == "") {
            alert("请确认支付密码！");
        }
        else if ($.trim(money) == "" || !checkNum(money)) {
            alert("请输入使用金额！[数字]");
        }
        else if (!numsReg.test(money)) {
            alert("请正确输入使用金额");
        }
        else if (money <= 0) {
            alert("使用金额必须大于0");
        } 
        else if (parseFloat(money) > parseFloat(remainAmt)) {
            alert("对不起，余额不足！");
        }
        else {
            $("#txtHidden_Money_" + growId).val(money);
            sumAll(); //计算总金额
        }
    });
}
//**计算总支付价格**//
function sumAll() {
    var total = $("#txtHTotal").val(); //总支付金额
    if (total) {
        total = parseFloat(total);
    }
    var addMoney = 0; //代金卡支付总金额
    $("input[id^='txtHidden_Money_']").each(function() {
        if ($(this).val()) {
            addMoney += parseFloat($(this).val());
        }
    });
    $("#SpanTotalCartMoney").text(addMoney.toFixed(2));
    var over = total - addMoney;
    if (over && over > 0) {
        $("#SpanOverCartMoney").text(over.toFixed(2));
    }
    else {
        $("#SpanOverCartMoney").text("0");
    }
}
//*判断是否是数字*//
function checkNum(str) {
    var flag = true;
    str = $.trim(str); //去掉空格
    if (str == "") {
        flag = false;
    }
    if (str != "" && isNaN(str)) {
        flag = false;
    }
    return flag;
}











