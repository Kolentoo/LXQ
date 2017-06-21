/*
* @Author: lxq
* @Date:   2016-08-29 10:22:46
* @Last Modified by:   lxq
* @Last Modified time: 2016-08-29 16:13:58
*/

'use strict';
$(function(){
    var subject = $('#j_subject');
    var navigation = $('#j_nav');
    var nav = navigation.find('.nav-list');
    var conBox = subject.find('.cont-box');
    var navTop = $('.navigation').offset().top;

	uzLazy(['subject-main']);
	_uzw.ui.tab('pro-tab', function(idx, obj) {
	    var imgs = obj.find('.bd').find('.item').eq(idx).find('img');
	    imgs.each(function(){
	        var img = $(this);
	        img.attr('src', img.attr('data-original'));
	    });
	});

    $("#j_slider").tinycarousel({
        axis: 'x',
        infinite: false,
        bullets: true,
        buttons: true
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

    $('.back').on('click',function(){
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



});