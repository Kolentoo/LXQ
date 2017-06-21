
// dan弹窗
$(function() {
    var dan1 = $("#j_dan1");
    var dan2 = $("#j_dan2");
    // var dan3=$("#j_dan3")
    var dan1main = $("#j_dan1main");
    var delldan1 = $("#j_delldan1");
    var dan2main = $("#j_dan2main");
    // var dan3main=$("#j_dan3main");
    var delldan2 = $("#j_delldan2");
    var naxt=$("#j_next");
    var information=$("#j_information");
    var dellinformation=$("#j_dellinformation");
    var yesorno=$("#j_yesorno");
    var over=$("#j_over");
    var returns=$("#j_return");


    $('.con-1').find('.dan').find('.dan-1').on("click",function() {
       if(GetEggResult){GetEggResult();}
    });
    delldan1.on("click",function() {
        dan1main.addClass('hide');
        _uzw.ui.mask.hide();
    })

    delldan2.on("click",function() {
        dan2main.addClass('hide');
        _uzw.ui.mask.hide();
    })

    naxt.on("click",function() {
        information.removeClass('hide');
        dan2main.addClass('hide');
        _uzw.ui.mask.show();

    });
    dellinformation.on("click",function() {
        information.addClass('hide');
        yesorno.removeClass('hide');

    })
   over.on("click",function() {
          yesorno.addClass('hide');
         _uzw.ui.mask.hide();

    });

    returns.on("click",function() {
          information.removeClass('hide');
           yesorno.addClass('hide');
        _uzw.ui.mask.show();

    });









})





// rule弹窗
$(function() {
    var mathmain = $("#j_math-main");
    var rulemain = $("#j_rule-main");
    var usemain = $("#j_use-main");
    var rule = $("#j_rule");
    var dell = $("#j_dell");
    var dellr = $("#j_dellr");
    var dellu = $("#j_dellu");
    var math = $("#j_math");
    var use = $("#j_use");
    var desmain = $("#j_des-main");
    var delldes = $("#j_delldes");
    var des = $("#j_des");

    math.on("click",function() {
        mathmain.removeClass('hide');
        _uzw.ui.mask.show();

    });

    dell.on("click",function() {
        mathmain.addClass('hide');
        _uzw.ui.mask.hide();
    });

    rule.on("click",function() {
        rulemain.removeClass('hide');
        _uzw.ui.mask.show();

    });
    dellr.on("click",function() {
        rulemain.addClass('hide');
        _uzw.ui.mask.hide();
    });

    use.on("click",function() {
        usemain.removeClass('hide');
        _uzw.ui.mask.show();

    });

     dellu.on("click",function() {
        usemain.addClass('hide');
        _uzw.ui.mask.hide();
    });

    des.on("click",function() {
        desmain.removeClass('hide');
        _uzw.ui.mask.show();

    });
    delldes.on("click",function() {
        desmain.addClass('hide');
        _uzw.ui.mask.hide();
    });

})


//切换
$(function() {

    _uzw.ui.tab('j_tab');
    _uzw.ui.tab('j_tab1');
    _uzw.ui.tab('j_tab2');
})

