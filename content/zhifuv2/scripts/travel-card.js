$(function() {
    var card_div = $('.main_card_m').eq(0);
    var card = '<div class="bfefcf9"><div class="main_card_f bof1"><a href="#" class="card_close"></a><div class="main_card_f1"><span class="main_card_f1_span">悠哉旅游卡</span><div class="entry"><input type="text" class="" pattern="\d{16}" placeholder="请输入卡号" data-error="卡片不满足优惠使用条件"></div></div><div class="main_card_f2"><span class="main_card_f1_span">支付密码A5-E3-A2</span><div class="entry"><input type="text" class=""><input type="text" class=""><input type="text" class=""></div></div><div class="main_card_f6"><span class="main_card_f1_span"></span><div class="entry"><input type="submit" value="确认"></div></div><div class="main_card_f3"><span class="main_card_f1_span">余额</span><div class="num">¥200</div></div><div class="main_card_f4"><span class="main_card_f1_span">使用金额</span><div class="entry"><input type="text"></div></div><div class="main_card_f5"><span class="main_card_f1_span"></span><div class="entry"><input type="submit" value="使用"></div></div><div class="clear"></div></div></div>';
    $('#add_card').click(function() {
        card_div.append(card);
        $('.card_close').click(function() {
            $(this).parent().remove();
            return false;
        })
        $('input[type=text]').blur(function() {
            $(this).removeClass('blur');
            var val = $(this).val();
            var reg = $(this).attr('pattern');
            if (!new RegExp(reg).test(val)) {
                $(this).parent().css('position', 'relative')
                $(this).addClass('error');
                if (!$(this).next().hasClass('error_entry')) $(this).after('<div class="error_entry">' + $(this).attr('data-error') + '</div>');
                $('.activity_desc').show();
            } else {
                $(this).removeClass('error');
                $(this).next('.error_entry').remove();
                $('.activity_desc').hide();
            };
        })
        $('input[type=text]').focus(function() {
            if (!$(this).hasClass('error')) $(this).addClass('blur');
        })
        return false;
    })
    var userAgent = navigator.userAgent.toLowerCase();
    // Figure out what browser is being used
    $.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };
    if ($.browser.msie && (($.browser.version == "7.0") || ($.browser.version == "8.0"))) {
        $('input[type=checkbox]').click(function() {
            if ($(this).prop('checked')) {
                $(this).next().addClass('input-checkbox3')
            } else {
                $(this).next().removeClass('input-checkbox3')
            }
        })
    }
})
