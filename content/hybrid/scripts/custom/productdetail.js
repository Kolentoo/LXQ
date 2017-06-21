//data数据相关
//var uzaiApp = angular.module('uzaiApp', ['angular-lazyload']);
var uzaiApp = angular.module('uzaiApp', []);
//产品id

var myScroll;
var headerBackUrl = $("header").children("fl").attr("href");
var ProductListURL = api.getLocalStorage("ProductListURL");
var iframeSrc = "";
var submitUrl = {
    "url": "../order/index.html",
    "departureCityName": "",
    "arrivalCityName": "",
    "departureCityId": "",
    "arrivalCityId": "",
    "days": "",
    "productId": ""
};
var devicetype = api.getQueryString('devicetype');
//http://mdingzhilogic.uzai.com/Api/UzaiProduct/GetProductInfo
//调用产品接口
//uzaiApp.controller('productInfo', ['$scope', '$http', '$timeout', productInfo]);

uzaiApp.controller('productInfo', function ($http, $scope) {

    var param = JSON.stringify({
        "ProductID": api.getQueryString('ProductID')
    });

    //设备类型
    if (devicetype == 'ios' || devicetype == 'android') {
        $scope.isApp = true;
    } else {
        $scope.isApp = false;
    }

    //分享
    $scope.share = function() {
        var shareParam = encodeURI(JSON.stringify({
            Url: 'http://mdingzhi.uzai.com/product/detail.html?ProductID=' + $scope.values.ProductID,
            Title: $scope.values.ProductName,
            ImageUrl: $scope.values.ProductImages.ImgPath,
            Content: $scope.values.ProductName
        }));
        if (devicetype == 'ios') {
            api.invoke('action.share', shareParam);
        } else if (devicetype == 'android') {
            window.action.exec('share', shareParam);
        }
    };
    //console.log('----- productInfo ----');
    api.post($http, $scope, api.path.dingzhilogic, 'UzaiProduct', 'GetProductInfo', param, function(obj) {
        if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
	 if (obj.ErrorCode == -3) {
                api.toast('网络连接失败,请重试～');
		 $(".load-dialog").remove();
            }
            $scope.values = JSON.parse(obj.JsonResult);
            if(obj.ErrorMsg == '获取产品详情失败!'){
              api.toast('获取产品详情失败！');
              $(".load-dialog").remove();
              $scope.values.CityName = '上海';
            }else {
              var schedule = new Array();
              //总体行程
              for (var i = 0; i < $scope.values.UzaiProductJouneryInfos.length; i++) {
                  schedule[i] = $scope.values.UzaiProductJouneryInfos[i];
              }
              submitUrl.departureCityName = $scope.values.CityName;
              submitUrl.arrivalCityName = $scope.values.LocationName;
              submitUrl.departureCityId = $scope.values.CityID;
              submitUrl.arrivalCityId = $scope.values.LocationID;
              submitUrl.days = $scope.values.UzaiProductJouneryInfos.length;
              submitUrl.productId = $scope.values.ProductID;
              $scope.schedule = schedule;
              iframeSrc = $scope.values.VisaExtendUrl;


              if ($.trim(iframeSrc) == "" || iframeSrc === null || iframeSrc == undefined || iframeSrc == 'undefined' || iframeSrc == "#") {
                  $(".visa").hide();
              }

              $("title").html($scope.values.ProductName + "_优定制_悠哉优定制旅游-众信悠哉旅游");
            }


        } else {
            api.toast(obj.ErrorMsg, 99999);
            $(".load-dialog").remove();
        }
    }, 3);

});
uzaiApp.directive('onFinishRender', onFinishRenderDirective);
//html转义
uzaiApp.filter('trustHtml', function ($sce) {
    return function (input) {
        if (input != undefined) {
            var txt = input.replace(/\r/g, '</br>');
            txt.replace(/\n/g, '&nbsp;');
            return $sce.trustAsHtml(txt);
        } else {
            return $sce.trustAsHtml(input);
        }

    };
});
//url转义
uzaiApp.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

//-----------------检测是否加在完成
function onFinishRenderDirective($timeout) {
    return {
        restrict: 'AE',
        link: function(scope) {
            if (scope.$last === true) {
                $timeout(function() {

                    pages.banner_init();
                    pages.submit_init();
                    $(".load-dialog").remove();
                    setTimeout(function() {
                        myScroll.refresh();
                    }, 500);

                });
            }
        }
    };
}

