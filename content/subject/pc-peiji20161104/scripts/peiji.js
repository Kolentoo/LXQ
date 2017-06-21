/*
 * @Author: lichen
 * @Date:   2016-11-04 09:47:44
 * @Last Modified by:   jonas hsiao
 * @Last Modified time: 2016-11-08 14:31:55
 */

'use strict';
$(function() {
    _uzw.ui.tab('j_tab');
    _uzw.ui.tab('j_tabs');
    _uzw.ui.tab('j_tabss');
})

$(function() {
    var subject = $('#j_subject');
    var navigation = $('#j_nav'); //导航
    var nav = subject.find('.nav-list'); //所有按钮
    var conBox = subject.find('.cont-box'); //模块
    var navTop = navigation.offset().top; //导航相对于浏览器视口到高度

    $(window).scroll(function() {
        var con1 = $('.con-1');
        var ct = con1.offset().top;
        var w = $(window).scrollTop();

        if (w >= ct - 200) {
            con1.addClass('con-1-on');
        } else {
            con1.removeClass('con-1-on');
        }
    })
        // 点击导航跳转
    nav.on('click', function() {
        var t = $(this);
        var ts = t.siblings('li');
        // t.addClass('on');
        // ts.removeClass('on');
        var tindex = t.index();
        var section = conBox.eq(tindex);
        var stop = section.offset().top;
        $('body,html').animate({
            scrollTop: stop
        }, 800);
    });
    // 返回顶部
    $('.back').on('click', function() {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
    });



    //导航一开始设置绝对定位，随着滑动变成固定定位
    $(window).scroll(function() {
        var w = $(window).scrollTop(); //滚动条的垂直偏移
        if (_util.check.isIE6) {
            navigation.css({
                'top': 'w',
                'position': 'absolute'
            }); //fixed兼容IE6
        };
        if (w >= 300) {
            navigation.addClass('nav-on');
        } else {
            navigation.removeClass('nav-on');
        }


        // 随着页面滑动导航条加on
        $('.cont-box').each(function(a, b) { //each方法，数组中的每个元素都会顺序执行function函数，a为执行元素的索引你，b为正在执行的元素
            var ctop = $(this).offset().top; //正在执行的元素距离文档顶部的距离
            if (w > ctop - 20) { //当页面向上卷曲的距离大于模块距离文档顶部的距离时候
                navigation.find('li').removeClass('on');
                navigation.find('li').eq(a).addClass('on');
            }
        });
    }).trigger("scroll");
});