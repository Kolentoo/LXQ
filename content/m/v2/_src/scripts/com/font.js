"use strict";

(function (doc, win) {
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

document.onkeydown = function (event) {
    //http://jshint.com/docs/options/#noarg removed  arguments.callee.caller
    var e = event || window.event;
    if (e && e.keyCode == 13) {//enter
        $('p').show();
    } else {
        $('p').hide();
    }
};

function fixedWatch(el) {
    var $inp = $('input');
    if ($inp.is(":focus")) {
        el.hide();
    } else {
        el.show();
    }
}