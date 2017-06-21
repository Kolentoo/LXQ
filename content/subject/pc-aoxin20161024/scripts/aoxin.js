/*
* @Author: lichen
* @Date:   2016-10-24 09:18:48
* @Last Modified by:   lichen
* @Last Modified time: 2016-10-27 19:34:52
*/

'use strict';
$(function(){
	_uzw.ui.tab('j_tab');
	_uzw.ui.tab('j_tab2');
})

$(function(){
    var subject =$('#j_subject');
    var navigation = $('#j_nav');           //导航
    var nav = subject.find('.nav-list');    //所有按钮
    var conBox = subject.find('.cont-box');   //模块
    var navTop = navigation.offset().top;  //导航相对于浏览器视口到高度
    var sw = screen.width;   // 显示屏幕宽度
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
        var w = $(window).scrollTop();   //滚动条的垂直偏移
        if (_util.check.isIE6) {
                 var w = $(window);
                 var st = w.scrollTop();
                 navigation.css({ 'top': st, 'position': 'absolute' });
            };
            if (w >= 300) {
                    navigation.addClass('nav-on');
                } else {
                    navigation.removeClass('nav-on');
                }
        $('.cont-box').each(function(a,b) {
            var ctop = $(this).offset().top;
            if (w>ctop-20) {
                navigation.find('li').removeClass('on');
                navigation.find('li').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");
});



$(function(){

	var tite=$('.map .tite-1');
	var tite2=$('.map .tite-2');
	var tite3=$('.map .tite-3');
	var tabb=$('#j_tab');
	var tab2=$('#j_tab2');
	var jrm=$('#j_road-model');
	tite.on('click',function(){
     var stoptb = tabb.offset().top;
     var stoptb2 = tab2.offset().top;
     var stopjrm = jrm.offset().top;
     $('body,html').animate({scrollTop:stopjrm},800);


	})
	tite2.on('click',function(){
     var stoptb = tabb.offset().top;
     var stoptb2 = tab2.offset().top;
     var stopjrm = jrm.offset().top;
     
      $('body,html').animate({scrollTop:stoptb2},800);
     

	})

	tite3.on('click',function(){
     var stoptb = tabb.offset().top;
     var stoptb2 = tab2.offset().top;
     var stopjrm = jrm.offset().top;
    $('body,html').animate({scrollTop:stoptb},800);
 

	})
})

