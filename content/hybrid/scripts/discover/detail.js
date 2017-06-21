
//解决详情页加载过程重由于网络不好等原因返回按钮不生效问题
if (api.isApp()) {
    api.backUrl = 'javascript:bridge.goBack("", true, false, 1);'
}
else if (document.referrer === '') {
    api.backUrl = 'http://m.uzai.com/discover/index.html';
}

api.loading();
var myScroll;
//专题是否被收藏，默认为否
var favoriteid = '0';
var startCityId = '2'; //默认为上海
var startCity = ' 上海';
var cityname = '上海';
var userid = 0;


$.fn.detail = function () {
    function loadd() {
        myScroll = new IScroll('#wrapper', {
            scrollX: true,
            freeScroll: true,
            click: true
        });
        myScroll.on('scroll', scrollaction);
        myScroll.on('scrollEnd', scrollaction);
        setTimeout(function () {
            lazy()
        }, 100);
        myScroll.refresh();

    }

    function lazy() {
        var len = $("li img").length;
        for (var i = 0; i < len; i++) {
            if ($("li img").eq(i).offset().top < myScroll.y * -1 + $(window).height()) {
                $("li img").eq(i).attr("src", $("li img").eq(i).attr("data-url"));
                // console.log($("li img").eq(i).offset().top + "图片高度");
            }
        }
    }

    function scrollaction() {
        // console.log(this.y + "this.y");
        setTimeout(function () {
            lazy();
        }, 1);

    }
    //判读地点名称的长度，如果大于就缩小字号
    function sizeset() {
        var adressName = $(".three-span").text();
        if (adressName.length > 7) {
            $(".three-span").css("font-size", "0.18rem");
        }
    }

    function inits() {
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            isAndroid = ua.match(/(Android)\s+([\d.]+)/),
            isMobile = isIphone || isAndroid;
    }
    inits();
    sizeset();
    loadd();
};



