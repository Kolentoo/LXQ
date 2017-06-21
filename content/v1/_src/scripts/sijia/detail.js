$(function() {
    uzLazy(['album-mod', 'line-pic', 'j_routePhotoList', 'viewed-list']);
    getProductPrice(); //获取产品起价
    sjCloneTemplate();
    detailTab('j_jobTypeTab');
    navFix();
    lightspotNav();
    routeNav();
    routeSum();
    detailPop();
    detailSlides();
    imgPreview($('.slides_container'), 'data-original');
});

function sjCloneTemplate() {
    var finish = $('#j_popFinish').html();
    $('body').append('<div id="j_popFinishClone">' + finish + '</div>');

    var prompt = $('#j_popPrompt').html();
    $('body').append('<div id="j_popPromptClone">' + prompt + '</div>');

    var hotel = $('#j_popHotelIntro').html();
    $('body').append('<div id="j_popHotelIntroClone">' + hotel + '</div>');

    var album = $('#j_popHotelAlbum').html();
    $('body').append('<div id="j_popHotelAlbumClone">' + album + '</div>');
}


function detailTab(obj) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    o.find('.bd').find('.item').eq(0).show();
    o.find('.hd').on('click', 'li', function() {
        var oThis = $(this);
        var oIndex = oThis.index();
        oThis.addClass('on').siblings().removeClass('on');
        oThis.parent('.hd').next('.bd').find('.item').hide().eq(oIndex).show();
    });
}


function navFix() {
    var box = $('#j_products');
    var bar = $('#j_sjProeuctNav');
    var pbar = box.find('.product-sidebar').find('ul'); //print bar
    var barH = bar.outerHeight();
    var btnOrder = bar.find('.btn-order');

    var endPoint = $('#pdtbtnbar').offset().top - barH - pbar.height();

    var mods = box.find('.product-item-tag');
    var initTop = bar.offset().top;

    bar.find('li').on('click', 'a', function() {
        var o = $(this);
        var op = o.parent();
        var index = op.index();

        var oo = mods.eq(index);
        var ooTop = oo.offset().top;

        $('body,html').animate({
            scrollTop: ooTop - barH + 5
        }, 800);

    });

    var _fixColor = function(index) {
        var lis = bar.find('li');
        lis.removeClass('on');
        lis.eq(index).addClass('on');
    };

    var _unitScroll = function() {
        var o = $(window);
        var st = o.scrollTop();
        if (st >= initTop) {
            if (_util.check.isIE6) {
                bar.css({ 'position': 'absolute', 'top': st });
                pbar.css({ 'position': 'absolute', 'top': st + barH });
            } else {
                bar.css({ 'position': 'fixed', 'top': '0' });
                pbar.css({ 'position': 'fixed', 'top': barH });
            }
            btnOrder.css({ 'display': 'block' });
        } else {
            bar.css({ 'position': 'static', 'top': 'auto' });
            pbar.css({ 'position': 'static', 'top': 'auto' });
            btnOrder.css({ 'display': 'none' });
        }

        if (st > endPoint) {
            bar.css({ 'position': 'absolute', 'top': endPoint });
            pbar.css({ 'position': 'absolute', 'top': endPoint + barH });
        }

        mods.each(function(k, v) {
            var oo = $(this);
            var ooTop = oo.offset().top;
            if (ooTop - barH <= st) {
                _fixColor(k);
            }
        });
    };

    $(window).scroll(function() {
        _unitScroll();
    });

    _unitScroll();
}

function lightspotNav() {
    var box = $('#j_brightSpot');
    var nav = $('#j_detailEntry');
    var slideH = nav.find('ul').height();
    var proNav = $('#j_sjProeuctNav');
    var navH = proNav.outerHeight();

    var mods = box.find('.bs-item');
    var initTop = box.offset().top;

    nav.find('li').on('click', function() {
        var o = $(this);
        var index = o.index();

        var oo = mods.eq(index);
        var ooTop = oo.offset().top;

        $('body,html').animate({
            scrollTop: ooTop - navH + 10
        }, 800);

    });
}

