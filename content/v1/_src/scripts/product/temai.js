$(function () {
    tmCalendar();
    tmSlides();
});



function tmSlides() {
    //特卖主体
    var ow = screen.width;
    var box = $('.j_tmImageList');
    if (box.get(0)) {
        box.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            next: 'slides-next',
            prev: 'slides-prev',
            slideSpeed: 300,
            slideEasing: "easeOutQuad",
            effect: 'slide',
            hoverPause: false,
            pause: 1000,
            play: 0,
            generateNextPrev: false,
            generatePagination: false,
            animationComplete: function (current) {
                //处理延迟
                box.each(function () {
                    var oo = $(this);
                    var osc = oo.find('.item');
                    var imgs = osc.find('img');
                    imgs.each(function () {
                        var oo = $(this);
                        var ooSrc = oo.attr('data-original');
                        oo.attr('src', ooSrc);
                    });
                });

            }
        });

        if (ow <= 1152) {
            box.find('.slides_container').find('.item').width('954px');
        } else {
            box.find('.slides_container').find('.item').width('1153px');
        }
    }
}

function tmCalendar() {
    var pid = $('#pid').val();
    if (!pid) {
        return;
    }
    var box = $('#j_tmCalendar');
    var cfg = {
        jsonpUrl: 'http://sh.uzai.com/ashx/ashx_Calendar.ashx?pid=' + pid + "&type=1",
        extCallBack: function (year, month) { //扩展回调方法
            //trigger
            var items = box.find('.item');
            var blocks = box.find('a.block');
            if ($("#j_tmCalendarTipBox").length) {
                blocks.powerFloat({
                    reverseSharp: true,
                    position: "7-5",
                    target: "#j_tmCalendarTipBox",
                    showCall: function (e) {
                        yhTips($(this), e);
                    }
                });
            }

        },
        preCallback: function (year, month) { //初次回调方法

        }
    };
    if (box.get(0)) {
        box.jsonMultiCalendar(cfg);
    }
}