/*
* @Author: lxq
* @Date:   2017-03-13 14:28:26
* @Last Modified by:   lxq
* @Last Modified time: 2017-03-14 17:12:30
*/

'use strict';
$(function(){
	_uzw.ui.tab('subject-tab');
	uzLazy(['subject-main']);

    var subject = $('#j_subject');
    var navigation = $('#j_nav');
    var nav = navigation.find('.nav-item').find('.nav-p1');
    var conBox = subject.find('.cont-box');
    var navTop = $('.navigation').offset().top;
    var picItem = subject.find('.pic-show').children('li');
    var sw = screen.width;

    $('.hd-item').on('mouseenter',function(){
    	var t = $(this);
    	var tindex = t.index();
    	var tpic = t.parents('.cont-box').find('.pic-show').children('li');
    	var pic1 = tpic.eq(tindex);
    	var pic2 = pic1.siblings();
    	pic1.removeClass('hide');
    	pic2.addClass('hide');
    });

    $('.nav-item').on('click',function(){
    	return false;
    });
   
    nav.on('click',function(){
        var t = $(this);
        var tp = t.parent('.nav-item');
        var ts = tp.siblings();
        tp.addClass('on');
        ts.removeClass('on');
        var tindex = tp.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').animate({scrollTop:stop},800);
    });

    $('.back').on('click',function(){
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

    $('.rules').on('click',function(){
    	$('.pop-box').removeClass('hide');
		_uzw.ui.mask.show();
    });

    $('.pop-btn').on('click',function(){
    	$('.pop-box').addClass('hide');
		_uzw.ui.mask.hide();
    });





});