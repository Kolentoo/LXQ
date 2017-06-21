var isCompany;

var devicetype = api.getQueryString('devicetype');
var udingzhitype = api.getQueryString('udingzhitype');
var pclicknum = 0;

var post_callback = 'false';

// 绑定click事件用

function fns() {

    $("#Telephone").click(function () {

        if (devicetype == 'ios' || devicetype == 'android') {

            var province = decodeURI(api.getLocalStorage('province'));

            if (province == "上海市" || province == "浙江省" || province == "安徽省" || province == "江苏省") {

                $("#Telephone").attr("href", "tel:4000008888");

            } else {

                $("#Telephone").attr("href", "tel:4000008888");

            }

        } else {


            if (api.getCookie("Telephone") != null) {

                $("#Telephone").attr("href", "tel:" + api.getCookie("Telephone"));

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


                    $("#Telephone").attr("href", "tel:4000008888");

                }

            }


        }

    });
    //判断type=1是u圈定制跳转过来的
    if (udingzhitype == 1) {
        pcustom();
        $('.phsq').children('.scdiv').hide()
        $('.pyuSuan').children("option[value='5000以下']").remove();
    }
    function pcustom() {
        loadRefresh();

        $(".xuanze").hide();

        $(".pcus").show();

        //clearacus();

        isCompany = false;

        api.setLocalStorage('isCompany', isCompany);

        $(".title-name").text("私人定制");

        $(".back1").hide();

        $("footer").hide();

        myScroll2.refresh();

        $("header").css("background", "#f6f6f6");

        $("header").css("border-bottom", "1px solid #ddd");
    }

    $(".pcustom").click(function () {

        pcustom();
    });


    $(".acustom").click(function () {

        loadRefresh();

        $(".xuanze").hide();

        $(".acus").show();

        isCompany = true;

        api.setLocalStorage('isCompany', isCompany);

        //clearsr();

        $("footer").hide();

        $(".title-name").text("企业定制");

        $(".back1").hide();

        $("header").css("background", "#f6f6f6");

        $("header").css("border-bottom", "1px solid #ddd");

        myScroll2.refresh();

    });

    $(".srpre").click(function () {

        $(".tishi").hide();

        $(".redb").removeClass('redb');

        $(".redbotom").removeClass("redbotom");

        $(".scdiv p").hide();

        $(".pcus").hide();

        $(".xuanze").show();

        $(".title-name").text("");

        $("header").css("background", "transparent");

        $("header").css("border-bottom", "none");

        $(".back1").show();

        $("footer").show();

        $(".zengjia").hide();

        $(".zengjia2").hide();

        myScroll2.refresh();

        $("#texQiye").blur();

        $("#texGeren").blur();


        myScroll2.scrollTo(0, 0);

    });


    //私人定制页面点击下一步

    $(".srnext").click(function () {

        yanzhengsr();

        $(".zengjia").hide();

        $(".zengjia2").hide();

        $("#texQiye").blur();

        $("#texGeren").blur();

        myScroll2.refresh();


        myScroll2.scrollTo(0, 0);


    });


    $(".qypre").click(function () {

        $(".tishi").hide();

        $(".redb").removeClass('redb');

        $(".redbotom").removeClass("redbotom");

        $(".acus").hide();

        $(".xuanze").show();

        a = 0;

        $(".title-name").text("");

        $("header").css("background", "transparent");

        $("header").css("border-bottom", "none");

        $(".back1").show();

        $("footer").show();


        isCompany = "";

        $(".zengjia").hide();

        $(".zengjia2").hide();

        $("#texQiye").blur();

        $("#texGeren").blur();

        myScroll2.refresh();


        myScroll2.scrollTo(0, 0);

    });

    $(".qynext").click(function () {



        /*   $(".acus").hide();

         $(".pgerenxinxi").hide();

         $(".agerenxinxi").show();*/


        yanzhengqy();


        $(".zengjia").hide();

        $(".zengjia2").hide();

        $("#texQiye").blur();

        $("#texGeren").blur();

        myScroll2.refresh();


        myScroll2.scrollTo(0, 0);


    });


    $(".ainfspre").click(function () {

        $("#enterprise").find('.scdiv').removeClass('redbotom');

        $(".tishi").hide();

        $(".pgerenxinxi").hide();

        $(".agerenxinxi").hide();

        $(".acus").show();

        $(".pcus").hide();

        $(".title-name").text("企业定制");

        $("header").css("background", "#f6f6f6");

        $("header").css("border-bottom", "1px solid #ddd");

        $("#wrapper").height($(window).height() - $("header").eq(0).height() + 5);

        myScroll2.refresh();

        myScroll2.scrollTo(0, 0);

    });

    $(".pinfspre").click(function () {

        $("#personal").find('.scdiv').removeClass('redbotom');

        $(".tishi").hide();

        $(".pgerenxinxi").hide();

        $(".agerenxinxi").hide();

        $(".pcus").show();

        $(".acus").hide();

        $(".title-name").text("私人定制");

        $("header").css("background", "#f6f6f6");

        $("header").css("border-bottom", "1px solid #ddd");

        //$("#wrapper").height($(window).height() - $("header").eq(0).height() + 5);

        myScroll2.refresh();


        myScroll2.scrollTo(0, 0);


    });


    //触发事件

    $('.zengjia').on('touchstart', function () {

        $(".zengjia").hide();

        $(".zengjia2").hide();

        $("#texQiye").blur();

        $("#texGeren").blur();

        myScroll2.refresh();


        myScroll2.scrollTo(0, 0);


    });

    //触发事件

    $('.zengjia2').on('touchstart', function () {

        $(".zengjia").hide();

        $(".zengjia2").hide();

        $("#texQiye").blur();

        $("#texGeren").blur();

        myScroll2.refresh();


        myScroll2.scrollTo(0, 0);


    });


    $(".back2").click(function () {

        if (isCompany == false) {

            $(".content2").css("right", "100rem");

            $(".content1").show();

            $(".xuanze").hide();

            $(".acus").hide();

            $(".pcus").show();

            $(".pgerenxinxi").hide();

            $(".agerenxinxi").hide();

            setadr.xianshi();

        } else if (isCompany == true) {

            $(".content2").css("right", "100rem");

            $(".content1").show();

            $(".xuanze").hide();

            $(".pcus").hide();

            $(".acus").show();

            $(".pgerenxinxi").hide();

            $(".agerenxinxi").hide();

            setadr.xianshi();

        }

    });


    $("#locationName1").focus(function () {

        var locationName1 = $(this).val();

        if (locationName1 == null || locationName1 == "" || locationName1 == "您想去哪儿") {

            $(this).val("");

        } else {

            $(this).val(locationName1);

        }

    });


    $("#locationName1").blur(function () {

        var locationName1 = $(this).val();

        if (locationName1 == null || locationName1 == "" || locationName1 == "您想去哪儿") {

            $(this).val("您想去哪儿");

        }

    });


    $("#locationName2").focus(function () {

        var locationName2 = $(this).val();

        if (locationName2 == null || locationName2 == "" || locationName2 == "您想去哪儿") {

            $(this).val("");

        } else {

            $(this).val(locationName2);

        }

    });


    $("#locationName2").blur(function () {

        var locationName2 = $(this).val();

        if (locationName2 == null || locationName2 == "" || locationName2 == "您想去哪儿") {

            $(this).val("您想去哪儿");

        }

    });


    $(".index-btn").on('click', function () {

        pages.removeLocalStorage();

    });

    $(".order-btn").on('click', function () {

        pages.removeLocalStorage();

    });

}


