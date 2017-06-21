var myScroll = (function () {
    'use strict';
    var mhome = angular.module('mhome', []);
    mhome.controller('mhomeController', function ($http, $scope) {
        var param = JSON.stringify({});

        api.post($http, $scope, api.path.mhomelogic, 'MemberCenter', 'GetExclusiveGroupListById', param, function (obj) {
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                if (obj.ErrorCode === -3) {
                    api.toast('网络连接失败,请重试～');
                }
                else {
                    $scope.grouplist = JSON.parse(obj.JsonResult);
                }
            }
            else {
                api.toast(obj.ErrorMsg);
            }
        });
        $scope.uproduct = function (productype, productid) {
            bridge.openProduct(productype, productid);
        };
        $scope.dingzhijump = function (udingzhitype) {
            bridge.openDingzhi(udingzhitype);
        };

    });

    function onFinishRenderDirective($timeout) {
        return {
            restrict: 'A',
            link: function (scope) {
                if (scope.$last === true) {
                    $timeout(function () {
                        myScroll.refresh();
                    });
                    myScroll.on('scroll', function () {
                        if (this.y < -50) {
                            $(".title_img").show();
                        }
                        else {
                            $(".title_img").hide();
                        }
                    });
                }

            }
        };
    }

    mhome.directive('onFinishRender', onFinishRenderDirective);
    var myScroll = new IScroll('#wrapper', {
        click: true,
        mouseWheel: true,
        probeType: 3//表明可以监听滚动事件
    });
    return myScroll;

})();

function androidGoBack() {
    window.location.href = '../membercenter/index.html';
}
