"use strict";
var app = angular.module('productApp', []);
var i = 1;
$('.wrapper_main').height($('.main_list').eq(0).outerHeight());
var mySwiper1=null;
var mySwiper2=null;


function my_scroll() {
    if (typeof myScroll === 'undefined') {
        window.myScroll = null;
        myScroll = new IScroll('#wrapper', {
            click: true,
            mouseWheel: true,
            probeType: 3
        });
    } else {
        myScroll.refresh();
    }

}

my_scroll();
setTimeout(function () {
    $('.wrapper_main').height($('.main_list').eq(0).outerHeight());
    my_scroll();
}, 1000);
var a = [];
var a_page_type = true;//是否继续加载
var typeId = -1;//分类id
typeId = api.getQueryString("typeId") == null ? -1 : parseInt(api.getQueryString("typeId"));
app.directive('loadMore', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
            window.y = 0;
            if (scope.$last === true) {


            }
            myScroll.on('scroll', function () {
                window.y = this.y;
                window.pointY=this.pointY;
                if (-this.y > $('.integral').height()) {
                    $('.pab').addClass('pab_show');
                } else {
                    $('.pab').removeClass('pab_show');
                }
            });
            $('#wrapper').on('touchmove touchend', function (event) {

                if(myScroll.pointY>=window.innerHeight-1){
                    myScroll.scrollTo(0, 0);
                    return false;
                }else if(myScroll.pointY<=0){
                    myScroll.scrollTo(0, myScroll.maxScrollY);
                    return false;
                }


            });
            $('#main').on('touchend', function () {

                if (y >= 4) {
                    for (var re = 0; re < a.length; re++) {
                        if (a[re] == i + 'undefined') {
                            a[re + 1] = 1;
                        }
                    }
                    a_page_type = true;
                    scope.loadMore(typeId, 1, true);
                }
                var h = $('#wrapper').height() - $('.integral').innerHeight() - $('.main_nav').innerHeight() - $('.wrapper_main1').innerHeight();
                if (h > 0) {
                    return;
                }
                if (-y + h >= 20) {
                    if (a_page_type) {
                        var page = 0;
                        var pagetype = true;
                        for (var l = 0; l <= a.length; l++) {
                            if (a[l] == i.toString()) {
                                a[l + 1] = parseInt(a[l + 1]) + 1;
                                page = a[l + 1];
                                pagetype = false;
                            }
                        }
                        if (pagetype) {
                            a.push(i.toString());
                            a[a.length] = 2;
                            page = a[a.length - 1];
                        }

                        scope.loadMore(typeId, page, true);
                    }

                }
                if (myScroll.directionY === 1) {
                    if (y <= -20 && y >= -$('.main_img').innerHeight()) {
                        myScroll.scrollTo(0, -$('.main_img').innerHeight(), 1000);
                    }
                }


            });
        }
    };
});
var pageIndex = 1;

app.controller('productCtrl', function ($scope, $http) {
    $scope.loadProduct = function () {
        // api.loading();
        LoadData($scope, $http, 1, -1, true);

    };
    $scope.searchProduct = function (id, isFirstLoad) {
        $('.main_nav').eq(0).find('li').eq($("#" + id).index()).addClass('active-nav').siblings().removeClass('active-nav');
        $('.main_nav').eq(1).find('li').eq($("#" + id).index()).addClass('active-nav').siblings().removeClass('active-nav');


        $('.main_list_1').removeClass('fadeInRight');//repeat加载完移除

        // $('.main_list_1').addClass('fadeInRight');
        a = [];//初始化分页
        typeId = id;

        LoadData($scope, $http, 1, id, isFirstLoad);
        a_page_type = true;
        myScroll.scrollTo(0, 0, 100)
        setTimeout(function(){
            $('.main_nav').eq(0).removeClass('pab_show');
        },100)


    };
    //加载更多
    $scope.loadMore = function (typeId, pageIndex, isRefeash) {
        LoadData($scope, $http, pageIndex, typeId, false, isRefeash);
    }
    $scope.Exchange = function (id) {
        window.location.href = "giftdetail.html?id=" + id + "&typeId=" + typeId;
    }
    if (typeId != null && typeId != undefined) {
        if (typeId === -1) {
            $scope.loadProduct();
        }
        else {

            var param1 = "{}";
            api.post($http, $scope, api.path.mhomelogic, 'Mall', 'GetMallProductType', param1, function (obj) {
                if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                    if (obj.ErrorCode === -3) {
                        api.toast('网络连接失败,请重试～');
                        return;
                    }
                    var result = JSON.parse(obj.JsonResult);
                    if ($scope.productTypes == undefined) {
                        $scope.productTypes = result;
                    }
                    setTimeout(function () {
                        $('.main_nav').eq(0).find('li').eq($("#" + typeId).index()).addClass('active-nav').siblings().removeClass('active-nav');
                        $('.main_nav').eq(1).find('li').eq($("#" + typeId).index()).addClass('active-nav').siblings().removeClass('active-nav');

                    }, 100);
                    setTimeout(function(){
                        mySwiper1 = new Swiper('.gallery-thumbs1', {
                            watchSlidesProgress: true,
                            watchSlidesVisibility: true,
                            slidesPerView: 3,
                            initialSlide:$("#" + typeId).index()
                        });

                        mySwiper2 = new Swiper('.gallery-thumbs', {
                            watchSlidesProgress: true,
                            watchSlidesVisibility: true,
                            slidesPerView: 3,
                            initialSlide:$("#" + typeId).index()
                        });
                    },200);


                } else {
                    api.toast(obj.ErrorMsg, 3000);
                }
            }, 0, false);
            $scope.searchProduct(typeId, true);

        }

    }
    else {
        $scope.loadProduct();
    }

});
var tArray = new Array();
var dataArray = new Array();

