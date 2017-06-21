/*!
* 李云 2016-02-29 搜索Jd
* Copyright 2016,http://www.uzai.com/ JoJo
* History
* Author        Date        Descript
* 2016-06-08    JoJo     增加一个订单渠道源ID的传递
*/
var intReg = /^[0-9]|[1-9][0-9]*$/; //正整数
var floatReg = /^[0-9]+(.[0-9]{1,3})?$/;   //正浮点数

//当前所定义的类别与ProductTools下同步相等
//{1,"跟团游"},{2,"当地参团"},{3,"自由行"},{4,"酒店套餐"},{5,"公司游"},{8,"门票/单项服务"},{9,"私家团"},{10,"门票+酒店"},{11,"机票套餐"}
var ProductClass = new Array("1", "2", "3", "4", "5", "8", "9", "10", "11");
//{ 6, "邮轮" }
var CruisesClass = new Array("6");
//{ 7, "签证" }
var VisaProductClass = new Array("7");

try {
    document.domain = 'uzai.com';
} catch (e) {

}

$(function () {
    //图片延迟加载
    uzLazy(['j_mainRoute']);

    //更多筛选条件（收起/展开）
    SearchFold();

    //产品线路日历的显示
    ShowProCalendar();

    //您已选择的关闭事件
    new ShowRouteUI().CloseCheckedTab();

    //添加注意事项
    AddElement();

    //猜你喜欢
    searchGuessLike();


    _uzw.ui.tab('other-city-tab');
    ziyouban();

    $('#ulliTour').on('click', '.list-item', function() {
        var oThis = $(this);
        productInterest(oThis.attr('data-pid'));
    });
});

//判断是否满足当前类别
function ValidateProductType(array, productTypeEnCode) {
    if (!array) return false;
    var isType = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == productTypeEnCode || parseInt(array[i], 10) == productTypeEnCode) {
            isType = true;
            break;
        }
    }
    return isType;
}

//左侧点击关键词搜索
function SearchNew(keyword) {
    var webStr = "http://search.uzai.com";
    if (!$.trim(keyword)) {
        keyword = $.trim($("#hdDataReq").attr("data-keyword"));
    }
    var hostCity = $.trim($("#hdDataReq").attr("data-hostcity"));
    if (!hostCity) {
        hostCity = "sh";
    }
    window.location.href = webStr + "/" + hostCity + "/SearchResult?keyword=" + encodeURI($.trim(keyword));
}

//点击条件筛选性搜索
function SetParam(o, type) {
    var $th = $(o);
    if (type == 1) {
        SetMenu(o);
        SearchParam();
    }
    if (type == 3) {
        //当前点击的出发日期可选项，清除自己输入日期值
        $("#txtdate1,#txtdate2").val("");
        $("#tipError_date,#tipError_date_cruise").addClass("hide");
    }
    if (type == 301) {
        //当前点击的出发日期可选项，清除自己输入日期值
        $("#txtdate1_cruise,#txtdate2_cruise").val("");
        $("#tipError_date,#tipError_date_cruise").addClass("hide");
    }
    if (type == 3011) {
        var tt = ($.trim($(o).attr("data-tab")) == "cruise") ? "_cruise" : "";
        if (!$("#txtdate1" + tt).val() && !$("#txtdate2" + tt).val()) {
            $("#tipError_date" + tt).removeClass("hide"); return false;
        }
        else {
            $("#tipError_date" + tt).addClass("hide");
        }
        $th.siblings("a").removeClass("on"); //将同级a样式清除
        $th.parents("dd").find("a").eq(0).addClass("on");
    }

    var $thTxt = $.trim($th.text());
    if ($thTxt != "确定" && $thTxt != "清除") {
        //####设定选中样式
        $th.siblings("a").removeClass("on"); //将同级a样式清除
        $th.addClass("on"); //给定自己为选中状态
    }
    if ($thTxt == "清除") {
        $th.siblings("a").removeClass("on"); //将同级a样式清除
        $th.parents("dd").find("input[type=text]").val(""); //清除文本框信息
        $th.siblings("a").first().addClass("on"); //选中全部
    }

    //初始为新搜索
    $("#hdDataReq").attr("data-PageIndex", 1);

    //对线路数据条进行查询HTML显示
    SearchRoute();
    return;
}

//排序
function SortRoute(o, type) {
    var $th = $(o);
    var sortVal = "";
    var pp;

    //####设定选中样式
    $th.parents("li").siblings("li").removeClass("on");
    $th.parents("li").addClass('on');

    if (type == 9 || $.trim($th.attr("id")) == "txaSatisfy") {
        //当前点击的是满意度排序样式
        sortVal = $th.find(".sort-down").length >= 1 ? 0 : 1;
        pp = $th.find(".icon-sort");
        if (sortVal === 0) {
            pp.removeClass("sort-down").addClass("sort-up"); //asc 由低到高
        } else {
            pp.removeClass("sort-up").addClass("sort-down"); //desc 由高到低
        }
    }
    if (type == 3 || $th.hasClass("sort-item")) {
        //当前点击的是价格排序样式
        sortVal = $.trim($th.attr("data-sort")); //排序方向
        if (sortVal !== "auto") {
            pp = $th.parents(".price-bar").find(".icon-sort");
            if (sortVal === '0') {
                //价格由低到高 sort-up
                pp.removeClass("sort-down").addClass("sort-up");
            } else {
                //价格由高到低 sort-down
                pp.removeClass("sort-up").addClass("sort-down");
            }
        }
    }
    //#### end 设定选中样式

    //排序字段——$th.attr("data-col"),type 值与Pages.OrderByColName统一
    $("#hdDataReq").attr("data-DirectionColumnName", type);

    //排序类别
    if ($.trim($th.attr("data-sort")) != "auto") {
        var sort = (!$.trim($th.attr("data-sort")) ? 1 : $.trim($th.attr("data-sort")));
        $("#hdDataReq").attr("data-Direction", sort);
    }

    $("#hdDataReq").attr("data-minPrice", $("#txtMinPrice").val()); //起价
    $("#hdDataReq").attr("data-maxPrice", $("#txtMaxPrice").val()); //最高承受价

    //初始为新搜索
    $("#hdDataReq").attr("data-PageIndex", 1);

    //对线路数据条进行查询HTML显示
    SearchRoute();
    return;
}

//*********菜单切换（UzaiTravelClass）************
function SetMenu(o) {
    var $th = $(o);
    var productTypeEncode = $th.attr("data-producttypetag"); //产品类别代号
    if (!productTypeEncode) {
        productTypeEncode = $.trim($("#tabMenu .on").attr("data-producttypetag"));
    }
    if (!intReg.test(productTypeEncode)) productTypeEncode = 0;

    //给定面板选中样式
    $("#tabMenu li").removeClass("on");
    $th.addClass("on");

    var isCruise = ValidateProductType(CruisesClass, productTypeEncode), //j_CruiseItems 当前为邮轮
    isVisa = ValidateProductType(VisaProductClass, productTypeEncode), //j_VisaItems 当前为签证
    isTour = true; //j_TourItems 当前为跟团，自由行，私家

    //当前为跟团，自由行，私家param
    var $j_choiceItems = $("#j_TourItems");
    //邮轮param
    var $j_CruiseItems = $("#j_CruiseItems");
    //签证param
    var $j_VisaItems = $("#j_VisaItems");

    if (!isCruise && !isVisa) {
        //隐藏邮轮或签证的param
        $j_CruiseItems.hide();
        $j_VisaItems.hide();

        $j_choiceItems.show();

        $j_choiceItems.removeAttr("style").removeClass("hide");

        if (productTypeEncode == 2 || productTypeEncode == 4 || productTypeEncode == 8 || productTypeEncode == 9 || productTypeEncode == 10) {
            //2当地游，4酒店套餐，8门票，9私家团，10门票+酒店
            //当下类别没有【出发城市】选择项，进行隐藏
            $j_choiceItems.find("dl:first").hide();
        } else {
            $j_choiceItems.find("dl:first").show();
        }
    } else {
        //表示当前类别不是正常产品，可能是邮轮或签证

        $j_choiceItems.hide();

        if (isCruise) {
            //当前为签证menu
            $j_CruiseItems.show();
            $j_VisaItems.hide();
        }
        else if (isVisa) {
            //当前为签证menu
            $j_VisaItems.show();
            $j_CruiseItems.hide();
        }
    }

    //产品二级类别代号
    $("#hdDataReq").attr("data-productType", productTypeEncode);
}

