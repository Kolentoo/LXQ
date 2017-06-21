/*
 * uzai global user PU/UV track 
 * jsonchou 2015-05-14
 */

//悠哉账号     UserID（非必须）
//IP值        IPValue
//IP城市      IPCity
//设备类型     Equipment
//屏幕分辨率   Resolution
//浏览器       Browser
//入口URL     CurrentURL
//来源URL     FromURL
//唯一轨迹ID  UUID  （必须）
//访问类型     PageType = 1

(function () {

    var UUID = "";
    var UserID = _uzw.user.userid || "0";
    var Equipment = _uzw.mobile.isPC ? "PC" : "Mobile";
    var Resolution = screen.width + "*" + screen.height;
    var Browser = _ua;
    var CurrentURL = location.href;
    var FromURL = document.referrer.toLowerCase();//referrer
    var ProductID = $('#pid').val() || "0";
    var StartCity = _ug.cityCN;//sh
    var ProductType = $('#pcode').val() || "0";
    var UzaiTravelClassID = $('#tClass').val() || "0";
    var AreaName = $("#AreaName").val() || "";
    var LocationName = $("#LocationName").val() || $("#hidLocationName").val() || "";
    var TreeName = $("#TreeName").val() || $("#hidTreeName").val() || "";
    var OrderMoney = $("#OrderMoney").val() || $("#hidOrderMoney").val() || "0";
    var OrderID = $("#OrderID").val() || $("#hidOrderID").val() || "0";
    var OrderCode = $("#OrderCode").val() || $("#hidOrderCode").val() || "";
    var IsExternal = "0";

    //当前页面类型
    var PageTag = _ug.pagePKG.getTag();
    var PageType = 1;

    var ckName = "uzwTrack";

    var isOutSite = false;

    if (FromURL) {
        //判断前一个URL
        var outSiteArr = ['.baidu.com', '.google.com', '.soso.com', '.sogou.com', '.so.com', '.haosou.com', '.360.cn', '.hao123.com', '.2345.com', '.qq.com', '.265.com', '.tao123.com', '.114la.com', '.3456.cc', '.duba.com', '.rising.cn'];

        for (var i = 0; i < outSiteArr.length; i++) {
            var item = outSiteArr[i];
            if (FromURL.indexOf(item) > -1) {
                isOutSite = true;
                break;
            }
        }
    }

    if (isOutSite || !FromURL) {
        UUID = _util.string.GUID();//生成GUID
        IsExternal = "1";
    } else {
        IsExternal = "0";
        //从cookie中读取UUID
        var ck = _uzw.cookie.get(ckName);
        if (ck) {
            var UUIDObj = eval('(' + ck + ')');
            UUID = UUIDObj.UUID;
        } else {
            UUID = _util.string.GUID();//生成GUID
        }
    }

    if (PageTag == 'product') {
        PageType = 2;
    } else if (PageTag == 'order') {
        PageType = 3;
    } else if (PageTag == 'list' || PageTag == 'rss' || PageTag == 'channel' || PageTag == 'search' || PageTag == 'subject') {
        PageType = 4;
    } else {
        PageType = 9;
    }

    //console.log(IsExternal);

    var dataArr = ["\"IsExternal\":\"" + IsExternal + "\"", "\"PageType\":\"" + PageType + "\"", "\"StartCity\":\"" + StartCity + "\"", "\"UUID\":\"" + UUID + "\"", "\"UserID\":\"" + UserID + "\"", "\"Equipment\":\"" + Equipment + "\"", "\"Resolution\":\"" + Resolution + "\"", "\"Browser\":\"" + Browser + "\"", "\"CurrentURL\":\"" + CurrentURL + "\"", "\"FromURL\":\"" + FromURL + "\"", "\"ProductID\":\"" + ProductID + "\"", "\"ProductType\":\"" + ProductType + "\"", "\"UzaiTravelClassID\":\"" + UzaiTravelClassID + "\"", "\"AreaName\":\"" + AreaName + "\"", "\"LocationName\":\"" + LocationName + "\"", "\"TreeName\":\"" + TreeName + "\"", "\"OrderMoney\":\"" + OrderMoney + "\"", "\"OrderID\":\"" + OrderID + "\"", "\"OrderCode\":\"" + OrderCode + "\""];

    //console.log("{" + dataArr.join(',') + "}");

    _uzw.cookie.set(ckName, "{" + dataArr.join(',') + "}", 1);

    $.ajax({
        url: "//aj.uzai.com/api/UzaiTrajectory/InsertTrajectory",
        dataType: "jsonp",
        cache: false,
        type: "GET",
        success: function (data) {
            var sta = data.Success;
            //console.log(sta);
            if (sta) {

            } else {

            }
        },
        error: function () {

        }
    });
})();

