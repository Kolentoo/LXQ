//订单出游人js

$(function () {
    travelerinit();
});

function travelerinit() {

    var redirectPage = $("#hidRedirectPage").val();
    if (redirectPage == "Proc_One") {
        $(".travel-info i").css("display", "none");
    }
    //鼠标移开某一块区域
    var blurObj = null;
    $(document.body).on("blur", "input,select", function () {
        var o = $(this);
        if (o.is(".person-info input,select")) {
            blurObj = o;
        } else {
            blurObj = null;
        }
    });

    //出游人信息BOX
    $('.travel-person').find('.per-list').on('click', function () {
        var o = $(this);
        var obj = o.find("input[type=checkbox]");

        unitCheckbox(o, {
            clickAfter: function (target) {
                //是否选中
                var checked = obj.prop("checked");
                o = obj;
                var len = $("input[name^='name-group']:checked").length;
                var totalTraveler = parseInt($("#hidTotalTraveler").val());
                //选择某个联系人的操作
                if (checked) {
                    //判断选中的个数
                    if (len > totalTraveler) {
                        $(o).click();
                        $('.travel-person').find(".per-tips").css("display", "block");
                        return false;
                    }

                    var des = o.attr('data-des');

                    if (blurObj != null) {
                        var x = blurObj.closest(".info-box").find("input[name=hidTraveler]").attr("data-position");
                        $("#hidTraveler" + x).val(o.attr('data-cbxposition'));

                        FillFormData(des, x);
                        blurObj = null;
                        return;
                    }

                    //判断已选中联系人前面面板是否填充（防止选中又取消）
                    var isfill = false;
                    for (var j = 1; j < len; j++) {
                        if ($("#username" + j).val() == "" && $("#firstname" + j).val() == "" && $("#lastname" + j).val() == "" && $("#phone" + j).val() == "" && $("#paperid" + j).val() == "" && $("#birthday" + j).val() == "") {
                            $("#hidTraveler" + j).val(o.attr('data-cbxposition'));
                            //var paraId = 'selectPaper' + j;
                            //$("#" + paraId + " option[value='" + paperType + "']").attr("selected", true);
                            FillFormData(des, j);
                            isfill = true;
                        }
                    }
                    if (!isfill) {
                        $("#hidTraveler" + len).val(o.attr('data-cbxposition'));
                        FillFormData(des, len);
                    }
                } else {
                    //取消选中
                    var cbxPosition = o.attr('data-cbxposition');
                    clearformdata(cbxPosition);

                    if (len < totalTraveler) {
                        $('.travel-person').find(".per-tips").css("display", "none");
                        return false;
                    }
                }
            }
        });
    });

    //证件类型改变事件
    $("select[id^='selectPaper']").on("change", function () {
        var o = $(this);
        var ov = $(this).val();
        var num = o.attr("id").replace("selectPaper", "");
        var menu = o.parents(".info-box");
        var type = $("#hidTravelClassId").val(); //订单类型
        menu.find(".list5").show();
        menu.find(".list6").show();

        if (parseInt(type) == 0) {//国内
            if (ov == "0_4") {//身份证
                //生日和性别隐藏
                menu.find(".list5").hide();
                menu.find(".list6").hide();
                //身份证号码和位置
                //GetBirthDayAndSex($("#paperid" + num).val(),num );
            }
        }
        var chkTraveler = $("#hidTraveler" + num).val();
        if (chkTraveler.length > 0) {
            //获取选中的选择框的游客信息数据
            //var pIndex = $(this).attr('id');
            //pIndex = pIndex.split('selectPaper')[1];
            var des = $("#contactListId" + chkTraveler).attr("data-des"); //游客详细信息
            if (des) {
                var paperinfo = eval("(" + des + ")").paperinfo;  //证件信息列表
                $.each(paperinfo, function (i, value) {
                    if (value.codetype == ov) {
                        $("#paperid" + num).val(value.code); //证件号码
                        if (ov == "0_4") {//身份证
                            //通过身份证获取出生日期和性别
                            //GetBirthDayAndSex($("#paperid" + num).val(), num);
                        }
                        return false;  //匹配到证件证件信息后结束$.each遍历
                    } else {
                        $("#paperid" + num).val(""); //证件号码
                    }
                });
            }
        }

    });


    //如果跳转之前已经有值，填充表单
    var otherUserCount = $("#orderOtherUserCountId").val();
    if (otherUserCount > 0) {
        //如果已经填写的订单出游人就是常用游客之一，checkbox默认选中
        //遍历所有的常用出游人checkbox
        var contactCount = $("#contactCountId").val();
        if (contactCount > 0) {
            for (var j = 1; j <= contactCount; j++) {
                var des = $("#contactListId" + j).attr("data-des");
                var desObj = eval('(' + des + ')');
                var hasTravelerName = desObj.hasTravelerName;
                if (hasTravelerName == 1) {
                    $('.per-list').eq(j - 1).click();
                }
            }
        }

        for (var i = 1; i <= otherUserCount; i++) {
            if ($("#orderOtherUserId" + i).length > 0) {
                var otherUserData = $("#orderOtherUserId" + i).val();
                var otherUserObj = eval('(' + otherUserData + ')');
                $("#username" + i).val(otherUserObj.UserName);
                $("#phone" + i).val(otherUserObj.Mobile);
                if (otherUserObj.Birthday != "1900-01-01") {
                    $("#birthday" + i).val(otherUserObj.Birthday.split(' ')[0]);
                } else {
                    $("#birthday" + i).val("");
                }
                if (otherUserObj.Sex == 1) {
                    $("input[name='sex" + i + "'][value='1']").parents('.radio-list').click();
                } else {
                    $("input[name='sex" + i + "'][value='0']").parents('.radio-list').click();
                }

                $("#paperid" + i).val(otherUserObj.DocumentsCode);

                var travelerType = $("#hidTravelClassId").val();
                if (parseInt(travelerType) == 0) {

                    if (otherUserObj.DocumnetsType == "0") {
                        $("#selectPaper" + i).val("0_4");
                        $("input[name='sex" + i + "']").parents('.radio-list').parent().parent(".list5").hide();
                        $("#birthday" + i).parent(".list6").hide();
                    }
                    if (otherUserObj.DocumnetsType == "6") {
                        var paraId = 'selectPaper' + i;
                        $("#" + paraId).val("6_3");
                    }
                    if (otherUserObj.DocumnetsType == "-1") {
                        var paraId = 'selectPaper' + i;
                        $("#" + paraId).val("-1_5");
                    }
                } else {
                    if (otherUserObj.DocumnetsType == "0") {
                        var paraId = 'selectPaper' + i;
                        $("#" + paraId).val("4_0");
                    }
                    if (otherUserObj.DocumnetsType == "1") {
                        var paraId = 'selectPaper' + i;
                        $("#" + paraId).val("8_1");
                    }
                    if (otherUserObj.DocumnetsType == "6") {
                        var paraId = 'selectPaper' + i;
                        $("#" + paraId).val("9_6");
                    }
                }
            }
        }
    }
}


