//date:20160506 页面样式
$(function () {
    //页面头部抖动
    $("#ul img").each(function (k, img) {
        new JumpObj(img, 10);
        //第一个参数代表元素对象
        //第二个参数代表抖动幅度
    });

   

});
//滑动
function huadong(a, b, c, firstClassName, SecondClassName) {
    for (i = 1; i < 7; i++) {
        if (i == c) {
            document.getElementById(a + i).className = firstClassName; document.getElementById(b + i).className = "nav1";
        }
        else {
            document.getElementById(a + i).className = SecondClassName; document.getElementById(b + i).className = "nav2";
        }
    }
}
function display() {
    document.getElementById("box").style.display = "block";
}
function disappear() {
    document.getElementById("box").style.display = "none";
}
////////////////////////////////////////////////
$(document).ready(function ($) {

    $("#toplist").rollGallery({
        direction: "top",
        speed: 2000,
        showNum: 2
    });

    $("#leftlist").rollGallery({
        direction: "left",
        speed: 2000,
        showNum: 1
    });

    $("#fontlist").rollGallery({
        direction: "top",
        speed: 2000,
        showNum: 5
    });

});
///////////////////////////////////
$(function () {
    $('#menu ul li').each(function (i) {
        $(this).click(function () {
            $('#menu ul li').find('.onc').removeClass('onc');
            $('#menu ul li a').eq(i).addClass('onc').siblings().removeClass('onc');
        }
                         )
    })

    $(window).scroll(function () {
        $offset = $('.placeholder').offset(); //不能用自身的div，不然滚动起来会很卡
        if ($(window).scrollTop() > $offset.top) {
            $('#menu').css({ 'position': 'fixed', 'top': '0px', 'left': $offset.left + 'px', 'z-index': '1' });
            $(".cent").css({ "margin-bottom": "36px" });
        } else {
            $('#menu').removeAttr('style');
            $('.cent').removeAttr('style');
        }
    });

});
///////////////////////////////////////
$(function () {

    jsUtil.initFloatRightPosition("float_right");
    $(window).scroll(function () { jsUtil.ctrlFloatShowOrHide("float_right", 400); }).resize(function () { jsUtil.initFloatRightPosition("float_right"); });

});
$(document).ready(function () {
    $(".accordion").accordion();
});