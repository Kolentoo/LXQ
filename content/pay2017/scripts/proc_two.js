/********************************************************
* Description: 下单流程第二步页面js文件
* Creator: 
* Create Date:
* History:
* ------------------------------------
* Update Date   |   Author   |    Note
* 2017-03-15    |   fangyang |   create
* 
* ******************************************************/

$(function () {
	payChannelCheck();
	prefTabClick();
	checkPreferential();
	submitOrderClick();
});

/*
* content（必需）  : 提示文字
* btn1（可选）     : 第一个button, 传值格式"href|text" 
* btn2（可选） 	   : 第二个button, 传值格式"href|text"
*/
function alert(content, btn1, btn2) {
	 popupTips('j_popupTips', {
        popupBefore: function(obj) {
			obj.find('.popup-hd').find('.hd-cont').text('');
			obj.find('.popup-bd').html('');
			obj.find('.popup-ft').html('');
			if(content && !btn1 && !btn2) {
				var hdText = '提示';
				var bdNode = 
					'<p class="tips-cont f999 f14 tc">' + content + '</p>' + 
					'<p class="btn-bar tc"><a href="javascript:$(\'.close-icon\').click();" class="btn-deputy">确定</a></p>';
				obj.find('.popup-hd').find('.hd-cont').text(hdText);
				obj.find('.popup-bd').html(bdNode);
			} else if(content && btn1 && !btn2) {
				var btnObj = btn1.split("|");
				var hdText = '提示';
				var bdNode = 
					'<p class="tips-cont f999 f14 tc">' + content + '</p>' + 
					'<p class="btn-bar tc"><a href="' + btnObj[0] + '" class="btn-deputy">' + btnObj[1] + '</a></p>';
				obj.find('.popup-hd').find('.hd-cont').text(hdText);
				obj.find('.popup-bd').html(bdNode);
			} else if(content && btn1 && btn2) {
				var btnObj1 = btn1.split("|");
				var btnObj2 = btn2.split("|");
				var hdText = '提示';
				var bdNode = '<p class="tips-cont f999 f14 tc">' + content + '</p>';
				var ftNode =
					'<p class="ft-btn-bar f14 tc clearfix">' +
					'<a href="' + btnObj1[0] + '" class="btn-item deputy-item f999">' + btnObj1[1] + '</a>' +
					'<span class="btn-item focus-item f666 j_popupClose" onclick="javascript:window.location.href = \'' + btnObj2[0] + '\'">' + btnObj2[1] + '</span>' +
					'</p>';
				obj.find('.popup-hd').find('.hd-cont').text(hdText);
				obj.find('.popup-bd').html(bdNode);
				obj.find('.popup-ft').html(ftNode);
			}
        }
    });
}

