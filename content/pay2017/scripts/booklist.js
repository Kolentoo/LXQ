/*
* 预订清单渲染类
*/
var BookList = {
    /*
    * 订单对象
    */
    orderParam: function (adultCount, childCount, adultAmount, childAmount, points) {
        var order = new Object();
        order.adultCount = adultCount; // 成人数
        order.childCount = childCount; // 儿童数
        order.adultAmount = adultAmount; // 成人团费
        order.childAmount = childAmount; // 儿童团费
        order.points = points; // 预订该产品可获得的积分数
        return order;
    },
    /*
    * 优惠活动对象
    */
    preferentialActivity: function (name, totalPrice, type) {
        var activity = new Object();
        activity.name = name; // 活动名称
        activity.totalPrice = totalPrice; // 活动优惠总额
        activity.type = type; // 活动类型(0=优惠平台，1=积分，2=券，3=tisp活动)
        return activity;
    },
    /*
    * 获取实际支付金额
    * @param order 订单对象
    * @param preActivities 选择的优惠活动
    */
    getTotalPayAmount: function (order, preActivities) {
        //var tuanAmount = order.adultCount * order.adultAmount + order.childCount * order.childAmount;
        var tuanAmount = parseFloat($("#OrderPayMent").val());
        var attachmentAmount = parseFloat($("#ProdAndAddAllPrice").val()); //附加产品的价格
        var preferentialAmount = 0;
        for (var i = 0; i < preActivities.length; i++) {
            var activity = preActivities[i];
            if ($("#HaveTicket").val() == "1" && activity.type == 2) {
                continue;
            }
            if ($("#HaveScore").val() == "1" && activity.type == 1) {
                continue;
            }
            if ($("#isUseTisp").val() == "1" && activity.type == 3) {
                continue;
            }
            preferentialAmount += parseFloat(activity.totalPrice);
        }

        var payAmount = tuanAmount - preferentialAmount;
        return payAmount.toFixed(2);
    },
    /*
    * 渲染附加产品
    * @return html
    */
    renderAttachment: function () {
        var attachments = $("#attachedList") && $("#attachedList").html() ? "<div class='sum-inner' id='attachedList'>" + $("#attachedList").html() + "</div>" : "";
        return attachments;
    },
    /*
    * 渲染优惠信息
    * @param preActivities 选择的优惠活动
    * @return html
    */
    renderActivity: function (preActivities) {
        var activityHtml = "";
        var apTotal = 0.00;
        if (preActivities) {
            for (var i = 0; i < preActivities.length; i++) {
                var activity = preActivities[i];
                var html = $('#_activityTemplate').html();
                html = html.replace(/{activityName}/, activity.name);
                html = html.replace(/{preTotalAmount}/, parseFloat(- activity.totalPrice).toFixed(2));
                activityHtml += html;
                apTotal += activity.totalPrice;
            }
        }
        return activityHtml != '' ? $('#activityTemplate').html().replace(/{_activityHtml}/, activityHtml).replace(/{apTotal}/, parseFloat(- apTotal).toFixed(2)) : "";
    },
    /*
    * 渲染旅游团费
    * @param order 订单对象
    * @return html
    */
    renderTravelCost: function (order) {
        var html = $('#bookListTemplate').html();
        // 参数
        var adultTotal = order.adultCount * order.adultAmount;
        var childTotal = order.childCount * order.childAmount;
        // 模板替换
        html = html.replace(/{adultCount}/, order.adultCount);
        html = html.replace(/{adultAmount}/, order.adultAmount);
        html = html.replace(/{adultTotal}/, adultTotal);
        html = html.replace(/{childCount}/, order.childCount);
        html = html.replace(/{childAmount}/, order.childAmount);
        html = html.replace(/{childTotal}/, childTotal);
        html = html.replace(/{acTotal}/, adultTotal + childTotal);

        return html;
    },
    /*
    * 渲染预订清单
    * @param order 订单对象
    * @param preActivities 选择的优惠活动
    */
    render: function (order, preActivities) {
        // 旅游团费
        var html = this.renderTravelCost(order);
        // 附加产品
        var attachment_html = this.renderAttachment();
        // 优惠信息
        var preferential_html = this.renderActivity(preActivities);

        html = html.replace(/{attachmentHtml}/, attachment_html);
        html = html.replace(/{activityHtml}/, preferential_html);
        var totalAmount = this.getTotalPayAmount(order, preActivities);
        $("#OrderMoneyAll").html("￥" + totalAmount);
        html = html.replace(/{totalAmount}/, totalAmount);

        return html;
    }
}