//--------- 子页面切换
function showDiv(div, titile) {
    var divName = div + '-content';
    var title = "";
    if (div == 'expenseInvoice') {
        title = '费用说明';
    } else if (div == 'attention') {
        title = '预订须知';
    } else if (div == 'tips') {
        title = '温馨提示';
    } else {
        title = '签证';
        $("#iframeOutside").html("<iframe class=\"childrenPages-content-iframe\" src='" + iframeSrc + "' style='display:block'></iframe>");
    }
    //$('#' + divName).show();

    $("header").children(".fl").attr("href", "javascript:hideDiv('" + div + "')");
    $("header").children(".title").children("h1").html(title);

    $('#' + divName).addClass('childrenPages-show');
    $("header").addClass('childrenPages-show');
    setTimeout(function(){
      $("#custiom-detail").hide();
      $(".white-footer").hide();
    },800);
}

function hideDiv(div) {
    var divName = div + '-content';
    if (div == 'visa') {
        $("#iframeOutside").html(' ');
    }
    //$('#' + divName).hide();

    $("header").children(".fl").attr("href", headerBackUrl);

    $('#' + divName).removeClass('childrenPages-show');
    $("header").removeClass('childrenPages-show');
    setTimeout(function(){
      $("#custiom-detail").show();
      $(".white-footer").show();
    },100);

}


//---------------定位成功
//function showPosition(position) {
//    var latitude = position.coords.latitude;
//    var longitude = position.coords.longitude;

//    var point = new BMap.Point(longitude, latitude);
//    // 创建点坐标
//    var gc = new BMap.Geocoder();
//    gc.getLocation(point, function(rs) {
//        var locationCity = rs.addressComponents.province;
//        if (locationCity == "上海市" || locationCity == "浙江省" || locationCity == "安徽省" || locationCity == "江苏省") {
//            $("#Telephone").attr("href", "tel:4000008888");
//            api.setCookie("Telephone", "4000008888");
//        } else {
//            $("#Telephone").attr("href", "tel:4000008888");
//            api.setCookie("Telephone", "4000008888");
//        }

//    });

//}

////---------------定位失败
//function handleLocationError(error) {
//    $("#Telephone").attr("href", "tel:4000008888");
//}


