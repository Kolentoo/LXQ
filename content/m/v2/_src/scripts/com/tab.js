"use strict";

var tab = {};

tab.init = function (obj, eve) {
    var el = $('#' + obj);
    if (!el.get(0)) {
        el = $('.' + obj);
    }
    var ohd = el.children('.hd');
    if (!ohd.get(0)) {
        ohd = el.children().children('.hd');
    }

    ohd.find('li').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        var index = o.index();

        os.removeClass('on');
        o.addClass('on');

        var obd = o.parents('.hd').siblings('.bd');
        var items = obd.children('.item');
        items.hide();

        items.eq(index).show();

        eve && eve(index, el);

    });

};