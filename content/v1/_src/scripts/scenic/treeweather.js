

$(function () {
    $(".juhe_startCity a").bind("click", function () {
        $(".juhe_startCity a").removeClass("cur");
        $(this).addClass("cur");
        var city = $(".juhe_startCity a.cur").attr("city");
        $(".linelist li").hide();
        $(".linelist li[city='" + city + "']").show();
        $(".juhe_lineMore").hide();
        $(".juhe_lineMore[city='" + city + "']").show();
    });
    $("#J_choose").click(function () {
        $("#searchForm").submit();
        $('#j_cityChoice').find('.other-city').trigger('click');
    });

    //日期选择 下拉
    $(".weatherBox-tLeft-time a").click(function () {
        $(".tLeft_layer").show();
    });

    //订阅弹出层
    $(".J_dy").click(function () {
        _uzw.ui.mask.show();
        $('.J_dy_box').show();
    });
    $(".J_dy_close").click(function () {
        _uzw.ui.mask.hide();
        $('.J_dy_box').hide();
    });

});


function cancel(obj) {
    var bkdate = $("#bookDate").val();
    var otd = $(obj).parents("div");
    otd.removeClass("bg_c");
    var cla = $(otd).attr("date");
    $("." + cla).remove();
    var rdate = bkdate.replace(cla + "、", "");
    $(obj).parents(".onget").hide();
    $(obj).parents(".onget").next().show();
    $("#bookDate").val(rdate);
}

function check(obj) {
    var dt = new Date();
    var dty = dt.getFullYear();

    var chkdate = "";
    var bkdate = "";
    if ($("#dateList em").length < 7) {
        bkdate = $("#bookDate").val();
        chkdate = $("#dateList").html();
        var otd = $(obj).parents("div");
        $(obj).hide();
        $(obj).prev().show();
        $(obj).parent().addClass("bg_c");
        $(".bg_c").each(function () {
            var cd = "<em class='" + $(this).attr("date") + "'>" + $(this).attr("date").replace(dty - 1 + "-", "").replace(dty + "-", "").replace(dty + 1 + "-", "") + "、</em>";
            var cd2 = $(this).attr("date");
            if (cd) {
                if (chkdate.indexOf(cd) < 0 && bkdate.indexOf(cd2) < 0) {
                    chkdate += cd;
                    bkdate += cd2 + "、";
                }
            }
            $("#bookDate").val(bkdate);
            $("#dateList").html(chkdate);

        });
    } else {
        alert("您的天气预报订阅天数已达到7天，不能再继续选择。");
    }
}

winLoadFix(function () {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() * 1 + 1;
    var date = myDate.getDate();
    if (month == 1 && date == 31) {
        month = 2; date = 1;
    }
    if (month == 2 && date == 28) {
        month = 3; date = 1;
    }
    if (month == 3 && date == 31) {
        month = 4; date = 1;
    }
    if (month == 4 && date == 30) {
        month = 5; date = 1;
    }
    if (month == 5 && date == 31) {
        month = 6; date = 1;
    }
    if (month == 6 && date == 30) {
        month = 7; date = 1;
    }
    if (month == 7 && date == 31) {
        month = 8; date = 1;
    }
    if (month == 8 && date == 31) {
        month = 9; date = 1;
    }
    if (month == 9 && date == 30) {
        month = 10; date = 1;
    }
    if (month == 10 && date == 31) {
        month = 11; date = 1;
    }
    if (month == 11 && date == 30) {
        month = 12; date = 1;
    }
    if (month == 12 && date == 31) {
        year = parseInt(year, 10) + 1; month = 1; date = 1;
    }
    $(".J_chakan").html(year + "年" + month + "月");
    //alert(year + " " + month + " " + date)
    new Calendar(year, month, date).show(document.getElementById("div_Calendar"), 0, "", false, true, true); //ele, id, url, iseven, ischangecss, isweb
});

function reloadDate(year, month, date) {

    $(".calendars").remove();
    new Calendar(year, month, date).show(document.getElementById("div_Calendar"), 0, "", false, true, true); //ele, id, url, iseven, ischangecss, isweb

}


function bookWeather(type) {

    var date = $("#bookDate").val();
    var phone = $("#txt_Phone").val();
    var mail = $("#txt_Email").val();

    if (treeid === '0' && !sceneryname) {
        alert("没有获取到你订阅的目的地信息，请重新搜索！");
        return false;
    }

    if (type == "phone") {
        if (_uzw.regexForm.mobile(phone)) {
            $.get("/weather/bookWeather?treeid=" + treeid + "&sceneryname=" + encodeURI(sceneryname) + "&date=" + date + "&bookTarget=" + phone + "&type=phone&ran=" + Math.random(), function (data) {
                var flag = parseInt(data, 10);
                if (flag > 0) {
                    alert("订阅成功！");
                    $("#txt_Phone").val("");
                    $("#txt_Email").val("");
                    $(".J_dy_box").hide();
                    closeEditorDiv(this, ".J_dy_box");
                }
                else if (flag == -1) {
                    alert("订阅失败，您成功订阅的天数已达到7天！");
                }
                else if (flag === 0) {
                    alert("订阅失败！");
                }
            });
        }
        else {
            alert("请正确填写手机号！");
        }
    }
    else {
        if (_uzw.regexForm.mobile(mail)) {
            $.get("/weather/bookWeather?treeid=" + treeid + "&sceneryname=" + encodeURI(sceneryname) + "&date=" + date + "&bookTarget=" + mail + "&type=email&ran=" + Math.random(), function (data) {
                var flag = parseInt(data, 10);
                if (flag > 0) {
                    alert("订阅成功！");
                    $("#txt_Phone").val("");
                    $("#txt_Email").val("");
                    $(".J_dy_box").hide();
                    closeEditorDiv(this, ".J_dy_box");
                }
                else if (flag === -1) {
                    alert("订阅失败，您成功订阅的天数已达到7天！");
                }
                else if (flag === 0) {
                    alert("订阅失败！");
                }
            });
        }
        else {
            alert("请正确填写Email！");
        }
    }
}