//对control数据查询
function SearchParam() {
    var objectReq = $("#hdDataReq");
    var param = {};
    param.keyword = $.trim(objectReq.attr("data-keyword")); //关键词
    param.productType = $.trim(objectReq.attr("data-productType")); //产品二级类别标识代号
    param.subType = $.trim(objectReq.attr("data-subType")); //分类主题
    //如果是境外参团的取这个值
    //因为data-checkedCity 有可能为0
    if(param.productType=="12"){
       param.city = $.trim(objectReq.attr("data-hostcitycode")); //当前首次搜索默认进来的城市
    }else{
       param.city = $.trim(objectReq.attr("data-checkedCity")); //当前首次搜索默认进来的城市
    }

    $.ajax({
        type: "post",
        url: "/SearchMenuTab",
        data: param,
        cache: false,
        async: false, //是否异步
        dataType: "json",
        success: function (json) {
            if (json) {
                var je = parseInt(json.exists, 10);
                if (je === 0) {
                    return; //表示当前没有查询到任何数据
                }
                new ShowParamUI().show(json, param.productType);
            }
        }
    });
}

//param 显示呈现html【画框】
function ShowParamUI() {
    var productTypeEncode;
    var isCruise = false, //j_CruiseItems 当前为邮轮
        isVisa = false, //j_VisaItems 当前为签证
        isTour = true; //j_TourItems 当前为跟团，自由行，私家

    this.show = function (json, productType) {

        productTypeEncode = productType;
        isCruise = ValidateProductType(CruisesClass, productTypeEncode); //j_CruiseItems 当前为邮轮
        isVisa = ValidateProductType(VisaProductClass, productTypeEncode); //j_VisaItems 当前为签证
        isTour = !isCruise && !isVisa; //j_TourItems 当前为跟团，自由行，私家

        $("#j_TourItems,#j_CruiseItems,#j_VisaItems").css("display", "none").addClass("hide");

        if (isVisa) {
            //当前点击的为签证，以下是对visa的param显示
            this.showVisaAreaHTML(json.VisaAreaObject);
            this.showVisaCountryHTML(json.VisaCountryObject);
            this.showVisaReceiveZoneHTML(json.VisaReceiveZoneObject);
            this.showVisaTypeHTML(json.VisaTypeObject);

            $("#j_TourItems,#j_CruiseItems").css("display", "none").addClass("hide");
            $("#j_VisaItems").removeAttr("style").removeClass("hide");
            return;
        }
        if (isCruise) {
            //当前点击的为邮轮，以下是对cruise的param显示
            this.showStartCityHTML(json.StartCityObject);
            this.showCruisesRouteHTML(json.CruisesRouteObject);
            this.showCruisesCompanyHTML(json.CruisesCompanyObject);
            this.showGodateHTML(json.GoDateObject);

            this.showJourneyDayHTML(json.JourneyDayObject);
            this.showCruisePortHTML(json.CruisesPortObject);

            $("#choiceCruisePort,#choiceCruiseJourneyDay").parents("dl").addClass("hide");
            $("#j_TourItems,#j_VisaItems").css("display", "none").addClass("hide");
            $("#j_CruiseItems").removeAttr("style").removeClass("hide");
            return;
        }

        //跟团、自由行、私家  param html
        this.showStartCityHTML(json.StartCityObject);
        this.showGodateHTML(json.GoDateObject);
        this.showProductGradeHTML(json.ProductGradeObject);
        this.showJourneyDayHTML(json.JourneyDayObject);

        this.showSubTypHTML(json.SubTypeObject);
        this.showPastAddressHTML(json.PastAddressObject);
        this.showZYBCityHTML(json,productType);

        $("#choiceSubType,#choicePastAddress,#choiceSuitman").parents("dl").addClass("hide");
        $("#j_CruiseItems,#j_VisaItems").css("display", "none").addClass("hide");
        $("#j_TourItems").removeAttr("style").removeClass("hide");
        return;
    };

    //-------------出发城市【签证没有出发城市】
    this.showStartCityHTML = function (json) {
        if (isVisa) return;

        var objectReq = $("#hdDataReq");
        var checkCity = false;

        var $control = isCruise ? $("#choiceCruiseCity") : $("#choiceCity");
        $control.empty();
        if (json) {

            var currentCity = $.trim(objectReq.attr("data-checkedCity"));

            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                if (item.CityId == currentCity) {
                    $(a).addClass("on"); checkCity = true;
                }
                if (isCruise) {
                    $(a).attr("data-tip", "201");
                    $(a).attr("data-tab", "cruise");
                    $(a).attr("onclick", "SetParam(this,201)");
                    $(a).text(item.CityName + "出发"); //兼容FF
                } else {
                    $(a).attr("data-tip", "2");
                    $(a).attr("data-tab", "tour");
                    $(a).attr("onclick", "SetParam(this,2)");
                    $(a).text(item.CityName); //兼容FF
                }
                $(a).attr("data-val", item.CityId);
                $control.append(a);
            });
        }
        var a = document.createElement("a");
        a.className = 'pointer';
        if (!checkCity) {
            $(a).addClass("on");
        }
        $(a).text("全部"); //兼容FF
        if (isCruise) {
            //当前点击的为邮轮
            $(a).attr("id", "txaCruiseCityAll");
            $(a).attr("data-tip", "201");
            $(a).attr("data-tab", "cruise");
            $(a).attr("onclick", "SetParam(this,201)");
        } else {
            //跟团、自由行、私家
            $(a).attr("id", "txaCityAll");
            $(a).attr("data-tip", "2");
            $(a).attr("data-tab", "tour");
            $(a).attr("onclick", "SetParam(this,2)");
        }
        $control.prepend(a);
        return;
    };

    //-------------出发日期【签证没有出发城市】
    this.showGodateHTML = function (json) {
        if (isVisa) return;

        var $control = isCruise ? $("#choiceCruiseGodate") : $("#choiceGodate");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                if (isCruise) {
                    $(a).attr("data-tip", "301");
                    $(a).attr("data-tab", "cruise");
                    $(a).attr("onclick", "SetParam(this,301)");
                    $(a).text(item.MonthTxt + "出发"); //兼容FF
                } else {
                    $(a).attr("data-tip", "3");
                    $(a).attr("data-tab", "tour");
                    $(a).attr("onclick", "SetParam(this,3)");
                    $(a).text(item.MonthTxt); //兼容FF
                }
                $(a).attr("data-val", item.MonthVal);
                $control.append(a);
            });
        }
        var a = document.createElement("a");
        a.className = 'pointer';
        $(a).addClass("on");
        $(a).text("全部"); //兼容FF
        var sb = [];
        sb.push("<input type=\"text\" onclick=\"begdate('txtdate1{tag}','txtdate2{tag}');\" id=\"txtdate1{tag}\" class=\"num-box tc vm\" readonly=\"readonly\" /><span class=\"pl10 pr10\">至</span>");
        sb.push("<input type=\"text\" onclick=\"enddate('txtdate1{tag}','txtdate2{tag}');\" id=\"txtdate2{tag}\" class=\"num-box tc vm\" readonly=\"readonly\" />");
        sb.push("<a href=\"javascript:;\" data-tip=\"3011\" data-tab=\"{tag2}\" onclick=\"SetParam(this,3011);\" class=\"confirm tc vm J_searchDateBtn\">确定</a>");
        sb.push("<a href=\"javascript:;\" data-tip=\"3012\" data-tab=\"{tag2}\" onclick=\"SetParam(this,3012);\" class=\"cancel tc vm\">清除</a>");
        sb.push("<span style=\"color: Red;\" class=\"hide f12\" id=\"tipError_date{tag}\">请选择出发时间</span>");

        var sbNode, sbNode2, sbNode3;

        if (isCruise) {
            //当前点击的为邮轮
            $(a).attr("id", "txaCruiseGodateAll");
            $(a).attr("data-tip", "301");
            $(a).attr("data-tab", "cruise");
            $(a).attr("onclick", "SetParam(this,301)");

            //可选择日期
            sbNode = sb.join('');
            sbNode2 = _util.string.replaceAll(sbNode, '{tag}', '_cruise');
            sbNode3 = _util.string.replaceAll(sbNode2, '{tag2}', 'cruise');
            $control.append(sbNode3);
        } else {
            //跟团、自由行、私家
            $(a).attr("id", "txaGodateAll");
            $(a).attr("data-tip", "3");
            $(a).attr("data-tab", "tour");
            $(a).attr("onclick", "SetParam(this,3)");

            //可选择日期
            sbNode = sb.join('');
            sbNode2 = _util.string.replaceAll(sbNode, '{tag}', '');
            sbNode3 = _util.string.replaceAll(sbNode2, '{tag2}', 'tour');
            $control.append(sbNode3);
        }
        $control.prepend(a);
        return;
    };

    //-------------产品等级【只有跟团的才有，签证邮轮没有】
    this.showProductGradeHTML = function (json) {
        if (isCruise || isVisa) return;

        var $control = $("#choiceProGrade");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "8");
                $(a).attr("data-tab", "tour");
                $(a).attr("title", item.GradeDesc);
                $(a).attr("onclick", "SetParam(this,8)");
                $(a).text(item.GradeName); //兼容FF
                $(a).attr("data-val", item.Grade);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a class=\"on\" href=\"javascript:;\" data-tip=\"8\" onclick=\"SetParam(this,8);\" id=\"txaProductGrade\">全部</a>");
        //描述
        $control.append("<a href=\"http://www.uzai.com/Activity/Diamonds\" target=\"_blank\" class=\"blue u\">钻级说明</a>");
        return;
    };

    //-------------行程天数【签证没有】
    this.showJourneyDayHTML = function (json) {
        if (isVisa) return;

        var $control = isCruise ? $("#choiceCruiseJourneyDay") : $("#choiceJourneyDay");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                if (isCruise) {
                    $(a).attr("data-tip", "401");
                    $(a).attr("data-tab", "cruise");
                    $(a).attr("onclick", "SetParam(this,401)");
                    $(a).text(item.Day + "天"); //兼容FF
                } else {
                    $(a).attr("data-tip", "4");
                    $(a).attr("data-tab", "tour");
                    $(a).attr("onclick", "SetParam(this,4)");
                    $(a).text(item.Day + "天"); //兼容FF
                }
                $(a).attr("data-val", item.Day);
                $control.append(a);
            });
        }
        var a = document.createElement("a");
        a.className = 'pointer';
        $(a).addClass("on");
        $(a).text("全部"); //兼容FF
        if (isCruise) {
            //当前点击的为邮轮
            $(a).attr("id", "txaCruiseDayAll");
            $(a).attr("data-tip", "401");
            $(a).attr("data-tab", "cruise");
            $(a).attr("onclick", "SetParam(this,401)");
        } else {
            //跟团、自由行、私家
            $(a).attr("id", "txaDayAll");
            $(a).attr("data-tip", "4");
            $(a).attr("data-tab", "tour");
            $(a).attr("onclick", "SetParam(this,4)");
        }
        $control.prepend(a);
        return;
    };

    //-------------分类主题【只有跟团的才有，签证邮轮没有】
    this.showSubTypHTML = function (json) {
        if (isCruise || isVisa) return;

        var div = document.createElement("div");
        $(div).attr("class", "theme-items");
        $(div).attr("id", "choiceSubTypeNav");

        var $control = $("#choiceSubType");
        $control.empty();

        if (json) {
            if (json.length > 12) {
                $control.append("<div class=\"fr\"><a href=\"javascript:;\" class=\"switch fr\"><em>展开</em><span class=\"arrow-box pl5 vm\"><i class=\"arrow-bottom\">&nbsp;</i></span></a></div>");
            }
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "5");
                $(a).attr("data-tab", "tour");
                $(a).attr("onclick", "SetParam(this,5)");
                $(a).text(item.Des); //兼容FF
                if (index + 1 >= 12) {
                    $(a).attr("class", "hide");
                }
                $(a).attr("data-val", item.Des);
                $(div).append(a);
            });
        }
        //全部
        $(div).prepend("<a id=\"txtSubTypeAll\" href=\"javascript:;\" class=\"on\" data-tip=\"5\" onclick=\"SetParam(this,5);\">全部</a>");

        $control.append(div);
        return;
    };

    //-------------途经景点【只有跟团的才有，签证邮轮没有】
    this.showPastAddressHTML = function (json) {
        if (isCruise || isVisa) return;

        var div = document.createElement("div");
        $(div).attr("class", "theme-items");
        $(div).attr("id", "choicePastAddressNav");

        var $control = $("#choicePastAddress");
        $control.empty();

        if (json) {
            if (json.length > 12) {
                $control.append("<div class=\"fr\"><a href=\"javascript:;\" class=\"switch fr\"><em>展开</em><span class=\"arrow-box pl5 vm\"><i class=\"arrow-bottom\">&nbsp;</i></span></a></div>");
            }
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "6");
                $(a).attr("data-tab", "tour");
                $(a).attr("onclick", "SetParam(this,6)");
                $(a).text(item.Des); //兼容FF
                if (index + 1 >= 12) {
                    $(a).attr("class", "hide");
                }
                $(a).attr("data-val", item.Des);
                $(div).append(a);
            });
        }
        //全部
        $(div).prepend("<a id=\"txtPastAddressAll\" href=\"javascript:;\" class=\"on\" data-tip=\"6\" data-tab=\"tour\" onclick=\"SetParam(this,6);\">全部</a>");

        $control.append(div);
        return;
    };

    //-------------航线目的地【邮轮专有】
    this.showCruisesRouteHTML = function (json) {
        if (!isCruise) return;

        var $control = $("#choiceCruiseRoute");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "9");
                $(a).attr("data-tab", "cruise");
                $(a).attr("onclick", "SetParam(this,9)");
                $(a).text((item.Des.Length > 20 ? item.Des.substring(0, 20) + "..." : item.Des)); //兼容FF
                $(a).attr("data-val", item.Des);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaCruisesRouteAll\" data-tip=\"9\" data-tab=\"cruise\" onclick=\"SetParam(this,9);\">全部</a>");
        return;
    };

    //-------------邮轮公司【邮轮专有】
    this.showCruisesCompanyHTML = function (json) {
        if (!isCruise) return;

        var $control = $("#choiceCruiseCompany");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "10");
                $(a).attr("data-tab", "cruise");
                $(a).attr("onclick", "SetParam(this,10)");
                $(a).text((item.Des.Length > 20 ? item.Des.substring(0, 20) + "..." : item.Des)); //兼容FF
                $(a).attr("data-val", item.Des);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaCruisesCompAll\" data-tip=\"10\" data-tab=\"cruise\" onclick=\"SetParam(this,10);\">全部</a>");
        return;
    };

    //-------------出发港口【邮轮专有】
    this.showCruisePortHTML = function (json) {
        if (!isCruise) return;

        var $control = $("#choiceCruisePort");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "11");
                $(a).attr("data-tab", "cruise");
                $(a).attr("onclick", "SetParam(this,11)");
                $(a).text((item.Des.Length > 20 ? item.Des.substring(0, 20) + "..." : item.Des)); //兼容FF
                $(a).attr("data-val", item.Des);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaCruisesPortAll\" data-tip=\"11\" data-tab=\"cruise\" onclick=\"SetParam(this,11);\">全部</a>");
        return;
    };

    //-------------地区【签证专有】
    this.showVisaAreaHTML = function (json) {
        if (!isVisa) return;

        var $control = $("#choiceVisaArea");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "13");
                $(a).attr("data-tab", "visa");
                $(a).attr("data-id", item.Id);
                $(a).attr("onclick", "SetParam(this,13)");
                $(a).text(item.Des); //兼容FF
                $(a).attr("data-val", item.Des);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaVisaAreaAll\" data-tip=\"13\" data-tab=\"visa\" onclick=\"SetParam(this,13);\">全部</a>");
        return;
    };

    //-------------国家【签证专有】
    this.showVisaCountryHTML = function (json) {
        if (!isVisa) return;

        var $control = $("#choiceVisaCountry");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "14");
                $(a).attr("data-tab", "visa");
                $(a).attr("data-id", item.CountryId);
                $(a).attr("onclick", "SetParam(this,14)");
                $(a).text(item.CountryName); //兼容FF
                $(a).attr("data-val", item.CountryName);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaVisaCountryAll\" data-tip=\"14\" data-tab=\"visa\" onclick=\"SetParam(this,14);\">全部</a>");
        return;
    };

    //-------------所属领区【签证专有】
    this.showVisaReceiveZoneHTML = function (json) {
        if (!isVisa) return;

        var $control = $("#choiceVisaReceiveZone");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "15");
                $(a).attr("data-tab", "visa");
                $(a).attr("onclick", "SetParam(this,15)");
                $(a).text(item.Des); //兼容FF
                $(a).attr("data-val", item.Des);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaVisaZoneAll\" data-tip=\"15\" data-tab=\"visa\" onclick=\"SetParam(this,15);\">全部</a>");
        return;
    };

    //-------------签证类型【签证专有】
    this.showVisaTypeHTML = function (json) {
        if (!isVisa) return;

        var $control = $("#choiceVisaType");
        $control.empty();
        if (json) {
            $.each(json, function (index, item) {
                var a = document.createElement("a");
                a.className = 'pointer';
                $(a).attr("data-tip", "16");
                $(a).attr("data-tab", "visa");
                $(a).attr("data-id", item.Id);
                $(a).attr("onclick", "SetParam(this,16)");
                $(a).text(item.Des); //兼容FF
                $(a).attr("data-val", item.Des);
                $control.append(a);
            });
        }
        //全部
        $control.prepend("<a href=\"javascript:;\" class=\"on\" id=\"txaVisaTypeAll\" data-tip=\"16\" data-tab=\"visa\" onclick=\"SetParam(this,16);\">全部</a>");
        return;
    };


    //显示自由伴(境外参团 的城市
    this.showZYBCityHTML = function(json,productType){
        if(productType.toString()=="12"){

                var _zybCityBase =  json["ZYBCityBase"];
                var _zybCityBaseQuick = json["ZYBCityBaseQuick"];
                //清空视图
                $("#j_zybCityTitle,#j_zybCityContent").html('');
                $.each($("#j_zybCity a[data-view]"),function(i,n){
                    $(n).remove();
                });
                $("#j_zybCity [data-last]").text('').css("display","");
                $("#j_zybCity #txaCityAll").removeClass("on");

                //渲染视图
                //先隐藏之前其他类型的出发城市的行
                //$("#choiceCity").css("display","none").addClass("hide")
                //出发城市 展开
                $("#choiceCityZYB .switch-box em").text("展开");
                $("#choiceCityZYB .switch-box i").attr("class","arrow-bottom");
                //显示自由伴 的行
                $("#choiceCityZYB").css("display","block").removeClass("hide");
                //快捷导航
                $.each((json["ZYBCityBaseQuick"]["DepartureCityList"]||[]),function(i,n){

                    $("#j_zybCity a[data-last]").before($("<a>",{
                        href:"javascript:;",
                        "data-tab":"tour",
                        onclick:"SetParam(this,2)",
                        "class":("hot-list "),
                        text:n["LocationNameReadOnly"],
                        "data-view":""
                    }));
                });
                //选中
                //判断当前列表是否有当前城市
                var startCityName = json["StartCityName"];
                var startCityNameIndex  = 0 ;
                $.each((json["ZYBCityBaseQuick"]["DepartureCityList"]||[]),function(i,n){
                       if(n["LocationNameReadOnly"]==startCityName){
                              startCityNameIndex=  i+1;
                       }
                });

               // $("#j_zybCity a:eq("+(json["ZYBCityBaseQuick"]["DepartureCityList"]||[]).length+")").addClass("on");
                $("#j_zybCity a:eq("+startCityNameIndex+")").addClass("on");

                $.each((_zybCityBase||[]),function(i,citybase){
                      $("#j_zybCityTitle").append($("<li>",{
                            "class":((i===0?"on ":"")+ "fl"),
                            text:citybase["title"]
                      }));
                      var tar =  $("<div>",{
                          "class":("item"+" item"+(i+1) + " "+ (i!==0?"hide":""))
                      });
                      $("#j_zybCityContent").append(tar);
                      $.each((citybase["DepartureCityList"]||[]),function(i,n){
                            tar.append($("<a>",{
                                href:"javascript:;",
                                text:n["LocationNameReadOnly"]
                            }));
                      });
                });

                $("#j_jpbox a.on").removeClass("on");
                  $("#j_jpbox a:eq(0)").addClass("on");

        }else{
            $("#choiceCityZYB").css("display","none").addClass("hide");
        }
    };
}





