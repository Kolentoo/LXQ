var swiperF;
var swiperS;
api.backUrl = "http://m.uzai.com";
var devicetype = api.getQueryString('devicetype');
$(function () {
    var _this = $('.down_btn').parents('.slide-link');
    var _btn = $('.down_btn .btn');

    //点击收缩
    $('.down_btn').click(function () {
        _btn.toggleClass('on');
        _this.find('ul').stop().toggle(300);
        _this.find('.l').stop().toggle(300);
        _this.find('.r').stop().toggle(300);
    });


    //$(window).scroll(function () {
    //    if ($(window).scrollTop() < 10) {
    //        _header.addClass('on');
    //    } else if ($(window).scrollTop() > 500) {
    //        $('.gotoTop').show();
    //    } else {
    //        $('.gotoTop').hide();
    //        _header.removeClass('on');
    //    }
    //});

    //页面加载完成执行动画
    function loadShow(e) {
        if (e == undefined) {
            e = 0
        }
        _this.find('ul').stop().fadeIn(e);
        _this.find('.l').stop().show();
        _this.find('.r').stop().show();
    }
    loadShow(1000);

    $('.gotoTop').click(function () {
        $(window).scrollTop(0);
        $(this).fadeOut(200);
    });
    Telephone_init();
});

var cityname = "";
var dingzhi = angular.module('dingzhi', ['angular-lazyload']);
dingzhi.controller('dingzhiindexController', function ($http, $scope,$window) {

    var PageIndex = 1;
    //var param = JSON.stringify({
    //    "PageIndex": PageIndex,
    //    "PageCount": 10,
    //    "Type": 3,
    //    "CityId": 0
    //});
    //api.post($http, $scope, api.path.dingzhilogic, 'Uzai', 'GetBaseIndexList', param, function (obj) {
    //    if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
    //        if (obj.ErrorCode == -3) {
    //            $('.white-cover').remove();
    //            api.endloading();
    //            api.toast('网络连接失败,请重试～');
    //        }
    //        else {
    //            $scope.index = JSON.parse(obj.JsonResult);
    //        }
    //        console.log(obj.index);
    //    }
    //    else {
    //        //api.endloading();
    //        $('.white-cover').remove();
    //        api.toast(obj.ErrorMsg);
    //    }
    //})

    var data="{\"Banner\":[{\"ID\":1,\"PicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/banner/banner_01.jpg\",\"PicJumpUrl\":\"\"},{\"ID\":2,\"PicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/banner/banner_02.jpg\",\"PicJumpUrl\":\"\"},{\"ID\":3,\"PicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/banner/banner_03.jpg\",\"PicJumpUrl\":\"\"}],\"IndexDestination\":[{\"DestCityID\":1,\"DestCityName\":\"欧洲\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/ouzhou.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/ouzhou_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":2,\"DestCityName\":\"日韩\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/rihan.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/rihan_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":3,\"DestCityName\":\"东南亚\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/dongnanya.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/dongnanya_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":4,\"DestCityName\":\"美洲\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/meizhou.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/meizhou_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":5,\"DestCityName\":\"澳洲\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/aozhou.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/aozhou_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":6,\"DestCityName\":\"中东非\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/zhongdongfei.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/zhongdongfei_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":8,\"DestCityName\":\"国内\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/guonei.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/guonei_a.png\"}],\"DestCityJumpUrl\":\"\"},{\"DestCityID\":10,\"DestCityName\":\"邮轮航线\",\"DesPic\":[{\"State\":1,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/youlun.png\"},{\"State\":2,\"DestCityPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/destcity/youlun_a.png\"}],\"DestCityJumpUrl\":\"\"}],\"TravelTheme\":[{\"TravelThemeId\":103,\"TravelPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/traveltheme/qinziyouxue.jpg\",\"TravelJumpUrl\":\"\",\"TravelName\":\"亲子游学\"},{\"TravelThemeId\":106,\"TravelPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/traveltheme/shishanggouwu.jpg\",\"TravelJumpUrl\":\"\",\"TravelName\":\"时尚购物\"},{\"TravelThemeId\":105,\"TravelPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/traveltheme/shangwujingying.jpg\",\"TravelJumpUrl\":\"\",\"TravelName\":\"商务精英\"},{\"TravelThemeId\":107,\"TravelPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/traveltheme/saishiqingdian.jpg\",\"TravelJumpUrl\":\"\",\"TravelName\":\"赛事庆典\"},{\"TravelThemeId\":104,\"TravelPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/traveltheme/miyuelvpai.jpg\",\"TravelJumpUrl\":\"\",\"TravelName\":\"蜜月旅拍\"},{\"TravelThemeId\":108,\"TravelPicUrl\":\"http://r03.uzaicdn.com/images/m/dingzhi/traveltheme/xiuxianhuodong.jpg\",\"TravelJumpUrl\":\"\",\"TravelName\":\"休闲活动\"}]}";
    $scope.index = JSON.parse(data);

    var isflag = true;
    var isload = true;
    function load() {
        var param = JSON.stringify({
            "PageIndex": PageIndex,
            "PageCount": 10,
            "Type": 3,
            "CityId": 0
        });
        api.post($http, $scope, api.path.dingzhilogic, 'Uzai', 'GetIndexCaseList', param, function (obj) {
            if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
                if (obj.ErrorCode == -3) {
                    api.toast('网络连接失败,请重试～');
                }
                else {
                    $scope.indexcase = JSON.parse(obj.JsonResult);
                    isload = false;
                }
            }
            else {
                api.toast(obj.ErrorMsg);
            }
        })
    }

    function loadnext()
    {
        PageIndex++;
        var param = JSON.stringify({
            "PageIndex": PageIndex,
            "PageCount": 10,
            "Type": 3,
            "CityId": 0
        });
        api.post($http, $scope, api.path.dingzhilogic, 'Uzai', 'GetIndexCaseList', param, function (obj) {
            if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
                if (obj.ErrorCode == -3) {
                    $('.white-cover').remove();
                    api.endloading();
                    api.toast('网络连接失败,请重试～');
                }
                if (obj.ErrorCode == 200 && obj.JsonResult == '[]') {
                    var errorTxt = '没有更多案例了～';
                    api.toast(errorTxt, 2000);
                    isflag = false;
                }
                else {
                    for (var i = 0; i < JSON.parse(obj.JsonResult).length; i++) {
                        $scope.indexcase.push(JSON.parse(obj.JsonResult)[i]);
                    }
                }
            }
            else {
                var errorTxt = '没有更多案例了～';
                api.toast(errorTxt, 2000);
            }
        })
    }
    window.onbeforeunload=function () {
        $(window).scrollTop(0, 0);
    };
    $(window).scroll(function (e) {
        var _header = $('.white-topbar');
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (isload) {
            load();
        }
        if (scrollTop + windowHeight == scrollHeight) {
            if (isflag==true && isload==false)
            {
                loadnext();
            }            
        }
        else if ($(window).scrollTop() < 30) {
            _header.addClass('on');
        } else if ($(window).scrollTop() > 500) {
            $('.gotoTop').show();
        } else {
            $('.gotoTop').hide();
            _header.removeClass('on');
        }
    });

    $scope.jumpurl = function (type, id, keyworld) {
        var name = encodeURI(keyworld);
        if (type == 1) {
            window.location.href = "../product/list.html?dingzhitype=1&dingzhivalue=" + id + "&keyworld=" + name;
        }
        else if (type == 2) {
            window.location.href = "../product/list.html?dingzhitype=2&dingzhivalue=" + id + "&keyworld=" + name;
        }
        else if (type == 3) {
            if (devicetype == "ios" || devicetype == "android") {
                window.location.href = "../order/index.html";
            }
            else {
                window.location.href = "../order/index.html?departureCityName=" + cityname;
            }    
        }
        else if (type == 4) {
            window.location.href = "../event/detail.html?activityid=" + id + "&departureCityName=" + cityname;
        }
        else if (type == 5) {
            var userid = api.getUserId();
            if (userid == null || typeof (userid) == 'undefined' || userid == '' || userid == '0') {
                api.login(location.href, 'http://mdingzhi.uzai.com/order/list.html');
            }
            else {
                window.location.href = "http://mdingzhi.uzai.com/order/list.html";
            }
        }
    }

    $scope.bannerjump = function (bannerid) {
        if (bannerid == 1) {
            window.location.href = "http://mdingzhi.uzai.com/subject/bannerfirst.html";
        }
        else if (bannerid == 2) {
            window.location.href = "http://mdingzhi.uzai.com/subject/bannersecond.html";
        }
        else if (bannerid == 3) {
            window.location.href = "http://mdingzhi.uzai.com/subject/bannerthird.html";
        }
    }
});

