/*
* @Author: lxq
* @Date:   2016-08-30 13:36:22
* @Last Modified by:   lxq
* @Last Modified time: 2016-08-31 10:33:01
*/

'use strict';



var myexports = {};

myexports.init = function() {
	myexports.tab();
	myexports.nav();
}

myexports.tab = function(){
	_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        window.tab.init('sub-tab',function(idx, obj){
		    var imgs = obj.find('.bd').find('.item').eq(idx).find('img');
		    imgs.each(function(){
		        var img = $(this);
		        img.attr('src', img.attr('data-original'));
		    });
        });

    });
}

myexports.nav = function(){
	var subject = $('#j_subject');
	var navigation = $('#j_nav');
	var nav = navigation.find('.nav-list');
	var conBox = subject.find('.cont-box');

	nav.on(_tap,function(){
	    var t = $(this);
	    var ts = t.siblings('li');
	    var tindex = t.index();
	    var section = conBox.eq(tindex);
	    var stop = section.offset().top;
	    $('body,html').scrollTop(stop);
	});

	$(window).scroll(function () {
        var w = $(window).scrollTop();
            if (w >= 600) {
                    navigation.addClass('nav-on');
                    $('.back').show();
                } else {
                    navigation.removeClass('nav-on');
                    $('.back').hide();
                }

        $('.cont-box').each(function(a,b) {
            var ctop = $(this).offset().top;
            if (w>ctop-30) {
                navigation.find('.nav-list').removeClass('on');
                navigation.find('.nav-list').eq(a).addClass('on');
            }
        });

    }).trigger("scroll");

	$('.back').on(_tap,function(){
	    $('body,html').scrollTop(0);
	    $(this).hide();
	});

	$('.nav-switch').on(_tap,function(){
		$('.nav').toggleClass('nav-off');
		$(this).find('.arrow').toggleClass('arrow-on');
	});
}

$(function() {
    myexports.init();
    unveil.init('subject-main');
});