//加载数据
function LoadData(scopeObj, httpObj, pageIndex, typeId, IsFirstLoad, isRefeash) {

    var param = JSON.stringify({
        "PageIndex": pageIndex,
        "PageSize": 10,
        "ProductTypeId": typeId === -1 ? null : typeId,
        "UzaiMemberId": api.getUserId()
    });
    var isFlag = false;//是否该分类下首次加载
    if (pageIndex == 1 && !isRefeash) {
        for (var i = 0; i < tArray.length; i++) {
            if (typeId === tArray[i]) {

                scopeObj.productInfos = dataArray[i];
                isFlag = true;
            }
        }
    }

    if (isFlag == false) {

        api.post(httpObj, scopeObj, api.path.mhomelogic, 'Mall', 'GetMallProductList', param, function (obj) {
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                if (obj.ErrorCode === -3) {
                    api.toast('网络连接失败,请重试～');
                    return;
                }
                var result = JSON.parse(obj.JsonResult);
                if (scopeObj.productTypes == undefined) {
                    scopeObj.productTypes = result.typeList;
                }

                if (result.proList.length === 0) {
                    api.toast('没有更多数据～');
                    a_page_type = false;
                }
                if (scopeObj.productInfos == undefined) {
                    scopeObj.productInfos = result.proList;
                }
                else if (scopeObj.productInfos !== result.proList) {
                    if (pageIndex !== 1) {

                        for (var i = 0; i < result.proList.length; i++) {
                            scopeObj.productInfos.push(result.proList[i])
                        }
                    }
                    else {
                        scopeObj.productInfos = result.proList;
                    }
                }

                if (pageIndex === 1 && !isRefeash) {
                    tArray.push(typeId);
                    dataArray.push(scopeObj.productInfos);
                }

                scopeObj.MemberPoint = result.MemberPoint;
                //是否加载积分
                if (IsFirstLoad) {
                    jifen = result.MemberPoint;
                    b = setInterval(integral, 20);
                }

            } else {
                api.toast(obj.ErrorMsg, 3000);
            }
        }, 0, false);
    }
    else {
        api.endloading();

    }

}
var l = 0;
var jifen;
var b;
function integral() {
    l = l + Math.floor(jifen / 50);
    if (l >= jifen) {
        clearInterval(b);
        l = jifen;
    }
    $('#integral').html(l.toString());
}

app.directive('findDir', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {


            if (scope.$last === true) {

                setTimeout(my_scroll, 100);
                //加载分类拖动
                mySwiper1 = new Swiper('.gallery-thumbs1', {
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    slidesPerView: 3
                });
                //加载拖上去的分类拖动
                mySwiper2 = new Swiper('.gallery-thumbs', {
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    slidesPerView: 3
                });

                $('.main_list_1').removeClass('fadeInRight');

                $('.main_list_1').addClass('fadeInRight');


                setTimeout(function () {
                    lazy();

                }, 100);

            }
        }
    }
});

var mySwiper = new Swiper('.wrapper_main1', {

    onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素
        swiperAnimate(swiper); //初始化完成开始动画

    }
});


//图片延迟加载
function lazy() {
    var len = $('[data-url]');
    for (var i = 0; i < len.length; i++) {
        if (len.eq(i).offset().top < $('#wrapper').height() + $("header").height()) {
            len.eq(i).attr("src", len.eq(i).attr("data-url")).removeAttr('data-url');
        }
    }
}
myScroll.on('scrollEnd', lazy);

function androidGoBack() {
    window.location.href = '../membercenter/index.html';
}
