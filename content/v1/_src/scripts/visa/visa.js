var globalCitySelect = null;
$(function () {
    _uzw.ui.tab('j_areaTab');
    _uzw.ui.tab('j_materialTab');
    uzLazy('visa-box');
    visaSlides();
    visaFixedNav();
    // visaFixedSide();
    visaSide();
    askPop();
    cityControl();
    if (typeof (comGlobalCity) != 'undefined') {
        comGlobalCity();
    }
    if (_util.check.isIE6) { // fix ie6 background image cache
        document.execCommand("BackgroundImageCache", false, true);
    }
});

function visaSlides() {
    var mbSlides = $('#j_mainBannerSlides');
    if (mbSlides.get(0)) {
        mbSlides.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            fadeSpeed: 300,
            effect: 'fade',
            crossfade: true,
            hoverPause: false,
            pause: 1000,
            play: 6000,
            generatePagination: false,
            slidesLoaded: function() {
                var ow = screen.width,
                    oImg = mbSlides.find('.slide-item').find('img');
                if (ow <= 1152) {
                    oImg.css({
                        'position': 'absolute',
                        'left': -95
                    });
                }
                //bind click event
                mbSlides.find('.pagination').find('li').on('mouseenter', function () {
                    var o = $(this);
                    o.find('a').click();
                });
            }
        });
    }
}

function visaFixedNav() {
    var vi = $('#j_visaInfos');
    var box = vi.find('.nav-list');
    if (!box.get(0)) {
        return;
    }
    var bh = box.height();
    var oWrap = vi.find('.nav-wrap');
    var items = vi.find('.infos-item');

    box.width(oWrap.width());

    $(window).scroll(function () {
        unitScroll();
    });

    var unitScroll = function () {
        var w = $(window);
        var st = w.scrollTop();
        var ot = oWrap.offset().top;
        if (st >= ot) {
            if (_util.check.isIE6) { //!window.XMLHttpRequest
                box.css({ 'top': st, 'position': 'absolute' });
            } else {
                box.css({ 'top': 0, 'position': 'fixed' });
            }
            unitCheck(st);
        } else {
            box.css({ 'position': 'static' });
        }
    };

    var unitCheck = function (st) {
        items.each(function (k, v) {
            var o = $(this);
            var oot = o.offset().top;
            if (st > oot - bh - 1) {
                box.find('li').removeClass('on');
                box.find('li').eq(k).addClass('on');
                return true;
            }
        });
    };

    var unitSkip = function () {
        box.find('li').on('click', function () {
            var oli = $(this);
            var oindex = oli.index();

            var skipNode = items.eq(oindex);
            var oot = skipNode.offset().top;
            $('body,html').animate({ scrollTop: oot - bh }, 800);
        });
    };

    unitSkip();
    unitScroll();
}

function visaFixedSide() {
    var box = $('#j_sideMerit');
    if (box.get(0)) {
        var bh = box.outerHeight();
        var bw = box.width();
        var oWrap = box.parent('.side');

        box.width(bw);

        $(window).scroll(function () {
            unitScroll();
        });

        var unitScroll = function () {
            var w = $(window);
            var st = w.scrollTop();
            var ot = oWrap.offset().top;
            var iEnd = $('.global-footer').offset().top - bh - 50;

            if (st >= ot && st < iEnd) {
                if (_util.check.isIE6) { //!window.XMLHttpRequest
                    box.css({ 'top': st, 'position': 'absolute' });
                } else {
                    box.css({ 'top': 0, 'position': 'fixed' });
                }
            } else if (st >= iEnd) {
                box.css({
                    'position': 'absolute',
                    'top': iEnd
                });
            } else {
                box.css({ 'position': 'static' });
            }
        };
        unitScroll();
    }
}

function askPop() {
    //点击咨询
    $('#j_btnConsult_new').on('click', function () {
        //显示咨询输入层
        $('.consult-box .pop-problem').show();
        //隐藏按钮
        $('.pop-problem .pop-btn').find('.d2').unbind('click'); //避免重复绑定
        $('.pop-problem .pop-btn').find('.d2').on('click', function () {
            $('.consult-box .pop-problem').hide();
            //清空表单
            $('#askCont').val('');
            $('#phone').val('');
            $('#email').val('');
            $(".error-info").text('');
        });
        $('.pop-problem .pop-btn .d1').find('.btn-txt1').unbind('click'); //避免重复绑定
        $('.pop-problem .pop-btn .d1').find('.btn-txt1').on('click', function () {
            productFeedBack();
        });
    });
    //快速登录
    $('.consult-box .consult-p .login').on('click', function () {
        document.domain = "uzai.com";
        _uzw.iframe.pop('//u.uzai.com//QuickLoginV1');
    });

    $('.consult-list .item-bd .sela').find('a').on('click', function () {
        var e = $(this);
        var ctext = e.html();
        var celem = $(e).parent().parent().find('div');
        if(ctext == "查看完整回复"){
            $(e).html("收起");
            celem.eq(0).hide();
            celem.eq(1).show();
        }else{
            $(e).html("查看完整回复");
            celem.eq(1).hide();
            celem.eq(0).show();
        }
    });

    //根据用户登录状态判断是否显示提示
    if(_uzw.user.userid)
        $('.consult-box .consult-p span').remove();
}

