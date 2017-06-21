define(function (require, exports, module) {
    exports.init = function () {
        cpRenderNum();
        cpChoose();
    }
});

function cpChoose() {
    $('.box-red span').on('click', function () {
        var o = $(this);
        if (o.hasClass('on')) {
            o.removeClass('on');
        } else {
            var bsize = $('.box-red').find('.on').size();
            var o = $(this);
            if (bsize <= 5) {
                o.addClass('on');
            }
        }
    });

    $('.box-blue span').on('click', function () {
        var o = $(this);
        o.addClass('on');
        o.siblings().removeClass('on');
    });

    $('.cp-random').on("click", function () {
        cpRenderNum();
    });
}

function renderNum(count, maxs, mins) {
    var array = [];
    while (array.length < count) {
        var temp = renderNumSingle(maxs, mins);
        if (!renderNumSearch(array, temp)) {
            array.push(temp);
        }
    }
    return array;
}


function renderNumSingle(maxs, mins) {  //随机生成maxs到mins之间的数
    return Math.round(Math.random() * (maxs - mins)) + mins;
}
function renderNumSearch(array, num) {   //array是否重复的数
    for (var i = 0; i < array.length; i++) {
        if (array[i] == num) {
            return true;
        }
    }
    return false;
}

function cpRenderNum() {
    var arrRed = renderNum(6, 33, 1);
    var arrBlue = renderNum(1, 16, 1);

    var redlist = $('.box-red').find('.dd').find('span');
    var bluelist = $('.box-blue').find('.dd').find('span');

    redlist.removeClass('on');
    bluelist.removeClass('on');

    for (var i = 0; i < arrRed.length; i++) {
        var item = arrRed[i] - 1;
        redlist.eq(item).addClass('on');
    }

    for (var i = 0; i < arrBlue.length; i++) {
        var item = arrBlue[i] - 1;
        bluelist.eq(item).addClass('on');
    }
}



function cpFail() {
    $('.cp-error-mask').show();
    $('.cp-error').show();

    $('.cp-error').find('.cp-close').on('click', function () {
        $('.cp-error-mask').hide();
        $('.cp-error').hide();
    });
}

function cpSubmit() {
    var flag = true;

    if ($(".box-red span.on").size() < 6) {
        flag = false;
        _uzm.pop.toast("请选择6个红球！");
    }

    if (flag && $(".box-blue span.on").size() == 0) {
        flag = false;
        _uzm.pop.toast("请选择蓝球！");
    }

    if (flag) {
        $.ajax({
            url: "/ashx/GetHandsel.ashx",
            type: "GET",
            async: false,
            cache: false,
            success: function (msg) {
                if (msg == "1")
                    flag = true;
                else {
                    cpFail();
                    _gaq.push(['_trackEvent', 'activity', 'click_fail', 'cp1']);
                    flag = false;
                }
            }
        });
    }
    return flag;
}

$(function () {
    $(".cp-submit").bind("click", function () {
        $("#hidden_RedNum").val("");
        $("#hidden_BlueNum").val("");
        $(".box-red span.on").each(function () {
            $("#hidden_RedNum").val($("#hidden_RedNum").val() + "," + $(this).html());
        });
        $(".box-blue span.on").each(function () {
            $("#hidden_BlueNum").val($("#hidden_BlueNum").val() + "," + $(this).html());
        });
    });

    $("#btn_Cofrim").click(function () {
        $(".cp-ok").show();
        $(".cp-ok-mask").show();
        $("#label_zfb").text($("#zfb").val());
    });

});

function cpSureSubmit() {
    var flag = false;
    $.ajax({
        url: "/ashx/GetHandsel.ashx?uID=" + $("#UserID").val() + "&checkZFB=" + $("#zfb").val(),
        type: "GET",
        async: false,
        cache: false,
        success: function (msg) {
            if (msg == "1")
                flag = true;
            else if (msg == "0") {
                $("#info").html('今天的彩票已经领取完毕！');
                cpFail();
                flag = false;
                $('.cp-ok').hide(); $('.cp-ok-mask').hide();
            }
            else if (msg == "-1") {
                $("#info").html("支付宝重复，请重新输入！");
                cpFail();
                flag = false;
                $('.cp-ok').hide(); $('.cp-ok-mask').hide();
            }
        }
    });
    if (flag && $("#zfb").val() == "") {
        flag = false;
        $("#info").html('请输入正确支付宝账号！');
        cpFail();
        _gaq.push(['_trackEvent', 'activity', 'click_fail', 'cp2']);
    }
    return flag;
}