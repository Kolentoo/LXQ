/********************************************************
* Description: 下单流程第二步推荐支付方式优惠方案
* Creator: 
* Create Date:
* History:
* ------------------------------------
* Update Date   |   Author   |    Note
* 2017-03-15    |   fangyang |   create
* 
* ******************************************************/

$(function() {
    //已使用(任何)优惠和拆单不做银行优惠
    if($("input[id^='bankrp_']").val() != "" && $('#CheckPreferential').val() == 1 && $('#OrderId').val().indexOf('S_') < 0) {
        $.getScript("//r.uzaicdn.com/content/pay2017/scripts/preferential.js", function() {
            $("input[id^='bankrp_']").on('click', function() {
                var o = $(this);
                $('#hidPageType').val('1');
                PreferentialProject.bankactivitySelect(this, o.attr('id').split('_')[1], 1);
                $('#hidPageType').val('2');
            });
            $("input[name='pay_bank']").not("input[id^='bankrp_']").on('click', function() {
                $('#hidPageType').val('1');
                PreferentialProject.selectedActivities = [];
                $('#hidSelectedActivities').val(JSON.stringify(PreferentialProject.selectedActivities));
            });
            //默认选中第一个
            $("input[id^='bankrp_']").each(function () {
                $(this).click();
                return false;
            });
        });
    }
    $("input[id^='bankrp_']").each(function () {
        $(this).click();
        return false;
    });
});