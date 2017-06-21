//简单滑动js
function easySlide(wrapper, prev, next, currentPage, slideNum) {

    var content = $("#" + wrapper);
    if (!content.get(0)) {
        content = $("." + wrapper);
    }

    content.each(function (k, v) {

        var owrap = $(this);
        var page = currentPage;//初始页码
        var i = slideNum; //每版放4个图片

        var content_list = owrap.find('ul');

        var onext = owrap.find('#' + next);
        if (!onext.get(0) ) {
            onext = owrap.find('.' + next);
        }

        var oprev = owrap.find('#' + prev);
        if (!oprev.get(0) ) {
            oprev = owrap.find('.' + prev);
        }

        var len = content_list.find("li").length;
        if (slideNum >= len) {
            onext.hide();
            oprev.hide();
        }

        //向后 按钮
        onext.off('click').on('click', function () {    //绑定click事件
            var o = $(this);
            //向右滚动
            if (!o.hasClass('off')) {

                var v_width = owrap.width();
                var len = content_list.find("li").length;
                var page_count = Math.ceil(len / i);
                if (!content_list.is(":animated")) {
                    if (page == page_count) {
                        //content_list.animate({ left: '0px' }, "slow"); //通过改变left值，跳转到第一个版面
                        //page = 1;
                        o.addClass('off');
                    } else {
                        content_list.animate({ left: '-=' + v_width }, "slow");  //通过改变left值，达到每次换一个版面
                        page++;
                        oprev.removeClass('off');
                        if (page == page_count) {
                            o.addClass('off');
                        }
                    }
                }
            }

        });

        //往前 按钮
        oprev.off('click').on('click', function () {
            var o = $(this);
            //向右滚动
            if (!o.hasClass('off')) {
                var v_width = owrap.width();
                var len = content_list.find("li").length;
                var page_count = Math.ceil(len / i);
                if (!content_list.is(":animated")) {
                    if (page == 1) {
                        //content_list.animate({ left: '-=' + v_width * (page_count - 1) }, "slow");
                        //page = page_count;
                        o.addClass('off');
                    } else {
                        content_list.animate({ left: '+=' + v_width }, "slow");
                        page--;
                        onext.removeClass('off');
                        if (page == 1) {
                            o.addClass('off');
                        }
                    }
                }
            }
        });

    });



}

//弹出框
function popMod(obj, xAxis) {

    var o = $('#' + obj);
    if (!o.get(0) ) {
        o = $('.' + obj);
    }
    var pop = o.parent();

    pop.find('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-colse').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).bind("scroll", function () {
        fixIe6(obj, xAxis);
    });

}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0) ) {
        o = $('.' + obj);
    }
    if (!window.XMLHttpRequest) { o.css("top", $(document).scrollTop() + xAxis); }
}