//对j_mainRoute(ulliTour,ulliVisa)数据查询显示
function SearchRoute() {

    var objectReq = $("#hdDataReq");

    var param = {};
    param.domain = $.trim(objectReq.attr("data-hostcity")); //城市编号
    param.keyword = $.trim(objectReq.attr("data-keyword")); //关键词
    param.productType = $.trim(objectReq.attr("data-productType")); //产品二级类别标识代号

    param.CurrentPageIndex = $.trim($("#hdDataReq").attr("data-PageIndex")); //当前索引页
    param.DirectionColumnName = $.trim(objectReq.attr("data-DirectionColumnName")); //排序类型
    param.Direction = $.trim(objectReq.attr("data-Direction")); //排序方向
    param.minPrice = $.trim($("#txtMinPrice").val()); //起价
    param.maxPrice = $.trim($("#txtMaxPrice").val()); //最高承受价

    param.Promotion = $("#chkischeap").is(":checked") ? 1 : 0; //优惠信息
    param.UZXU = $("#chkisspike").is(":checked") ? 1 : 0; //优中选优
    param.HalfTravel = $("#chkbzz").is(":checked") ? 1 : 0; //半自助

    if (parseInt(param.minPrice, 10) === 0 && parseInt(param.maxPrice, 10) === 0) {
        $("#txtMaxPrice,#txtMinPrice").val(""); //最高承受价不能为0
    }
    else if (parseInt(param.minPrice, 10) === 0 || parseInt(param.maxPrice, 10) === 0) {
        if (parseInt(param.minPrice, 10) === 0) {
            $("#txtMinPrice").val("0"); //多个0时做处理
        }
        if (parseInt(param.maxPrice, 10) === 0) {
            $("#txtMaxPrice").val(""); //最高承受价不能为0
        }
    }

    var $j_TourItems = $("#j_TourItems"); //跟团，自由行，私家 param
    var $j_CruiseItems = $("#j_CruiseItems"); //邮轮 param
    var $j_VisaItems = $("#j_VisaItems"); //签证 param
    var zybtxt = $('#j_zybCity').find('a.on').text().trim(); //自由伴

    if ($j_TourItems.get(0) && $j_TourItems.is(":visible")) {

        //当前选中的为跟团，自由行，私家
        param.city = $.trim($("#choiceCity a.on").attr("data-val")); //出发城市
        param.date = $.trim($("#choiceGodate a.on").attr("data-val")); //出发日期
        param.beginDate = $.trim($("#txtdate1").val()); //为手选日期
        param.endDate = $.trim($("#txtdate2").val()); //为手选日期
        param.productGrade = $.trim($("#choiceProGrade a.on").attr("data-val")); //产品等级
        param.journeyDay = $.trim($("#choiceJourneyDay a.on").attr("data-val")); //行程天数
        param.subType = $.trim($("#choiceSubTypeNav a.on").attr("data-val")); //分类主题
        param.pastAddress = $.trim($("#choicePastAddressNav a.on").attr("data-val")); //途经景点
        param.suitman = $.trim($("#choiceSuitman a.on").attr("data-val")); //适合人群
        param.jpbox = $.trim($("#j_jpbox a.on").attr("data-val")); //自由伴国际机票
        param.zybcity = (zybtxt=="全部"?"":zybtxt); //自由伴触发城市

    } else if ($j_CruiseItems.get(0) && $j_CruiseItems.is(":visible")) {

        //当前选中的为邮轮
        param.city = $.trim($("#choiceCruiseCity a.on").attr("data-val")); //出发城市
        param.cruiseRoute = $.trim($("#choiceCruiseRoute a.on").attr("data-val")); //航线目的地
        param.cruiseCompany = $.trim($("#choiceCruiseCompany a.on").attr("data-val")); //邮轮公司
        param.date = $.trim($("#choiceCruiseGodate a.on").attr("data-val")); //出发日期
        param.beginDate = $.trim($("#txtdate1_cruise").val()); //为手选日期
        param.endDate = $.trim($("#txtdate2_cruise").val()); //为手选日期
        param.cruisePort = $.trim($("#choiceCruisePort a.on").attr("data-val")); //出发港口
        param.journeyDay = $.trim($("#choiceCruiseJourneyDay a.on").attr("data-val")); //行程天数

    } else if ($j_VisaItems.get(0) && $j_VisaItems.is(":visible")) {

        //当前选中的为签证
        param.visaArea = $.trim($("#choiceVisaArea a.on").attr("data-val")); //地区
        param.visaCountry = $.trim($("#choiceVisaCountry a.on").attr("data-val")); //国家
        param.visaReceiveZone = $.trim($("#choiceVisaReceiveZone a.on").attr("data-val")); //所属领区
        param.visaType = $.trim($("#choiceVisaType a.on").attr("data-id")); //签证类型
    }

    //筛选无结果
    $(".res-nocontent").hide();
    //正在查询...
    $('#dvwait').show();
    //清空列表线路的显示
    $("#ulliTour,#ulliVisa").empty();

    //请求control
    $.ajax({
        type: "post",
        url: "/SearchRoute",
        data: param,
        cache: false,
        async: false, //是否异步
        dataType: "json",
        success: function (json) {
            //json:PageObject,RouteObject
            new ShowRouteUI().show(json, param.productType);
        }
    });

    //正在查询...
    $('#dvwait').hide();
    //筛选无结果
    if ($("#ulliTour:visible,#ulliVisa:visible").find("li").length === 0) {
        $(".res-nocontent").show();
    }
    //图片延迟加载
    uzLazy(['j_mainRoute']);
}
//显示线路HTML【画框】
function ShowRouteUI() {

    var productTypeEncode;
    var isCruise = false, //j_CruiseItems 当前为邮轮
         isVisa = false, //j_VisaItems 当前为签证
         isTour = true; //j_TourItems 当前为跟团，自由行，私家

    this.show = function (json, productType) {
        //PageObject,RouteObject
        productTypeEncode = productType;
        isCruise = ValidateProductType(CruisesClass, productTypeEncode); //j_CruiseItems 当前为邮轮
        isVisa = ValidateProductType(VisaProductClass, productTypeEncode); //j_VisaItems 当前为签证
        isTour = !isCruise && !isVisa; //j_TourItems 当前为跟团，自由行，私家

        if (isVisa) {
            //当前点击的为签证，以下是对visa的param显示
            this.ShowVisaRouteHTML(json.RouteObject);
            $("#ulliTour").css("display", "none").addClass("hide");
            $("#ulliVisa").removeAttr("style").removeClass("hide");
            //排序不显示
            $("#divsortlist").css("display", "none").addClass("hide");
        }
        else if (isCruise) {
            //当前点击的为邮轮，以下是对cruise的param显示
            this.ShowTourOrCruiseRouteHTML(json.RouteObject);
            $("#ulliVisa").css("display", "none").addClass("hide");
            $("#ulliTour").removeAttr("style").removeClass("hide");
            //显示排序
            $("#divsortlist").removeAttr("style").removeClass("hide");
        }
        else {
            //跟团、自由行、私家  param html
            this.ShowTourOrCruiseRouteHTML(json.RouteObject);
            $("#ulliVisa").css("display", "none").addClass("hide");
            $("#ulliTour").removeAttr("style").removeClass("hide");
            //显示排序
            $("#divsortlist").removeAttr("style").removeClass("hide");
        }

        //添加注意事项
        AddElement();

        //头panel完成后显示【您已选择】项信息
        this.ShowTabChecked();
        //分页HTML
        this.showPageHTML(json.PageObject);
        return;
    };

    //-------------签证产品列表的显示
    this.ShowVisaRouteHTML = function (json) {
        if (!isVisa) return;

        //清除隐藏跟团、自由行、私家、邮轮线路的显示
        $("#ulliTour").empty().addClass("hide");

        var $control = $("#ulliVisa");
        $control.empty();
        if (!json) return;

        $.each(json, function (index, item) {
            $control.append(
                "<li data-pid='" + (item.ProductId) + "' data-price='" + (parseInt(item.MinPrice, 10).toFixed(0)) + "' class='list-item clearfix'>"
                    + "<div class='sort-line-sidebar tc fr'>"
                        + "<p class='price-mod red'><i class='price'>￥<em class='f20'>" + (parseInt(item.MinPrice, 10).toFixed(0)) + "</em></i>起</p>"
                    + "</div>"
                    + "<div class='sort-line-main clearfix'>"
                        + "<div class='sort-line-pic fl'>"
                            + "<a target='_blank' href='" + (item.ProductURL) + "' title='" + (item.ProductNameLight) + "'>"
                                + "<img alt='' data-original='" + (item.ProductVisa.ProductPic) + "' "
                                    + "src='//r01.uzaicdn.com/content/m/images/common/gray.gif' style='display: inline;' /></a>"
                        + "</div>"
                        + "<dl class='sort-line-cont f999 fl'>"
                            + "<dt class='f14'><a target='_blank' href='" + (item.ProductURL) + "'>" + (item.ProductNameLight) + "</a></dt>"
                            + "<dd class='f666 pt5'>"
                                + "<label class='product-type product-gty mr5'>[签证]</label>编号:" + (item.ProductCode)
                                + "<span class='f999 gap'>签证类型：" + (item.ProductVisa.TypeName) + "</span>"
                            + "</dd>"
                            + "<dd class='pt10'>"
                                + "<span class='f999'>办理时长：<em class='f666'>" + (item.ProductVisa.ProcTime) + "</em></span>"
                                + "<span class='f999 gap'>面试：<em class='f666'>" + (item.ProductVisa.FaceTypeName) + "</em></span>"
                                + "<span class='f999 gap'>签证有效期：<em class='f666'>" + (item.ProductVisa.Valid) + "</em></span>"
                            + "</dd>"
                            + "<dd class='pt5'>"
                                + "<span class='f666'>入境次数：<em>" + (item.ProductVisa.EntryNum == -1 ? "多次" : (item.ProductVisa.EntryNum) + " 次") + "</em></span>"
                                + "<span class='f999 gap'>最长停留时间<em class='f666'>" + (item.ProductVisa.RemainTime) + "</em></span>"
                            + "</dd>"
                        + "</dl>"
                    + "</div>"
                + "</li>"); //end append
        }); //end each
        return;
    };


    //-------------跟团、自由行、私家及邮轮产品列表的显示
    this.ShowTourOrCruiseRouteHTML = function (json) {
        if (isVisa) return;

        //清除隐藏签证线路的显示
        $("#ulliVisa").empty().addClass("hide");

        var $control = $("#ulliTour");
        $control.empty();
        if (!json) return;

        //html线路信息
        var routeInnerHTML = "";
        $.each(json, function (index, item) {
            routeInnerHTML += ("<li data-pid='" + (item.ProductId) + "' data-price='" + (item.MinPrice) + "' class='list-item clearfix'>");
            if (item.MinPrice <= 0) {
                routeInnerHTML += (
                    "<div class='sort-line-sidebar tc fr'>"
                        + "<p class='price-mod gray'><span>价格请电询</span></p>"
                        + "<p class='red'><span>1010-9898" + (item.ProductType == 11 ? "" : "-4") + "</span></p>"
                    + "</div>");
            } else {
                var subPrice = 0; //优惠价格（减多少钱）
                if ($.trim(item.CheapTag) && item.CheapTag !== "正常") {
                    subPrice = parseInt(item.CheapTag.replace("减￥", ""), 10);
                }
                routeInnerHTML += ("<div class='sort-line-sidebar tc fr'>");
                if (subPrice > 0) {
                    routeInnerHTML += ("<p class='price-old-mod'>原价<u class='price'>￥<em class='f12'>" + (parseFloat(item.MinPrice + subPrice).toFixed(0)) + "</em></u></p>");
                }
                routeInnerHTML += ("<a class='price-mod block' href='javascript:;' target='_blank'><i class='price'>￥<em class='f20'>" + (parseFloat(item.MinPrice).toFixed(0)) + "</em></i>起</a>");
                if (subPrice > 0) {
                    routeInnerHTML += ("<p class='tab-favorable'><span class='tab-hd'>减</span><i class='tab-bd'>￥" + (subPrice) + "</i></p>");
                }
                routeInnerHTML += ("</div>");
            }

            routeInnerHTML += ("<div class='sort-line-main clearfix'>");

            var UzaiTravelClassCss = "product-gty";
            if (item.UzaiTravelClassName == "跟团游") { UzaiTravelClassCss = "product-gty"; }
            else if (item.UzaiTravelClassName == "自由行") { UzaiTravelClassCss = "product-zzy"; }
            else if (item.UzaiTravelClassName == "自驾游") { UzaiTravelClassCss = "product-zjy"; }
            else if (item.UzaiTravelClassName == "公司游") { UzaiTravelClassCss = "product-gsy"; }
            else if (item.UzaiTravelClassName == "当地游") { UzaiTravelClassCss = "product-ddy"; }
            else if (item.UzaiTravelClassName == "邮轮") { UzaiTravelClassCss = "product-yl"; }

            var strZJTitle = "";
            if (item.ProductType == 3 ||
                item.ProductType == 8 ||
                item.ProductType == 9 ||
                item.ProductType == 11 ||
                item.ProductType == 12) {
                strZJTitle = "【不限出发地】";
            }
            else if (item.ProductType==16){
                strZJTitle = "【" + item.AbroadStartCity + "出发】";
            }
             else {
                strZJTitle = "【" + item.StartCityName + "出发】";
            }

            var PageURL = item.ProductURL;
            if ($.trim($("#hdDataReq").attr("data-uztype")) == "manager") {

                var SuserId = _util.url.get("userId");
                var did = _util.url.get("did"); //渠道源ID

                if (item.ProductURL.toLowerCase().lastIndexOf("youlun/p-") >= 1) {
                    //邮轮offline下单保留tour跟团地址 2014-08-13 JoJo
                    PageURL = "http://sh.uzai.com/tour-" + item.ProductId + ".html";
                }
                if (UzaiTravelClassCss == "product-yl" || UzaiTravelClassCss == "product-gty") {
                    PageURL = "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineQueryProduct.aspx?productURL=" + encodeURIComponent(PageURL) + "&uztype=manager&userId=" + SuserId + "&did=" + did;
                }
                else if (UzaiTravelClassCss == "product-zzy") {
                    PageURL = "http://manager.uzai.com/Manager/MenuPages/OffLine/NewOffLineTripQueryProduct.aspx?productURL=" + encodeURIComponent(PageURL) + "&uztype=manager&userId=" + SuserId + "&did=" + did;
                }
            }

            routeInnerHTML += ("<a class='sort-line-pic block fl' target='_blank' href='" + (PageURL) + "' title='" + (item.ProductName) + "'><img alt='' data-original='" + (item.RandomImgURL) + "' "
                                + "src='//r01.uzaicdn.com/content/m/images/common/gray.gif' style='display: inline;' /></a>");

            routeInnerHTML += ("<dl class='sort-line-cont f999 fl'>"
                + "<dt class='f14'>");
            routeInnerHTML += ("<a data-tag='title' data-id='" + (item.ProductId) + "' data-type='" + (UzaiTravelClassCss) + "' target='_blank' href='" + (PageURL) + "'>"
                + (strZJTitle) + (item.ProductName.replace("<", "&lt;").replace(">", "&gt;"))
            + "</a>"
            + item.ShowIconHTML
            + "</dt>"
            + "<dd class='f666 pt5'><label class='product-type " + (UzaiTravelClassCss) + " mr5'>[" + (item.UzaiTravelClassName) + "]</label>" + (item.Content) + "</dd>");
            if ($.trim(item.TreeJourney)) {
                routeInnerHTML += ("<dd class='summary-bar mt5'>"
                    + "<span class='f999'>" + (item.UzaiTravelClassName == "自由行" ? "推荐景点" : "行程景点") + "：<em class='f666'>" + (item.TreeJourney) + "</em></span>"
                + "</dd>");
            }
            routeInnerHTML += ("<dd class='date-bar f666 mt5'>"
            + "<span class='f999'>出发班期：</span><em>" + (item.GoDate) + "</em><span class='btn-switch pointer ml10 btn-switch-on'><em class='switch-cont vm'>更多</em><span class='arrow-mod songti lh1 ml5 vm'><em>◆</em><i>◆</i></span></span>"
            + "</dd>");
            routeInnerHTML += ("</dl>"
            + "</div>"
            + "</li>");
        }); //end each
        $control.append(routeInnerHTML);
        return;
    };

    //-------------头panel完成后显示【您已选择】项信息
    this.ShowTabChecked = function () {
        //初始为当前什么也没选择似的
        $("#tabChecked").hide();
        $("#tabChecked span[data-option=main]").empty();

        var template = "<label class='tag-item'><span class='item-main pl5 vm'><q>${txt}</q>：<em class='red'>${val}</em></span><span class='tag-close pointer vm'><i class='close-icon'>×</i></span></label>";

        var $j_TourItems = $("#j_TourItems"); //跟团，自由行，私家 param
        var $j_CruiseItems = $("#j_CruiseItems"); //邮轮 param
        var $j_VisaItems = $("#j_VisaItems"); //签证 param

        var isTour = $j_TourItems.get(0) && $j_TourItems.is(":visible");

        var city = isTour ? $.trim($("#choiceCity a.on").text()) : $.trim($("#choiceCruiseCity a.on").text()); //出发城市
        var jybCity = $.trim( $("#j_zybCity a.on").text());//自由伴 出发城市
        var date = isTour ? $.trim($("#choiceGodate a.on").text()) : $.trim($("#choiceCruiseGodate a.on").text()); //出发日期
        var beginDate = isTour ? $.trim($("#txtdate1").val()) : $.trim($("#txtdate1_cruise").val()); //为手选日期
        var endDate = isTour ? $.trim($("#txtdate2").val()) : $.trim($("#txtdate2_cruise").val()); //为手选日期
        //var productGrade = $.trim($("#choiceProGrade a.on").text()); //产品等级
        var journeyDay = isTour ? $.trim($("#choiceJourneyDay a.on").text()) : $.trim($("#choiceCruiseJourneyDay a.on").text()); //行程天数
        var subType = $.trim($("#choiceSubTypeNav a.on").text()); //分类主题
        var pastAddress = $.trim($("#choicePastAddressNav a.on").text()); //途经景点
        var suitman = $.trim($("#choiceSuitman a.on").text()); //适合人群
        var minPrice = $.trim($("#txtMinPrice").val()); //为价格筛选
        var maxPrice = $.trim($("#txtMaxPrice").val()); //为价格筛选
        var relType = $.trim($("#j_jpbox a.on").text()); //产品类型

        if (maxPrice == "0") {
            $("#txtMaxPrice").val(""); //最高承受价不能为0
        }

        var checkedTourHTML = "";

        var cruiseRoute = $.trim($("#choiceCruiseRoute a.on").text()); //航线目的地
        var cruiseCompany = $.trim($("#choiceCruiseCompany a.on").text()); //邮轮公司
        var cruisePort = $.trim($("#choiceCruisePort a.on").text()); //出发港口

        var checkedCruiseHTML = "";

        if (isTour) {
            //****************************当前选中的为跟团，自由行，私家****************************


            if (productTypeEncode == 2 || productTypeEncode == 4 || productTypeEncode == 8 || productTypeEncode == 9 || productTypeEncode == 10) {
                //2当地游，4酒店套餐，8门票，9私家团，10门票+酒店
                //当下类别没有【出发城市】选择项，进行隐藏
            } else {
                //过滤掉境外参团
                if (city !== "全部"&&productTypeEncode.toString()!="12"){
                    checkedTourHTML += (template.replace("${txt}", "出发城市").replace("${val}", city));
                }
                if(jybCity!="全部"&&productTypeEncode.toString()=="12"){
                    checkedTourHTML += (template.replace("${txt}", "出发城市").replace("${val}", jybCity));
                }
            }

            //-------------begin  日期（手动输入与panel click）
            if (beginDate && !endDate) {
                //选择了开始日期，没选择结束日期
                checkedTourHTML += (template.replace("${txt}", "出发日期").replace("${val}", beginDate + "以后"));
            }
            else if (!beginDate && endDate) {
                //选择了结束日期，没选择开始日期
                checkedTourHTML += (template.replace("${txt}", "出发日期").replace("${val}", endDate + "之前"));
            }
            else if (beginDate && endDate) {
                checkedTourHTML += (template.replace("${txt}", "出发日期").replace("${val}", beginDate + " ~ " + endDate));
            }
            else if (date !== "全部") {
                checkedTourHTML += (template.replace("${txt}", "出发日期").replace("${val}", date));
            }
            //-------------end  日期（手动输入与panel click）

            if (minPrice && !maxPrice) {
                checkedTourHTML += (template.replace("${txt}", "价格").replace("${val}", minPrice + "元以上"));
            }
            else if (!minPrice && maxPrice) {
                checkedTourHTML += (template.replace("${txt}", "价格").replace("${val}", maxPrice + "元以下"));
            }
            else if (minPrice && maxPrice) {
                checkedTourHTML += (template.replace("${txt}", "价格").replace("${val}", minPrice + "元 ~ " + maxPrice + "元"));
            }

            //if (productGrade !== "全部") checkedTourHTML += (template.replace("${txt}", "产品等级").replace("${val}", productGrade));
            if (journeyDay !== "全部") checkedTourHTML += (template.replace("${txt}", "行程天数").replace("${val}", journeyDay));
            if (subType !== "全部") checkedTourHTML += (template.replace("${txt}", "分类主题").replace("${val}", subType));
            if (pastAddress !== "全部") checkedTourHTML += (template.replace("${txt}", "途经景点").replace("${val}", pastAddress));
            if (suitman !== "全部") checkedTourHTML += (template.replace("${txt}", "适合人群").replace("${val}", suitman));

            if (relType !== "全部"&&productTypeEncode.toString()=="12") checkedTourHTML += (template.replace("${txt}", "产品类型").replace("${val}", relType));
            if (checkedTourHTML) {
                //填充html
                $("#tabChecked span[data-option=main]").append(checkedTourHTML);
                $("#tabChecked").show();
                //可关闭
                this.CloseCheckedTab();
            }
            return;
        }
        if ($j_CruiseItems.get(0) && $j_CruiseItems.is(":visible")) {
            //****************************当前选中的为邮轮****************************

            if (city !== "全部") checkedCruiseHTML += (template.replace("${txt}", "出发城市").replace("${val}", city));
            if (cruiseRoute !== "全部") checkedCruiseHTML += (template.replace("${txt}", "航线目的地").replace("${val}", cruiseRoute));
            if (cruiseCompany !== "全部") checkedCruiseHTML += (template.replace("${txt}", "邮轮公司").replace("${val}", cruiseCompany));
            //-------------begin  日期（手动输入与panel click）
            if (beginDate && !endDate) {
                //选择了开始日期，没选择结束日期
                checkedCruiseHTML += (template.replace("${txt}", "出发日期").replace("${val}", beginDate + "以后"));
            }
            else if (!beginDate && endDate) {
                //选择了结束日期，没选择开始日期
                checkedCruiseHTML += (template.replace("${txt}", "出发日期").replace("${val}", endDate + "之前"));
            }
            else if (beginDate && endDate) {
                checkedCruiseHTML += (template.replace("${txt}", "出发日期").replace("${val}", beginDate + " ~ " + endDate));
            }
            else if (date !== "全部") {
                checkedCruiseHTML += (template.replace("${txt}", "出发日期").replace("${val}", date));
            }
            //-------------end  日期（手动输入与panel click）

            if (minPrice && !maxPrice) {
                checkedCruiseHTML += (template.replace("${txt}", "价格").replace("${val}", minPrice + "元以上"));
            }
            else if (!minPrice && maxPrice) {
                checkedCruiseHTML += (template.replace("${txt}", "价格").replace("${val}", maxPrice + "元以下"));
            }
            else if (minPrice && maxPrice) {
                checkedCruiseHTML += (template.replace("${txt}", "价格").replace("${val}", minPrice + "元 ~ " + maxPrice + "元"));
            }
            if (cruisePort !== "全部") checkedCruiseHTML += (template.replace("${txt}", "出发港口").replace("${val}", cruisePort));
            if (journeyDay !== "全部") checkedCruiseHTML += (template.replace("${txt}", "行程天数").replace("${val}", journeyDay));

            if (checkedCruiseHTML) {
                //填充html
                $("#tabChecked span[data-option=main]").append(checkedCruiseHTML);
                $("#tabChecked").show();
                //可关闭
                this.CloseCheckedTab();
            }
            return;
        }
        if ($j_VisaItems.get(0) && $j_VisaItems.is(":visible")) {
            //****************************当前选中的为签证****************************
            var visaArea = $.trim($("#choiceVisaArea a.on").text()); //地区
            var visaCountry = $.trim($("#choiceVisaCountry a.on").text()); //国家
            var visaReceiveZone = $.trim($("#choiceVisaReceiveZone a.on").text()); //所属领区
            var visaType = $.trim($("#choiceVisaType a.on").text()); //签证类型

            var checkedVisaHTML = "";
            if (visaArea !== "全部") checkedVisaHTML += (template.replace("${txt}", "地区").replace("${val}", visaArea));
            if (visaCountry !== "全部") checkedVisaHTML += (template.replace("${txt}", "国家").replace("${val}", visaCountry));
            if (visaReceiveZone !== "全部") checkedVisaHTML += (template.replace("${txt}", "所属领区").replace("${val}", visaReceiveZone));
            if (visaType !== "全部") checkedVisaHTML += (template.replace("${txt}", "签证类型").replace("${val}", visaType));

            if (minPrice && !maxPrice) {
                checkedVisaHTML += (template.replace("${txt}", "价格").replace("${val}", minPrice + "元以上"));
            }
            else if (!minPrice && maxPrice) {
                checkedVisaHTML += (template.replace("${txt}", "价格").replace("${val}", maxPrice + "元以下"));
            }
            else if (minPrice && maxPrice) {
                checkedVisaHTML += (template.replace("${txt}", "价格").replace("${val}", minPrice + "元 ~ " + maxPrice + "元"));
            }

            if (checkedVisaHTML) {
                //填充html
                $("#tabChecked span[data-option=main]").append(checkedVisaHTML);
                $("#tabChecked").show();
                //可关闭
                this.CloseCheckedTab();
            }
            return;
        }
        return;
    };

    //关闭您已选择项
    this.CloseCheckedTab = function () {
        $("#tabChecked i.close-icon").unbind("click").bind("click", function () {
            var tt = $.trim($(this).parents("label").find("q").text());
            //当前为跟团，自由行，私家param
            var $j_choiceItems = $("#j_TourItems");
            //邮轮param
            var $j_CruiseItems = $("#j_CruiseItems");
            //签证param
            var $j_VisaItems = $("#j_VisaItems");

            var jchild;
            if ($j_CruiseItems.is(":visible")) {
                jchild = $j_CruiseItems.children("dl").children("dt");
            }
            else if ($j_VisaItems.is(":visible")) {
                jchild = $j_VisaItems.children("dl").children("dt");
            }
            else {
                //跟团、自由行、私家
                jchild = $j_choiceItems.children("dl").children("dt");
            }
            if (tt === "价格") {
                //价格的清除
                $('#txtMinPrice,#txtMaxPrice').val('');
                SortRoute(this, 3);
                return false;
            }
            if (jchild.length >= 1) {
                $.each(jchild, function (item, index) {
                    if ($.trim($(this).text()) == tt) {
                        var items = $(this).siblings("dd").find("div[class*=-items]").find("a");

                        if (items.eq(0).get(0)) {
                            items.removeClass("on").eq(0).addClass("on").click();
                        } else {
                            $(this).siblings("dd").find("a").removeClass("on").eq(0).addClass("on").click();
                        }
                    }
                });
            }
        });
    };

    //-------------显示分页【头和尾】
    this.showPageHTML = function (json) {
        if (!json || parseInt(json.TotalCount, 10) === 0) {
            $("#tabChecked i[data-total=all]").text(0);
            $("#hjPages em[data-total=all]").text(0);
            $("#hjPages em[data-total=current]").text("1/0");
            $("#hjPages em[data-total=nav],#hjPagesThumb").empty();
            $("#hjPages,#hjPagesThumb").hide();
            return;
        }

        $("#tabChecked i[data-total=all]").text(json.TotalCount);
        $("#hjPages em[data-total=all]").text(json.TotalCount);
        $("#hjPages em[data-total=current]").text(json.CurrentPageIndex + "/" + json.PageCount);
        $("#hjPages span[data-total=nav]").html(json.PageHtmlToFoot); //顶部
        $("#hjPagesThumb").html(json.PageHtmlToHead); //头
        $("#hjPages,#hjPagesThumb").show();

    };
}

