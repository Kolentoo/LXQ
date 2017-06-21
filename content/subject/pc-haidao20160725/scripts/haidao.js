/* 
* @Author: anchen
* @Date:   2016-07-25 10:09:15
* @Last Modified by:   lichen
* @Last Modified time: 2016-10-31 11:24:36
*/

'use strict';

$(function(){
    var subject = $('#j_subject');
    var dx = subject.find('.box5').find('img');
    var cx = subject.find('.box10').find('img');
    var item = subject.find('.bd').children('.item')
    uzLazy(['subject-main']);
    _uzw.ui.tab('j_tab');
    var hd=$(".hd")
    var dxhd=$(".dxhd")
    var cxhd=$(".cxhd");
    cxhd.on("mouseover",function(){
        hd.addClass("hd-on");
    });

    dxhd.on("mouseover",function(){
        hd.removeClass("hd-on");
    });

    dx.on('click',function(){
        item.eq(0).hide();
        item.eq(1).show();
        hd.addClass("hd-on");
        $('body,html').animate({scrollTop:849},800);
     });
    cx.on('click',function(){
        item.eq(0).show();
        item.eq(1).hide();
        hd.removeClass("hd-on");
        $('body,html').animate({scrollTop:849},800);
     });
});





    
