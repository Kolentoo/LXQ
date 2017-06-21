var departureCityName = api.getQueryString('departureCityName');
api.setLocalStorage("departureCityName", encodeURI(departureCityName));
var myModule=angular.module('MyModule',[]);
myModule.controller('MyCtrl',['$scope','$http',function($scope,$http){
    $scope.departureCityName=departureCityName;
    var PageIndex=1;
    var param = JSON.stringify({
        "ActivityID":api.getQueryString('activityid')
    });
    api.post($http, $scope, api.path.dingzhilogic, 'UzaiMebActivity', 'GetActivityDetail', param, function(obj){
        if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
            if (obj.ErrorCode == -3)
            {
                api.toast(obj.ErrorMsg);
            }
            $scope.FilePath = JSON.parse(obj.JsonResult).FilePath;
            $scope.title_m=JSON.parse(obj.JsonResult).Title;
            var obj=JSON.parse(JSON.parse(obj.JsonResult).Content);
            var first_obj=obj;
            $scope.p=first_obj.ImageDescribe;
            $scope.src=first_obj.ImageUrl;
            $scope.values = obj;
        }
        else {
            api.toast(obj.ErrorMsg);

        }
    },3)
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
                    myScroll.on('scrollEnd', function(){
                        for(var i=0;i<$('img').length;i++){
                            if($('img').eq(i).offset().top<-myScroll.y+$('header').height()+$('#wrapper').height()){
                                $('img').eq(i).attr('src',$('img').eq(i).attr('data-src'))
                            }
                        }
                        my_scroll();
                    });
                    for(var i=0;i<$('img').length;i++){
                        if($('img').eq(i).offset().top<-myScroll.y+$('header').height()+$('#wrapper').height()){
                            $('img').eq(i).attr('src',$('img').eq(i).attr('data-src'))
                        }
                    }
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

function andriodGoBack(){
    window.location.href='../home/index.html';
}