dingzhi.directive('onFinishRender', onFinishRenderDirective);

function onFinishRenderDirective($timeout) {
    return {
        restrict: 'AE',
        link: function (scope) {
            if (scope.$last === true) {
                $timeout(function () {
                    //console.log("----------finish");
                    swiperInit();
                    $('.white-cover').remove();

                });
            }
        }
    }
}


////---------------定位成功
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var point = new BMap.Point(longitude, latitude);
    // 创建点坐标
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function (rs) {
        var locationCity = rs.addressComponents.province;
        cityname = locationCity;
        if (cityname.indexOf("省") > 0) {
            cityname = cityname.replace(/省/g, "");
        }
        else if (cityname.indexOf("市") > 0) {
            cityname = cityname.replace(/市/, "");
        }
        else {
            cityname = cityname;
        }
        api.setLocalStorage("departureCityName", encodeURI(cityname));
        if (locationCity == "上海市" || locationCity == "浙江省" || locationCity == "安徽省" || locationCity == "江苏省") {
            $("#Telephone").attr("href", "tel:4000008888");
            api.setCookie("Telephone", "4000008888");
        } else {
            $("#Telephone").attr("href", "tel:4000008888");
            api.setCookie("Telephone", "4000008888");
        }

    });

}

//---------------定位失败
function handleLocationError(error) {
    $("#Telephone").attr("href", "tel:4000008888");
    cityname = "上海";
    api.setLocalStorage("departureCityName", encodeURI(cityname));
}

function Telephone_init() {
    if (devicetype == 'ios' || devicetype == 'android') {
        var province = decodeURI(api.getLocalStorage('province'));
        if (province == "上海市" || province == "浙江省" || province == "安徽省" || province == "江苏省") {
            $("#Telephone").attr("href", "tel:4000008888");
        } else {
            $("#Telephone").attr("href", "tel:4000008888");
        }
    }
    else {

        if (api.getCookie("Telephone") != null) {
            $("#Telephone").attr("href", "tel:" + api.getCookie("Telephone"));
        } else {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(showPosition, handleLocationError, {
                    // 指示浏览器获取高精度的位置，默认为false
                    enableHighAccuracy: true,
                    // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                    timeout: 1000,
                    // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                    maximumAge: 0
                });
            } else {

            $("#Telephone").attr("href", "tel:4000008888");
        }
    }

    }
}

function swiperInit() {

    swiperF = new Swiper('.swiper-containerF', {
        pagination: '.swiper-pagination',
        loop: true,
        lazyLoading: true
    });
    swiperS = new Swiper('.swiper-containerS', {
        slidesPerView: 5.4,
        paginationClickable: true
    });

}

function andriodGoBack() {
    window.location.href = "http://m.uzai.com";
}

