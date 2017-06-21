$(function () {
    customCarousel();
    customDestination();
    skipStepExt();
    customSubmitForm();
    customFilter();
    customResize();
});

function customCarousel() {
    //图片滚动
    var carousel = $('.scenic-carousel');
    var ow = screen.width;
    var slideNum = 6;

    carousel.find('.scenic-carousel-inner')
        .on('jcarousel:reload jcarousel:create', function () {
            var o = $(this);
            if (ow <= 1152) {
                carousel.css('width', 400);
                o.css('width', 400);
                slideNum = 4;
            }
        })
        .jcarousel();

    carousel.find('.prev')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            target: '-=' + slideNum
        });

    carousel.find('.next')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            target: '+=' + slideNum
        });
}

function skipStep(index, eve) {
    var box = $('#j_customStep');
    var lis = box.find('li');

    lis.find('a').removeClass('on');
    lis.eq(index - 1).find('a').addClass('on');
    lis.eq(index - 1).addClass('ok');

    //tab
    var mod = $('#j_customMod');
    var items = mod.find('.custom-bd').find('.custom-block');
    items.hide();
    items.eq(index - 1).show();

    if (eve) {
        eve();
    }
}

function skipStepExt() {
    var box = $('#j_customStep');
    var mod = $('#j_customMod');
    box.find('li').on('click', function () {
        var o = $(this);

        if (o.hasClass('ok')) {
            var index = o.index();
            var os = o.siblings('li');

            os.find('a').removeClass('on');
            o.find('a').addClass('on');

            //tab
            var items = mod.find('.custom-bd').find('.custom-block');
            items.hide();
            items.eq(index).show();
        }
    });
}

//填充数据
function fillData(obj, v) {
    var tgDesc = $('#' + obj).find('.info-bd');
    var nv = v.split('|');
    var sb = [];
    for (var i = 0; i < nv.length; i++) {
        var item = nv[i];
        sb.push("<label class='tag-item'>" + item + "</label>");
    }
    tgDesc.html(sb.join(''));
}

