"use strict";

var fixCity = {};

fixCity.init = function (wp='j_fnHeader') {
    var ck = _uzm.cookie.get('uzmCity');

    var el = $('#' + wp);
    if (!el.get(0)) {
        el = $('.' + wp);
    }

    if (!ck) {
        _util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/geo.js', function () {
            window.geo && window.geo.init(wp);
        });
    } else {
        el.find('.city').text(ck.split('-')[0]);
    }

};

