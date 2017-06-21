"use strict";

$('#j_searchForm').on('submit', function () {
    var sVal = $.trim($("#j_searchBox").val());
    if (!sVal) {
        _uzm.pop.toast("请输入目的地或景点");
        return false;
    }
});