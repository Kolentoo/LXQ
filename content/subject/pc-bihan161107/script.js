/*
* @Author: lxq
* @Date:   2016-11-07 15:04:32
* @Last Modified by:   lxq
* @Last Modified time: 2016-11-09 10:45:29
*/

'use strict';

$(function(){
	uzLazy(['subject-main']);

	tmSlider();
	function tmSlider() {
	    var oBS = $('.pic-show');
	    if (oBS.get(0) != null) {
	        oBS.slides({
	            preload: true,
	            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
	            currentClass: 'on',
	            fadeSpeed: 300,
	            effect: 'fade',
	            crossfade: true,
	            hoverPause: true,
	            pause: 1000,
	            play: 4000,
	            generatePagination: true
	        });
	    };
	}

    var subject = $('#j_subject');
    var navigation = $('#j_nav');
    var nav = navigation.find('.nav-list');
    var conBox = subject.find('.cont-box');
    var navTop = $('.navigation').offset().top;
    var sw = screen.width;
  
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