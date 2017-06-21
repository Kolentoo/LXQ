var pageIndex = 1;
var busy = false;
var myScroll;
var uzaiApp = angular.module('uzaiApp', []);
var devicetype = api.getQueryString('devicetype');

uzaiApp.controller('IndexController', function($http, $scope) {
    var param = JSON.stringify({
        QueryType: api.getQueryString('dingzhitype'),
        QueryValue: api.getQueryString('dingzhivalue'),
        PageIndex: pageIndex,
        PageSize: 10
    });


    api.post($http, $scope, api.path.dingzhilogic, 'UzaiProduct', 'GetProductList', param, function(obj) {

        var errorTxt = '暂无数据～';
        if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
            if (obj.ErrorCode == -3) {
                api.toast('网络连接失败,请重试～');
            }
            if (JSON.parse(obj.JsonResult).UzaiProductList.length <= 0) {
                api.toast(errorTxt, 99999);
            }
            $scope.products = JSON.parse(obj.JsonResult).UzaiProductList;
            
            setTimeout(function() {
                $(".load-dialog").remove();
            }, 0);

        } else {
            api.toast(errorTxt, 99999);
            setTimeout(function() {
                $(".load-dialog").remove();
            }, 0);
        }
        list_tdk();

    }, 3);


    $scope.JumpPage = function (LinkUrl, ProductID, $event) {
        if ($scope.stopPropagation) {
            $event.stopPropagation();
        }
        if (LinkUrl != null && LinkUrl != "") {
            var jumpParam = encodeURI(JSON.stringify({
                ClassId: '跟团游',
                ProductId: ProductID
            }));
            if (devicetype == 'ios') {
                api.invoke('action.opendetail', jumpParam);
            } else if (devicetype == 'android') {
                window.action.exec('opendetail', jumpParam);
            }
            else {
                window.location.href = LinkUrl;
            }
        } else {
            api.setLocalStorage("ProductListURL", window.location.href);

            window.location.href = "detail.html?ProductID=" + ProductID;
        }
    }


    $scope.fn1 = function() {
        if (busy) return;
        var liNum = $("#scroller").children("li").length;
        if( liNum < 2){
          return false;
        }

        busy = true;

        pageIndex++;
        var param = JSON.stringify({
            QueryType: api.getQueryString('dingzhitype'),
            QueryValue: api.getQueryString('dingzhivalue'),
            PageIndex: pageIndex,
            PageSize: 10
        });
        api.post($http, $scope, api.path.dingzhilogic, 'UzaiProduct', 'GetProductList', param, function (obj) {

            var errorTxt = '没有更多产品啦～';
            if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {

                if (obj.ErrorCode == -3) {
                    api.toast('网络连接失败,请重试～');
                }
                var items = JSON.parse(obj.JsonResult).UzaiProductList;
                busy = false;
                if (items.length <= 0)
                {
                    busy = true;//没有数据控制下载不加载数据了
                    api.toast(errorTxt, 2000);
                }
                for (var i = 0; i < items.length; i++) {
                    $scope.products.push(items[i]);
                }

                var pageIndexs = pageIndex -1;
                var pagesY = pageIndexs * ($("#scroller").children("li").eq(0).height() + 10) *9 * -1;
                setTimeout(function(){
                  myScroll.scrollTo(0,pagesY);
                  myScroll.refresh();
                },200);

            } else {

                api.toast(errorTxt, 2000);

            }

        },0);

    };

    $scope.isEven = function (url) {
        if (url == null || url == "") {
            return false;
        }
        else {
            return true;
        }
    }


});


uzaiApp.directive('onFinishRender', onFinishRenderDirective);
//html转义
uzaiApp.filter('trustHtml', function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    };
});

function onFinishRenderDirective($timeout) {
    return {
        restrict: 'A',
        link: function (scope) {
            if (scope.$last === true) {
                $timeout(function () {
                    m_scroll();
                });
            }
        }
    };
}


function m_scroll() {
    //先设置高度。。
    var fixFooterHeight = $("header").height();
    var windowHeight = $(window).height();
    $("#pList").height(windowHeight - fixFooterHeight);
    //再生成滚动
    myScroll = new IScroll('#pList', {
        mouseWheel: true,
        click: true

    });
    myScroll.on('scroll', staticTitle);
    myScroll.on('scrollEnd', staticTitle);
    myScroll.refresh();
}

function staticTitle() {
    if (-this.y + $("#pList").height() - $(".conul").height() >= 0) {

        $('button').eq(0).click();

    }
}

// 列表页tdk
function list_tdk() {
    var tdk = {
        val: api.getQueryString('keyworld')
    };
    tdk.val = decodeURI(tdk.val);
    if (tdk.val == null || tdk.val == "" || tdk.val == undefined) {
        tdk.val = '悠哉';
    }else {
      $("header").find(".title").children("h1").html(tdk.val+'\u4ea7\u54c1');
    }
    $("title").html(tdk.val + "定制游_" + tdk.val + "定制旅游-众信悠哉旅游");
    $("[name='keywords']").attr("content", tdk.val + "定制旅游," + tdk.val + "定制游," + tdk.val + "定制旅行");
}

//要做的返回操作，与左上角的返回相同
function andriodGoBack(){
  window.location.href = 'http://mdingzhi.uzai.com/';
}

window.addEventListener("orientationchange", function() {
    productListResize();
}, false);


function productListResize() {
  var fixFooterHeight = $("header").height();
  var windowHeight = $(window).height();
  $("#pList").height(windowHeight - fixFooterHeight);
    myScroll.refresh();
}
