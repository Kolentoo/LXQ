var city = [];
var myScroll;
var myScroll2;
var submitUrl = {
    "url": "http://mdingzhi.uzai.com/hybrid/order/index.html",
    "cityName": "",
    "cityid": ""
};
var baiduLocation = "";
//出发城市列表
$.fn.departurelist = function () {
    var group_title = $("#list_group_title");
    var destlist_catalogues = $(".destlist-catalogues");
    var ul = $(".list");
    var starting_list = [];
    //判断type==1是u圈定制跳转过来的
    if (udingzhitype == 1) {
        starting_list = [{
            "class": "B",

            "id": "1",

            "city": "bj",

            "txt": "北京"
        }, {
            "class": "S",

            "id": "2",

            "city": "sh",

            "txt": "上海"
        }];
    } else {


        //-----------------------获取城市列表
         starting_list = [{

            "class": "B",

            "id": "1",

            "city": "bj",

            "txt": "北京"

        }, {

            "class": "C",

            "id": "165",

            "city": "cd",

            "txt": "成都"

        }, {

            "class": "C",

            "id": "257",

            "city": "cc",

            "txt": "长春"

        }, {

            "class": "C",

            "id": "190",

            "city": "cs",

            "txt": "长沙"

        }, {

            "class": "C",

            "id": "68",

            "city": "cz",

            "txt": "常州"

        }, {

            "class": "C",

            "id": "4",

            "city": "cq",

            "txt": "重庆"

        }, {

            "class": "D",

            "id": "31",

            "city": "dl",

            "txt": "大连"

        }, {

            "class": "H",

            "id": "19",

            "city": "hz",

            "txt": "杭州"

        }, {

            "class": "H",

            "id": "238",

            "city": "hf",

            "txt": "合肥"

        }, {

            "class": "H",

            "id": "125",

            "city": "heb",

            "txt": "哈尔滨"

        }, {

            "class": "J",

            "id": "115",

            "city": "jn",

            "txt": "济南"

        }, {

            "class": "N",

            "id": "57",

            "city": "nj",

            "txt": "南京"

        }, {

            "class": "N",

            "id": "22",

            "city": "nb",

            "txt": "宁波"

        }, {

            "class": "N",

            "id": "83",

            "city": "nc",

            "txt": "南昌"

        }, {

            "class": "Q",

            "id": "116",

            "city": "qd",

            "txt": "青岛"

        }, {

            "class": "S",

            "id": "2",

            "city": "sh",

            "txt": "上海"

        }, {

            "class": "S",

            "id": "29",

            "city": "sy",

            "txt": "沈阳"

        }, {

            "class": "S",

            "id": "8",

            "city": "sjz",

            "txt": "石家庄"

        }, {

            "class": "S",

            "id": "60",

            "city": "szh",

            "txt": "苏州"

        }, {

            "class": "T",

            "id": "3",

            "city": "tj",

            "txt": "天津"

        }, {

            "class": "T",

            "id": "94",

            "city": "ty",

            "txt": "太原"

        }, {

            "class": "T",

            "id": "12",

            "city": "ts",

            "txt": "唐山"

        }, {

            "class": "W",

            "id": "43",

            "city": "wh",

            "txt": "武汉"

        }, {

            "class": "W",

            "id": "58",

            "city": "wx",

            "txt": "无锡"

        }, {

            "class": "X",

            "id": "135",

            "city": "xm",

            "txt": "厦门"

        }, {

            "class": "X",

            "id": "286",

            "city": "xa",

            "txt": "西安"

        }, {

            "class": "Z",

            "id": "204",

            "city": "zz",

            "txt": "郑州"

        }];
    }
    var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //-----------------------渲染城市列表
    function printHtml() {
        for (var i = 0; i < letter.length; i++) {
            for (var x = 0; x < starting_list.length; x++) {
                //判断是否一样
                if (starting_list[x].class == letter[i]) {
                    ul.children("li").each(function () {
                        if ($(this).attr("data-flag") == starting_list[x].class) {
                            $(this).append("<div class='item' data-city='" + starting_list[x].city + "' data-id='" + starting_list[x].id + "' >" + starting_list[x].txt + "</div>");
                        }
                    });
                }
            }
        }
        ul.children("li").each(function () {
            if ($(this).find(".item").length < 1) {
                //console.log($(this).attr("data-flag"));
                $(this).remove();
                return;
            }
            $(this).find(".item").each(function () {
                var txt = $(this).html();
                var id = $(this).attr("data-id");
                var citytxt = $(this).attr("data-city");
                city.push(txt + '-' + id + '-' + citytxt);
            });

        });
    }

    // 生成iscroll
    function loaded() {
        //先设置高度。。
        var fixFooterHeight = $(".search").height() + $(".spani").height();
        var windowHeight = $(window).height();
        $("#destlist").height(windowHeight - fixFooterHeight);
        //再生成滚动
        myScroll = new IScroll('#destlist', {
            snap: 'li',
            probeType: 2,
            click: true
        });
        myScroll.on('scroll', staticTitle);
        myScroll.on('scrollEnd', staticTitle);
    }

    //解决整体滚动

    function load1() {
        $("#wrapper").height($(window).height() - $("header").eq(0).height() + 5);
        myScroll2 = new IScroll('#wrapper', {
            probeType: 2,
            click: true
        });
    }


    //设置标题
    function staticTitle() {
        var num = this.currentPage.pageY;
        var text = $('.list').children('li').eq(num).children('.title').html();
        group_title.html(text);
        var height = $(".localcity").height();
        if (this.y < height * -1) {
            group_title.show();
        } else {
            group_title.hide();
        }
    }
    //生成右侧
    function createdNav() {
        destlist_catalogues.html('');
        for (var i = 0; i < ul.children("li").length; i++) {
            if (ul.children("li").eq(i).children(".title").html()) {
                destlist_catalogues.append("<b data-page='" + i + "'>" + ul.children("li").eq(i).children(".title").html() + "</b>");
            } else {
                return false;
            }
        }
        destlist_catalogues.delegate("b", "click", function () {
            // "$(this)" is the node that was clicked
            myScroll.goToPage(0, $(this).attr("data-page"), 1000);
            myScroll.on('scroll', staticTitle);
            myScroll.on('scrollEnd', staticTitle);
        });
    }

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);


    //－－－－－－－－－－－－－－－判断当前城市

    //是否进行了手动选择
    //var selectCity = false;

    function updateStatus(message) {
        $('.localcity-city').html(message);
    }


    function getCityId(cityName) {
        for (var i = 0; i < starting_list.length; i++) {
            for (var j = 0; starting_list[i].CityView != null && j < starting_list[i].CityView.length; j++) {
                if (starting_list[i].CityView[j].CityName == cityName) {
                    return starting_list[i].CityView[j].CityID;
                }
            }
        }
    }


    //定位成功
    function showPosition(position) {
        //console.log("定位成功");
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var point = new BMap.Point(longitude, latitude);
        // 创建点坐标
        var gc = new BMap.Geocoder();
        gc.getLocation(point, function (rs) {
            var locationCity = rs.addressComponents.city.replace(/市/g, '');
            var cityId = getCityId(locationCity);
            baiduLocation = locationCity;
            //console.log('----定位成功'+baiduLocation)
            $(".localcity-city").html("\u5f53\u524d\u57ce\u5e02\uff1a" + "<em>" + locationCity + "</em>");
        });


    }



    //定位失败
    function handleLocationError(error) {
        switch (error.code) {
            case 0:
                updateStatus("尝试获取您的位置信息时发生错误：" + error.message);
                break;
            case 1:
                updateStatus("用户拒绝了获取位置信息请求。");
                break;
            case 2:
                updateStatus("浏览器无法获取您的位置信息：" + error.message);
                break;
            case 3:
                updateStatus("获取您位置信息超时。");
                break;
        }
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURI(arr[2]);
        else
            return null;
    }

    //判断当前位置
    function locationCitys() {

        if (api.getQueryString('devicetype') == 'ios' || api.getQueryString('devicetype') == 'android') {
            var appcity = api.getLocalStorage('departureCityName');
            appcity = decodeURI(appcity);
            if (appcity.indexOf("省") > 0) {
                appcity = appcity.replace(/省/g, "");
            } else if (appcity.indexOf("市") > 0) {
                departureCityName = departureCityName.replace(/市/g, "");
            }
            $(".localcity-city").html("\u5f53\u524d\u57ce\u5e02\uff1a" + "<em>" + appcity + "</em>");
            return false;
        }
        //默认读取cookie,没有cookie 调用百度地图的
        if (api.getCookie("uzmCity") != null && devicetype != 'ios' && devicetype != 'android') {
            var city = getCookie("uzmCity").toString().split('-');
            $(".localcity-city").html("\u5f53\u524d\u57ce\u5e02\uff1a" + "<em>" + decodeURI(city[0]) + "</em>");
        } else {
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
                return false;
            }
        }
    }

    //------------------------------最后

    printHtml();
    createdNav();
    loaded();
    locationCitys();
    load1();


};