function popAlert(type, sub, temp) {
	 popupTips('j_popupTips', {
        popupBefore: function(obj) {
			obj.find('.popup-hd').find('.hd-cont').text('');
			obj.find('.popup-bd').html('');
			obj.find('.popup-ft').html('');
			if(type == "fukuan") {
				if(!sub) sub = 1;
				var hdText = '付款确定';
				var bdNode = 
					'<p class="tips-cont f999 f14 tc">完成付款后，请根据您的情况点击下面的按钮</p>' +
	                '<ul class="btn-list tc">' +
	                    '<li class="list-item"><a href="javascript:;" onclick="GetPayStatus(\'n\')" class="btn-deputy">付款不成功，重新支付</a></li>' +
	                    '<li class="list-item"><a href="javascript:;" onclick="GetPayStatus(\'y\')" class="btn-deputy">已完成付款</a></li>' +
	                    (sub == 1 ? '<li class="list-item"><a href="javascript:;" onclick="GetPayStatus(\'yh\')" class="btn-deputy">修改优惠方案及支付方式</a></li>' : '') +
	                '</ul>';
				obj.find('.popup-hd').find('.hd-cont').text(hdText);
				obj.find('.popup-bd').html(bdNode);
			} else if(type == "youhui") {
				if(!sub)
					sub = $('#hidPageType').val();
				var hdText = '请修改优惠方案';
				var bdNode = '';
				var ftNode = '';
				if(sub == 1) {
					bdNode = '<p class="tips-cont f999 f14 tc">您选择的优惠方案已不可用，请重新选择优惠方案</p>';
					ftNode = 
						'<p class="ft-btn-bar f14 tc clearfix">' +
						'<a href="/outbound/proc_youhui/' + $('#OrderIdDES').val() + '" class="btn-item deputy-item f999">修改优惠方案及支付方式</a>' +
						'<span class="btn-item focus-item f666 j_popupClose" onclick="javascript:close(1);">关闭</span>' +
						'</p>';
				} else if(sub == 2) {
					bdNode = '<p class="tips-cont f999 f14 tc">您选择的优惠方案现已不可用，请联系客服重新选择优惠方案</p>';
					ftNode = 
						'<p class="ft-btn-bar f14 tc clearfix">' +
						'<a href="javascript:close(1);" class="btn-item deputy-item f999">确认</a>' +
						'<span class="btn-item focus-item f666 j_popupClose" onclick="javascript:close(1);">关闭</span>' +
						'</p>';
				} else if(sub == 3 && temp) {
					bdNode = '<p class="tips-cont f999 f14 tc">您选择的优惠方案仅可在' + temp + '支付，请根据您的情况点击下面的按钮</p>';
					ftNode = 
						'<p class="ft-btn-bar f14 tc clearfix">' +
						'<a href="/proc_youhui/' + $('#OrderIdDES').val() + '" class="btn-item deputy-item f999">修改优惠方案及支付方式</a>' +
						'<span class="btn-item focus-item f666 j_popupClose" onclick="javascript:close();">关闭</span>' +
						'</p>';
				}
				obj.find('.popup-hd').find('.hd-cont').text(hdText);
				obj.find('.popup-bd').html(bdNode);
				obj.find('.popup-ft').html(ftNode);
			}
		}
	});
}

function submitOrderClick() {
	$('.back-section').find('.d-btn').on('click', function() {
		oncontract();
	});
}