//点击分页
function page(index) {
    $("#hdDataReq").attr("data-PageIndex", index);
    //对线路数据条进行查询HTML显示
    SearchRoute();
    return;
}
//更多筛选条件（收起/展开）
function SearchFold() {
    var box = $(".choice-items"); // $('#j_choiceItems');
    var icon = box.find('.switch');
    var oMS = box.find('.more-switch');

    box.on('click', '.switch', function () {
        var o = $(this);
        var oem = o.find('em');
        var ot = o.find('i');
        if (ot.hasClass('arrow-bottom')) {
            oem.text('收起');
            o.parent().next().find('.hide').css({
                'display': 'inline-block'
            });
            ot.attr('class', 'arrow-top');
        } else {
            oem.text('展开');
            o.parent().next().find('.hide').hide();
            ot.attr('class', 'arrow-bottom');
        }
    });

    oMS.on('click', function () {
        var o = $(this);
        var osc = o.find('.switch-cont');
        var oam = o.find('.arrow-mod');
        var obox = o.parents(".choice-items");
        if (oam.hasClass('on')) {
            osc.text('更多筛选条件');
            obox.children('dl.hide').hide();
            oam.removeClass('on');
        } else {
            osc.text('收起筛选条件');
            obox.children('dl.hide').show();
            oam.addClass('on');
        }
    });

    $('#j_sortBar').find('.price-bar').on('mouseenter', function () {
        var oThis = $(this);
        oThis.addClass('price-bar-on');
    }).on('mouseleave', function () {
        var oThis = $(this);
        oThis.removeClass('price-bar-on');
    });
}

