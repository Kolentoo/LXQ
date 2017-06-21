'use strict';var faqsexports={};faqsexports.init=function(){faqsexports.faqsHeader();faqsexports.faqsOperate();faqsexports.loadDest();faqsexports.destinationChoose();faqsexports.userEstimate()};faqsexports.faqsHeader=function(){var fh=$('#j_fnHeader');var db=fh.find('.destination-box');if(db.get(0)){var hc=db.find('.db-hd').find('.hd-cont');var hcem=hc.find('em');var di=db.find('.destination-items');db.find('.db-hd').on('click','.hd-cont',function(){var oThis=$(this);if(oThis.hasClass('on')){oThis.removeClass('on');di.hide();_uzm.mask.hide()}else{oThis.addClass('on');di.show();_uzm.mask.show();$('.fn-mask').css({'z-index':10}).on('click',function(){oThis.removeClass('on');di.hide();_uzm.mask.hide();$('.fn-mask').off('click')})}});di.on('click','.item-hd',function(){var oThis=$(this);var oNext=oThis.next('.item-bd');if(oThis.hasClass('on')){oThis.removeClass('on');oNext.removeClass('item-bd-on');hcem.text('\u4E0D\u9650')}else{di.find('p').removeClass('on');oThis.siblings('.item-hd').removeClass('on');oThis.siblings('.item-bd').removeClass('item-bd-on');oThis.addClass('on');oNext.addClass('item-bd-on');hcem.text(oThis.text())}hc.removeClass('on');di.hide();_uzm.mask.hide()});di.find('.item-bd').on('click','p',function(){var oThis=$(this);var op=oThis.parent('.item-bd');if(oThis.hasClass('on')){oThis.removeClass('on');hcem.text('\u4E0D\u9650')}else{di.find('p').removeClass('on');di.find('.item-hd').removeClass('on');di.find('.item-bd').removeClass('item-bd-on');oThis.addClass('on');hcem.text(oThis.text())}hc.removeClass('on');di.hide();_uzm.mask.hide()})}var fw=fh.find('.f-menu-wrap');if(fw.get(0)){var fml=fw.find('.fm-menu-list');fw.find('.icon-wrap').on('click',function(){var oThis=$(this);if(oThis.hasClass('on')){oThis.removeClass('on');fml.css({'opacity':0,'z-index':-1})}else{oThis.addClass('on');fml.css({'opacity':1,'z-index':10})}})}};faqsexports.faqsOperate=function(){var fl=$('#j_faqsList');if(fl.get(0)){fl.find('.list-item').each(function(){var oThis=$(this);var oh=oThis.height();oThis.find('.item-del').css({'height':oh,'line-height':oh+'px'})})}$('#j_faqsStatus').find('li').on('click',function(){var oThis=$(this);var os=oThis.siblings();var index=oThis.index();var items=$('#j_answerRecords').find('.item');os.removeClass('on');oThis.addClass('on');items.hide();items.eq(index).show()})};faqsexports.loadDest=function(){var db=$('.destination-bar');if(db.get(0)){var dest=_uzm.cookie.get('uzmDest');db.find('em').text(dest)}};faqsexports.destinationChoose=function(){var cd=$('#j_chooseDestination');if(cd.get(0)){var sd=$('#j_searchData');var sf=cd.find('.search-fixed');var sfh=sf.height();var nav=cd.find('.db-nav');var items=cd.find('.di-hd');var unitScroll=function unitScroll(){var o=$(window);var st=o.scrollTop();var ot=cd.offset().top;if(st>ot){sf.css({'position':'fixed'});nav.css({'position':'fixed','top':sfh});unitCheck(st)}else{sf.css({'position':'absolute'});nav.css({'position':'absolute','top':0});nav.find('li').removeClass('on');nav.find('li').eq(0).addClass('on')}};var unitCheck=function unitCheck(st){items.each(function(k,v){var o=$(this);var oot=o.offset().top;if(st>oot-sfh-1){nav.find('li').removeClass('on');nav.find('li').eq(k).addClass('on');return true}})};var unitSkip=function unitSkip(){nav.find('li').on('click',function(){var oli=$(this);var oindex=oli.index();var skipNode=items.eq(oindex);var oot=skipNode.offset().top;$('body,html').scrollTop(oot-sfh)})};var unitDest=function unitDest(str){var ov=$.trim(str);_uzm.cookie.set('uzmDest',ov);var url=_util.url.get('url');location.href=url};faqsexports.destinationSearch();cd.find('.destination-box').find('.di-bd').on('click','p',function(){var oThis=$(this);unitDest(oThis.text())});sd.on('click','li',function(){var oThis=$(this);unitDest(oThis.text())});unitSkip();unitScroll();$(window).scroll(function(){unitScroll()})}};faqsexports.destinationSearch=function(){var cd=$('#j_chooseDestination');var sd=$('#j_searchData');var db=cd.find('.destination-box');cd.find('.search-bar').on('keyup',function(){var oThis=$(this);var ov=$.trim(oThis.val());if(ov){$.ajax({type:'GET',url:'/adviser/GetDestination',dataType:'json',data:{'keyword':ov},success:function success(data){var iLen=data.TreeNavList.length;if(iLen){var sb=data.TreeNavList.map(function(item,idx,arrs){return'<li class="data-item">'+item+'</li>'});sd.css({'display':'block'}).find('ul').html(sb.join(''));db.css({'display':'none'});return false}else{_uzm.pop.toast('\u6682\u65E0\u641C\u7D22\u7ED3\u679C');sd.css({'display':'none'});db.css({'display':'block'})}}})}else{sd.css({'display':'none'});db.css({'display':'block'})}})};faqsexports.userEstimate=function(){var sb=$('#j_starBar');if(sb.get(0)){sb.on('click','i',function(){var oThis=$(this);var index=oThis.index();sb.find('i').removeClass('on').each(function(i){var o=$(this);if(i<index){o.addClass('on')}});oThis.addClass('on');sb.attr('data-star',index+1)})}};faqsexports.loadMore=function(){$('#j_moreFaqs').on('click',function(){var o=$(this);var op=parseInt(o.attr('data-page'),10);if(o.text()=='\u6682\u65E0\u66F4\u591A'){return}$.ajax({type:'GET',async:false,url:'',dataType:'json',success:function success(data){var iLen=data.length;if(iLen){var sb='';for(var i=0;i<iLen;i++){sb+='<li class="list-item">';sb+='<div class="item-inner">';sb+='<div class="top-info clearfix">';sb+='<span class="fl"><i class="icon-location mr5 vm"></i><em class="blue vm">'+'\u4E0A\u6D77'+'</em></span>';sb+='<span class="f999 fr">'+'2015-07-08 15:20'+'</span>';sb+='</div>';sb+='<a href="'+'#'+'" class="item-cont block mt5">';sb+='<p class="item-hd ellipsis red f16">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51'+'</p>';sb+='<div class="item-bd f666 f13 mt5">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173\u7684\u6E38\u73A9\u7EBF\u8DEF\u5417\uFF1F\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173...'+'</div>';sb+='</a>';sb+='<div class="item-del white f18 tc">\u65E0\u6548</div>';sb+='</div>';sb+='</li>'}$('#j_faqsList').append(sb);o.attr('data-page',op+1)}else{o.text('\u6682\u65E0\u66F4\u591A')}},error:function error(){}})});$('#j_moreRecord').on('click',function(){var o=$(this);var op=parseInt(o.attr('data-page'),10);if(o.text()=='\u6682\u65E0\u66F4\u591A'){return}$.ajax({type:'GET',async:false,url:'',dataType:'json',success:function success(data){var iLen=data.length;if(iLen){var sb='';for(var i=0;i<iLen;i++){sb+='<li class="list-item">';sb+='<div class="top-info clearfix">';sb+='<span class="fl"><i class="icon-location mr5 vm"></i><em class="blue vm">'+'\u4E0A\u6D77'+'</em></span>';sb+='<span class="f999 fr">'+'2015-07-08 15:20'+'</span>';sb+='</div>';sb+='<a href="'+'#'+'" class="item-cont block mt5">';sb+='<p class="item-hd ellipsis red"><span class="tag-'+'wjd'+' mr5 vm">'+'\u672A\u89E3\u7B54'+'</span><em class="f16 vm">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51'+'</em></p>';sb+='<div class="item-bd f666 f13 mt5">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173\u7684\u6E38\u73A9\u7EBF\u8DEF\u5417\uFF1F\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173...'+'</div>';sb+='</a>';sb+='</li>'}o.prev('.record-list').append(sb);o.attr('data-page',op+1)}else{o.text('\u6682\u65E0\u66F4\u591A')}},error:function error(){}})});$('#j_moreEstimate').on('click',function(){var o=$(this);var op=parseInt(o.attr('data-page'),10);if(o.text()=='\u6682\u65E0\u66F4\u591A'){return}$.ajax({type:'GET',async:false,url:'',dataType:'json',success:function success(data){var iLen=data.length;if(iLen){var sb='';for(var i=0;i<iLen;i++){sb+='<li class="list-item">';sb+='<div class="top-info clearfix">';sb+='<span class="fl"><i class="icon-location mr5 vm"></i><em class="blue vm">'+'\u4E0A\u6D77'+'</em></span>';sb+='<span class="f999 fr">'+'2015-07-08 15:20'+'</span>';sb+='</div>';sb+='<a href="'+'#'+'" class="item-cont block mt5">';sb+='<div class="item-hd red"><span class="star-bar ml5 fr"><i class="'+'g8'+'"></i></span><p class="hd-cont f16 ellipsis">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51'+'</p></div>';sb+='<div class="item-bd f666 f13 mt5">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173\u7684\u6E38\u73A9\u7EBF\u8DEF\u5417\uFF1F\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173...'+'</div>';sb+='</a>';sb+='</li>'}o.prev('.record-list').append(sb);o.attr('data-page',op+1)}else{o.text('\u6682\u65E0\u66F4\u591A')}},error:function error(){}})});$('#j_moreAsk').on('click',function(){var o=$(this);var op=parseInt(o.attr('data-page'),10);if(o.text()=='\u6682\u65E0\u66F4\u591A'){return}$.ajax({type:'GET',async:false,url:'',dataType:'json',success:function success(data){var iLen=data.length;if(iLen){var sb='';for(var i=0;i<iLen;i++){sb+='<li class="list-item">';sb+='<div class="top-info clearfix">';sb+='<span class="fl"><i class="icon-location mr5 vm"></i><em class="blue vm">'+'\u4E0A\u6D77'+'</em></span>';sb+='<span class="f999 fr">'+'2015-07-08 15:20'+'</span>';sb+='</div>';sb+='<a href="'+'#'+'" class="item-cont block mt5">';sb+='<p class="item-hd ellipsis red"><span class="tag-'+'wjd'+' mr5 vm">'+'\u672A\u89E3\u7B54'+'</span><em class="f16 vm">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51'+'</em></p>';sb+='<div class="item-bd f666 f13 mt5">'+'\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173\u7684\u6E38\u73A9\u7EBF\u8DEF\u5417\uFF1F\u4E0A\u6D77\u6709\u54EA\u4E9B\u5386\u53F2\u60A0\u4E45\u7684\u5EFA\u7B51\uFF1F\u6709\u76F8\u5173...'+'</div>';sb+='</a>';sb+='</li>'}o.prev('.record-list').append(sb);o.attr('data-page',op+1)}else{o.text('\u6682\u65E0\u66F4\u591A')}},error:function error(){}})})};$(function(){faqsexports.init()});