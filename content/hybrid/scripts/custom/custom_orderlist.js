var devicetype = api.getQueryString('devicetype');
api.loginConfig.from = 'http://mdingzhi.uzai.com';
var busy=false;
var myModule = angular.module('MyModule', []);
myModule.controller('MyCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.openOrderList = function () {
        //umini6 app
        if (devicetype == 'ios') {
            api.invoke('action.openorderlist', '');
        } else if (devicetype == 'android') {
            window.action.exec('openorderlist', '');
        }
        else {
            location.href = 'http://u.uzai.com/mobile/order';
        }

    };



    var PageIndex = 1;
    //kyle  2015-05-03
    var uid=api.getUserId();
    var Phone=api.getValue("Mobile",api.getCookie('user'));
    if (Phone==""||Phone==null) {
    	Phone=api.getValue("Email",api.getCookie('user'));
    }
	var param = JSON.stringify({
		"userid":uid,
		"PageIndex":PageIndex,
		"PageSize":10
	});

	api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'GetOrderList', param, function(obj){
		if (obj.ErrorCode == 200||obj.ErrorCode==-3) {
			if (obj.ErrorCode==-3) {
				api.toast('网络连接失败,请重试～');
					return false;
			}
			$scope.values = JSON.parse(obj.JsonResult);
			if($scope.values.length==0){
				api.toast('没有更多订单啦～', 3000);
			}
			for (var i = $scope.values.length - 1; i >= 0; i--) {
			    if ($scope.values[i].OrderSourceType == 1) //如果是u圈定制，名称改为u圈定制
			    {
			        $scope.values[i].ProName = 'U圈定制-定制单';
			    }
			 	if($scope.values[i].Enable<7)
			 	{
			 		$scope.values[i].Enable=0;
			 	}
			 	if($scope.values[i].Enable==7)
			 	{
			 		$scope.values[i].Enable=1;
			 	}
			 	if ($scope.values[i].Enable==9) {
			 		$scope.values[i].Enable=2;
			 	}
			}
		}
		else {
			console.log(obj.ErrorMsg);
		}
	})

	$scope.loadMore=function(){
		if (busy) {
			return;
		}

		PageIndex++;
		var param = JSON.stringify({
			"userid":api.getUserId(),
			"PageIndex":PageIndex,
			"PageSize":10
		});
		api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'GetOrderList', param, function(obj){
			if (obj.ErrorCode == 200||obj.ErrorCode==-3) {
				if (obj.ErrorCode==-3) {
					api.toast('网络连接失败,请重试～');
					return false;
				}
				if(JSON.parse(obj.JsonResult).length==0){
					busy=true;
					api.toast('没有更多订单啦～',3000);
					return false;
				}else {
					busy=false;
					for (var i = 0; i < JSON.parse(obj.JsonResult).length; i++) {
					    if (JSON.parse(obj.JsonResult[i]).OrderSourceType == 1) //如果是u圈定制，名称改为u圈定制
					    {
					        JSON.parse(obj.JsonResult[i]).ProName = 'U圈定制-定制单';
					    }
					    $scope.values.push(JSON.parse(obj.JsonResult)[i])

					}
				}
			}
			else {
				return false;
			}
		})
	}
	$scope.dingzhiurl=function()
	{
		var gourl=document.referrer;
	    var url = api.getLocalStorage('dingzhiurl');
		if(gourl==='http://mdingzhi.uzai.com/')
		{
			window.location.href = '../home/index.html';
		}
		else
		{
			if (url != null && typeof (url) != 'undefined' && url != '') {
				window.location.href = url;
			}
			else {
				window.location.href = '../home/index.html';
			}
		}
	}
}]);

myModule.directive('onFinishRender',onFinishRenderDirective);



function onFinishRenderDirective($timeout) {
	return {
		restrict: 'AE',
		link: function(scope) {
			if (scope.$first === true) {
				//window.alert('First thing about to render');
			}
			if (scope.$last === true) {
				$timeout(function() {
					my_scroll();
				});
			}
		}
	};
}
function my_scroll(){
	if(typeof myScroll==='undefined'){
		window.myScroll=null;
		myScroll = new IScroll('#wrapper', {
			mouseWheel: true,
			click:true
		});
	}else{
		myScroll.refresh();
	}
}
myModule.directive('whenScrolled', function() {
	return function(scope, elm, attr) {
		var raw = elm[0];
		myScroll = new IScroll('#wrapper', {
			mouseWheel: true,
			click:true
		});
		myScroll.on('scrollEnd', function () {
			if ( -this.y+$('#wrapper').height()-$('.main').innerHeight()>=0){
				scope.$apply(attr.whenScrolled);
			}
		})
	};
});

function andriodGoBack(){
	window.location.href='../home/index.html';
}
