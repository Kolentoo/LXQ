/*************************
* Description: 支付js
* Creator:
* Create Date:
* History:
* ------------------------------------
* Update Date   |   Author   |    Note
* 2016-07-13    |   任凯丽   |   新建团队游支付页js
* 2016-11-29    |   余旭东   |   中行快捷支付走直连方式
* **********************/
var isbank = $("#isBank").val();
var PageType = $("#PageType").val();
$(function () {
    if (PageType == 1) {
        if (isbank > 0 && $("#IsUseBankPreferential").val() == "1") {
            $(".bank_card_m1").find(".bank_card_m1_img:eq(0)").find("li:eq(0)").removeClass("selected");
            $(".bank_card_m1").find(".bank_card_m1_img:eq(0)").find("li:eq(0)").find("input[name='pay_bank']").attr("checked", false);
            var CheckBankPreferentialId = $("#CheckBankPreferentialId").val();
            $("#CheckedBank" + CheckBankPreferentialId).attr("checked", "checked");
            //if ($("#IsUseBankPreferential").val() == "1") {
            var pay_pc = $("#PayChannel_PC").val();
            var pay_m = $("#PayChannle_M").val();
            var pay_ios = $("#PayChannle_IOS").val();
            var pay_andriod = $("#PayChannel_Android").val();
            if (pay_pc == "0") { //PC不可用
                var str = "";
                if (pay_andriod != "0" || pay_ios != "0") {
                    str = "APP";
                }
                if (pay_m != "0") {
                    if (str != "") {
                        str += "和";
                    }
                    str += "M站";
                }
                $("#lblPlat").html(str);
                popSuccess("youhui_NO");
                $("#qita").remove();
                $("#IsBank").remove();
                $(".f24").html('不可支付');
                $('.right_input').hide();
            } else {
                $("#qita").remove();
                $(".bank_card").remove();
            }

            //            }
        } else {
            var pay_pc = $("#PayChannel_PC").val();
            var pay_m = $("#PayChannle_M").val();
            var pay_ios = $("#PayChannle_IOS").val();
            var pay_andriod = $("#PayChannel_Android").val();
            if (pay_pc == "0") { //PC不可用
                var str = "";
                if (pay_andriod != "0" || pay_ios != "0") {
                    str = "APP";
                }
                if (pay_m != "0") {
                    if (str != "") {
                        str += "和";
                    }
                    str += "M站";
                }
                $("#lblPlat").html(str);
                popSuccess("youhui_NO");
                $(".bank_card").remove();
                $("#qita").remove();
                $("#IsBank").remove();
                $(".f24").html('不可支付');
                $('.right_input').hide();
            } else {
                if (isbank > 0) {
                    $(".bank_card_m1").find(".bank_card_m1_img:eq(0)").find("li:eq(0)").removeClass("selected");
                    $(".bank_card_m1").find(".bank_card_m1_img:eq(0)").find("li:eq(0)").find("input[name='pay_bank']").attr("checked", false);
                    $("#CheckedBank0").attr("checked", "checked");
                    $("#CheckedBank0").prop("checked", "checked");
                }
            }
        }
    }
})
function orderPaySubmit() {
    uzaiPay();
}
function uzaiPay() {
    var isBCM = $('#IsBCM').val();
    if (isBCM) {
        //是交通银行支付
        $('#BCMpay').attr("action", " /BCM_pay/");
        $('#BCMpay').submit();
        return;
    }
    //为用户添加或者修改默认银行值
    //获取paytype的属性值
    var paytype = "";
    var Bankcode = "";
    paytype = $("input[name='pay_bank'][checked='checked']").attr("paytype");
    Bankcode = $("input[name='pay_bank'][checked='checked']").val();
    var UserID = $('#userid').val();
    if (paytype != null && Bankcode != null && Bankcode != "cash") {//悠哉现金账户不能保存
        checkBank(UserID, paytype + "_" + Bankcode);
    }
    //判断是否是快捷支付
    if (paytype == "KJ") {
        if (Bankcode == "CMB") {
            $("#hdPayType").val("AliKJ");
        }
        else if (Bankcode == "BOC") {
            $("#hdPayType").val("BOC");
        }
        else {
            //往BankcodeAll复制
            $('#BankImg').val(paytype + "_" + Bankcode);
            //获取订单编号
            var orderid = $('#order_id').val();
            $('#formpay').attr("action", "/quick_pay_againNew/" + orderid);
            $('#formpay').submit();
            return;
        }
    }
    //银联绑定支付 2013-08-28 JoJo
    else if (paytype == 'BD' || paytype == 'BDCC') {
        //支付卡类型 01借记卡 02信用卡
        var payCardType = "01";
        if (paytype == 'BDCC') {
            payCardType = "02"; //表示当前选择的是信用卡
        }
        $('#hdPayType').val(Bankcode);
        $('#formpay').attr("action", "/Upop_Bind_PayNew/" + $.trim($('#order_id').val()) + "/" + payCardType);
        $('#formpay').submit();
        return;
    }
    else if (paytype == "PT") {//支付平台
        //李平飞 银联快捷支付
        if (Bankcode == "UNIONPAYKJ") {
            var orderid = $('#order_id').val();
            $('#hdPayType').val('UNIONPAYKJ');
            $('#formpay').attr("action", "/Upop_PayNew/" + orderid);
            $('#formpay').submit();
            return;
        }
        else if (Bankcode == "alipay" || Bankcode == "lakalapay") {
            $('#hdPayType').val('THREEPAY');
        }
        else {
            $('#hdPayType').val(Bankcode);
        }
    }
    else if (paytype == "UZ") {//悠哉旅游卡
        $('#hdPayType').val(Bankcode);
    }
    else if (paytype == "WY") {
        //2012-09-26 迟美欢 全部改为直接链接到快钱
        var che_CMB = Bankcode == "CMB"; //招行 涂丁一 2012-05-24
        var che_CCB = Bankcode == "CCB"; //建行 涂丁一 2012-05-24
        var che_SPDB = Bankcode == "SPDB"; //浦发
        var che_CIB = Bankcode == "CIB"; //兴业
        var che_PSBC = Bankcode == "PSBC"; //邮政储蓄银行独立接口 迟美欢 2013-07-05
        var che_BOC = Bankcode == "BOC"; //中国银行 迟美欢 2012-09-26
        var che_ICBC = Bankcode == "ICBC"; //工行 迟美欢 2012-09-26
        var che_ABC = Bankcode == "ABC"; //农行 迟美欢 2012-09-26
        var che_SDB = Bankcode == "SDB"; //深圳发展银行 迟美欢 2012-09-26
        var che_GDB = Bankcode == "GDB"; //广发 迟美欢 2012-09-26
        var che_CMBC = Bankcode == "CMBC"; //民生 迟美欢 2012-09-26
        var che_BCOM = Bankcode == "BCOM"; //交行 迟美欢 2012-09-26
        var che_HZB = Bankcode == "HZB"; //杭州银行 迟美欢 2012-09-26
        var che_NBCB = Bankcode == "NBCB"; //宁波银行 迟美欢 2012-09-26
        var che_PAB = Bankcode == "PAB"; //平安银行 迟美欢 2012-09-26
        var che_SRCB = Bankcode == "SRCB"; //上海农商银行 涂丁一 2012-09-26
        //增加中信银行接口
        var che_CITIC = Bankcode == "CITIC"; //中信银行独立接口 迟美欢 2013-06-28
        //增加上海银行接口
        var che_SHYH = Bankcode == "SHYH"; //上海银行 迟美欢 2014-11-03
        var che_SPDBX = Bankcode == "SPDBX"; //浦发银行 涂丁一 2016-02-22
        if (che_SPDB || che_CIB || che_CMB || che_CCB || che_BOC || che_ICBC || che_SDB || che_GDB || che_CMBC || che_BCOM || che_HZB || che_NBCB || che_PAB || che_SHYH) {
            //$('#hdPayType').val('KUAIQIAN'); //快钱
            $('#hdPayType').val('CMBC');
        }
        else if (che_CITIC) {
            $('#hdPayType').val('CITIC'); //中信银行
            $('#formpay').attr("action", " /CITIC_pay/");
            $('#formpay').submit();
            return;
        }
        else if (che_PSBC) {
            $('#hdPayType').val('PSBC'); //邮政储蓄银行
        }
        else if (che_SRCB) {
            $('#hdPayType').val('SRCB'); //上海农商银行
        }
        else if (che_ABC) { //上海农业银行
            $('#hdPayType').val('ABC');
        }
        else if (che_SPDBX) {//浦发银行
            $('#hdPayType').val('SPDBX');
        }
        else {
            $('#hdPayType').val('Ali'); //支付宝
        }
    }
    $('#formpay').attr("action", " /proc_fourPayNew/");
    $('#formpay').submit();
}

