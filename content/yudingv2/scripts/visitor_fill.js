(function () {
    'use strict';


//    for (var i = 0; i < $('.fill_main_input.sex select').length; i++) {
//        if ($('.fill_main_input.sex select').eq(i).val() == '1') {
//            $('.fill_main_m1').eq(i).addClass('boy').removeClass('girl');
//        } else {
//            $('.fill_main_m1').eq(i).addClass('girl').removeClass('boy');
//        }
//    }
//    $('.fill_main_input.sex select').change(function () {
//        if ($(this).val() == '1') {
//            $('.fill_main_m1').eq($(this).index($('.fill_main_input.sex select'))).addClass('boy').removeClass('girl');
//        } else {
//            $('.fill_main_m1').eq($(this).index($('.fill_main_input.sex select'))).addClass('girl').removeClass('boy');
//        }
//    })
    $('.fill_main_input.name input').click(function () {
        $(this).siblings('.section-select_option').show();
        return false;
    })
    $('.fill_main_input.name .section-select_option a').click(function () {
        var htm = $(this).html();
        $(this).parentsUntil('.left').siblings('input').val(htm);
    })
} ());