//导航
$(function() {
    var subject = $('#j_subject');
    var navigation = $('#j_nav'); //导航
    var nav = subject.find('.nav-list'); //所有按钮
    var conBox = subject.find('.cont-box'); //模块
    var navTop = navigation.offset().top; //导航相对于浏览器视口到高度
    var sw = screen.width; // 显示屏幕宽度
    nav.on('click',
    function() {
        var t = $(this);
        var ts = t.siblings('li');
        t.addClass('on');
        ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').animate({
            scrollTop: stop
        },
        800);
    });
    $('.back').on('click',
    function() {
        $('body,html').animate({
            scrollTop: 0
        },
        800);
    });
    $(window).scroll(function() {
        var w = $(window).scrollTop(); //滚动条的垂直偏移
        if (_util.check.isIE6) {
            return;
        };
        if (w >= 300) {
            navigation.addClass('nav-on');
        } else {
            navigation.removeClass('nav-on');
        }
        $('.cont-box').each(function(a, b) {
            var ctop = $(this).offset().top;
            if (w > ctop - 20) {
                navigation.find('li').removeClass('on');
                navigation.find('li').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");
});

// 延时加载
$(function(){

    uzLazy(['subject-main']);
    // countdown();
    //GetLuckyUser();
})

function countdown() {
    var timers = $('.con-2').find('.con-2-model-main').find('.countdown');
    var df = _util.apis.getServerDate(); // 获取服务器日期
    var nowTime = 0;
    var _unitCountdown = function (obj, time) {
        var startTime = parseInt(Date.parse(obj.attr('data-starttime').replace(/-/g, '/')), 10);
        var op = obj.parents('.model-over');
        var oTian = obj.find('.days');
        var oShi = obj.find('.hours');
        var oFen = obj.find('.minutes');
        var oMiao = obj.find('.seconds');
        var pid = obj.attr('data-pid');
        var iValue = startTime - time;
        var timeout;
        var _unitCD = function (cha) { // 单元处理
            var seconds = cha / 1000;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);

            oTian.text(days);
            oShi.text(hours % 24);
            oFen.text(minutes % 60);
            oMiao.text(Math.floor(seconds % 60));
        };

        time += 1000;

        if (iValue > 0) {
            _unitCD(iValue);
        } else {
            op.addClass('hide');
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
                            op.removeClass('model-beg').removeClass('hide').empty();
                            clearTimeout(timeout);
                        }
                    }
                },
                error: function() {
                }
            });

        }

        timeout = setTimeout(function () {
            _unitCountdown(obj, time);
        }, 1000);
    };

    timers.each(function() {
        var oThis = $(this);

        df.done(function (tm) {
            tm = tm.replace(/-/g, '/');
            nowTime = parseInt(Date.parse(tm), 10);
            _unitCountdown(oThis, nowTime);
        });
    });
}