function utourworldPay() {
    var paytype = $(":radio[name='pay_bank']:checked").attr('paytype');
    var bankcode = $(":radio[name='pay_bank']:checked").val();
    if (paytype == "PT") {//支付平台
        //李平飞 银联快捷支付
        if (bankcode == "alipay") {
            $('#hdPayType').val('THREEPAY');
        }
        else {
            $('#hdPayType').val(bankcode);
        }
    }
    else if (paytype == "WY") {
        $('#hdPayType').val('KUAIQIAN'); //全走快钱通道
    }
    $('#formpay').attr("action", " /proc_fourPay/");
    $('#formpay').submit();
}

//当用户有默认的银行的时候，调用此方法进行提交   李平飞 2012-9-14
function BankSubmit() {
    var BankType = $.trim($(":radio[name='pay_bank']:checked").attr('paytype'));
    var BankCode = $.trim($(":radio[name='pay_bank']:checked").val());
    $('#BankImg').val(BankType + "_" + BankCode);
    if (BankType == "KJ") {
        if (BankCode == "CMB") { //支付宝招商快捷支付 2012-10-22 涂丁一
            $('#hdPayType').val('AliKJ');
        }
        else {
            var orderid = $('#order_id').val();
            $('#formpay').attr("action", "/quick_pay_againNew/" + orderid);
            $('#formpay').submit();
            return;
        }
    }
    else if (BankType == "WY") {
        $('#hdPayType').val('CMBC'); //2012-10-11 涂丁一 网银直连已全部改为快钱
        if (BankCode == "CMB" && document.getElementById('hdBankCMB') != null) {
            $('#hdPayType').val('CMB');
        }
        else if (BankCode == "CITIC") {//中信银行独立接口 迟美欢 2013-06-28
            $('#hdPayType').val('CITIC'); //中信银行
            $('#formpay').attr("action", " /CITIC_pay/");
            $('#formpay').submit();
            return;
        }
        else if (BankCode == "PSBC") {//邮政储蓄银行独立接口 迟美欢 2013-07-05
            $('#hdPayType').val('PSBC'); //邮政储蓄银行独立接口
        }
        else if (BankCode == "SRCB") {
            $('#hdPayType').val('SRCB'); //上海农商银行
        }
        else if (BankCode == 'ABC') { //上海农业银行
            $('#hdPayType').val('ABC');
        }
        else if (BankCode == 'SPDBX') {
            $('#hdPayType').val('SPDBX');
        }
    }
    else if (BankType == "PT") {
        //银联支付
        if (BankCode == "UNIONPAY") {
            $('#hdPayType').val('UNIONPAY');
        }
        //银联快捷支付
        else if (BankCode == "UNIONPAYKJ") {
            var orderid = $('#order_id').val();
            $('#hdPayType').val('UNIONPAYKJ');
            $('#formpay').attr("action", "/Upop_PayNew/" + orderid);
            $('#formpay').submit();
            return;
        }
        else if (BankCode == "alipay" || BankCode == "lakalapay") {
            $('#hdPayType').val('THREEPAY');
        }
        else if (BankCode == "KuaiQian") {
            $('#hdPayType').val('KUAIQIAN'); //快钱
        }
        else if (BankCode == "CFT") {
            $('#hdPayType').val('CAIFUTONG');
        }
        //财付通
        else if (BankCode == "MobilePay") {//手机支付
            $('#hdPayType').val('MobilePay');
        }
        else if (BankCode == "bhecard") {//易生支付 2014-08-22 涂丁一
            $('#hdPayType').val('bhecard');
        }


    }
    else if (BankType == "UZ") {
        if (BankCode == "daijinka") {//代金卡支付
            $('#hdPayType').val('DAIJINKA');
        }
        else if (BankCode == "cash") {//现金账户支付
            $('#hdPayType').val('CASH');
        }
    }
    //银联绑定支付 2013-08-28 JoJo
    if (BankType == "BD" || BankType == "BDCC") {
        $('#hdPayType').val(BankCode); //银联绑定支付所选择的银行类别
        var payCardType = BankType == "BDCC" ? "02" : "01"; //支付卡类型 01借记卡 02信用卡
        $('#formpay').attr("action", "/Upop_Bind_PayNew/" + $.trim($('#order_id').val()) + "/" + payCardType);
        $('#formpay').submit();
        return;
    } else {
        $('#formpay').attr("action", " /proc_fourPayNew/");
        $('#formpay').submit();
    }

}


