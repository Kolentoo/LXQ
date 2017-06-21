//网站通告
; (function () {

    var _gNotice = function () {

        // if (_ug.city != 'sh') {
        //     return;
        // }

        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var date = new Date().getDate();
        var nd = year + '-' + month + '-' + date;

        var ckName = 'uzwNotice0228';
        if (_uzw.cookie.get(ckName)) {
            return;
        }

        // var words = "亲爱的用户，系统升级维护中，可能会影响您的部分操作，对此带来的不便，敬请见谅。";
        // var words = "尊敬的用户您好：春节期间本网站呼叫中心工作时间调整：2月6日工作时间8点-18点，2月7号-2月13号工作时间9点-18点，由此给您带来的不便，敬请谅解。";
        // var words = "亲爱的用户，为了给您带来更好的浏览体验，众信旅游悠哉网将于 2016年8月19日23：00至次日上午08：00 进行全面升级，期间网站将暂停服务，在此期间对您造成的不便请您谅解！";
        // var words = "亲爱的用户，为了给您带来更好的体验，众信旅游悠哉网将于2017年1月12日18:00至次日上午01:00 进行优惠券系统升级，期间优惠劵功能将无法使用，在此期间对您造成的不便敬请谅解！";
        var words = "亲爱的用户，众信旅游悠哉网将在2017年2月28日1:00至凌晨5:30 ，进行系统升级。升级期间给您带来不便我们深表歉意！";
        var info = "<div id='g_toptip' class='g_toptip'><div class='tip-box w'><a class='close' href='javascript:void(0);'>&times;</a><p class='tip-main'>" + words + "</p></div></div>";
        var o = $('#j_newHeader').eq(0);
        o.after(info);

        $('#g_toptip .close').bind('click', function () {
            $("#g_toptip").hide();
            _uzw.cookie.set(ckName, "1", 7);
        });
    };

    var _gNoticePop = function () {

        //非上海站
        if (_ug.city == 'sh') {
            return;
        }

        var ckName = 'uzwNoticePop114';
        if (_uzw.cookie.get(ckName)) {
            return;
        }

        var words = "<dl class='p10 pb5'><dt>尊敬的客户，您好！</dt><dd>我们将于<span class='red'>1月15日23:00至1月16日6:00</span>期间进行系统维护，届时部分产品将无法购买（但可收藏）。对此给您带来的不便，敬请谅解。</dd></dl>";
        var info = "<div class='ui-pop g_toptipPop' id='g_toptipPop'><span class='pop-close close'>&times;</span><div class='pop-hd tc f24'>系统维护通知</div><div class='pop-bd f20 pt10 pb10 lh2'>" + words + "</div><div class='pop-ft tc mt10 pb10'><input type='button' class='close white f18' value='关闭' /></div></div>";

        _uzw.ui.mask.show();
        $('body').append(info);

        $('#g_toptipPop').find('.close').on('click', function () {
            $('#g_toptipPop').hide();
            _uzw.ui.mask.hide();
            _uzw.cookie.set(ckName, "1", 7);
        });

    };

    _gNotice();//顶部通栏通告
    //_gNoticePop();//弹出通栏通告

})();