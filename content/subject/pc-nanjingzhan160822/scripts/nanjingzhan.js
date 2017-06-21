/*
* @Author: lichen
* @Date:   2016-08-22 14:55:34
* @Last Modified by:   lxq
* @Last Modified time: 2016-08-23 17:45:35
*/

'use strict';

$(function(){
    var subject = $('#j_subject');
    var navigation = $('#j_nav');
    var nav = subject.find('.nav-list');
    var conBox = subject.find('.cont-box');
    var navTop = navigation.offset().top;
    var sw = screen.width;

    uzLazy(['subject-main']);

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
                navigation.find('li').removeClass('on');
                navigation.find('li').eq(a).addClass('on');
            }
        });

    }).trigger("scroll");
});