//弹出提示
function popupTips(content){
    var dan1main = $("#j_dan1main");
    $("#j_dan1main p").html(content);
    dan1main.removeClass('hide');_uzw.ui.mask.show();
}
//中奖信息提示奖品
function popupgiftinfo(tip1,tip2,tip3,resultval){
    var dan2main = $("#j_dan2main");
    $("#j_dan2main .dan2-main .zj-main .p1").html(tip1);
    $("#j_dan2main .dan2-main .zj-main .p2").first().html(tip2);
    $("#j_dan2main .dan2-main .zj-main .p2 span").html(tip3);
    if(resultval===4){
        $("#j_dan2main .dan2-main .zj-main .p2 span").parent().html($("#j_dan2main .dan2-main .zj-main .p2 span").parent().html().replace("×1份","！"));
        $("#j_dan2main .dan2-main .zj-main .p3").addClass("hide");
        $("#j_dan2main .dan2-main .zj-main .next").addClass("hide");
    }
    else{
        $("#j_dan2main .dan2-main .zj-main .p2 span").parent().html($("#j_dan2main .dan2-main .zj-main .p2 span").parent().html().replace("！","×1份"));
        $("#j_dan2main .dan2-main .zj-main .p3").removeClass("hide");
        $("#j_dan2main .dan2-main .zj-main .next").removeClass("hide");
    }
    dan2main.removeClass('hide');_uzw.ui.mask.show();
}
//填写资料时奖品
function popupuserinfo(tip1,tip2){
    $("#j_information .information-main .p1").first().html(tip1);
    $("#j_information .information-main .p1 span").html(tip2);
}
//砸蛋抽奖
function GetEggResult() {
    _uzw.user.refresh();
    var uid = _uzw.user.userid;
    var city = 2;
    var activityid = 12;
    //uid city activityid
    if (_uzw.user && _uzw.user.userid > 0) {
        $.ajax({ url: "http://wapi.uzai.com/api/uzaiactivity/HitEgg?" + Math.random(),
            data: {"UserId":uid,"ActivityId":activityid,"CityId":city},
            dataType: "jsonp",
            success: function (msg) {
                if(msg){
                    if(msg.Success){
                        //显示砸蛋结果并处理
                        if (msg.PrizeType == 4) {
                            //优惠券礼包
                            popupgiftinfo("恭喜您中奖啦","悠哉【900元优惠券大礼包】","请在<a href='//u.uzai.com/manage/ShareWinning'>【我的】--【我的优惠券】</a>中查看",4);
                         }
                        else if (msg.PrizeType == 3) {
                            //生鲜礼券
                            popupgiftinfo("恭喜您中奖啦","获得由春播网提供的","深海北极虾兑换礼券",3);
                            $("#resultid").val(msg.ResultId);
                            $("#prizecode").val(msg.PrizeCode);
                            popupuserinfo("获得由春播网提供的","深海北极虾兑换礼券");
                         }
                        else if (msg.PrizeType == 2) {
                            //圆珠手链
                            popupgiftinfo("恭喜您中奖啦","艺术网提供的","砗磲圆珠手链",2);
                            $("#resultid").val(msg.ResultId);
                            $("#prizecode").val(msg.PrizeCode);
                            popupuserinfo("获得由艺术网提供的","砗磲圆珠手链");
                         }
                        else if (msg.PrizeType == 1) {
                            //华光电器
                            popupgiftinfo("恭喜您中奖啦","华光电器提供的","￥1299的高档家电",1);
                            $("#resultid").val(msg.ResultId);
                            popupuserinfo("获得由华光电器提供的","￥1299的高档家电");
                         }
                        else if (msg.PrizeType == 0) {
                            //未中奖
                            popupTips("咦，好像什么也没有，用洪荒之力再砸一次！");
                         }
                        else if (msg.PrizeType == -1) {
                            //活动未开始
                            popupTips("活动即将开始，别太着急哦！");
                         }
                        else if (msg.PrizeType == -2) {
                            //活动结束
                            popupTips("来晚了，活动已结束！");
                         }
                        else if (msg.PrizeType == -3) {
                            //砸蛋次数用完
                            popupTips("今天的3次砸金蛋机会已经用完，明天再战吧！");
                         }
                        else if (msg.PrizeType == -4) {
                            //未登录
                            var actName = "";
                            document.domain = "uzai.com";
                            _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
                         }
                        else if (msg.PrizeType == -5) {
                            //数据有误
                            //popupTips("数据有误");
                        }
                    }
                    else{
                    }
                }

            },
            error: function () {
                //错误提示
                //popupTips("数据有误");
            }
        });
    } else {
        var actName = "";
        document.domain = "uzai.com";
        _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
    }
}
//填写用户信息
function BindUserInfo() {
    _uzw.user.refresh();
    var uid = _uzw.user.userid;
    var username = $("#username").val();
    var phone = $("#phone").val();
    if(!_uzw.regexForm.mobile(phone)){
        alert("手机号码填写错误，请填写正确的号码!");
        return;
    }
    if(!username){
        alert("领奖姓名填写错误，请填写正确的姓名!");
        return;
    }
    var prizecode = $("#prizecode").val();
    var resultid = $("#resultid").val();
    if (_uzw.user && _uzw.user.userid > 0) {
        $.ajax({
            url: "http://wapi.uzai.com/api/uzaiactivity/BindUserInfo?" + Math.random(),
            data: {"UserId":uid,"UserName":username,"Phone":phone,"ResultId":resultid},
            dataType: "jsonp",
            success: function (msg) {
                var dan1main = $("#j_dan1main");
                var infomain = $("#j_information");
                if(msg.Success)
                {
                    infomain.addClass('hide');
                    _uzw.ui.mask.hide();
                }
                else{
                }
            },
            error: function () {
            }
        });
    }else{
        var actName = "";
        document.domain = "uzai.com";
        _uzw.iframe.pop("//u.uzai.com/QuickLoginV1?actionName=" + actName, 640, 315); //跳转到快速登录
    }
}
//最后50获奖用户
function GetLuckyUser() {
    var innnerHtml = "";
    _uzw.user.refresh();
    var uid = _uzw.user.userid;
    var activityid = 12;
    var cityid = 2;
    $.ajax({
        url: "http://wapi.uzai.com/api/uzaiactivity/GetInitInfo?" + Math.random(),
        data: {"UserId":uid,"ActivityId":activityid,"CityId":cityid},
        dataType: "jsonp",
        crossDomain:true,
        success: function (msg) {
            var dan1main = $("#j_dan1main");
            if(msg.Success)
            {
                for(var i=0; i < msg.Records.length; i++){
                 innnerHtml += "<li>"+msg.Records[i]+"</li>";
                }
                $(".bobao .bobao-main ul").html(innnerHtml);
            }
            else{
            }
        },
        error: function () {
            innnerHtml = "<li>暂无获奖用户！</li>";
        }
    });
 }