var myModule = angular.module('MyModule', []);

myModule.controller('MyCtrl', function ($scope, $http) {

    //获取登陆信息

    $scope.fninfor = function () {

        var uid = api.getUserId();

        if (uid == '' || uid == 0 || uid == undefined || uid == null) {

            return '';

        } else {

            var param = JSON.stringify({

                "UserID": uid

            });


            api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'GetUserInfo', param,

                function (obj) {

                    if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {

                        if (obj.ErrorCode == -3) {

                            api.toast('网络连接失败,请重试～');

                            return;

                        }

                        $scope.userinfo = JSON.parse(obj.JsonResult);

                        if ($.trim($scope.userinfo.RealName) != '') {

                            $('#personal').find('.puserName').addClass('select-change');

                        }

                        if ($.trim($scope.userinfo.Phone) != '') {

                            $('#personal').find('.pphone').addClass('select-change');

                        }

                        //console.log(obj.JsonResult);


                    } else {

                        api.toast(obj.ErrorMsg, 3000);

                    }

                },

                0, false);

        }

    };

    $scope.fnqiye = function () {

        var uid = api.getUserId();

        if (uid == '' || uid == 0 || uid == undefined || uid == null) {

            return '';

        } else {

            var param = JSON.stringify({

                "UserID": uid

            });


            api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'GetUserInfo', param,

                function (obj) {

                    if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {

                        if (obj.ErrorCode == -3) {

                            api.toast('网络连接失败,请重试～');

                            return;

                        }

                        $scope.userinfo = JSON.parse(obj.JsonResult);

                        //console.log(obj.JsonResult);

                        if ($.trim($scope.userinfo.RealName) != '') {

                            $('#enterprise').find('.auserName').addClass('select-change');

                        }

                        if ($.trim($scope.userinfo.Mobile) != '') {

                            $('#enterprise').find('.aphone').addClass('select-change');

                        }

                    } else {

                        api.toast(obj.ErrorMsg, 3000);

                    }

                },

                0, false);

        }

    };

    $scope.afn = function () {

        if (post_callback == 'true') {

            return false;

        }

        var startCityName = $.trim($("#startCityName2").text());

        var locationName = $.trim($("#locationName2").val());

        var minDays = $(".aminDays").val();

        var goWith = $(".agoWith").val();

        var minPerson = $(".aminPerson").val();

        var companyType = $(".acompanyType").val();

        var teamType = $(".ateamType").val();

        var hotelInfo = $(".ahotelInfo").val();

        var yuSuan = $(".ayuSuan").val();

        var userName = $(".auserName").val();

        var email = $(".aemail").val();

        var phone = $(".aphone").val();

        var cityid = decodeURI(api.getQueryString('cityid'));

        var productId = api.getLocalStorage("productId");

        var remark = $("#texQiye").val();

        var uid = api.getUserId();

        //企业入驻验证

        if (goWith == "moren") {

            gowith = "";

        }

        if (teamType == "moren") {

            teamType = "";

        }

        if (companyType == "moren") {

            companyType = "";

        }


        var param = JSON.stringify({

            "StartCityName": startCityName,

            "LocationName": locationName,

            "MinDays": minDays,

            //"GoWith":goWith,

            "MinPerson": minPerson,

            "MinDays": minDays,

            "IsCompany": true,

            "CompanyType": companyType,

            "TeamType": teamType,

            "HotelInfo": hotelInfo,

            "YuSuan": yuSuan,

            "UserName": userName,

            "Weixin": email,

            "Phone": phone,

            "IsMobile": true,

            "ProID": productId,

            "Remark": remark,

            "UserId": uid,

            "StartCity": submitUrl.cityid

        });


        var userName = $(".auserName").val();

        var email = $(".aemail").val();

        var phone = $(".aphone").val();

        var p = "^(13|15|17|18)[0-9]{9}$";

        if (userName.trim() == "") {

            $('.axm').addClass('redb');

            $('.axm').find(".scdiv").addClass("redbotom");

            $('.axm').find("p").show();


            $(".asjh").removeClass('redb');

            $(".asjh").find(".scdiv").removeClass("redbotom");

            $(".asjh p").hide();


            return;

        } else if (phone.trim() == "") {

            $(".axm").removeClass('redb');

            $(".axm").find(".scdiv").removeClass("redbotom");

            $(".axm p").hide();


            $('.asjh').addClass('redb');

            $('.asjh').find(".scdiv").addClass("redbotom");

            $('.asjh').find("p").text("手机不能为空");

            $('.asjh').find("p").show();

            return;

        } else if (!phone.match(p)) {

            $('.asjh').addClass('redb');

            $('.asjh').find(".scdiv").addClass("redbotom");

            $('.asjh').find("p").text("手机格式不对");

            $('.asjh').find("p").show();

            $(".axm").removeClass('redb');

            $(".axm").find(".scdiv").removeClass("redbotom");

            $(".axm p").hide();

            return;

        } else {

            $(".asjh").removeClass('redb');

            $(".asjh").find(".scdiv").removeClass("redbotom");

            $(".asjh p").hide();


            $(".axm").removeClass('redb');

            $(".axm").find(".scdiv").removeClass("redbotom");

            $(".axm p").hide();

            InsertOrder(param, $scope, $http); //添加订单

        }


    };


    //点击地点跳转结束 个人提交

    $scope.pfn = function () {

        if (post_callback == 'true') {

            return false;

        }

        // alert(submitUrl.cityid);

        //alert(pclicknum);

        //console.log('---pfn');

        var startCityName = $.trim($("#startCityNameBtn").text());

        var locationName = $.trim($("#locationName1").val());

        var minDays = $(".pminDays").val();

        var goWith = $(".pgoWith").val();

        var minDays = $(".pminDays").val();

        var minPerson = $(".pminPerson").val();

        var isCompany = false;

        var companyType = $(".pcompanyType").val();

        var teamType = $(".pteamType").val();

        var hotelInfo = $(".photelInfo").val();

        var yuSuan = $(".pyuSuan").val();

        var userName = $(".puserName").val();

        var email = $(".pemail").val();

        var phone = $(".pphone").val();

        var cityid = decodeURI(api.getQueryString('cityid'));

        var productId = api.getLocalStorage("productId");

        var remark = $("#texGeren").val();

        var uid = api.getUserId();


        //私人定制验证

        if (goWith == "moren") {

            goWith = "";

        }
        //type==1为u圈定制，订单类型sourcetype为1
        var OrderSourceType = 0;
        if (udingzhitype == 1) {
            OrderSourceType = 1;
        }

        var param = JSON.stringify({

            "StartCityName": startCityName,

            "LocationName": locationName,

            "MinDays": minDays,

            "GoWith": goWith,

            "MinPerson": minPerson,

            "IsCompany": isCompany,

            "CompanyType": companyType,

            "TeamType": teamType,

            "HotelInfo": hotelInfo,

            "YuSuan": yuSuan,

            "UserName": userName,

            "Weixin": email,

            "Phone": phone,

            "IsMobile": true,

            "ProID": productId,

            "Remark": remark,

            "UserId": uid,

            "StartCity": submitUrl.cityid,
            "OrderSourceType": OrderSourceType

        });


        var userName = $(".puserName").val();

        var email = $(".pemail").val();

        var phone = $(".pphone").val();

        var p = "^(13|15|17|18)[0-9]{9}$";

        if (userName.trim() == "") {

            $('.pxm').addClass('redb');

            $('.pxm').find(".scdiv").addClass("redbotom");

            $('.pxm').find("p").show();


            $(".psjh").removeClass('redb');

            $(".psjh").find(".scdiv").removeClass("redbotom");

            $(".psjh p").hide();


            return;

        } else if (phone.trim() == "") {

            $(".pxm").removeClass('redb');

            $(".pxm").find(".scdiv").removeClass("redbotom");

            $(".pxm p").hide();


            $('.psjh').addClass('redb');

            $('.psjh').find(".scdiv").addClass("redbotom");

            $('.psjh').find("p").text("手机不能为空");

            $('.psjh').find("p").show();

            return;

        } else if (!phone.match(p)) {

            $('.psjh').addClass('redb');

            $('.psjh').find(".scdiv").addClass("redbotom");

            $('.psjh').find("p").text("手机格式不对");

            $('.psjh').find("p").show();

            $(".pxm").removeClass('redb');

            $(".pxm").find(".scdiv").removeClass("redbotom");

            $(".pxm p").hide();

            return;

        } else {

            $(".psjh").removeClass('redb');

            $(".psjh").find(".scdiv").removeClass("redbotom");

            $(".psjh p").hide();

            $(".pxm").removeClass('redb');

            $(".pxm").find(".scdiv").removeClass("redbotom");

            $(".pxm p").hide();

            InsertOrder(param, $scope, $http); //添加订单

        }

    };

    $scope.goback = function () {
        if (udingzhitype == 1) {
            bridge.goBack('http://mhome.uzai.com/membercenter/udingzhi.html', true, false, 1);
        }
        else {
            bridge.goBack('http://mdingzhi.uzai.com/order/index.html', true, false, 0);
        }
    }
});