function customDestination() {
    var oDB = $('#j_destinationBox');
    var oTD = $('#txtDestiation');
    var siteBox = $('#j_siteBox');

    siteBox.find('.custom-type').find('.type-item').on('click', function() {
        var o = $(this);
        o.addClass('on').siblings('.type-item').removeClass('on');
    });

    //快捷选中目的地
    $('.scenic-list').find('li').on('click', function () {
        var c_sb = [];
        var o = $(this);
        var os = o.siblings('li');
        var ot = o.find('a').attr('title');

        if (o.hasClass('on')) {
            var v = $.trim(oTD.val());
            if (v.indexOf(ot) > -1) {
                var nv = v.replace(ot, '');
                oTD.val($.trim(nv));
            }
            o.removeClass('on');
        } else {
            o.addClass('on');
        }

        //篇历所有li.on
        var lis = oDB.find('li.on');
        lis.each(function () {
            var item = $(this);
            var it = item.find('a').attr('title');
            c_sb.push(it);
        });

        var myV = $.trim(oTD.val());

        if (myV) {
            var nv2 = c_sb.join(' ') + " " + myV;
            var arr = _util.array.unique($.trim(nv2).split(' '));
            oTD.val(arr.join(' '));
        } else {
            oTD.val(c_sb.join(' '));
        }
        //点击去重

    });

    //提交
    oDB.find('.btn-next').off('click', '**').on('click', function () {
        var customType = siteBox.find('.custom-type').find('.on');
        var v1 = oTD;
        if (!$.trim(v1.val())) {
            alert('请输入目的地');
            return;
        }

        var v2 = $('#txtCity');
        if (!$.trim(v2.val())) {
            alert('请输入出发城市');
            return;
        }

        var arr = $.trim(v1.val()).split(' ');
        if (arr.length >= 5) {
            alert("目的地不能多于4个");
            return;
        }

        //填充定制类型
        fillData('j_reCustom', $.trim(customType.text()));

        //填充目的地
        fillData('j_reDest', $.trim(v1.val()));

        //填充出发城市
        fillData('j_reCity', $.trim(v2.val()));

        //往表单填充值
        //定制类型
        $("#customType").val($.trim(customType.text()));
        //目地的
        $("#LocationName").val($.trim(v1.val()));
        //出发城市
        $("#StartCityName").val($.trim(v2.val()));

        skipStep(2, customDate);

    });

    oTD.off('blur', '**').on('blur', function () {
        var o = $(this);
        var ov = $.trim(o.val());
        if (ov) {
            //全角转换为半角函数
            var nv = ov;

            nv = _util.string.replaceAll(nv, '，', ' ');
            nv = _util.string.replaceAll(nv, '｜', ' ');
            nv = _util.string.replaceAll(nv, '＼', ' ');
            nv = _util.string.replaceAll(nv, '、', ' ');
            nv = _util.string.replaceAll(nv, '　', ' ');
            nv = _util.string.replaceAll(nv, '。', ' ');
            //nv = _util.string.toCDB(nv);
            nv = _util.string.replaceAll(nv, ',', ' ');
            nv = _util.string.replaceAll(nv, '/', ' ');
            //nv = _util.string.replaceAll(nv, '|', ' ');
            o.val(nv);
        }

        var sb = [];
        var arr = o.val().split(' ');
        var narr = _util.array.unique(arr);
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            sb.push(item);
        }

        o.val(sb.join(' '));

        //选中状态事件
        var lis = oDB.find('li');
        lis.removeClass('on');

        lis.each(function () {
            var item = $(this);
            var it = item.find('a').attr('title');
            var b = $.inArray(it, sb);
            if (b>=0) {
                item.addClass('on');
            }
        });

    });

    oDB.find('.hd').find('.site-type').find('.type-item').on('click', function () {
        var oThis = $(this);
        var iIndex = oThis.index();
        var os = oThis.siblings('.type-item');
        var op = oThis.parent('.site-type');
        var items = oThis.parents('.hd').siblings('.bd').children('.item');

        os.removeClass('on');
        oThis.addClass('on');
        items.hide().eq(iIndex).show();

        $('.scenic-list').find('li').removeClass('on');
        oTD.val('');

        renderInitAllNode(iIndex);
    });

}
function customDate() {

    var box = $('#j_dateCaledar');
    //日历加载
    var cfg = {
        jsonpUrl: '',
        extCallBack: function (year, month) { //扩展方法
            //trigger
            var items = box.find('.item');
            items.on('click', function () {
                var o = $(this);
                if (o.hasClass('item-expiry')) {
                    return false;//无效日期
                }

                items.removeClass('item-on');
                o.addClass('item-on');
            });
        },
        preCallback: function (year, month) { //回调方法

        }
    };

    if(box.get(0)){
        box.jsonCalendar(cfg);
    }


    //选择出行天数
    $('#j_dateBox').find('.days-items').find('li').off('click', '**').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
    });


    //提交
    $('#j_dateBox').find('.btn-next').off('click', '**').on('click', function () {
        var box = $('#j_dateCaledar');
        var vt = box.find('.item-on');
        if (vt.length <= 0) {
            alert('请选择出发日期');
            return;
        }

        //填充日期，出行天数
        var year = vt.attr('data-year');
        var month = vt.attr('data-month');
        var day = vt.attr('data-day');
        var v1 = year + '年' + month + '月' + day + '日';

        var regMonth = parseInt(month, 10) > 9 ? parseInt(month, 10) : '0' + parseInt(month, 10);
        var regDay = parseInt(day, 10) > 9 ? parseInt(day, 10) : '0' + parseInt(day, 10);

        var sDay = year + '-' + $.trim(regMonth) + '-' + regDay;

        var dt = new Date();
        var ny = dt.getFullYear();
        var nm = dt.getMonth() + 1;
        var nd = dt.getDate();
        var tday = ny + '-' + nm + '-' + nd;

        var spanDay = new Date(sDay).getTime();//当前选中日期
        var spanToDay = new Date(tday).getTime();

        if (spanDay < spanToDay) {
            //无效日期
            alert('请选择正确的日期');
            return;
        }

        var v2 = $('#j_dateBox').find('.days-items').find('.on').text();

        fillData('j_reDate', v1 + '|' + $.trim(v2));

        //往form表单填充数据
        $("#GoDate").val($.trim(v1));
        $("#DayInfo").val($.trim(v2));

        skipStep(3, customBuddy);
    });

}

function customBuddy() {

    var box = $('#j_buddyBox');
    box.find('.buddy-items').find('li').off('click', '**').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
    });

    //提交
    $('#j_buddyBox').find('.btn-next').off('click', '**').on('click', function () {
        var box = $('#j_buddyBox');
        var vt = box.find('.buddy-items').find('li.on');
        if (vt.length <= 0) {
            alert('请选择同游伙伴');
            return;
        }

        var v1 = $('#txtAdult');
        if (!v1.val()) {
            alert('请输入成人数量');
            return;
        }

        var v2Node = $('#txtChild');
        var v2 = "";
        if (v2Node.val()) {
            v2 = "|儿童" + v2Node.val();
        }

        var v = $.trim(vt.find('.item-hd').text()) + '|成人' + $.trim(v1.val()) + $.trim(v2);
        fillData('j_reBuddy', v);

        //往form表单填充数据
        $("#PerSonName").val(vt.find('.item-hd').text());
        $("#Person").val($.trim(v1.val()));
        $("#Clild").val($.trim(v2Node.val()));

        skipStep(4, customHotel);
    });
}

