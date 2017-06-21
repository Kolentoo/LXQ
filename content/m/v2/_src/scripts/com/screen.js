//条件筛选
"use strict";

$('#j_listFilter').on('click', function () {

    var o = $(this);
    var h = $('body').height();
    var wh = $(window).height();

    var realh = h > wh ? h : wh;

    $('.route-screen').show().height(realh);
    $('.route-mask').height(realh);

    $('.route-mask').show().animate({ "opacity": "0.5" }, 300, 'swing', function () {
        $('.route-wrap').animate({ "right": "0" }, 300);
    });

});

$('.route-arrow,.route-wrap .cancel').on('click', function () {
    var o = $(this);
    var h = o.height();

    $('.route-wrap').animate({ "right": "-80%" }, 300, 'swing', function () {
        $('.route-mask').animate({ "opacity": "0" }, 300, 'swing', function () {
            $('.route-mask').hide();
            $('.route-screen').hide();
        });

    });

});