//清空企业里面的所有数据

function clearacus() {

    $('.acus').find("#startCityName").text("请选择出发地点").removeClass('select-change');

    $('.acus').find(".aminDays").eq(0).val('moren').show().removeClass('select-change');

    $('.acus').find(".agoWith").eq(0).val('moren').show().removeClass('select-change');

    $('.acus').find(".aminPerson").eq(0).val('moren').show().removeClass('select-change');

    $('.acus').find(".acompanyType").eq(0).val('moren').show().removeClass('select-change');

    $('.acus').find(".ateamType").eq(0).val('moren').show().removeClass('select-change');

    $('.acus').find(".ahotelInfo").eq(0).val('moren').show().removeClass('select-change');

    $('.acus').find(".ayuSuan").eq(0).val('moren').show().removeClass('select-change');

    $(".auserName").val("").removeClass('select-change');

    $(".aemail").val("").removeClass('select-change');

    $(".aphone").val("").removeClass('select-change');


}


//清空私人定制里面的所有数据

function clearsr() {

    $('.pcus').find("#startCityName").text("请选择出发地点").removeClass('select-change');

    //$('.pcus').find(".minDays").children("option").eq(0).attr('selected','selected');

    $('.pcus').find(".pminDays").eq(0).val('moren').show().removeClass('select-change');

    $('.pcus').find(".pgoWith").eq(0).val('moren').show().removeClass('select-change');

    $('.pcus').find(".pminPerson").eq(0).val('moren').show().removeClass('select-change');

    $('.pcus').find(".pcompanyType").eq(0).val('moren').show().removeClass('select-change');

    $('.pcus').find(".pteamType").eq(0).val('moren').show().removeClass('select-change');

    $('.pcus').find(".photelInfo").eq(0).val('moren').show().removeClass('select-change');

    $('.pcus').find(".pyuSuan").eq(0).val('moren').show().removeClass('select-change');

    $(".puserName").val("").removeClass('select-change');

    $(".pemail").val("").removeClass('select-change');

    $(".pphone").val("").removeClass('select-change');

}


