$(function () {
    window.i = 0;

    var unit_price = $('#unit_price').html();

    function max() {
        if (parseInt($('#hidActivityNumberMax').val()) - parseInt($('#hidSignCount').val()) > 1) {

            var _n = parseInt($('#hidActivityNumberMax').val()) - parseInt($('#hidSignCount').val()) - 1;
            var _dataValue = parseInt($('#peerNum').attr('data-value'));
            if (parseInt($('#hidActivityNumberMax').val()) < 5) {


                $('#peerNum i').html(_n);
                $('#peerNum').attr('data-value', _n);
            } else {
                if (_n > _dataValue) {
                    //$('#peerNum i').html('4');
                    //$('#peerNum').attr('data-value', '4');
                } else {
                    $('#peerNum i').html(_n);
                    $('#peerNum').attr('data-value', _n);
                }



            }


        } else {
            $('#peerNum i').html('0');
            //$('#peerNum').attr('data-value', '0');
            $('.j_partner').hide();
            $('.j_master').css('padding-bottom', '0');
        }
    }
    max();
    window.onload = function () {
        max();
    };

    if (0 === parseInt($('#peerNum').attr('data-value'))) {
        $('#add').hide();
    }
    $('#add').click(function () {
        if (i > $('#peerNum').attr('data-value')) {
            return false;
        } {
            i++;
            var fill_left_m = $('.fill_left_m').eq(1);
            fill_left_m.append("<div class='J_list'><div class='fill_lefttopm'><span>姓名：</span><input type='text' name='peername' class='name'/><b>姓名不能为空</b></div><div class='fill_lefttopm'><span>手机：</span><input type='text' class='mobile'  name='peerphone'/><b>手机号码输入有误</b><i></i></div><div class='clear'></div></div>");
            $(".J_list i").off("click");
            $('.J_list i').on('click', function () {
                i--;
                $(this).parentsUntil('.fill_left_m').remove();
                $('#number').html(i + 1);
                $('#total').html($('#number').html() * unit_price);
                $('#add').show();
            });
            if (i === parseInt($('#peerNum').attr('data-value')) || i > parseInt($('#peerNum').attr('data-value'))) {
                $('#add').hide();
            }
        }
        $('#number').html(i + 1);
        $('#total').html($('#number').html() * unit_price);
        $('.mobile').blur(function () {
            var phone = $(this).val();
            if (!(/^1[3578]\d{9}$/.test(phone))) {
                $(this).next().html('手机号码输入有误').show();
                return false;
            } else {
                $(this).next().hide();
            }
            var mobile_array = '';
            for (var c = 0; c <= $('.mobile').length - 1; c++) {
                if (c != $(this).index('.mobile')) {
                    mobile_array += $('.mobile').eq(c).val();
                }

            }

            if (mobile_array.indexOf($(this).val()) != -1) {
                $(this).next().html('报名人和同行人的手机号码不能重复').show();
                return false;
            } else {
                $(this).next().hide();
            }
        });
        $('input.name').blur(function () {
            var name = $(this).val();
            if (!name) {
                $(this).next().show();
                return false;
            } else {
                $(this).next().hide();
            }
        });
    });
    $('#peerNum i').html($('#peerNum').attr('data-value'));
    $('#number').html(i + 1);
    $('#total').html($('#number').html() * unit_price);
    $('input.name').blur(function () {
        var name = $(this).val();
        if (!name) {
            $(this).next().show();
            return false;
        } else {
            $(this).next().hide();
        }
    });
    $('.mobile').blur(function () {
        var phone = $(this).val();
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            $(this).next().show();
            return false;
        } else {
            $(this).next().hide();
        }
    });
    $('.mobile_login .close').click(function () {
        $('.mobile_login').hide();
        $('.bg_000').hide();
    });

    $('#yzm').click(function () {
        if (!$(this).hasClass('dis')) {
            $(this).addClass('dis');
            if (typeof (t) === 'undefined') {
                window.t = 60;
            }
            $('#yzm').val(--t + '秒之后再次获取');
            var timer = setInterval(function () {
                $('#yzm').val(--t + '秒之后再次获取');
                if (t === 0) {
                    $('#yzm').removeClass('dis');
                    $('#yzm').val('免费获取验证码');
                    clearInterval(timer);
                    t = 60;
                }
            }, 1000);
        }
    });
});
window.onload = function () {
    $('.bds_count').html(parseInt($('.bds_count').html()) * 3);
};