function oncontract() {
	var yhtype = $('#hidPageType').val();
    $(".storage").show();  //显示loading
    var orderId = $('#OrderId').val();
    if (true || $("#hidSupplierFlag").val() == "008") {
        //众信订单且未导入众信ERP
        //1.校验优惠库存
        var param = new Object();
        if (yhtype == 1) {
            $.ajax({
                url: "/Tour_Order2017/CheckPreferentialRecord",
                data: { orderid: orderId },
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
                        alert("您的订单已被拆分成多笔子订单，请至用户中心选择子订单支付，如有疑问，请联系我们的客服！", "https://u.uzai.com/manage/order/|返回用户中心");
                    } else if (dataresult.ErrorCode == -3) {
                        popAlert('fukuan');
                        orderPaySubmit();
                    } else if (dataresult.ErrorCode == 100) {
                        //优惠记录没有库存
                        popAlert('youhui');
                        return false;
                    } else if (dataresult.ErrorCode == -4) {
                        popAlert('fukuan', 2);
                        orderPaySubmit();
                    } else {
                        if ($("#OrderId").val().indexOf('S_') >= 0) {
	                        popAlert('fukuan', 2);
                        } else {
	                        popAlert('fukuan');
                        }
                        orderPaySubmit();
                    }
                },
                error: function () {
                    alert("系统错误，请重试或联系客服！");
                    return false;
                }
            });
        } else if (yhtype == 2) {
            //插入优惠记录，并且验证优惠
            $.ajax({
                url: "/Tour_Order2017/InsertPreferentialRecord",
                data: { preferentialJson: $("#hidSelectedActivities").val(), orderid: $("#OrderIdDES").val(), useScore: $("#txtHiddenUseScore").val(), useQuan: $("#txtHiddenUseVoucher").val()},
                cache: false,
                async: false,
                type: 'POST',
                success: function (data) {
                    var dataresult = eval('(' + data + ')');
                    $(".body_shade,.storage").hide();
                    if (dataresult.ErrorCode == -1) {
                        alert(dataresult.ErrorMsg, window.location.href + "|确认");
                        return false;
                    } else if (dataresult.ErrorCode == -2) {
                        //定金还未支付，调至用户中心
                        alert("您的订单已被拆分成多笔子订单，请至用户中心选择子订单支付，如有疑问，请联系我们的客服！", "https://u.uzai.com/manage/order/|返回用户中心");
                    } else if (dataresult.ErrorCode == -3) {
                        popAlert('fukuan', 2);
                        orderPaySubmit();
                    } else if (dataresult.ErrorCode == 100) {
                        //优惠记录没有库存
                        popAlert('youhui');
                        return false;
                    } else {
                        if ($("#OrderId").val().indexOf('S_') >= 0) {
	                        popAlert('fukuan', 2);
                        } else {
	                        popAlert('fukuan');
                        }
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
        if (orderId.indexOf('S_') >= 0) {
            $(".storage").hide();
	        popAlert('fukuan', 2);
        } else {
	        popAlert('fukuan');
        }
        popAlert('fukuan');
        orderPaySubmit();
    }
}

function orderPaySubmit() {
    var isBCM = $('#IsBCM').val();
    if (isBCM) {
        //是交通银行支付
        $('#BCMpay').attr("action", "/BCM_pay/");
        $('#BCMpay').submit();
        return;
    }
    //为用户添加或者修改默认银行值
    //获取paytype的属性值
    var paytype = "";
    var Bankcode = "";
    paytype = $("input[name='pay_bank']:checked").attr("paytype");
    Bankcode = $("input[name='pay_bank']:checked").val();
    var UserID = $('#userid').val();
    if (paytype != null && Bankcode != null && Bankcode != "cash") {//悠哉现金账户不能保存
        checkBank(UserID, paytype + "_" + Bankcode);
    } else if (paytype == null && Bankcode == null) {
    	alert("请选择支付方式");
    	return;
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
            var orderid = $('#OrderIdDES').val();
            $('#formpay').attr("action", "/outbound/quick_pay_again/" + orderid);
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
        $('#formpay').attr("action", "/outbound/Upop_Bind_Pay/" + $.trim($('#OrderIdDES').val()) + "/" + payCardType);
        $('#formpay').submit();
        return;
    }
    else if (paytype == "PT") {//支付平台
        //李平飞 银联快捷支付
        if (Bankcode == "UNIONPAYKJ") {
            var orderid = $('#OrderIdDES').val();
            $('#hdPayType').val('UNIONPAYKJ');
            $('#formpay').attr("action", "/outbound/Upop_Pay/" + orderid);
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
        var che_CMB = Bankcode == "CMB"; //招行
        var che_CCB = Bankcode == "CCB"; //建行
        var che_SPDB = Bankcode == "SPDB"; //浦发
        var che_CIB = Bankcode == "CIB"; //兴业
        var che_PSBC = Bankcode == "PSBC"; //邮政储蓄银行独立接口
        var che_BOC = Bankcode == "BOC"; //中国银行
        var che_ICBC = Bankcode == "ICBC"; //工行
        var che_ABC = Bankcode == "ABC"; //农行
        var che_SDB = Bankcode == "SDB"; //深圳发展银行
        var che_GDB = Bankcode == "GDB"; //广发
        var che_CMBC = Bankcode == "CMBC"; //民生
        var che_BCOM = Bankcode == "BCOM"; //交行
        var che_HZB = Bankcode == "HZB"; //杭州银行
        var che_NBCB = Bankcode == "NBCB"; //宁波银行
        var che_PAB = Bankcode == "PAB"; //平安银行
        var che_SRCB = Bankcode == "SRCB"; //上海农商银行
        //增加中信银行接口
        var che_CITIC = Bankcode == "CITIC"; //中信银行独立接口
        //增加上海银行接口
        var che_SHYH = Bankcode == "SHYH"; //上海银行
        var che_SPDBX = Bankcode == "SPDBX"; //浦发银行
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
    } else if (paytype == "FQ") {//分期支付
        if (!checkError(0)) {
            return false;
        }
        if (Bankcode == "youjiu") {//优玖分期付
            $("#hdPayType").val("youjiu");
        }
    }
    $('#formpay').attr("action", "/outbound/proc_twoPay/");
    $('#formpay').submit();
}

function checkError(show) {
    var paytype = $("input[name='pay_bank'][checked='checked']").attr("paytype");
    var flag = true;
    var price = parseInt($("#hdPayMoney").val());
    var num = $("#hidNum").val();
    if (paytype == "FQ") {
        var orderid = $('#order_id').val();
        if (orderid.indexOf('S_') >= 0) {
            if (show == 1) {
                alert("您的订单已拆单，不能使用分期游付款");
            }
            flag = false;
        }
        if (num > 4) {
            if (show == 1) {
                alert("订单人数不能大于4人，请重新下单");
            }
            flag = false;
        }
        if (flag && price > 30000) {
            if (show == 1) {
                alert("订单金额不能大于3万，请重新下单");
            }
            flag = false;
        }
    }
    return flag;
}

//添加或者修改用户默认的银行信息
var url = "/outbound/QuickPayAjax.action";
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

var ajaxCount = 0;
function GetPayStatus(method) {
	var orderIdDES = $('#OrderIdDES').val();
	var orderId = $('#OrderId').val();
    var payUrl = "/outbound/proc_two/" + orderIdDES;
    var orderUrl = "https://u.uzai.com/manage/order/";
    if(orderId == '') window.location.href = payUrl;
    if(ajaxCount > 0) return;
    ajaxCount++;
    $.ajax({
        url: "/GetPayStatus2017/" + orderId,
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
            if (method == "y") {
                if (msg == "1") {//已支付成功
                    window.location.href = orderUrl;
                }
                else if (msg == "0") { //实际未支付成功
                    alert("该订单未支付成功！", "javascript:close(1);|确定");
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
            if (method == "n") {
                if (msg == "0") { //未支付成功
                    //$('#OrderStatusPop').jqmShow(); //防错层
                    if ($("#OrderId").val().indexOf('S_') >= 0) {
	                    popAlert('fukuan', 2);
                    } else {
	                    popAlert('fukuan');
                    }
                    orderPaySubmit();
                    _uzw.iframe.close(); //关闭本窗体
                }
                else if (msg == "1") { //实际已支付成功,导入订单列表
                    alert("该订单已支付成功！", orderUrl + "|确定");
                }
                else if (msg == "3") {//传过来为主订单号，但实际已被拆分为子订单，则跳转到订单列表
                    window.location.href = orderUrl;
                }
                else {//订单id参数不正确，重新刷新支付页面
                    window.location.href = payUrl;
                }
            }
            //优惠活动
            if (method == "yh") {
                if (msg == "1") {//已支付成功
                    alert("该订单已支付成功，无法修改优惠方案！", orderUrl + "|确定");
                }
                else if (msg == "0") { //实际未支付成功
                    window.location.href = '/outbound/proc_youhui/' + $("#OrderIdDES").val();
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

function close(reload) {
    if(reload == 1) {
        window.location.reload();
    } else {
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
}

function payChannelCheck() {
	if($('#hidPageType').val() != 1) return;

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
        $('.price-total').html('不可支付');
        $("#IsBank").remove();
        $('#formpay').remove();
        $('.back-detail').remove();
        popAlert('youhui', 3, str);
    }
}

function prefTabClick() {
	if($('#hidPageType').val() != 2) return;
	
	var pt = $('#j_paymentTab');
	//支付方式最上层Tab click
	pt.find('ul:first').children('li').on('click', function() {
		var o = $(this);
		PreferentialProject.clearactivitySelect(o.attr('data-pt'));
	});
	//银行优惠下选择支付方式
	pt.find('ul.bankp').children('li').on('click', function() {
		var o = $(this);
		var fd = o.find('input.radio-item').attr('data-fun').split(',');
		PreferentialProject.bankactivitySelect(this, fd[0], fd[1]);
	});
	//选择其他优惠
	pt.find('.dis-group ul.dis-con').children('li').on('click', function() {
		if ($(this).hasClass('check-disable')) {
	        return false;
	    }
		var o = $(this).find('input.dis-checkbox');
		var fd = o.attr('data-fun').split(',');
		PreferentialProject.activitySelect(o, fd[0], fd[1]);
	});
	//选择优惠券
	pt.find('.dis-content ul.discount-sub').children('li.discount-list').on('click', function() {
		if ($(this).hasClass('check-disable')) {
	        return false;
	    }
		Coupons.chooseCoupons(this, $(this).find("input[type='checkbox']").val());
	});
}

function checkPreferential() {
	if($('#hidPageType').val() != 2) return;

	var haveScore = $("#HaveScore").val();
	var haveTicket = $("#HaveTicket ").val();
    // 已选中的优惠活动
    if (haveScore == 1) {
        var usePoint = new Object();
        usePoint.point = $("#HaveScoreValue").val().split('|')[0];
        usePoint.price = -parseFloat($("#HaveScoreValue").val().split('|')[0] / $("#HaveScoreValue").val().split('|')[1]);
        PreferentialProject.usedPoint = usePoint;
    }
    if (haveTicket == 1) {
        // 维护以下优惠券对象只为互斥
        var selectedCoupons = new Object();
        var ticketlist = $("#Ticketlist").val().split(',');
        var ticketPrice = 0;
        var ticketCode = "";
        var ticketSuppelierID = 0;
        for (var i = 0; i < ticketlist.length; i++) {
            ticketCode += ticketlist[i].split('|')[0] + "^";
            ticketPrice += parseFloat(ticketlist[i].split('|')[1]);
            ticketSuppelierID += parseInt(ticketlist[i].split('|')[2]);
        }
        selectedCoupons.code = ticketCode;
        selectedCoupons.price = -parseFloat(ticketPrice);
        selectedCoupons.suppelierID = parseInt(ticketSuppelierID);
        PreferentialProject.selectedCoupons = selectedCoupons;
    }
    if (haveScore == 1) {
        // 积分属于标准优惠，标准优惠和银行互斥(银行和所有大类互斥)
        // 所以，这里需要银行进行互斥
        var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
        lis.each(function () {
        	var o = $(this);
        	if(o.hasClass('check-on')) {
        		o.click();
        	}
        	o.addClass('check-disable');
        	o.find('.dis-price p.p3').hide();
            o.find('.dis-price').addClass('no-line');
        	o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
        });
    }
    if (haveTicket == 1) {
        // 优惠券属于立减优惠，立减优惠和银行互斥(银行和所有大类互斥)，立减优惠类内互斥
        // 所以，这里需要银行进行互斥，并进行类内互斥操作
        // 第1步，和银行的互斥
        var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
        lis.each(function () {
        	var o = $(this);
        	if(o.hasClass('check-on')) {
        		o.click();
        	}
        	o.addClass('check-disable');
        	o.find('.dis-price p.p3').hide();
            o.find('.dis-price').addClass('no-line');
        	o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
        });
        // 第2步，立减类内互斥
        var lis = $("input[name='preferential_" + 2 + "']").parent().parent();
        lis.each(function () {
        	var o = $(this);
        	if(o.hasClass('check-on')) {
        		o.click();
        	}
        	o.addClass('check-disable');
        	o.find('.dis-price p.p3').hide();
            o.find('.dis-price').addClass('no-line');
        	o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
        });
    }
    if ($("#isHaveBankPreferential").val() == 1) {
        var CheckBankPreferentialId = $("#CheckBankPreferentialId").val();
        $('#CheckedBank_' + CheckBankPreferentialId).parent().parent().click();
    } else {
        PreferentialProject.setChecked(); //设置默认选中项被默认选中
    }
    if ($("#isCheck").val() == "False") {
    	$('#j_paymentTab').find('ul:first li:eq(1)').click();
    } else {
        if ($("#isHaveBankPreferential").val() == 1) {
	    	$('#j_paymentTab').find('ul:first li:eq(0)').click();
        }
    }
    renderBooklist();
}