function customHotel() {
    var box = $('#j_hotelBox');
    box.find('.hotel-items').find('li').off('click', '**').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
        fillData('j_reHotel', $.trim(o.find('.item-hd').text()));

        //往form表单填充数据
        $("#HotelInfo").val($.trim(o.find('.item-hd').text()));

        skipStep(5, customBudget);
    });

}

function customBudget() {
    var box = $('#j_budgetBox');
    box.find('.budget-items').find('li').off('click', '**').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        os.removeClass('on');
        o.addClass('on');
        fillData('j_reBudget', $.trim(o.find('.item-hd').text()));
        //往form表单填充数据
        $("#YuSuan").val($.trim(o.find('.item-hd').text()));

        skipStep(6, customContact);
    });
}

function customContact() {
    var box = $('#j_contactBox');

    box.find('.btn-next').off('click', '**').on('click', function () {
        var v1 = $.trim($('#txtName').val());
        if (!v1) {
            alert('请输入您的姓名');
            return;
        }

        var v2 = $.trim($('#txtMobile').val());
        if (!v2) {
            alert('请输入您的手机号码');
            return;
        } else {
            if (!_uzw.regexForm.mobile(v2)) {
                alert('请输入正确的手机号码');
                return;
            }
        }

        var v3 = $.trim($('#txtEmail').val());
        if (!v3) {
            alert('请输入您的电子邮箱');
            return;
        } else {
            if (!_uzw.regexForm.email(v3)) {
                alert('请输入正确的电子邮箱');
                return;
            }
        }

        fillData('j_reContact', v1 + '|' + v2);
        fillData('j_reContactEmail', v3);

        //往表单填写数据
        $("#UserName").val(v1);
        $("#Tel").val(v2);
        $("#Email").val(v3);


    });
}

