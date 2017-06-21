/*
* @Author: lxq
* @Date:   2016-08-17 11:01:43
* @Last Modified by:   lxq
* @Last Modified time: 2016-08-18 15:11:22
*/

'use strict';

$(function(){
    myexports.init();
    unveil.init('subject-main');
    _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
    	slider.api("j_topSlider", "j_topSliderWrap", 5000, true);
	});
});

var subject,hdlist,navigation, nav,navList;

var myexports={};

myexports.init = function() {
    subject = $('#j_subject');
    hdlist = subject.find('.hd-list')
    navigation = $('#j_nav');
    nav = navigation.find('.list');
    navList = navigation.find('.item').find('li');

    myexports.tab();
    myexports.nav();
    myexports.nav3();
};

myexports.tab = function(){
	hdlist.on(_tap,function(){
		var t = $(this);
		var tindex = t.index();
		var ts = t.siblings();
		var item1 =subject.find('.item').eq(tindex);
		var item2 = item1.siblings();
		ts.removeClass('on');
		t.addClass('on')
		item1.show();
		item2.hide();
	});
}

myexports.nav = function(){
	nav.on(_tap,function(){
		var t = $(this);
		var tindex = t.index();
		var ts = t.siblings();
		var item1 =navigation.find('.item').eq(tindex);
		var item2 = item1.siblings();
		item1.show();
		item2.hide();
	});

	navList.on(_tap,function(){
		var o =$(this);
		var os = o.siblings();
		o.addClass('on');
		os.removeClass('on');
	});

	$('.nav-hd').find('.list').on(_tap,function(){
		$('body,html').scrollTop(0);
		myexports.nav2();
	});

   	$(window).scroll(function () {

	    $('.con-gn').each(function(a,b) {
	    	var w = $(window).scrollTop();
	        var ctop = $(this).offset().top;
	        if (w>ctop-30) {
	            navigation.find('.item1').find('li').removeClass('on');
	            navigation.find('.item1').find('li').eq(a).addClass('on');
	        }
	    });

		$('.con-cj').each(function(c,d) {
			var w = $(window).scrollTop();
	        var dtop = $(this).offset().top;
	        if (w>dtop-30) {
	            navigation.find('.item2').find('li').removeClass('on');
	            navigation.find('.item2').find('li').eq(c).addClass('on');
	        }
	    });

    }).trigger("scroll");

}

myexports.nav2 = function(){
	$('.con-gn').each(function(a,b) {
    	var w = $(window).scrollTop();
        var ctop = $(this).offset().top;
        if (w>ctop-30) {
            navigation.find('.item1').find('li').removeClass('on');
            navigation.find('.item1').find('li').eq(a).addClass('on');
        }
    });

	$('.con-cj').each(function(c,d) {
		var w = $(window).scrollTop();
        var dtop = $(this).offset().top;
        if (w>dtop-30) {
            navigation.find('.item2').find('li').removeClass('on');
            navigation.find('.item2').find('li').eq(c).addClass('on');
        }
    });
}

myexports.nav3 = function(){
   	$(window).scroll(function () {
    	navigation.removeClass('nav-off');
    }).trigger("scroll");

    $(window).on('touchend',function(){
    	navigation.addClass('nav-off');
    });

}
