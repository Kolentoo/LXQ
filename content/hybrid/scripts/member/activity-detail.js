
'use strict';
var activityId = api.getQueryString('id');
var cityId=api.getQueryString('cityId');
var source = api.getQueryString('source');
var app = angular.module('myApp', []);

app.controller('actCtrl', function ($scope, $http) {

    var param = JSON.stringify({
        "ActivityId": activityId
    });
    api.post($http, $scope, api.path.mhomelogic, 'MemberCenter', 'GetMemberActivityInfo', param, function (obj) {
        if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
            if (obj.ErrorCode === -3) {
                api.toast(obj.ErrorMsg);

            }
            var result = JSON.parse(obj.JsonResult);
            $scope.ActivityInfo = result;
            $scope.Contents = JSON.parse(result.Content);
        }
        else {
            api.toast(obj.ErrorMsg);
        }
    });
    $scope.back=function()
    {
        if (source !== '' && typeof (source) !== 'undefined' && source !== null)
        {
            window.location.href = '../membercenter/index.html';
        }
        else
        {
            api.setLocalStorage("cityId", cityId);
            window.location.href = 'activitylist.html';
        }
    }
}, 0, false);

app.directive('findDir', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
            if (scope.$last === true) {
                var eventDetai = (function () {


                    var myScroll,
                        j_header = document.getElementById('j_header');
                    // 页面加载iscroll 插件
                    function loadd() {
                        myScroll = new IScroll('#j_wrapper', { scrollX: true,
                            freeScroll: false,
                            click: true,
                            bounce:false,lockDirection:false
                        });
                        myScroll.on('scroll', scrollaction);
                        myScroll.on('scrollEnd', scrollaction);
                        myScroll.refresh();
                        setTimeout(function () {
                            lazy();
                            myScroll.refresh();
                        }, 1000);
                        $('#j_wrapper').on('touchend', function (){
                            if(myScroll.pointY>=window.innerHeight-1){
                                myScroll.scrollTo(0, 0);
                                return false;
                            }else if(myScroll.pointY<=0){
                                myScroll.scrollTo(0, myScroll.maxScrollY, 100);
                                return false;
                            }
                        }).on('touchmove',function(){
                            if(myScroll.pointY>=window.innerHeight-1){
                                myScroll.scrollTo(0, 0);
                                return false;
                            }else if(myScroll.pointY<=0){
                                myScroll.scrollTo(0, myScroll.maxScrollY, 100);
                                return false;
                            }
                        });
                    }
                    //滚动执行懒加载
                    function scrollaction() {
                        setTimeout(function () {
                            lazy();
                        }, 1000);
                    }
                    //懒加载方法
                    function lazy() {

                        var imgs = document.getElementsByTagName('img');

                        for (var i = 0; i < imgs.length; i++) {
                            if (imgs[i].offsetTop < myScroll.y * -1 + window.innerHeight - j_header.offsetHeight) {
                                imgs[i].setAttribute('src', imgs[i].getAttribute('data-url'));
                            }
                        }

                    }


                    return loadd();

                })();
            }
        }
    }
})
function androidGoBack()
{
    if (source !== '' && typeof (source) !== 'undefined' && source !== null)
	{
        window.location.href = '../membercenter/index.html';
	}
	else
	{
        window.location.href = 'activitylist.html';
	}

}
