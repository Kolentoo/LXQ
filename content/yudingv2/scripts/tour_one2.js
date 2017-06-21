

//radio 选中
function showCont() {
    debugger
    switch ($("input[name=radioOrderAdmin]:checked").attr("id")) {
        case "_rbtnAdminY":
            $("#txtHiddenUserAdminIdRadio").val($("#_rbtnAdminY").val());
            break;
        case "_rbtnAdminN":
            $("#txtHiddenUserAdminIdRadio").val(0);
            break;
        default:
            break;
    }
}



//张毅  后台销售通过offine下单时默认订单操作员改为当前销售自己 --

    window.onload = function() {
              
        var userStoreID = $("#txtHiddenStoreID").val();
        if(userStoreID!=785&&userStoreID!=530&&userStoreID!=293 && userStoreID>0 ){
            $("#_rbtnAdminY").attr("checked","checked");
            $("#_rbtnAdminN").attr("checked",false);
              
        }else
        {
            $("#_rbtnAdminN").attr("checked","checked");
            $("#_rbtnAdminY").attr("checked",false);
        }

        showCont();
        $("input[name=radioOrderAdmin]").click(function () {
            showCont();
        });

    }


//#region 配送方式&Wifi配送方式
$(".delivery-tab").find("ul").on("click", "li", function () {
    var v = $(this).attr("value");
    $("#txtHiddenDelivery").val(v);
    if (v == "city") {
        $("#radDelivery1").prop("checked", false);
    }
    else if (v == "store") {
        $("#radDelivery1").prop("checked", true);
    }
});
$("div.wifiDelivery").find("ul").on("click", "li", function () {
    var v = $(this).attr("value");
    $("#txtHiddenWifiDelivery").val(v);
    if (v == "C") {
        $("#txtWifiDeliveryAddress").focus();
    }
});
//#endregion
//订单备注字数限制
$("#txtDes").keyup(function () {
    var des = $(this).val();
    if (des.length <= 200) {
        //$("#eCodeLeft").text(parseInt(200 - des.length));
    }
    else {
        $(this).val($(this).val().substr(0, 200));
    }
});
//#endregion