$(document).ready(function (e) {

    var index = 1;
    var timer = null;

    var $nav = $(".club_main1_nav li");
    var $view = $(".club_main1_left");
    var $pipe = $(".club_main1_left .club_main1_left_ul");

    var $firstPipeItem = $(".club_main1_left .club_main1_left_ul li").first();
    var $lastPipeItem = $(".club_main1_left .club_main1_left_ul li").last();
    $firstPipeItem.clone(true).appendTo($pipe);
    $lastPipeItem.clone(true).prependTo($pipe);

    var $pipeItem = $(".club_main1_left .club_main1_left_ul li");
    var imgWidth = 850;
    $pipe.css('width', imgWidth * $pipeItem.length);

    function slide(i) {
        if (i === 0) {
            setNavFocus($nav.eq(4));
        } else if (i === $pipeItem.length - 1) {
            setNavFocus($nav.eq(0));
        } else {
            setNavFocus($nav.eq(i - 1));
        }
        $pipe.animate({
            left: -i * imgWidth
        }, 400, function () {
            if (i === 0) {
                $pipe.css("left", ($pipeItem.length - 2) * -imgWidth);
                index = $pipeItem.length - 2;
            } else if (i === $pipeItem.length - 1) {
                $pipe.css("left", -imgWidth);
                index = 1;
            }
        });
    }

    function setNavFocus($obj) {
        $obj.addClass("active").siblings().removeClass("active");
    }

    $nav.on("mouseover", function () {
        var i = $(this).index() + 1;
        slide(i);
        index = i;
    });
    $nav.on("mouseout", function () {
        $pipe.stop(true, true);
    });


    function setTimer() {
        timer = setInterval(function () {
            if (!$pipe.is(":animated")) {
                slide(++index);
            }
        }, 4000);
    }

    setTimer();
});

$(function () {
    var index = 0;
    var list = 0;
    $('.J_main1_nav li').click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        index = $(this).index();
        $('.J_main1 .club_main2_mlim').eq(index).show().siblings().hide();
        $('.J_main1 .club_main2_mlim').css('marginLeft', '0px');
        list = 0;
        $(".J_main1").siblings('.prev').hide();
        $(".J_main1").siblings('.last').show();
        if ($('.J_main1 .club_main2_mlim').eq(index).children('.club_main2_mli').length <= 3) {
            $(".J_main1").siblings('.last').hide();
        }
        imgLazyload($('.J_main1 .club_main2_mlim').eq(index));
    });
    $(".J_main1").siblings('.prev').on("click", function () {
        $(".J_main1").siblings('.last').show();
        if (list === 0) {

        } else {
            list--;
            if (list === 0) {
                $(".J_main1").siblings('.prev').hide();
            }
            $('.J_main1 .club_main2_mlim').eq(index).animate({
                marginLeft: -list * 380
            }, 800);
        }

    });
    $(".J_main1").siblings('.last').on("click", function () {
        $(".J_main1").siblings('.prev').show();
        if (list > $('.J_main1 .club_main2_mlim').eq(index).children('.club_main2_mli').length - 4) {
            $(".J_main1").siblings('.last').hide();
        } else {
            list++;
            if (list > $('.J_main1 .club_main2_mlim').eq(index).children('.club_main2_mli').length - 4) {
                $(".J_main1").siblings('.last').hide();
            }
            $('.J_main1 .club_main2_mlim').eq(index).animate({
                marginLeft: -list * 380
            }, 800);
        }
    });
    if ($('.J_main1 .club_main2_mlim').eq(index).children('.club_main2_mli').length <= 3) {
        $(".J_main1").siblings('.last').hide();
    }
});
$(function () {
    var index = 0;
    $('.J_main2_nav li').click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        index = $(this).index();
        $('.J_main2 .club_main2_mulx').eq(index).show().siblings().hide();
        imgLazyload($('.J_main2 .club_main2_mulx').eq(index));
    });
});
$(function () {
    var index = 0;
    $('.J_main3_nav li').click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        index = $(this).index();
        $('.J_main3 .club_main2_mulx').eq(index).show().siblings().hide();
        imgLazyload($('.J_main3 .club_main2_mulx').eq(index));
    });
});

