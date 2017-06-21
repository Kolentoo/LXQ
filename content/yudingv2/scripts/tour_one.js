
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
/*提交表单 & “快速登录”回调*/
/*function buySubmit() {
    //提交表单
    //$.md({ modal: "#loadingDiv" });
    $uzpermission.success(function () {
        //国双统计代码
        typeof _gsq != "undefined" && _gsq.push(["T", "GWD-002793", "track", "/targetpage/pc/tijiaodingdan"]);
        typeof _gsq != "undefined" && _gsq.push(["T", "GWD-002793", "trackEvent", "预订页面", "填写订单", "提交订单"]);
        location.reload();
    })
        .error(function (err) {

        })
        .start();

}*/

function activityValidate() {
    var result = checkForm();
	/*var phone = $.trim($("#txt_mobile").val());
	 //异常情况，继续下单
    _uzw.user.refresh();
	if (_uzw.user.userid < 0 || _uzw.user.userid==='') {
		  _uzw.iframe.pop("https://u.uzai.com/QuickLogin?actionName=buySubmit&tel=" + phone, 640, 315); //跳转到快速登录
		  return;
	}*/
    if (result) {
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
                        supplierFlag = "43";//众信外采
                    }
                    else {
                        supplierFlag = "41";//众信自营
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
                $.post("/ashx/ashxPreferential.ashx", param, function (data) {
                    var jsonResult = JSON.parse(data);
                    if (jsonResult.Result) {
                        //window.document.forms["one_form"].submit();
                        dosubmit();
                    }
                    else {
                        $('.body_shade').show();
                        $('.body_shade_show').show();
                    }
                });
            }
            else {
                //window.document.forms["one_form"].submit();
                dosubmit();
            }
        }
        else {
            //window.document.forms["one_form"].submit();
            dosubmit();
        }
    }
    else {

    }
}