setUserChannel();
// 设置渠道
function setUserChannel() {
    var allChannel = $("#selAllChannel");
    var channelType = $("#selChannelType");
    var channel = $("#selChannel");

    channelType.on("change", function () {
        var v = $(this).val();
        channel.html("<option value='0'>请选择渠道</option>");
        channel.append(allChannel.find("[type='" + v + "']").clone());
    });

    if ($("#hidSupplierFlag").val() == "008") {
        channelType.val("请选择类别").removeAttr("disabled");
        channel.html("<option value='0'>请选择渠道</option>").removeAttr("disabled");
    }
    else {
        channelType.val("电商").attr("disabled", "disabled");
        channel.append(allChannel.find("[type='电商']").clone()).val("23430").attr("disabled", "disabled");
    }
}
/*门店选择*/
if (!$("#ddlStoreCity").attr("disabled")) {
    $("#ddlStoreCity").html("");
    $("#ddlStoreCity").html($("#storeOption option[type='city']").clone());

    $("#ddlStoreCity").change(function () {
        storeCityChanged();
    });
    $("#ddlStoreCity").change(function () {
        storeAreaChanged();
    });
    $("#ddlStoreArea").change(function () {
        storeAreaChanged();
    });

    var city = $("#txtHiddenStoreCity").val();

    $("#ddlStoreCity").val(city);

    storeCityChanged();

}
//#region 客服/计调备注
$("#radioKF,#radioJD").on("change", function () {
    if (this.checked) {
        $("#txtCommentsType").attr("name", "txt" + this.id.replace("radio", "") + "orderComments");
    }
});
//#endregion
//#region 门店选择
function storeCityChanged() {
    var city = $("#ddlStoreCity").val();
    $("#ddlStoreArea").html("");

    $("#ddlStoreArea").html($("#storeOption option[type='area'][city='" + city + "']").clone());

    storeAreaChanged();
}
function storeAreaChanged() {
    var city = $("#ddlStoreArea option:selected").attr("city"),
        area = $("#ddlStoreArea").val();
    $("#ddlStore").html("");

    $("#ddlStore").html($("#storeOption option[type='store'][city='" + city + "'][area='" + area + "']").clone());

}
//#endregion
// 联系人验证
function contactValidate(e) {
    var res = true;
    var id = $(e).attr("id");
    var _val = $.trim($(e).val());
    if (id == "txt_name") {
        var nameReg = new RegExp(/^[A-Za-z\u4E00-\u9FA5\_\＿\/]+$/); //姓名【字母，中文，下划线，反斜线】
        if (_val == "" || _val == undefined) {
            showError($(e), "不能为空");
            res = false;
        }
        else if (_val.length > 26) {
            showError($(e), "不能超过26个英文字符");
            res = false;
        }
        else if (!nameReg.test(_val)) {
            res = false;
            showError($(e), "格式错误");
        }
    }
    if (id == "txt_mobile") {
        var mobileReg = new RegExp(/^((\(\d{3}\))|(\d{3}\-))?((13|14|17)[0-9]|15[0-9]|18[0-9])\d{8}$/); //手机
        if (_val == "") {
            showError($(e), "不能为空");
            res = false;
        }
        else if (_val.length != 11 || isNaN(_val) || !mobileReg.test(_val)) {
            showError($(e), "格式不正确");
            res = false;
        }
    }
    if (id == "txt_email") {
        var emailReg = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/); //邮箱
        if (_val != "") {
            if (!emailReg.test(_val)) {
                showError($(e), "格式错误");
                return false;
            }
        }

    }
    if (id == "txt_phone_qian") {
        var emailReg = new RegExp(/(^(0\d{2})-(\d{8})$)|(^(0\d{3})-(\d{7})$)|(^(0\d{2})-(\d{8})-(\d+)$)|(^(0\d{3})-(\d{7})-(\d+)$)/); //固定电话
        var _valphone = $.trim($(e).val() + '-' + $('#txt_phone_hou').val());
        if (_valphone != "-") {
            if (!emailReg.test(_valphone)) {
                showError($(e), "格式错误");
                return false;
            }
        }

    }
    var remark = $('#txt_des').val();
    if (remark.length > 200) {

    }
    if (res) {
        $(e).removeClass("blur");
        removeError($(e));
    }
    return res;
}
// 绑定联系人信息中的校验事件
$('#contact_info').find("input,textarea").blur(function () {
    var res = true;
    var e = $(this);
    removeError(e);
    var id = $(e).attr("id");
    var _val = $.trim($(e).val());
    if (id == "txt_name") {
        if (_val == "" || _val == undefined) {
            showError($(e), "不能为空");
            res = false;
        }
    }
    if (id == "txt_mobile") {
        if (_val == "") {
            showError($(e), "不能为空");
            res = false;
        }
        else if (_val.length != 11 || isNaN(_val)) {
            showError($(e), "格式不正确");
            res = false;
        }
    }
    if (res) {
        $(e).removeClass("blur");
        removeError($(e));
    }
});
// 显示错误信息
function showError(e, msg) {
    $(e).after('<div class="error_entry">' + msg + '</div>');
    var className = $(e).attr("class");
    if (className.indexOf('error') < 0) {
        className = className + " error";
    }
    $(e).attr("class", className);
    // 绑定错误信息关闭按钮事件
    $(e).parent().find(".error_entry").on('click', function () {
        $(this).hide();
        $(e).val('');
        $(e).removeClass('error');
        $(e).removeClass('blur');
    });
}
// 移除错误信息
function removeError(e) {
    $(e).parent().find("div[class='error_entry']").remove();
    $(e).removeClass('error');
}

