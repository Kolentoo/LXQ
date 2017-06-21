/*
* @Author: lxq
* @Date:   2017-03-01 17:53:38
* @Last Modified by:   lxq
* @Last Modified time: 2017-03-02 15:19:47
*/

'use strict';

$(function(){

	var subject = $('#j_subject');
	var navigation = $('#j_nav');
	var nav = navigation.find('.nav-item');
	var conBox = subject.find('.cont-box');
	var navTop = $('.navigation').offset().top;
	var sw = screen.width;
	
	uzLazy(['subject-main']);

	_uzw.ui.tab('subject-tab', function(idx, obj) {
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

	$('.nav-back').on('click',function(){
        $('body,html').animate({scrollTop:0},800);
    });

    $(window).scroll(function () {
        var w = $(window).scrollTop();
        if (_util.check.isIE6) {
                return;
            };
            if (w >= 750) {
                    navigation.addClass('nav-on');
                } else {
                    navigation.removeClass('nav-on');
                }

        $('.cont-box').each(function(a,b) {
            var ctop = $(this).offset().top;
            if (w>ctop-30) {
                navigation.find('.nav-item').removeClass('on');
                navigation.find('.nav-item').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");

    $('.rbtn1').on('click',function(){
    	$('.rb1').removeClass('hide');
		_uzw.ui.mask.show();
    });

    $('.rbtn2').on('click',function(){
    	$('.rb2').removeClass('hide');
		_uzw.ui.mask.show();
    });

    $('.pop-close').on('click',function(){
    	$('.rule-box').addClass('hide');
		_uzw.ui.mask.hide();
    });



});