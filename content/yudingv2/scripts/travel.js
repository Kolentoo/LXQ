$(function(){
	$('.bank_card_top li').click(function(){
		$(this).addClass('hover').siblings().removeClass('hover')
		var i=$(this).index();
		$('.bank_card_m1_img:lt(4)').hide();
		$('.bank_card_m1_img:lt(4)').eq(i).show()
	})
	$('.bank_card_m1_img li').click(function(){
		$('.bank_card_m1_img li').removeClass('selected').children('input').removeAttr("checked");
		$(this).addClass('selected').children('input').prop("checked","checked");
		return false;
	})
})