//初始化提示

function inits() {

    $('.pcus').find("#startCityName").text("请选择出发地点");

    $('.pcus').find(".goWith").eq(0).val('moren').show();

    $('.pcus').find(".minPerson").eq(0).val('moren').show();

    $('.pcus').find(".isCompany").eq(0).val('moren').show();

    $('.pcus').find(".companyType").eq(0).val('moren').show();

    $('.pcus').find(".teamType").eq(0).val('moren').show();

    $('.pcus').find(".hotelInfo").eq(0).val('moren').show();

    $('.pcus').find(".yuSuan").eq(0).val('moren').show();

    $(".puserName").val("");

    $(".pemail").val("");

    $(".pphone").val("");

    $('.acus').find("#startCityName").text("请选择出发地点");

    $('.acus').find(".minDays").eq(0).val('moren').show();

    $('.acus').find(".goWith").eq(0).val('moren').show();

    $('.acus').find(".minPerson").eq(0).val('moren').show();

    $('.acus').find(".isCompany").eq(0).val('moren').show();

    $('.acus').find(".companyType").eq(0).val('moren').show();

    $('.acus').find(".teamType").eq(0).val('moren').show();

    $('.acus').find(".hotelInfo").eq(0).val('moren').show();

    $('.acus').find(".yuSuan").eq(0).val('moren').show();

    $(".auserName").val("");

    $(".aemail").val("");

    $(".aphone").val("");

    $("p").hide();


    $(".pqjt").removeClass('redb');

    $(".pqjt").find(".scdiv").removeClass("redbotom");

    $(".phsq").removeClass('redb');

    $(".phsq").find(".scdiv").removeClass("redbotom");

    $(".ptxrs").removeClass('redb');

    $(".ptxrs").find(".scdiv").removeClass("redbotom");

    $(".prjys").removeClass('redb');

    $(".prjys").find(".scdiv").removeClass("redbotom");

    $(".pjdlx").removeClass('redb');

    $(".pjdlx").find(".scdiv").removeClass("redbotom");


}

//私人定制页验证

