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

