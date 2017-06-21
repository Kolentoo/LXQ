api.serverVirtualDir="discover";
var app = angular.module('myApp', []);
var i = 1;
var nodatano=true;
var page = 0;
var just=0;//只执行一次；
var just1=0;//只执行一次；
var labelid;

api.serverVirtualDir="discover";
//获取当前城市信息
var city = api.getCookie('uzmCity');
var cityId = 2;
var cityname = '';

if (city !== '' && typeof (city) !== 'undefined'&&city!==null) {
	cityId = decodeURI(city.split('-')[1]);
	api.setLocalStorage("cityId", cityId);
	if (cityId === 1) {
		api.setLocalStorage('discovercity', encodeURI('北京'));
	}
	else {
		api.setLocalStorage('discovercity', encodeURI('上海'));
	}
	api.setLocalStorage('cityId' , cityId);
}
else {
	NoAppPositionInit();
	//api.setLocalStorage('discovercity', encodeURI('上海'));
}

$('.main_nav li').click(function () {
	i = $(this).index() + 1;
	$(this).addClass('selected').siblings().removeClass('selected');
	$('.wrapper_main').height($('.main_list').eq(i - 1).outerHeight());
	mySwiper.slideTo($(this).index());
	a_page_type = true;
});

var mySwiper = new Swiper('.wrapper_main', {
	touchAngle: 20,
	onlyExternal: true,
	onSlideChangeStart: function () {
		$('.main_nav').eq(0).find('li').eq(mySwiper.activeIndex).addClass('selected').siblings().removeClass('selected');
		$('.main_nav').eq(1).find('li').eq(mySwiper.activeIndex).addClass('selected').siblings().removeClass('selected');
		$('.wrapper_main').height($('.main_list').eq(mySwiper.activeIndex).outerHeight());
		my_scroll();
		i = mySwiper.activeIndex + 1;
	}
});