function yanzhengsr() {

    var startCityName = $("#startCityName1").text();

    var locationName1 = $("#locationName1").val();

    var minDays = $(".pminDays").val();

    var goWith = $(".pgoWith").val();

    var minDays = $(".pminDays").val();

    var minPerson = $(".pminPerson").val();

    var isCompany = false;

    var companyType = $(".pcompanyType").val();

    var teamType = $(".pteamType").val();

    var hotelInfo = $(".photelInfo").val();

    var yuSuan = $(".pyuSuan").val();


    //验证qujitian

    if (startCityName == null || startCityName == "请选择" || startCityName.trim() == "") {

        api.toast("出发城市不能为空", 3000);

        return;

    } else if (locationName1 == null || locationName1 == "您想去哪儿" || locationName1.trim() == "") {

        api.toast("到达城市不能为空", 3000);

        return;

    } else if (minDays == "moren") {

        $('.pqjt').addClass('redb');

        $('.pqjt').find(".scdiv").addClass("redbotom");

        $('.pqjt').find("p").show();


        $(".ptxrs").removeClass('redb');

        $(".ptxrs").find(".scdiv").removeClass("redbotom");

        $(".ptxrs p").hide();


        $(".prjys").removeClass('redb');

        $(".prjys").find(".scdiv").removeClass("redbotom");

        $(".prjys p").hide();


        $(".pjdlx").removeClass('redb');

        $(".pjdlx").find(".scdiv").removeClass("redbotom");

        $(".pjdlx p").hide();


        return;


    } else if (minPerson == "moren") {

        $('.ptxrs').addClass('redb');

        $('.ptxrs').find(".scdiv").addClass("redbotom");

        $('.ptxrs').find("p").show();


        $(".prjys").removeClass('redb');

        $(".prjys").find(".scdiv").removeClass("redbotom");

        $(".prjys p").hide();


        $(".pjdlx").removeClass('redb');

        $(".pjdlx").find(".scdiv").removeClass("redbotom");

        $(".pjdlx p").hide();


        $(".pqjt").removeClass('redb');

        $(".pqjt").find(".scdiv").removeClass("redbotom");

        $(".pqjt p").hide();


        return;


    } else if (hotelInfo == "moren") {

        $('.pjdlx').addClass('redb');

        $('.pjdlx').find(".scdiv").addClass("redbotom");

        $('.pjdlx').find("p").show();


        $(".pqjt").removeClass('redb');

        $(".pqjt").find(".scdiv").removeClass("redbotom");

        $(".pqjt p").hide();


        $(".ptxrs").removeClass('redb');

        $(".ptxrs").find(".scdiv").removeClass("redbotom");

        $(".ptxrs p").hide();


        $(".prjys").removeClass('redb');

        $(".prjys").find(".scdiv").removeClass("redbotom");

        $(".prjys p").hide();

        return;


    } else if (yuSuan == "moren") {

        $('.prjys').addClass('redb');

        $('.prjys').find(".scdiv").addClass("redbotom");

        $('.prjys').find("p").show();


        $(".pjdlx").removeClass('redb');

        $(".pjdlx").find(".scdiv").removeClass("redbotom");

        $(".pjdlx p").hide();


        $(".pqjt").removeClass('redb');

        $(".pqjt").find(".scdiv").removeClass("redbotom");

        $(".pqjt p").hide();


        $(".ptxrs").removeClass('redb');

        $(".ptxrs").find(".scdiv").removeClass("redbotom");

        $(".ptxrs p").hide();

        return;


    } else {

        $(".prjys").removeClass('redb');

        $(".prjys").find(".scdiv").removeClass("redbotom");

        $(".prjys p").hide();


        $(".pjdlx").removeClass('redb');

        $(".pjdlx").find(".scdiv").removeClass("redbotom");

        $(".pjdlx p").hide();


        $(".pqjt").removeClass('redb');

        $(".pqjt").find(".scdiv").removeClass("redbotom");

        $(".pqjt p").hide();


        $(".ptxrs").removeClass('redb');

        $(".ptxrs").find(".scdiv").removeClass("redbotom");

        $(".ptxrs p").hide();


        $(".pcus").hide();

        $(".pgerenxinxi").show();

        $(".agerenxinxi").hide();

        $(".title-name").text("");

        $("header").css("background", "transparent");

        $("header").css("border-bottom", "none");

        $(".back1").hide();

    }

}


//企业定制页验证

function yanzhengqy() {

    var startCityName = $("#startCityName2").text();

    var locationName1 = $("#locationName2").val();

    var minDays = $(".aminDays").val();

    var goWith = $(".agoWith").val();

    var minDays = $(".aminDays").val();

    var minPerson = $(".aminPerson").val();

    var isCompany = false;

    var companyType = $(".acompanyType").val();

    var teamType = $(".ateamType").val();

    var hotelInfo = $(".ahotelInfo").val();

    var yuSuan = $(".ayuSuan").val();


    //验证qujitian

    if (startCityName == null || startCityName == "请选择" || startCityName.trim() == "") {

        api.toast("出发城市不能为空", 3000);

        return;

    } else if (locationName1 == null || locationName1 == "您想去哪儿" || locationName1.trim() == "") {

        api.toast("到达城市不能为空", 3000);

        return;

    } else if (minDays == "moren") {

        $('.aqjt').addClass('redb');

        $('.aqjt').find(".scdiv").addClass("redbotom");

        $('.aqjt').find("p").show();


        $(".atxrs").removeClass('redb');

        $(".atxrs").find(".scdiv").removeClass("redbotom");

        $(".atxrs p").hide();


        $(".arjys").removeClass('redb');

        $(".arjys").find(".scdiv").removeClass("redbotom");

        $(".arjys p").hide();


        $(".ajdlx").removeClass('redb');

        $(".ajdlx").find(".scdiv").removeClass("redbotom");

        $(".ajdlx p").hide();


        return;


    } else if (minPerson == "moren") {

        $('.atxrs').addClass('redb');

        $('.atxrs').find(".scdiv").addClass("redbotom");

        $('.atxrs').find("p").show();


        $(".arjys").removeClass('redb');

        $(".arjys").find(".scdiv").removeClass("redbotom");

        $(".arjys p").hide();


        $(".ajdlx").removeClass('redb');

        $(".ajdlx").find(".scdiv").removeClass("redbotom");

        $(".ajdlx p").hide();


        $(".aqjt").removeClass('redb');

        $(".aqjt").find(".scdiv").removeClass("redbotom");

        $(".aqjt p").hide();


        return;


    } else if (hotelInfo == "moren") {

        $('.ajdlx').addClass('redb');

        $('.ajdlx').find(".scdiv").addClass("redbotom");

        $('.ajdlx').find("p").show();


        $(".aqjt").removeClass('redb');

        $(".aqjt").find(".scdiv").removeClass("redbotom");

        $(".aqjt p").hide();


        $(".atxrs").removeClass('redb');

        $(".atxrs").find(".scdiv").removeClass("redbotom");

        $(".atxrs p").hide();


        $(".arjys").removeClass('redb');

        $(".arjys").find(".scdiv").removeClass("redbotom");

        $(".arjys p").hide();

        return;


    } else if (yuSuan == "moren") {

        $('.arjys').addClass('redb');

        $('.arjys').find(".scdiv").addClass("redbotom");

        $('.arjys').find("p").show();


        $(".ajdlx").removeClass('redb');

        $(".ajdlx").find(".scdiv").removeClass("redbotom");

        $(".ajdlx p").hide();


        $(".aqjt").removeClass('redb');

        $(".aqjt").find(".scdiv").removeClass("redbotom");

        $(".aqjt p").hide();


        $(".atxrs").removeClass('redb');

        $(".atxrs").find(".scdiv").removeClass("redbotom");

        $(".atxrs p").hide();

        return;


    } else {

        $(".arjys").removeClass('redb');

        $(".arjys").find(".scdiv").removeClass("redbotom");

        $(".arjys p").hide();


        $(".ajdlx").removeClass('redb');

        $(".ajdlx").find(".scdiv").removeClass("redbotom");

        $(".ajdlx p").hide();


        $(".aqjt").removeClass('redb');

        $(".aqjt").find(".scdiv").removeClass("redbotom");

        $(".aqjt p").hide();


        $(".atxrs").removeClass('redb');

        $(".atxrs").find(".scdiv").removeClass("redbotom");

        $(".atxrs p").hide();


        $(".acus").hide();

        $(".agerenxinxi").show();

        $(".pgerenxinxi").hide();


        $(".title-name").text("");

        $("header").css("background", "transparent");

        $("header").css("border-bottom", "none");

        $(".back1").hide();

    }

}