function routeNav() {
    var box = $('#j_productRouting');
    var bar = $('#j_routeNav');
    var sideH = bar.height();
    var proNav = $('#j_sjProeuctNav');
    var navH = proNav.outerHeight();

    var mods = box.find('.listing-item');
    var initTop = bar.offset().top - navH - 10;
    var endPoint = box.next('.product-item-tag').offset().top - sideH - navH - 30;
    var liOH = bar.find('li').outerHeight(true);

    bar.find('li').on('click', function() {
        var o = $(this);
        var index = o.index();

        var oo = mods.eq(index);
        var ooTop = oo.offset().top;

        $('body,html').animate({
            scrollTop: ooTop - navH - liOH * index - 16
        }, 800);

    });

    var _fixColor = function(index) {
        var lis = bar.find('li');
        lis.removeClass('on');
        lis.eq(index).addClass('on');
    };

    var _unitScroll = function() {
        var o = $(window);
        var st = o.scrollTop();
        if (st >= initTop && st <= endPoint) {
            if (_util.check.isIE6) {
                bar.css({ 'position': 'absolute', 'top': st + navH + 10 });
            } else {
                bar.css({ 'position': 'fixed', 'top': navH + 10 });
            }
            mods.each(function(k, v) {
                var oo = $(this);
                var ooTop = oo.offset().top;
                if (ooTop - navH - liOH * k - 17 <= st) {
                    _fixColor(k);
                }
            });

        } else if (st > endPoint) {
            bar.css({ 'position': 'absolute', 'top': endPoint + navH });
        } else {
            bar.css({ 'position': 'static', 'top': 'auto' });
        }
    };

    $(window).scroll(function() {
        _unitScroll();
    });

    _unitScroll();

}

function routeSum() {
    var obj = $('#j_overviewMain');
    var objUl = obj.find('.routing-list');
    var height = objUl.find('li').eq(0).outerHeight();
    var objheight = obj.innerHeight();
    var fixheight = 200; //可视窗高度
    var maxmarginpx = objheight - fixheight;
    var _scroll = function(direction) {
        objUl.stop();
        var Hotnews = function() {
            var mt = objUl.css('margin-top').replace('px', '');
            mt = Number(mt) | 0;
            if (Math.abs(mt) > maxmarginpx && direction == 'next') {
                return false;
            } else if (mt > 0 && direction == 'prev') {
                return false;
            } else {
                objUl.stop().animate({
                    marginTop: (direction == 'next' ? '-=' : '+=') + height + 'px'
                }, 250, function () {
                });
            }
        };
        return Hotnews();
    };

    obj.find('.next').on('click', function() {
        _scroll('next');
    });

    obj.find('.prev').on('click', function() {
        _scroll('prev');
    });


}

