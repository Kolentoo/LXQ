"use strict";
var app = angular.module('groupApp', []);
var i=1;
var a=[];

var pageIndex = 1;
var pageCount = 10;
var type = 0;
var groupType = 0;
var swiper = false;
var a_page_type = true;
var mySwiper;

$('.wrapper_main').height($('.main_list').eq(0).outerHeight());

my_scroll();
setTimeout(function(){
	$('.wrapper_main').height($('.main_list').eq(0).outerHeight());
	my_scroll();
},1000);

function my_scroll(){
	if(typeof myScroll==='undefined'){
		window.myScroll=null;
		myScroll = new IScroll('#wrapper', {
			click:true,
			mouseWheel: true,
			probeType: 3
		});
	}else{
		myScroll.refresh();
	}
}

app.directive('loadMore',function(){
	return {
		restrict: 'AE',
		link:function(scope, elm, attr){
			window.y=0;
			myScroll.on('scroll', function () {
				window.y=this.y;
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
			$('#wrapper').on('touchend', function () {
				if(y>=10){
					pageIndex = 1;
					for(var re=0;re<a.length;re++){if(a[re]===i+'undefined'){a[re+1]=1;}}
					a_page_type=true;
					scope.LoadMore(pageIndex,true);
				}
				if(y===0)
				{
					return;
				}
				if ( -y+$('#wrapper').height()-$('.main_nav').innerHeight()-$('.wrapper_main').innerHeight()>=0){
					if (a_page_type) {
						var page = 0;
						var pagetype = true;
						for (var l = 0; l <= a.length; l++) {
							if (a[l] === i.toString()) {
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
						//if (!swiper) {
							pageIndex++;
						//}

						scope.LoadMore(pageIndex);
						setTimeout(function () {

						    $('.wrapper_main').height($('.main_list').eq(i - 1).outerHeight());
						    //myScroll.scrollTo(0, 0);
						    myScroll.refresh();
						}, 1000);
					}
				}
			});
		}
	};
});

app.directive('repeatFinish', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
            if (scope.$last === true)
            {
                //setTimeout(my_scroll, 100);
                var mySwiper1 = new Swiper('.gallery-thumbs', {
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    slidesPerView: 3,
                    onTap: function () {
                        // mySwiper3.slideTo(mySwiper1.clickedIndex)
                    }
                });
                $('.main_list_1').removeClass('fadeInRight');

                $('.main_list_1').addClass('fadeInRight');



            }
        }
    }
});
mySwiper = new Swiper('.wrapper_main', {
	onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
		swiperAnimateCache(swiper); //隐藏动画元素
		swiperAnimate(swiper); //初始化完成开始动画
	}
});

app.directive('typeFinish', function () {
	return {
		restrict: 'AE',
		link: function (scope, elm, attr) {
			if (scope.$last === true)
			{
				myScroll.refresh();
			}
		}
	}
});


var tArray = new Array();
var dataArray = new Array();
app.controller('ExclusiveGroup', function($http, $scope) {
	var param = JSON.stringify({
		PageIndex: pageIndex,
		PageCount: pageCount,
		Type: type,
		GroupType: groupType
	});


	//分类
	api.post($http, $scope, api.path.mhomelogic, 'MemberCenter', 'GetGroupItemTypes', param, function(obj) {
		if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
			if (obj.ErrorCode === -3) {
				api.toast('网络连接失败,请重试～');
			}
			if (JSON.parse(obj.JsonResult).length <= 0)
			{
				api.toast(errorTxt, 99999);
			}
			$scope.groupItemTypes = JSON.parse(obj.JsonResult);
			LoadData($http, $scope, pageIndex);
			setTimeout(function(){

				my_scroll();
				lazy();
			},1000);
		} else {
			api.toast(errorTxt, 99999);
		}
	});

	//加载
	$scope.GetExcluslveGroupList = function (id) {

	    $("#" + id).addClass('selected').siblings().removeClass('selected');
	    //mySwiper.slideTo($(liC).index());
	    my_scroll();
	   // i = $("#" + id).index() + 1;
	    $('.main_list_1').removeClass('fadeInRight');//repeat加载完移除
	    groupType = id;
	    pageIndex = 1;
	    swiper = true;
	    a_page_type = true;
	    // $('button').eq(0).click();
	    LoadData($http, $scope, pageIndex);
	    setTimeout(function () {

	        $('.wrapper_main').height($('.main_list').eq(0).outerHeight());
	       // myScroll.scrollTo(0, 0);
	        myScroll.refresh();
	    }, 1000);

	};
	$scope.LoadMore = function (pageIndex,isRefeash) {
	    LoadData($http, $scope, pageIndex,isRefeash)
	}
	$scope.gproduct = function (productype, productid) {
		bridge.openProduct(productype, productid);
	};
});


function LoadData(httpObj, scopeObj, pageIndex,isRefeash)
{
    var param = JSON.stringify({
        PageIndex: pageIndex,
        PageCount: pageCount,
        Type: type,
        GroupType: groupType
    });
    var isFlag = false;//是否该分类下首次加载
    if (pageIndex === 1 && !isRefeash) {
        for (var i = 0; i < tArray.length; i++) {
            if (groupType === tArray[i]) {

                scopeObj.exclusiveGroupList = dataArray[i];
                isFlag = true;
            }
        }
    }
    if (isFlag === false)
	{
        api.post(httpObj, scopeObj, api.path.mhomelogic, 'MemberCenter', 'GetExcluslveGroupList', param, function (obj) {
            var errorTxt = '暂无数据～';
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                if (obj.ErrorCode === -3) {
                    api.toast('网络连接失败,请重试～');
                }
                if (JSON.parse(obj.JsonResult).length <= 0) {
                    api.toast('没有更多数据～');
                    a_page_type = false;
                }
                var items = JSON.parse(obj.JsonResult);



                    if (pageIndex === 1) {
                        scopeObj.exclusiveGroupList = items;
                        setTimeout(function () {
                            $('.wrapper_main').height($('.main_list').eq(0).outerHeight());
                            myScroll.scrollTo(0, 0);
                            myScroll.refresh();
                        }, 200);
                      //  swiper = false;
                        if(!isRefeash)
						{
							tArray.push(groupType);
							dataArray.push(scopeObj.exclusiveGroupList);
						}
						//api.endloading();

                    }
                    else {
                        for (var i = 0; i < items.length; i++) {
                            scopeObj.exclusiveGroupList.push(items[i]);
                        }
                        setTimeout(function () {
                            $('.wrapper_main').height($('.main_list').eq(i - 1).outerHeight());
                            myScroll.refresh();
                        }, 200);
                    }


            } else {
                api.toast(errorTxt, 99999);
            }
        });
    }
	else
	{
		api.endloading();
		myScroll.scrollTo(0, 0);
	}
}


var mySwiper1 = new Swiper('.wrapper_main', {
    onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素
        swiperAnimate(swiper); //初始化完成开始动画
    }
});
function androidGoBack()
{
    window.location.href = '../membercenter/index.html';
}


//图片延迟加载
function lazy() {
	var len = $('[data-src]');
	for (var i = 0; i < len.length; i++) {
		if (len.eq(i).offset().top < $(window).height()) {
			len.eq(i).attr("src", len.eq(i).attr("data-src")).removeAttr('data-src');
		}
	}
}
myScroll.on('scrollEnd', lazy);
