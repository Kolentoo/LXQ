//date:20140909
$(function(){
	// 去掉a标签点击后的虚线
	$("a").focus(function(){$(this).blur();});
	//显示footer图片
	// $("#TN-footer img").each(function(){
	// 	$(this).attr("src",$(this).attr("data-src"));
	// });
});
var jsUtil = {
	// 锚标记的滑动效果
	mao:function(id,t){
		var p = 0;
		if(t){p = t;}
		$("html,body").animate({scrollTop:$("#"+id).offset().top+p},500);
	},
	// 初始化右侧浮动栏位置
	initFloatRightPosition:function(floatRightId,mtop,mbottom,pianyi,mwidth){
		//左右浮动栏与页面主体的边距
		var right_pianyi = pianyi?pianyi:10;
		//可视区域高度宽度
		var win_w=null,win_h = null;
		if(_util.check.isIE){win_w=$(window).width();win_h=$(window).height();}else{win_w = window.innerWidth;win_h = window.innerHeight;}
		//右侧浮动div高度宽度
		var right_div_h = $("#"+floatRightId).height(),right_div_w=$("#"+floatRightId).width();
		//临时变量，right: right_div的left
		var temp=0,right=win_w-right_div_w;
		//页面主体的宽度
		var main_w = mwidth?mwidth:1000;
		if(win_w>main_w){
			temp = (win_w - main_w)/2;
			if(win_w>main_w+(right_div_w+right_pianyi)*2){
				right=temp+main_w+right_pianyi;
			}	
		}
		//设置left
		$("#"+floatRightId).css("right",right);

		//设置top
		if(mtop||mtop==0){ //如果传入参数top使用传入值
			$("#"+floatRightId).css("top",mtop);
		}else if(mbottom||mbottom==0){ //如果传入参数bottom使用传入值
			$("#"+floatRightId).css("bottom",mbottom);
		}else if(win_h>right_div_h){ //未传入参数自动垂直居中
			$("#"+floatRightId).css("top",(win_h-right_div_h)/2);
		}else{ //top设置为0
			$("#"+floatRightId).css("top",0);
		}
	},
	// 控制浮动栏的显示和隐藏（根据scrollTop）
	ctrlFloatShowOrHide:function(floatId,h){
		var hei = h?h:500;
		var sTop = $(window).scrollTop();
		if(sTop>hei){
			$("#"+floatId).fadeIn();
		}else{
			$("#"+floatId).fadeOut();
		}
	},
	// 截取字符串，拼接“...”
	ellipsis:function(str,length){
		if(str.length >= length){
			str = str.substring(0,length-3)+"...";
		}
		return str;
	}
}



 $(function () {

            jsUtil.initFloatRightPosition("float_right2");
            $(window).scroll(function () { jsUtil.ctrlFloatShowOrHide("float_right2", 400); }).resize(function () { jsUtil.initFloatRightPosition("float_right2"); });

 });  