/*
* @Author: lichen
* @Date:   2016-08-29 09:30:59
* @Last Modified by:   lichen
* @Last Modified time: 2016-08-31 09:40:22
*/


var myexports={};

myexports.init = function(){
	myexports.moreTxt();//调用
	myexports.moreTxts();
	myexports.xiaou();
}

myexports.moreTxt = function(){
	_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        window.tab.init('j_tab');
    });
   _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        window.tab.init('j_tab-1');
    });

   _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/tab.js', function () {
        window.tab.init('j_tab-2');
    });

  

}




myexports.moreTxts=function(){
    var subject =$('#j_subject');
    var navigation = $('#j_nav');           //导航
    var nav = subject.find('.nav-list');    //所有按钮
    var conBox = subject.find('.cont-box');   //模块
    var navTop = navigation.offset().top;  //导航相对于浏览器视口到高度
    nav.on(_tap,function(){
        var t = $(this);
        var ts = t.siblings('li');
        t.addClass('on');
        ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').scrollTop(stop);
    });

    $(window).scroll(function () {
        $('.cont-box').each(function(a,b) {
        	var w = $(window).scrollTop();
            var ctop = $(this).offset().top;
            if (w>ctop-30) {
                navigation.find('li').removeClass('on');
                navigation.find('li').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");


}


myexports.xiaou=function(){
	var xiaour=$(".tp-xu");
	var xiaoul=$(".j_nav");
	xiaour.on(_tap,function(){
		xiaour.addClass('hide');
		xiaoul.removeClass('hide');	
	});
  xiaoul.on(_tap,function(){
		xiaoul.addClass('hide');
		xiaour.removeClass('hide');
	});
}
$(function() {
  	myexports.init();
});