//私人定制出发城市

$("#startCityNameBtn").click(function () {

    api.setLocalStorage("isCompany", isCompany);

    // window.location.href = "http://mdingzhi.uzai.com/hybrid/departurecitylist.html";

    $(".content1").hide();

    $(".content2").css("right", 0);

    itemclick();

    isCompany = false;


});

//企业定制出发城市

$("#startCityNameBtn2").click(function () {

    api.setLocalStorage("isCompany", isCompany);

    // window.location.href = "http://mdingzhi.uzai.com/hybrid/departurecitylist.html";

    $(".content1").hide();

    $(".content2").css("right", 0);

    itemclick();

    isCompany = true;


});

//点击 数据存到本地

$(".pminDays").change(function () {

    var pminDays = $(".pminDays").val();

    api.setLocalStorage("pminDays", pminDays);

});


$(".pgoWith").change(function () {

    var pgoWith = $(".pgoWith").val();

    api.setLocalStorage("pgoWith", pgoWith);

});

$(".pminPerson").change(function () {

    var pminPerson = $(".pminPerson").val();

    api.setLocalStorage("pminPerson", pminPerson);

});

$(".pcompanyType").change(function () {

    var pcompanyType = $(".pcompanyType").val();

    api.setLocalStorage("pcompanyType", pcompanyType);

});

$(".pteamType").change(function () {

    var pteamType = $(".pteamType").val();

    api.setLocalStorage("pteamType", pteamType);

});

$(".photelInfo").change(function () {

    var photelInfo = $(".photelInfo").val();

    api.setLocalStorage("photelInfo", photelInfo);

});

$(".pyuSuan").change(function () {

    var pyuSuan = $(".pyuSuan").val();

    api.setLocalStorage("pyuSuan", pyuSuan);

});

$("#locationName1").change(function () {

    var locationName1 = $("#locationName1").val();

    api.setLocalStorage("locationName1", locationName1);

});


//判断初始化还是地址跳转

function isinit() {

    isCompany = api.getLocalStorage("isCompany");

    if (isCompany == "" || isCompany == null) {

        //inits();

        $(".xuanze").show();

        $(".acus").hide();

        $(".pcus").hide();

        $(".pgerenxinxi").hide();

        $(".agerenxinxi").hide();

        $("footer").show();

    } else if (isCompany == "false") {

        $(".xuanze").hide();

        $(".acus").hide();

        $(".pcus").show();

        $(".pgerenxinxi").hide();

        $(".agerenxinxi").hide();

        $("footer").hide();

        //pstor();

    } else if (isCompany == "true") {

        $(".xuanze").hide();

        $(".pcus").hide();

        $(".acus").show();

        $(".pgerenxinxi").hide();

        $(".agerenxinxi").hide();

        $("footer").css("display", "none");

    } else {

        $(".xuanze").show();

        $(".acus").hide();

        $(".pcus").hide();

        $(".pgerenxinxi").hide();

        $(".agerenxinxi").hide();

        $("footer").show();

    }


}


//私人定制通过本地存储赋值