//添加或者修改用户默认的银行信息  李平飞 2012-9-13
var url = "/QuickPayAjaxNew.action";
function checkBank(userid, Bankcode) {
    var result = {
        "userid": userid,
        "Bankcode": Bankcode
    };
    jQuery.post(url + "?method=UserPaySave", result, callback, 'json');
    function callback(data) {

        if (data.flag == "N") {

        } else if (data.flag == "Y") {

        }
    }

}

//重新选择银行 李平飞 2012-9-14
function SelectAgain() {
    if ($("#IsBank").css("display") == "block") {
        //删除默认的银行重新选择
        var UserID = $('#userid').val();
        var result = {
            "UserID": UserID
        };
        $.ajax({
            type: "post",
            url: url + "?method=UserPayDelete",
            data: result,
            async: false,
            success: function (data) {
                data = eval("(" + data + ")");
                if (data.flag == "Y") {
                    $('#IsBank').hide();
                    isbank = 0;//将默认银行的值设置为0；
                } else {
                    alert("登录状态有问题，请重新登录");
                    window.location.href = "https://u.uzai.com/reguser"; //跳到登录页面
                }
            }
        });
    }
}
function oncontract(orderId, cityId, orderType, viewType, type) {
    $(".body_shade,.storage").show();  //显示loading
    //&& !$("#hidSupplierNo").val()
    if ($("#hidSupplierFlag").val() == "008") {

        //众信订单且未导入众信ERP
        //1.校验优惠库存
        var param = new Object();
        //param.OrderCode = $("#OrderCode").val(); //orderid 加密后的订单
        //jsonData = JSON.stringify(param);
        if (type == 0) {
            $.ajax({
                url: "/Tour_OrderNew/CheckPreferentialRecord",
                data: { orderid: $("#OrderId").val() },
                cache: false,
                async: false,
                type: 'POST',
                success: function (data) {
                    var dataresult = eval('(' + data + ')');
                    //没有选择优惠活动
                    $(".body_shade,.storage").hide();
                    if (dataresult.ErrorCode == -1) {
                        alert(dataresult.ErrorMsg);
                        return false;
                    } else if (dataresult.ErrorCode == -2) {
                        //定金还未支付，调至用户中心
                        alert("您的订单已被拆分成多笔子订单，请至用户中心选择子订单支付，如有疑问，请联系我们的客服！");
                        window.location.href = 'https://u.uzai.com/manage/order/';
                    } else if (dataresult.ErrorCode == -3) {
                        //$("#youhuiBUtton").hide();
                        popSuccess('fukuan');
                        orderPaySubmit();
                    } else if (dataresult.ErrorCode == 100) {
                        //优惠记录没有库存
                        popSuccess('youhui');
                        return false;
                    } else if (dataresult.ErrorCode == -4) {
                        $("#youhuiBUtton").hide();
                        popSuccess('fukuan');
                        orderPaySubmit();
                    } else {
                        if ($("#OrderId").val().indexOf('S_') >= 0) {
                            $("#youhuiBUtton").hide();
                        } else {
                            $("#youhuiBUtton").show();
                        }
                        popSuccess('fukuan');
                        orderPaySubmit();
                    }
                },
                error: function () {
                    alert("系统错误，请重试或联系客服！");
                    return false;
                }
            });
        } else if (type == 1) {
            //插入优惠记录，并且验证优惠
            $.ajax({
                url: "/Tour_OrderNew/InsertPreferentialRecord",
                data: { preferentialJson: $("#hidSelectedActivities").val(), orderid: $("#OrderIdDES").val(), useScore: $("#txtHiddenUseScore").val(), useQuan: $("#txtHiddenUseVoucher").val()},
                cache: false,
                async: false,
                type: 'POST',
                success: function (data) {
                    var dataresult = eval('(' + data + ')');
                    $(".body_shade,.storage").hide();
                    if (dataresult.ErrorCode == -1) {
                        alert(dataresult.ErrorMsg);
                        window.location.reload();
                        return false;
                    } else if (dataresult.ErrorCode == -2) {
                        //定金还未支付，调至用户中心
                        alert("您的订单已被拆分成多笔子订单，请至用户中心选择子订单支付，如有疑问，请联系我们的客服！");
                        window.location.href = 'https://u.uzai.com/manage/order/';
                    } else if (dataresult.ErrorCode == -3) {
                        $("#youhuiBUtton").hide();
                        popSuccess('fukuan');
                        orderPaySubmit();
                    } else if (dataresult.ErrorCode == 100) {
                        //优惠记录没有库存
                        popSuccess('youhui');
                        return false;
                    } else {
                        if ($("#OrderId").val().indexOf('S_') >= 0) {
                            $("#youhuiBUtton").hide();
                        } else {
                            $("#youhuiBUtton").show();
                        }
                        popSuccess('fukuan');
                        orderPaySubmit();
                    }
                },
                error: function () {
                    alert("系统错误，请重试或联系客服！");
                    return false;
                }
            });
        } else {
            return false;
        }
    } else {
        if ($("#OrderId").val().indexOf('S_') >= 0) {
            $("#youhuiBUtton").hide();
            $(".storage").hide();
        } else {
            $("#youhuiBUtton").show();
        }
        popSuccess('fukuan');
        orderPaySubmit();
    }
}

