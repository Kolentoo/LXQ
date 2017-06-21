(function () {
    'use strict';

    var j_slide = $('#j_slide'),
        j_slide_coupon = $('#j_slide_coupon'),
        dialog_full = $('.dialog-full'),
        j_tab_member = $('#j_tab_member'),
        j_tab_phone = $('#j_tab_phone'),
        j_dialog_login_close = $("#j_dialog_login_close");

    // ❗️ 单房差点击显示隐藏
    j_slide.on('click', function () {
        j_slide.children('.section-arrow').toggleClass('section-arrow-hover');
        $('#j_slide_content').toggle();
    });

    // ❗️ 优惠券点击显示隐藏
    j_slide_coupon.on('click', function () {
        j_slide_coupon.toggleClass('slide-btn-hover');
        $('#j_slide_coupon_content').toggle();
        var _class = $(this).attr("class");
        if (_class == "font-click slide-btn right") {
            $(this).html('展开全部');
        }
        else {
            $(this).html('折叠全部');
        }
    });

    // ❗️ 设置门店高度
    var store_box_height = $('.store-current').height();
    $('.store-others').css({
        'height': store_box_height,
        'line-height': store_box_height + 'px'
    });


    // ❗️ 设置登录弹窗遮罩高度
    dialog_full.css({
        'height': $(document).height()
    })

    // ❗️ 会员登录切换
    j_tab_member.on('click', function () {
        j_tab_member.addClass('font-black');
        j_tab_phone.removeClass('font-black');
        $('.member-box').show();
        $('.phone-box').hide();
    });
    j_tab_phone.on('click', function () {
        j_tab_member.removeClass('font-black');
        j_tab_phone.addClass('font-black');
        $('.member-box').hide();
        $('.phone-box').show();
    });

    // ❗️ 关闭登录弹窗
    j_dialog_login_close.on('click', function () {
        $(".dialog-login,.dialog-full").hide();
        $('html').css('overflow', 'auto').css('height', $(document).height());
    });



    var userAgent = navigator.userAgent.toLowerCase();
    // Figure out what browser is being used
    $.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };

    if ($.browser.msie && (($.browser.version == "7.0") || ($.browser.version == "8.0"))) {
        $('input[type=checkbox]').click(function () {
            if ($(this).prop('checked')) {
                $(this).next().addClass('input-checkbox-box1').addClass('input-checkbox-box')
            } else {
                $(this).next().removeClass('input-checkbox-box1').removeClass('input-checkbox-box')
            }
        })
    }
    if (!$('.dialog-login').is(":hidden")) $('html').css('overflow', 'hidden').css('height', $(window).height())

    $('.sold_main_li span').click(function () {
        $(this).addClass('select').siblings().removeClass('select')
        var i = $(this).index('.sold_main_li span');
        $('.sold_main_li_m').eq(i).show().siblings('.sold_main_li_m').hide();
        if (i != 0) {
            $('#j_slide_coupon').hide();
        } else {
            $('#j_slide_coupon').show();
        }
    })


    //地图
    var storeMap = new BMap.Map("storeMapContainer"); // 创建地图实例
    storeMap.centerAndZoom(new BMap.Point(116.158061, 40.055466), 11);
    storeMap.addControl(new BMap.NavigationControl()); //地图平移缩放控件
    storeMap.addControl(new BMap.ScaleControl()); //比例尺
    storeMap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var mapIcon = new BMap.Icon("//r01.uzaicdn.com/content/v1/images/common/map-mark.gif", new BMap.Size(25, 29), { offset: new BMap.Size(27, 27) })
    //将所有门店位置标注在地图上
    $("#storeItems").children().each(function (i, n) {
        var obj = $(n);
        var longitude = obj.attr("data-longitude");
        var latitude = obj.attr("data-latitude");
        var point = new BMap.Point(longitude, latitude);  // 创建点坐标
        var marker = new BMap.Marker(point, { icon: mapIcon });        // 创建标注
        storeMap.addOverlay(marker);                     // 将标注添加到地图中
        var infoWindow = new BMap.InfoWindow(obj.find(".store-hd").html() + "<br/><div style='max-width:300px;'>" + obj.find(".store-detail span").html() + "</div>");  // 创建信息窗口对象
        marker.addEventListener("mouseover", function (e) {
            //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
            this.openInfoWindow(infoWindow);
        });
        marker.addEventListener("click", function (e) {
            //alert("当前位置：" + this.getPosition().lng + ", " + this.getPosition().lat);
            var lng = this.getPosition().lng;
            var lat = this.getPosition().lat;
            //var selCity = $("#selectStoreCity").find("option:selected").val();
            //var selArea = $("#selectStoreArea").find("option:selected").val();
            $("#storeItems").children().each(function (i, m) {
                var item = $(m);
                if (item.attr("data-longitude") == lng && item.attr("data-latitude") == lat) {
                    var cid = item.attr("data-city");
                    var aid = item.attr("data-area");
                    $('#selectStoreCity option').each(function () {
                        this.removeAttribute('selected');
                    });
                    $("#selectStoreCity option[value='" + cid + "']").attr('selected', true);
                    $("#selectStoreArea").html("");
                    $("#selectStoreArea").html($("#storeAreaOption option[data-city='" + cid + "']").clone());
                    $("#selectStoreArea option[value='" + aid + "']").attr('selected', true);
                    item.css("display", "block");
                    $(m).click();
                }
                else {
                    item.css("display", "none");
                }
            });
        });
    });
    $("#storeItems").children().click(function () {
        var obj = $(this);
        var longitude = obj.attr("data-longitude");
        var latitude = obj.attr("data-latitude");
        var point = new BMap.Point(longitude, latitude);  // 创建点坐标
        storeMap.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
    });

    $('.pop-close').click(function () {
        $('#j_popStoreInfo, .dialog-full').hide();
    })
    $('.store-others').click(function () {
        $('#j_popStoreInfo, .dialog-full').show();
        return false;
    })

    //选择门店dialog当前门店城市选中
    var storeId = $('#storeId').val();
    if (storeId > 0) {
        var obj = $($('#j_popStoreInfo').find('input[name="cbStore"][value="' + storeId + '"]').parent()[0]);
        var cityId = obj.attr('data-city');
        var areaName = obj.attr('data-area');
        if (cityId > 0) {
            $('#selectStoreCity').val(cityId);
            setTimeout(function () {
	            $('#selectStoreArea').val(areaName);  
	            document.getElementById('selectStoreArea').onchange();
                obj.click();
            }, 500);
        }
    }
} ());