//搜索城市
$.fn.querycity = function () {
    var input = $(this);
    var group_title = $("#list_group_title");
    var destlist_catalogues = $(".destlist-catalogues");
    var destlist = $("#destlist");

    function search(val) {
        if (val) {
            input.val(input.val().toLowerCase());
            var search_a = [];
            for (var i = 0; i < city.length; i++) {
                var item = city[i];
                if (item.indexOf(val) > -1) {
                    search_a.push(item);
                } else {

                }
            }
            var search_b = [];
            for (var i = 0; i < search_a.length; i++) {
                var item = search_a[i];
                search_b.push("<div class=\"item\" data-city='" + item.split('-')[2] + "' data-id='" + item.split('-')[1] + "' >" + item.split('-')[0] + "</div>");
            }
            if (search_b.length > 0) {
                $('body').children(".list-group-search-error,.list-group-search").remove();
                $('body').append("<div class=\"list-group list-group-search\">" + search_b.join('') + "</div>");
                itemclick();
            } else {
                $('body').children(".list-group-search-error,.list-group-search").remove();
                $('body').append("<div class=\"list-group list-group-search-error\">\u62b1\u6b49\uff5e\u6ca1\u6709\u641c\u7d22\u5230\u57ce\u5e02\uff5e</div>");
            }
        } else {
            cityListShow();
        }
    }

    function cityListHide() {
        group_title.hide();
        destlist_catalogues.hide();
        destlist.hide();
    }

    function cityListShow() {
        $(".list-group-search").remove();
        group_title.hide();
        destlist_catalogues.show();
        destlist.show();
    }

    if ($.trim(input.val()) == "") {
        cityListShow();
    } else {
        cityListHide();
        search(input.val().toLowerCase());
    }


};