function begdate(startId, endId) {
    WdatePicker({ errDealMode: 1, el: startId, dateFmt: 'yyyy/MM/dd', minDate: '%y-%M-#{%d+1}', maxDate: '#F{$dp.$D(\'' + endId + '\')||\'' + $.trim($("#hdDataReq").attr("data-maxDate")) + '\'}' });
}
function enddate(startId, endId) {
    var minVal = "%y-%M-{%d+1}";
    if ($("#" + startId).val()) {
        minVal = "#F{$dp.$D(\'" + startId + "\')}";
    }
    //#F{$dp.$D(\'' + startId + '\')||\'%y-%M-#{%d+1}\'}
    WdatePicker({ errDealMode: 1, el: endId, dateFmt: 'yyyy/MM/dd', minDate: minVal, maxDate: $.trim($("#hdDataReq").attr("data-maxDate")) });
}

//产品线路日历的显示
function ShowProCalendar() {
    var jmr = $('#j_mainRoute');
    jmr.on('click', '.btn-switch', function () {
        var o = $(this);
        var arw = o.children('.arrow-mod');
        var mcalp = o.parents('.list-item');

        var pid = mcalp.attr('data-pid');

        var opa = mcalp.children('.after-calendar');

        if (!opa.get(0)) {
            mcalp.append('<div class="after-calendar ca-norm ca-norm-multi"></div>');
            opa = mcalp.children('.after-calendar');
        }

        if (arw.hasClass('on')) {
            o.removeClass('btn-switch-on');
            arw.removeClass('on');
            opa.hide();
            return; //收起日历
        }

        o.addClass('btn-switch-on');
        arw.addClass('on');
        opa.show();

        //先判断是存在日历对象
        var cal = opa.find('.j_jsonMultiCalendarWrap');
        if (cal.get(0)) {
            return;
        }

        opa.jsonMultiCalendar({
            jsonpUrl: 'http://sh.uzai.com/ashx/ashx_Calendar.ashx?pid=' + pid + '&type=1',
            isSmart: true,
            latestDate: '',
            extCallBack: function (year, month) {
                //选中
                opa.find('.item').on('click', function () {
                    var oi = $(this);
                    var oiExp = oi.hasClass('item-expiry') || oi.hasClass('item-gray');
                    if (!oiExp) {
                        var oiY = oi.attr('data-year');
                        var oiM = oi.attr('data-month');
                        var oiD = oi.attr('data-day');
                    }
                });
            },
            preCallback: function (year, month) {//上月下月预回调

            }
        }); //en opa.jsonMultiCalendar
    }); //end jmr.on('click', '.btn-switch', function ()
}





