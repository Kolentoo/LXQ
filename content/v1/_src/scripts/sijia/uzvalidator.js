/********************************************
Description: validate your inputs .etc by simple way（base on jquery）, it's free, 
             contacts author: ws-ww-01@hotmail.com.
Create Date: 2014-09-02
********************************************/
var UZValidator = function () { };
UZValidator.prototype = {
    idItems: [],
    classNameItems: [],
    promptModel: "",
    init: function (idItems, classNameItems, promptModel) {
        this.idItems = idItems;
        this.promptModel = promptModel;
        this.classNameItems = classNameItems;
    },
    validate: function () {
        var thisIDItems = this.idItems;
        if (thisIDItems) {
            for (var i = 0; i < thisIDItems.length; i++) {
                var item = thisIDItems[i];
                if (item && item.id && item.dataType) {
                    /***检查数据****/
                    if (!checkData(item, this.promptModel)) {
                        return false;
                    }
                    /****检查长度***/
                    if (item.maxLength) {
                        if (!checkMaxLength(item.id, item.maxLength)) {
                            focusElement(item.id);
                            showPrompt(this.promptModel, item.showName + "长度不能超过" + item.maxLength);
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
};
/****数据类型****/
var DataType = { String: "string", Number: "number", Datetime: "datetime", Mobile: "mobile", Email: "email" };
/*****提示方式*******/
var PromptModel = { DefaultAlert: "alert", Append: "append", Custom: "custom" };
/*****验证数据***********/
var checkData = function (vitem, promptModel) {
    var rt = false;
    var v = $("#" + vitem.id).val().trim();
    if (vitem.dataType === DataType.String) {
        rt = checkString(v);
        if (!rt) {
            focusElement(vitem.id);
            showPrompt(promptModel, vitem.showName + "不能为空");
        }

    } else if (vitem.dataType === DataType.Number) {
        rt = checkNumber(v);
        if (!rt) {
            if (!rt) {
                focusElement(vitem.id);
                showPrompt(promptModel, vitem.showName + "不能为空或格式不正确");
            }
        }
        else {
            if (vitem.minValue) {
                vitem.minValue = Number(vitem.minValue) | 0;
                if (Number(v) < vitem.minValue) {
                    rt = false;
                    focusElement(vitem.id);
                    showPrompt(promptModel, vitem.showName + "数值不能小于规定值");
                }
            }
        }
    }
    else if (vitem.dataType === DataType.Datetime) {
        rt = checkDatetime(v);
        if (!rt) {
            focusElement(vitem.id);
            showPrompt(promptModel, vitem.showName + "不能为空或格式不正确");
        }
    }
    else if (vitem.dataType === DataType.Mobile) {
        rt = checkMobile(v);
        if (v.length != 11 || !rt) {
            focusElement(vitem.id);
            showPrompt(promptModel, vitem.showName + "必须为11位中国大陆手机号格式");
        }
    }
    else if (vitem.dataType === DataType.Email) {
        rt = checkEmail(v);
        if (!rt) {
            focusElement(vitem.id);
            showPrompt(promptModel, vitem.showName + "为不合格的邮箱格式");
        }
    }
    return rt;
};
/*****验证字符类型************/
var checkString = function (v) {
    var rt = false;
    if (v && v.trim().length) {
        rt = true;
    }
    return rt;
};
/*****验证数字类型************/
var checkNumber = function (v) {
    var rt = false;
    if (v.trim()  && typeof (v) !== "boolean" && !isNaN(v)) {
        rt = true;
    }
    return rt;
};
/*****验证时间类型***********************/
var checkDatetime = function (dateStr) {
    if (!dateStr) {
        return false;
    }
    dateStr = dateStr.replace(/-/g, "/");
    var d = new Date(dateStr);
    if (isNaN(d)) return false;
    var arr = dateStr.split("/");
    return ((parseInt(arr[0], 10) == d.getFullYear()) && (parseInt(arr[1], 10) == (d.getMonth() + 1)) && (parseInt(arr[2], 10) == d.getDate()));
};
var checkMobile = function (v) {
    var mobileEx = /1\d{10}/gi;
    return mobileEx.test(v);
};
var checkEmail = function (v) {
    var emailEx = /[a-zA-Z0-9_\.\-]+\@[a-zA-Z0-9_\.\-]+/gi;
    return emailEx.test(v);
};
/******检查长度**************/
var checkMaxLength = function (id, len) {
    var rt = false;
    if (id && len && !isNaN(len)) {
        var v = $("#" + id).val().trim();
        if (v.length <= Number(len)) {
            rt = true;
        }
    }
    return rt;
};
/******提示***************/
var showPrompt = function (promptModel, msg) {
    if (promptModel === PromptModel.DefaultAlert) {
        if (msg) {
            alert(msg);
        }
    }
};
var focusElement = function (id) {
    if (id) {
        $("#" + id).focus();
    }
};
//String Trim
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};

String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};