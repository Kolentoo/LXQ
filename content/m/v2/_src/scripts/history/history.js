"use strict";

$('.clear-history').on('click', function () {
    _uzm.cookie.del('uzmRecordView');
    _uzm.pop.toast('删除成功！');
    $('#j_history').empty();
});