var isSubmitting = false;
function activityValidate() {
    //下单平台
    $("#hidPlatForm").val($("#selectPlatform").val());
    //订单来源
    var source = $("#selectOrderSource");
    $("#hidOrderSource").val($("#selectOrderSource").val());
    if (!source.val() || source.val() == "-1") {
        alert("请选择订单来源");
        source.focus();
        return;
    }
    //客户渠道
    if ($("#selChannel").val() == "0") {
        alert("请选择客户渠道");
        return;
    }

    ////订单操作人
    //if ($("#_rbtnAdminN").checked) {
    //    $("#txtHiddenUserAdminId").val(0);
    //} else {
    //    $("#txtHiddenUserAdminId").val($("#_rbtnAdminY").val());
    //}

    if (isSubmitting == false) {

        var result = checkForm();
        if (result) {
            isSubmitting = true;

            $('.body_shade').show();
            $('.storage').show();
            // 验证优惠活动是否可用、优惠金额是否正确
            var selectedActivities = $('#hidSelectedActivities').val();
            if (selectedActivities) {
                var activityArr = JSON.parse(selectedActivities);
                if (activityArr != null && activityArr.length > 0) {
                    var productId = $('#txtHiddenPId').val();
                    var goDate = $('#txtHiddenGoDate').val();
                    var adultCount = $('#txtHiddenPersonNum').val();
                    var childCount = $('#txtHiddenChildNum').val();
                    var adultPrice = $('#txtHiddenUzaiPrice').val();
                    var childPrice = $('#txtHiddenChildPrice').val();
                    var productType = $('#txtHiddenMType').val();
                    var supplierFlag = $('#hidSupplierFlag').val();
                    var isOutPluckPro = $('#hidIsOutPluckPro').val();
                    if (supplierFlag == "008") {
                        if (isOutPluckPro == "1") {
                            supplierFlag = "43"; //众信外采
                        }
                        else {
                            supplierFlag = "41"; //众信自营
                        }
                    }
                    var score = parseInt($('#txtHiddenUseScore').val(), 10) || 0;
                    var voucher = $('#txtHiddenUseVoucher').val();
                    var param = {
                        SelectedActivities: selectedActivities,
                        ProductId: productId,
                        TuanQi: goDate,
                        AdultCount: adultCount,
                        AdultTuanAmount: adultPrice,
                        ChildCount: childCount,
                        ChildTuanAmount: childPrice,
                        ProductType: productType,
                        SupplierFlag: supplierFlag,
                        Score: score,
                        Voucher: voucher
                    };
                    $.post("/ashx/ashxPreferential2.ashx", param, function (data) {
                        var jsonResult = JSON.parse(data);
                        if (jsonResult.Result) {
                            window.document.forms["Manager_one3_form"].submit();
                        }
                        else {
                            $('.body_shade').show();
                            $('.body_shade_show').show();
                        }
                    });
                }
                else {
                    window.document.forms["Manager_one3_form"].submit();
                }
            }
            else {
                window.document.forms["Manager_one3_form"].submit();
            }
        }
        else {

        }
    }
}
function closeTip() {
    $(".body_shade").hide();
    $(".body_shade_show").hide();
    $(".storage").hide();
}
//var submiting = false;
// 表单校验
function checkForm() {
    //    if (submiting) {
    //        console.info('submiting...');
    //        return false;
    //    }
    var payAmount = parseFloat($('#spanPayAmount').html()) || 0;
    if (payAmount <= 0) {
        alert('订单金额必须大于0');
        return false;
    }
    var result = true;

    

    // 保险份数验证
    var order = new Common().getOrder();
    var personCount = order.adultCount + order.childCount;
    var insuranceValidate = true;
    var insuranceCount = 0;
    $("ul[id^='attachment_']").each(function () {
        var attachmentCount = parseInt($(this).find('span[id="attachmentCount"]').html(), 10) || 0; // 保险份数
        var attachmentType = $(this).find("input[type='hidden'][id='attachmentType']").val(); // 类型(0=单房差，1=保险，2=境外参, 3=其他附加产品)
        if (attachmentType == 1) {
            insuranceCount += attachmentCount;
        }
    });
    // 当前保险选择的份数不能大于订单总人数
    if (insuranceCount > personCount) {
        insuranceValidate = false;
        $(this).find("input[type='hidden'][id='attachmentType']").focus();
        alert("选择的保险份数不能大于订单总人数！");
        $('#insurance').first().parent().find('span').focus();
    }
    // 联系人验证
    var contactNameValidate = contactValidate($('#txt_name'));
    var contactMobileValidate = contactValidate($('#txt_mobile'));
    var contactValidateResult = contactNameValidate && contactMobileValidate;

    // 验证结果
    result = insuranceValidate && contactValidateResult;
    if (result) {
        // 将联系人信息放在隐藏域中
        var contactMan = $.trim($('#txt_name').val());
        var contactMobile = $.trim($('#txt_mobile').val());
        $("#txtHiddenLinker").val(contactMan + "^" + contactMobile + "^^");
        // 将附加产品信息放在隐藏域中
        var attachmentInfo = new Attachment().getAttachmentInfo();
        $("#txtSubmitHiddenAdd").val(attachmentInfo);

        //submiting = true;
        //$('.body_shade').show();
        //$('.storage').show();
    }
    else {
        //$('.body_shade').hide();
        //$('.storage').hide();
    }
    return result;
}