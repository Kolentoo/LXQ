/*
* @Author: lxq
* @Date:   2016-12-06 15:03:09
* @Last Modified by:   lxq
* @Last Modified time: 2016-12-14 09:51:24
*/

'use strict';

$(function(){

    var subject = $('#j_subject');
    var navigation = $('#j_nav');
    var nav = navigation.find('.nav-list');
    var conBox = subject.find('.cont-box').find('.topic');
    var navTop = $('.navigation').offset().top;
    var sw = screen.width;

	uzLazy(['subject-main']);
	_uzw.ui.tab('sub-tab', function(idx, obj) {
	    var imgs = obj.find('.bd').find('.item').eq(idx).find('img');
	    imgs.each(function(){
	        var img = $(this);
	        img.attr('src', img.attr('data-original'));
	    });
	});

           
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

    $('.top').on('click',function(){
		$('body,html').animate({scrollTop:0},800);
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

        $('.cont-box').each(function(a,b) {
            var ctop = $(this).offset().top;
            if (w>ctop-30) {
                navigation.find('.nav-list').removeClass('on');
                navigation.find('.nav-list').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");

    $(document).snowfall('clear');
    $(document).snowfall({
        image: "//r01.uzaicdn.com/content/subject/pc-cuofeng161206/img/huaban.png",
        flakeCount:30,
        minSize: 15,
        maxSize: 40
    });


    $('.intro-list1').on('click',function(){
    	$('.pop1').removeClass('hide');
    	_uzw.ui.mask.show();
    });
    $('.intro-list1').find('.btn1').on('click',function(){
        $('.pop1').removeClass('hide');
        _uzw.ui.mask.show();
    });
    $('.intro-list2').on('click',function(){
    	$('.pop2').removeClass('hide');
    	_uzw.ui.mask.show();
    });
    $('.intro-list2').find('.btn2').on('click',function(){
        $('.pop2').removeClass('hide');
        _uzw.ui.mask.show();
    });
    $('.btn3').on('click',function(){
    	$('.pop3').removeClass('hide');
    	_uzw.ui.mask.show();
    });
    $('.close').on('click',function(){
    	$('.pop').addClass('hide');
    	_uzw.ui.mask.hide();
    });


});