$(function() {
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


    if ($.browser.msie && (($.browser.version == "7.0") || ($.browser.version == "8.0") || ($.browser.version == "9.0"))) {
        for (var i = 0; i < $('[placeholder]').length; i++) {
            $('[placeholder]').eq(i).val($('[placeholder]').eq(i).attr('placeholder'))
        }
        $('[placeholder]').focus(function() {
            if ($(this).val() == $(this).attr('placeholder')) {
                $(this).val('');
            }
        })
        $('[placeholder]').blur(function() {
            if ($(this).val() == '') {
                $(this).val($(this).attr('placeholder'));
            }
        })
    }

    $('input[type=text] ,input[type=password]').on('blur keyup',function() {
        $(this).removeClass('blur');
        var val = $(this).val();
        var reg = $(this).attr('pattern');
        if (val == $(this).attr('placeholder')) {
            val = '';
        }
        if (!new RegExp(reg).test(val)) {
            $(this).parent().css('position', 'relative')
            $(this).addClass('error');
            if (!$(this).next().hasClass('error_entry')) $(this).after('<div class="error_entry">' + $(this).attr('data-error') + '</div>');
            $('.activity_desc').show();
        } else {
            $(this).removeClass('error');
            $(this).next('.error_entry').remove();
            $('.activity_desc').hide();
        };
    })
    $('input[type=text] ,input[type=password]').focus(function() {
        if (!$(this).hasClass('error')) $(this).addClass('blur');
    })
    $('.section-select').click(function() {
        $(this).children('.section-select_option').show();
        return false;
    })

    $('.section-select .section-select_option a').click(function() {
        $(this).parentsUntil('.section-select').eq($(this).parentsUntil('.section-select').length - 1).parent().children('span').html($(this).html());
        $('.section-select_option').hide();
        if ($(this).html() == '男') {
            $(this).parentsUntil('.fill_main_m').eq($(this).parentsUntil('.fill_main_m').length - 1).prev().addClass('boy').removeClass('girl');
        } else {
            $(this).parentsUntil('.fill_main_m').eq($(this).parentsUntil('.fill_main_m').length - 1).prev().addClass('girl').removeClass('boy');
        }
        return false;
    })
    $(document).click(function() {
        $('.section-select_option').hide();
    })
})
