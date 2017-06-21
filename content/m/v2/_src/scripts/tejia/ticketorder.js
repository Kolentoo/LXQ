"use strict";

$(function () {

    $('#j_popTip').on('click', function () {
        var Targe = $("#Targe").val();
        var o = $(this);
        var sb = [];
        sb.push("<div class='pop-wraper'>");
        sb.push("<div class='pop-wraper-box f14 tc'>");
        sb.push("<div class='hd f999'>礼包内容说明</div>");
        sb.push("<div class='bd' style='text-align:left'>" + Targe + "</div>");
        sb.push("</div>");
        sb.push("</div>");

        $('body').append(sb.join(''));

        $('.pop-wraper').on('click', function () {
            var oo = $(this);
            oo.remove();
        });

    });

    $('.orders-jp').find('.min').on('click', function () {
        var o = $(this);
        o.parents('tr').remove();
        if ($('.orders-jp').find('.min').length <= 0) {
            $(".next").find(".orange").text("￥" + 0);
        }
        var userids = "";
        $('.orders-jp').find('.min').each(function () {
            //计算乘机人数量，保存至表单，根据乘机人数量算出总价
            var len = $('.orders-jp').find('.min').length;
            $("#hidPersonNum").val(len);
            var price = $("#hidPersonPrice").val();
            var sumPrice = parseFloat(len) * parseFloat(price);
            $(".next").find(".orange").text("￥" + sumPrice);

            //获取现有乘机人ID
            var uid = $(this).parents("td").find("#UserID").val();
            userids += uid + ",";
        });

        if (userids) {
            userids = userids.substr(0, userids.length - 1);
        }
        $("#addCustor").attr("href", $("#addCustor").attr("href").split('&')[0] + "&psgids=" + userids);

    });

    $('.orders-jp').find('.min').each(function () {
        //计算乘机人数量，保存至表单，根据乘机人数量算出总价
        var len = $('.orders-jp').find('.min').length;
        $("#hidPersonNum").val(len);
        var price = $("#hidPersonPrice").val();
        var sumPrice = parseFloat(len) * parseFloat(price);
        $(".next").find(".orange").text("￥" + sumPrice);
    });


    //点击下一步
    $("#goNext").click(function () {
        if ($('.orders-jp').find('.min').length < 1) {
            alert("请至少保留一位乘机人信息！");
            return false;
        }

        //验证联系人信息是否为空
        if (!$("#LinkName").val()) {
            alert("联系人不能为空");
            return false;
        }
        if (!$.trim($("#LinkPhone").val())) {
            alert("联系人手机必填");
            return false;
        }
        else {
            if (!_uzm.regexForm.mobile($.trim($("#LinkPhone").val()))) {
                alert("联系人手机格式错误");
                return false;
            }
        }

        //获取所有乘机人信息
        var clientArr = "";
        $('.orders-jp').find('.min').each(function () {
            //将所有乘机人信息保存到隐藏表单
            var o = $(this);
            var type = o.parents("td").find("#PapersType").val();
            var en_person_RealName = o.parents("td").find(".name").text();
            var en_person_Nationality = o.parents("td").find("#MotherLand").val();
            var en_person_Code = o.parents("td").find("#PassportNO").val();
            var en_person_Sex = o.parents("td").find("#Sex").val();
            var qianfadate = o.parents("td").find("#PassportExpireDate").val();
            var en_person_Valiad = o.parents("td").find("#PassportExpireDate").val();
            var en_person_Birthday = o.parents("td").find("#BirthDay").val();
            var en_person_CodeAddress = o.parents("td").find("#PassportSignedCountry").val();
            var qianzhutype = "";
            clientArr += "{'name':'" + en_person_RealName + "','type':'" + type + "','nationality':'" + en_person_Nationality + "','no':'" + en_person_Code + "','sex':'" + en_person_Sex +
                                           "','youxiaoqi':'" + en_person_Valiad + "','birth':'" + en_person_Birthday + "','qianfade':'" + en_person_CodeAddress + "','qianzhutype':'" + qianzhutype + "','mobile':'','address':'','qianfadate':'" + qianfadate + "','selectUser':'0','isUpOrAdd':'0','ageType':'0','enname':''},";



        });
        if (clientArr && clientArr.length >= 1) {
            clientArr = "'client':[" + clientArr.substr(0, clientArr.length - 1) + "]";
        }
        var userJsonObject = "{" + clientArr + "}";
        $("#txtHiddenUList").val(userJsonObject); //游客、用户信息
        $("#GoOrder").submit();

    });

});