function detailPop() {

    var box = $('#j_routingMainBd');

    // $('#j_infoMain').find('.btn-order').on('click', function () {
    //     $('#j_sjProeuctNav').find('.btn-order').click();
    //     return false;
    // });

    //弹出日历
    //    $('#j_sjProeuctNav').find('.btn-order').on('click', function () {
    $('#j_sjProeuctNav').on('click', '.btn-order', function() {
        var box = $('#j_popHotelCalendarBox');
        var cfg = {
            jsonpUrl: '',
            extCallBack: function(year, month) { //扩展方法
                //trigger
                var items = box.find('.item');
                items.on('click', function() {
                    var o = $(this);
                    var od = o.find('.day');
                    var day = o.attr('data-year') + '-' + o.attr('data-month') + '-' + o.attr('data-day');

                    var dt = new Date();
                    var ny = dt.getFullYear();
                    var nm = dt.getMonth() + 1;
                    var nd = dt.getDate();
                    var tday = ny + '-' + nm + '-' + nd;

                    var spanDay = new Date(day).getTime(); //当前选中日期
                    var spanToDay = new Date(tday).getTime();

                    if (spanDay < spanToDay) {
                        //无效日期
                        return;
                    }

                    items.removeClass('item-on');
                    o.addClass('item-on');

                    popMod('j_popInfoWrite', 5);
                    var vldimgobj = $("#txtValidator").parents("li").find("img");
                    if (vldimgobj) {
                        vldimgobj.attr("src", _uzw.domain.buy + "/FamilyTravel/CreateValidateCode?" + Math.random());
                    }
                    $("#txtOdGoDate").val(day);
                    $("#txtDate").val(day);

                    var uzValidator = new UZValidator();
                    var idItems = [];
                    idItems.push({ id: "txtAdult", showName: "成人数", dataType: DataType.Number, minValue: 1 });
                    //idItems.push({ id: "txtChild", showName: "儿童数", dataType: DataType.Number, minValue: 0 });
                    idItems.push({ id: "txtOrderUserName", showName: "姓名", dataType: DataType.String, maxLength: 20 });
                    idItems.push({ id: "txtPhone", showName: "手机", dataType: DataType.Mobile });
                    //idItems.push({ id: "txtEmail", showName: "电子邮箱", dataType: DataType.Email });
                    uzValidator.init(idItems, null, PromptModel.DefaultAlert);

                    var isOrderSubmit = false;
                    var submitorder = function() {
                        //                        if (isOrderSubmit) {
                        //                            return;
                        //                        }
                        isOrderSubmit = true;
                        //必填判断
                        if (uzValidator.validate()) {
                            var adultCount = Number($("#txtAdult").val().trim()) | 0;
                            var childCount = Number($("#txtChild").val().trim()) | 0;
                            var pid = Number($("#txtOdProductID").val().trim()) | 0;
                            var orderUserName = $("#txtOrderUserName").val().trim();
                            var mobile = $("#txtPhone").val().trim();
                            var email = $("#txtEmail").val().trim();
                            var otherrq = $("#txtOtherRequire").val().trim();
                            var vldCode = $("#txtValidator").val().trim();
                            if (pid <= 0) {
                                alert("未知产品");
                                return;
                            }
                            if ($("#txtChild").val().trim()) {
                                if (!checkNumber($("#txtChild").val().trim())) {
                                    alert("儿童人数格式不正确");
                                    return;
                                }
                            }
                            if (adultCount < 1) {
                                alert("必须有一个成人才可出行");
                                return;
                            }
                            if (email.trim()) {
                                if (!checkEmail(email)) {
                                    alert("电子邮箱格式不正确");
                                    return;
                                }
                            }
                            if (!$.trim(vldCode)) {
                                alert("请输入验证码");
                                return;
                            }
                            if (otherrq.length > 100) {
                                alert("其他需求不能超过100字，具体需求客服会再次和您确认");
                                return;
                            }
                            $("#btnSubmitOrder").parent().addClass("preload");
                            $("#btnSubmitOrder").hide();
                            var isExcOk = false;
                            var data = "vldCode=" + vldCode + "&adultCount=" + adultCount + "&childCount=" + childCount + "&orderUserName=" + encodeURIComponent(encodeURIComponent(orderUserName)) + "&mobile=" + mobile + "&email=" + encodeURIComponent(encodeURIComponent(email)) + "&pid=" + pid + "&goDate=" + day + "&otherrq=" + encodeURIComponent(encodeURIComponent(otherrq));
                            $.ajax({
                                type: "GET",
                                dataType: 'jsonp',
                                url: _uzw.domain.buy + "/FamilyTravel/SubmitIntendOrder",
                                data: data,
                                jsonp: "callback",
                                jsonpCallback: "callback",
                                success: function(resp) {
                                    //刷新验证码
                                    $("#imgvdt").click();
                                    var title = "提交失败!";
                                    var errorCode = resp.result;
                                    var content = "";
                                    if (resp && resp.result) {
                                        if (errorCode == "success") {
                                            isExcOk = true;
                                            title = "提交成功!";
                                            content = "<p>您已成功提交预订信息，旅游管家会在1个工作小时内联系您，请您保持手机畅通。</p>";
                                        }
                                        else if (errorCode == "yi_error") {
                                            content = "<p>Sorry，您下单失败，如果客服妹子没有翘班的话，会和您联系的哟！</p>";
                                        }
                                        else if (errorCode == "phonechongfu") {
                                            content = "<p>Sorry，您已被系统拉黑了，禁止下单</p>";
                                        }
                                        else if (errorCode == "productdisabled") {
                                            content = "<p>Sorry，产品已经失效，不可下单，看看其他产品吧！</p>";
                                        }
                                        else if (errorCode == "exception") {
                                            content = "<p>Sorry，您下单失败，如果客服妹子没有翘班的话，会和您联系的哟！</p>";
                                        }
                                        else if (errorCode == "peoplecounterror") {
                                            content = "<p>Sorry，必须有一个成人才可出行！</p>";
                                        }
                                        else if (errorCode == "validatecodeerror") {
                                            content = "<p>Sorry，您输入的验证码错误！</p>";
                                        }
                                        else if (errorCode == "producttypeerror") {
                                            content = "<p>Sorry，非私家团产品不可在此下单！</p>";
                                        }
                                        else if (errorCode == "validateparamerror") {
                                            content = "<p>Sorry，请检查您提交的数据格式（如：手机号）是否正确！</p>";
                                        }
                                    } else {
                                        title = "提交成功!";
                                        content = "";
                                    }
                                    if (!isExcOk) {
                                        var promptinfotmplthtml = $("#j_popPromptClone").html();
                                        promptinfotmplthtml = promptinfotmplthtml.replace("@{title}", title);
                                        promptinfotmplthtml = promptinfotmplthtml.replace("@{content}", content);
                                        $("#j_popPrompt").html(promptinfotmplthtml);
                                        $("#j_popInfoWrite").parents(".pop-mod").show();
                                        $("#j_popPrompt").parents(".pop-mod").show();
                                        $("#j_popPrompt").find('.pop-close').on('click', function() {
                                            var o = $(this);
                                            o.parents(".pop-mod").hide();
                                        });
                                        //popMod('j_popInfoWrite', 5);
                                        //popMod('j_popPrompt', 5);
                                    } else {
                                        var popfinishHtml = $("#j_popFinishClone").html();
                                        popfinishHtml = popfinishHtml.replace("@{title}", title);
                                        popfinishHtml = popfinishHtml.replace("@{content}", content);
                                        $("#j_popFinish").html(popfinishHtml);
                                        popMod('j_popFinish', 5); //弹框
                                    }
                                    isOrderSubmit = false;
                                    //                                    $("#btnSubmitOrder").on("click", submitorder);
                                    //$("#btnSubmitOrder").on("click", function () { alert(12); });
                                    $("#btnSubmitOrder").parent().removeClass("preload");
                                    $("#btnSubmitOrder").show();
                                },
                                error: function(a, b, c) {
                                    //刷新验证码
                                    $("#imgvdt").click();
                                    var title = "提交失败!";
                                    var content = "悠哉君不知道怎么了，请稍后再试!";
                                    var promptinfotmplthtml = $("#j_popPromptClone").html();
                                    promptinfotmplthtml = promptinfotmplthtml.replace("@{title}", title);
                                    promptinfotmplthtml = promptinfotmplthtml.replace("@{content}", content);
                                    $("#j_popPrompt").html("");
                                    $("#j_popPrompt").html(promptinfotmplthtml);
                                    $("#j_popInfoWrite").parents(".pop-mod").show();
                                    $("#j_popPrompt").parents(".pop-mod").show();
                                    $("#j_popPrompt").find('.pop-close').on('click', function() {
                                        var o = $(this);
                                        o.parents(".pop-mod").hide();
                                    });
                                    //                                    popMod('j_popInfoWrite', 5);
                                    //                                    popMod('j_popPrompt', 5);
                                    isOrderSubmit = false;
                                    //                                    $("#btnSubmitOrder").on("click", submitorder);
                                    //$("#btnSubmitOrder").on("click", function () { alert(13); });
                                    $("#btnSubmitOrder").parent().removeClass("preload");
                                    $("#btnSubmitOrder").show();
                                },
                                complete: function() {
                                    $("#imgvdt").click();
                                    $("#btnSubmitOrder").parent().removeClass("preload");
                                    $("#btnSubmitOrder").show();
                                }
                            });
                        } else {
                            isOrderSubmit = false;
                            //                            $("#btnSubmitOrder").on("click", submitorder);
                            //$("#btnSubmitOrder").on("click", function () { alert(14); });
                            $("#btnSubmitOrder").parent().removeClass("preload");
                            $("#btnSubmitOrder").show();
                            return;
                        }
                    };
                    //提交订单
                    document.getElementById("btnSubmitOrder").onclick = function() {
                        submitorder();
                    };
                    //$("#btnSubmitOrder").click(function () { submitorder(); });
                });
            },
            preCallback: function(year, month) { //回调方法

            }
        };

        if (box.get(0)) {
            box.jsonCalendar(cfg);
        }

        popMod('j_popHotelCalendar', 5);

        return false;
    });

    //返回日历
    $('#j_popInfoWrite').find('.return-calendar').on('click', function() {
        popMod('j_popHotelCalendar', 5);
    });


    var _amapObj; //酒店地图公用对象
    //酒店信息
    box.find('.listing-item-cont').find('.hotel-link').on('click', function() {
        //先让酒店信息框弹出来，再加载数据
        $("#j_popHotelIntro").removeClass("hotel-intro-nobg");
        $("#j_popHotelIntro .intro-box .hotel-hd").hide();
        $("#j_popHotelIntro .intro-box .tab .bd").hide();
        popMod('j_popHotelIntro', 5);

        var o = $(this);
        var index = o.index();
        var hotelID = Number($.trim(o.attr("hotelID"))) | 0;
        var hoteldetailspop = $("#j_popHotelIntro");
        var hoteldetailstmpt = $('#j_popHotelIntroClone').html();

        var hotelAlbumpop = $("#j_popHotelAlbum");
        var hotelAlbumtmpt = $("#j_popHotelAlbumClone").html();
        //ajax 载入酒店信息
        if (hotelID > 0) {
            $.ajax({
                type: "GET",
                url: "/GetHotelDetails/" + hotelID,
                success: function(resp) {
                    var hotelDetail = null;
                    try {
                        hotelDetail = eval("(" + resp + ")");
                    } catch (ex) {
                    }
                    if (hotelDetail) {
                        var hname = "";
                        var hintro = "";
                        var fwss = "";
                        var address = "";
                        var hotelWebUrl = "";
                        var hotelWebUrlShowName = "";
                        var himghtml = "";
                        var halbumimghtml = "";
                        var firstHotelImgUrl = "";
                        var firstHotelImgName = "";
                        var hotellng = ""; //经度
                        var hotellat = "";
                        var ImgCount = 0;
                        if (hotelDetail.hname) {
                            hname = hotelDetail.hname;
                        }
                        if (hotelDetail.hsynopsis) {
                            hintro = hotelDetail.hsynopsis;
                        }
                        if (hotelDetail.fwss && $.trim(hotelDetail.fwss)) {
                            var fwssarr = hotelDetail.fwss.split(',');
                            if (fwssarr && fwssarr.length) {
                                for (var i = 0; i < fwssarr.length; i++) {
                                    fwss += "<span class='facility-item'><i>√</i>" + fwssarr[i] + "</span>";
                                }
                            }
                        }
                        if (hotelDetail.address) {
                            address = hotelDetail.address;
                        }
                        if (hotelDetail.url) {
                            hotelWebUrl = hotelDetail.url;
                            if ($.trim(hotelWebUrl)) {
                                hotelWebUrlShowName = "官网";
                            }
                        }
                        if (hotelDetail.jd) {
                            hotellat = hotelDetail.jd; //经纬度需要调换顺序
                        }
                        if (hotelDetail.wd) {
                            hotellng = hotelDetail.wd;
                        }
                        if (hotelDetail.HotelPic && hotelDetail.HotelPic.HotelImgList.length) {
                            ImgCount = hotelDetail.HotelPic.HotelImgList.length;
                            var firstImg = hotelDetail.HotelPic.HotelImgList[0];
                            firstHotelImgUrl = firstImg.ImageUrl;
                            firstHotelImgName = firstImg.ImageName;
                            var k = 0;
                            for (var j = 0; j < hotelDetail.HotelPic.HotelImgList.length; j++) {
                                if (k > 0 && k <= 6) {
                                    himghtml += "<dd class='fl'><a href='#'><img alt='" + hotelDetail.HotelPic.HotelImgList[j].ImageName + "' src='" + hotelDetail.HotelPic.HotelImgList[j].ImageUrl + "'></a></dd>";
                                }
                                halbumimghtml += "<div class='item'><img alt='' src='" + hotelDetail.HotelPic.HotelImgList[j].ImageUrl + "'><p class='txt f14'>" + hotelDetail.HotelPic.HotelImgList[j].ImageName + "</p></div>";
                                k++;
                            }
                        }
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{HotelName\}/g, hname);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{FirstImgUrl\}/g, firstHotelImgUrl);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{FirstImgName\}/g, firstHotelImgName);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{ImgCount\}/g, ImgCount);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{HotelIntroduction\}/g, hintro);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{HotelService\}/g, fwss);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{HotelWebUrl\}/g, hotelWebUrl);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{HotelWebUrlShowName\}/g, hotelWebUrlShowName);
                        hoteldetailstmpt = hoteldetailstmpt.replace(/\{HotelImgList\}/g, himghtml);
                        //                        hoteldetailstmpt = hoteldetailstmpt.replace("{dest}", hotellgt + "," + hotellnt);
                        //                        hoteldetailstmpt = hoteldetailstmpt.replace("{destName}", encodeURIComponent(hname));
                        hoteldetailspop.html(hoteldetailstmpt);

                        hotelAlbumtmpt = hotelAlbumtmpt.replace(/\{HotelName\}/g, hname);
                        hotelAlbumtmpt = hotelAlbumtmpt.replace(/\{HotelWebUrl\}/g, hotelWebUrl);
                        hotelAlbumtmpt = hotelAlbumtmpt.replace(/\{HotelWebUrlShowName\}/g, hotelWebUrlShowName);
                        hotelAlbumtmpt = hotelAlbumtmpt.replace(/\{HotelImgList\}/g, halbumimghtml);
                        hotelAlbumpop.html(hotelAlbumtmpt);

                        /*******酒店图片浏览 Start**************/

                        //ajax 载入图片

                        //处理图片数量
                        var num = $('#j_popHotelAlbum').find('.album-slides').find('.item').length;
                        var numInfo = $('#j_popHotelAlbum').find('.album-num-info');
                        var numC = numInfo.find('em');
                        var numA = numInfo.find('i');
                        numA.text(num);

                        //图片滚动
                        $('.album-slides').slides({
                            preload: true,
                            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
                            currentClass: 'on',
                            effect: 'slide',
                            slideSpeed: 500,
                            hoverPause: false,
                            pause: 3000,
                            play: 0,
                            generatePagination: false,
                            animationComplete: function(current) {
                                numC.text(current);
                            }
                        });


                        //图片浏览
                        $('#j_popHotelIntro').find('.hotel-album').find('img').on('click', function() {
                            var o = $(this);
                            popMod('j_popHotelAlbum', 5);
                            $('#j_popHotelAlbum').find('.icon-sijia').show();
                            $('.toolbar').find('prev').show();
                            return false;

                        });



                        //返回酒店
                        $('#j_popHotelAlbum').find('.toolbar').find('.back').on('click', function() {
                            popMod('j_popHotelIntro', 5);
                            return false;
                        });
                        //tab 酒店地图切换
                        $('#j_popHotelIntro').find('.tab').find('li').on('click', function() {
                            var o = $(this);
                            var tab = o.parents('.tab');

                            var index = o.index();
                            var items = tab.find('.bd').find('.item');
                            var citem = items.eq(index);
                            var os = o.siblings('li');

                            o.addClass('on');
                            os.removeClass('on');

                            items.hide();
                            citem.show();
                            //如果点击酒店地图tab才加载地图
                            if (index == 1) {
                                //                            if (index == 1) {
                                //加载地图
                                //                                var ifr = citem.find('iframe');
                                //                                var osrc = ifr.attr('data-src');
                                //                                ifr.attr('src', osrc);
                                //                            }
                                //加载酒店地图
                                if (hotellng && hotellat) {
                                    if (!_amapObj || !_amapObj) {
                                        var opt = {
                                            doubleClickZoom: false, //双击放大地图
                                            scrollWheel: true, //鼠标滚轮缩放地图
                                            view: new AMap.View2D({
                                                center: new AMap.LngLat(hotellng, hotellat) //地图中心点
                                            }),
                                            zoom: 9
                                        };
                                        _amapObj = new AMap.Map("hotelmap", opt);
                                        //在地图中添加ToolBar插件
                                        _amapObj.plugin(["AMap.ToolBar"], function() {
                                            toolBar = new AMap.ToolBar();
                                            _amapObj.addControl(toolBar);
                                        });
                                    }
                                    hotelMapInit(_amapObj, hotellng, hotellat, hname);
                                }
                            }
                        });
                        /******酒店图片浏览 End*************/
                        //官网地址数据加载完成后赋值href
                        $(".hotel-hd .site").each(function() {
                            var oa = $(this);
                            var datahref = oa.attr("data-href");
                            if (datahref) {
                                oa.attr("href", datahref);
                            }
                        });
                        //酒店第一张图片src加载完成后赋值
                        $(".intro-box .frthtlimg").each(function() {
                            var oa = $(this);
                            var datahref = oa.attr("data-url");
                            if (datahref) {
                                oa.attr("src", datahref);
                            }
                        });
                        $("#j_popHotelIntro").addClass("hotel-intro-nobg");
                        popMod('j_popHotelIntro', 5);
                        $("#j_popHotelIntro .intro-box .hotel-hd").show();
                        $("#j_popHotelIntro .intro-box .tab .bd").show();
                    }
                },
                error: function () {
                }
            });
        }
        return false;
    });

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

    o.find('.pop-close').on('click', function() {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).bind("scroll", function() {
        fixIe6(obj, xAxis);
    });

}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    if (!window.XMLHttpRequest) { o.css("top", $(document).scrollTop() + xAxis); }
}

