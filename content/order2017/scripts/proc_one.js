
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
            url: '//buy.uzai.com/outbound/OrderPermission',
            type: "post",
            beforeSend: function () {
                // bookLoading.show();
            },
            complete: function () {
                /// bookLoading.hide();
            },
            success: function (data) {
                window.setTimeout(function () {
                    if (data && data["PermissionType"] === 0) {
                        _this.$callback.apply(_this, [null, data]);
                    } else {
                        _this.$callback.apply(_this, [null, data]);
                    }
                }, 50);

            },
            error: function (msg) {
                _this.$callback.apply(_this, msg);

            }
        });
    };
    //---显示dialog
    __permissionorder.prototype.__showdialog = function () {

    }
    //--显示验证码
    __permissionorder.prototype.__viewcoder = function () {
        var _this = this;


        popupTips('j_popupTips6', {
            popupBefore: function (obj) {

                var hdText = '提示';
                var bdNode =
                    '<p class="tips-cont f999 f14 tc">由于您下单过于频繁，请输入验证码后提交订单。</p>' +
                    '<div class="in-list">' +
                    '<p class="input-bar">' +
                    '<span class="bar-inner">' +
                    '<span class="tb-wrap">' +
                    '<input type="text" class="textbox code-bar  "   id="txtUzPassCode" maxlength="4">' +
                    '<span class="info hide"></span>' +
                    '</span>' +
                    '<span class="change change-code pointer">' +
                    '<img src="//buy.uzai.com/outbound/acode" alt="看不清，换一张" onclick="javascript: this.src = \'//buy.uzai.com/outbound/acode?\' + Math.random()" />' +
                    '<span class="blue f14 ml10 vm" onclick="javascript:$(this).siblings(\'img\').click();">换一张</span>' +
                    '</span>' +
                    '</span>' +
                    '</p>' +
                    '<div class="label-tips clearfix hide" data-infoNull="请输入图形验证码" data-infoError="请输入正确的图形验证码">' +
                    '<i class="book-icon3 png fl"></i>' +
                    '<p class="p1 fl"></p>' +
                    '</div>' +
                    '</div>' +
                    '<p class="btn-bar tc"><a href="javascript:void(0)" class="btn-focus todosubmit">提交</a></p>';
                obj.find('.popup-hd').find('.hd-cont').text(hdText);
                obj.find('.popup-bd').html(bdNode);
                _this.$container = $(obj);

                $(obj).find(".todosubmit").click(function () {
                    obj.hide();
                    _this.__validatecaptcha(function (err, result) {
                        _this.$container.find(".label-tips p").text('');
                        _this.$container.find(".label-tips").css({ "display": "none" });
                        _this.$container.find(".label-tips").addClass("hide");

                        if (result === true || result === "true") {
                            _this.$container.find(".label-tips").addClass("hide");
                            _this.$container.find(".label-tips").css({ "display": "block" });

                            _this.hide();
                            $("input[name=txtUzPassCode]").val($("#txtUzPassCode").val());
                            //成功回调 提交表单
                            _this.$successcallback();
                        } else if (err !== null) {

                        } else {
                            obj.show();
                            _this.$container.find(".label-tips").css({ "display": "block" });
                            _this.$container.find(".label-tips").removeClass("hide");
                            _this.$container.find(".label-tips p").text('验证码输入错误!');

                            _this.$container.find("#txtUzPassCode").val('');
                            _this.$container.find("#txtUzPassCode").focus();
                            _this.$container.find(".in-list img").click();
                        }
                    });
                });
            }
        });
    }


    __permissionorder.prototype.__validatecaptcha = function (callback) {
        $.ajax({
            url: "//buy.uzai.com/outbound/CheckValidateCode",
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

        popupTips('j_popupTips6', {
            popupBefore: function (obj) {
                var hdText = '提示';
                var bdNode =
                    '<p class="tips-cont f999 f14 tc">由于您下单过于频繁，1小时内已被禁止下单。如有疑问请致电' + _hotline + '</p>';
                obj.find('.popup-hd').find('.hd-cont').text(hdText);
                obj.find('.popup-bd').html(bdNode);
            }
        });

    }
    //--24小时黑名单
    __permissionorder.prototype.__viewdaydefeat = function () {
        var _this = this;
        var span, input, img, span1, span2;

        popupTips('j_popupTips6', {
            popupBefore: function (obj) {

                var hdText = '提示';
                var bdNode =
                    '<p class="tips-cont f999 f14 tc">由于您下单过于频繁，24小时内已被禁止下单。如有疑问请致电' + _hotline + '</p>';
                obj.find('.popup-hd').find('.hd-cont').text(hdText);
                obj.find('.popup-bd').html(bdNode);
            }
        });
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

//价格验证
var $uzpricevalidator = (function (w) {
    var __pricevalidator = function () { };

    __pricevalidator.prototype.__success = function (data) {
        if (data == 1) {
            this.showerror();
        } else {
            this.ajaxsuccesscallback();
        }
    }

    __pricevalidator.prototype.__error = function (data) {
        this.ajaxerrorcallback();
    }


    __pricevalidator.prototype.start = function () {
        this.__$ajax();
        return this;
    }
    __pricevalidator.prototype.success = function (callback) {
        this.ajaxsuccesscallback = callback;
        return this;
    }

    __pricevalidator.prototype.error = function (callback) {
        this.ajaxerrorcallback = callback;
        return this;
    }

    __pricevalidator.prototype.showerror = function () {
        var _this = this;
        var span, input, img, span1, span2;

        window.setTimeout(function () {
            popupTips('j_popupTips9', {
                popupBefore: function (obj) {
                    var hdText = '提示';
                    var bdNode = '<p class="tips-cont f999 f14 tc">当前产品价格已发生变动</p>';
                    var ftNode =
                        '<p class="ft-btn-bar f14 tc clearfix">' +
                        '<a href="http://www.uzai.com/tours/' + $("#txtHiddenPId").val() + '.html" class="btn-item deputy-item f999">重新选择</a>' +
                        '<span class="btn-item focus-item f666 j_popupClose carryongo ">继续预定</span>' +
                        '</p>';
                    obj.find('.popup-hd').find('.hd-cont').text(hdText);
                    obj.find('.popup-bd').html(bdNode);
                    obj.find('.popup-ft').html(ftNode);
                    $(".carryongo").one("click", function () {
                        _this.ajaxsuccesscallback();
                    });
                }
            });
        }, 200)

    }
    //查询价格变动
    __pricevalidator.prototype.__$ajax = function () {
        var _this = this;
        var url = '//buy.uzai.com/outbound/PriceValidate/' + $("#txtHiddenPId").val() + "/" + $("#txtHiddenGoDate").val() + "/" + $("#txtHiddenUzaiPrice").val() + "/" + $("#txtHiddenChildPrice").val()
        $.ajax({
            url: url,
            type: "post",
            beforeSend: function () {
                // bookLoading.show();
            },
            complete: function () {
                // bookLoading.hide();
            },
            success: function (data) {
                _this.__success(data)
            },
            error: function (msg) {
                _this.__error(msg)
            }
        });

    }
    return new __pricevalidator();
})(window);

function mobileencode(mobile, callback) {
    //重复订单判断 是否继续下单
    //由于不能限制输入手机号码，所以加密手机号，防止通过接口批量操作，增加主站越权查看其他用户已有订单这个漏洞的操作复杂度
    $.ajax({
        type: "POST",
        url: "//buy.uzai.com/ashx/ashxEncodeMobile.ashx?ran=" + Math.random(),
        data: { "mobile": mobile },
        success: function (msg) {
            callback(msg);
        }
    });
}

/*Ajax查看是否存在重复订单v1*/
function ajax_repeat_ordersv1(mobile, callback) {
    mobileencode(mobile, function (msg) {
        if (msg) {
            $.ajax({
                type: "POST",
                url: "//buy.uzai.com/ashx/ashx0010.ashx?type=2&mobile=" + msg + "&ran=" + Math.random(),
                beforeSend: function () {

                },
                complete: function () {

                },
                error: function () {
                    callback();
                },
                success: function (msg) {
                    if (msg && msg != "") {
                        if (msg != "success") {
                            //弹出重复下单的提示【已经存在重复订单】
                            $("#hiddenOrderStr").val(msg);
                            display_repeat_divv1(callback);
                        }
                        else {
                            //没有重复订单的情况
                            callback(null, true);
                        }
                    }
                    else {
                        //提交表单
                        callback(null, true);
                    }
                } //返回
            });                      //end ajax
        }
    });
}
//**显示重复下单提示层v1**//
function display_repeat_divv1(callback) {
    popupTips('j_popupTipsOrderOld', {
        popupBefore: function (obj) {
            var orderstr = $("#hiddenOrderStr").val();
            var orderStrArr = orderstr.split(",");
            var orderhtml = '';
            $.each(orderStrArr, function (i, item) {
                var orderArr = item.split("^");
                orderhtml += '<li class="order-item clearfix">' +
                    '<div class="cell-item radio-list cell1  ' + (i == 0 ? "radio-on" : "") + ' ">' +
                    '<div class="choose radio-wrap choose-wrap">' +
                    '<div class="icon-item png"></div>' +
                    '<input type="radio" class="order-radio radio-item" name="order" ' + (i == 0 ? "checked=checked" : "") + ' value="' + orderArr[0] + '" >' +
                    '</div>' +
                    '<span class="oredr-num">' + orderArr[1] + '</span>' +
                    '</div>' +
                    '<div class="cell-item cell2"><a href="http://sh.uzai.com/tour-' + orderArr[4] + '.html" class="route-name ellipsis block f666" title="' + orderArr[2] + '"  target="_blank">' + ((orderArr[2].length > 12) ? orderArr[2].substr(0, 12) + "..." : orderArr[2]) + '</a></div>' +
                    '<div class="cell-item cell3">' + orderArr[3] + '</div>' +
                    '</li>';
            });


            var hdText = '温馨提示';
            var bdNode =
                '<p class="tips-cont f999 f14 tc">您有未出行订单</p>' +
                '<ul class="order-table f666 f14">' +
                orderhtml +
                '</ul>';
            var ftNode =
                '<p class="ft-btn-bar f14 tc clearfix">' +
                '<input type="button" value="修改原订单" class="btn-item deputy-item f999 yahei btncancel"  >' +
                '<input type="button" value="我要强行下单" class="btn-item focus-item f666 yahei btnedit j_popupClose">' +
                '</p>';
            obj.addClass('popup-not-travel').find('.popup-hd').find('.hd-cont').text(hdText);
            obj.find('.popup-bd').html(bdNode);
            obj.find('.popup-ft').html(ftNode);

            obj.find(".btncancel").on("click", function () {
                var o = obj.find(".radio-on").find("input[type=radio]");
                var v = o.val();
                window.open("https://u.uzai.com/manage/order_details/" + $.trim(v));
            });
            obj.find(".btnedit").on("click", function () {
                callback(null, true);
            });
        },
        popupAfter: function (obj) {
            var oh = obj.outerHeight() / 2;
            obj.css({ 'margin-top': -oh });
        }
    });
}

//是否存在库存
function Instockv1(callback) {
    $.ajax({
        url: "//buy.uzai.com/ashx/ashxImmCutCheck.ashx?pid=" + $("#txtHiddenPId").val() + "&godate=" + $("#txtHiddenGoDate").val() + "&supplierflag=" + $("#hidSupplierFlag").val(),
        type: 'get',
        dataType: 'jsonp',
        data: {},
        success: function (data) {
            var paytype, cutval;
            try {
                cutval = data.val;
                paytype = data.paytype;

            } catch (e) {
                cutval = data;
            }
            var cut = cutval;

            var num = parseInt($("#txtHiddenNums").val());
            if (cut >= num || cut == -1 || paytype != 1) {
                callback(null, true);
            } else {
                popupTips('j_popupTips', {
                    popupBefore: function (obj) {
                        var hdText = '提示';
                        var bdNode =
                            '<p class="tips-cont f999 f14 tc">当前产品余位不足，无法预定</p>' +
                            '<p class="btn-bar tc"><a href="http://www.uzai.com/tour-' + $("#txtHiddenPId").val() + '.html" class="btn-deputy">返回产品页</a></p>';
                        obj.find('.popup-hd').find('.hd-cont').text(hdText);
                        obj.find('.popup-bd').html(bdNode);
                    }
                });
            }
        },
        error: function () {
            callback();
        }
    });
}


var $uzaiattachEx = (function (w) {
    var _uzaiattachEx = function () {

    };
    //验证 排他逻辑
    _uzaiattachEx.prototype.valExclusive = function (obj) {
        obj = $(obj);
        var ul = obj.closest("tr");
        var relationId = ul.attr("data-did").replace("tr_", "");
        var addProductTypeId = $("#txtHiddenAddProductTypeId_" + relationId).val(); //附加产品类型
        var personNums = parseInt(obj.closest("td").find("#attachmentCount").val().trim()); //购买份数
        var pNames = [$("#txtHiddenAddProductName_" + relationId).val()];
        /******优惠产品排他性判断********/
        if (addProductTypeId == 11 || addProductTypeId == 16 || addProductTypeId == 19) {
            var isExc = $("#txtHiddenIsExclude_" + relationId).val();
            if (isExc == 1 && personNums > 0) {//表示当前选择的是排他性限制并且购买分数>0
                //网订立减、专享特惠等产品排他性判断        
                if (addProductTypeId == 11 || addProductTypeId == 16 || addProductTypeId == 19) {
                    var isExc = $("#txtHiddenIsExclude_" + relationId).val();
                    if (isExc == 1 && personNums > 0) {//表示当前选择的是排他性限制并且购买分数>0
                        //网订立减、专享特惠等产品排他性判断        

                        var k = 0;
                        $("input[id^='txtHiddenAddProductTypeId_'][value='11'],input[id^='txtHiddenAddProductTypeId_'][value='16'],input[id^='txtHiddenAddProductTypeId_'][value='19']").each(function () {
                            var AddProdcutId = $(this).attr("id");
                            var AddRelationID = AddProdcutId.substr(AddProdcutId.lastIndexOf("_") + 1); //关系Id，不重复
                            if (relationId == AddRelationID) {
                                return;
                            }
                            var pul = $(this).closest("tr");
                            var choiceVal = parseInt(pul.find("#attachmentCount").val().trim());//已经选择的值

                            var IsExclude = $("#txtHiddenIsExclude_" + AddRelationID).val(); //排他性
                            if (IsExclude == 1) {
                                if (choiceVal > 0) {
                                    k++;
                                }
                                // pNames += $("#txtHiddenAddProductName_" + AddRelationID).val() + "、";
                                pNames.push($("#txtHiddenAddProductName_" + AddRelationID).val());
                            }
                        });
                        if (k >= 1) {
                            if (pNames.length > 0) {
                                alert("优惠项" + pNames.join(",") + "不能同时享受，敬请谅解！");
                                /*重新选择0份*/
                                window.setTimeout(function () {
                                    ul.find("#attachmentCount").val("0");
                                    ul.find(".btn-up").removeClass("btn-off");
                                    ul.find(".btn-down").addClass("btn-off");
                                    ul.find(".btn-down").trigger("click");
                                });
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
        /*******优惠产品排他性判断End*******/

    };

    //初始化附加产品默认值（选择份数）及是否显示的控制
    _uzaiattachEx.prototype.defaultProductSet = function () {
        var person = parseInt($("#txtHiddenPersonNum").val()); //成人数
        var child = parseInt($("#txtHiddenChildNum").val()); //儿童数
        //循环的是适用人群
        $("input[id^='txtHiddenIsUserPersonType_']").each(function () {
            var id = $(this).attr("id");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var ValuationType = $("#txtHiddenValuationType_" + relationId).val(); //计价方式
            var default_nums = 0; //按行人数计价默认值
            var default_order_nums = 0; //按订单数计价默认值
            var user_Pserson_Type = $(this).val(); //适用人群 0->通用,1->成人,2->儿童
            if (ValuationType == 0)//按照订单数计价方式
            {
                //如果是按照订单数计价，就一定要设置该附加产品为“包含”(防止后台没有设置)
                //$("#txtHiddenAddProductIncludeEnable_" + relationId).val(1); //一定要包含
                default_order_nums = $("#txtHiddenValuationType_Nums_" + relationId).val(); //按照订单数计价【必须买几份】

            }
            else {
                //按照行人数计价
                var valuationType_Parameter = parseInt($("#txtHiddenValuationType_Parameter_" + relationId).val()); //设置X人/份
                var valuationType_MinNums = parseInt($("#txtHiddenValuationType_MinNums_" + relationId).val()); //计价方式生效的最小值
                var valuationType_MaxNums = parseInt($("#txtHiddenValuationType_MaxNums_" + relationId).val()); //计价方式生效的最大值
                var sum_personNums = 0; //通用：成人+儿童
                if (user_Pserson_Type == 0) {
                    sum_personNums = person + child; //通用：儿童+成人【儿童也当成人看】
                }
                else if (user_Pserson_Type == 1) {
                    sum_personNums = person; //成人：只看成人数是否在规定范围内
                }
                else if (user_Pserson_Type == 2) {
                    sum_personNums = child; //儿童：只看成人数是否在规定范围内
                }
                if (!(sum_personNums >= valuationType_MinNums && sum_personNums <= valuationType_MaxNums)) {
                    //不在规定的计价范围内
                    $("tr[data-did=tr_" + relationId + "]").css("display", "none"); //隐藏
                }
                else {
                    $("tr[data-did=tr_" + relationId + "]").css("display", ""); //清掉样式
                    if ($("#txtHiddenAddProductName_" + relationId).val() == "人等优惠") {
                        default_nums = 1;
                    }
                    else {
                        if (sum_personNums % valuationType_Parameter == 0) {
                            default_nums = sum_personNums / valuationType_Parameter; //取整数
                        }
                        else {
                            //如果是专享特惠、网订立减、银行活动则向下取整，比如买二送一，如果是三人则返回一个
                            if ($("#txtHiddenAddProductTypeId_" + relationId).val() == "11" || $("#txtHiddenAddProductTypeId_" + relationId).val() == "16" || $("#txtHiddenAddProductTypeId_" + relationId).val() == "19") {
                                default_nums = Math.floor(sum_personNums / valuationType_Parameter); //向下取整数
                            } else {
                                default_nums = Math.ceil(sum_personNums / valuationType_Parameter); //向上取整数
                            }
                        }
                    }
                }
            }
            //将默认值保存到隐藏域中
            $("#txtHiddenDefaultNums_" + relationId).val(default_nums);
            $("#txtHiddenDefaultOrderNums_" + relationId).val(default_order_nums);


            var tr = $(this).closest("tr");
            tr.find(".j_bookNum").attr("data-maxnum", default_nums);


        });
    }
    //初始化所有的份数都从0开始到出行人数及默认值
    _uzaiattachEx.prototype.defaultnumsset = function (notCouponAddition) {
        ApplyDateSet(); //补充单价
        var arrayCheapPrice = new Array(); //排他性单价的数组
        var arrayCheapId = new Array(); //排他性控件Id的数组
        var k = 0;
        $("[name=attachmentCount]").each(function () {
            var id = $(this).closest("tr").attr("data-did");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var addProductTypeId = $("#txtHiddenAddProductTypeId_" + relationId).val(); //附加产品类型

            //宝钢的优惠取消使用优惠券时调用重新选择优惠的附加产品不包含其它的附加产品
            if ((addProductTypeId != 16 && addProductTypeId != 11 && addProductTypeId != 19) && notCouponAddition) {
                return true;
            }

            var addName = $("#txtHiddenAddProductName_" + relationId).val();
            if ($("#attachment_" + relationId).css("display") == "none") { //如果附加产品隐藏了直接下一个
                if (addName != "总价优惠")
                    $(this).val('0')
                return true;
            }
            //清除原来的
            if (addName != "总价优惠")
                $(this).val('0')
            var personnums = $("#txtHiddenNums").val();
            //出行天数
            var days = $("#txtHiddenDays").val();
            //判断该附加产品是否是“必买品[包含]”，如果是的话就显示出行人数，否则可以选择购买人数//
            var includeEnable = $("#txtHiddenAddProductIncludeEnable_" + relationId).val(); //获取是否包含的值
            var valuationType = $("#txtHiddenValuationType_" + relationId).val(); //计价方式【1->按照行人数计价，0->按照订单数计价】
            var defaultNums = $("#txtHiddenDefaultNums_" + relationId).val(); //按照行人数的默认值
            var defaultOrderNums = $("#txtHiddenDefaultOrderNums_" + relationId).val(); //按照订单数计价
            var isUserPersonType = $("#txtHiddenIsUserPersonType_" + relationId).val(); //适用人群 0->通用,1->成人,2->儿童 
            if (addProductTypeId == 20) {//如果选择了wifi设备租赁，那么后台设置的使用人群、是否强制包含、计价方式都是无效的
                //要么买整个行程的，要么不买
                // $(this).append("<option value=\"0\">0</option>");
                // $(this).append("<option value=\"" + days + "\">" + days + "</option>");
                $(this).val('0');
                $(this).closest("span").attr("data-maxnum", days);
                $(this).closest("span").attr("data-num-vals", ("0," + days));

            } else {
                if (includeEnable == 1) {//【强制包含】
                    if (valuationType == 1) {
                        $(this).val(defaultNums);//按行人数计价
                        $(this).closest("span").find(".btn-up").addClass("btn-off");
                        $(this).closest("span").attr("data-maxnum", defaultNums);
                        $(this).closest("span").attr("data-minnum", defaultNums);

                        personnums = defaultNums;
                    } else {
                        $(this).val(defaultOrderNums);     //按订单数计价                
                        $(this).closest("span").find(".btn-up").addClass("btn-off");
                        $(this).closest("span").attr("data-maxnum", defaultOrderNums);
                        $(this).closest("span").attr("data-minnum", defaultOrderNums);
                        personnums = defaultOrderNums;
                    }
                    /*开始计算总和和打钩图片的显示*/
                    var price = $("#td_price_" + relationId).text(); //附加产品单价
                    var selectdate = $("#ddl_date_" + relationId).val(); //可以使用日期
                    if (selectdate == "无日期选择") {
                        $(this).val("0"); //还是选择0
                        //$(this).find("option[value=0]").attr("selected", "true");
                        $(this).closest("span").attr("data-maxnum", 0);
                        $(this).closest("span").find(".btn-up").addClass("btn-off");
                    }
                    //调用计算原价的函数
                    // sumAll();
                }
                else {//【不包含】
                    if (valuationType == 1) {
                        if (defaultNums > 0) {
                            for (var i = 0; i <= defaultNums; i++) {
                                //$(this).append("<option value=\"" + i + "\">" + i + "</option>");//这句IE6不兼容，所以换成下面的方式。
                                // var obj = document.getElementById($(this).attr("id"));
                                // var op = new Option(i, i);
                                // obj.options.add(op);
                            }
                            $(this).closest("span").attr("data-maxnum", defaultNums);



                            if ((addProductTypeId == 16 || addProductTypeId == 11 || addProductTypeId == 19) && $("tr[data-did=tr_" + relationId + "]").css("display") != "none") {
                                //网订立减、专项特惠、银行活动则默认选择最大值
                                if (valuationType == 1) {//按照行人数计价
                                    /*排他性封装及非排他性优惠设置默认值*/
                                    var IsExclude = $("#txtHiddenIsExclude_" + relationId).val(); //排他性
                                    if (IsExclude == 1) {
                                        //封装数组                            
                                        // arrayCheapPrice[k] = parseFloat($("#td_price_" + relationId).text()) * $(this).val();
                                        arrayCheapPrice[k] = parseFloat($("#td_price_" + relationId).text()) * $(this).closest("span").attr("data-maxnum");

                                        arrayCheapId[k] = relationId;
                                        k++;
                                    }
                                    else {
                                        //没有勾中排他性的优惠产品则均选择默认值
                                        $(this).val(defaultNums); //默认选中默认值

                                        if (defaultNums > 0) {
                                            $(this).closest("span").find(".btn-down").removeClass("btn-off");
                                        }
                                        $(this).closest("span").find(".btn-up").addClass("btn-off");

                                        /*开始计算总和和打钩图片的显示*/
                                        var price = $("#td_price_" + relationId).text(); //附加产品单价
                                        var selectdate = $("#ddl_date_" + relationId).val(); //可以使用日期
                                        if (selectdate == "无日期选择") {
                                            $(this).val("0"); //还是选择0
                                        }


                                        /*计算结束*/
                                    }
                                }
                            }
                        } else {
                            //$("#ddl_nums_" + relationId).append("<option value=\"0\">0</option>");
                            $("tr[data-did=tr_" + relationId + "]").css("display", "none"); //隐藏
                        }
                    } //按照出游人数计价
                    else {
                        if (addName != "总价优惠") {
                            if (defaultOrderNums > 0) {
                                // var obj = document.getElementById($(this).attr("id"));
                                // var op = new Option(0, 0);
                                // var op2 = new Option(defaultOrderNums, defaultOrderNums, true, true); //默认选中
                                // obj.options.add(op);
                                // obj.options.add(op2);
                                $(this).val(defaultOrderNums);
                                $(this).closest("span").attr("data-maxnum", defaultNums);
                                $(this).closest("span").find(".btn-up").addClass("btn-off");
                            } else {
                                $(this).val("0");
                                $("tr[data-did=tr_" + relationId + "]").css("display", "none"); //隐藏
                            }
                        }
                    } //按照订单数计价
                }
            }
        });
        //排他性【网订立减、专享特惠】默认值设置
        if (arrayCheapId.length > 0) {
            if (arrayCheapId.length == 1) {
                //如果只有一个排他性那么则选中
                //$("#ddl_nums_" + arrayCheapId[0] + " option:last").attr("selected", true); //默认选中
                var tr = $(this).closest("tr");
                tr.find("#attachmentCount").val('0'); //购买份数选择0
            }
            else {
                //多个产品选中排他性那么则默认选择最高的一个
                //冒泡排序（升序，均是负数）
                var temp;
                var tempid;
                for (var i = 0; i < arrayCheapPrice.length; i++) {
                    for (j = i + 1; j < arrayCheapPrice.length; j++) {
                        if (parseFloat(arrayCheapPrice[i]) > parseFloat(arrayCheapPrice[j])) {
                            temp = arrayCheapPrice[j];
                            tempid = arrayCheapId[j];
                            arrayCheapPrice[j] = arrayCheapPrice[i];
                            arrayCheapId[j] = arrayCheapId[i];
                            arrayCheapPrice[i] = temp;
                            arrayCheapId[i] = tempid;
                        }
                    }
                }
                //$("#ddl_nums_" + arrayCheapId[0] + " option:last").attr("selected", true); //默认选中

                var _max = $("tr[data-did='tr_" + arrayCheapId[0] + "']  span.j_bookNum").attr("data-maxnum");
                if (_max) {
                    $("tr[data-did='tr_" + arrayCheapId[0] + "']  #attachmentCount ").val(_max);


                    $("tr[data-did='tr_" + arrayCheapId[0] + "']  .btn-down ").removeClass("btn-off");


                    $("tr[data-did='tr_" + arrayCheapId[0] + "']  .btn-up ").addClass("btn-off");

                }


                //$(this).val("999");`
            }
            /*开始计算总和和打钩图片的显示*/
            var selectdate = $("#ddl_date_" + arrayCheapId[0]).val(); //可以使用日期
            if (selectdate == "无日期选择") {
                var tr = $(this).closest("tr");
                tr.find("#attachmentCount").val('0'); //购买份数选择0
            }
            /*计算结束*/
        }


        //没有使用日期时
        $("input[id^='txtHiddenAddProductPdateEnable_']").each(function () {
            var id = $(this).attr("id");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var tr = $(this).closest("tr");
            if (!$(this).val() || $(this).val() == "0") {

                tr.find("#attachmentCount").val('0'); //购买份数选择0
                tr.css("display", "none"); //隐藏

            }
            //如果当前tr 的 table 下都是隐藏,那么就隐藏TABLE
            if (tr.closest("table tbody").find("tr:visible").length == 0) {
                tr.closest("li").css("display", "none");
            }
        });

    }

    /*可用日期切换时改变价格和单位*/
    _uzaiattachEx.prototype.ddldateChange = function () {
        $("select[id^='ddl_date_']").on("change", function () {
            var id = $(this).attr("id");
            var tr = $(this).closest("tr");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var v = $(this).val();
            //重新赋值 单价和单位
            var price = v.split(",")[2]; //附加产品单价
            // $(this).closest("tr").find("#attachmentCount")
            $("#td_price_" + relationId).text(price);
            tr.find("#attachmentPrice").val(price);
            var count =  parseInt( tr.find("#attachmentCount").val())||0;
            //调用计算原价的函数
            // sumAll();
            price = parseInt(price)||0;
            tr.find(".td-price").text((count*price));
            renderBooklist();
        });
    }

    /*使用日期和价格控制附加产品是否显示*/
    function ApplyDateSet() {
        //有使用日期选择
        $("select[id^='ddl_date_']").each(function () {
            //删除原来的所有选项
            $(this).find("option").remove();
            var id = $(this).closest("tr").attr("data-did");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var str = $("#txtHiddenDateList_" + relationId).val();
            if (str && str.length > 0) {
                var list = str.split("$");
                for (var i = 0; i < list.length; i++) {
                    $(this).append("<option value=\"" + list[i] + "\">" + list[i].split(",")[1] + "</option>");
                    //给价格和单位赋初始值，取使用日期中的第一个相应的价格
                    var price = list[0].split(",")[2];
                    $("#td_price_" + relationId).text(price);
                    $(this).closest("tr").find("#attachmentPrice").val(price);

                }
            }
            else {
                // $("#ddl_nums_" + relationId).html("<option value=\"0\">0</option>"); //购买份数选择0
                // $("#tr_" + relationId).css("display", "none"); //隐藏
                // $(this).append("<option value=\"无日期选择\">无日期选择</option>");
                var tr = $(this).closest("tr");
                tr.find("#attachmentCount").val('0'); //购买份数选择0
                tr.css("display", "none"); //隐藏
                //如果当前tr 的 table 下都是隐藏,那么就隐藏TABLE
                if (tr.closest("table tbody").find("tr:visible").length == 0) {
                    tr.closest("li").css("display", "none");
                }
                // $(this).append("<option value=\"无日期选择\">无日期选择</option>");
            }
        });

        //没有使用日期时
        $("input[id^='txtHiddenAddProductPdateEnable_']").each(function () {
            var id = $(this).attr("id");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var tr = $(this).closest("tr");
            if (!$(this).val() || $(this).val() == "0") {
                tr.find("#attachmentCount").val('0'); //购买份数选择0
                tr.css("display", "none"); //隐藏
            }
            //如果当前tr 的 table 下都是隐藏,那么就隐藏TABLE
            if (tr.closest("table tbody").find("tr:visible").length == 0) {
                tr.closest("li").css("display", "none");
            }
        });
    }

    /*保险按照单价进行排序并且选择默认值*/
    _uzaiattachEx.prototype.SafetySortAndDefautNums = function () {
        var arraysafety_price = new Array(); //保险单价的数组
        var arraysafety_id = new Array(); //保险控件Id的数组
        $("input[value='3'][id^='txtHiddenAddProductTypeId_']").each(function (i) {
            //删除原来的所有选项
            var id = $(this).attr("id");
            var relationId = id.substr(id.lastIndexOf("_") + 1); //关系Id，不重复
            var productaddid = $(this).closest("tr").attr("id");
            productaddid = productaddid.substr(productaddid.lastIndexOf("_") + 1); //关系Id，不重复
            if ($(this).closest("tr").css("display") == "none") {
                return true;
            }
            arraysafety_price.push($.trim($("#td_price_" + relationId).text()));
            arraysafety_id.push(relationId);
        });
        //冒泡排序
        var temp;
        var tempid;
        for (var i = 0; i < arraysafety_price.length; i++) {
            for (j = i + 1; j < arraysafety_price.length; j++) {
                if (parseFloat(arraysafety_price[i]) > parseFloat(arraysafety_price[j])) {
                    temp = arraysafety_price[j];
                    tempid = arraysafety_id[j];
                    arraysafety_price[j] = arraysafety_price[i];
                    arraysafety_id[j] = arraysafety_id[i];
                    arraysafety_price[i] = temp;
                    arraysafety_id[i] = tempid;
                }
            }
        }
        if (arraysafety_id.length > 0) {

            for (var i = 0; i < arraysafety_id.length; i++) {
                var tr = $('tr[data-did=tr_' + arraysafety_id[i] + "]");
                var table = tr.closest("table");
                var trfirst = table.find("tbody tr:eq(" + i + ")");
                tr.insertBefore(trfirst);
            }



            //设置默认值
            var middle_i = 1; //Math.round(arraysafety_id.length / 2); //四舍五入（保险产品排序之后找价格适中的默认选中份数）
            for (var i = 0; i < arraysafety_id.length; i++) {
                if ($("tr[data-did=tr_" + arraysafety_id[i] + "]").css("display") == "none") {
                    continue;
                }
                else {
                    middle_i = i + 1;
                    break;
                }
            }
            //说明是金卡会员以上的，那么只免费最便宜的一个保险，其他均收费
            var freeBaoxian = $("#span_FreeBaoxian");
            if (freeBaoxian.length > 0) {
                freeBaoxian.text(arraysafety_price[0]); //免费保险金额，最便宜的保险
            }
            //默认选择中层价格的保险，金卡会员以上还是默认选择最便宜的[非金卡会员以上并且国内跟团、周边跟团（除一日游外）中则选择中层]
            //国内线路【西藏，青海，新疆，四川，云南】默认选中最贵一个保险
            var pro_type = $("#txtHiddenMType").val(); //线路类型
            var pro_name = $.trim($("#lineName").text()); //线路名称
            var pro_location = $.trim($("#txtHiddendenLocation").val());
            if (freeBaoxian.length == 0 && (pro_type == "2" || pro_type == "3")) {
                var middle_j = 0;
                for (var i = 0; i < arraysafety_id.length; i++) {
                    if ($("tr[data-did=tr_" + arraysafety_id[i] + "]").css("display") == "none") {
                        continue;
                    } else {
                        middle_j++;
                    }
                }
                if (pro_name.indexOf("1日游") < 0) {
                    middle_i = Math.round(middle_j / 2); //四舍五入    
                }
                if (pro_location == 4989 || pro_location == 6030 || pro_location == 6406 || pro_location == 6612 || pro_location == 6894) {
                    middle_i = middle_j;
                }
            }
            // $("#ddl_nums_" + arraysafety_id[middle_i - 1] + " option:last").attr("selected", true); //默认选中最便宜的一个
            var max = $("tr[data-did=tr_" + arraysafety_id[middle_i - 1] + "]").find(".j_bookNum ").attr("data-maxnum");
            $("tr[data-did=tr_" + arraysafety_id[middle_i - 1] + "]").find("#attachmentCount").val(max);
            $("tr[data-did=tr_" + arraysafety_id[middle_i - 1] + "]").find(".btn-up").addClass("btn-off");
            $("tr[data-did=tr_" + arraysafety_id[middle_i - 1] + "]").find(".btn-down").removeClass("btn-off");

            $("#txtHiddenSafe").val("1");

            /*使用日期判断*/
            var selectdate = $("#ddl_date_" + arraysafety_id[middle_i - 1]).val(); //可以使用日期

            if (selectdate == "无日期选择") {
                //  $("#ddl_nums_" + arraysafety_id[middle_i - 1]).val("0"); //还是选择0
                $("tr[data-did=tr_" + arraysafety_id[middle_i - 1] + "]").find("tr:eq(0)").find("#attachmentCount").val(0);
                $("#txtHiddenSafe").val("0");
            }
        }
    }

    /*控制附加产品表头和类别名称是否显示*/
    _uzaiattachEx.prototype.ControlleTable = function () {
        $(".addition-box > li").find("table").each(function () {
            var o = $(this);
            if (o.find("tbody tr:visible").length === 0) {
                o.closest("li").hide();
            }
        });
    }

    return new _uzaiattachEx();
})(window)


var Attachment = function () {
}

Attachment.prototype.getAttachmentInfo = function () {
    var attachmentArr = [];
    var uls = $("tr[id^='attachment_']");
    $("tr[id^='attachment_']").each(function () {
        var count = parseInt($(this).find("input[name='attachmentCount']").val(), 10) || 0; //购买份数
        if (count > 0) {
            var relationId = $(this).attr("data-did").replace("tr_", '');

            var attachmentProperties = []; //附加产品属性

            var addProId = $("#txtHiddenAddProductId_" + relationId).val(); //附加产品Id
            var addGoDateId = ""; //最终选择日期Id(日期详细表Id)
            var addGoDate = ""; //最终选择日期
            var addPrice = ""; //附加产品单价
            var addProfit = ""; //附加产品成本
            var addUnits = $(this).find("input[type='hidden'][id='attachmentUnits']").val(); //单位
            var dateInfo = $(this).find("select[id*=ddl_date]").val(); //选择的使用日期(eg:9424950,2016-09-24,58,50.0000)
            if (dateInfo) {
                var dateArr = dateInfo.split(',');
                //有可选择日期
                addGoDateId = dateArr[0]; //最终选择日期Id(日期详细表Id)
                addGoDate = dateArr[1]; //最终选择日期
                addPrice = dateArr[2]; //附加产品单价
                addProfit = dateArr[3]; //附加产品成本
            }
            else {
                //没有可选择日期
                addGoDateId = "0"; //最终选择日期Id(日期详细表Id)
                addGoDate = "1900-01-01"; //最终选择日期
                addPrice = $.trim($(this).find("#attachmentPrice").val()); //附加产品单价
                addProfit = $("#txtHiddenAddProductProfit_" + relationId).val(); //附加产品成本
            }

            var addProTypeId = $(this).find("#txtHiddenAddProductTypeId_" + relationId).val(); //附加产品所属类别Id
            var addTotal = count * parseFloat(addPrice); //附加产品总金额
            var sHAddtionPriceId = $(this).find("#txtHiddenAddProductSHAddtionPriceId_" + relationId).val(); //上航附加产品价格ID
            var sHAddtionCountId = $(this).find("#txtHiddenAddProductSHAddtionCountId_" + relationId).val(); //上航附加配额价格ID
            var addSupplierNo = $(this).find("#txtHiddenAddProductSupplierNO_" + relationId).val(); //附加产品上航编号
            var addName = $(this).find("#attatchmentName").val(); //附加产品名称
            var isZengBaoxian = $(this).find("#txtHiddenIsFreeBaoxian_" + relationId).val(); //是否赠送保险
            attachmentProperties = [relationId, addProId, count, addPrice, addProfit, addGoDate, addGoDateId, addTotal, addProTypeId,
                addUnits, sHAddtionPriceId, sHAddtionCountId, addSupplierNo, addName, isZengBaoxian, 0, 0];

            var info = attachmentProperties.join("^");
            attachmentArr.push(info);
        }
    });
    var attachmentInfo = attachmentArr.join("$");
    console.info(attachmentInfo);
    return attachmentInfo;
}
//验证逻辑
Attachment.prototype.validate = function () {

}


var Common = function () {

}
/*
* 获取订单对象
* 订单对象包括成人数、儿童数、成人团费、儿童团费4个基本字段
*/
Common.prototype.getOrder = function () {
    var adultCount = parseInt($('#txtHiddenPersonNum').val(), 10) || 0; //成人数
    var childCount = parseInt($('#txtHiddenChildNum').val(), 10) || 0; //儿童数
    var adultAmount = parseFloat($('#txtHiddenUzaiPrice').val()); //成人团费
    var childAmount = parseFloat($('#txtHiddenChildPrice').val()); //儿童团费
    var order = {
        adultCount: adultCount,
        childCount: childCount,
        adultAmount: adultAmount,
        childAmount: childAmount
    };
    return order;
}



/*
* 获取团费
* 团费 = 成人数 * 成人团费 + 儿童数 * 儿童团费
*/
Common.prototype.getGroupAmount = function () {
    var common = new Common();
    var order = common.getOrder();
    var groupAmount = order.adultCount * order.adultAmount + order.childCount * order.childAmount;
    return groupAmount;
}


function renderBooklist() {
    // ------------------ 打造参数 begin ---------------------
    // 订单参数
    var order = new Common().getOrder();
    var orderParam = BookList.orderParam(order.adultCount, order.childCount, order.adultAmount, order.childAmount);
    // 附加产品
    var attachments = [];
    $(".productadd").each(function () {
        if ($(this).is(":hidden") || $(this).closest("li").is(":hidden")) {
            return;
        }
        var attachmentName = $(this).find("input[type='hidden'][id='attatchmentName']").val();
        var attachmentPrice = parseFloat($(this).find("input[type='hidden'][id='attachmentPrice']").val());
        var attachmentCount = parseInt($(this).find('input[id="attachmentCount"]').val(), 10) || 0;
        var attachmentType = $(this).find("input[type='hidden'][id='attachmentType']").val();
        if (attachmentCount > 0) {
            var attachment = BookList.attachProduct(attachmentName, null, attachmentPrice, attachmentCount, attachmentType);
            $(this).find(".td-price").text("¥ " + (attachmentPrice * attachmentCount));

            attachments.push(attachment);
        } else {
            $(this).find(".td-price").text("¥ 0");
        }
    });
    // 选择的优惠活动
    var activities = [];
    var selectedActivities = PreferentialProject.selectedActivities;
    if (selectedActivities) {
        for (var i = 0; i < selectedActivities.length; i++) {
            var preferential = selectedActivities[i];
            for (var j = 0; j < preferential.Activities.length; j++) {
                var activity = preferential.Activities[j];
                var _activity = BookList.preferentialActivity(activity.PreferentialName, activity.MaxPreAmount, 0);
                activities.push(_activity);
            }
        }
    }
    // 选择的优惠活动.积分
    var usedPoint = PreferentialProject.usedPoint || 0;
    if (usedPoint) {
        var pointActivity = BookList.preferentialActivity("积分抵扣", usedPoint.price, 1);
        activities.push(pointActivity);
    }
    // 选择的优惠活动.优惠券
    var selectedCoupons = PreferentialProject.selectedCoupons;
    if (selectedCoupons) {
        // var couponsActivtiy = BookList.preferentialActivity("优惠券抵扣", selectedCoupons.price, 2, selectedCoupons.ticketType);
        // activities.push(couponsActivtiy);
        var thirdPartyUserSource = $("#txtThirdPartyUserSource").val(); //获取会员来源
        var startcityid = _uzw.cookie.get("startcityid");
        var title = "优惠券抵扣"
        if (thirdPartyUserSource == 1 && startcityid == 2 && selectedCoupons.suppelierID == 35) {
            title = "兜礼优惠券抵扣";
        }
        var couponsActivtiy = BookList.preferentialActivity(title, selectedCoupons.price, 2, selectedCoupons.ticketType);
        activities.push(couponsActivtiy);
    }
    // ------------------ 打造参数 end---------------------
    // 调用render方法获取预订清单html并替换
    var html = BookList.render(orderParam, attachments, activities);
    //$('#bookList').html(_html);
    document.getElementById("bookList").innerHTML = html;
}

// ---------------------------------绑定selectChange事件------------------------------
// 附加产品通用selectChange事件
function attachmentChange(e) {
    // 附加产品类型(0=单房差，1=保险，2=境外参, 3=其他附加产品)
    var type = $(e).closest("tr").find("#attachmentType").val();

    if (!$uzaiattachEx.valExclusive(e)) {
        return false;
    }
    e = $(e).closest("td").find("input[type=text]");
    var count = parseInt($(e).val());

    if (type == 0) {
        $('#txtHiddenUtourSingleCount').val(count);
    }
    if (type == 2) {
        $('#txtHiddenUtourOutCount').val(count);
    }

    //$(e).parent().parent().find("span[id='attachmentCount']").html(count);
    renderBooklist();
}
// 附加产品日期选择通用selectChange事件
function attachmentDateChange(e) {
    var dateInfo = $(e).attr("dateInfo");//eg:9424950,2016-09-10,58,50.0000
    $(e).parent().parent().find("#hidDateInfo").val(dateInfo);
}

//初始化绑定事件
function initpreferentialevent() {
    //选择其他优惠
    $(".preferential-container").find(".dis-con").find('li').on('click', function () {
        if ($(this).hasClass('check-disable')) {
            return false;
        }
        var o = $(this).find('input.dis-checkbox');
        var fd = o.attr('data-fun').split(',');
        PreferentialProject.activitySelect(o, fd[0], fd[1]);
    });

    //选择优惠券
    $(".preferential-container").find('.dis-content ul.discount-sub').children('li.discount-list:not(.discount-out):not(.disabled)').on('click', function () {
        Coupons.chooseCoupons(this, $(this).find("input[type='checkbox']").val());
    });


    //积分
    $("#btnUseScore").click(function () {
        MemberPoints.usePoints(this);
    });

}
// 联系人验证
function contactValidate(e) {
    return true;
}

function boarding() {
    $(".boarding-container .agg-list").on("click", function (e) {
        var o = $(this);
        var obj = o.find("input[type=radio]");
        unitRadio(o, {
            clickAfter: function (target) {
                //是否选中
                var checked = o.is(".radio-on");
                if (checked) {
                    $("#txtHiddenUpTrainPlace").val($(o).find(".value").text());
                }
            }
        });
    });
    $("#txtHiddenUpTrainPlace").val($($($(".boarding-container .agg-list").get(0))).find(".value").text());
}


//提交 改进版本
var dosubmitv1 = function () {
    try {
        bookLoading.show();
        //验证表单
        checkformv1(function (err, result) {
            if (result) {
                //验证多余订单
                ajax_repeat_ordersv1($("#phonenumber").val().trim(), function (err, result) {
                    if (result) {
                        //验证库存
                        bookLoading.show();
                        Instockv1(function (err, result) {
                            if (result) {
                                //验证价格
                                bookLoading.show();
                                $uzpricevalidator.success(function () {
                                    //验证权限
                                    bookLoading.show();
                                    $uzpermission.success(function () {
                                        //bookLoading.show();
                                        window.document.forms["one_form"].submit();
                                    }).error(function (err) {
                                        bookLoading.hide();
                                    }).close(function () {

                                    })
                                        .start();
                                })
                                    .error(function () { bookLoading.hide(); })
                                    .start();
                            } else {
                                bookLoading.hide();
                            }
                        });
                    } else {
                        bookLoading.hide();
                    }
                });
            } else {
                bookLoading.hide();
            }
        })
    }
    catch (e) {
        bookLoading.hide();
    }
    $("#btnSubmit").addClass("btn-off");
}

var domanagersubmitv1 = function () {
    try {
        bookLoading.show();
        //验证表单
        checkformv1(function (err, result) {
            if (result) {
                //验证多余订单
                ajax_repeat_ordersv1($("#phonenumber").val().trim(), function (err, result) {
                    if (result) {
                        //验证库存
                        bookLoading.show();
                        Instockv1(function (err, result) {
                            if (result) {
                                //验证价格
                                bookLoading.show();
                                window.document.forms["one_form"].submit();
                            } else {
                                bookLoading.hide();
                            }
                        });
                    } else {
                        bookLoading.hide();
                    }
                });
            } else {
                bookLoading.hide();
            }
        })
    }
    catch (e) {
        bookLoading.hide();
    }
    $("#btnSubmit").addClass("btn-off");
}

//检查验证表单
var checkformv1 = function (callback) {
    // var payAmount = parseFloat($('#spanPayAmount').html().replace("￥", "")) || 0;
    // if (payAmount <= 0) {
    //     alert('订单金额必须大于0');
    //     return false;
    // }
    var result = true;
    // 保险份数验证
    var order = new Common().getOrder();
    var personCount = order.adultCount + order.childCount;
    var insuranceValidate = true;
    var insuranceCount = 0;
    var arrayCheapIds = [];
    $("tr[id^='attachment_']:visible").each(function () {
        var relationId = $(this).attr("data-did");
        relationId = relationId.substr(relationId.lastIndexOf("_") + 1); //关系Id，不重复

        var attachmentCount = parseInt($(this).find('[id="attachmentCount"]').val(), 10) || 0;// 保险份数
        var attachmentType = $(this).find("input[type='hidden'][id='attachmentType']").val();// 类型(0=单房差，1=保险，2=境外参, 3=其他附加产品)
        var IsExclude = $(this).find("#txtHiddenIsExclude_" + relationId).val(); //排他性
        if (attachmentType == 3) {
            insuranceCount += attachmentCount;
        }
        if (IsExclude == 1 && attachmentCount > 0) {
            arrayCheapIds.push(relationId);
        }
    });
    // 当前保险选择的份数不能大于订单总人数
    if (insuranceCount > personCount) {
        insuranceValidate = false;
        $(this).find("input[type='hidden'][id='attachmentType']").focus();
        alert("选择的保险份数不能大于订单总人数！");
        $('#insurance').first().parent().find('span').focus();
    }
    if (arrayCheapIds.length > 1) {
        insuranceValidate = false;
        $(this).find("input[type='hidden'][id='attachmentType']").focus();
        alert("本产品不能同时享受多个优惠！");
        $('#insurance').first().parent().find('span').focus();
    }

    // 联系人验证
    var contactNameValidate = contactValidate($('#realname'));
    var contactMobileValidate = contactValidate($('#phonenumber'));
    var contactValidateResult = contactNameValidate && contactMobileValidate;

    // 验证结果
    result = insuranceValidate && contactValidateResult;
    if (result) {
        // 将联系人信息放在隐藏域中
        var contactMan = $.trim($('#realname').val());
        var contactMobile = $.trim($('#phonenumber').val());
        $("#txtHiddenLinker").val(contactMan + "^" + contactMobile + "^^");
        // 将附加产品信息放在隐藏域中
        var attachmentInfo = new Attachment().getAttachmentInfo();
        $("#txtSubmitHiddenAdd").val(attachmentInfo);
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
                var queryurl = $("#hidPlatform").val() === "Offline" ? "//buy.uzai.com/ashx/ashxPreferential2.ashx" : "//buy.uzai.com/ashx/ashxPreferential.ashx"
                $.ajax({
                    url: queryurl,
                    type: "POST",
                    data: param,
                    success: function (data) {
                        var jsonResult;
                        try {
                            jsonResult = JSON.parse(data);
                        } catch (e) {
                            jsonResult = data;
                        }
                        if (jsonResult.Result) {
                            callback(null, true);
                        }
                        else {
                            popupTips('j_popupTipspre', {
                                popupBefore: function (obj) {
                                    var hdText = '请修改优惠方案';
                                    var bdNode =
                                        '<p class="tips-cont f999 f14 tc">您选择的优惠方案不可用，请重新选择，点击确定后刷新当前页。</p>'
                                        + '<p class="btn-bar tc"><a href="" onclick="location.reload(true)" class="btn-focus todosubmit">确定</a></p>';
                                    obj.find('.popup-hd').find('.hd-cont').text(hdText);
                                    obj.find('.popup-bd').html(bdNode);
                                }
                            });
                            //callback();
                        }
                    },
                    error: function () {
                        callback();
                    }
                });
            }
            else {
                callback(null, true);
            }
        } else {
            callback(null, true);
        }
    } else {
        callback();
    }
}



$(function () {
    $uzpermission.init();
    $uzaiattachEx.defaultProductSet();
    $uzaiattachEx.defaultnumsset();
    $uzaiattachEx.ddldateChange();
    $uzaiattachEx.SafetySortAndDefautNums();
    $uzaiattachEx.ControlleTable();
    AppLogin.bindlogincallback(function (data) {
        if (data["status"] == '1') {
            bookLoading.show();

            AppView.reloadtraveler(function () {
                travelerInfo();
                AppView.reloadpreferential(function () {
                    bookInfo();
                    bookDiscount();
                    _uzw.ui.tab('dis-tab');
                    travelerinit();
                    initpreferentialevent();
                    try {
                        PreferentialProject.selectedActivities = [];
                    } catch (e) {

                    }
                    // 设置默认选中的活动
                    var result = PreferentialProject.setChecked();
                    renderBooklist();





                });
            });

        }
    });

    if ($(".finally").get(0)) {
        $(".book-top").css("width", "1290px");
    }
    boarding();


    initpreferentialevent();

    //选择附加产品
    $(".addition-box .num-btn").on("click", function () {
        var e = $(this);
        //if (!e.hasClass("btn-off")) {
        attachmentChange(e);
        //}
    });


    // 设置默认选中的活动
    var result = PreferentialProject.setChecked();

    if (!result) {
        renderBooklist(); //没有默认选中的活动，所以需要手动render一次预订清单   
    }


    // 保险默认选中 
    $('#insurance').first().find('a:last').click();


    $("#btnSubmit").on("mousedown", function () {
        var o = $(this);
        if (!o.hasClass("btn-off")) {
            //activityValidate();
            dosubmitv1();
        }
    });


    $("#btnManagerSubmit").on("mousedown", function () {
        var o = $(this);
        if (!o.hasClass("btn-off")) {
            domanagersubmitv1();
        }
    });


    //重载优惠视图
    AppView.reloadpreferential(function () {
        bookInfo();
        bookDiscount();
        initpreferentialevent();
        _uzw.ui.tab('dis-tab');
        // 设置默认选中的活动
        var result = PreferentialProject.setChecked();

        if (!result) {
            renderBooklist(); //没有默认选中的活动，所以需要手动render一次预订清单   
        }
    });
});