var app = angular.module('myApp', []);
app.controller('topDetail', function ($scope, $http) {
    api.serverVirtualDir = 'discover';

    //定位城市信息
    if (!api.isApp()) {
        var city = api.getCookie('uzmCity');
        if (city !== '' && typeof (city) !== 'undefined') {
            if (city.split('-') !== '' && typeof (city.split('-')) !== 'undefined') {
                try {
                    cityId = decodeURI(city.split('-')[1]);
                    startCityId = cityId;
                } catch (error) {

                }
            }
        }
        else {
            if (api.getLocalStorage('cityId') !== 'undefined' && api.getLocalStorage('cityId') !== '') {
                startCityId = api.getLocalStorage('cityId');
            }
            else {
                NoAppPositionInit();
                setTimeout(function () { }, 3000);
            }
        }
    } else {
        // startCity = api.getLocalStorage('startcity', 'decodeURI');
        startCity = api.getQueryString('startcity');
        userid = api.getQueryString('disu');
        if (startCity !== null && startCity.length > 0) {
            if (startCity === '北京') {
                startCityId = '1';
            } else {
                //decodeURI('%E4%B8%8A%E6%B5%B7') == '上海'
                startCityId = '2';
            }
        }

    }

    $scope.isShow = api.isApp();
    var subjectId = api.getQueryString('subjectid');
    var RequestFrom = api.getQueryString('RequestFrom');

    var param = JSON.stringify({
        "ProductId": subjectId,
        "SubjectId": subjectId,
        "StartCity": startCityId,
        "RequestFrom": RequestFrom,
        "UserId": userid
    });

    api.post($http, $scope, api.path.msitelogic, 'DiscoveryDetail', 'RecommendProducts', param, function (obj) {
        // alert(startCityId);

        if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {
            if (obj.ErrorCode == -3) {
                api.toast(obj.ErrorMsg);
                $scope.backshow = true;
                return;
            }
            $scope.backshow = true;
            $scope.pricerangeid = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.PriceRange;
            $scope.daysid = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.Days;
            $scope.pricerange = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.PriceRangeText;

            $scope.days = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.DaysText;
            $scope.coverImg = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.ImgUrl;
            $scope.subjectarea = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.Area;
            $scope.labellist = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.LabelList;
            $scope.subjectname = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.SubjectName;
            $scope.products = JSON.parse(obj.JsonResult).DiscoverySubjectProductInfo;
            $scope.subjectdesc = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.DetailsDesc;
            $scope.pageUrl = JSON.parse(obj.JsonResult).PageUrl;

            var maxDay = '';
            if ($scope.days !== '' && typeof ($scope.days) !== 'undefined') {
                if ($scope.days !== '11天以上' && $scope.days !== '不限') {
                    if ($scope.days.substring(0, 1) !== 9) {
                        maxDay = $scope.days.substring(2, 3);
                    }
                    else {
                        maxDay = $scope.days.substring(3, 5);
                    }
                }
                else {
                    maxDay = '11';
                }
            }

            $scope.title = $scope.subjectarea + maxDay + '价格 - ' + $scope.subjectname + '- 众信悠哉旅游';
            $scope.keyWord = $scope.subjectarea + maxDay + '日游价格,';
            $scope.keyWord += $scope.subjectarea + maxDay + '日游线路推荐,';
            $scope.keyWord += $scope.subjectarea + maxDay + '日游线路';
            $scope.headcontent = '';
            if ($scope.subjectdesc !== '' && typeof ($scope.subjectdesc) !== 'undefined') {
                $scope.headcontent = $scope.subjectdesc.substring(0, 130);
            }


            $("title").html($scope.title);
            $("meta[name='keywords']").attr('content', $scope.keyWord);
            $("meta[name='description']").attr('content', $scope.headcontent);



            $scope.isProductsAny = false;
            if ($scope.products !== '' && typeof ($scope.products) !== 'undefined' && $scope.products.length > 0) {
                $scope.isProductsAny = true;
            }
            // console.log($scope.isProductsAny);

            // ❗️ 根据天数和价格区间的 不限 判断展示的个数和样式
            var num = 1;
            if ($scope.days !== '不限' && $scope.days !== '') {
                $scope.daysShow = true;
                num++;
            } else {
                $scope.daysShow = false;
            }
            if ($scope.pricerange !== '不限' && $scope.pricerange !== '') {

                $scope.pricerangeShow = true;
                num++;
            } else {
                $scope.pricerangeShow = false;
            }
            $scope.hover = num;

            if ($scope.hover >= 1) {
                $scope.hover1 = true;
            } else {
                $scope.hover1 = false;
            }

            if ($scope.hover >= 2) {
                $scope.hover2 = true;
            } else {
                $scope.hover2 = false;
            }

            if ($scope.hover == 3) {
                $scope.hover3 = true;
            } else {
                $scope.hover3 = false;
            }
            $("#wrapper").detail();
            setTimeout(function () {
                myScroll.refresh();
            }, 1);
            obj.JsonResult = null;

            $('#secondAre').show();
            $scope.isshow = true;

            api.setLocalStorage('disu', userid);

            //判断当前专题是否收藏状态
            if (api.isApp() && userid !== undefined) {
                if (userid > 0) {
                    var isFavoriteParam = JSON.stringify({
                        "ProductId": subjectId,
                        "SubjectId": subjectId,
                        "UserId": userid
                    });
                    api.post($http, $scope, api.path.msitelogic, 'MyFavorite', 'IsSubjectFavorited', isFavoriteParam, function (favobj) {
                        if (favobj.ErrorCode == 200 || favobj.ErrorCode == -3) {
                            if (favobj.ErrorCode == -3) {
                                api.toast(favobj.ErrorMsg);
                            }

                            favoriteid = favobj.JsonResult;
                            if (favoriteid !== '0') {
                                //改专题已经被收藏
                                $('.collection').addClass('collectioned');
                            } else {
                                $('.collection').removeClass('collectioned');
                            }
                            // console.log('favoriteid' + favoriteid);
                        } else {

                            api.toast(favobj.ErrorMsg);
                        }
                    }, 0, false);
                }
                else {
                    $('.collection').removeClass('collectioned');
                }
            }
            else {
                $('.collection').removeClass('collectioned');
            }
            api.endloading();
        } else {
            $scope.backshow = true;
            api.endloading();
            api.toast(obj.ErrorMsg);
        }
    }, 3, false);


    //添加专题到我的收藏
    $scope.addSubjectToFavorite = function () {
        if (favoriteid === '0') {
            //当前专题没有被收藏
            bridge.addSubjectToFavorite();
            try {
                ga('send', 'event', 'TopicDetailPage', 'collect', '收藏');
            }
            catch (err) {
            }
        } else {
            //当前专题已经被收藏，取消该收藏
            bridge.cancelSubjectFavorite(favoriteid);
            try {
                ga('send', 'event', 'TopicDetailPage', 'collect', 'cancel');
            }
            catch (err) {
            }
        }
    };


    //分享专题
    $scope.shareSubject = function (title, content, imageUrl, pageUrl) {
        //新浪微博超过140个字无法分享，算上两个空格总长度控制在136
        content = '【' + title + '】' + content;
        if (content.length + pageUrl.length > 136) {
            var allowedLength = 136 - pageUrl.length - 6;    //算上省略号长度
            if (pageUrl.length < 136 && content.length > allowedLength) {
                content = content.substring(0, allowedLength) + '...';
            }
        }
        bridge.shareSubject(title, content, imageUrl, pageUrl);
    };


    /**
     * 打开产品详情页
     * Created by zhujiazhao on 16/6/8.
     */
    $scope.openProductDetail = function (productId, productTypeId) {
        try {
            ga('send', 'event', 'TopicDetailPage', 'recommend products', 'recommend products');
        }
        catch (err) {
        }
        bridge.openProduct(productTypeId, productId);
    };

    //打开搜索页
    $scope.openSearch = function (prices, days, searchContent) {
        try {
            ga('send', 'event', 'TopicDetailPage', 'anchor', 'anchor');
        }
        catch (err) {
        }
        var price = '';
        var dayId = '';
        if (prices === 1) {
            price = '1-500';
        } else if (prices === 2) {
            price = '501-1000';
        } else if (prices === 3 || prices === 4) {
            price = '1001-5000';
        } else if (prices === 5 || prices === 6) {
            price = '5001-10000';
        } else if (prices === 7) {
            price = '10001-?';
        }

        if (days === 1) {
            dayId = '1-2';
        } else if (days === 2) {
            dayId = '3-5';
        } else if (days === 3) {
            dayId = '6-8';
        } else if (days > 3 && days < 6) {
            dayId = '8-?';
        }
        if (prices === 0) {
            prices = '';
        }
        if (days === 0) {
            days = '';
        }
        bridge.openSearch(searchContent, '', dayId, price, '', '3', '', prices, days);
    };

    //页面左上角返回
    $scope.callback = function (url, islastpage, isrootpage) {
        try {
            ga('send', 'event', 'TopicDetailPage', 'back', 'back');
        }
        catch (err) {
        }
        bridge.goBack(url, islastpage, isrootpage, 1);
    };
});

