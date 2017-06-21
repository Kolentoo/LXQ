/* 
* 增加这段代码(4-356行)是为了兼容IE6、IE7中JSON对象不可用的问题，
* 添加这段代码后，无论是在IE6、IE7，还是在IE8-IE11、Chrome、Firefox中都可以直接使用JSON对象
*/
if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                f(this.getUTCMonth() + 1) + "-" +
                f(this.getUTCDate()) + "T" +
                f(this.getUTCHours()) + ":" +
                f(this.getUTCMinutes()) + ":" +
                f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
            typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case "string":
                return quote(value);

            case "number":

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value)
                    ? String(value)
                    : "null";

            case "boolean":
            case "null":

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is "object", we might be dealing with an object or an array or
            // null.

            case "object":

                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.

                if (!value) {
                    return "null";
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0
                        ? "[]"
                        : gap
                            ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                            : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                    ? "{}"
                    : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                        : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", { "": value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                        ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({ "": j }, "")
                    : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());

// 积分
var MemberPoints = {
    usePoints: function (e) {
        var o = $(e);
        o.attr("onclick", "");
        var hidScore = $("#txtHiddenUseScore");
        var txtScore = $("#txtUseScore");
        var isUse = parseInt($.trim($("#hidIsUseScore").val())) || 0;
        var score = parseInt($.trim(txtScore.val())) || 0;
        var ratio = parseInt($("#txtHiddenScoreRatio").val()) || 0;
        var count = parseInt($('#hidRemainScore').val()) || 0;
        if (isUse == 0) {
            if (ratio > 0) {
                if (score > 0) {
                    if (score <= count) {
                        if (score % ratio == 0) {
                            hidScore.val(score).attr("price", score / ratio);
                            $("#hidIsUseScore").val('1');
                            o.children('.em1').click();

                            var usedPoint = new Object();
                            usedPoint.point = score;
                            usedPoint.price = score / ratio;
                            PreferentialProject.usedPoint = usedPoint;

                            var tipInfo = '当前剩余：<em>' + (count - score) + '</em>积分';
                            $('#pointTips').html(tipInfo);
                            $('#hidRemainScore').val(count - score);
                            $('#txtHiddenUseScore').val(score);
                            var _score = $('#txtHiddenUseScore').val();
                            // 积分属于标准优惠，标准优惠和银行互斥(银行和所有大类互斥)
                            // 所以，这里需要银行进行互斥
                            var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
                            lis.each(function () {
                                var o = $(this);
                                o.addClass('check-disable');
                                o.find('.dis-price p.p3').hide();
                                o.find('.dis-price').addClass('no-line');
                                o.find('.dis-price p.p4').html("不与" + "积分优惠" + "同享").show();
                            });
                        }
                        else {
                            $('#pointTips').html("<em>请输入" + ratio + "的整数倍数值</em>");
                            $('#txtUseScore').focus();
                            $('#txtHiddenUseScore').val(0);
                            o.children('.em2').click();
                        }
                    }
                    else {
                        $('#pointTips').html("<em>输入积分数大于当前剩余积分数</em>");
                        $('#txtUseScore').focus();
                        $('#txtHiddenUseScore').val(0);
                        o.children('.em2').click();
                    }
                }
                else {
                    $('#pointTips').html("<em>积分数必须大于零</em>");
                    $('#txtUseScore').focus();
                    $('#txtHiddenUseScore').val(0);
                    o.children('.em2').click();
                }
            }
            else {
                $('#pointTips').html("<em>当前线路不支持积分抵扣</em>");
                $('#txtHiddenUseScore').val(0);
                o.children('.em2').click();
            }
        }
        else {
            hidScore.val(0).attr("price", 0);
            $('#txtHiddenUseScore').val(0);
            $("#hidIsUseScore").val('0');
            o.children('.em2').click();
            usedPoint = null;
            PreferentialProject.usedPoint = usedPoint;
            var a = parseInt($('#hidRemainScore').val(), 10);
            var b = parseInt($("#txtUseScore").val(), 10);
            var remainScore = a + b;
            var tipInfo = '当前剩余：<em>' + remainScore + '</em>积分';
            $('#pointTips').html(tipInfo);
            $('#hidRemainScore').val(remainScore);
            $("#txtUseScore").val(0);

            // 积分与银行的互斥取消
            var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.removeClass('check-disable');
                o.find('.dis-price').removeClass('no-line');
                o.find('.dis-price p.p4').html('').hide();
                o.find('.dis-price p.p3').show();
            });
            // 大类互斥检测
            for (var i = 0; i < PreferentialProject.jsonData.Preferentials.length; i++) {
                var categoryId = PreferentialProject.jsonData.Preferentials[i].CategoryID
                PreferentialProject.categoryMutexCheck(categoryId);
            }
        }
        o.attr("onclick", "MemberPoints.usePoints(this);");
        renderBooklist(); //重新生成价格面板
    }
}