var getProductPrice = function() {
    var pid = Number($.trim($("#txtOdProductID").val())) | 0;
    if (pid > 0) {
        $.ajax({
            type: "GET",
            url: "/GetProductPrice/" + pid,
            success: function(resp) {
                var pricestr = "0";
                var enablestr = 0;
                if (resp) {
                    var priceblearr = resp.split("#");
                    enablestr = priceblearr.length > 0 ? priceblearr[0] : "0";
                    pricestr = priceblearr.length > 1 ? priceblearr[1] : "0";
                }
                var price = Number(pricestr) | 0;
                var enable = Number(enablestr) | 0;
                if (enable > 0 && price > 0) {
                    var priceoneHtml = "<p class='price-mod f14'><i class='price'>￥<em class='f24 b'>" + price + "</em></i>起/人</p>";
                    priceoneHtml += "<p class='btn-bar pt5'><a href='javascript:void(0);' class='btn-order tc'>立即预订</a></p>";
                    $("#pdtpriceone").html(priceoneHtml);

                    var navpriceHtml = "<a href='javascript:void(0);' class='btn-order'>立即预订</a>";
                    if ($("#j_sjProeuctNav").find(".btn-order").length <= 0) {
                        $("#j_sjProeuctNav").prepend(navpriceHtml);
                    }
                    var pdtbtnbarHtml = "<a href='javascript:void(0);' class='btn-order btn-item yahei tc'>立即预订</a>";
                    if ($("#pdtbtnbar").find(".btn-order").length <= 0) {
                        $("#pdtbtnbar").prepend(pdtbtnbarHtml);
                    }
                    $('.main-cont, #j_infoMain').on('click', '.btn-order', function() {
                        detailPop();
                        $('#j_sjProeuctNav').find('.btn-order').click();
                        return false;
                    });
                } else {
                    $("#pdtpriceone").html("<p class='price-mod f14 yahei'><em class='f24 b'>请来电咨询</em></p>");
                    $("#j_sjProeuctNav").find(".btn-order").remove();
                    $("#pdtbtnbar").find(".btn-order").remove();
                }
            },
            error: function () {
            }
        });
    }
};

