"use strict";

var myexports = {};

myexports.init = function () {
    myexports.fix();
    myexports.tab();
};

myexports.fix = function () {
    var h = $(window).height() || screen.height;
    var hr = h - 57 - 30 - 11;
    $('#j_destinationFilter').height(hr);
    $('#j_destinationFilter').find('.hd').height(hr);
    $('#j_destinationFilter').find('.bd').height(hr);

    $('#j_destinationFilter').find('.hd').find('ul').height(hr);
    $('#j_destinationFilter').find('.bd').find('ul').each(function () {
        var oul = $(this);
        oul.height(hr - 10);
    });

};

myexports.tab = function () {
    $('#j_destinationFilter').find('.hd').find('li').on('click', function () {
        var o = $(this);
        var os = o.siblings('li');
        var index = o.index();
        var id = o.attr('id');

        os.removeClass('on');
        o.addClass('on');

        var obd = o.parents('.hd').siblings('.bd');
        var items = obd.find('.item');
        items.hide();

        var citem = items.eq(index);
        citem.show();

        if (citem.find('li').length) {
            return;
        }

        $.ajax({
            type: 'get',
            url: '/DestinationList/' + id,
            dataType: 'json',
            success: function (data) {
                if (data && data.length) {
                    //{"ID":9868,"NavLinkName":"澳门","ParentNavLinkID":9866,"MobileNavIconURL":"http://r03.uzaicdn.com/pic/9097/m/w166/h124/t1","MobileSearchKeyWord":"澳门","NavTypeName":"出境游热门目的地"}
                    var sb = data.map((item, idx, arr) => {
                        let {ID,NavLinkName,ParentNavLinkID,MobileNavIconURL,MobileSearchKeyWord,NavTypeName} = item;
                        return "<li><a href='/wd/?word=" + MobileSearchKeyWord + "' class='block'><p class='p1'><img src='" + MobileNavIconURL + "'></p><p class='p2'>" + NavLinkName + "</p></a></li>";
                    });
                    if (sb.length) {
                        items.eq(index).find('ul').html(sb.join(''));
                    }
                }
            }
        });

    });
};

_util.file.load(_uzm.domain.cdnRandom() + '/content/m/v2/scripts/com/slider.js', function () {
    window.slider && window.slider.api("j_topSlider", "j_topSliderWrap", 5000, true);//详细页面banners
});

$(function () {
    myexports.init();
});