my_scroll();
function my_scroll() {
	$('.wrapper_main').height($('.main_list').eq(i - 1).outerHeight());
	if (typeof myScroll === 'undefined') {
		window.myScroll = null;
		myScroll = new IScroll('#wrapper', {
			bindToWrapper:true,
			click: true,
			mouseWheel: true,
			probeType: 3
		});
	} else {
		myScroll.refresh();
	}
}
myScroll.on('scroll', function () {
	if ($('.main_nav').eq(1).offset().top < $('.main_nav').eq(1).height() && $('.main_nav').eq(1).css('display') == 'block') {
		if (!$('.main_img1').eq(0).hasClass('div_ceng')) {
			$('.main_nav').eq(0).show();
		}
	} else {
		$('.main_nav').eq(0).hide();
	}
});
api.serverVirtualDir="discover";
app.controller('findCtrl', function ($scope, $http, $timeout) {
	api.serverVirtualDir="discover";
	$scope.loadtheme = function () {
		api.loading();
		var param = JSON.stringify({
            "LabelId": 0,
            "OrderByField": ''            
        });
		if (api.serverVirtualDir!=="discover") {
			api.serverVirtualDir="discover";
		}
		api.post($http, $scope, api.path.msitelogic, 'UzaiDiscovery', 'GetLabelList', param, function (obj) {
			if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
				if (obj.ErrorCode == -3) {
					api.toast('网络连接失败,请重试～');
					return;
				}
				var result = JSON.parse(obj.JsonResult);
				if ($scope.labes === undefined) {
					$scope.labes = result;
				} else if ($scope.labes != result) {
					for (var i = 0; i < result.length; i++) {
						$scope.labes.push(result[i]);
					}
				}
				$('.content .main').show();
				//console.log('加载主题图片=上面');
				//console.log($scope.labes);
			} else {
				//api.toast("获取信息失败",3000);
				api.toast(obj.ErrorMsg, 3000);
			}
		}, 3, false);
	};

	$scope.loadMore = function (labelid, ordertype, pageindex, ss) {
		api.loading();
		if (labelid === undefined || labelid === 0 || labelid === null) {
			labelid = 0;
		}
		if (pageindex === undefined || pageindex === 0 || pageindex === null) {
			pageindex = 1;
		}
		if (ordertype === undefined || ordertype === 0 || ordertype === null) {
			ordertype = "";
		}
		api.serverVirtualDir="discover";
		var param = JSON.stringify({
            "LabelId": labelid,
            "OrderByField": ordertype,
			"SubjectCount": 10,
			"PageIndex": pageindex,
			"userId": api.getUserId(),
			"StartCity":cityId
        });
		api.toast('一大波专题正在袭来', 10000);
		if (api.serverVirtualDir!=="discover") {
			api.serverVirtualDir="discover";
		}
		api.post($http, $scope, api.path.msitelogic, 'UzaiDiscovery', 'GetSubjectList', param,
			function (obj) {
				$('#toast-pop').remove();
				if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
					if (obj.ErrorCode == -3) {
						api.toast('网络连接失败,请重试～');
						return false;
					}
					var result = JSON.parse(obj.JsonResult);
					if (!result.length) {
						if(page<=1)nodatano=false;
						api.toast('亲，只有这么多了！');
						a_page_type = false;
						if(pageindex===''||pageindex===1){
							if (ordertype == 1) {
								if(!$('.main_list').eq(0).hasClass('paddt0'))$('.main_list').eq(0).append("<div class='data_no'>暂无数据</div>");
								$('.main_list').eq(0).addClass('paddt0');
								$('.wrapper_main').height($('.main_list').eq(0).outerHeight());
							}
							if(ordertype == 2){
								if(!$('.main_list').eq(1).hasClass('paddt0'))$('.main_list').eq(1).append("<div class='data_no'>暂无数据</div>");
								$('.main_list').eq(1).addClass('paddt0');
								$('.wrapper_main').height($('.main_list').eq(1).outerHeight());
							}
							
							my_scroll();
						}
					}else{
						nodatano=true;
						if (ordertype == 1) {
							$('.data_no').eq(0).remove();
							$('.main_list').eq(0).removeClass('paddt0');
						}
						if(ordertype == 2){
							$('.data_no').eq(0).remove();
							$('.main_list').eq(1).removeClass('paddt0');
						}
					}
					if (ordertype == 1) {
						if (ss === true) {
							$scope.subjectlist = [];
						}
						if ($scope.subjectlist === undefined) {
							$scope.subjectlist = result;
						} else if ($scope.subjectlist !== result) {
							for (var i = 0; i < result.length; i++) {
								$scope.subjectlist.push(result[i]);
							}
						}

						for (var j = $scope.subjectlist.length - 1; j >= 0; j--) {
							if (typeof ($scope.subjectlist[j].Labels) == 'string') {
								var arr = $scope.subjectlist[j].Labels.split(',');
								if ($scope.subjectlist[j].Labels === ','||$scope.subjectlist[j].Labels ==='') {
									$scope.subjectlist[j].Labels =[];
									continue;
								}
								else{
									$scope.subjectlist[j].Labels = arr;
								}
								//arr = arr.slice(1, arr.length - 1);
								
								//console.log($scope.subjectlist[i].Labels);
							}
						}
						//console.log('加载左侧');
						//console.log($scope.subjectlist);
					}
					if (ordertype == 2) {
						if (ss === true) {
							$scope.subjectlist2 = [];
						}
						if ($scope.subjectlist2 === undefined) {
							$scope.subjectlist2 = result;
						} else if ($scope.subjectlist2 != result) {
							for (var j = 0; j < result.length; j++) {
								$scope.subjectlist2.push(result[j]);
							}
						}
						for (var j = $scope.subjectlist2.length - 1; j >= 0; j--) {
							if (typeof ($scope.subjectlist2[j].Labels) == 'string') {
								var arr = $scope.subjectlist2[j].Labels.split(',');
								if ($scope.subjectlist2[j].Labels === ','||$scope.subjectlist2[j].Labels ==='') {
									$scope.subjectlist2[j].Labels = '';
									continue;
								}
								else{
									$scope.subjectlist2[j].Labels = arr;
								}
								//arr = arr.slice(1, arr.length - 1);
								
							}
						}
						//console.log('加载右侧');
						//console.log($scope.subjectlist);
					}

					setTimeout(delay_img,100);
					if(!!api.getLocalStorage('popularity_or_new') && just===0){
						var label = api.getLocalStorage('popularity_or_new');
						if(api.getLocalStorage('label')===0){
							label=1;
						}
						setTimeout(function(){
							$('.main_nav').eq(0).find('li').eq(label-1).click();
							$('.main_nav').eq(1).find('li').eq(label-1).click();
						},100);
						
						just=1;
						
					}
					setTimeout(function(){           //清除本地存储
						api.removeLocalStorage('popularity_or_new');
						api.removeLocalStorage('label');
					},4000);
					
					
					if(just1===0){
						$('.content .main').show();
						
						mySwiper = new Swiper('.wrapper_main', {
							touchAngle: 20,
							onlyExternal: true,
							onSlideChangeStart: function () {
								$('.main_nav').eq(0).find('li').eq(mySwiper.activeIndex).addClass('selected').siblings().removeClass('selected');
								$('.main_nav').eq(1).find('li').eq(mySwiper.activeIndex).addClass('selected').siblings().removeClass('selected');
								$('.wrapper_main').height($('.main_list').eq(mySwiper.activeIndex).outerHeight());
								my_scroll();
								i = mySwiper.activeIndex + 1;
							}
						});
						just1=1;
					}
					
				} else {
					//api.toast("获取信息失败",3000);
					api.toast(obj.ErrorMsg, 3000);
				}
			}, 3, false);
	};
	$scope.jumptoActive = function (data) {
		//alert(this.attr('tt'));
		//alert(data);
		var id=data.value2.Id;
		var url=data.value2.DetailUrl;
		var param = JSON.stringify({
            "LabelId":id            
        });
		api.post($http, $scope, api.path.msitelogic, 'UzaiDiscovery', 'UpdateVisitsNum', param,
			function (obj) {				
				//console.log("visitnum++");
			}, 3, false);
		api.setLocalStorage('popularity_or_new',i);
		api.setLocalStorage('label',labelid);
		// if (!api.isApp()&&type<3) {
		// 	url="http://m.uzai.com/discover/SubjectDetail/Index?SubjectId="+id+"&SubjectType="+type+"&startcity="+city;
		// }
		window.location.href = url;
		// if (data.value2.SubjectType==1) {
		// 	window.location.href='active.html?subjectid='+data.value2.Id+'&startcity=1';
		// }
		// if (data.value2.SubjectType==2) {
		// 	if (data.value2.LinkUrl!=''&&data.value2.LinkUrl!=null) {
		// 		window.location.href=data.value2.LinkUrl;
		// 	}else{
		// 		window.location.href='TopicDetalPage.html?subjectid='+data.value2.Id+'&startcity=1';
		// 	}
		// }
	};
	$scope.loadMorelist = function (labelid) {
		api.loading();
		api.serverVirtualDir="discover";
		var param = JSON.stringify({
            "LabelId": labelid
        });
		api.toast('一大波专题正在袭来', 10000);
		if (api.serverVirtualDir!=="discover") {
			api.serverVirtualDir="discover";
		}
		api.post($http, $scope, api.path.msitelogic, 'UzaiDiscovery', 'GetSubjectByID', param,
			function (obj) {
				$('#toast-pop').remove();
				if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
					if (obj.ErrorCode == -3) {
						api.toast('网络连接失败,请重试～');
						return false;
					}
					var result = JSON.parse(obj.JsonResult).subjectlist1;
					var result2 = JSON.parse(obj.JsonResult).subjectlist2;
					if (!result.length) {
						if(page<=1)nodatano=false;
						api.toast('亲，只有这么多了！');
						a_page_type = false;
						if(pageindex===''||pageindex===1){
							if(!$('.main_list').eq(0).hasClass('paddt0'))$('.main_list').eq(0).append("<div class='data_no'>暂无数据</div>");
							$('.main_list').eq(0).addClass('paddt0');
							$('.wrapper_main').height($('.main_list').eq(0).outerHeight());

							if(!$('.main_list').eq(1).hasClass('paddt0'))$('.main_list').eq(1).append("<div class='data_no'>暂无数据</div>");
							$('.main_list').eq(1).addClass('paddt0');
							$('.wrapper_main').height($('.main_list').eq(1).outerHeight());
							my_scroll();
						}
					}else{
						nodatano=true;
						$('.data_no').eq(0).remove();
						$('.main_list').eq(0).removeClass('paddt0');
						$('.main_list').eq(1).removeClass('paddt0');
					}
					
					$timeout(function () {
						$scope.subjectlist = result;
						$scope.subjectlist2 = result2;
						
						
						for (var j = $scope.subjectlist.length - 1; j >= 0; j--) {
							if (typeof ($scope.subjectlist[j].Labels) == 'string') {
								var arr = $scope.subjectlist[j].Labels.split(',');
								if ($scope.subjectlist[j].Labels === ','||$scope.subjectlist[j].Labels ==='') {
									$scope.subjectlist[j].Labels =[];
									continue;
								}
								else{
									$scope.subjectlist[j].Labels = arr;
								}
							}
						}
						for (var j = $scope.subjectlist2.length - 1; j >= 0; j--) {
							if (typeof ($scope.subjectlist2[j].Labels) == 'string') {
								var arr = $scope.subjectlist2[j].Labels.split(',');
								if ($scope.subjectlist2[j].Labels === ','||$scope.subjectlist2[j].Labels ==='') {
									$scope.subjectlist2[j].Labels =[];
									continue;
								}
								else{
									$scope.subjectlist2[j].Labels = arr;
								}
							}
						}
					},1);
					setTimeout(delay_img,100);
				}
			}, 3, false);
	};

});
app.directive('findDir', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
			if (scope.$last === true) {
				swiperS = new Swiper('.swiper-containerS', {
					slidesPerView: 'auto'
				});

				if(!!api.getLocalStorage('popularity_or_new')){
					var label = api.getLocalStorage('label');
					setTimeout(function(){
						var label_index=$('.swiper-wrapper .main_img1').index($("[data-id="+label+"]").parent());
						$('.swiper-wrapper .main_img1').eq(label_index).addClass('div_ceng').siblings().removeClass('div_ceng');
						swiperS = new Swiper('.swiper-containerS', {
							slidesPerView: 'auto',
							initialSlide :label_index
						});
						if (label_index !== 0) {     //点击第一个禁止滑动
							$('.main_nav').eq(1).show();
							$('.wrapper').css("top", "3.58rem");
						} else {
							$('.main_nav').eq(1).hide();
							$('.wrapper').css('top', '2.7rem');
						}
					},100);
				}
			}
			if (scope.$first === true) {
				if(!api.getLocalStorage('popularity_or_new'))elm.addClass('div_ceng');
			}
			elm.on('click', function () {
				$(this).addClass('div_ceng').siblings().removeClass('div_ceng');
				labelid = $(this).children('img').attr('data-id');
				clearpage(1, labelid);
				clearpage(2, labelid);
				a_page_type = true;
				if ($(this).index() !==0) {     //点击第一个禁止滑动
					$('.main_nav').eq(1).show();
					scope.loadMorelist(labelid);
					$('.wrapper').css("top", "3.58rem");
					$('.main_nav li').eq(0).click();
				} else {
					$('.main_nav').eq(1).hide();
					scope.loadMore('', 1, '', true);
					$('.wrapper').css('top', '2.7rem');
					$('.main_nav li').eq(0).click();
				}
				myScroll.scrollTo(0, 0,200);
			});
        }
    };
});