function itemclick() {
    $('.item').on('click', function (obj) {
        submitUrl.cityid = $(this).attr('data-id');
        submitUrl.cityName = $(this).html();
        submitUrl.cityName = submitUrl.cityName;
        //api.setLocalStorage("departureCityName", encodeURI(submitUrl.cityName));
        //api.setLocalStorage("departureCityId", submitUrl.cityid);
        //alert(submitUrl.cityName);
        //window.location.href=submitUrl.url+"?cityid="+submitUrl.cityid+"&cityName="+submitUrl.cityName;
        setadr.init(submitUrl.cityName);
        setadr.xianshi();
    });
}

//点击地点赋值
var setadr = {
    init: function (departureCity) {
        $("#startCityName1").text(departureCity);
        $("#startCityName2").text(departureCity);
    },
    xianshi: function () {
        if (isCompany == false) {
            $(".content2").css("right", "100rem");
            $(".content1").show();
            $(".xuanze").hide();
            $(".acus").hide();
            $(".pcus").show();
            $(".pgerenxinxi").hide();
            $(".agerenxinxi").hide();
        } else if (isCompany == true) {
            $(".content2").css("right", "100rem");
            $(".content1").show();
            $(".xuanze").hide();
            $(".pcus").hide();
            $(".acus").show();
            $(".pgerenxinxi").hide();
            $(".agerenxinxi").hide();
        }
        var group_title = $("#list_group_title");
        var destlist_catalogues = $(".destlist-catalogues");
        var destlist = $("#destlist");
        $(".list-group-search,.list-group-search-error").remove();
        group_title.hide();
        destlist_catalogues.show();
        destlist.show();
        if ($.trim($(".search-input ").val()) != '') {
            $(".search-input ").val('');
        }
    }
}



window.addEventListener("orientationchange", function () {
    orderIndexResize();
}, false);



function orderIndexResize() {
    var fixFooterHeight = $(".search").height() + $(".dmhd").height();
    var windowHeight = $(window).height();
    $("#destlist").height(windowHeight - fixFooterHeight);
    $("#wrapper").height($(window).height() - $("header").eq(0).height() + 5);
    myScroll.refresh();
    myScroll2.refresh();
}
