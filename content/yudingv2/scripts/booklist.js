/*
* 预订清单渲染类
*/
var BookList = {
    /*
    * 订单对象
    */
    orderParam: function (adultCount, childCount, adultAmount, childAmount) {
        var order = new Object();
        order.adultCount = adultCount; // 成人数
        order.childCount = childCount; // 儿童数
        order.adultAmount = adultAmount; // 成人团费
        order.childAmount = childAmount; // 儿童团费
        return order;
    },
    /*
    * 附加产品
    */
    attachProduct: function (name, useDate, price, count, type) {
        var attachment = new Object();
        attachment.name = name; // 附加产品名称
        attachment.useDate = useDate; // 使用日期，非保险类可为空
        attachment.price = price; // 单价
        attachment.count = count; // 数量
        attachment.type = type; // 类型(0=单房差，1=保险，2=境外参, 3=其他附加产品)
        return attachment;
    },
    /*
    * 优惠活动对象
    */
    preferentialActivity: function (name, totalPrice, type, ticketType) {
        var activity = new Object();
        activity.name = name; // 活动名称
        activity.totalPrice = totalPrice; // 活动优惠总额或面值
        activity.type = type; // 活动类型(0=普通，1=积分，2=券)
        activity.ticketType = ticketType; //如果活动类型是券，则该字段标识券的类型(1=抵扣券，2=折扣券)
        return activity;
    },
    /*
    * 获取实际支付金额
    * @param order 订单对象
    * @param attachments 附加产品
    * @param preActivities 选择的优惠活动
    */
    getTotalPayAmount: function (order, attachments, preActivities) {
        // 团费总额
        var tuanAmount = order.adultCount * order.adultAmount + order.childCount * order.childAmount;
        // 附加产品总额
        var attachmentAmount = 0;
        for (var i = 0; i < attachments.length; i++) {
            var attachment = attachments[i];
            attachmentAmount += attachment.price * attachment.count;
        }
        // 优惠总额
        var discount; //折扣
        var preferentialAmount = 0;
        for (var i = 0; i < preActivities.length; i++) {
            var activity = preActivities[i];
            preferentialAmount += activity.totalPrice;
        }
        payAmount = parseFloat(tuanAmount + attachmentAmount - preferentialAmount).toFixed("2");
        payAmount = payAmount <= 0 ? "0.00" : payAmount;
        return payAmount;
    },
    /*
    * 渲染附加产品
    * @param attachments 附加产品
    * @return html
    */
    renderAttachment: function (attachments) {
        var html = "";

        if (attachments && attachments.length > 0) {
            for (var i = 0; i < attachments.length; i++) {
                var attachment = attachments[i];

                var finallyClass = i == 0 ? "finally-box" : "finally-box finally-box-margin";
                var totalAmount = attachment.price * attachment.count;

                var template = $("#attachTemplate").html();
                template = template.replace(/{finallyClass}/, finallyClass);
                template = template.replace(/{attachmentName}/, attachment.name);
                template = template.replace(/{attachmentCount}/, attachment.count);
                template = template.replace(/{attachmentAmount}/, attachment.price);
                template = template.replace(/{attachmentTotalAmount}/, totalAmount);

                html += template;
            }
        }
        else {
            html = "<span class='finally-box'>无</span>";
        }

        return html;
    },
    /*
    * 渲染优惠信息
    * @param attachments 附加产品
    * @return html
    */
    renderActivity: function (order, preActivities) {
        var activityHtml = "";
        if (preActivities && preActivities.length > 0) {
            var tuanAmount = order.adultCount * order.adultAmount + order.childCount * order.childAmount;
            for (var i = 0; i < preActivities.length; i++) {
                var activity = preActivities[i];
                var preferentialAmount = activity.totalPrice;
                //if (activity.ticketType == 2) {// ticketType=2表示是折扣券
                //    var preDiscount = (100 - activity.totalPrice) / 100; //优惠力度，打9折，此处值为10
                //    preferentialAmount = Math.floor(tuanAmount * preDiscount);
                //}
                var html = $('#activityTemplate').html();
                html = html.replace(/{activityName}/, activity.name);
                html = html.replace(/{preTotalAmount}/, preferentialAmount.toFixed(2));
                activityHtml += html;
            }
        }
        else {
            activityHtml = "<span class='finally-box'>无</span>";
        }
        return activityHtml;
    },
    /*
    * 渲染旅游团费
    * @param attachments 附加产品
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

        return html;
    },
    /*
    * 渲染预订清单
    * @param order 订单对象
    * @param attachments 附加产品
    * @param preActivities 选择的优惠活动
    */
    render: function (order, attachments, preActivities) {
        // 旅游团费
        var html = this.renderTravelCost(order);

        // 附加产品
        var attachment_html = this.renderAttachment(attachments);

        // 优惠信息
        var preferential_html = this.renderActivity(order, preActivities);

        html = html.replace(/{attachmentHtml}/, attachment_html);
        html = html.replace(/{activityHtml}/, preferential_html);
        var totalAmount = this.getTotalPayAmount(order, attachments, preActivities);
        html = html.replace(/{totalAmount}/, totalAmount);

        return html;
    }
}