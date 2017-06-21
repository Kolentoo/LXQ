var Attachment = function () {
}

Attachment.prototype.getAttachmentInfo = function () {
    var attachmentArr = [];
    var uls = $("tr[id^='attachment_']");
    $("tr[id^='attachment_']").each(function () {
        var td = $(this);
        var count = parseInt($(td).find("[id='attachmentCount']").val(), 10) || 0; //购买份数
        if (count > 0) {
            var relationId = $(this).attr("id").replace(/attachment_/, '');
            var attachmentProperties = []; //附加产品属性

            var addProId = $("#txtHiddenAddProductId_" + relationId).val(); //附加产品Id
            var addGoDateId = ""; //最终选择日期Id(日期详细表Id)
            var addGoDate = ""; //最终选择日期
            var addPrice = ""; //附加产品单价
            var addProfit = ""; //附加产品成本
            var addUnits = $(this).find("input[type='hidden'][id='attachmentUnits']").val(); //单位
            var dateInfo = $(this).find("#hidDateInfo").val(); //选择的使用日期(eg:9424950,2016-09-24,58,50.0000)
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
Attachment.prototype.validate = function(){
    
}