function popSuccess(name) {
    $('.body_shade').show();
    $("#" + name).show();
    $('html').css('overflow', 'hidden').css('height', $(window).height());
}
//function popObj(id) {
//    popMod(id, 50);
//    fixIe6(id, 50);
//}
//function closeObj(id) {
//    $("#" + id).find(".pop-close").click();
//}

var ajaxCount = 0;
//2012-06-28 涂丁一
function GetPayStatus(method, orderId, type, code) {
    //http://pay.uzai.com
    var payUrl = "/proc_fourNew/" + orderId + "?type=" + type + "&code=" + code;
    var orderUrl = "https://u.uzai.com/manage/order/";
    if (orderId != "") {
        if (ajaxCount > 0) {
            return;
        }
        ajaxCount++;
        $.ajax({
            url: "/GetPayStatusNew/" + orderId,
            method: "post",
            async: false,
            error: function (e) {
                window.location.href = payUrl; //出现错误重新刷新支付页面，让客人重新选择支付方式
                ajaxCount = 0;
            },
            success: function (msg) {
                ajaxCount = 0;
                /*******************************************/
                //客户选择支付成功
                if (method == "Y") {
                    if (msg == "1") {//已支付成功
                        window.location.href = orderUrl;
                    }
                    else if (msg == "0") { //实际未支付成功
                        alert("该订单未支付成功！");
                        $("#closeNote").click();
                    }
                    else if (msg == "3") {//传过来为主订单号，但实际已被拆分为子订单，则跳转到订单列表
                        window.location.href = orderUrl;
                    }
                    else {//订单id参数不正确，重新刷新支付页面
                        window.location.href = payUrl;
                    }

                }
                /*******************************************/
                //客户选择支付不成功，重新支付
                if (method == "N") {
                    if (msg == "0") { //未支付成功
                        //$('#OrderStatusPop').jqmShow(); //防错层
                        if ($("#OrderId").val().indexOf('S_') >= 0) {
                            $("#youhuiBUtton").hide();
                        } else {
                            $("#youhuiBUtton").show();
                        }
                        popSuccess('fukuan');
                        orderPaySubmit();
                        _uzw.iframe.close(); //关闭本窗体
                    }
                    else if (msg == "1") { //实际已支付成功,导入订单列表
                        alert("该订单已支付成功！");
                        window.location.href = orderUrl;
                    }
                    else if (msg == "3") {//传过来为主订单号，但实际已被拆分为子订单，则跳转到订单列表
                        window.location.href = orderUrl;
                    }
                    else {//订单id参数不正确，重新刷新支付页面
                        window.location.href = payUrl;
                    }
                }
                //优惠活动
                if (method == "YH") {
                    if (msg == "1") {//已支付成功
                        alert("该订单已支付成功，无法修改优惠方案！");
                        window.location.href = orderUrl;
                    }
                    else if (msg == "0") { //实际未支付成功
                        window.location.href = '/proc_youhui/' + $("#OrderIdDES").val();
                    }
                    else if (msg == "3") {//传过来为主订单号，但实际已被拆分为子订单，则跳转到订单列表
                        window.location.href = orderUrl;
                    }
                    else {//订单id参数不正确，重新刷新支付页面
                        window.location.href = payUrl;
                    }
                }
            }
        });
    }
    else {
        window.location.href = payUrl;
    }

}
function close1() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {

        window.location.href = "about:blank";
        window.close();
    } else {

        window.opener = null;

        window.open("", "_self");

        window.close();

    }
}
function close2() {
    window.location.reload();
}
