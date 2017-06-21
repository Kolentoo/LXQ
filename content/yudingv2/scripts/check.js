(function() {
    'use strict';

    var clearing_tab = $('#clearing-tab');

    clearing_tab.on('click', 'li', function() {
        var index = $(this).index();
        clearing_tab.children('li').removeClass('clearing-title-hover');
        clearing_tab.children('li').eq(index).addClass('clearing-title-hover');
        $(".clearing-tab-content").hide();
        $(".clearing-tab-content").eq(index).show();
    });

    var userAgent = navigator.userAgent.toLowerCase();
    // Figure out what browser is being used
    $.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };

    if ($.browser.msie && (($.browser.version == "7.0") || ($.browser.version == "8.0"))) {
        $('input[type=checkbox]').click(function() {
            if ($(this).prop('checked')) {
                $(this).next().addClass('input-checkbox3')
            } else {
                $(this).next().removeClass('input-checkbox3')
            }
        })
        $('.clearing-checkbox input[type=checkbox]').next().addClass('input-checkbox3');
    }
}());