function detailSlides() {
    var oRPL = $('.j_routePhotoList');
    if (oRPL.get(0)) {
        oRPL.each(function(i) {
            var oThis = $(this);
            var iLen = oThis.find('.item').length;
            if (iLen > 1) {
                oThis.find('.slides-prev').show();
                oThis.find('.slides-next').show();

                oThis.slides({
                    preload: true,
                    preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
                    currentClass: 'on',
                    next: 'slides-next',
                    prev: 'slides-prev',
                    slideSpeed: 300,
                    slideEasing: "easeOutQuad",
                    effect: 'slide',
                    hoverPause: false,
                    pause: 1000,
                    play: 0,
                    generateNextPrev: false,
                    generatePagination: false,
                    slidesLoaded: function(idx) {
                        //处理延迟
                        var btns = oThis.find('.slides-prev,.slides-next');
                        btns.on('click', function() {
                            var oT = $(this);
                            var osc = oT.parents().find('.slides_container');
                            var imgs = osc.find('img');
                            imgs.each(function() {
                                var oImg = $(this);
                                var ooSrc = oImg.attr('data-original');
                                if (ooSrc != oImg.attr('src')) {
                                    oImg.attr('src', ooSrc);
                                }
                            });
                        });
                    }
                });
            }
        });
        fixScreen();
    }
}

