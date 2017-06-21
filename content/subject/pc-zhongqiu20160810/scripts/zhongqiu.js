/*
* @Author: lxq
* @Date:   2016-08-10 10:01:26
* @Last Modified by:   lxq
* @Last Modified time: 2016-08-22 17:01:08
*/

$(function(){
    var subject = $('#db');
    var navigation = $('#j_nav');
    var nav = navigation.find('.nav-box').find('.nav-con');
    var conBox = subject.find('.cont-box');
    var ncp = navigation.find('.nc').find('.p1');
    var navTop = $('.navigation').offset().top;
    
    uzLazy(['wrapper']);
    _uzw.ui.tab('j_tab', function(idx, obj) {
        var imgs = obj.find('.bd').find('.item').eq(idx).find('img');
        imgs.each(function(){
            var img = $(this);
            img.attr('src', img.attr('data-original'));
        });
        
        var slist = obj.find('.s-list').eq(idx);
        var rb = slist.find('.rb');
        var rbs = slist.siblings().find('.rb');
        rb.addClass('img-on');
        rbs.removeClass('img-on');

        var xlist = obj.find('.x-list').eq(idx);
        var eye = xlist.find('.eyes');
        var eyes = xlist.siblings().find('.eyes');
        var eyeon = xlist.find('.eyes-on');
        var eyeson = xlist.siblings().find('.eyes-on');

        eye.addClass('eyes-1');
        eyes.removeClass('eyes-1');
        eyeon.addClass('eyes-2');
        eyeson.removeClass('eyes-2');
    });



    nav.on('click',function(){
        var t = $(this);
        var ts = t.siblings('.nav-con');
        t.addClass('on');
        ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').animate({scrollTop:stop},800);
    });

    $('.nav-back').on('click',function(){
        $('body,html').animate({scrollTop:0},800);
    });

    $(window).scroll(function () {
        var w = $(window).scrollTop();
        if (_util.check.isIE6) {
            return;
        };
        if (w >= 600) {
                $(".navigation").addClass('nav-on');
            } else {
                $(".navigation").removeClass('nav-on');
            }

        $('.cont-box').each(function(a,b) {
            var ctop = $(this).offset().top;
            if (w>ctop-30) {
                $('.navigation').find('.nav-con').removeClass('on');
                $('.navigation').find('.nav-con').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");

    ncp.on('click',function(){
        var t = $(this);
        t.parents('.nc').toggleClass('con-off');
    });

    $('.nav-con2').find('li').on('click',function(){
        var o = $(this);
        var os = o.siblings();
        var oindex = o.index();
        os.removeClass('list-on');
        o.addClass('list-on');
        var sq = $('.shangque-2').find('.item').eq(oindex);
        var so = sq.siblings();
        var ribbit = $('.shangque-1').find('li').eq(oindex);
        var rs = ribbit.siblings();
        sq.show();
        so.hide();
        ribbit.find('.rb').addClass('img-on');
        rs.find('.rb').removeClass('img-on');
    });

    $('.nav-con3').find('li').on('click',function(){
        var o = $(this);
        var os = o.siblings();
        var oindex = o.index();
        os.removeClass('list-on');
        o.addClass('list-on');
        var sq = $('.xiaque-2').find('.item').eq(oindex);
        var so = sq.siblings();
        sq.show();
        so.hide();
        var xq = $('.xiaque-1').find('.x-list').eq(oindex);
        var xqs = xq.siblings();
        xq.find('.eyes').addClass('eyes-1');
        xqs.find('.eyes').removeClass('eyes-1');
        xq.find('.eyes-on').addClass('eyes-2');
        xqs.find('.eyes-on').removeClass('eyes-2');
    });



    var $body = $('body');
    var WIDTH = $body.width();
    var HEIGHT = $body.height();
    var $ad = $('.ad');
    var $layer1 = $('.cloud');
    function moveAd(e) {
       var xPer = e.clientX / WIDTH;
       var yPer = e.clientY / HEIGHT;

       var rotateX = 30 - (yPer * 10);
       var rotateY = 0;

       $ad.css({
         transform: 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) '
       });

       var translateX = -20 + (xPer * 50);
       var translateY = 0;

       $layer1.css({
        transform: 'scale(1) translateX(' + translateX + 'px) translateY(' + translateY + 'px)'
       });


       var lightX = 800 - (xPer * 1600);
       var lightY = 300 - (yPer * 600);
    }
    $body.on('mousemove', moveAd);


});

