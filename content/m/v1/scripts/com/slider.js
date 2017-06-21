define(function (require, exports, module) {
    var Swipe = require('swipe');
    exports.api = function (id, idwrap, time, lazyload, numSlide) {
        if ($('#' + id).get(0) == null) {
            return;
        }
        var count = $('#' + idwrap).find('.num').find('em').length;
        var direc = $('#' + idwrap).find('.direction');
        if (lazyload != undefined && lazyload == true) {
            handleLozyLoad(id, 0);
        }

        if (count <= 1) {
            $('#' + idwrap).find('.num').hide();
        }

        var slider = Swipe(document.getElementById(id), {
            auto: time,
            continuous: count <= 2 ? false : true,
            callback: function (pos) {

                var i = bullets.length;
                while (i--) {
                    if (bullets.length > 0) {
                        bullets[i].className = ' ';
                    }

                    if (guns.length > 0) {
                        guns[i].className = "on";
                    }
                }
                if (bullets.length > 0) {
                    bullets[pos].className = 'on';
                }
                if (guns.length > 0) {
                    guns[pos].className = "on";
                }

                if (lazyload != undefined && lazyload == true) {
                    handleLozyLoad(id, pos);
                }

                direc.find('.direction-txt').find('.white').text(pos + 1);

            }
        });

        direc.find('.direction-txt').find('.f999').text(count + '张');


        direc.find('.prev').on(_tap, function () {
            slider.prev();
        });

        direc.find('.next').on(_tap, function () {
            slider.next();
        });


        if (numSlide != undefined && numSlide == true) {

            $('#' + idwrap).find('.num').find('em').on(_tap, function () {
                var o = $(this);
                var i = o.index();
                slider.slide(i, time);
            });
        }


        var bullets = document.getElementById(idwrap).getElementsByTagName('em');
        var guns = document.getElementById(idwrap).getElementsByTagName('s');
    }

});

function handleLozyLoad(id, index) {
    var ot = $('#' + id).find('.box').eq(index).find('.image');
    ot.each(function (k, v) {
        var o = $(this);
        var osrc = o.attr('data-img');
        if (osrc) {
            if (!o.is('img'))
                o.css({ "background-image": "url(" + osrc + ")" });
            else
                o.attr('src', osrc);
        }
    });

}
