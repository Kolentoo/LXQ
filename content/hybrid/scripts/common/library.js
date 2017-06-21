(function($) {
    "use strict";
    $.extend({  
        layer:function(){
			if(!arguments[0]){
				arguments[0]='您是否继续！'
			}
			if(!arguments[1]){
				arguments[1]=$.layer_hide;
			}
			if(!arguments[2]){
				arguments[2]=$.layer_hide;
			}
			
			$('<div class="uzai_layer"></div>').appendTo('BODY');
			$('<div class="uzai_layer_main"><h2>'+arguments[0]+'</h2>'
				+'<div class="uzai_layer_main_confirm">'
				+'<span class="cancel_">取消</span>'
				+'<span class="confirm">确认</span>'
				+'</div>'
				
				+'</div>').appendTo('BODY');
			$('.uzai_layer_main_confirm .cancel_').click(arguments[1])
			$('.uzai_layer_main_confirm .confirm').click(arguments[2])
		},
		layer_show: function() {
		   $('.uzai_layer, .uzai_layer_main').show();
		},
		layer_hide: function() {
		   $('.uzai_layer, .uzai_layer_main').hide();
		},
		layer_img:function(src){
			if(!$('div').hasClass('uzai_layer'))$('<div class="uzai_layer"></div>').appendTo('BODY');
			$('.uzai_layer').show();
			$('<img src=' + src + ' id="layer_img" class="layer-img"/>').appendTo('BODY');
			$('#layer_img').click(function () {
				$(this).remove();
				$('.uzai_layer').hide();
			})
		}
    });

	$.fn.layer = function() {
		if(!arguments[0]){
			arguments[0]='您是否继续！'
		}
		if(!arguments[1]){
			arguments[1]=hide;
		}
		if(!arguments[2]){
			arguments[2]=hide;
		}
		if (arguments[0]=='hide') {
			hide()
		} else if (arguments[0]=='show') {
		    show()
		} else {
			$('<div class="uzai_layer"></div>').appendTo('BODY');
			$('<div class="uzai_layer_main"><h2>'+arguments[0]+'</h2>'
				+'<div class="uzai_layer_main_confirm">'
					+'<span class="cancel_">取消</span>'
					+'<span class="confirm">确认</span>'
				+'</div>'
			+'</div>').appendTo('BODY');
			$('.uzai_layer_main_confirm .cancel_').click(arguments[1])
			$('.uzai_layer_main_confirm .confirm').click(arguments[2])
		}
		function hide(){$('.uzai_layer, .uzai_layer_main').hide()};
		function show(){$('.uzai_layer, .uzai_layer_main').show()};
	};


    $.fn.uzaiSelect = function(options) {
        var defaultValue = {
            imgUrl: "images/adr.png",
            outerClass: "select",
            iconStyle: "timc",
            title: "时间",
            valueC: "",
            option_list: [{
                "valueContent": "defaults",
                "textContent": "请选择"
            },
            {
                "valueContent": "天津",      //这里key和value最好一致
                "textContent": "天津"
            },
            {
                "valueContent": "北京",
                "textContent": "北京"
            }]
        };

        var setValue = $.extend(defaultValue, options);
        var selectId = $(this);
        selectId.addClass(setValue.outerClass);
        
        var option_list = setValue.option_list;
        var _html = '<div class="scdiv"><div class="lc clearfix" style="position:relative;">' + '<div class="' + setValue.iconStyle + ' fl" style="background-image:url(' + setValue.imgUrl + ')">' + setValue.title + '</div>' + '<div class="div_sc"><select class="consc pminPerson" placeholder="请选择' + setValue.title + '"></select></div></div></div>';
        selectId.html(_html);

        for (var i = 0; i < option_list.length; i++) {

            selectId.find(".consc").append("<option value=" + option_list[i].valueContent + ">" + option_list[i].textContent + "</option>");

        }

        if(setValue.valueC!=null&&setValue.valueC!=""){
            $(this).find("select").val(setValue.valueC).show();
        }else{
            $(this).find("select").val("defaults").show();
        }
        function change() {
            $("select").on('change',
                function() {

                    if ($(this).val() == "defaults") {
                        $(this).removeClass("corff0000");
                    } else {
                        $(this).addClass("corff0000");
                    }

                });
        }

        change();
    }
})(jQuery);
