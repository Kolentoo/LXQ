"use strict";
var app = angular.module('giftDetailApp', []);
app.controller('giftDetailCtrl', ['$scope', '$http', function ($scope, $http) {
    var id = api.getQueryString('id');
    var param = JSON.stringify({
        "Id": id,
        "UzaiMemberId": api.getUserId()

    });
    api.post($http, $scope, api.path.mhomelogic, 'Mall', 'GetMallProductInfo', param, function (obj) {

        if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
            if (obj.ErrorCode === -3) {
                api.toast(obj.ErrorMsg);
            }
            var result = JSON.parse(obj.JsonResult);
            //礼品详情
            $scope.ProductInfo = result.mallProduct;
            $scope.ProdutDesc = result.mallProduct.MallProductDescribe.replace(/src/ig, 'url-src');
            //会员积分
            $scope.MemberPoints = result.MemberPoint;
            $scope.price = result.mallProduct.MallProductScore;
            $scope.ImgPath = result.UzaiImgDomain;
            $scope.Address = result.mallProduct.Admin == "许晔" ? "上海" : "北京";
            $scope.ProductAttributes = JSON.parse(result.mallProduct.Attributes);
            if($scope.ProductAttributes.length===0)
            {
                $(".specifi").hide();
            }
            if (result.mallProduct.MallProductPic !== null) {
                $scope.ProductImgList = result.mallProduct.MallProductPic.split('|');
            }
            $scope.FirstImg = $scope.ProductImgList[0];
            //产品库存
            $scope.ProductStock = result.mallProductStock;
            setTimeout(function(){
                my_scroll();
                lazy();
            },1000);

        }
        else {
            api.toast(obj.ErrorMsg);
        }
        $('.black-ico_').show();
    }, 0, false);
    //图片预览
    $scope.preview = function (obj) {
        $.layer_img(obj.$$watchers[0].last);
    }
    $scope.number = 1;
    //减数量
    $scope.reduce = function () {
        var num = parseInt($("#buyNum").html());
        $scope.number = num-- <= 1 ? 1 : num;
        if($scope.number===1)
        {
            $(".reduce").removeClass("red");
        }
        if($scope.number<parseInt($('#total').html()))
        {
            $(".plus").removeClass("dust");
        }
    };
    //加数量
    $scope.plus = function () {
        var num = parseInt($("#buyNum").html());
        if(parseInt($('#total').html())===0)
        {
            $scope.number=1;
        }
        else
        {
            $scope.number = num++ >= parseInt($('#total').html()) ? parseInt($('#total').html()) : num;
        }
        if($scope.number>1)
        {
            $(".reduce").addClass("red");
        }
        if($scope.number===parseInt($('#total').html()))
        {
            $(".plus").addClass("dust");
        }
        // $("#buyNum").html(num);
    };
    //提交订单
    $scope.SubmitOrder = function () {
        var choseTxt = "$";
        var flag = true;

        var needPoint = $scope.number * $scope.price;
        if (needPoint > $scope.MemberPoints) {
            api.toast("您的积分不足，无法兑换该商品！", 1500);
            flag = false;
            return;
        }
        if ($("#total").html() < $scope.number) {
            api.toast("对不起，库存不足无法兑换！", 1500);
            flag = false;
            return;
        }
        $('.specifi .ov').each(function () {
            var isChose = false;

            $(this).find(".a").each(function () {
                if ($(this).hasClass("selected")) {
                    choseTxt += $(this).html() + "$";
                    isChose = true;
                }
            });
            if (isChose == false) {
                api.toast("请选择规格！", 1500);
                flag = false;
                return;
            }
        });
        if (flag) {
            //choseTxt=choseTxt.substring(choseTxt.lastIndexOf('|')-1);
            api.setLocalStorage("attribute", choseTxt);//规格
            api.setLocalStorage("num", $scope.number);//数量
            api.setLocalStorage("id", id);
            window.location = "SubmitOrder.html";
        }


    };
    $scope.back = function () {
       /* var typeId = api.getQueryString("typeId");
        var orderId = api.getQueryString("orderId");
        if (typeId != null && typeId != undefined) {
            location.href = "Mall.html?typeId=" + typeId;
        }
        else {
            location.href = "../mallorder/detail.html?Id=" + orderId;
        }*/
        BackUrl();
    }

}]);

//富文本转化
app.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
        my_scroll();
    };
});

