

var myModule = angular.module('MyModule', []);
var orderid = api.getQueryString('orderid');
api.loginConfig.from = 'http://mdingzhi.uzai.com/order/index.html'
var iscompany;
var devicetype = api.getQueryString('devicetype');
var uid = api.getUserId();
myModule.controller('OrderDetail', ['$scope', '$http', function ($scope, $http) {
    var param = JSON.stringify({
        ID: orderid,
        UserId: uid
    });
    api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'GetOrderEntityByOrderID', param, function (obj) {
        if (obj.ErrorCode == 200||obj.ErrorCode==-3) {
        	if (obj.ErrorCode==-3) {
        	    api.toast('网络连接失败,请重试～');
        	    return ;
        	}
            $scope.values = JSON.parse(obj.JsonResult);

            $scope.UzaiOrderId = JSON.parse(obj.JsonResult).ID;
            if ($scope.values.IsCompany) {
                initcompany(true,$scope.values.OrderSourceType);
            }
            else {
                initcompany(false, $scope.values.OrderSourceType);
            }
            if ($scope.values.OrderSourceType == 1) //如果是u圈定制，名称改为对应的u圈定制名称
            {
                $scope.values.ProName = 'U圈定制-定制单';
            }
	    if($scope.values.IsDingZhiPro===true)
	    {
	      $(".main_headtitle a").click(function(){return false})
	    }
	    	if ($scope.values.StartCityName.indexOf("市")>0) {
	    		$scope.values.StartCityName = $scope.values.StartCityName.replace(/市/g,"");
	    	}
            $scope.values.StartCityName = $scope.values.StartCityName + "出发";
            if ($scope.values.State == '已取消') {
                orderstate(true);
            }else if($scope.values.State == '已成交'){
				$('.foot').hide();
				$('.main').css('padding-bottom','0rem');
                $('.main .cancel').hide();
			}
            else {
                orderstate(false);
            }
           // console.log($scope.values);
            // function loaded () {
            // 	myScroll = new IScroll('#wrapper', { mouseWheel: true });
            // }
            //window.onload=loaded;
        }
        else {
	    	if(obj.ErrorCode==-2){
			api.toast('您没有这个订单，请确认。', 3000);
			//setTimeout(andriodGoBack,2000);
			}
            console.log(obj.ErrorMsg);
        }
    });
    $scope.cancel_order = function () {
        $('.layer_main, .layer').show();
        $('.confirm').click(function () {
            var param = JSON.stringify({
                UzaiOrderId: $scope.UzaiOrderId,
				UserID:uid
            });
            api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'OrderCancle', param, function (obj) {
                if (obj.ErrorCode == 200||obj.ErrorCode==-3) {
                	if (obj.ErrorCode==-3) {
                		api.toast('网络连接失败,请重试～');
				 $('.layer_main, .layer').hide();
                		return ;
                	}
                   // console.log(obj);
                    orderstate(true);
                    $('.layer_main, .layer').hide();
                }
                else {
		   $('.layer_main, .layer').hide();
                    console.log(obj.ErrorMsg);
                }
            })
        })
        $('.cancel_').click(function () {
            $('.layer_main, .layer').hide();
        })
    }
}]);

function initcompany(flag,ordersourcetype) {
    if (flag) {
        //$('.main_m .title').innerHtml='企业定制';
        $('.main_detailed .n4').hide();
    }
    else {
        if (ordersourcetype == 1) {
            $('.main_m .title').html('U圈定制');
            api.setLocalStorage('dingzhiurl', 'http://mhome.uzai.com/membercenter/udingzhi.html');
        }
        else {
            $('.main_m .title').html('私人定制');
            api.setLocalStorage('dingzhiurl', 'http://mdingzhi.uzai.com');
        }
        $('.main_detailed .n1').hide();
        $('.main_detailed .n2').hide();
        $('.main_detailed .n4').hide();
    }

}
function orderstate(falg) {
    if (falg) {
        $('.headtitle .w_100 span').addClass('headtitle_cancel');
        $('.main_m .title').addClass('title_cancel');
        $('.main_m_t .n1').addClass('n1_cancel');
        $('.main_m_t .n2').addClass('n2_cancel');
        $('.main_m .adr').addClass('adr_cancel');
        $('.foot').hide();
        $('.main .cancel').show();
        $('.customer').addClass('customer_');
        $('.main').css('padding-bottom','0rem');
    }
    else {
        $('.main .cancel').hide();
    }
}

//---------------定位成功
//function showPosition(position) {
//    var latitude = position.coords.latitude;
//    var longitude = position.coords.longitude;

//    var point = new BMap.Point(longitude, latitude);
//    // 创建点坐标
//    var gc = new BMap.Geocoder();
//    gc.getLocation(point, function (rs) {
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
var pages = {
    Telephone_init: function () {
        $("#Telephone").attr("href", "tel:4000008888");
        //if (devicetype == 'ios' || devicetype == 'android') {
        //    var province = decodeURI(api.getLocalStorage('province'));
        //    if (province == "上海市" || province == "浙江省" || province == "安徽省" || province == "江苏省") {
        //        $("#Telephone").attr("href", "tel:4000008888");
        //    } else {
        //        $("#Telephone").attr("href", "tel:4000008888");
        //    }
        //}
        //else {
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
    returnUrl:function(){
    	api.setLocalStorage("ProductListURL",window.location.href);
    }
}
function andriodGoBack() {
    window.location.href = '../order/list.html';
}

pages.returnUrl();