//填充数据
function FillFormData(des, pos) {
    if (des && des.length > 0) {
        var obj = eval('(' + des + ')');
        $("#hidTravelerId" + pos).val(obj.id);
        $("#username" + pos).val(obj.name);
        $("#firstname" + pos).val(obj.firstname.split('-')[0]);
        $("#lastname" + pos).val(obj.firstname.split('-')[1]);
        $("#phone" + pos).val(obj.phone);

        if (obj.birthday != "1900-01-01") {
            $("#birthday" + pos).val(obj.birth);
        } else {
            $("#birthday" + pos).val("");
        }
        if (obj.sex == 1) {
            $("input[name='sex" + pos + "'][value='1']").parents('.radio-list').click();
        } else {
            $("input[name='sex" + pos + "'][value='0']").parents('.radio-list').click();
        }
        var codeType = $("#selectPaper" + pos).val(); //获取选中的证件类别
        var paperinfo = obj.paperinfo;  //证件信息列表

        $("#paperid" + pos).val("");
        if (codeType == "") {
            var travelerType = $("#hidTravelClassId").val();
            if (parseInt(travelerType) == 0) {
                $(paperinfo).each(function (i) {
                    if (paperinfo[i].codetype == "0_4") {
                        var paraId = 'selectPaper' + pos;
                        $("#selectPaper" + pos).val("0_4");
                        $("#paperid" + pos).val(paperinfo[i].code);
                        $("input[name='sex" + pos + "']").parents('.radio-list').parent().parent(".list5").hide();
                        $("#birthday" + pos).parent(".list6").hide();
                        return false;
                    }
                });
                $(paperinfo).each(function (i) {
                    if (paperinfo[i].codetype == "6_3") {
                        var paraId = 'selectPaper' + pos;
                        $("#" + paraId).val("6_3");
                        $("#paperid" + pos).val(paperinfo[i].code);
                        return false;
                    }
                });
                $(paperinfo).each(function (i) {
                    if (paperinfo[i].codetype == "-1_5") {
                        var paraId = 'selectPaper' + pos;
                        $("#" + paraId).val("-1_5");
                        $("#paperid" + pos).val(paperinfo[i].code);
                        return false;
                    }
                });
            } else {
                $(paperinfo).each(function (i) {
                    if (paperinfo[i].codetype == "4_0") {
                        var paraId = 'selectPaper' + pos;
                        $("#" + paraId).val("4_0");
                        $("#paperid" + pos).val(paperinfo[i].code);
                        return false;
                    }
                });
                $(paperinfo).each(function (i) {
                    if (paperinfo[i].codetype == "8_1") {
                        var paraId = 'selectPaper' + pos;
                        $("#" + paraId).val("8_1");
                        $("#paperid" + pos).val(paperinfo[i].code);
                        return false;
                    }
                });
                $(paperinfo).each(function (i) {
                    if (paperinfo[i].codetype == "9_6") {
                        var paraId = 'selectPaper' + pos;
                        $("#" + paraId).val("9_6");
                        $("#paperid" + pos).val(paperinfo[i].code);
                        return false;
                    }
                });
            }

        } else {
            $(paperinfo).each(function (i) {
                //依次进行判断
                //paperinfo.codetype- 为证件类型 规则如 0_4 0-表示国内证件的值，4-表示境外证件的值   
                if (paperinfo[i].codetype == codeType) {
                    $("#paperid" + pos).val(paperinfo[i].code); //证件号码
                    //if (codeType == "0_4") {                    //如果是身份证
                    //生日和性别隐藏
                    //$("#birthday" + pos).parent().parent().hide();
                    //$("#sex" + pos).parent().parent().hide();
                    //身份证号码和位置
                    //GetBirthDayAndSex($("#paperid" + num).val(), num);
                    //}
                }
            });
        }
        //填充数据的时候，隐藏所有的数据验证提示信息
        $("#username" + pos).parents('.info-listing').find(".label-tips").addClass("hide");
        $("#username" + pos).parents('.info-listing').find("input").removeClass("input-err");

    }
}

