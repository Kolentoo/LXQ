var uzaimemberid = '';
if (api.getUserId() !== '' && api.getUserId() !== null && typeof (api.getUserId()) !== 'undefined') {
    uzaimemberid = api.getUserId();
}
else {
    api.login(location.href, 'http://mhome.uzai.com');
}
(function () {
    'use strict';
    var memberid = api.getQueryString('userid');
    var userid = api.getLocalStorage('userid');

    if (memberid !== '' && typeof (memberid) !== 'undefined' && memberid !== null) {
        uzaimemberid = memberid;
    }
    else if (userid !== '' && typeof (userid) !== 'undefined' && userid !== null) {
        uzaimemberid = userid;
    }

    var cityId = 0;
    var cityname = '';
    if (api.isApp()) {
        $(".privilege").show();
        if(api.getLocalStorage('startcity')!=='' && typeof(api.getLocalStorage('startcity'))!=='undefined' && api.getLocalStorage('startcity')!==null) {
            if (api.getLocalStorage('startcity') === '上海') {
                cityId = 2;
            }else
            {
                cityId=1;
            }
        }
        else
        {
            cityId=2;
        }
    }
    else {
        $(".privilege").hide();
        var city = api.getCookie('uzmCity');
        if (city !== '' && typeof(city) !== 'undefined' && city!==null) {
            cityId = decodeURI(city.split('-')[1]);
        }
        else
        {
            Telephone_init();
            if (cityname === '北京') {
                cityId = 1;
            }
            else {
                cityId = 2;
            }
        }
        api.setLocalStorage("cityId", cityId);
    }

    function Telephone_init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleLocationError, {
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAccuracy: true,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: 1000,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: 0
            });
        }
    }

    //---------------定位成功
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
            }
            else if (cityname.indexOf("市") > 0) {
                cityname = cityname.replace(/市/, "");
            }
            else {
                cityname = cityname;
            }
            api.setLocalStorage("departureCityName", encodeURI(cityname));
        });
    }
    //---------------定位失败
    function handleLocationError(error) {
        cityname = "上海";
        api.setLocalStorage("departureCityName", encodeURI(cityname));
    }

    var mindex = angular.module('mindex', []);
    mindex.controller('mindexController', function ($http, $scope) {

        var param = JSON.stringify({
            "UzaiMemberId": uzaimemberid,
            "Type": 1,
            "PageIndex": 1,
            "PageCount": 10,
            "City": 0,
            "GroupType": 0,
            "ActivityType": 1
        });

        api.post($http, $scope, api.path.mhomelogic, 'MemberCenter', 'GetMemberCenterList', param, function (obj) {
            if (obj.ErrorCode === 200 || obj.ErrorCode === -3) {
                if (obj.ErrorCode === -3) {
                    api.toast('网络连接失败,请重试～');
                }
                else {
                    //获取活动数据将绑定文本的副标题取出来
                    var res = JSON.parse(obj.JsonResult);
                    if (res !== '' && typeof (res) !== 'undefined')
                    {
                        var act = res.MemberActivity;
                        if (act !== '' && typeof (act) !== 'undefined')
                        {
                            for (var i = 0; i < act.length; i++) {
                                var str = act[i].Content;
                                if (str !== '' && typeof (str) !== 'undefined') {
                                    str=str.replace(/\ +/g,"");//去掉空格
                                    str=str.replace(/[ ]/g,"");    //去掉空格
                                    str=str.replace(/[\r\n]/g,"");//去掉回车换行
                                    var cont;
                                    try
                                    {
                                        cont = JSON.parse(str);
                                        act[i].Content = cont[0].ImageDescribe;
                                    }
                                    catch(e){
                                        cont=str;
                                        act[i].Content=cont;
                                    }
                                }

                            }
                        }
                        //设置头像的默认图片
                        if(res.MemberInfo!=='' && typeof(res.MemberInfo)!=='undefined')
                        {
                            if(res.MemberInfo.HeadUrl==='' || res.MemberInfo.HeadUrl===null)
                            {
                                res.MemberInfo.HeadUrl='http://r03.uzaicdn.com/content/hybrid/images/member/headurl.png';
                            }
                        }
                    }
                    $scope.index = res;
                }
            }
            else {
                api.toast(obj.ErrorMsg);
            }
        });
        $scope.gproduct = function (productype, productid) {
            bridge.openProduct(productype, productid);
        };
        $scope.memberlevel=function(memlevel)
        {
            bridge.openMemberLevel(memlevel);
        }
        $scope.callback=function(url,islastpage,isrootpage)
        {
            bridge.goBack(url, islastpage, isrootpage,1);
        }
        $scope.JumpUrl=function(type,id)
        {
            if (type === 1)
            {
                window.location.href = "/mall/mall.html";
            } else if (type === 2)
            {
                window.location.href = "/membercenter/exclusivegroup.html";
            } else if (type === 3)
            {
                window.location.href = "/membercenter/activitylist.html";
            } else if (type === 4)
            {
                window.location.href = "/membercenter/udingzhi.html";
            }
            else if (type === 5)
            {
                window.location.href = "/membercenter/activitydetail.html?id=" + id + "&source=1";
            }

        }
    });
})();
function androidGoBack() {
    bridge.goBack('', true, false, 1);
}

window.onbeforeunload =function(){
    api.loading();

}