function validate() {
    var boo = true;
    for (var i = 0; i <= $('.fill .mobile').length - 1; i++) {
        var phone = $('.fill .mobile')[i].value;
        var mobile_array = '';
        for (var c = 0; c <= $('.fill .mobile').length - 1; c++) {
            if (c != i) {
                mobile_array += $('.fill .mobile').eq(c).val();
            }

        }
        if (!(/^1[3578]\d{9}$/.test(phone))) {
            $('.fill .mobile').eq(i).next().html('手机号码输入有误').show();
            boo = false;
        } else if (mobile_array.indexOf($('.fill .mobile').eq(i).val()) != -1) {
            $('.fill .mobile').eq(i).next().html('报名人和同行人的手机号码不能重复').show();
            boo = false;
        } else {
            $('.fill .mobile').eq(i).next().hide();
        }

    }
    for (var ix= 0; ix < $('input.name').length; ix++) {
        var name = $('input.name')[ix].value;
        if (!name) {
            $('input.name').eq(ix).next().show();
            boo = false;
        } else {
            $('input.name').eq(ix).next().hide();
        }
    }
    return boo;
}

function imgLazyload(obj) {
    var img = obj.find('img[data-src]');
    if (img.length) {
        img.each(function () {
            var oThis = $(this);
            var sSrc = oThis.attr('data-src');
            if (sSrc != oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
}
/*
$(document).ready(function(e) {

    var index = 1;
    var timer = null;

    var $nav = $(".J_main1_nav li");
    var $view = $(".J_main1");
    var $pipe = $(".J_main1 .club_main2_mul");

    var $firstPipeItem = $(".J_main1 .club_main2_mul .club_main2_mlim").first();
    var $lastPipeItem = $(".J_main1 .club_main2_mul .club_main2_mlim").last();
    $firstPipeItem.clone(true).appendTo($pipe);
    $lastPipeItem.clone(true).prependTo($pipe);

    var $pipeItem = $(".J_main1 .club_main2_mul .club_main2_mlim");
    var imgWidth = 1140;
    $pipe.width($pipeItem.length * imgWidth);

    function slide(i) {
        if (i === 0) {
            setNavFocus($nav.eq(2));
        } else if (i === $pipeItem.length - 1) {
            setNavFocus($nav.eq(0));
        } else {
            setNavFocus($nav.eq(i - 1));
        }
        $pipe.animate({
            left: -i * imgWidth
        }, 200, function() {
            if (i === 0) {
                $pipe.css("left", ($pipeItem.length - 2) * -imgWidth);
                index = $pipeItem.length - 2;
            } else if (i === $pipeItem.length - 1) {
                $pipe.css("left", -imgWidth);
                index = 1;
            }
        });
    }

    function setNavFocus($obj) {
        $obj.addClass("active").siblings().removeClass("active");
    }

    $nav.on("click", function() {
        var i = $(this).index() + 1;
        slide(i);
        index = i;
    });


    $(".J_main1").siblings('.prev').on("click", function() {
        if (!$pipe.is(":animated")) {
            slide(--index);
        }
    });

    $(".J_main1").siblings('.last').on("click", function() {
        if (!$pipe.is(":animated")) {
            slide(++index);
        }
    });
});

$(document).ready(function(e) {

    var index = 1;
    var timer = null;

    var $nav = $(".J_main2_nav li");
    var $view = $(".J_main2");
    var $pipe = $(".J_main2 .club_main2_mul");

    var $firstPipeItem = $(".J_main2 .club_main2_mul .club_main2_mlim").first();
    var $lastPipeItem = $(".J_main2 .club_main2_mul .club_main2_mlim").last();
    $firstPipeItem.clone(true).appendTo($pipe);
    $lastPipeItem.clone(true).prependTo($pipe);

    var $pipeItem = $(".J_main2 .club_main2_mul .club_main2_mlim");
    var imgWidth = 1140;
    $pipe.width($pipeItem.length * imgWidth);

    function slide(i) {
        if (i === 0) {
            setNavFocus($nav.eq(2));
        } else if (i === $pipeItem.length - 1) {
            setNavFocus($nav.eq(0));
        } else {
            setNavFocus($nav.eq(i - 1));
        }
        $pipe.animate({
            left: -i * imgWidth
        }, 200, function() {
            if (i === 0) {
                $pipe.css("left", ($pipeItem.length - 2) * -imgWidth);
                index = $pipeItem.length - 2;
            } else if (i === $pipeItem.length - 1) {
                $pipe.css("left", -imgWidth);
                index = 1;
            }
        });
    }

    function setNavFocus($obj) {
        $obj.addClass("active").siblings().removeClass("active");
    }

    $nav.on("click", function() {
        var i = $(this).index() + 1;
        slide(i);
        index = i;
    });


    $(".J_main2").siblings('.prev').on("click", function() {
        if (!$pipe.is(":animated")) {
            slide(--index);
        }
    });

    $(".J_main2").siblings('.last').on("click", function() {
        if (!$pipe.is(":animated")) {
            slide(++index);
        }
    });
});

$(document).ready(function(e) {

    var index = 1;
    var timer = null;

    var $nav = $(".J_main3_nav li");
    var $view = $(".J_main3");
    var $pipe = $(".J_main3 .club_main2_mul");

    var $firstPipeItem = $(".J_main3 .club_main2_mul .club_main2_mlim").first();
    var $lastPipeItem = $(".J_main3 .club_main2_mul .club_main2_mlim").last();
    $firstPipeItem.clone(true).appendTo($pipe);
    $lastPipeItem.clone(true).prependTo($pipe);

    var $pipeItem = $(".J_main2 .club_main2_mul .club_main2_mlim");
    var imgWidth = 1140;
    $pipe.width($pipeItem.length * imgWidth);

    function slide(i) {
        if (i === 0) {
            setNavFocus($nav.eq(2));
        } else if (i === $pipeItem.length - 1) {
            setNavFocus($nav.eq(0));
        } else {
            setNavFocus($nav.eq(i - 1));
        }
        $pipe.animate({
            left: -i * imgWidth
        }, 200, function() {
            if (i === 0) {
                $pipe.css("left", ($pipeItem.length - 2) * -imgWidth);
                index = $pipeItem.length - 2;
            } else if (i === $pipeItem.length - 1) {
                $pipe.css("left", -imgWidth);
                index = 1;
            }
        });
    }

    function setNavFocus($obj) {
        $obj.addClass("active").siblings().removeClass("active");
    }

    $nav.on("click", function() {
        var i = $(this).index() + 1;
        slide(i);
        index = i;
    });


    $(".J_main3").siblings('.prev').on("click", function() {
        if (!$pipe.is(":animated")) {
            slide(--index);
        }
    });

    $(".J_main3").siblings('.last').on("click", function() {
        if (!$pipe.is(":animated")) {
            slide(++index);
        }
    });
});
*/
$(function () {
    $('.user_active_m_1 .nav').click(function () {
        $(this).addClass('active').siblings('.nav').removeClass('active');
    });
    $('.J_list i').click(function () {
        $(this).parentsUntil('.J_list').remove();
    });
});
