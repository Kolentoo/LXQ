define(function (require, exports, module) {
    exports.init = function () {
        $('#j_chanel').find('li').on(_tap, function () {
            var o = $(this);
            var op = o.siblings('li');
            op.find('.box-hide').hide();
            o.find('.box-hide').show();
        })
    };


});

