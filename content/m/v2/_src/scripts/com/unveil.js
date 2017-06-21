/*!
 * jsonchou image lazyload
 * d:2014-08-12
 * v:0.1.1
 */

; (function ($) {

    $.fn.unveil = function (threshold, callback) {

        var $w = $(window),
            th = threshold || 0,
            retina = window.devicePixelRatio > 1,
            attrib = retina ? "data-src-retina" : "data-src",
            images = this,
            loaded;

        this.one("unveil", function () {
            var source = this.getAttribute(attrib);
            source = source || this.getAttribute("data-src") || this.getAttribute("data-img") || this.getAttribute("data-original");
            if (source) {
                this.setAttribute("src", source);
                if (typeof callback === "function") callback.call(this);
            }
        });

        function unveil() {
            var inview = images.filter(function () {
                var $e = $(this),
                    wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();

                return eb >= wt - th && et <= wb + th;
            });

            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }

        $w.scroll(unveil);
        $w.resize(unveil);

        unveil();

        return this;

    };

})(window.jQuery || window.Zepto);

var unveil = {};

unveil.init = function (scope) {
    $(function () {
        var op = $('#' + scope);
        op = (!op.get(0)) ? $('.' + scope) : op;
        if (op.get(0)) {
            op.find('img').unveil();
        }
    });
};

