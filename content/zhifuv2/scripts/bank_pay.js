(function () {
    'use strict';

    var userAgent = navigator.userAgent.toLowerCase();
    // Figure out what browser is being used
    $.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };

//    $('.main_card_fo input').click(function () {
//        $('.body_shade, .body_shade_show').show();
//        $('html').css('overflow', 'hidden').css('height', $(window).height());
//    });
    $('.body_shade_show .close').click(function () {
        $('.body_shade, .body_shade_show').hide();
        $('html').css('overflow', 'auto').css('height', $(document).height());
    });
    $('.main_card_m_top li').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var i = $(this).index();
        $('.pay').eq(i).show().siblings('.pay').hide();
    });
    $('.bank_card_top li').click(function () {
        $(this).addClass('hover').siblings().removeClass('hover');
        var i = $(this).index();
        $('.bank_card_m1_img').eq(i).show().siblings('.bank_card_m1_img:lt(3)').hide();
    })
    var j_slide_coupon = $('#j_slide_coupon');
    j_slide_coupon.on('click', function () {
        j_slide_coupon.toggleClass('slide-btn-hover');
        $('#j_slide_coupon_content').toggle();
    });

    if ($.browser.msie && (($.browser.version == "7.0") || ($.browser.version == "8.0"))) {
        $('input[type=checkbox]').click(function () {
            if ($(this).prop('checked')) {
                $(this).next().addClass('input-checkbox-box');
            } else {
                $(this).next().removeClass('input-checkbox-box');
            }
        });
    };
    $('.posre input').on('keyup', function (e) {
        if (e.keyCode != 8) {
            $(this).val($(this).val().replace(/\s/g, '').replace(/(.{4})/g, "$1 "));
        }
    });
    $('.bank_card_m1_img li').click(function () {
        $('.bank_card_m1_img li').removeClass('selected').children('input').removeAttr("checked");
        $(".bankname").children('input').removeAttr("checked");
        $(this).addClass('selected').children('input').prop("checked", "checked");
        $(this).addClass('selected').children('input').attr("checked", "checked");
        return false;
    })
    //$('.body_shade').show();
    //$('.storage').show();

    $('.sold_main_li span').click(function () {
        $(this).addClass('select').siblings().removeClass('select')
        var i = $(this).index();
        $('.sold_main_li_m').eq(i).show().siblings('.sold_main_li_m').hide();
        if (i != 0) {
            $('#j_slide_coupon').hide();
        } else {
            $('#j_slide_coupon').show();
        }
    })
    $('.bank_pay_card li').click(function () {
        $('.bank_pay_card li').removeClass('selected').children('input').removeAttr("checked");
        $(this).addClass('selected').children('input').prop("checked", "checked");
    })
   
} ());