function dosubmit() {
    $('.body_shade').hide();
    $('.storage').hide();
    $uzpermission.success(function () {
        $('.body_shade').show();
        $('.storage').show();
        window.document.forms["one_form"].submit();
    }).error(function (err) {
        //未登录还是让他提交
        if (err && err["PermissionType"] == -100) {
            $('.body_shade').show();
            $('.storage').show();
            window.document.forms["one_form"].submit();
        }
    }).close(function () {

    })
        .start();

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
        var attachmentCount = parseInt($(this).find('span[id="attachmentCount"]').html(), 10) || 0;// 保险份数
        var attachmentType = $(this).find("input[type='hidden'][id='attachmentType']").val();// 类型(0=单房差，1=保险，2=境外参, 3=其他附加产品)
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

//下单权限验证
var $uzpermission = (function (w) {
    var __permissionorder = function () {

    }
    __permissionorder.prototype.init = function () {
        this.__setviewcontainer($("#j_popTipsBox_orderpermission"));
        this.__set$ajaxcallback(function (err, data) {
            if (err !== null) {
                this.$errorcallback(err);
                return;
            }
            var permissionType = data["PermissionType"];
            if (permissionType === 10) {
                this.__viewcoder();
            }
            else if (permissionType === 100) {
                this.__viewhourdefeat();
                this.$errorcallback(data);
            }
            else if (permissionType === 1000) {
                this.__viewdaydefeat();
                this.$errorcallback(data);
            }
            else if (permissionType === 9999) {
                this.$errorcallback(data);
            }
            else if (permissionType === -100) {
                this.$errorcallback(data);
            } else {
                this.$successcallback(null, data);
            }
        });
    }
    //设置容器
    __permissionorder.prototype.__setviewcontainer = function (container) {
        this.$container = $(container);
    };
    //设置回调
    __permissionorder.prototype.__set$ajaxcallback = function (callback) {
        this.$callback = callback
    };
    //成功回调
    __permissionorder.prototype.__set$ajaxsuccesscallback = function (callback) {
        this.$successcallback = callback;
    }
    //失败回调
    __permissionorder.prototype.__set$ajaxerrorcallback = function (callback) {
        this.$errorcallback = callback;
    }
    //关闭回调
    __permissionorder.prototype.__set$close = function (callback) {
        this.$close = callback;
    }

    //设置调用
    __permissionorder.prototype.__$ajax = function () {
        var _this = this;
        $.ajax({
            url: '/OrderPermission',
            type: "post",
            success: function (data) {
                if (data && data["PermissionType"] === 0) {
                    _this.$callback.apply(_this, [null, data]);
                } else {
                    _this.$callback.apply(_this, [null, data]);
                }
            },
            error: function (msg) {
                _this.$callback.apply(_this, msg);
            }
        });
    };
    //---显示dialog
    __permissionorder.prototype.__showdialog = function () {
        _uzw.ui.pop("j_popTipsBox_orderpermission", null, null, this.$close);
    }
    //--显示验证码
    __permissionorder.prototype.__viewcoder = function () {
        var _this = this;
        var span, input, img, span1, span2;
        this.$container.find(".cont-text").html('');
        this.$container.find(".cont-text").text("由于您下单过于频繁，请输入验证码后提交订单。");
        this.$container.find(".bar-inner").html('');
        span = $("<span>", { "class": "tb-wrap" });
        input = $("<input>", { "class": "textbox code-bar", "name": "txtUzPassCode", id: "txtUzPassCode", "maxlength": "4" });
        span.append(input);
        span.append($("<span>", { "class": "info hide", "style": "display:none;" }));

        span1 = $("<span>", { "class": "change change-code pointer" });
        img = $("<img>", { "src": "/acode", "alt": "看不清，换一张", "onclick": "javascript: this.src = '/acode?' + Math.random()" });
        span1.append(img);
        span2 = $("<span>", { "class": "blue ml10 vm", "onclick": "javascript:$(this).siblings('img').click();", "text": "换一张" });
        span1.append(span2);
        //span.append(span1);
        this.$container.find(".bar-inner").append(span);
        this.$container.find(".bar-inner").append(span1);

        input = $("<input>", { "type": "button", "class": "btn-item yahei", value: "提交" });
        input.on("click", function () {
            _this.__validatecaptcha(function (err, result) {
                _this.$container.find(".info").text('');
                _this.$container.find(".info").css({ "display": "none" });
                if (result === true || result === "true") {
                    _this.$container.find(".info").addClass("hide");
                    _this.$container.find(".info").css({ "display": "block" });
                    _this.hide();
                    //成功回调 提交表单
                    _this.$successcallback();
                } else if (err !== null) {

                } else {
                    _this.$container.find(".info").css({ "display": "block" });
                    _this.$container.find(".info").removeClass("hide");
                    _this.$container.find(".info").text('验证码输入错误!');
                    _this.$container.find("#txtUzPassCode").val('');
                    _this.$container.find("#txtUzPassCode").focus();
                    img.click();
                }
            });
        });
        this.$container.find(".btn-bar").html('');
        this.$container.find(".btn-bar").append(input);

        this.__showdialog();
    }
    __permissionorder.prototype.__validatecaptcha = function (callback) {
        $.ajax({
            url: "/CheckValidateCode",
            type: 'POST',
            data: { code: $("#txtUzPassCode").val().trim().toLowerCase() },
            success: function (data) {
                data = (data || "").toLowerCase();
                callback(null, data);
            },
            error: function (data) {
                callback(data);
            }
        })
    }
    //--一小时黑名单
    __permissionorder.prototype.__viewhourdefeat = function () {
        var _this = this;
        var span, input, img, span1, span2;
        this.$container.find(".cont-text").html('');
        this.$container.find(".cont-text").text("由于您下单过于频繁，1小时内已被禁止下单。如有疑问请致电" + _hotline);
        this.$container.find(".bar-inner").html('');

        this.$container.find(".btn-bar").html('');
        this.$container.find(".btn-bar").append($("<input>", { "type": "button", "value": "关闭", "class": "btn-item yahei j_popClose" }));

        this.__showdialog();
    }
    //--24小时黑名单
    __permissionorder.prototype.__viewdaydefeat = function () {
        var _this = this;
        var span, input, img, span1, span2;
        this.$container.find(".cont-text").html('');
        this.$container.find(".cont-text").text("由于您下单过于频繁，24小时内已被禁止下单。如有疑问请致电" + _hotline);
        this.$container.find(".bar-inner").html('');

        this.$container.find(".btn-bar").html('');
        this.$container.find(".btn-bar").append($("<input>", { "type": "button", "value": "关闭", "class": "btn-item yahei j_popClose" }));

        this.__showdialog();
    }

    //权限验证开始
    __permissionorder.prototype.start = function () {
        this.__$ajax();
        return this;
    }
    //权限验证结束调用
    __permissionorder.prototype.success = function (callback) {
        this.__set$ajaxsuccesscallback(callback);
        return this;
    }
    //异常时候调用
    __permissionorder.prototype.error = function (callback) {
        this.__set$ajaxerrorcallback(callback);
        return this;
    }
    //关闭窗体调用
    __permissionorder.prototype.close = function (callback) {
        this.__set$close(callback);
        return this;
    }
    //隐藏
    __permissionorder.prototype.hide = function () {
        this.$container.find(".j_popClose").click();
    }

    var _obj = new __permissionorder();

    return _obj;
})(window);

$(function () {
    $uzpermission.init();
});