'use strict';
var myScroll;
$.fn.exchangeRecord=function(){
	function loadd() {
        myScroll = new IScroll('#wrapper', {
            scrollX: true,
            freeScroll: true,
            click: true,momentum:true });
        myScroll.on('scrollStart', scrollaction);
        myScroll.on('scrollEnd', scrollaction);
        myScroll.refresh();
        setTimeout(function() {
            lazy();
        }, 1000);
    }

    function scrollaction() {
        if (-this.y + $("#wrapper").height() - $(".recordlist").height() >0){
            $('button').eq(0).click();
        }
        setTimeout(function() {
            lazy();
        }, 1000);
    }

    function lazy() {
        var len = $("img").length;
        for (var i = 0; i < len; i++) {
            if ($("img").eq(i).offset().top < myScroll.y * -1 + $(window).height() - $("header").height() ){
                $("img").eq(i).attr("src", $("img").eq(i).attr("data-url"));
            }
        }
    }

    loadd();
}

window.onload = function() {
    $("#wrapper").exchangeRecord();
};

var myApp = angular.module('mallOrderApp', []);
var busy = false;
var pageIndex = 1;
var PageSize = 10;
var a = [];
myApp.controller('MallOrderList', function($http, $scope) {
    'use strict';

    var param = JSON.stringify({
        PageIndex: pageIndex,
        PageSize: PageSize,
        UzaiMemberId: api.getUserId()
    });
    $scope.LoadData=function(isRefeash){
        api.post($http, $scope, api.path.mhomelogic, 'Mall', 'GetMallOrderList', param, function(obj) {
            var errorTxt = '暂无数据～';
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                if (obj.ErrorCode === -3) {
                    api.toast('网络连接失败,请重试～');
                }
                if (JSON.parse(obj.JsonResult).length <= 0)
                {
                   // api.toast(errorTxt, 99999);
                    $(".nodata").show();
                }
                else
                {
                    $(".nodata").hide();
                }
                $scope.mallOrderList = JSON.parse(obj.JsonResult);
                if(!isRefeash)
                {
                    //var pagesY = 1 * ($(".recordlist li").eq(0).height()) *9 * -1;
                    setTimeout(function(){
                       //myScroll.scrollTo(0,pagesY);
                        myScroll.refresh();
                    },200);
                }

            } else {
                api.toast(errorTxt, 99999);
            }

        });
    };
    $scope.LoadData();
    $scope.fn1 = function() {
        if (busy) return;
        var liNum = $(".recordlist").children("li").length;
        if( liNum < 2){
          return false;
        }

        busy = true;

        pageIndex++;
        var param = JSON.stringify({
            PageIndex: pageIndex,
            PageSize: PageSize,
            UzaiMemberId: api.getUserId()
        });

        api.post($http, $scope, api.path.mhomelogic, 'Mall', 'GetMallOrderList', param, function(obj) {
            var errorTxt = '没有更多订单啦～';
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {

                if (obj.ErrorCode === -3) {
                    api.toast('网络连接失败,请重试～');
                }
                var items = JSON.parse(obj.JsonResult);
                busy = false;
                if (items.length <= 0)
                {
                    busy = true;//没有数据控制下载不加载数据了
                    api.toast(errorTxt, 2000);
                }
                for (var i = 0; i < items.length; i++) {
                    $scope.mallOrderList.push(items[i]);
                }
                var pageIndexs = pageIndex -1;
                var pagesY = pageIndexs * ($(".recordlist").children("li").eq(0).height() + 10) *9 * -1;
                setTimeout(function(){
                 // myScroll.scrollTo(0,pagesY);
                  myScroll.refresh();
                },200);

            } else {
                api.toast(errorTxt, 2000);
            }

        },3);

    };
    //下拉刷新
    $scope.pullDownRefeash=function(){
       /* myScroll.on('scroll', function () {
            window.y = this.y;
            window.pointY=this.pointY;

        });*/

        window.y = 0;
        $('#wrapper').on('touchend', function ()
        {
            window.y=myScroll.y;

            if (y >= 4)
            {
              //  api.loading();
                $scope.LoadData(true);
                var pagesY = 1 * ($(".recordlist").children("li").eq(0).height() + 10) *9 * -1;
                setTimeout(function(){

                    //myScroll.scrollTo(0,-pagesY);
                    myScroll.refresh();
                    y=0;
                },200);
            }

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
    $scope.JumpDetailPage = function (Id, $event) {
        if ($scope.stopPropagation) {
            $event.stopPropagation();
        }
        //api.setLocalStorage("MallOrderListURL", window.location.href);
        window.location.href = "detail.html?Id=" + Id;
    }
});

myApp.directive('repeatFinish', function (){
  return{
      restrict:'AE',
      link:function(scope,elm,attr){
          if(scope.$last===true)
          {
             /* myScroll = new IScroll('#wrapper', { scrollX: true, freeScroll: true, click: true });
              myScroll.on('scrollStart', scrollaction);
              myScroll.on('scrollEnd', scrollaction);
              myScroll.refresh();*/



          }
      }
  }
});
function androidGoBack()
{
    window.location.href = '../mall/mall.html';  
}

$(function(){
   // $(".nodata").css("margin-top",Math.round(window.innerHeight-$(".nodata").height())/2);
});