$(function () {
            setUserChannel();
            //订单操作人
            var userStoreID = $("#txtHiddenStoreID").val();
            $("#_rbtnAdminN").attr("checked", "checked");
            /*if (userStoreID != 785 && userStoreID != 530 && userStoreID != 293 && userStoreID > 0) {
                $("#_rbtnAdminY").attr("checked", "checked");
                $("#_rbtnAdminN").attr("checked", false);
            } else {
                $("#_rbtnAdminN").attr("checked", "checked");
                $("#_rbtnAdminY").attr("checked", false);
            }

            showCont();
            $("input[name=radioOrderAdmin]").click(function () {
                showCont();
            });*/
        });

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

            var city = $("#txtHiddenCity").val();
            if(city != "1" && city != "2"){
                city = "1";
            }

            $("#ddlStoreCity").val(city);

            storeCityChanged();

            if ($("#txtHiddenMType").val() != "1") {
                $("#ddlStoreCity").attr("disabled", "disabled");
                $("#ddlStoreArea").attr("disabled", "disabled");
                $("#ddlStore").attr("disabled", "disabled");
            }
        }

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


        //radio 选中
        function showCont() {
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

        /*设置客户渠道*/
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

        function showInfoPanel(tableId, e) {
            var left = e.offsetLeft - 277;
            var top = e.offsetTop - 350;
            $('#' + tableId).attr("style", "position:absolute;z-index:9999;left:" + left + "px;top:" + top + "px");
            $('#' + tableId).show();
        }
        function hideInfoPanel(tableId) {
            $('#' + tableId).hide();
        }

        //#region 配送方式&Wifi配送方式
        $(".delivery-tab").find("ul").on("click", "li", function () {
            var v = $(this).attr("value");
            $("#txtHiddenDelivery").val(v);
            if (v == "city") {
                $("#radDelivery1").prop("checked", false);
                $("#radDelivery1").parent().parent().parent().css("display", "none");
                $("#radDelivery1").parent().parent().parent().siblings().css("display", "block");
                $(this).addClass("on");
                $(this).siblings().removeClass("on");
            }
            else if (v == "store") {
                $("#radDelivery1").prop("checked", true);
                $("#radDelivery1").parent().parent().parent().css("display", "block");
                $("#radDelivery1").parent().parent().parent().siblings().css("display", "none");
                $(this).addClass("on");
                $(this).siblings().removeClass("on");
            }
        });

        $("div.wifiDelivery").find("ul").on("click", "li", function () {
            var v = $(this).attr("value");
            $("#txtHiddenWifiDelivery").val(v);
            if (v == "C") {
                $("#txtWifiDeliveryAddress").focus();
            }
        });

        function checkValue() {
            var link_name = $.trim($("#txt_name").val());
            var link_mobile = $.trim($("#txt_mobile").val());
            var link_email = $.trim($("#txt_email").val());
            var strat_phone = $.trim($("#txt_start_phone").val());
            var end_phone = $.trim($("#txt_end_phone").val());

            var phone = (strat_phone != "") ? strat_phone + "-" + end_phone : end_phone;

            $("#txtHiddenLinker").val(link_name + "^" + link_mobile + "^" + link_email + "^" + phone); //放在隐藏域中
        }
