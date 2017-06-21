/*
* @Author: lichen
* @Date:   2016-11-02 09:28:44
* @Last Modified by:   jonas hsiao
* @Last Modified time: 2016-11-18 17:19:35
*/

'use strict';
$(function(){

	uzLazy(['subject-main']);

    _uzw.ui.tab('j_tab', function(idx, obj) {
        var imgs = obj.find('.bd').find('.item').eq(idx).find('img');
        imgs.each(function(){
            var img = $(this);
            img.attr('src', img.attr('data-original'));
        });
    });

    _uzw.ui.tab('j_tabs', function(idx, obj) {
        var imgs = obj.find('.bd').find('.item').eq(idx).find('img');
        imgs.each(function(){
            var img = $(this);
            img.attr('src', img.attr('data-original'));
        });
    });

	var subject = $('#j_subject');
    var navigation = $('#j_nav');
    var pop = $('#j_pop');
    var nav = navigation.find('.nav-list');
    var conBox = subject.find('.cont-box');
    var navTop = navigation.offset().top;
    var sw = screen.width;
    var name = pop.find('.name');
    var pnumber = pop.find('.pnumber');
    var partten = /^[\u4e00-\u9fa5A-Za-z]*$/;

    // document.domain = "uzai.com";


   // 导航
    nav.on('click',function(){
        var t = $(this);
        var ts = t.siblings('li');
        t.addClass('on');
        ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').animate({scrollTop:stop},800);
    });

    $('.back').on('click',function(){
    	$('body,html').animate({scrollTop:0},800);
    });

    $('.route-btn').on('click',function(){
    	nav.eq(2).click();
    });

    $(window).scroll(function () {
        var w = $(window).scrollTop();
        if (_util.check.isIE6) {
                return;
            };
            if (w >= 600) {
                    navigation.addClass('nav-on');
                } else {
                    navigation.removeClass('nav-on');
                }

        conBox.each(function(a,b) {
            var ctop = $(this).offset().top;
            if (w>ctop-30) {
                navigation.find('.nav-list').removeClass('on');
                navigation.find('.nav-list').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");

    // 倒计时
    // secCountdown();
	function secCountdown() {
	    var wrap = $('#j_seckill');
	    var timers = wrap.find('.timer');
	    if (timers.get(0)) {
	        var df = _util.apis.getServerDate();
	        var nowTime = 0;
	        df.done(function (tm) {
	            var unitCountdown = function (o, si, time) {
	                var op = o.parents('.progress');
	                var os = o.parents('.seckill-box');
	                var opp = op.find('.p-list');
	                var oTian = o.find('.tian');
	                var oShi = o.find('.shi');
	                var oFen = o.find('.fen');
	                var oMiao = o.find('.miao');

	                var _unitCD = function (cha) {
	                    var seconds = cha / 1000;
	                    var minutes = Math.floor(seconds / 60);
	                    var hours = Math.floor(minutes / 60);
	                    var days = Math.floor(hours / 24);

	                    oTian.text(days);
	                    oShi.text(hours % 24);
	                    oFen.text(minutes % 60);
	                    oMiao.text(Math.floor(seconds % 60));
	                };

	                // var prevTime = parseInt(Date.parse(_util.string.replaceAll(opp.attr('data-prevtime'), '-', '/')), 10);
	                // var endTime = parseInt(Date.parse(_util.string.replaceAll(opp.attr('data-endtime'), '-', '/')), 10);
	                // var startTime = parseInt(Date.parse(_util.string.replaceAll(opp.attr('data-starttime'), '-', '/')), 10);

	                // var valueA = prevTime - nowTime;
	                // var valueE = endTime - nowTime;
	                // var valueS = startTime - nowTime;


	                var plist = subject.find('.p-list');
	                plist.each(function(a,b){
	                	var pt = $(b).attr('data-prevtime');
	                	var et = $(b).attr('data-endtime');
	                	var ptn = parseInt(Date.parse(_util.string.replaceAll(pt, '-', '/')), 10);
	                	var etn = parseInt(Date.parse(_util.string.replaceAll(et, '-', '/')), 10);

	                	if ( ptn <= nowTime && nowTime <= etn ) {

                            $('.pro-box').removeClass('hide');
	                		var t = $(this);
                            var ts = t.siblings();
                            var tindex = t.index();
                            var pcon = $('.pro-con').eq(tindex);
                            var pcons = pcon.siblings();
                            ts.removeClass('p-ing');
	                		t.addClass('p-ing');
                            pcons.addClass('hide');
                            pcon.removeClass('hide');

			                var prevTime = parseInt(Date.parse(_util.string.replaceAll(t.attr('data-prevtime'), '-', '/')), 10);
			                var endTime = parseInt(Date.parse(_util.string.replaceAll(t.attr('data-endtime'), '-', '/')), 10);
			                var startTime = parseInt(Date.parse(_util.string.replaceAll(t.attr('data-starttime'), '-', '/')), 10);

			                var valueA = prevTime - nowTime;
			                var valueE = endTime - nowTime;
			                var valueS = startTime - nowTime;


		            		if (valueS >= 0) {
			                	_unitCD(valueS);
			                    os.find('.pro-list').removeClass('over ing').addClass('prev');
		                		$('.clock-hd').removeClass('hide');
		                		$('.timer').removeClass('hide');
		                		$('.txt').hide();
			                }else if(valueS <= 0 && valueE > 0){
		                		_unitCD(valueE);

		                		$('.pro-list').each(function(x,y){

                                    $(y).removeClass('prev over').addClass('ing');
                                    $('.clock-hd').addClass('hide');
                                    $('.timer').addClass('hide');
                                    $('.txt').show();

		                			var pid = $(y).attr('data-pid');
						            $.ajax({
						                type: 'GET',
						                url: _uzw.domain.wapi + '/api/UzaiSpike/GetEntitySpikeById',
						                data: { 'id': pid },
						                dataType: 'jsonp',
						                cache: false,
						                success: function(data) {
						                    if (data) {
						                        var rtc = data.RemainTicketCount;
						                        if (!rtc) {
							                		$(y).removeClass('prev ing').addClass('over');
						                        }
						                    }
						                },
						                error: function() {
						                }
						            });
		                		});

		                	}else if (valueE <= 0) {
		                		os.find('.pro-list').removeClass('prev ing').addClass('over');
		                		$('.clock-hd').removeClass('hide');
		                		$('.timer').removeClass('hide');
		                		$('.txt').hide();
		                	}

	                	}

                        // else{
                        //     var endTime = parseInt(Date.parse(_util.string.replaceAll($('.p-list4').attr('data-endtime'), '-', '/')), 10);
                        //     var valueE = endTime - nowTime;

                        //     if (valueE < 0) {
                        //         _unitCD(valueE);
                        //         os.find('.pro-list').removeClass('prev ing').addClass('over');
                        //         $('.clock-hd').removeClass('hide');
                        //         $('.timer').removeClass('hide');
                        //         $('.txt').hide();
                        //     }
                        // }

	                });

                    var ltime = $('.p-list4').attr('data-endtime');
                    var prevTime = parseInt(Date.parse(_util.string.replaceAll($('.p-list1').attr('data-prevtime'), '-', '/')), 10);
                    var lastTime = parseInt(Date.parse(_util.string.replaceAll($('.p-list4').attr('data-endtime'), '-', '/')), 10);
                    var valueA = prevTime - nowTime;
                    var valueL = lastTime - nowTime;

                    if (prevTime >= nowTime) {
                        _unitCD(valueA);
                        $('.pro-box').addClass('hide');
                    }

                    if (valueL <= 0) {
                        $('.nav-list').eq(1).addClass('hide');
                        $('.con-2').addClass('hide');
                    }






	            };

	            tm = tm.replace(/-/g, '/');
	            nowTime = parseInt(Date.parse(tm), 10);

	            timers.each(function (k, v) {
	                var o = $(this);
	                var si = setInterval(function () {
	                    unitCountdown(o, si);
	                }, 1000);
	            });

	            setInterval(function () {
	                nowTime += 1000;
	            }, 1000);
	        });
	    }
	}


	// 弹窗
	$('.close').on('click',function(){
		$('.pop').hide();
		_uzw.ui.mask.hide();
	});

	$('.rp-btn1').on('click',function(){
		$('.pop3').show();
		_uzw.ui.mask.show();
	});

	$('.pre-detail').on('click',function(){
		$('.pop6').show();
		_uzw.ui.mask.show();
	});

	$('.jh-rule').on('click',function(){
		$('.pop8').show();
		_uzw.ui.mask.show();
	});

	$('.jh-receive').on('click',function(){
		$('.pop9').show();
		_uzw.ui.mask.show();
	});

	$('.change-type').on('click',function(){
		$('.pop4').show();
		_uzw.ui.mask.show();
	});

	$('.pop-btn1').on('click',function(){
		$('.pop9').hide();
		$('.pop10').show();
		_uzw.ui.mask.show();
	});

	$('.ms-btn').on('click',function(){
		$('.pop5').show();
		_uzw.ui.mask.show();
	})

	// $('.rp-btn2').on('click',function(){
 //        if (!_uzw.user.userid) {
 //            $('.pop1').show();
 //            _uzw.ui.mask.show();
 //        }else{
 //        	getHongbao();
 //        }
	// });

	//填写用户信息
    function BindChunJieBankCard() {
        _uzw.user.refresh();
        var uid = _uzw.user.userid;
        var username = _uzw.user.userName;
        var realname = $("#jiaohangname").val();
        var phone = $("#jiaohangmobile").val();
        var cityID = $("#cityID").val();
        if (!_uzw.regexForm.mobile(phone)) {
            alert("手机号码填写错误，请填写正确的号码!");
            return;
        }
        if (_uzw.user && _uzw.user.userid > 0) {
            $.ajax({
                url: "http://wapi.uzai.com/api/uzaiactivity/BindChunJieBankCard?" + Math.random(),
                data: { "UserID": uid, "UserName": username, "Mobile": phone, "RealName": realname, "City": cityID, "ActivityId": 13 },
                dataType: "jsonp",
                success: function (msg) {
                    if (msg.Message == 1) {
                        $('.pop10 ').hide();
                        _uzw.ui.mask.hide();
                        $('.pop11').show();
                        _uzw.ui.mask.show();
                    }
                    else {
                        alert("领取失败，请稍后再试！");
                        $('.pop10 ').hide();
                        _uzw.ui.mask.hide();
                    }
                },
                error: function () {
                    alert("领取失败，请稍后再试！");
                    $('.pop10 ').hide();
                    _uzw.ui.mask.hide();
                }
            });
        }
        else {
            var actName = "";
            document.domain = "uzai.com";
            _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
        }
    }
    //领取红包
    function getHongbao() {
        document.domain = "uzai.com";
        _uzw.user.refresh();
        if (_uzw.user && _uzw.user.userid > 0) {
            var ReceiveTimes = $("#ReceiveTimes").val();
            var StartReceiveTime = $("#StartReceiveTime").val();
            var EndReceiveTime = $("#EndReceiveTime").val();
            var uid = _uzw.user.userid;
            $.ajax({
                url: "http://wapi.uzai.com/api/uzaiactivity/GetAllChunJieShareWinning?" + Math.random(),
                data: { "UserId": uid, "ReceiveTimes": ReceiveTimes, "StartReceiveTime": StartReceiveTime, "EndReceiveTime": EndReceiveTime, "SupplierId": 41, "PriceListStr": '150,350,800' },
                dataType: "jsonp",
                success: function (msg) {
                    //0获取失败，1获取成功，-1未登录，-2已领取
                    switch (msg.Message) {
                        case "1":
                            _uzw.ui.mask.show(function () {
                                setTimeout(function () {
                                    $('.pop2').show();
                                    _uzw.ui.mask.show();
                                }, 100);
                            });
                            break;
                        case "-1":
                            $('.pop1').show();
                            _uzw.ui.mask.show(); //跳转到快速登录
                            break;
                        case "-2":
                            alert("您已领取过该红包！");
                            break;
                        case "-3":
                            alert("当前日期不在活动时间范围内！");
                            break;
                        case "-4":
                            alert("已超出本活动最大领取次数！");
                            break;
                        default:
                            alert("领取失败，请稍后再试！");
                            break;
                    }

                },
                error: function () {
                    alert("领取失败，请稍后再试！");
                }
            });
        }
        else {
            document.domain = "uzai.com";
            $('.pop1').show();
            _uzw.ui.mask.show(); //跳转到快速登录
        }
    }

	// 表单验证
	$('.pop10-btn').on('click',function(){
        if (!name.val()) {
            alert('请输入姓名');
            return false;
        } else {
            if (!partten.test(name.val())) {
                alert('姓名格式不正确');
                return false;
            }
        }

	    var status = _uzw.regexForm.mobile(pnumber.val());
        if (!pnumber.val()) {
            alert('请输入手机号');
            return false;
        }else{
        	if(status == false){
        		alert('手机号格式不正确');
        		return false;
        	}
        }

        BindChunJieBankCard();
	});

	$('.pop1-btn').on('click',function(){
		var nickname = pop.find('.nickname');
		var psd = pop.find('.psd');
        if (!nickname.val()) {
            alert('请输入用户名');
            return false;
        }
    	if (!psd.val()) {
            alert('请输入密码');
            return false;
        }
	});

	//判断秒杀是否支付成功
    function isUserPay(productid){
        _uzw.user.refresh();
        var uid = _uzw.user.userid;
        var proid = productid;
        if (_uzw.user && _uzw.user.userid > 0) {
            $.ajax({
                url: "http://wapi.uzai.com/api/uzaiactivity/IsUserPay?" + Math.random(),
                data: { "UserID": uid, "ProductID": proid },
                dataType: "jsonp",
                success: function (msg) {
                    if (msg.Message=="ok") {
                        $('.pop7').show();
                        _uzw.ui.mask.show();
                        return false;
                    }
                    else{
                        return true;
                    }
                },
                error: function () {
                }
            });
        }
        else {
            var actName = "";
            document.domain = "uzai.com";
            _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
        }
    }

    // $('.pro-list ').on('click',function(){
    //     var productid = $(this).attr('data-rid');
    //     isUserPay(productid);
    // });



});