//添加注意事项
function AddElement() {

    if (_util.url.get("uztype") != "manager") {
        return; //无需添加，不为后面搜索
    }

    var SuserId = _util.url.get("userId");
    $("#ulliTour li").each(function () {
        var that = $(this);
        var cTtitle = that.find("a[data-tag='title']");

        var sType = $.trim(cTtitle.attr("data-stype"));
        if (sType) {
            var nn = $("<p class='pt10'>" + sType + "</p>");
            that.find(".sort-line-sidebar").append(nn);
        }

        var newP = $("<div class='zysx pt10'><a href=\"javascript:;\" style='color:#36c;' class=\"J_addAjax\" data-id='" + $.trim(cTtitle.attr("data-id")) + "'>销售注意事项</a></div>");
        that.find(".sort-line-sidebar").append(newP);
    });
    $(".zysx").css("z-index", "1");
    $(".J_itemtype").css("z-index", "2");
    $("body").append("<style>.c_ptext{border:1px solid #F9CC9F;position:absolute;top:28px;right:0;padding:10px;width:500px;background:#FFFCF8;display:none;line-height:1.4;text-align: left;}" +
                    ".zysx{float:right;margin-top:10px;position:relative;}</style>");

    //追加给定事件
    $(".J_addAjax").on('mouseover', function (e) {

        var that = $(e.target);

        that.parent().css("z-index", "99");
        if (that.nextAll(".J_Ptext").length > 0) {
            if (that.nextAll(".J_Ptext").find("p").length > 0) {
                that.next().show();
            }
        } else {
            var pId = $.trim($(this).attr("data-id"));
            var $p = $("<div class='c_ptext J_Ptext'></div>");
            var dom = "";
            that.parent().append($p);
            $.ajax({
                type: "GET",
                url: "http://aj.uzai.com/Product.ashx?ProductID=" + pId + "&rad=" + Math.random(),
                dataType: "jsonp",
                jsonp: "orderJsonData",
                success: function (msg) {
                    if (msg[0].ProductNotice && msg[0].ProductNotice) {
                        var arr = msg[0].ProductNotice.split("#$%");
                        for (var i = 0; i < arr.length; i++) {
                            dom += "<p style='padding:3px 0;'>" + arr[i] + "</p>";
                        }
                        that.next().html(dom).show();
                    }
                }
            });
        }
    });

    $(".J_addAjax").on('mouseout', function () {
        $(this).next().hide();
        $(".zysx").css("z-index", "1");
        $(".J_itemtype").css("z-index", "2");
    });
}

