"use strict";
var app = angular.module('submitOrderApp', []);

$('.receive_m span').click(function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    $('.main_m .switch').eq($(this).index()).show().siblings().hide();
   // bodyHeight = $(".body").height();
   /* if($(this).index()===1)
    {
        $("#chosed_store_name").html("");
        $("#store_map").hide();
        $("#choseTip").show();
    }*/
});
$('.return').click(function () {
    $('.w_15').animate({ 'margin-left': '0rem' });
    $('header').eq(0).show();
    $('header').eq(1).hide();
    $('.info_f').show();
})


app.controller('submitOrderCtrl', ['$scope', '$http', function ($scope, $http) {
    var id = api.getLocalStorage("id");
    var attr = api.getLocalStorage("attribute");
    var num = api.getLocalStorage("num");//购买个数
    var param = JSON.stringify({
        "Id": id,
        "UtourMemberId": api.getUserId()
    });
    api.post($http, $scope, api.path.mhomelogic, 'Mall', 'GetMallProductInfo', param, function (obj) {
        if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
            if (obj.ErrorCode === -3) {
                api.toast(obj.ErrorMsg);
            }
            var result = JSON.parse(obj.JsonResult);
            //礼品详情
            $scope.ProductInfo = result.mallProduct;
            $scope.ProductImg = result.mallProduct.MallProductPic.split('|')[0];
            $scope.NeedPoints = num * result.mallProduct.MallProductScore;
            $scope.Domain = result.UzaiImgDomain;
            var address = result.mallProduct.Admin === "许晔" ? "上海" : "北京";

            if(address==="上海")
            {
                $(".receive_m").find("span").eq(1).hide();
            }
        }
        else {
            api.toast(obj.ErrorMsg);
        }
    }, 0, false);

    $scope.Attr = attr.replace(/\$/g, ' ');
    $scope.Number = num;
    $scope.ProductId = id;
    //加载门店
    $scope.LoadSupplierStore = function () {
        api.post($http, $scope, api.path.mhomelogic, 'Mall', "GetSupplierStore", param, function (obj) {
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                if (obj.ErrorCode === -3) {
                    api.toast(obj.ErrorMsg);
                }
                var result = JSON.parse(obj.JsonResult);
                $scope.Citys = result.listCity;
                $scope.StoreMapDomain=result.StoreMapDomain;
                if (result.listCity.length > 0) {
                    $scope.Areas = result.listCity[0].listArea;
                    if (result.listCity[0].listArea.length > 0) {
                        $scope.Stores = $scope.Areas[0].listStore;
                    }
                }
                //初始值
                $scope.selected = $scope.Citys[0].UzaiCity;
                $scope.areaSelected = $scope.Areas[0].AreaName;
                $('.w_15').animate({ 'margin-left': '-7.5rem' });
                $('header').eq(0).hide();
                $('header').eq(1).show();
                $('.info_f').hide();
            }
            else {
                api.toast(obj.ErrorMsg);
            }
        });
    };
    //选择城市加载对应区域
    $scope.LoadArea = function () {
        var cityId = $scope.selected;
        var cityArr = $scope.Citys;
        for (var i = 0; i < cityArr.length; i++) {
            if (cityId === cityArr[i].UzaiCity) {
                $scope.Areas = cityArr[i].listArea;
            }
        }
        $scope.areaSelected = $scope.Areas[0].AreaName;

        for (var i = 0; i < $scope.Areas.length; i++) {
            if ($scope.Areas[0].AreaName === $scope.Areas[i].AreaName) {
                $scope.Stores = $scope.Areas[i].listStore;
            }
        };
    }
    //选择区域加载对应门店
    $scope.LoadStore = function () {
        var areaName = $scope.areaSelected;
        var areaArr = $scope.Areas;
        for (var i = 0; i < areaArr.length; i++) {
            if (areaName === areaArr[i].AreaName) {
                $scope.Stores = areaArr[i].listStore;
            }
        };
        $(".body").css("height", "");
    };
    $scope.submitForm = function () {

        if ($scope.myForm.user.$viewValue === undefined || $scope.myForm.user.$viewValue==="") {
            api.toast('姓名不能为空');
            return false;
        }
        if ($scope.myForm.user.$viewValue.length < 2) {
            api.toast('姓名不合法');
            return false;
        }
        if ($scope.myForm.user.$viewValue.length > 10) {
            api.toast('姓名过长');
            return false;
        }
        if ($scope.myForm.mobile.$viewValue === undefined || $scope.myForm.mobile.$viewValue==="") {
            api.toast('手机号码不能为空');
            return false;
        }
        var reP = new RegExp(/^1[3|4|5|8|7][0-9]\d{4,8}$/);
        if (!$scope.myForm.mobile.$valid || !reP.test($scope.myForm.mobile.$viewValue)) {
            api.toast('手机号码错误');
            return false;
        }
        if ($scope.myForm.add.$viewValue === undefined || $scope.myForm.add.$viewValue==="") {
            api.toast('地址不能为空');
            return false;
        }
        if ($scope.myForm.add.$viewValue.length>200) {
            api.toast('收货地址太长！');
            return false;
        }
        Save($scope, $http, attr);
    };
    //提交订单
    $scope.submitForm2 = function () {
        if ($("#chosed_store_name").html() === "") {
            api.toast('请选择门店！');
            return false;
        }
        Save($scope, $http, attr);

    }
    $scope.back=function(){
        location.href="submitorder.html";
    }

}]);
//提交生成订单
function Save(scope, http, attr) {
    var sendType = 0;
    $(".receive_m span").each(function (index) {
        if ($(this).hasClass("selected")) {
            sendType = $(this).attr("send-type");
        }
    });
    //门店地址
    var storeAddress = $(".main_select_m.hover").find(".add").eq(0).html();
    //门店名称
    var storeName=$(".main_select_m.hover").find(".title").eq(0).html();
    //门店电话
    var storePhone=$(".main_select_m.hover").find(".mobile").eq(0).html();
    var address=scope.myForm.add.$viewValue;
    var addressee=scope.myForm.user.$viewValue;
    var phone=scope.myForm.mobile.$viewValue;
    //自取1,快递2
    if(sendType==="1")
    {
        address=storeAddress;
        addressee=storeName;
        phone=storePhone;
    }
    var param = JSON.stringify({
        "UserId": api.getUserId(),
       // "UserId": 1791163,
        "ExchangeCount": parseInt(scope.Number),
        "ProductId": parseInt(scope.ProductId),
        "Address": address,//1自取。2是邮寄
        "Addressee": addressee,
        "Attributes": attr,
        "Phone": phone,
        "ZCode": "",
        "SendType": parseInt(sendType)
    });
    //提交订单
    api.post(http, scope, api.path.mhomelogic, 'Mall', "InsertExchangeOrder", param, function (obj) {
        if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
            if (obj.ErrorCode === -3) {
                api.toast(obj.ErrorMsg);
            }
            window.location = "/mallorder/detail.html?Id=" + obj.JsonResult;
        }
        else {
            api.toast(obj.ErrorMsg);
        }
    }, 0, false);

}
//var bodyHeight = 0;
app.directive('findDir', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
            if (scope.$last === true) {
              //  $(".main").find(".main_select_m").eq(0).addClass("hover");

            }

            $('.main_select_m').click(function () {
                $(this).addClass('hover').siblings().removeClass('hover');
                $('.w_15').animate({ 'margin-left': '0rem' });
                $('header').eq(0).show();
                $('header').eq(1).hide();
                $('.info_f').show();
                $("#chosed_store_name").html($(this).find(".title").eq(0).html());
                var mapSrc=$(this).find(".map").eq(0).val();
                if(mapSrc!==undefined && mapSrc!==null)
                {
                    $("#store_map").show();
                    $("#store_map").attr("src",mapSrc);

                }
                $("#choseTip").hide();
                //$(".body").height(bodyHeight);
                //$(".body").css('height','auto');
                document.body.scrollTop=0;//回到顶部
            });

        }
    }
});

function andriodGoBack() {
    window.location.href = 'giftdetail.html?id=' + api.getLocalStorage("id");
}

$(function(){
    var userAgent = window.navigator.userAgent,
        ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/);
     if(navigator.userAgent.indexOf('UCBrowser') > -1 && ios)
     {
         $(".info_f").css("position","absolute");
     }
})
