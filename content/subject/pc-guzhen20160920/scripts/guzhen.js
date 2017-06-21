/*
* @Author: lichen
* @Date:   2016-09-20 09:46:25
* @Last Modified by:   lichen
* @Last Modified time: 2016-09-30 09:49:44
*/

'use strict';
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
        if (w >= 1200) {
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

	$(function(){
	   $(window).scroll(function() {
	      var w = $(window).scrollTop(); //滚动条的垂直偏移
	      var wenzi1=$(".wenzi-1").offset().top;
	      var j_modeld=$("#j_modeld").offset().top;
          var j_modeldd=$("#j_modeldd").offset().top;

	      if(w>=wenzi1){
	         	var delay = 0.02;
	    		$('#test').find('span').each(function(index, el) {
	    		var oThis = $(this);
	    		oThis.addClass('on');
	    		oThis.css({
	    		'animation-delay': index * delay + 's'
	    		

	    	});
	    });
	      }
           if(w>=j_modeld){
	         	var delay = 0.02;
	    		$('.wenzi-3').find('span').each(function(index, el) {
	    		var oThis = $(this);
	    		oThis.addClass('on');
	    		oThis.css({
	    		'animation-delay': index * delay + 's'
	    	});
	    });
	      }

       if(w>=j_modeldd){
	         	var delay = 0.02;
	    		$('.wenzi-4').find('span').each(function(index, el) {
	    		var oThis = $(this);
	    		oThis.addClass('on');
	    		oThis.css({
	    		'animation-delay': index * delay + 's'
	    	});
	    });
	      }
	   })
})


$(function(){

     uzLazy(['subject-main']);
})