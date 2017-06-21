/*
* @Author: lichen
* @Date:   2016-10-18 09:05:23
* @Last Modified by:   lichen
* @Last Modified time: 2016-10-24 17:09:20
*/

'use strict';
$(function() {
  _uzw.ui.tab('j_tab');
  _uzw.ui.tab('j_tabs');
})

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
    if (w >= 300) {
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

$(function() {
  function axGallery() {

    var items = $('#j_con7main').find('.list-item');
    var iLen = items.length;
    var i = 0;
    setInterval(function() {
      if (i >= iLen) {
        i = 0;
      }
      items.removeClass('on').eq(i).addClass('on');
      i++;

    },
    2000);

  }

  axGallery();

})