var imagesrc = '';

//图片加载完执行
app.directive('imgFinish', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
            if (scope.$last === true) {
                //my_scroll();
                setTimeout(function () {
                    var mySwiper = new Swiper('.swiper-container', {
                        lazyLoading : true,
                        loop: true,
                        pagination: '.swiper-pagination',
                        // paginationClickable: true,
                        autoplay: 5000,    //可选选项，自动滑动
                        autoplayDisableOnInteraction: false
                    });
                }, 500);

                setTimeout(function () {
                    //查找详细说明中图片添加点击事件
                    $(".main_detail").find("img").click(function () {
                        var isShow=true;//是否显示图片
                        $('.layer-loading').show();
                        imagesrc = $(this).attr("src");
                        //去掉压缩尺寸
                        imagesrc=imagesrc.substring(0,imagesrc.lastIndexOf('?'));
                        //添加拖动图片放大js
                        if (!$('div').hasClass('uzai_layer'))$('<div class="uzai_layer"></div>').appendTo('BODY');
                        $('.uzai_layer').show();

                        $('#layer_img').attr('src', imagesrc);
                        //遮罩点击
                        $(".uzai_layer").click(function(){
                            $('.layer-loading').hide();
                            $('#layer_img').hide();
                            $(this).hide();
                            isShow=false;
                        });
                        $('#layer_img').load(function(){
                            $('.layer-loading').hide();
                            setTimeout(function () {
                                var new_element = document.createElement("script");
                                new_element.setAttribute("type", "text/javascript");
                                new_element.setAttribute("src", "http://r03.uzaicdn.com/content/hybrid/scripts/member/hammerpluin.js");
                                document.body.appendChild(new_element);
                                if(isShow && !$(".uzai_layer").is(':hidden'))
                                {
                                    $('.layer-img').fadeIn(500);
                                }

                            }, 200);

                        })



                    });

                }, 1000);

                var count = 0;
                //取消
                $(".cancel_img").click(function () {
                    count = 0;

                    $('.keep').hide();


                });
                //保存图片
                $(".keep_img").click(function () {
                    count = 0;
                    bridge.saveAlbum(imagesrc);
                    $('.keep').hide();

                });

                myScroll.on('scroll', function () {
                    window.y = this.y;
                    if (-this.y > $('.black-ico_').height()) {
                        $('.black-ico_').hide();
                    } else {
                        $('.black-ico_').show();
                    }
                });
            }
        }
    }
});


app.directive('findDir', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
            if (scope.$last === true) {
                //初始加载选择的规格
                var _chosedTxt = "";
                var _searchTxt = "$";
                setTimeout(function () {
                    $(".specifi").find(".selected").each(function () {
                        if ($(this).hasClass("selected")) {
                            _chosedTxt += $(this).html() + " ";
                            _searchTxt += $(this).html() + "$";
                        }
                    });
                    ShowStock(scope, _searchTxt);
                    $('#specifi').html(_chosedTxt);
                }, 1000);
                //立即兑换按钮
                $("#btnExchange").click(function () {
                    $('.uzai_layer1').show();
                    var firstObj = $('.specifi').find(".ov").eq(0).find(".a").eq(0);
                    firstObj.addClass("selected");
                    ClickAttr(firstObj, scope);
                    $("#layer_img").hide();
                    $(".uzai_layer").hide();
                    $('.layer-loading').hide();
                });
                //点击选择的规格
                $('.specifi .ov .a').click(function () {
                    $(this).parent().nextAll().each(function () {
                        $(this).find('.a').removeClass('selected');
                    });
                    ClickAttr(this, scope);
                });

                my_scroll();

            }
        }
    }
});

