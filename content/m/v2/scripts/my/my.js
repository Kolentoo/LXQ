"use strict";var myexports={};var oPhoneId=null;var oSource=null;var oVersion=null;var oUserId=null;myexports.init=function(){oPhoneId=$("#hdphoneId").val();oSource=$("#hdsource").val();oVersion=$("#hdversion").val();oUserId=$("#hduserId").val();_util.file.load(_uzm.domain.cdnRandom()+"/content/m/v2/scripts/com/slider.js",function(){window.slider.api("j_topSlider","j_topSliderWrap",5000,true);window.slider.api("j_fullColumnSlider","j_fullColumn",5000,true)});myexports.user();myexports.checkInPop();myexports.checkIn();myexports.unitShare();myexports.exchangeStore();myexports.submitAddressForm();myexports.appleActivityTips();myexports.myTab()};myexports.user=function(){var userid=_uzm.user.userid;if(userid){$("#j_userUnlogin").hide();$("#j_userLogin").show()}else{$("#j_userUnlogin").show();$("#j_userLogin").hide()}};var _popBox=function _popBox(obj,closeNode){closeNode=closeNode||".j_popClose";_uzm.mask.show();obj.css({"opacity":1,"z-index":1000}).on("click",closeNode,function(){_uzm.mask.hide();obj.css({"opacity":0,"z-index":-1})})};myexports.checkInPop=function(){var isCheck=$("#j_activityItems").find(".earn-ud").attr("data-ischeck");if(isCheck=="1"){$("#j_popUdAdd .pop-hd").find("img").attr("src","http://r01.uzaicdn.com/content/m/v2/images/my/icon55.png");_popBox($("#j_popUdAdd"))}$("#j_btnRule").on("click",function(){_popBox($("#j_popRuleBox"))});$("#j_pushMoney").on("click",function(){_popBox($("#j_popGetBox"))});$("#j_activityItems").on("click",".earn-ud",function(){if(oUserId>0){if(isCheck=="2"){$("#j_popShareBox").find("a").text("\u5DF2\u5206\u4EAB").attr("href","#")}_popBox($("#j_popShareBox"))}else{$.ajax({url:"/Sign/CheckLogin",type:"Post",dataType:"json",data:{version:oVersion,phoneid:oPhoneId,source:oSource,userId:oUserId,ran:Math.random()},success:function success(data){if(data.Status==1){if(isCheck=="2"){$("#j_popShareBox").find("a").text("\u5DF2\u5206\u4EAB");$("#j_popShareBox").find("a").attr("href","#")}_popBox($("#j_popShareBox"))}else{location.href=data.Url}}})}});$("#j_activityItems").on("click",".shared",function(){if(oUserId>0){if(isCheck=="2"){$("#j_popShareBox").find("a").text("\u5DF2\u5206\u4EAB");$("#j_popShareBox").find("a").attr("href","#")}_popBox($("#j_popShareBox"))}else{$.ajax({url:"/Sign/CheckLogin",type:"Post",dataType:"json",data:{version:oVersion,phoneid:oPhoneId,source:oSource,userId:oUserId,ran:Math.random()},success:function success(data){if(data.Status==1){if(isCheck=="2"){$("#j_popShareBox").find("a").text("\u5DF2\u5206\u4EAB");$("#j_popShareBox").find("a").attr("href","#")}_popBox($("#j_popShareBox"))}else{location.href=data.Url}}})}});$("#j_popShareBox").find("a").click(function(){_uzm.mask.hide();$("#j_popShareBox").css({"opacity":0,"z-index":-1});return true})};myexports.checkIn=function(){var _popBox=function _popBox(obj,closeNode){closeNode=closeNode||".j_popClose";_uzm.mask.show();obj.css({"opacity":1,"z-index":1000}).on("click",closeNode,function(){_uzm.mask.hide();obj.css({"opacity":0,"z-index":-1})})};var btn=$("#j_btnCheckin");btn.on("click",function(){var oThis=$(this);if(oThis.attr("disabled")=="disabled")return false;$.ajax({url:"/Sign/SignUser",type:"Post",dataType:"json",data:{version:oVersion,phoneid:oPhoneId,source:oSource,userId:oUserId,ran:Math.random()},success:function success(data){var ds=parseInt(data.Status,10);if(ds==1){$("#SignTodayAmount").html(data.Amount);$("#SignTotalAmount").html(data.TotalAmount);oThis.attr("disabled","disabled");oThis.addClass("btn-disabled");oThis.val("\u4ECA\u65E5\u5DF2\u7B7E");$("#j_popUdAdd .pop-hd").find("img").attr("src","http://r01.uzaicdn.com/content/m/v2/images/my/icon54.png");_popBox($("#j_popUdAdd"))}else if(ds==-1){location.href=data.Url}else if(ds===0){location.href=data.Url}else if(ds==-2){_uzm.pop.toast(data.Msg);_uzm.mask.hide()}else{_uzm.mask.hide()}}})})};myexports.unitShare=function(){var oEB=$(".j_explainBox"),oCI=oEB.find(".cont-inner"),oSB=oEB.find(".switch-bar"),num=63;oCI.each(function(){var oThis=$(this);var oSwitch=oThis.parent(".explain-cont").siblings(".switch-bar");if(oThis.height()<=num){oSwitch.hide()}});oSB.on("click",function(){var oThis=$(this),ec=oThis.siblings(".explain-cont");if(ec.hasClass("cut")){oThis.find(".switch").addClass("on").text("\u6536\u8D77");ec.removeClass("cut")}else{oThis.find(".switch").removeClass("on").text("\u66F4\u591A");ec.addClass("cut")}})};var _popTipsEs=function _popTipsEs(sCont,sFoot,tipsClass){sCont=typeof sCont==="undefined"?"":sCont;sFoot=typeof sFoot==="undefined"?"":sFoot;tipsClass=typeof tipsClass==="undefined"?"":tipsClass;var hGather=[];$("#j_popTipsEs").remove();hGather.push("<div id=\"j_popTipsEs\" class=\"pop-tips-es pop-mod\">");hGather.push("<div class=\"pop-inner\">");hGather.push("<div class=\"tips-cont "+tipsClass+"\">");hGather.push("<dl class=\"cont-txt tc\">"+sCont+"</dl>");hGather.push("<i class=\"pop-close j_popClose\"></i>");hGather.push("</div>");hGather.push("<div class=\"pop-ft tc mt15\">"+sFoot+"</div>");hGather.push("</div>");hGather.push("</div>");$("body").append(hGather.join(""));var popBox=$("#j_popTipsEs");popBox.css({"opacity":1,"z-index":1000});popBox.on("click",".j_popClose",function(){popBox.css({"opacity":0,"z-index":-1});hGather=[]})};myexports.submitAddressForm=function(){$("#j_submitAddressnew").on("click",function(){var o=$(this);if($.trim($("#txtReceiveName").val()).length===0){_uzm.pop.toast("\u6536\u4EF6\u4EBA\u4E0D\u80FD\u4E3A\u7A7A");return}if($.trim($("#txtprovince option").not(function(){return!this.selected}).text()).length===0||$("#txtprovince option").not(function(){return!this.selected}).text()=="--\u8BF7\u9009\u62E9\u7701\u4EFD--"){_uzm.pop.toast("\u8BF7\u9009\u62E9\u7701\u4EFD");return}if($.trim($("#txtcity option").not(function(){return!this.selected}).text()).length===0||$("#txtcity option").not(function(){return!this.selected}).text()=="--\u8BF7\u9009\u62E9\u57CE\u5E02--"){_uzm.pop.toast("\u8BF7\u9009\u62E9\u57CE\u5E02");return}if($.trim($("#txtarea option").not(function(){return!this.selected}).text()).length===0||$("#txtarea option").not(function(){return!this.selected}).text()=="--\u8BF7\u9009\u62E9\u5730\u533A--"){_uzm.pop.toast("\u8BF7\u9009\u62E9\u5730\u533A");return}if($.trim($("#txtReceiveAddr").val()).length===0){_uzm.pop.toast("\u8BF7\u8F93\u5165\u6536\u8D27\u5730\u5740");return}if($.trim($("#txtMobile").val()).length===0){_uzm.pop.toast("\u8BF7\u586B\u5199\u624B\u673A");return}if($.trim($("#txtZip").val()).length===0){_uzm.pop.toast("\u8BF7\u586B\u5199\u90AE\u653F\u7F16\u7801");return}var addr=$("#txtprovince option").not(function(){return!this.selected}).text()+$("#txtcity option").not(function(){return!this.selected}).text()+$("#txtarea option").not(function(){return!this.selected}).text()+$("#txtReceiveAddr").val();_uzm.mask.show();$.ajax({url:"/sign/SignShopRecordInfoSubmit",type:"Post",dataType:"json",data:{ReceiveName:$("#txtReceiveName").val(),ReceiveAddr:addr,mobile:$("#txtMobile").val(),zip:$("#txtZip").val(),userid:$("#txtUserId").val(),prizeId:$("#txtResultId").val(),version:$("#hdversion").val(),phoneid:$("#hdphoneid").val(),source:$("#hdsource").val(),channel:$("#hdchannel").val(),city:$("#hdcity").val(),pass:$("#hdpass").val(),t:$("#hdt").val(),tamper:$("#hdtamper").val(),ran:Math.random()},success:function success(data){var ds=data.Status;if(ds==1){_popBox($("#j_popGetBox"));return}else if(ds===0){_uzm.mask.hide();location.href=data.Url}else if(ds==-2){_uzm.mask.hide();location.href=data.Url}else if(ds==-1){_uzm.mask.hide();_uzm.pop.toast(data.Msg);return}}})})};myexports.exchangeStore=function(){var oCM=$(".exchange-store-detail");oCM.on("click",".btn-exchange",function(){var oThis=$(this);var oLI=oCM;var oSN=oLI.find(".surplus-num");var sCN=parseInt($("#hidcount").val(),10);var sNC=parseInt($("#hidpcount").val(),10);var sSN=parseInt($("#hidpnum").val(),10);var sName=oLI.find(".bar-main").text();var sImg=oLI.find("img").attr("src");var sPrizeId=$("#hdprizeId").val();var sUserId=$("#hdUserId").val();var sVersion=$("#hdVersion").val();var sPhoneId=$("#hdPhoneid").val();var sSource=$("#hdSource").val();var sResultId=$("#hdResultId");var PrizeType=$("#hdPrizeType").val();if(sCN<sNC){var sCont="<dt class=\"txt-hd f19\">\u554A\u5076</dt><dd class=\"txt-bd f15\">\u70B9\u6570\u4E0D\u8DB3</dd>";var sFoot="<a href=\"/sign/index/\" class=\"btn-item bg-f60 white f20\">\u5FEB\u53BB\u8D5AU\u70B9</a>";var tipsClass="tips-error";_popTipsEs(sCont,sFoot,tipsClass)}else{$.ajax({url:"/sign/SignShopGetPrize/",type:"Post",dataType:"json",data:{version:sVersion,phoneid:sPhoneId,source:sSource,prizeId:sPrizeId,userId:sUserId,ran:Math.random()},success:function success(data){if(parseInt(data.Status,10)===-3){_uzm.pop.toast(data.Msg);return}else if(parseInt(data.Status,10)===-2){_uzm.mask.hide();location.href=data.Url;return}else if(parseInt(data.Status,10)===-1){_uzm.pop.toast(data.Msg);return}else if(parseInt(data.Status,10)===0){_uzm.mask.hide();location.href=data.Url;return}else if(parseInt(data.Status,10)===2){if(parseInt(data.PrizeType,10)===1){location.href=data.Url}else if(parseInt(data.PrizeType,10)==3||parseInt(data.PrizeType,10)==2){location.href=data.Url}}}})}})};myexports.appleActivityTips=function(){if(_uzm.mobile.isIpad||_uzm.mobile.isIphone){$(".ft-copyright").append("<p class=\"ap-tips-bar f14 tc\">\u6240\u6709\u5956\u54C1\u548C\u6D3B\u52A8\u5747\u4E0E\u82F9\u679C\u516C\u53F8\u65E0\u5173</p>");$("#j_popRuleBox").find(".pop-bd").children(".cont-box").append("<p> 7.\u6240\u6709\u5956\u54C1\u4E0E\u6D3B\u52A8\u5747\u4E0E\u82F9\u679C\u516C\u53F8\u65E0\u5173\u3002</p>")}};myexports.myTab=function(){_util.file.load(_uzm.domain.cdnRandom()+"/content/m/v2/scripts/com/tab.js",function(){var dtab=$("#j_tab");var md=dtab.find(".more-infor");md.on("click",function(){var t=$(this);t.prev(".discount-tips").toggle();t.toggleClass("on")});window.tab.init("j_tab")})};$(function(){myexports.init();var source=_util.url.get("source"),devicetype=_util.url.get("devicetype");if(source=="iphone"||devicetype=="ios"){var hybridversion=_util.url.get("hybridversion");if(hybridversion=="3"){var sosPhoneid=$("#hdphoneId").val();_uzm.cookie.set("sosphoneid",sosPhoneid)}}});