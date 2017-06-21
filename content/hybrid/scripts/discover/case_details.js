var departureCityName = api.getQueryString('departureCityName');
api.setLocalStorage("departureCityName", encodeURI(departureCityName));
var myModule = angular.module('MyModule', []);
var myScroll;
//专题是否被收藏，默认为否
var favoriteid = '0';

//解决详情页加载过程重由于网络不好等原因返回按钮不生效问题
if (api.isApp()) {
    api.backUrl = 'javascript:bridge.goBack("", true, false, 1);'
}
else if (document.referrer === '') {
    api.backUrl = 'http://m.uzai.com/discover/index.html';
}

myModule.controller('MyCtrl', ['$scope', '$http', function ($scope, $http) {
    api.serverVirtualDir = 'discover';
    $scope.isShow = api.isApp();
    $scope.departureCityName = departureCityName;                   //出发城市名称
    // var userid = api.getLocalStorage('discoveruserid');             //登录用户Id
    var userid = api.getQueryString('disu');
    var subjectId = api.getQueryString('subjectid');                //专题Id
    var RequestFrom = api.getQueryString('RequestFrom');            //访问来源

    var param = JSON.stringify({
        "RequestFrom": RequestFrom,
        "subjectId": subjectId
    });
    api.post($http, $scope, api.path.msitelogic, 'DiscoveryDetail', 'SubjectActivities', param, function (obj) {

        if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
            if (obj.ErrorCode === -3) {
                api.toast(obj.ErrorMsg);
            }

            var subjectTitle = '';    //八个字限制
            var subjectName = '';     //完整标题

            if (JSON.parse(obj.JsonResult).DiscoverySubjectInfo.SubjectName !== '' &&
                typeof (JSON.parse(obj.JsonResult).DiscoverySubjectInfo.SubjectName) !== 'undefined') {
                subjectName = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.SubjectName;
                if (subjectName.length > 8) {
                    subjectTitle = subjectName.substr(0, 8) + '...';
                }
            }
            var subjectinfo = JSON.parse(obj.JsonResult).DiscoverySubjectInfo;
            var maxDay = '';
            if ($scope.days !== '' && typeof ($scope.days) !== 'undefined') {
                if ($scope.days !== '11天以上' && $scope.days !== '不限') {
                    // console.log($scope.days.substring(0, 1));
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

            $scope.title = subjectinfo.Area + maxDay + '价格 - ' + subjectName + '- 众信悠哉旅游';

            $scope.keyword = subjectinfo.Area + maxDay + "日游价格," + subjectinfo.Area + maxDay + "日游线路推荐," + subjectinfo.Area + maxDay + "日游线路";
            $scope.description = subjectinfo.DetailsDesc.substring(0, 130);
            $("title").html($scope.title);
            $("meta[name='keywords']").attr('content', $scope.keyword);
            $("meta[name='description']").attr('content', $scope.description);
            // console.log($scope.keywords);
            //  console.log($scope.title);
            // console.log($scope.description);
            $scope.FilePath = JSON.parse(obj.JsonResult).DiscoverySubjectInfo.CoverImgUrl;
            $scope.title_m = subjectTitle;
            $scope.SubjectName = subjectName;
            $scope.pageUrl = JSON.parse(obj.JsonResult).PageUrl;
            // console.log($scope.pageUrl);
            var activityObj = JSON.parse(obj.JsonResult).DiscoveryActivityInfo;
            $scope.values = activityObj;
            $('#wrapper').show();

            // api.setLocalStorage('disuactivity' , userid);
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

            setTimeout(delay_img, 100);
        }
        else {
            api.toast(obj.ErrorMsg);
        }
    }, 3);

    function delay_img() {
        var elem = $('[data-src]');
        for (var i = 0; i < elem.length; i++) {
            if (elem.eq(i).offset().top < -myScroll.y + $('header').height() + $('.pad').height() + $('#wrapper').height()) {
                elem.eq(i).attr('src', elem.eq(i).attr('data-src')).removeAttr('data-src');
            }
        }
    }
    // myScroll.on('scrollEnd', delay_img);

    //添加专题到我的收藏
    $scope.addSubjectToFavorite = function () {
        if (favoriteid === '0') {
            //当前专题没有被收藏
            bridge.addSubjectToFavorite();
        } else {
            //当前专题已经被收藏，取消该收藏
            bridge.cancelSubjectFavorite(favoriteid);
        }
    };

    //分享专题
    $scope.shareSubject = function (title, content, imageUrl, pageUrl) {
        //新浪微博超过140个字无法分享，算上两个空格总长度控制在136
        content =  '【' + title + '】' + content;
        if (content.length + pageUrl.length > 136) {
            var allowedLength = 136 - pageUrl.length - 6;    //算上省略号长度
            if (pageUrl.length < 136 && content.length > allowedLength) {
                content = content.substring(0, allowedLength) + '...';
            }
        }
        bridge.shareSubject(title, content, imageUrl, pageUrl);
    };

    //页面左上角返回
    $scope.callback = function (url, islastpage, isrootpage) {
        bridge.goBack(url, islastpage, isrootpage, 1);
    };

}]);

myModule.directive('onFinishRender', onFinishRenderDirective);



function onFinishRenderDirective($timeout) {
    return {
        restrict: 'AE',
        link: function (scope) {
            if (scope.$first === true) {
                //window.alert('First thing about to render');
            }
            if (scope.$last === true) {
                $timeout(function () {
                    my_scroll();
                    myScroll.on('scrollEnd', function () {
                        for (var i = 0; i < $('img').length; i++) {
                            if ($('img').eq(i).offset().top < -myScroll.y + $('header').height() + $('#wrapper').height()) {
                                $('img').eq(i).attr('src', $('img').eq(i).attr('data-src'));
                            }
                        }
                        my_scroll();
                    });
                    $('#wrapper').on('touchmove', function (event) {
                        if (myScroll.pointY >= window.innerHeight - 1) {
                            myScroll.scrollTo(0, 0, 100);
                            return false;
                        } else if (myScroll.pointY <= 40) {
                            myScroll.scrollTo(0, myScroll.maxScrollY, 100);
                            return false;
                        }
                    });

                    for (var i = 0; i < $('img').length; i++) {
                        if ($('img').eq(i).offset().top < -myScroll.y + $('header').height() + $('#wrapper').height()) {
                            $('img').eq(i).attr('src', $('img').eq(i).attr('data-src'));
                        }
                    }
                });
            }
        }
    };
}

function my_scroll() {
    if (typeof myScroll === 'undefined') {
        window.myScroll = null;
        myScroll = new IScroll('#wrapper', {
            mouseWheel: true,
            click: true
        });
    } else {
        myScroll.refresh();
    }
}


/**
 * 收藏操作app反馈
 * Created by zhujiazhao on 16/6/14.
 * code      返回码
 * operate   操作类型 1，添加  2，取消
 * result    添加收藏返回收藏FavoriteId
 */
function addSubjectToFavoriteResponse(code, operate, result) {
    // api.setLocalStorage('response', code);
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
    bridge.goBack('', true, false, 1);
}