//html转义
app.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    };
});


window.onload = function () {


};


/**
 * 收藏操作app反馈
 * Created by zhujiazhao on 16/6/14.
 * code      返回码
 * operate   操作类型 1，添加  2，取消
 * result    添加收藏返回收藏FavoriteId
 */
function addSubjectToFavoriteResponse(code, operate, result) {
    api.setLocalStorage('response', code);
    if (code === '200') {
        if (operate === '1') {
            $('.collection').addClass('collectioned');
            favoriteid = result;
            api.toast('收藏成功');
        } else {
            favoriteid = '0';
            $('.collection').removeClass('collectioned');
            api.toast('取消收藏成功');
        }
    } else {
        if (operate === '1') {
            api.toast('收藏失败');
        } else {
            api.toast('取消收藏失败');
        }
    }
}



//安卓物理键返回
function androidGoBack() {
    try {
        ga('send', 'event', 'TopicDetailPage', 'back', 'back');
    }
    catch (err) {
    }
    bridge.goBack('', true, false, 1);
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
            startCityId = 1;
        }
        else {
            startCityId = 2;
        }
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

window.addEventListener("orientationchange", function () {
    productDetailResize();
}, false);



function productDetailResize() {
    var html = document.documentElement;
    var windowWidth = html.clientWidth;
    html.style.fontSize = windowWidth / 7.5 + 'px';
    var windowHeight = $(window).height();
    $("body").height(windowHeight);
}