function fixScreen() {
    var ow = screen.width,

        oRPL = $('.j_routePhotoList'),
        rplItem = oRPL.find('.slides_container').find('.item'),
        rplWidth = oRPL.eq(0).width();

    if (ow <= 1152) {
        rplWidth && rplItem.width(rplWidth + 4);
    } else {
        rplWidth && rplItem.width(rplWidth + 5);
    }
}

function imgPreview(obj, srcAttr) {
    var $container;

    if ($('#imgPreviewContainer').get(0)) {
        $container = $('#imgPreviewContainer');
    } else {
        $container = $('<div/>').attr('id', 'imgPreviewContainer').append('<img/>').hide().css('position', 'absolute').appendTo('body');
    }

    var $img = $('img', $container),
        $imgs = obj.find('img[' + srcAttr + ']');

    $imgs.on('mousemove', function(e) {
        var iX = $(window).width() - $container.width() - 50;
        var xAxis = e.pageX > iX ? iX : e.pageX + 10;
        $container.css({
            top: e.pageY + 10,
            left: xAxis,
            zIndex: 99
        });
    }).hover(function() {
        var oThis = $(this);
        $container.show();
        $img.load(function() {
            $img.show().animate({
                opacity: 1
            }, 300);
        }).attr('src', oThis.attr(srcAttr));
    }, function() {
        $container.hide();
        $img.unbind('load').attr('src', '').hide().stop().css({
            opacity: 0
        });
    });
}