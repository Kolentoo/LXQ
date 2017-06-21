$(function () {
    _uzw.ui.tab('j_tab');
    _uzw.ui.tab('j_visaPopTab');

    popTerms();
    orderGoBack();
    addVisaUser();
    userRowEvents();
    viewStatus();
    popCalendar();

    changeVisaFile();

});

winLoadFix(function () {
    new PCAS("province", "city", "area", "上海市");
});


function popTerms() {

    $('#j_terms').on('click', function () {
        unitPop();
    });

    $('#j_userRows').on('click', '.j_popVisaHelp', function () {
        unitPop();
    });

    var unitPop = function () {
        //<div class="visa-pop-mask hide"> </div>
        $('.visa-pop-mask').remove();

        //load mask
        $('body').append("<div class='visa-pop-mask hide'> </div>");
        $('.visa-pop-mask').show();
        $('#j_visaPopMod').show();

        $('#j_visaPopMod').find('.close').on('click', function () {
            $('#j_visaPopMod').hide();
            $('.visa-pop-mask').remove();
        });

        $('#j_visaPopMod').find('input').on('click', function () {
            $('#j_visaPopMod').find('.close').click();
        });


        return false;
    };
}

function orderGoBack() {
    $('#j_visaTit').find('.back').on('click', function () {
        history.go(-1);
    });
}


function addVisaUser() {
    var rg = $('#j_rowTrigger');
    var voucher = rg.next('.voucher');
    voucher.find('input').on('change', function () {
        var o = $(this);
        var op = o.parents('.d1').next('.d2');
        if (o.prop('checked')) {
            op.show();
        } else {
            op.hide();
        }
    });
}

//row events
function userRowEvents() {
    var ur = $('#j_userRows');
    var popSlide = $('#j_visaPopSlide');

    //change status
    ur.on('click', '.status', function () {
        var o = $(this);
        if (o.hasClass('on')) {
            o.removeClass('on');
        } else {
            o.addClass('on');
        }
    });

    //instrument
    ur.on('click', '.p2', function () {
        var o = $(this);
        var oli = o.parent('li');
        var index = oli.index();

        $('.visa-pop-mask').remove();

        //load mask
        $('body').append("<div class='visa-pop-mask hide'> </div>");
        $('.visa-pop-mask').show();
        popSlide.show();

        popSlide.find('.close').on('click', function () {
            popSlide.hide();
            $('.visa-pop-mask').remove();
        });

        popSlide.find('.pagination').find('li').eq(index).find('a').click();

    });

    //close user row
    ur.on('click', '.close', function () {
        var o = $(this);
        var op = o.parent('.user-row');
        op.remove();
    });

    //slide
    var sb = popSlide.find('.slide-box');
    if (sb.get(0)) {
        //sb.slides({
        //    generateNextPrev: true,
        //    generatePagination: true,
        //    effect: 'fade'
        //});
    }

}

function viewStatus() {
    var popMod = $('#j_visaPopStatus');
    $('#j_viewStatus').on('click', function () {
        $('.visa-pop-mask').remove();

        //load mask
        $('body').append("<div class='visa-pop-mask hide'> </div>");
        $('.visa-pop-mask').show();
        popMod.show();

        popMod.find('.close').on('click', function () {
            popMod.hide();
            $('.visa-pop-mask').remove();
            return false;
        });
    });
}

function popCalendar() {
    $('.j_chooseDate').on('click', function () {
        var o = $(this);
        popSchdule(o);
    });
}

function popSchdule(node) {
    var oss = $('#j_scheduleSub');
    oss.remove();

    $('.visa-pop-mask').remove();
    //load mask
    $('body').append("<div class='visa-pop-mask hide'> </div>");
    $('.visa-pop-mask').show();

    $('body').append("<div id='j_scheduleSub' class='ca-norm'><a class='close'>&times;</a></div>");
    oss = $('#j_scheduleSub');
    oss.jsonCalendar({
        jsonpUrl: '',
        latestDate: '',//初始最近班期
        isSmart: false,//是否是智能双日历
        extCallBack: function (year, month) {
            oss.find('td.item').on('click',function () {
                var oa = $(this);
                var oy = oa.attr('data-year');
                var om = oa.attr('data-month');
                var od = oa.attr('data-day');
                node.val(oy + '-' + om + '-' + od);
                oss.find('a.close').click();
            });
            //console.log(year, month);
        },
        preCallback: function (year, month) {//上月下月预回调
            //console.log(year, month);
        }
    });
    oss.find('a.close').on('click', function () {
        $('.visa-pop-mask').remove();
        oss.remove();
    });
}

function changeVisaFile() {
    $('#selCalback').on('change', function () {
        var o = $(this);
        var ov = parseInt(o.val(), 10);
        var jv = $('#j_getVisaProfile');
        var items = jv.find('.item');
        items.hide();
        items.eq(ov-1).show();
    });
}