//-----------------页面内容相关的
var pages = {
    removeLocalStorage: function() {
        api.removeLocalStorage('productId');
        api.removeLocalStorage('isCompany');
        api.removeLocalStorage('days');
        api.removeLocalStorage('arrivalCityName');
        api.removeLocalStorage('arrivalCityId');
        api.removeLocalStorage('ProductListURL');
        api.removeLocalStorage('locationName1');
        api.removeLocalStorage('pgoWith');
        api.removeLocalStorage('photelInfo');
        api.removeLocalStorage('pminDays');
        api.removeLocalStorage('pminPerson');
        api.removeLocalStorage('pyuSuan');
        api.removeLocalStorage('productDepartureCityName');
    },
    layout_init: function() {
        //先设置高度。。
        var fixFooterHeight = $("footer").height();
        var windowHeight = $(window).height();
        $("#custiom-detail").height(windowHeight - fixFooterHeight);
        //再生成滚动
        myScroll = new IScroll('#custiom-detail', {
            mouseWheel: true,
            probeType: 2,
            click: true
        });
        myScroll.on('scroll', showFixNav);
        myScroll.on('scrollEnd', showFixNav);

        var dateDiv = $('.schedule-contents');

        function showFixNav() {
            var num = this.y;
            if (num < -10) {
                $(".detail-images-bottom").addClass('detail-images-bottom-animate');
            } else {
                $(".detail-images-bottom").removeClass('detail-images-bottom-animate');
            }
            if (num < -2000) {
                $(".gotoTop").show();
            } else {
                $(".gotoTop").hide();
            }
        }
        //返回顶部
        $(".gotoTop").on('click', function() {
            myScroll.scrollTo(0, 0, 500);
            $(".gotoTop").hide();
        });
        // 费用说明
        $(".expenseInvoice").on('click', function() {
            if (!$("#expenseInvoice-content").hasClass('childrenPages-content')) {
                showDiv('expenseInvoice');
            } else {
                hideDiv('expenseInvoice');
            }

        });
        // 预订需知
        $(".attention").on('click', function() {
            if (!$("#attention-content").hasClass('childrenPages-content')) {
                showDiv('attention');
            } else {
                hideDiv('attention');
            }

        });
        // 温馨提示
        $(".tips").on('click', function() {
            if (!$("#tips-content").hasClass('childrenPages-content')) {
                showDiv('tips');
            } else {
                hideDiv('tips');
            }

        });
        // 签证
        $(".visa").on('click', function() {
            if (!$("#visa-content").hasClass('childrenPages-content')) {
                showDiv('visa');
            } else {
                hideDiv('visa');
            }

        });
        //console.log("-----layout init end-------");
    },
    banner_init: function() {

        for (var i = 0; i < $("[banner]").length; i++) {
            var varname = "var" + i;
            window[varname] = {};
            var n = i + 1;
            window[varname] = new Swiper('.swiper-wrapper-' + n, {
                loop: true,
                touchAngle:20,
                lazyLoading: true,
                pagination: '.swiper-pagination-' + n
            });

        }
        //console.log("-----banner init end-------");
    },
    Telephone_init: function () {
        $("#Telephone").attr("href", "tel:4000008888");
        //if (devicetype == 'ios' || devicetype == 'android') {
        //    var province = decodeURI(api.getLocalStorage('province'));
        //    if (province == "上海市" || province == "浙江省" || province == "安徽省" || province == "江苏省") {
        //        $("#Telephone").attr("href", "tel:4000008888");
        //    } else {
        //        $("#Telephone").attr("href", "tel:4000008888");
        //    }
        //} else {
        //    if (api.getCookie("Telephone") != null) {
        //        $("#Telephone").attr("href", "tel:" + api.getCookie("Telephone"));
        //    } else {
        //        if (navigator.geolocation) {

        //            navigator.geolocation.getCurrentPosition(showPosition, handleLocationError, {
        //                // 指示浏览器获取高精度的位置，默认为false
        //                enableHighAccuracy: true,
        //                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
        //                timeout: 1000,
        //                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
        //                maximumAge: 0
        //            });
        //        } else {
        //            $("#Telephone").attr("href", "tel:4000008888");
        //        }
        //    }
        //}
    },
    backBtn_init: function() {
        //console.log("返回按钮地址---------" + api.getLocalStorage("ProductListURL"));
        $(".detail-btn-back").on('click', function() {
          pages.removeLocalStorage();
        });
        if (ProductListURL === null) {
            $(".detail-btn-back,.detail-btn-back-big").attr("href", "http://mdingzhi.uzai.com/");
        } else {
            $(".detail-btn-back,.detail-btn-back-big").attr("href", ProductListURL);
        }
    },
    submit_init: function() {
        var departureCityEncode = encodeURI(submitUrl.departureCityName).toString();
        var arrivalCityEncode = encodeURI(submitUrl.arrivalCityName).toString();
        //console.log(submitUrl);
        api.setLocalStorage("productDepartureCityName", departureCityEncode);
        api.setLocalStorage("arrivalCityName", arrivalCityEncode);
        api.setLocalStorage("days", submitUrl.days);
        api.setLocalStorage("departureCityId", submitUrl.departureCityId);
        api.setLocalStorage("arrivalCityId", submitUrl.arrivalCityId);
        api.setLocalStorage("productId", submitUrl.productId);

        $(".confirm").attr("href", submitUrl.url);

    }
};



angular.element(document).ready(function () {
    // pages layout
    pages.layout_init();
    pages.Telephone_init();
    pages.backBtn_init();

});


//要做的返回操作，与左上角的返回相同
function andriodGoBack() {

    if ($("#expenseInvoice-content").hasClass('childrenPages-show')) {
      hideDiv('expenseInvoice');
    } else if ($("#attention-content").hasClass('childrenPages-show')) {
      hideDiv('attention');
    } else if ($("#tips-content").hasClass('childrenPages-show')) {
      hideDiv('tips');
    } else if ($("#visa-content").hasClass('childrenPages-show')) {
      hideDiv('visa');
    } else {
        pages.removeLocalStorage();
        if (ProductListURL === null) {
            window.location.href = "http://mdingzhi.uzai.com/";
        } else {
            window.location.href = ProductListURL;
        }
    }
}



window.addEventListener("orientationchange", function() {
    productDetailResize();
}, false);



function productDetailResize() {
    var html = document.documentElement;
    var windowWidth = html.clientWidth;
    html.style.fontSize = windowWidth / 7.5 + 'px';
    var fixFooterHeight = $("footer").height();
    var windowHeight = $(window).height();
    $("#custiom-detail").height(windowHeight - fixFooterHeight);
    myScroll.refresh();
}
