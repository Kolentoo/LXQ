'use strict';
var myApp = angular.module('myApp', []);
myApp.controller('MallOrderDetail', function($http, $scope) {
    'use strict';

    var param = JSON.stringify({
        "Id": api.getQueryString('Id')
    });
    $scope.isApp = api.isApp();

    api.post($http, $scope, api.path.mhomelogic, 'Mall', 'GetMallOrderInfo', param, function(obj) {
        var errorTxt = '暂无数据～';
        if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
            if (obj.ErrorCode === -3) {
                api.toast('网络连接失败,请重试～');
                $(".load-dialog").remove();
            }
            $scope.values = JSON.parse(obj.JsonResult);
            if(obj.ErrorMsg == '获取兑换详情失败!'){
              api.toast('获取兑换详情失败！');
            }else {
              $scope.mallOrderDetail = JSON.parse(obj.JsonResult);
            }
            $(".exchange").show();
        } else {
            api.toast(obj.ErrorMsg, 99999);
        }
    }, 3);

    //111

    $scope.JumpProductPage = function (Id, $event) {
        if ($scope.stopPropagation) {
            $event.stopPropagation();
        }
        //api.setLocalStorage("MallOrderListURL", window.location.href);
        window.location.href = "../mall/giftdetail.html?id=" + Id+"&orderId="+api.getQueryString('Id');
        //window.location = "http://mhome.uzai.com/Hybrid/MallOrder/Detail.html?Id=" + Id;
    }

    $scope.CopyExpressCode = function (ExpressCode) {
        bridge.copyExpress(ExpressCode);
        //api.toast('复制成功~');
    }
});
function androidGoBack()
{
    window.location.href = 'list.html';  
}