//弹出框
function popMod(obj, xAxis) {

    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    var pop = o.parent();

    pop.find('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-close').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).bind("scroll", function () {
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

/* 提交表单 */
function customSubmitForm() {
    var sUrl = location.href;
    var sType = _util.url.get('type');

    //AJAX提交私家定制信息
    $(".btn-submit").click(function () {
        var oThis = $(this);
        var param = {
            customType: $("#customType").val(),
            LocationName: $("#LocationName").val(),
            StartCityName: $("#StartCityName").val(),
            GoDate: $("#GoDate").val(),
            DayInfo: $("#DayInfo").val(),
            PerSonName: $("#PerSonName").val(),
            Person: $("#Person").val(),
            Clild: $("#Clild").val(),
            HotelInfo: $("#HotelInfo").val(),
            YuSuan: $("#YuSuan").val(),
            UserName: $("#UserName").val(),
            Tel: $("#Tel").val(),
            Email: $("#Email").val(),
            IsOut: $("#IsOut").val(),
            Token: $("#txtValidator").val(),
            ref: $("#ref").val(),
            type: sType
        };

        if (oThis.hasClass('btn-off')) {
            return false;
        }
        if (param.UserName && param.Tel) {
            $.ajax({
                type: "post",
                data: param,
                url: "/PrivateOrder",
                dataType: "json",
                beforeSend: function (XMLHttpRequest) {
                    oThis.addClass('btn-off');
                },
                success: function (msg) {
                    if (msg !== null && msg.ErrorCode == 200) {
                        popMod('j_popFinish', 5);
                    } else {
                        alert(msg.ErrorMsg);
                    }
                    oThis.removeClass('btn-off');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    oThis.removeClass('btn-off');
                }
            });
        } else {
            alert("请填写相关信息再定制！");
        }
    });

    // type = 2，隐藏头部
    if (sType == 2) {
        $('.header').hide();
        $('.side').find('.contact-us').hide();
        $('#j_globalSidebar').hide();
    }

    //订制成功关闭提示层刷新页面
    $(".close-icon").click(function () {
        //window.location = "/SijiaIndex";
        location.reload();
    });
}


//初始化生成全部节点
function renderInitAllNode (index) {
    var oSCA = $('#j_sjCustomAutocomp');
    var oWrap = oSCA.parent();
    var oIO = $("#IsOut");

    var _initNode = function (cityList) {
        var tlLen = cityList.length;
        var html = '';

        oSCA.empty().hide();
        oWrap.css({'z-index': 'auto'});

        for (var i = 0; i < tlLen; i++) {
            html += "<li><span class='s0'>" + cityList[i].cityurl + "</span><span class='s1'>" + cityList[i].name + "</span></li>";
        }
        oSCA.append(html);
    };
    if (index === 1) {
        oIO.val(0);
        _initNode(sjCityList.data.domestic.cityList);
    } else {
        oIO.val(1);
        _initNode(sjCityList.data.intercity.cityList);
    }

    oSCA.find('li').on('mouseenter', function () {
        var o = $(this);
        oSCA.find('li').removeClass('on');
        o.addClass('on');
    });

}

//共用autocomplete
function customFilter() {
    var oSB = $("#j_siteBox");
    var oSCA = $('#j_sjCustomAutocomp');
    var oWrap = oSCA.parent();
    var oTD = $('#txtDestiation');

    renderInitAllNode(0);

    //即时输入智能filter
    var unitKeyEvent = function (o) {
        var scaLi = oSCA.find('li');
        var ov = $.trim(o.val().toUpperCase());

        if (!ov) {
            o.focus();
            oSCA.hide();
            oWrap.css({'z-index': 'auto'});
            return;
        }

        var ot = o.offset().top;
        var ol = o.offset().left;
        var oh = o.height();

        oSCA.show();
        oWrap.css({'z-index': 10});
        oSCA.find('.li-none').remove();

        scaLi.each(function (k, v) {
            var oo = $(this);
            var oot = oo.text().toUpperCase();
            var ootAbb = oo.find('s0').text();
            if (oot.indexOf(ov) > -1) {
                oo.show();
                // console.log(oot);
            } else {
                oo.hide();
            }
        });

        var initLis = oSCA.find('li:visible');
        var lisLen = initLis.length;

        if (lisLen === 0) {
            oSCA.hide();
            oWrap.css({'z-index': 'auto'});
        } else if (lisLen === 1) {
            if (initLis.find('.s1').text() === $.trim(o.val().toUpperCase())) {
                oSCA.hide();
                oWrap.css({'z-index': 'auto'});
            }
        } else if (lisLen > 15) {
            initLis.each(function (k, v) {
                var ooo = $(this);
                if (k >= 15) {
                    ooo.hide();
                }
            });
        }

        //绑定点击事件
        scaLi.off('click');
        oSCA.find('li:visible').on('click', function () {
            var node = $(this);
            var ncn = node.find('.s1').text();
            o.val(ncn); //设置值
            oSCA.hide();
            oWrap.css({'z-index': 'auto'});
            oSCA.find('.on').removeClass('on');

            //$('#j_submitForm').parents('form').submit();

        });

        /*if (oSCA.find('li:visible').not('.li-none').length <= 0) {
            oSCA.append("<li class='li-none'>找不到'" + ov + "'</li>");
        } else {
            oSCA.find('.li-none').remove();
        }*/
    };

    //autocomplete筛选
    oTD.on('keyup', function (e) {
        var o = $(this);
        // o.val($.trim(o.val()));
        // setCode3(o);
        unitKeyEvent(o);
    });

    var unitKeyChoose = function (dir, o) {
        var lis = oSCA.find('li:visible');

        if (dir === 'down') {
            if (lis.filter('.on').length) {
                var liNext = lis.filter('.on').nextAll('li:visible').eq(0);
                oSCA.find('li').removeClass('on');
                if (liNext.get(0)) {
                    liNext.addClass('on');
                } else {
                    lis.eq(0).addClass('on');
                }
            } else {
                lis.removeClass('on');
                lis.eq(0).addClass('on');
            }
        } else if (dir === 'up') {
            if (lis.filter('.on').length) {
                var liPrev = lis.filter('.on').prevAll('li:visible').eq(0);
                oSCA.find('li').removeClass('on');
                if (liPrev.get(0)) {
                    liPrev.addClass('on');
                } else {
                    lis.filter(":visible").last('li').addClass('on');
                }
            } else {
                lis.removeClass('on');
                lis.filter(":visible").last('li').addClass('on');
            }
        } else if (dir === 'enter') {
            oSCA.find('.on').click();
        }
    };


    oTD.on('keydown', function (event) {
        var o = $(this);
        //清空空格
        // o.val($.trim(o.val()));

        var kid = (event.keyCode ? event.keyCode : event.which);

        //tab   9
        //enter 13
        //shift 16
        //ctrl  17
        //alt   18

        if (kid == '9' || kid == '16' || kid == '17' || kid == '18') {
            return;
        }
        if (kid == '38') {
            unitKeyChoose('up', o);
        } else if (kid == '40') {
            unitKeyChoose('down', o);
        } else if (kid == '13') {
            unitKeyChoose('enter', o);
            return false; //防回车提交
        }
    });

    //全局关闭
    $(document).click(function (event) {
        if ($(event.target).attr("id") != "txtDestiation") {
            oSCA.hide();
            oWrap.css({'z-index': 'auto'});
        }
    });
}

function customResize() {
    var ow = screen.width;
    if (ow <= 1152) {
        $('#j_customMod').addClass('custom-mod-min');
    }
}