define(function (require, exports, module) {
    var unveil = require('unveil');
    exports.init = function (scope) {
        var op = $('#' + scope);
        op = (op.get(0) == null) ? $('.' + scope) : op;
        if (op.get(0) != null) {

            op.find('img').unveil();

             
        }


    }
});