app.directive('findDir1', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
			if (scope.$last === true) {
				setTimeout(my_scroll, 100);
			}
        }
    };
});
app.directive('findDir2', function () {
    return {
        restrict: 'AE',
        link: function (scope, elm, attr) {
			if (scope.$last === true) {
				setTimeout(my_scroll, 100);
			}
        }
    };
});
var a_page = [];//页数计数
var a_page_type = true;//是否继续加载；
var pointY=1;
app.directive('loadMore', function () {
	return {
		restrict: 'AE',
		link: function (scope, elm, attr) {
			window.y = 0;
			scope.loadtheme();
			if(!!api.getLocalStorage('popularity_or_new')){
				
				labelid=api.getLocalStorage('label');
				scope.loadMore(labelid, 1);
				if(labelid!==0)scope.loadMore(labelid, 2);
				
				//api.removeLocalStorage('popularity_or_new');
				//api.removeLocalStorage('label');
			}else{
				labelid=0;
				scope.loadMore('', 1);
			}
			myScroll.on('scroll', function () {
				window.y = this.y;
				window.pointY=this.pointY;
			});
			$('#wrapper').on('touchmove', function (event) {
				if(pointY>=window.innerHeight-1){
					myScroll.scrollTo(0, 0, 100);
					return false;
				}else if(pointY<=0){
					myScroll.scrollTo(0, myScroll.maxScrollY, 100);
					return false;
				}
			});
			$('#wrapper').on('touchend', function () {
				if (y >= 10) {
					//console.log('刷心');
					clearpage(i, labelid);
					a_page_type = true;
					if(nodatano)scope.loadMore(labelid, i, '', true);
				}
				if (-y + $('#wrapper').height() - $('.wrapper_main').innerHeight() >= 0) {
					if (a_page_type) {
						
						var pagetype = true;
						for (var l = 0; l <= a_page.length; l++) {
							if (a_page[l] == i.toString() + window.labelid) {
								a_page[l + 1] = parseInt(a_page[l + 1]) + 1;
								page = a_page[l + 1];
								pagetype = false;
							}
						}
						if (pagetype) {
							a_page.push(i.toString() + window.labelid);
							a_page[a_page.length] = 2;
							page = a_page[a_page.length - 1];
						}
						//console.log('已结滑动到第' + page + '页');
						if(nodatano)scope.loadMore(window.labelid, i, page);
					}
				}
				if (myScroll.directionY == 1) {
					if (y <= -20 && y >= -$('.main_img').innerHeight()) {
						myScroll.scrollTo(0, -$('.main_img').innerHeight(), 1000);
					}
				}
			});
		}
	};
});


