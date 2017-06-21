(function () {
    "use strict";
    var pageindex = 1;
    var cityid = api.getLocalStorage("cityId");
    if (cityid === '0' || typeof (cityid) === 'undefined' || cityid === null) {
        var cityname = api.getLocalStorage("departureCityName");
        if (cityname !== '' && typeof (cityname) !== 'undefined' && cityname !== null) {
            if (decodeURI(cityname) === '上海') {
                cityid = 2;
            }
            else {
                cityid = 1;
            }
        }
        else {
            cityid = 2;
        }
    }
    else {
        if (cityid !== '2') {
            cityid = 1;
        }
    }
   // var isreference=false;
    var mhomeactlist = angular.module('mhomeactlist', []);
    mhomeactlist.controller('mhomeactlistController', function ($http, $scope) {

        $scope.loadMore = function (isreference) {
            var param = JSON.stringify({
                "PageIndex": pageindex,
                "PageCount": 10,
                "ActivityType": 1,
                "City": cityid,
            });
            api.post($http, $scope, api.path.mhomelogic, 'MemberCenter', 'GetMemberActivityList', param, function (obj) {
                if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                    if (obj.ErrorCode === -3) {
                        api.toast('网络连接失败,请重试～');
                    }
                    else {
                        if (obj.ErrorCode === 200 && (obj.JsonResult === '[]' || obj.JsonResult === null)) {
                            api.toast('没有更多数据！', 1000);
                            a_page_type = false;
                        } else if (JSON.parse(obj.JsonResult) !== null && JSON.parse(obj.JsonResult).length > 0) {
                            //获取数据将绑定文本的副标题取出来
                            var res = JSON.parse(obj.JsonResult);
                            for (var i = 0; i < res.length; i++) {
                                var str = res[i].Content;
                                if (str !== '' && typeof (str) !== 'undefined') {

                                    str=str.replace(/\ +/g,"");//去掉空格
                                    str=str.replace(/[ ]/g,"");    //去掉空格
                                    str=str.replace(/[\r\n]/g,"");//去掉回车换行

                                    var cont;
                                    try
                                    {
                                        cont = JSON.parse(str);
                                        res[i].Content = cont[0].ImageDescribe;
                                    }
                                    catch(e){
                                        cont=str;
                                        res[i].Content=cont;
                                    }

                                }

                            }

                            if (cityid === 1) {
                                if(isreference) //判断是否下拉刷新
                                {
                                    $scope.list1 = appendjson(res);
                                }
                                else {
                                    if ($scope.list1 === undefined || $scope.list1 === '') {
                                        $scope.list1 = appendjson(res)
                                    } else {
                                        if ($scope.list1[$scope.list1.length - 1].strdate === appendjson(res)[0].strdate) {
                                            for (var i = 0; i < appendjson(res)[0].objdata.length; i++) {
                                                $scope.list1[$scope.list1.length - 1].objdata.push(appendjson(res)[0].objdata[i])
                                            }
                                            if (appendjson(res).length > 1) {
                                                for (var i = 1; i < appendjson(res).length; i++) {
                                                    $scope.list1.push(appendjson(res)[i])
                                                }
                                            }
                                        } else {
                                            if (appendjson(res).length >= 1) {
                                                for (var i = 0; i < appendjson(res).length; i++) {
                                                    $scope.list1.push(appendjson(res)[i])
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (cityid === 2) {
                                if(isreference)
                                {
                                    $scope.list2 = appendjson(res);
                                }
                                else {
                                    if ($scope.list2 === undefined || $scope.list2 === '') {
                                        $scope.list2 = appendjson(res)
                                    } else {
                                        if ($scope.list2[$scope.list2.length - 1].strdate === appendjson(res)[0].strdate) {
                                            for (var i = 0; i < appendjson(res)[0].objdata.length; i++) {
                                                $scope.list2[$scope.list2.length - 1].objdata.push(appendjson(res)[0].objdata[i])
                                            }
                                            if (appendjson(res).length > 1) {
                                                for (var i = 1; i < appendjson(res).length; i++) {
                                                    $scope.list2.push(appendjson(res)[i])
                                                }
                                            }
                                        } else {
                                            if (appendjson(res).length >= 1) {
                                                for (var i = 0; i < appendjson(res).length; i++) {
                                                    $scope.list2.push(appendjson(res)[i])
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        setTimeout(function () {
                            $('.wrapper_main').height($('.main_list').eq(cityid - 1).outerHeight());
                            my_scroll();
                            delay_img()
                        }, 100);
                    }
                }
                else {
                    api.toast(obj.ErrorMsg);
                }
            });
        }
        $scope.activityjump = function (activityid) {
            window.location.href = 'activitydetail.html?id=' + activityid + "&cityId=" + cityid;
        };
        if(cityid===1) {
            $scope.loadMore(false);
        }
    });

    function appendjson(obj) {
        var t = -1;
        var listdate = [];
        var list_objres = [];
        var result = {};
        var data_arry = [];
        for (var i = 0; i <= obj.length - 1; i++) {
            var sub = obj[i].CreateDate.substr(0, 10);
            var strd = new Date(sub).getFullYear() + '年' + (parseInt(new Date(sub).getMonth()) + 1) + '月';
            if (listdate.toString().indexOf(strd) == -1) {
                t++;
                var o = 0;
                listdate.push(strd);
                list_objres[t] = [];
                list_objres[t][o++] = obj[i];
            }
            else {
                list_objres[t][o++] = obj[i];
            }
        }
        for (var i = 0; i <= listdate.length - 1; i++) {
            result = {};
            result.strdate = listdate[i];
            result.objdata = list_objres[i];
            data_arry[i] = result;
        }
        return data_arry;
    }

    var i = 1;
    $('.wrapper_main').height($('.main_list').eq(cityid - 1).outerHeight());

    $('.main_nav li').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        mySwiper.slideTo($(this).index());
    });

    $('.main_nav li').eq(cityid - 1).addClass('selected');


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

    var a = [];
    var a_page_type = true;//是否继续加载
    mhomeactlist.directive('loadMore', function () {
        return {
            restrict: 'AE',
            link: function (scope, elm, attr) {
                window.y = 0;
                myScroll.on('scroll', function () {
                    window.y = this.y;
                    window.pointY=this.pointY;
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
                    if (y >= 10) {
                        for (var re = 0; re < a.length; re++) {
                            if (a[re] == i + 'undefined') {
                                a[re + 1] = 1;
                            }
                        }
                        pageindex = 1;
                       //isreference=true;
                        //if (cityid == 1) {
                        //    scope.list1 = '';
                        //} else if (cityid == 2) {
                        //    scope.list2 = '';
                        //}
                        scope.loadMore(true);
                        a_page_type = true;
                    }
                    if ($('.wrapper_main').innerHeight() > $('#wrapper').height()) {
                        if (-y + $('#wrapper').height() - $('.wrapper_main').innerHeight() >= 0) {
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

                                pageindex = page;
                                scope.loadMore(false);
                            }
                        }
                    }
                });
            }
        };
    });
    var degree = true;
    mhomeactlist.directive('navLi', function () {
        return {
            restrict: 'AE',
            link: function (scope, elm, attr) {
                window.mySwiper = new Swiper('.wrapper_main', {
                    initialSlide: (cityid - 1),
                    touchAngle: 20,
                    onlyExternal: false,
                    swipeHandler: '.swipe-handler',
                    onSlideChangeStart: function () {
                        $(".common-pop").remove();
                        setTimeout(function () {
                            $('.main_nav').find('li').eq(mySwiper.activeIndex).addClass('selected').siblings().removeClass('selected');
                            $('.wrapper_main').height($('.main_list').eq(mySwiper.activeIndex).outerHeight());
                            my_scroll();
                            i = mySwiper.activeIndex;
                            cityid = i + 1;
                            a_page_type = true;
                            if (cityid === 1) {
                                if (scope.list1 === undefined) {
                                    pageindex = 1;
                                    scope.loadMore();
                                }
                            }
                            else {
                                if (scope.list2 === undefined) {
                                    pageindex = 1;
                                    scope.loadMore();
                                }
                            }


                        }, 50)
                    }
                });
            }
        }
    })

    function delay_img() {
        var elem = $('[data-src]');
        for (var i = 0; i < elem.length; i++) {
            if (elem.eq(i).offset().top < $('header').height() + $('#wrapper').height()) {
                elem.eq(i).attr('src', elem.eq(i).attr('data-src')).removeAttr('data-src')
            }
        }
    }

    myScroll.on('scrollEnd', delay_img);

})();
function androidGoBack() {
    window.location.href = '../membercenter/index.html';
}
