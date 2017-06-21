$(function() {
    $('.main_switch_top li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        var i = $(this).index();
        $('.main_switch_m ul').eq(i).removeClass('hide').siblings().addClass('hide');
    })
    $('.remember').click(function() {
        if ($(this).hasClass('remember_h')) {
            $(this).removeClass('remember_h')
        } else {
            $(this).addClass('remember_h')
        }
    })

    //计时器开关
    var time = true;
    $('.yzm_b').click(function() {
        if (time) {
            $('.yzm_b').addClass('up');
            var l = 60;
            var timer = setInterval(function() {
                l--;
                $('.yzm_b').html(l + ' S');
                if (l <= 0) {
                    clearInterval(timer);
                    $('.yzm_b').html('获取验证码');
                    time = true;
                    $('.yzm_b').removeClass('up');
                }
            }, 1000);
            $('.yzm_b').html(l + ' S');
            time = false;
        }
    })
    var w = $(window).width();
    if (w < 1180) {
        w = 1180;
    }
    var l = $('.main_m li').length
    if (l > 1) {

        $('.main_m_nav').show();
        $(window).resize(function() {
            var l = $('.main_m li').length
            var w = $(window).width();
            if (w < 1180) {
                w = 1180;
            }
            $('.main_m li').width(w);
            $('.main_m ul').width(w * l);
        })


        var index = 1;
        var timer = null;

        var $nav = $('.main_m_nav .main_m_navli');
        var $view = $(".main_m");
        var $pipe = $(".main_m>ul");

        var $firstPipeItem = $(".main_m>ul>li").first();
        var $lastPipeItem = $(".main_m>ul>li").last();
        $firstPipeItem.clone(true).appendTo($pipe);
        $lastPipeItem.clone(true).prependTo($pipe);

        var $pipeItem = $(".main_m>ul>li");

        $('.main_m li').width(w);
        $('.main_m ul').width(w * $pipeItem.length);
        $('.main_m ul').css('left', -w)
        var imgWidth = w;

        function slide(i) {
            if (i === 0) {
                setNavFocus($nav.eq($pipeItem.length - 1));
            } else if (i === $pipeItem.length - 1) {
                setNavFocus($nav.eq(0));
            } else {
                setNavFocus($nav.eq(i - 1));
            }
            $pipe.animate({
                left: -i * imgWidth
            }, 500, function() {
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

        function setTimer() {
            timer = setInterval(function() {
                if (!$pipe.is(":animated")) {
                    slide(++index);
                }
            }, 6000);
        }
        setTimer();
    }
})
function login_one(){
    var user = $('.user').eq(0).val();
    var pass = $('.pass').eq(0).val();
    if(!user.length){
        $('.error').eq(0).html('用户名不能为空').removeClass('hide');
        return false;
    }
    if(user.length >25 || (/^\d$/.test(user))){
        $('.error').eq(0).html('用户名不正确').removeClass('hide');
        return false;
    }
    if(!pass.length){
        $('.error').eq(0).html('密码不能为空').removeClass('hide');
        return false;
    }
    if(pass.length >25 || (/^\d$/.test(user))){
        $('.error').eq(0).html('密码不正确').removeClass('hide');
        return false;
    }else{
        $('.error').eq(0).html('').addClass('hide');
    }

}
function login_two(){
    var user = $('.user').eq(1).val();
    var pass = $('.pass').eq(1).val();
    var yzm = $('.yzm').eq(0).val();
    if(!user.length){
        $('.error').eq(1).html('用户名不能为空').removeClass('hide');
        return false;
    }
    if(!(/^1[34578]\d{9}$/.test(user))){
        $('.error').eq(1).html('用户名不正确').removeClass('hide');
        return false;
    }
    if(!yzm.length){
        $('.error').eq(1).html('验证码不能为空').removeClass('hide');
        return false;
    }
    if(!(/^\d{4}$/.test(yzm))){
        $('.error').eq(1).html('验证码错误').removeClass('hide');
        return false;
    }
    if(!pass.length){
        $('.error').eq(1).html('密码不能为空').removeClass('hide');
        return false;
    }
    if(!(/^\d{4}$/.test(pass))){
        $('.error').eq(1).html('密码不正确').removeClass('hide');
        return false;
    }else{
        $('.error').eq(1).html('').addClass('hide');
    }

}
