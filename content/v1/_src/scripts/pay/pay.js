$(function () {
    tab('j_orderTab');
    BGinput();
    listTest();    
});


function tab(obj, eve) {
    var el = $('#' + obj);
    !el.get(0) ? el = $('.' + obj) : '';
    if (el.get(0)) {
        var ohd = el.children('.hd');
        !ohd.get(0) ? ohd = el.children().children('.hd') : '';

        ohd.find('li').on('click', function () {
            var o = $(this),
                index = o.index(),
                os = o.siblings('li'),
                obd = o.parents('.hd').siblings('.bd'),
                items = obd.children('.item');
            os.removeClass('on');
            o.addClass('on');
            items.hide().eq(index).show();

            eve && eve();
        });
    }
}

//弹出框
function popMod(obj, xAxis) {

    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    var pop = o.parent();

    pop.children('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-close').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).bind("scroll", function () {
        fixIe6(obj, xAxis);
    });
}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    if (_util.check.isIE6) {
        o.css("top", $(document).scrollTop() + xAxis);
    }
}


// 宝钢支付
function BGinput(){
    var tagBg = $('#tagContentBG');
    var inputBox = tagBg.find('.input-box');
    inputBox.focus(function(){
        $(this).addClass('input-on');
    });    
    inputBox.blur(function(){
        $(this).removeClass('input-on');
    });   
}


function listTest(){
    var tagBg = $('#tagContentBG');
    var phone = tagBg.find('.phone');
    var jf = tagBg.find('.jf');
    var code = tagBg.find('.code');
    var codeBtn = tagBg.find('.code-btn');
    var ptips = tagBg.find('.phone-tips');
    var price;
    if (!$('.travel-order').get(0)) {
        price = $('.main_card_t').find('.num').children('span');
    }else{
        price = $('.travel-order').find('.item-cont').children('.b');
    }
    var priceValue = price.text().replace(/[^0-9]/ig,"");
    var jfvalue = priceValue/100;

    function BGcheck(){
        var status = _uzw.regexForm.mobile(phone.val());
        if (phone.val()) {
            if (status) {
                ptips.addClass('hide');

            }else{
                ptips.removeClass('hide');
                return false;
            }
        }else{
            ptips.removeClass('hide');
            return false;
        }

        if (!jf.val()) {
            $('.jf-tips').removeClass('hide');
            $('.jf-tips').text('请填写积分');
            return false;
        }

        if (code.val()) {
            $('.btn-out').addClass('btn-bg');
        }else{
            $('.btn-out').removeClass('btn-bg');
        }

        return true;
    }

    codeBtn.children('.p1').on('click',function(){
        BGcheck();

        if (jf.val()) {
            if (jf.val()<=jfvalue&&jf.val()>0) {

                var orderId = $("#hdOrder").val();
                var amount = $("#jf").val();
                var outtradeno = $("#hdOuttradeno").val();
                var phone = $("#phone").val();

                jf.removeClass('input-out');
                $('.jf-tips').addClass('hide');

                $.ajax({
                    type: "GET",
                    async: false,
                    url: '/BaosteelCode',
                    data:{'outtradeno':outtradeno,'orderId':orderId,'amount':amount,'phone':phone},
                    dataType: 'json',
                    success: function (data) {
                        if (data !== null && data.Flag) {

                            alert("积分申请已经发出，请注意手机短信的获取");
                            codeBtn.addClass('btn-time');
                            var codeP1 = codeBtn.children('.p1');
                            var codeP2 = codeBtn.children('.p2');
                            var codeBtnText = codeP2.text();
                            codeP1.addClass('hide');
                            codeP2.removeClass('hide');

                            var i = 60;
                            var time1 = setInterval(function(){               
                            if(i === 0) {
                                    clearInterval(time1);
                                    codeP1.removeClass('hide');
                                    codeP2.addClass('hide');
                                    codeBtn.removeClass('btn-time');
                                }
                            codeP2.children('i').text(i--);
                            },1000);

                            $('.dl3').removeClass('hide');
                        } else {
                            alert(data.Msg);
                            return false;
                        }
                    },
                    error: function () { 
                        alert("短信验证码发送失败");
                    }
                });

            }else if(jf.val()>jfvalue||jf.val()<=0 ){
                $('.jf-tips').removeClass('hide');
                $('.jf-tips').text('请输入正确积分数量，积分数量保留两位小数');
                return false;
            }
        }
    });

    code.keyup(function(){
        if (code.val()) {
            if (!isNaN(code.val())) {
                $('.btn-out').addClass('btn-bg');
            }else{

                $('.btn-out').removeClass('btn-bg');
            }
            
        }else{
            $('.btn-out').removeClass('btn-bg');
        }
    });

    var formpay = $('#formpay');
    if (formpay.get(0)!== null) {
        formpay.on('submit',function(){
            if ($('.btn-out').hasClass('btn-bg')) {
                BGcheck();
            }else{
                return false;
            }
            
        });
    }
}