//弹出框
function popMod(obj, xAxis) {

    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    var pop = o.parent();

    pop.children('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-close').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).on("scroll", function () {
        fixIe6(obj, xAxis);
    });
}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    if (_util.check.isIE6) {
        o.css("top", $(document).scrollTop() + xAxis);
    }
}

function cityControl() {

    var ocityNode = $('#j_jpCityListNode');

    $('input[data-cities-trigger]').on('focus', function () {
        var o = $(this);
        var on = o.next('input[type=hidden]');

        $('.cities-select-mod').hide();
        $('#j_jpAllCityFilter').remove();

        var op = o.parent('.cities-select-wrap');
        var ocity = o.siblings('.cities-select-mod');

        ocity.after('<ul class="hide city-filter-mod" id="j_jpAllCityFilter"></ul>');
        globalCitySelect = $('#j_jpAllCityFilter');

        var ocityInnerNode = ocity.find('.cities-select-tab');

        if (!ocityInnerNode.get(0)) {
            ocity.html(ocityNode.html());
            _uzw.ui.tab('cities-select-tab');
            ocity.find('.select-item').on('click', function () {
                var oo = $(this);
                var oot = oo.text();
                var ooc = oo.attr('data-code');
                o.val(oot);
                on.val(ooc);
                ocity.hide();
                op.css({ 'z-index': 'auto' });
            });
        }

        ocity.show();
        op.css({ 'z-index': 10 });

        blankFix('cities-select-wrap', 'cities-select-mod', function () {
            op.css({ 'z-index': 'auto' });
            //将城市列表第一个选项填充进input
            globalCitySelect.find('li').not('.li-none').eq(0).click();
            globalCitySelect.remove();
        });
        ocity.find('.close-wrap').on('click', function () {
            ocity.hide();
            op.css({ 'z-index': 'auto' });
        });

    });
}

function visaSide() {
    var hotTravel = $('.side-hot-travel');
    hotTravel.on('mouseover', '.hot-item', function() {
        var oThis = $(this);
        oThis.addClass('on').siblings().removeClass('on');
    });
}

//检验留言
function checkMsgValidate() {

    var o1 = $.trim($('#phone').val()); //手机
    var o2 = $.trim($('#askCont').val()); //留言内容
    var o3 = $.trim($('#email').val()); //邮箱

    var regexMobile = /^13[0-9]{1}[0-9]{8}$|^15[9]{1}[0-9]{8}$|^1[3,5]{1}[0-9]{1}[0-9]{8}$|^18[0-9][0-9]{8}$/; //手机
    var regexEmail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; //邮箱
    if (o2.length < 1) {
        $(".error-info").text("(*)请输入留言内容");
        return false;
    } else if (o2.length > 200) {
        $(".error-info").html("(*)最多输入200个字");
        return false;
    }
    if (o1.length < 1) {
        $(".error-info").text("(*)请输入手机号");
        return false;
    }
    if (!regexMobile.test(o1)) {
        $(".error-info").text("(*)请输入正确的手机号");
        return false;
    }
    if (o3.length > 0 && !regexEmail.test(o3)) {
        $(".error-info").text("(*)请输入正确的邮箱");
        return false;
    }
    return true;

}

function productFeedBack() {
    var o1 = $.trim($('#phone').val()); //手机
    var o2 = $.trim($('#askCont').val()); //留言内容
    var o3 = $.trim($('#email').val()); //邮箱
    var place = $("#place").val(); //产品名称
    var pcode = $("#pcode").val(); //产品id
    var url = document.location; //产品URL
    var uname = $("#userName").val(); //用户名

    if (checkMsgValidate()) {
        $(".error-info").text('');
        $(".pop-problem .pop-btn .d1 .btn-mask").show(); //不可点击

        $.ajax({
            type: "get",
            data: "json",
            url: "ashx/ashx0011.ashx?phone=" + encodeURI(o1) + "&content=" + encodeURI(o2) + "&email=" + encodeURI(o3) + "&place=" + encodeURI(place) + "&pcode=" + encodeURI(pcode) + "&url=" + encodeURI(url) + "&uname=" + encodeURI(uname) + "&rad=" + Math.random(),
            success: function (msg) {
                if (msg == "success") {
                    if(_uzw.user.userid)
                        alert("尊敬的客人，我们将尽快给您回复，您可以登录悠哉，进入“我的悠哉“中的”我的咨询“中查看回复结果，感谢您对悠哉的关注。");
                    else
                        alert("尊敬的客人，您的咨询问题我们已经收到，我们将尽快给您回复，感谢您对悠哉的关注。 ");
                    $('.pop-problem .pop-btn').find('.d2').click();
                }
                else if (msg == "much") {
                    alert("您的留言过于频繁，请稍后再试");
                }
                else {
                    alert("留言失败，请重试！");
                }
                $(".pop-problem .pop-btn .p1 .btn-mask").hide();
            },
            error: function () {
                alert("留言失败，请重试！");
                $(".pop-problem .pop-btn .p1 .btn-mask").hide();
            }

        });
    }
}

function selectit2(o, num) {
    $(".consult-box ul").css("display", "none");
    $("#Advisory" + num).css("display", "block");

    $(".fn-pager a").css("background-color", "#FFFFFF");
    $(".fn-pager a").css("color", "#333333");

    $(o).css("background-color", "rgb(231, 231, 231)");
    $(o).css("color", "rgb(51, 51, 51)");
}