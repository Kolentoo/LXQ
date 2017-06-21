"use strict";

$('#thelist1').on('click', '.item img', function () {

    var zw = $('.zp-wrap');
    if (!zw.get(0)) {
        $('body').append("<div class='zp-wrap'></div>");
        zw = $('.zp-wrap');
    }

    zw.find('img').remove();

    var sw = screen.width;
    var sh = screen.height;
    var w = sw > sh ? sw : sh;

    var o = $(this);
    var osrc = o.attr('src');

    zw.append("<img />");

    var oNsrc = osrc.replace('w=93&h=100', 'w=640');
    var cfg = { 'max-width': sw, 'max-height': sh, 'width': '100%' };
    zw.find('img').attr('src', oNsrc).css(cfg);
    zw.css({ 'left': '0' });

    zw.on('click', function () {
        zw.css({ 'left': '640px' });
        zw.find('img').remove();
    });

});