function pstor() {


    var cityName = decodeURI(api.getQueryString('cityName'));

    var cityid = decodeURI(api.getQueryString('cityid'));

    $("#startCityName1").text(cityName);


    var locationName1 = api.getLocalStorage("locationName1");

    $("#locationName1").val(locationName1);


    api.setLocalStorage("locationName1", locationName1);

    var locationName1 = api.getLocalStorage("locationName1");


    var pminDays = api.getLocalStorage("pminDays");

    $(".pminDays").val(pminDays).show();


    var pgoWith = api.getLocalStorage("pgoWith");

    $(".pgoWith").val(pgoWith).show();


}


//header返回按钮

//http://mdingzhi.uzai.com/Product/Detail.html?ProductID=93041

$(".back1").click(function () {

    var productId = api.getLocalStorage("productId");

    pages.removeLocalStorage();

    if (productId == null || productId == "" || productId == "null") {

        //pages.removeLocalStorage();

        window.location.href = "http://mdingzhi.uzai.com";

    } else {

        //pages.removeLocalStorage();

        window.location.href = "http://mdingzhi.uzai.com/product/detail.html?ProductID=" + productId;


    }


});


function andriodGoBack() {

    //要做的返回操作，与左上角的返回相同

    var productId = api.getLocalStorage("productId");

    pages.removeLocalStorage();

    if (productId == null || productId == "" || productId == "null") {

        //pages.removeLocalStorage();
        if (udingzhitype == "1") {
            window.location.href = "http://mhome.uzai.com/membercenter/udingzhi.html";
        }
        else {
            window.location.href = "http://mdingzhi.uzai.com";
        }
    } else if (udingzhitype == "1") {
        window.location.href = "http://mhome.uzai.com/membercenter/udingzhi.html";
    }
    else {

        //pages.removeLocalStorage();

        window.location.href = "http://mdingzhi.uzai.com/product/detail.html?ProductID=" + productId;


    }

}


var pages = {

    removeLocalStorage: function () {

        api.removeLocalStorage('productId');

        api.removeLocalStorage('isCompany');

        api.removeLocalStorage('days');

        api.removeLocalStorage('arrivalCityName');

        api.removeLocalStorage('arrivalCityId');

        api.removeLocalStorage('ProductListURL');

        api.removeLocalStorage('locationName1');

        api.removeLocalStorage('pgoWith');

        api.removeLocalStorage('photelInfo');

        api.removeLocalStorage('pminDays');

        api.removeLocalStorage('pminPerson');

        api.removeLocalStorage('pyuSuan');

        api.removeLocalStorage('productDepartureCityName');

    }

}


function zhezhao() {

    $(".zhezhaoceng").hide();

}


//-------------页面加载

$(function () {

    //获取定位信息

    $(".search-input").on('keyup', function () {

        $(this).querycity();

    });

    $('body').departurelist();

    itemclick();

    setTimeout("zhezhao()", 100);

    //绑定事件

    fns();

    // 获取数据

    getDatas.localStroage();

    //判断初始化还是地址跳转

    //isinit();


    var h = $(window).height();

    $(".zengjia").height(h * 2);

    $(".zengjia2").height(h * 2);

    //刷新一下页面，情况iscompany

    //api.setLocalStorage("isCompany", "");

    if ($("#locationName1").val() == null || $("#locationName1").val() == "" || $("#locationName1").val() == "您想去哪儿") {

        $("#locationName1").val("您想去哪儿");

    }

    //判断UA

    var ua = navigator.userAgent;

    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

        isAndroid = ua.match(/(Android)\s+([\d.]+)/),

        isMobile = isIphone || isAndroid;


    //或者单独判断iphone或android

    if (isAndroid) {

        // 获取texeare 的焦点 屏幕向上提一半

        $("#texGeren").focus(function () {

            $(".zengjia").show();

            myScroll2.scrollTo(0, -$("#wrapper").height() * 0.4);

            myScroll2.refresh();


        });


        $("#texGeren").blur(function () {


            $(".zengjia").hide();

            myScroll2.scrollTo(0, 0);

            myScroll2.refresh();

        });

        $("#texQiye").focus(function () {

            $(".zengjia2").show();

            myScroll2.scrollTo(0, -$("#wrapper").height() * 0.4);

            myScroll2.refresh();

        });


        $("#texQiye").blur(function () {

            $(".zengjia2").hide();

            myScroll2.scrollTo(0, 0);

            myScroll2.refresh();

        });


        $('body').on('touchstart', function (event) {


            var evt = event.srcElement ? event.srcElement : event.target;

            if (evt.id != 'texQiye' && evt.id != 'texGeren') {

                $(".zengjia").hide();

                $(".zengjia2").hide();


                myScroll2.refresh();


                myScroll2.scrollTo(0, 0);

            }

        });

    }


    //给所有select 添加改变样式

    $("select").on('change',

        function () {

            var thisValue = $(this).val();

            if (thisValue != "moren") {

                $(this).addClass("select-change");

            } else {

                $(this).removeClass("select-change");

            }

        });

    $("input[type='text'],input[type='email'],textarea").on('change',

        function () {

            var thisValue = $(this).val();

            if ($.trim(thisValue) != '') {

                $(this).addClass("select-change");

            } else {

                $(this).val('');

                $(this).removeClass("select-change");

            }

        });


});