//清空数据
function clearformdata(position) {
    var o = $("input[type='hidden'][name='hidTraveler'][value=" + position + "]");
    var poc = o.attr("data-position");
    $("#username" + poc).val("");
    $("#firstname" + poc).val("");
    $("#lastname" + poc).val("");
    $("#phone" + poc).val("");
    $("#paperid" + poc).val("");
    $("#birthday" + poc).val("");
    $("input[name='sex" + poc + "'][value='1']").parents('.radio-list').click();
    $("#selectPaper" + poc).val("")
    $("input[name='sex" + poc + "']").parents('.radio-list').parent().parent(".list5").show();
    $("#birthday" + poc).parent(".list6").show();
}



//根据身份证号码获取出生年月和性别
function GetBirthDayAndSex(cardNumber, pos) {
    var bday = "";
    var n = 1;
    if (cardNumber.length == 18) {
        bday = cardNumber.substr(6, 4) + "/" + cardNumber.substr(10, 2) + "/" + cardNumber.substr(12, 2);
        n = cardNumber.substring(cardNumber.length - 2, cardNumber.length - 1);
        $("#birthday" + pos).val(cardNumber.substr(6, 4) + "-" + cardNumber.substr(10, 2) + "-" + cardNumber.substr(12, 2)); //从身份证中读取出生年月
    }
    else if (cardNumber.length == 15) {
        bday = "19" + cardNumber.substr(6, 2) + "/" + cardNumber.substr(8, 2) + "/" + cardNumber.substr(10, 2);
        n = cardNumber.substr(cardNumber.length - 1);
        $("#birthday" + pos).val("19" + cardNumber.substr(6, 2) + "-" + cardNumber.substr(8, 2) + "-" + cardNumber.substr(10, 2)); //从身份证中读取出生年月
    }
    $("#sex" + pos).val(n % 2); //性别，偶数为女，奇数为男
}

function popContract(orderId, cityId, orderType) {
    //这些出发城市都有合同
    var citys = ",1,2,57,19,144,4,253,94,29,31,286,204,115,309,258,3,257,8,22,58,61,83,238,27,68,134,135,138,268,149,304,190,43,51,310,165,221,277,";
    //可以支付，并且满足是国内、周边的合同，则必须签订(出境订单上海站的也需要展示合同，但是不会自动上传合同到后台)
    if ((orderType == 1 || orderType == 2 || orderType == 3 ||
        orderType == 15 || orderType == 16 || orderType == 29) && (citys.indexOf("," + cityId + ",") >= 0)) {
        //editWidget_contract("/proc_contract/" + orderId + "/" + cityId + "/" + orderType + "");
        //_uzw.iframe.pop("http://203.uzai.com:7008/proc_contract/" + orderId + "/" + cityId + "/" + orderType + "/2", 940, 600);
        //_uzw.iframe.pop("http://local.uzai.com:3652/proc_contract/" + orderId + "/" + cityId + "/" + orderType + "/2", 940, 600); //update todo
        _uzw.iframe.pop("//pay.uzai.com/proc_contract/" + orderId + "/" + cityId + "/" + orderType + "/2", 940, 600); //update todo
    }
}