//点击某个属性根据库存判断下一级属性是否显示
function ClickAttr(obj, scope) {
    $(obj).parent().nextAll().each(function () {
        $(obj).find('.a').removeClass('selected');
    })
    $(obj).addClass('selected').siblings().removeClass('selected');
    var chosedTxt = "";
    var searchTxt = "$";
    $(".specifi").find(".a").each(function () {
        if ($(this).hasClass("selected")) {
            chosedTxt += $(this).html() + " ";
            searchTxt += $(this).html() + "$";

        }

    });
    $('#specifi').html(chosedTxt);
    var parentIndex = $(obj).parent().attr("attr-index");
    var currAttributes = $(obj).html();
    var hasNum = 0;//每个属性下存在个数
    //找到点击当前结点下一层属性
    $(obj).parent().next().find(".a").each(function () {
        var isHas = false;
        for (var i = 0; i < scope.ProductStock.length; i++) {
            var obj = scope.ProductStock[i].Attributes;
            var arr = obj.substr(1).substring(0, obj.lastIndexOf('$') - 1).split('$');

            var nextIndex = parseInt(parentIndex) + 1;

            var gg = $(this).html();
            var m = 0;//记录点击该元素及以上每个规格是否相同的数量
            var s = 0;//被选中项循环次数
            $(".specifi").find(".selected").each(function (index) {

                if ($(this).html() === arr[index]) {
                    var n = parseInt(index) + 1;
                    m++;
                }
                s = index;
            });

            s = s + 1;
            if (s === m) {
                if (gg === arr[nextIndex]) {
                    isHas = true;
                }
            }
        }
        if (isHas === false) {

            // $(this).hide();
            $(this).addClass("noclick").removeClass("allowclick");
        }
        else {
            //$(this).show();
            $(this).removeClass("noclick").addClass("allowclick");
            hasNum++;
        }


    });
    /* if(hasNum>0)
     {
     $(obj).parent().next().hide();
     }
     else
     {
     $(obj).parent().next().show();
     }*/
    ShowStock(scope, searchTxt);
}
//根据选择的规格标签显示对应的库存
function ShowStock(scope, searchTxt) {

    var attrArray = searchTxt.substr(1).substring(0, searchTxt.lastIndexOf('$') - 1).split('$');
    var flag = false;
    var allStock = 0;
    //初始加载第一类属，性判断每个属性是否有库存
    $('.specifi .ov').eq(0).find(".a").each(function () {
        var _flag = false;
        for (var i = 0; i < scope.ProductStock.length; i++) {
            var dataArray = scope.ProductStock[i].Attributes.substr(1).substring(0, scope.ProductStock[i].Attributes.lastIndexOf('$') - 1).split('$');

            if ($(this).html() === dataArray[0]) {

                _flag = true;
                continue;
            }
        }
        //没有库存
        if (_flag == false) {
            // $(this).hide();
            $(this).addClass("noclick").removeClass("allowclick");
        }
        else {
            //$(this).show();
            $(this).removeClass("noclick").addClass("allowclick");
        }
    });
    for (var i = 0; i < scope.ProductStock.length; i++) {
        var dataArray = scope.ProductStock[i].Attributes.substr(1).substring(0, scope.ProductStock[i].Attributes.lastIndexOf('$') - 1).split('$');
        //选择属性是否完全相同
        if (searchTxt === scope.ProductStock[i].Attributes) {

            $("#total").html(scope.ProductStock[i].AllStock - scope.ProductStock[i].AllExchangeCount);
            return;
        }
        else {
            var num = 0;
            for (var j = 0; j < attrArray.length; j++) {

                if (attrArray[j] === dataArray[j]) {
                    num++;
                }
            }

            if (num == attrArray.length && num > 0) {
                allStock = allStock + parseInt(scope.ProductStock[i].AllStock) - parseInt(scope.ProductStock[i].AllExchangeCount);

            }
        }
    }
    $("#total").html(allStock);
}
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
$(function () {
    var time
    $('.buy_t .close, .uzai_layer1').click(function () {
        $('.buy').css({'bottom': '-100%'})
        $('.uzai_layer1').hide();
    });
    $('.main_f a').click(function () {
        $('.buy').css({'bottom': '0rem'})
        $('.uzai_layer1').show();
    });
    $('#layer_img').hide();

});

//图片延迟加载
function lazy() {

    var len = $('[url-src]');
    for (var i = 0; i < len.length; i++) {

        if (len.eq(i).offset().top < $(window).height()) {
            len.eq(i).attr("src", len.eq(i).attr("url-src")).removeAttr('url-src');
        }
    }
    myScroll.refresh();
}
myScroll.on('scrollEnd', lazy);

function androidGoBack() {
    //window.location.href = 'mall.html';
    BackUrl();
}

function BackUrl()
{
    var typeId = api.getQueryString("typeId");
    var orderId = api.getQueryString("orderId");
    if (typeId != null && typeId != undefined) {
        location.href = "Mall.html?typeId=" + typeId;
    }
    else {
        location.href = "../mallorder/detail.html?Id=" + orderId;
    }
}