// 券
var Coupons = {
    /*
    * 选择优惠券
    */
    chooseCoupons: function (e, couponsCode) {
        // 如果已经选中(因为先修改了样式)
        if (!$(e).hasClass("check-on")) {
            $("#txtHiddenUseVoucher").val('').attr("price", 0);;
            PreferentialProject.selectedCoupons = null;

            // 取消和银行的互斥，以及立减类内的互斥
            // 第1步，取消和银行的互斥
            var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.removeClass('check-disable');
                o.find('.dis-price').removeClass('no-line');
                o.find('.dis-price p.p4').html('').hide();
                o.find('.dis-price p.p3').show();
            });
            // 第2步，取消立减类内互斥
            var lis = $("input[name='preferential_" + 2 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.removeClass('check-disable');
                o.find('.dis-price').removeClass('no-line');
                o.find('.dis-price p.p4').html('').hide();
                o.find('.dis-price p.p3').show();
            });
            // 大类互斥检测
            for (var i = 0; i < PreferentialProject.jsonData.Preferentials.length; i++) {
                var categoryId = PreferentialProject.jsonData.Preferentials[i].CategoryID
                PreferentialProject.categoryMutexCheck(categoryId);
            }
        } else {
            // 将其他券置为未选中状态
            $('#j_paymentTab').find('.dis-content ul.discount-sub').children('li.discount-list.check-on').not(e).each(function () {
                $(this).click();
            });
            if ($('#hidIsUseTicket').val() == '1') {
                $('#btnUseVoucher').click();
            }

            var couponInfo = $(e).find("input[type='hidden'][class='couponInfo']").val();
            if (couponInfo) {
                var couponInfoArr = couponInfo.split(',');
                var selectedCoupons = new Object();
                //2,72,RY9798BBD1,500(ticketType,面值，代码，最高优惠金额)
                selectedCoupons.code = couponInfoArr[2];
                selectedCoupons.ticketType = couponInfoArr[0]; //1=抵扣券，2=折扣券
                selectedCoupons.deductionAmount = couponInfoArr[3];
                selectedCoupons.price = parseFloat(couponInfoArr[1]); //按产品方要求，优惠券价格出现小数只取整(后来又改为保留2位小数)
                selectedCoupons.price = Coupons.getCouponsMaxAmount(selectedCoupons);
                selectedCoupons.suppelierID = couponInfoArr[4]; //券的供应商，是否是宝钢券
                PreferentialProject.selectedCoupons = selectedCoupons;
            }
            $("#txtHiddenUseVoucher").val(selectedCoupons.code).attr("price", selectedCoupons.price);

            // 优惠券属于立减优惠，立减优惠和银行互斥(银行和所有大类互斥)，立减优惠类内互斥
            // 所以，这里需要银行进行互斥，并进行类内互斥操作
            // 第1步，和银行的互斥
            var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.addClass('check-disable');
                o.find('.dis-price p.p3').hide();
                o.find('.dis-price').addClass('no-line');
                o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
            });
            // 第2步，立减类内互斥
            var lis = $("input[name='preferential_" + 2 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.addClass('check-disable');
                o.find('.dis-price p.p3').hide();
                o.find('.dis-price').addClass('no-line');
                o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
            });
            //第3步，选择了宝钢的优惠券 标准优惠互斥
            if (PreferentialProject.selectedCoupons != null && (PreferentialProject.selectedCoupons.suppelierID == 35 || PreferentialProject.selectedCoupons.suppelierID == 40)) { //宝钢优惠券-去掉已选中的标准优惠,标记为不能与宝钢优惠同享
                var lis = $("input[name='preferential_" + 3 + "']").parent().parent();
                lis.each(function () {
                    var o = $(this);
                    //去掉选中的标准优惠
                    if (o.hasClass('check-on')) {
                        //o.click();
                        var oo = $(o).find("input.dis-checkbox");
                        var id = oo.val();
                        PreferentialProject.activitySelect(oo, id, 3);
                    }
                    //提示不能与宝钢优惠同享
                    o.addClass('check-disable');
                    o.removeClass("check-on");
                    o.find('.dis-price p.p3').hide();
                    o.find('.dis-price').addClass('no-line');
                    o.find('.dis-price p.p4').html("不与" + (PreferentialProject.selectedCoupons.suppelierID == 35 ? "兜礼优惠" : "国航优惠") + "同享").show();
                });
            } else {//不是宝钢优惠设置初始状态
                // 大类互斥检测
                if (PreferentialProject.jsonData) {
                    for (var i = 0; i < PreferentialProject.jsonData.Preferentials.length; i++) {
                        var categoryId = PreferentialProject.jsonData.Preferentials[i].CategoryID
                        PreferentialProject.categoryMutexCheck(categoryId);
                    }
                }
            }
        }
        renderBooklist(); //重新生成价格面板
    },
    // 获取优惠券的最大可优惠金额
    getCouponsMaxAmount: function (coupon) {
        var max = 0;
        var adultCount = parseInt($('#txtHiddenPersonNum').val(), 10) || 0;
        var childCount = parseInt($('#txtHiddenChildNum').val(), 10) || 0;
        var adultAmount = parseFloat($('#txtHiddenUzaiPrice').val());
        var childAmount = parseFloat($('#txtHiddenChildPrice').val());
        var tuanAmount = adultCount * adultAmount + childCount * childAmount;
        if (coupon.ticketType == 1) {
            // 折扣券直接返回面值
            max = coupon.price;
        }
        else if (coupon.ticketType == 2) {
            // 折扣券需要计算(注意有最大优惠金额限制)
            var preDiscount = (100 - coupon.price) / 100; //优惠力度，打9折，此处值为10
            var preferentialAmount = Math.floor(tuanAmount * preDiscount);
            max = Math.min(preferentialAmount, coupon.deductionAmount);
        }
        max = parseFloat(max); //按产品方要求，优惠券价格出现小数只取整(后来又改为保留2位小数)
        return max;
    },
    /*
    * 使用优惠券
    */
    useCoupons: function (e) {
        var o = $(e);
        o.attr('onclick', '');
        var ticketTips = o.parent().siblings('.label-tips').hide();
        var hidVoucher = $("#txtHiddenUseVoucher");
        var txtVoucher = $("#txtUseVoucher");
        var isUserTicket = $('#hidIsUseTicket');
        if (isUserTicket.val() == '0') {
            var v = $.trim(txtVoucher.val());
            if (!v) {
                o.attr('onclick', 'Coupons.useCoupons(this);');
                ticketTips.children('p').html('请输入要使用的券号');
                ticketTips.show();
                return;
            }
            //产品编号
            var pid = $.trim($("#txtHiddenPId").val());
            //人数和单价
            var persons = parseInt($("#txtHiddenPersonNum").val()) || 0,
                childs = parseInt($("#txtHiddenChildNum").val()) || 0,
                persenPrice = parseInt($("#txtHiddenUzaiPrice").val()) || 0,
                childPrice = parseInt($("#txtHiddenChildPrice").val()) || 0;
            //单纯产品总价
            var total = persons * persenPrice + childs * childPrice;
            //出发城市
            var city = $.trim($("#txtHiddenCity").val());
            //产品类别
            var pType = $.trim($("#txtHiddenMType").val());
            //用户ID
            var userId = $.trim($("#txtHiddenUserId").val());
            //获取会员来源
            var thirdPartyUserSource = $("#txtThirdPartyUserSource").val();
            //获取是否是宝钢券
            var suppelierID = Coupons.getConponsSuppelierID(v);
            //宝钢会员
            if (thirdPartyUserSource == 1 && suppelierID == 35) {
                total += returnOutRebate();
            }
            $.ajax({
                type: "POST",
                cache: false,
                async: false,
                url: "/ashx/ashx0010.ashx?type=5&pId=" + pid
                + "&code=" + v
                + "&total=" + total
                + "&userid=" + userId
                + "&platfrom=pc&city=" + city
                + "&nums=" + (parseInt(persons) + parseInt(childs))
                + "&pType=" + pType,
                success: function (msg) {
                    // console.info("msg=" + msg);
                    if (parseInt(msg) > 0) {//验证成功
                        // 将其他券设置为未选中状态
                        $('#j_paymentTab').find('.dis-content ul.discount-sub').children('li.discount-list.check-on').each(function () {
                            $(this).click();
                        });
                        hidVoucher.val(v).attr("price", msg);
                        isUserTicket.val('1');
                        o.children('.em1').click();
                        var selectedCoupons = new Object();
                        selectedCoupons.code = v;
                        selectedCoupons.ticketType = 1; //这里作为抵扣券处理，因为即使是“折扣券”，这里返回的msg也是总的可优惠金额
                        selectedCoupons.price = msg;
                        selectedCoupons.suppelierID = suppelierID; //添加券对应的是否是宝钢
                        PreferentialProject.selectedCoupons = selectedCoupons;
                        renderBooklist(); //重新生成预订清单

                        // 优惠券属于立减优惠，立减优惠和银行互斥(银行和所有大类互斥)，立减优惠类内互斥
                        // 所以，这里需要银行进行互斥，并进行类内互斥操作
                        // 第1步，和银行的互斥
                        var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
                        lis.each(function () {
                            var o = $(this);
                            o.addClass('check-disable');
                            o.find('.dis-price p.p3').hide();
                            o.find('.dis-price').addClass('no-line');
                            o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
                        });
                        // 第2步，立减类内互斥
                        var lis = $("input[name='preferential_" + 2 + "']").parent().parent();
                        lis.each(function () {
                            var o = $(this);
                            o.addClass('check-disable');
                            o.find('.dis-price p.p3').hide();
                            o.find('.dis-price').addClass('no-line');
                            o.find('.dis-price p.p4').html("不与" + "抵用券/红包" + "同享").show();
                        });
                        //第3步，选择了宝钢的优惠券 标准优惠互斥
                        if (PreferentialProject.selectedCoupons != null && (PreferentialProject.selectedCoupons.suppelierID == 35 || PreferentialProject.selectedCoupons.suppelierID == 40)) { //宝钢优惠券-去掉已选中的标准优惠,标记为不能与宝钢优惠同享
                            var lis = $("input[name='preferential_" + 3 + "']").parent().parent();
                            lis.each(function () {
                                var o = $(this);
                                //去掉选中的标准优惠
                                if (o.hasClass('check-on')) {
                                    //o.click();
                                    var oo = $(o).find("input.dis-checkbox");
                                    var id = oo.val();
                                    PreferentialProject.activitySelect(oo, id, 3);
                                }
                                //提示不能与宝钢优惠同享
                                o.addClass('check-disable');
                                o.removeClass("check-on");
                                o.find('.dis-price p.p3').hide();
                                o.find('.dis-price').addClass('no-line');
                                o.find('.dis-price p.p4').html("不与" + (PreferentialProject.selectedCoupons.suppelierID == 35 ? "兜礼优惠" : "国航优惠") + "同享").show();
                            });
                        } else {//不是宝钢优惠设置初始状态
                            // 大类互斥检测
                            if (PreferentialProject.jsonData) {
                                for (var i = 0; i < PreferentialProject.jsonData.Preferentials.length; i++) {
                                    var categoryId = PreferentialProject.jsonData.Preferentials[i].CategoryID
                                    PreferentialProject.categoryMutexCheck(categoryId);
                                }
                            }
                        }
                    } else {
                        hidVoucher.val("");
                        o.children('.em2').click();
                        ticketTips.children('p').html(msg);
                        ticketTips.show();
                        PreferentialProject.selectedCoupons = null;
                    }
                    o.attr('onclick', 'Coupons.useCoupons(this);');
                    renderBooklist(); //重新生成预订清单
                } //返回
            }); //end ajax
        } else {
            hidVoucher.val("").attr("price", 0);
            isUserTicket.val('0');
            $('#txtUseVoucher').val('');
            o.children('.em2').click();
            PreferentialProject.selectedCoupons = null;

            // 取消和银行的互斥，以及立减类内的互斥
            // 第1步，取消和银行的互斥
            var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.removeClass('check-disable');
                o.find('.dis-price').removeClass('no-line');
                o.find('.dis-price p.p4').html('').hide();
                o.find('.dis-price p.p3').show();
            });
            // 第2步，取消立减类内互斥
            var lis = $("input[name='preferential_" + 2 + "']").parent().parent();
            lis.each(function () {
                var o = $(this);
                o.removeClass('check-disable');
                o.find('.dis-price').removeClass('no-line');
                o.find('.dis-price p.p4').html('').hide();
                o.find('.dis-price p.p3').show();
            });
            // 大类互斥检测
            for (var i = 0; i < PreferentialProject.jsonData.Preferentials.length; i++) {
                var categoryId = PreferentialProject.jsonData.Preferentials[i].CategoryID
                PreferentialProject.categoryMutexCheck(categoryId);
            }
            o.attr('onclick', 'Coupons.useCoupons(this);');
            renderBooklist(); //重新生成预订清单
        }
    }
    ,
    //根据券获取券的供应商ID是否是宝钢券
    getConponsSuppelierID: function (coupon) {
        var suppelierID = 0;
        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            url: "/Ashx/AjaxCoupon.ashx?couponCode=" + coupon,
            success: function (msg) {
                suppelierID = msg;
            }
        })
        return suppelierID;
    }
}
// 优惠活动
var PreferentialProject = {
    selectedActivities: [],
    usedPoint: null,
    selectedCoupons: null,
    jsonData: JSON.parse(document.getElementById('hidActivityData').value),
    // 根据Id获取大类别
    getCategory: function (categoryId) {
        var parentCategory = {};
        for (var i = 0; i < this.jsonData.Preferentials.length; i++) {
            var preferentialModel = this.jsonData.Preferentials[i];
            if (preferentialModel.CategoryID == categoryId) {
                parentCategory = this.jsonData.Preferentials[i];
                break;
            }
        }
        return parentCategory;
    },
    // 根据互斥代码获取大类别
    getCategoryByMutexCode: function (mutexCode) {
        var category;
        for (var i = 0; i < this.jsonData.Preferentials.length; i++) {
            var preferentialModel = this.jsonData.Preferentials[i];
            if (preferentialModel.MutexCode == mutexCode) {
                category = this.jsonData.Preferentials[i];
                break;
            }
        }
        return category;
    },
    // 获取与之互斥的类别
    getMutexCategories: function (categoryId) {
        var mutexedCodes = []; //与之互斥的大类id
        var cateogry = this.getCategory(categoryId);
        for (var j = 0; j < this.jsonData.MutexRelation.Rules.length; j++) {
            var rule = this.jsonData.MutexRelation.Rules[j];
            if (rule.CategoryCode == cateogry.MutexCode) {
                mutexedCodes.push(rule.MutexCategoryCode);
            }
            if (rule.MutexCategoryCode == cateogry.MutexCode) {
                mutexedCodes.push(rule.CategoryCode);
            }
        }
        return mutexedCodes;
    },
    // 根据优惠活动Id,获取优惠活动
    getActivity: function (preferentialId, categoryId) {
        var activity = {};
        var preferentialModel = this.getCategory(categoryId);
        for (var i = 0; i < preferentialModel.Activities.length; i++) {
            var _activity = preferentialModel.Activities[i];
            if (_activity.PreferentialID == preferentialId) {
                activity = _activity;
                break;
            }
        }
        return activity;
    },
    // 移除已选择的优惠活动
    removeActivity: function (preferentialId) {
        for (var i = this.selectedActivities.length - 1; i >= 0; i--) {
            var preferentialModel = this.selectedActivities[i];
            for (var j = preferentialModel.Activities.length - 1; j >= 0; j--) {
                var activity = preferentialModel.Activities[j];
                if (activity.PreferentialID == preferentialId) {
                    preferentialModel.Activities.splice(j, 1);
                }
            }
        }
        // 如果大类中已经没有活动，则移除
        for (var i = this.selectedActivities.length - 1; i >= 0; i--) {
            if (this.selectedActivities[i].Activities.length == 0) {
                this.selectedActivities.splice(i, 1);
            }
        }
    },
    // 向已选择优惠活动对象中添加一个条新记录
    pushActivity: function (preferentialId, categoryId, categoryName, mutexCode, innerMutex, type) {
        var activity = PreferentialProject.getActivity(preferentialId, categoryId); // 优惠活动
        // 父类是否已存在
        var isParentExist = false;
        for (var i = 0; i < PreferentialProject.selectedActivities.length; i++) {
            var preferentialModel = PreferentialProject.selectedActivities[i];
            if (preferentialModel.CategoryID == categoryId) {
                preferentialModel.Activities.push(activity);
                isParentExist = true;
            }
        }
        // 父类不存在，打造父类，并将该优惠活动放入父类的Activities对象中
        if (!isParentExist) {
            var selectedActivity = {};
            selectedActivity.CategoryID = categoryId;
            selectedActivity.CategoryName = categoryName;
            selectedActivity.MutexCode = mutexCode;
            selectedActivity.InnerMutex = innerMutex;
            selectedActivity.Type = type; //0=普通优惠，1=积分，2=券
            selectedActivity.Activities = [];
            selectedActivity.Activities.push(activity);
            PreferentialProject.selectedActivities.push(selectedActivity);
        }
    },
    // 大类间的互斥检测
    categoryMutexCheck: function (categoryId) {
        if (this.selectedActivities.length == 0) {
            for (var i = 0; i < this.jsonData.Preferentials.length; i++) {
                var preferentialModel = this.jsonData.Preferentials[i];
                var lis = $("input[name='preferential_" + preferentialModel.CategoryID + "']").parent().parent('.check-disable'); lis.each(function () {
                    var o = $(this);
                    o.removeClass('check-disable');
                    o.find('.dis-price p.p4').html("").hide();
                    o.find('.dis-price p.p3').show();
                });
            }
            // 虽然没有选择任何优惠活动，但需要判断积分和优惠券是否使用
            // 第一步，积分是否使用的判断
            if (PreferentialProject.usedPoint != null) {
                // 积分属于标准优惠，标准优惠和银行互斥(银行和所有大类互斥)
                // 所以，这里需要银行进行互斥
                var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
                lis.each(function () {
                    var o = $(this);
                    o.addClass('check-disable');
                    o.find('.dis-price p.p3').hide();
                    o.find('.dis-price').addClass('no-line');
                    o.find('.dis-price p.p4').html("不与" + "积分优惠" + "同享").show();
                });
            }
            // 第二步，优惠券是否使用的判断
            if (PreferentialProject.selectedCoupons != null) {
                // 优惠券属于立减优惠，立减优惠和银行互斥(银行和所有大类互斥)，立减优惠类内互斥
                // 所以，这里需要银行进行互斥，并进行类内互斥操作
                // 第1步，和银行的互斥
                var lis = $("input[name='preferential_" + 1 + "']").parent().parent();
                lis.each(function () {
                    var o = $(this);
                    o.addClass('check-disable');
                    o.find('.dis-price p.p3').hide();
                    o.find('.dis-price').addClass('no-line');
                    o.find('.dis-price p.p4').html("不与" + "优惠券" + "同享").show();
                });
                // 第2步，立减类内互斥
                var lis = $("input[name='preferential_" + 2 + "']").parent().parent();
                lis.each(function () {
                    var o = $(this);
                    o.addClass('check-disable');
                    o.find('.dis-price p.p3').hide();
                    o.find('.dis-price').addClass('no-line');
                    o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
                });
                //第3步，如果是宝钢券标准优惠互斥,宝钢券
                if (PreferentialProject.selectedCoupons.suppelierID == 35 || PreferentialProject.selectedCoupons.suppelierID == 40) {
                    var lis = $("input[name='preferential_" + 3 + "']").parent().parent();
                    lis.each(function () {
                        var o = $(this);
                        o.addClass('check-disable');
                        o.find('.dis-price p.p3').hide();
                        o.find('.dis-price').addClass('no-line');
                        o.find('.dis-price p.p4').html("不与" + (PreferentialProject.selectedCoupons.suppelierID == 35 ? "兜礼优惠" : "国航优惠") + "同享").show();
                    });
                }
            }
            return;
        }
        for (var i = 0; i < this.jsonData.Preferentials.length; i++) {
            var preferentialModel = this.jsonData.Preferentials[i];
            if (preferentialModel.CategoryID != categoryId) {
                // 该类别的互斥类别
                var mutexeCategorieCodes = PreferentialProject.getMutexCategories(preferentialModel.CategoryID);
                var isExist = false;
                for (var j = 0; j < this.selectedActivities.length; j++) {
                    var _selected_code = this.selectedActivities[j].MutexCode;
                    for (var k = 0; k < mutexeCategorieCodes.length; k++) {
                        if (_selected_code == mutexeCategorieCodes[k]) {
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist) break;
                }
                if (isExist) {
                    if (mutexeCategorieCodes.length > 0) {
                        var textArr = [];
                        for (var j = 0; j < mutexeCategorieCodes.length; j++) {
                            var category = this.getCategoryByMutexCode(mutexeCategorieCodes[j]);
                            if (category) {
                                textArr.push(category.CategoryName);
                            }
                        }
                        var lis = $("input[name='preferential_" + preferentialModel.CategoryID + "']").parent().parent();
                        lis.each(function () {
                            var o = $(this);
                            o.addClass('check-disable');
                            o.find('.dis-price p.p3').hide();
                            o.find('.dis-price').addClass('no-line');
                            if (preferentialModel.CategoryID == 1) {
                                o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
                            }
                            else {
                                o.find('.dis-price p.p4').html("不与" + textArr.join(",") + "同享").show();
                            }
                        });
                    }
                }
            }
        }
        // 按照产品需求，银行大类下所有优惠活动都需要显示出来，但是选中其中一个后，其他优惠活动变为不可用——“不与其他优惠同享”
        if (categoryId == 1) {//1=银行优惠
            var selectedBankActivityId; //当前选中的银行优惠活动的Id
            for (var i = 0; i < PreferentialProject.selectedActivities.length; i++) {
                if (this.selectedActivities[i].CategoryID == categoryId) {
                    var bankActivity = PreferentialProject.selectedActivities[i];
                    selectedBankActivityId = bankActivity.Activities[0].PreferentialID;
                    break;
                }
            }
            var lis = $("input[name='preferential_" + categoryId + "']").parent().parent(); //银行大类下的优惠
            if (selectedBankActivityId) {
                lis.each(function () {
                    var o = $(this);
                    var currentVal = o.find("input[type='checkbox']").val();
                    if (currentVal != selectedBankActivityId) {
                        o.addClass('check-disable');
                        o.find('.dis-price p.p3').hide();
                        o.find('.dis-price').addClass('no-line');
                        o.find('.dis-price p.p4').html("不与" + "其他优惠" + "同享").show();
                    }
                });
            }
            else {
                lis.each(function () {
                    var o = $(this);
                    o.removeClass('check-disable');
                    o.find('.dis-price').removeClass('no-line');
                    o.find('.dis-price p.p4').html('').hide();
                    o.find('.dis-price p.p3').show();
                });
            }
        }
    },
    // 设置默认选中
    setChecked: function () {
        var result = false;
        if (PreferentialProject.jsonData) {
            var preferentials = PreferentialProject.jsonData.Preferentials;
            if (preferentials && preferentials.length > 0) {
                for (var i = 0; i < preferentials.length; i++) {
                    var preferential = preferentials[i];
                    for (var j = 0; j < preferential.Activities.length; j++) {
                        var activity = preferential.Activities[j];
                        if (activity.Checked) {
                            result = true;
                            $("input[type='checkbox'][id='" + activity.PreferentialID + "']").parent().parent().click();
                        }
                    }
                }
            }
        }
        var preferentialIds = $("#PreferentialIDs").val().split(',');
        for (var i = 0; i < preferentialIds.length; i++) {
            var o = $("input[type='checkbox'][id='" + preferentialIds[i] + "']").parent().parent().addClass('check-disable');
        }
        return result;
    },
    // 选择优惠活动
    activitySelect: function (e, preferentialId, categoryId) {
        var disabled = $(e).attr("disabled");
        if (disabled == "disabled") return false;
        // console.info(preferentialId);
        var preferentialModel = this.getCategory(categoryId);

        //var checked = $(e).parent().find("input[type='checkbox']").prop("checked");
        var checked = $(e).closest("li").hasClass("check-on");
        if (checked) {
            PreferentialProject.removeActivity(preferentialId);
            this.categoryMutexCheck(categoryId);
            // 重新生成预订清单
            renderBooklist();
            // 将已选择的优惠活动写入隐藏域
            $('#hidSelectedActivities').val(JSON.stringify(PreferentialProject.selectedActivities));

            // 3大类和积分、优惠券的互斥情况
            if (preferentialModel.CategoryID == 1) {
                // 银行不与积分、优惠券同享
                var o = $('#j_paymentTab').find('.dis-content');
                o.find('.dis-topic').children('span:first').removeClass('item-disable');
                o.find('.dis-topic').children('span:eq(1)').show();
                o.find('.dis-topic').children('span:eq(2)').html('').hide();

                o.find('.dis-jf .jf-con').show();
                o.find('.dis-jf .jf-topic').children('span:eq(1)').show();
                o.find('.dis-jf .jf-topic').children('span:eq(2)').html('').hide();
            }
            else if (preferentialModel.CategoryID == 2) {
                // 立减不与优惠券同享(优惠券属于立减类优惠，而立减类内互斥)
                var o = $('#j_paymentTab').find('.dis-content .dis-topic');
                o.children('span:first').removeClass('item-disable');
                o.children('span:eq(1)').show();
                o.children('span:eq(2)').html('').hide();
            }
            //是否选中的是宝钢优惠
            if (PreferentialProject.selectedCoupons != null && PreferentialProject.selectedCoupons.suppelierID == 35) { //宝钢优惠券-去掉已选中的标准优惠,标记为不能与宝钢优惠同享
                if (preferentialModel.CategoryID == 3) { //选中宝钢优惠券后将选中的标准优惠活动设置为不选中
                    $('#j_paymentTab').find('ul.dis-con li.check-on').each(function () {
                        $(this).click();
                    });
                }
            }
        }
        else {
            // 获取该优惠活动的父类
            if (preferentialModel.InnerMutex == 0) { //类内互斥
                // 如果类内互斥，判断子类是否有选中的
                var selectedArr = [];
                $("input[name='preferential_" + categoryId + "']:checked").each(function () {
                    if ($(this).attr("id") != preferentialId) {
                        selectedArr.push($(this).val());
                    }
                });
                // 如果有，取消选中该大类下的所有优惠活动
                if (selectedArr.length > 0) {
                    $("input[name='preferential_" + categoryId + "']:checked").each(function () {
                        $(this).prop("checked", false);
                        PreferentialProject.removeActivity($(this).val());
                    });
                }
                // 3大类和积分、优惠券的互斥情况
                if (preferentialModel.CategoryID == 1) {
                    // 银行不与积分、优惠券同享
                    var o = $('#j_paymentTab').find('.dis-content');
                    var o1 = o.find('.dis-topic').children('span:first');
                    if (o1.hasClass('dis-topic-on')) {
                        o1.click();
                    }
                    o1.addClass('item-disable');
                    o.find('.dis-topic').children('span:eq(1)').hide();
                    o.find('.dis-topic').children('span:eq(2)').html('<em class="number">不与银行优惠同享</em>').show();

                    o.find('.dis-jf .jf-con').hide();
                    o.find('.dis-jf .jf-topic').children('span:eq(1)').hide();
                    o.find('.dis-jf .jf-topic').children('span:eq(2)').html('<em>不与银行优惠同享</em>').show();
                }
                else if (preferentialModel.CategoryID == 2) {
                    // 立减不与优惠券同享(优惠券属于立减类优惠，而立减类内互斥)
                    var o = $('#j_paymentTab').find('.dis-content');
                    var o1 = o.find('.dis-topic').children('span:first');
                    if (o1.hasClass('dis-topic-on')) {
                        o1.click();
                    }
                    o1.addClass('item-disable');
                    o.find('.dis-topic').children('span:eq(1)').hide();
                    o.find('.dis-topic').children('span:eq(2)').html('<em class="number">不与立减优惠同享</em>').show();
                }
            }
            // 选中的优惠活动
            PreferentialProject.pushActivity(preferentialId,
                preferentialModel.CategoryID,
                preferentialModel.CategoryName,
                preferentialModel.MutexCode,
                preferentialModel.InnerMutex,
                0);
            // 互斥检测
            PreferentialProject.categoryMutexCheck();
            // 重新生成预订清单
            renderBooklist();
            // 将已选择的优惠活动写入隐藏域
            $('#hidSelectedActivities').val(JSON.stringify(PreferentialProject.selectedActivities));
        }
    },
    //选择银行优惠活动
    bankactivitySelect: function (e, preferentialId, categoryId) {
        //1.清除所有的优惠活动
        PreferentialProject.selectedActivities = [];
        var preferentialModel = this.getCategory(categoryId);
        PreferentialProject.pushActivity(preferentialId,
            preferentialModel.CategoryID,
            preferentialModel.CategoryName,
            preferentialModel.MutexCode,
            preferentialModel.InnerMutex,
            0);
        //是否清除优惠券的判断
        if ($("#HaveTicket").val() == 0) {
            PreferentialProject.selectedCoupons = null;
        }
        if ($("#HaveScore").val() == 0) {
            PreferentialProject.usedPoint = null;
        }
        if ($("#hidIsUseScore").val() == '1') {
            $("#btnUseScore").click();
        }
        $('#j_slide_coupon_content').find(">div[class='sale-coupon sale-coupon-hover']").each(function () {
            $(this).attr("class", "sale-coupon");
            PreferentialProject.selectedCoupons = null;
            $('#txtUseVoucher').val('');

            // 取消和银行的互斥，以及立减类内的互斥
            // 第1步，取消和银行的互斥
            var lis = $("input[name='preferential_" + 1 + "']").parent();
            lis.each(function () {
                $(this).find("input[type='checkbox'],label").show();
                $(this).find("span").remove();
            });
            // 第2步，取消立减类内互斥
            var lis = $("input[name='preferential_" + 2 + "']").parent();
            lis.each(function () {
                $(this).find("input[type='checkbox'],label").show();
                $(this).find("span").remove();
            });
            // 大类互斥检测
            for (var i = 0; i < PreferentialProject.jsonData.Preferentials.length; i++) {
                var categoryId = PreferentialProject.jsonData.Preferentials[i].CategoryID
                PreferentialProject.categoryMutexCheck(categoryId);
            }
        });
        if ($('#hidPageType').val() == 2) {
            // 重新生成预订清单
            renderBooklist();
        }
        // 将已选择的优惠活动写入隐藏域
        $('#hidSelectedActivities').val(JSON.stringify(PreferentialProject.selectedActivities));
    },
    //清除所有的优惠
    clearactivitySelect: function (type) {
        PreferentialProject.selectedActivities = [];
        if (type == 1) {
            var CheckBankPreferentialId = $("#CheckBankPreferentialId").val();
            if (CheckBankPreferentialId > 0) {
                $('#CheckedBank_' + CheckBankPreferentialId).parent().parent().click();
                $("#CheckBankPreferentialId").val(0);
            } else {
                $("#j_paymentTab").find("ul.bankp").find('li:first label').click();
            }
        } else {
            if ($('#hidIsUseTicket').val() == '1') {
                $('#btnUseVoucher').click();
            }
            if ($('#hidIsUseScore').val() == '1') {
                $('#btnUseScore').click();
            }
            $('#j_paymentTab').find('.check-on').each(function () {
                //所有已选中的优惠再次点击=全部取消
                $(this).click();
            });
            $("#j_paymentSubTab").children('ul:first').find("li:first label").click();
            $("#j_paymentSubTab").find('ul.pay-bank-list:first').find("li:first label").click();
            PreferentialProject.selectedActivities = [];
            //如果用户之前没有选中优惠活动则默认最大的优惠，否则默认选中用户选中
            var IsUsePreferential = $("#IsUsePreferential").val();
            if (IsUsePreferential == 1) {
                PreferentialProject.setChecked(); //设置默认选中项被默认选中
                $("#IsUsePreferential").val(0);
            } else {
                //默认选中最大的优惠
                $("input[type='checkbox'][name*='preferential_']").parent().parent().click();
            }
            // 重新生成预订清单
            renderBooklist();
            // 将已选择的优惠活动写入隐藏域
            $('#hidSelectedActivities').val(JSON.stringify(PreferentialProject.selectedActivities));
        }
    }
};
