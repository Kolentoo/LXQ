define(function (require, exports, module) {
    require('./sortElements');
    exports.init = function (flag,page) {
        listFirlter('route-screen', flag,page);
    }
});

function listFirlter(id,flag,page) {
    var op = $('#' + id);
    op = (op.get(0) == null) ? $('.' + id) : op;
    if (op.get(0) != null) {
        $('#btnScreenSure').on(_tap, function () {

            var owrap = $('#con-list-tab');

            owrap.find('.fn-more').attr('data-action', 'filter');
            owrap.find('.fn-more').attr('data-page', '1');

            var o = $(this);


            var tripdate="";
            var tripport="";
            var tripdays="";
            var tripcompany="";
            var tripname="";
            
            var triptheme="";
            var tripscenery="";
            var tripgroup = "";

            var tripdestination = "";

            var tripspecial="";
            var triphot="";

            if (flag == 'youlun') {
                tripdate = $('div.route-wrap').find('li[flag=tripdate]').find('select').val();
                tripport = $('div.route-wrap').find('li[flag=tripport]').find('select').val();
                tripdays = $('div.route-wrap').find('li[flag=tripdays]').find('select').val();
                tripcompany = $('div.route-wrap').find('li[flag=tripcompany]').find('select').val();
                tripname = $('div.route-wrap').find('li[flag=tripname]').find('select').val();

            } else if (flag == 'list') {
                tripdate = $('div.route-wrap').find('li[flag=tripdate]').find('select').val();
                tripdays = $('div.route-wrap').find('li[flag=tripdays]').find('select').val();
                triptheme = $('div.route-wrap').find('li[flag=triptheme]').find('select').val();
                tripscenery = $('div.route-wrap').find('li[flag=triptheme]').find('select').val();
                tripgroup = $('div.route-wrap').find('li[flag=triptheme]').find('select').val();

            } else if (flag == 'u') {
                tripdestination = $('div.route-wrap').find('li[flag=tripdestination]').find('select').val();
                triptheme = $('div.route-wrap').find('li[flag=triptheme]').find('select').val();
                tripdays = $('div.route-wrap').find('li[flag=tripdays]').find('select').val();
            }

                var tripspecial = $('#rdSpecial').prop("checked") == true ? "1" : "0";
                var triphot = $('#rdHot').prop("checked") == true ? "1" : "0";


            console.log(tripdate + '-' + tripport + '-' + tripdays + '-' + tripcompany + '-' + tripname);

            //$('.route-arrow').click();

            var liList = $('#initData').find('li');
            owrap.find('.bd').find('li').hide();

            var liU = owrap.find('.bd').find('ul');
            
            $('#cloneTemp').remove();
            $('body').append("<ul id='cloneTemp' />");
            var liUTemp = $('#cloneTemp');

            liList.each(function (k) {
                var oli = $(this);
                var s = "";
                
                if (flag == 'youlun') {
                    if (
                        (oli.attr('data-tripdate').indexOf(tripdate) > -1 || tripdate == '全部')
                        && (oli.attr('data-tripport') == tripport || tripport == '全部')
                        && (oli.attr('data-tripdays') == tripdays || tripdays == '全部')
                        && (oli.attr('data-tripcompany') == tripcompany || tripcompany == '全部')
                        && (oli.attr('data-tripname') == tripname || tripname == '全部')
                        && (oli.attr('data-special') == tripspecial)
                        && (oli.attr('data-hot') == triphot)
                        ) {

                        oli.attr('data-action', 'filter');
                        s = oli.clone();

                        liUTemp.append(s);
                    }
                }else if(flag == 'list') {
                    if (
                        (oli.attr('data-tripdate').indexOf(tripdate) > -1 || tripdate == '全部')
                        && (oli.attr('data-tripdays') == tripdays || tripdays == '全部')
                        && (oli.attr('data-triptheme') == triptheme || triptheme == '全部')
                        && (oli.attr('data-tripscenery').indexOf(tripscenery) > -1 || tripscenery == '全部')
                        && (oli.attr('data-tripgroup').indexOf(tripgroup) > -1 || tripgroup == '全部')
                        && (oli.attr('data-special') == tripspecial)
                        && (oli.attr('data-hot') == triphot)
                        ) {

                        oli.attr('data-action', 'filter');
                        s = oli.clone();

                        liUTemp.append(s);
                    }
                }
                else if (flag == 'u') {
                    if (
                        (oli.attr('data-tripdestination') == tripdestination || tripdestination == '全部')
                        && (oli.attr('data-tripdays') == tripdays || tripdays == '全部')
                        && (oli.attr('data-triptheme') == triptheme || triptheme == '全部')
                        && (oli.attr('data-special') == tripspecial)
                        && (oli.attr('data-hot') == triphot)
                        ) {

                        oli.attr('data-action', 'filter');
                        s = oli.clone();

                        liUTemp.append(s);
                    }
                }

            });

            liU.html(liUTemp.html());
            

            listFirstScreenLoad('con-list-tab', page);

            $('.route-arrow').click();

            $('#con-list-tab .hd li').eq(0).click();

        });
    }
}

 