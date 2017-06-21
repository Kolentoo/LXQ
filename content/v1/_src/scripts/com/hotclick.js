/*
@author:丁坚
@modify:jsonchou 2014-6-4
*/
;(function () {
    var __hotclick = true;
    $(function () {
        $("body").on("click", "a", function () {
            var that = $(this);
            var o = that.parents("[data-chunk]").attr("data-chunk") || "body";
            if (o != "body") {
                var winwidth = parseInt($(window).width() / 2, 10);
                var w = 1;
                var h = 1;
                var d = encodeURIComponent(that.attr("href"));
                var host = location.host + location.pathname;
                var startcity = _ug.cityID;

                var url = "//aj.uzai.com/hotclike.ashx?type=p&v=json";
                var data = "&o=" + o + "&w=" + w + "&h=" + h + "&d=" + d + "&url=" + host + "&startcity=" + startcity + "&rnd=" + Math.random();
                var timg = new Image();
                timg.src = url + data;
            }
        });

        $("body").on("click", "[data-seed]", function () {
            var that = $(this);
            var d = encodeURIComponent(that.attr("data-seed"));
            var host = location.host + location.pathname;
            var startcity = _ug.cityID;
            var url = "//aj.uzai.com/hotclike.ashx?type=p&v=json";
            var data = "&o=data-seed&w=1&h=1&d=" + d + "&url=" + host + "&startcity=" + startcity + "&rnd=" + Math.random();
            var timg = new Image();
            timg.src = url + data;

        });

    });
})();
