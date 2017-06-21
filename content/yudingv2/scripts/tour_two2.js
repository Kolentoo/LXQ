var mobileReg = new RegExp(/^((\(\d{3}\))|(\d{3}\-))?((13|14|17)[0-9]|15[0-9]|18[0-9])\d{8}$/); //手机
var codeReg = new RegExp(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/); //身份证
var hzhaoReg = new RegExp(/^[A-Za-z\d]*$/); //护照
var gangaoReg = new RegExp(/^[A-Za-z]{1,2}\d{7,10}$/); //港澳通行证
var emailReg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/); //邮箱
var phoneReg = new RegExp(/^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/); //固定电话
var dataeReg = new RegExp(/^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20])([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/); //日期
var nameReg = new RegExp(/^[A-Za-z\u4E00-\u9FA5\_\＿\/]+$/); //姓名【字母，中文，下划线，反斜线】

/*解决IE8 数组不支持indexOf方法*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                  this[from] === elt)
                return from;
        }
        return -1;
    };
}
$('#infoDiv').find("input[type='text'],select").blur(function () {
    var res = true;
    var e = $(this);
    removeError(e);
    if ($(e).is("input")) {
        res = checkInput(e);
    }
    if (res) {
        $(e).removeClass("blur");
        removeError($(e));
    }
});
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
        $(e).removeClass('error');
        $(e).removeClass('blur');
    });
}
function removeError(e) {
    $(e).parent().find("div[class='error_entry']").remove();
    //var className = $(e).attr("class");
    //className = className.replace(/ error/, "");
    //$(e).attr('class', className);
    $(e).removeClass('error');
}

var submiting = false;
function checkForm() {
    if (submiting) {
        console.info('submiting...');
        return false;
    }
    var flag = true;
    try {
        // 先移除所有错误提示信息
        $('#infoDiv').find("div[class='error_entry']").remove();
        $('#infoDiv').find("input[type='text']").each(function () {
            removeError($(this));
        });
        $('#infoDiv').find("input[type='text']").each(function () {
            var isVisible = $(this).parents(".fill_main_input").is(":visible");
            if (isVisible) {
                var _res = checkInput($(this));
                if (!_res) {
                    flag = _res;
                }
            }
        });
        $('#infoDiv').find("select").each(function () {
            var isVisible = $(this).parents(".fill_main_input").is(":visible");
            if (isVisible) {
                var _res = checkSelect($(this));
                if (!_res) {
                    flag = _res;
                }
            }
        });
        if (flag) {
            flag = checkRepeat();
        }
    }
    catch (err) {
        console.info("error:" + err.message);
        flag = false;
    }
    if (flag) {
        submiting = true;
        $('.body_shade').show();
        $('.storage').show();
    }
    return flag;
}

function checkRepeat() {
    //判断游客是否重名
    var flag = true;
    var names = [];
    $("input[id^='txtRealName']").each(function () {
        var o = $(this);
        if (o.is(":visible")) {
            var ov = $.trim(o.val());
            if (names.indexOf(ov) > -1) {//已存在
                //o.parents(".datalist-wrap").next().text("不能重复");
                showError(o, "不能重复");
                flag = false;
            }
            else {
                names.push(ov);
            }
        }
    });
    var codes = [];
    var codeInputs = $("input[id^='txtCode']");
    $("input[id^='txtCode']").each(function () {
        var o = $(this);
        if (o.is(":visible")) {
            if (o.attr('id').indexOf('txtCodeAddress') < 0) {
                var ov = $.trim(o.val());
                if (codes.indexOf(ov) > -1) {//已存在
                    //o.next().text("不能重复");
                    showError(o, "不能重复");
                    flag = false;
                }
                else {
                    codes.push(ov);
                }
            }
        }
    });
    return flag;
}

function checkSelect(e) {
    var flag = true;
    var required = false;

    var spanNode = $(e).parents(".fill_main_input").first().find(">span");
    if (spanNode.html() == "*") {
        required = true;
    }
    if (required) {
        // 如果下一个节点是span，则说明是必填项
        var val = $(e).find("option:selected").val();
        var _div = $(e).parents("div[class='fill_main_input']").first();
        if (val == "" || val == undefined) {
            _div.append('<div class="error_entry" style="display:block">' + '不能为空' + '</div>');
            flag = false;
            $(_div).find(".section-select").addClass('error');
            // 绑定错误信息关闭按钮事件
            $(_div).find(".error_entry").on('click', function () {
                $(this).parents(".fill_main_input").find(".section-select").removeClass('error');
                $(this).hide();
            });
        }
        else {
            $(_div).find(".section-select").removeClass('error');
            $(_div).find(".error_entry").remove();
        }
    }
    return flag;
}

function checkInput(e) {
    var flag = true;
    var _this = e;
    var required = false;
    var spanNode = $(_this).parent().find("span");
    if (spanNode.html() == "*") {
        required = true;
    }
    if (required) {
        // 如果下一个节点是span，则说明是必填项
        var val = $.trim($(_this).val());
        
        if (val == "" || val == undefined) {
            flag = false;
            showError($(_this), "不能为空");
        }
        else {
            removeError($(_this));
        }
    }
    if (flag == true) {
        var id = $(_this).attr("id");
        var num = getIDNum(id);
        var ctl = getIDStr(id);
        var ov = $.trim($(_this).val());
        var type = $("#type" + num).val(); //游客类型
        var pType = $.trim($("#txtHiddenMType").val()); //产品类型
        var cType = $("#ddlCodeType" + num).val(); //证件类型
        //console.info("ctl:" + ctl + ",游客类型:" + type + ",产品类型:" + pType + ",证件类型:" + cType);
        var input = $(_this);
        //姓名
        console.info("ctl=" + ctl);
        if (ctl == "txtRealName") {
            if (!nameReg.test(ov)) {
                flag = false;
                showError(input, "格式错误");
            }
        }
            //手机号码
        else if (ctl == "txtPhone") {
            if (!mobileReg.test(ov)) {
                flag = false;
                showError(input, "格式错误");
            }
        }
            //生日
        else if (ctl == "txtBirthday") {
            if (!dataeReg.test(ov)) {
                flag = false;
                showError(input, "格式错误");
            }
            else {
                if (pType == "2" || pType == "3") {
                    var bday = $.trim(ov).replace("-", "/").replace("-", "/");
                    var godate = $.trim($("#hiddenGodate").val()).replace("-", "/").replace("-", "/");
                    var dateday = new Date(bday);
                    if (type == "inChild") {//表示儿童
                        var comdateMin = new Date(godate).setFullYear(new Date(godate).getFullYear() - 12);
                        var comdateMax = new Date(godate).setFullYear(new Date(godate).getFullYear() - 2);
                        if (dateday < comdateMin || dateday > comdateMax) {
                            flag = false;
                            showError(input, '年龄错误，不答合成人儿童规定');
                        }
                    } else {//表示成人
                        //国内12岁以下算儿童，以上算成人
                        var comdate = new Date(godate).setFullYear(new Date(godate).getFullYear() - 12);
                        if (dateday > comdate) {
                            flag = false;
                            showError(input, '年龄错误，不答合成人儿童规定');
                        }
                    }
                }
            }
        }
            //证件有效期
        else if (ctl == "txtValiad") {
            if (!dataeReg.test(ov)) {
                flag = false;
                showError(input, "格式错误");
            }
        }
            //证件号码
        else if (ctl == "txtCode") {
            //国内验证
            if (pType == "2" || pType == "3") {
                if (cType == "0") {//选择了身份证
                    if (!codeReg.test(ov)) {
                        flag = false;
                        showError(input, "格式错误");
                    }
                    else {
                        var bday = "";
                        var godate = $.trim($("#hiddenGodate").val()).replace("-", "/").replace("-", "/");
                        var n = 1;
                        if (ov.length == 18) {
                            bday = ov.substr(6, 4) + "/" + ov.substr(10, 2) + "/" + ov.substr(12, 2);
                            n = ov.substring(ov.length - 2, ov.length - 1);
                            $("#txtBirthday" + num).val(ov.substr(6, 4) + "-" + ov.substr(10, 2) + "-" + ov.substr(12, 2)); //从身份证中读取出生年月
                        }
                        else if (ov.length == 15) {
                            bday = "19" + ov.substr(6, 2) + "/" + ov.substr(8, 2) + "/" + ov.substr(10, 2);
                            n = ov.substr(ov.length - 1);
                            $("#txtBirthday" + num).val("19" + ov.substr(6, 2) + "-" + ov.substr(8, 2) + "-" + ov.substr(10, 2)); //从身份证中读取出生年月
                        }
                        $("#ddlSex" + num).val(n % 2); //性别，偶数为女，奇数为男
                        var dateday = new Date(bday);
                        if (type == "inChild") {
                            //表示儿童
                            var comdateMin = new Date(godate).setFullYear(new Date(godate).getFullYear() - 12);
                            var comdateMax = new Date(godate).setFullYear(new Date(godate).getFullYear() - 2);
                            if (dateday < comdateMin || dateday > comdateMax) {
                                flag = false;
                            }
                        }
                        else {
                            //成人
                            var comdate = new Date(godate).setFullYear(new Date(godate).getFullYear() - 12);
                            if (dateday > comdate) {
                                flag = false;
                            }
                        }

                    }
                } //身份证判断
            }
                //出境验证
            else {
                if (cType == "0") {//护照
                    if (!hzhaoReg.test(ov)) {
                        flag = false;
                        showError(input, "格式错误");
                    }
                }
                if (cType == "1") {//港澳通行证
                    if (!gangaoReg.test(ov)) {
                        flag = false;
                        showError(input, "格式错误");
                    }
                }
            }
        }
    }
    return flag;
}

//获取id里的数字
function getIDNum(id) {
    var a = new RegExp("\\d+").exec(id);
    if (a.length > 0)
        return a[0];
    return null;
}
//获取id里的字母
function getIDStr(id) {
    return id.replace(/\d/g, "")
}