var getDatas = {

    localStroage: function () {

        var departureCityName = "";

        if (api.getLocalStorage("productDepartureCityName") != " " && api.getLocalStorage("productDepartureCityName") != null && api.getLocalStorage("productDepartureCityName") != "null") {

            departureCityName = decodeURI(api.getLocalStorage("productDepartureCityName"));

        } else {

            departureCityName = decodeURI(api.getLocalStorage("departureCityName"));

        }


        if (departureCityName.indexOf('&') > 0 || departureCityName.indexOf('#') > 0 || departureCityName.indexOf('%') > 0 || departureCityName.indexOf(';') > 0) {

            departureCityName = "";

        } else if (departureCityName.indexOf("省") > 0) {

            departureCityName = departureCityName.replace(/省/g, "");

        } else if (departureCityName.indexOf("市") > 0) {

            departureCityName = departureCityName.replace(/市/g, "");

        }


        var departureCityId = api.getLocalStorage("departureCityId");

        var arrivalCityName;

        var days;

        if (api.getLocalStorage("arrivalCityName") == '' || api.getLocalStorage("arrivalCityName") == null) {

            //console.log('------无到达城市');

        } else {

            //console.log('------有到达城市');

            arrivalCityName = decodeURI(api.getLocalStorage("arrivalCityName"));

            days = api.getLocalStorage("days");

        }

        //设置要提交的出发城市及ID

        submitUrl.cityName = departureCityName;

        submitUrl.cityid = departureCityId;

        //console.log(departureCityName + ' ' + arrivalCityName + ' ' + days);

        setInput.init(departureCityName, arrivalCityName, days);

    }

};

//设置初始数据

var setInput = {

    init: function (departureCity, arrivalCity, days) {

        if (arrivalCity == null || arrivalCity == "" || arrivalCity == "null") {

            $("#locationName1").val("您想去哪儿");

            $("#locationName2").val("您想去哪儿");

        } else {

            $("#locationName1").val(arrivalCity);

            $("#locationName2").val(arrivalCity);

            $("#locationName1,#locationName2").addClass("select-change");

        }

        if (departureCity == null || departureCity == "" || departureCity == "null") {


            $("#startCityName1").text("请选择");

            $("#startCityName2").text("请选择");

            setTimeout(function () {

                //console.log('赋值' + baiduLocation);

                if (baiduLocation != "") {

                    $("#startCityName1").text(baiduLocation);

                    $("#startCityName2").text(baiduLocation);

                }

            }, 1000);


        } else {

            $("#startCityName1").text(departureCity);

            $("#startCityName2").text(departureCity);

        }

        if (days > 0 && days < 6) {

            $(".aminDays").val("3-5天").show();

            $(".pminDays").val("3-5天").show();

            $(".aminDays").addClass("select-change");

            $(".pminDays").addClass("select-change");

        } else if (days > 5 && days < 10) {

            $(".aminDays").val("6-9天").show();

            $(".pminDays").val("6-9天").show();

            $(".aminDays").addClass("select-change");

            $(".pminDays").addClass("select-change");

        } else if (days > 9 && days < 16) {

            $(".aminDays").val("10-15天").show();

            $(".pminDays").val("10-15天").show();

            $(".aminDays").addClass("select-change");

            $(".pminDays").addClass("select-change");

        } else if (days > 15) {

            $(".aminDays").val("16天以上").show();

            $(".pminDays").val("16天以上").show();

            $(".aminDays").addClass("select-change");

            $(".pminDays").addClass("select-change");

        } else {

            $(".aminDays").val("moren").show();

            $(".pminDays").val("moren").show();

            $(".aminDays").removeClass("select-change");

            $(".pminDays").removeClass("select-change");


        }


    }

};


///统一进行订单添加的操作函数

function InsertOrder(param, $scope, $http) {

    param = GetCityID(param);//获取cityid；

    var uid = api.getUserId();

    api.post($http, $scope, api.path.dingzhilogic, 'UzaiDingZhiOrder', 'InsertOrder', param,

        function (obj) {

            post_callback = 'true';

            if (obj.ErrorCode == 200 || obj.ErrorCode == -3) {

                if (obj.ErrorCode == -3) {

                    post_callback = 'false';

                    api.toast('网络连接失败,请重试～');

                    return;

                }

                var tips = JSON.parse(obj.JsonResult).tips;

                if (uid > 0) {

                    tips = "订单提交成功。";

                }

                api.loading();

                api.toast(tips, 3000);

                //pclicknum++;

                pages.removeLocalStorage();

                //window.location.href = "list.html?userid=" + obj.JsonResult;

                setTimeout(function () {

                    window.location.href = "detail.html?orderid=" + JSON.parse(obj.JsonResult).orderid;

                }, 4000);


            } else {

                post_callback = 'false';

                //console.log(obj.ErrorMsg);

                api.toast(obj.ErrorMsg, 3000);

            }

        },

        0, false);

}


// 获取texeare 的焦点 屏幕向上提一半

function loadRefresh() {

    $("#wrapper").height($(window).height() - $("header").eq(0).height() + 5);

    try {

        myScroll2.refresh();

    } catch (e) {

        myScroll2 = new IScroll('#wrapper', {

            probeType: 2,

            click: true

        });

    } finally {


    }

}


function jumpurl() {

    var userid = api.getUserId();

    if (userid == null || typeof (userid) == 'undefined' || userid == '' || userid == '0') {

        api.login(location.href, 'http://mdingzhi.uzai.com/hybrid/order/list.html');

    } else {

        window.location.href = "http://mdingzhi.uzai.com/hybrid/order/list.html";

    }

}


function GetCityID(param) {
    var starting_list = [{

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


    var paramjson = JSON.parse(param);

    for (var i = starting_list.length - 1; i >= 0; i--) {

        if (starting_list[i].txt === paramjson.StartCityName) {

            paramjson.StartCity = starting_list[i].id;

        }

    }

    return JSON.stringify(paramjson);

}