function delay_img() {
	var elem = $('[data-src]');
	for (var i = 0; i < elem.length; i++) {
		if (elem.eq(i).offset().top <$(window).height()){
			elem.eq(i).attr('src', elem.eq(i).attr('data-src')).removeAttr('data-src');
		}
	}
}
myScroll.on('scrollEnd', delay_img);


function andriodGoBack() {
	window.location.href = '../home/index.html';
}

function GetLabelListInit() {
	// body...
}


function clearpage(i, labelid) {
	var string = '';
	string += i;
	string += labelid;
	for (var l = 0; l < a_page.length; l++) { if (a_page[l] == string) { a_page[l + 1] = 1; } }
}


////---------------定位成功
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var point = new BMap.Point(longitude, latitude);
    // 创建点坐标
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function (rs) {
        var locationCity = rs.addressComponents.province;
        cityname = locationCity;
        if (cityname.indexOf("省") > 0) {
            cityname = cityname.replace(/省/g, "");
        } else if (cityname.indexOf("市") > 0) {
            cityname = cityname.replace(/市/, "");
        } else {
            cityname = cityname;
        }
		if (cityname === '北京') {
			cityId = 1;
		}
		else {
			cityId = 2;
		}
		api.setLocalStorage('discovercity', encodeURI(cityname));
		api.setLocalStorage('cityId' , cityId);
    });

}

//---------------定位失败
function handleLocationError(error) {
    cityname = "上海";
    api.setLocalStorage("discovercity", encodeURI(cityname));
}

function NoAppPositionInit() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError, {
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAccuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 1000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 0
        });
    } else {

    }
}