function searchGuessLike() {
    if (!window.guessLike) {
        _util.file.load(_uzw.domain.cdnRandom() + '/content/v1/scripts/com/guesslike.js', function () {
            guessLike('j_guessLikeContainer');
        });
    }
}


//境外拼团筛选
function ziyouban(){
    var tourItems = $('#j_TourItems');
    //var itemList = tourItems.find('.other-city-box').find('a');
    var jwswitch = tourItems.find('.recommend-city').find('.switch');
    var hotCity =  tourItems.find('.zyb-city-box');
    //var hotList = hotCity.find('a');
    var jplist = $('#j_jpbox').find('.pointer');
    var headercity =  $("#j_zybCity");
    $("#j_zybCityContent").on("click","a",function(){
            var o = $(this);
            var ot = o.text().trim();
            var os = o.siblings();
            var op = o.parent();
            var ops = op.siblings();
            hotCity.find('.hot-list').removeClass('on');
            //判断当前header 上有没有 这个节点
            var cityobjs =  headercity.find("a:not([class*='hide'])").map(function(i,n){
                var ntext =  $(n).text().trim();
                 if(ot===ntext&&ntext!==""){
                     return n;
                 }
            });
            headercity.find("a").removeAttr("data-last").removeClass("on");
            if(cityobjs.length>0){
                cityobjs.addClass('on').attr("data-last","");
                headercity.find('.hide').removeClass("on").removeAttr("data-last");
            }else{
                headercity.find('.hide').text(ot).addClass('on').show().attr("data-last","").css({"display":"inline-block"});
            }
             //触发click 事件
            $(o).closest("dd").find("[data-last]").trigger("click");
            o.addClass('on');
            os.removeClass('on');
            ops.find('a').removeClass('on');
    });
    /*
    hotList.on('click',function(){
        $('.bd-con').find('.item').children('a').removeClass('on');
    });*/
    $("#j_zybCity").on("click","a",function(){
         $('.bd-con').find('.item').children('a').removeClass('on');
    });

    jwswitch.on('click',function(){
        $('.other-city-box').toggle();
    });

    //样式
    // var objOn   =  $("#tabMenu .on")
    // if(objOn.attr("data-producttypetag")=="12")
    // {
    //     objOn.click();
    // }

    var otherList = $('.jwct').siblings();

    $('.jwct').on('click',function(){
        $('.recommend-city').children('.switch-box').show();
        $('.recommend-city').children('.hot-city-box').hide();
        $('.product-label').show();
        $('.zyb-city-box').show();
        $("#choiceCity").closest("dl").hide();
        $("#choiceCityZYB").closest("dl").show();
    });

    otherList.on('click',function(){
        $('.product-label').hide();
        $('.recommend-city').children('.switch-box').hide();
        $('.recommend-city').children('.hot-city-box').show();
        $('.other-city-box').hide();
        $('.zyb-city-box').hide();
        $("#choiceCity").closest("dl").show();
        $("#choiceCityZYB").closest("dl").hide();
    });

    jplist.on('click',function(){
        var t = $(this);
        var ts = t.siblings();
        t.addClass('on');
        ts.removeClass('on');
    });
}

//猜你喜欢收集
function productInterest(pid) {
    if (_uzw.user.userid) {
        var paras = {
            "userId": _uzw.user.userid,//用户ID
            "city": 0,//发起请求的城市站点，为0时取产品的出发城市
            "channel": 1,//信息渠道：1 PC、2 IPhone、3 Ipad、4 Android、5 M站
            "type": 6, //来源类型：1浏览历史、2我的收藏、3我的咨询、4意向订单、5支付订单、6关键词搜索、7自主点击不喜欢
            "productIds": pid//productIds：相关产品ID，多个产品ID可以用","分隔
        };
        $.ajax({
            type: 'post',
            url: _uzw.domain.wapi + "/api/UzaiInterest/InsertUserInterest",
            data: paras,
            dataType: 'jsonp',
            success: function (msg) { },
            error: function () { }
        });
    }
}