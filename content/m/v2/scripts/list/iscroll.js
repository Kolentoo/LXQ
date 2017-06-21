'use strict';var myScroll;var _y=0;var paramUrl=function paramUrl(page){var box=$('#j_list');var url=document.location.href.replace('#','');var day=_util.url.get('day');var price=_util.url.get('price');var date=_util.url.get('date');var order=_util.url.get('order');var ext=_util.url.get('ext');var typeNode=box.find('.hd').find('.on');var type=typeNode.attr('data-type');var city=$('body').attr('data-city');var tid=$('body').attr('data-id');var name=$.trim($('body').attr('data-name'));var sb=[];sb.push('page='+page);if(type){sb.push('queryType='+type)}sb.push('city='+city);sb.push('TravelClassID='+tid);if(name){sb.push('searchName='+name)}if(url.indexOf('word')>-1){var word=_util.url.get('word');if(word){sb.push('word='+word)}}else if(url.indexOf('wd')>-1){var wd=_util.url.get('wd');if(wd){sb.push('wd='+wd)}}else if(url.indexOf('keyword')>-1){var keyword=_util.url.get('keyword');if(keyword){sb.push('keyword='+keyword)}}else{if(day){sb.push('day='+day)}if(price){sb.push('price='+price)}if(date){sb.push('date='+date)}if(ext){sb.push('ext='+ext)}if(order){sb.push('order='+order)}}var params=_util.array.unique(sb).join('&');return params};var loadData=function loadData(page){var box=$('#j_list');var params=paramUrl(page);$.ajax({type:'GET',url:_uzm.domain.m+'/ashx/GetAppChannel.ashx?'+params,dataType:'jsonp',success:function success(data){if(data){var ul=box.find('.bd');var st=[];data['ProductList'].forEach(function(item,idx,arr){var pprice=item.CheapPrice;var psrc=item.ImageURL;var pid=item.ProductId;var pname=item.ProductName;if(pname){pname=pname.length>20?pname.substring(0,20)+'...':pname}var ptid=item.UzaiTravelClassID;var pDate=item.GoDate;var pTravelNum=item.GoTravelNum;var pBaceCash=item.BackCash;var pSavePrice=item.SavePrice;var pUrl=item.ProductURL;var iconType='';if(ptid=='\u81EA\u7531\u884C'){iconType='<i class=\'icon zyx\'>\u81EA\u7531\u884C</i>'}else if(ptid=='\u8DDF\u56E2\u6E38'){iconType='<i class=\'icon gty\'>\u8DDF\u56E2\u6E38</i>'}st.push('<li><a href=\''+pUrl+'\'>');st.push('<div class=\'fl pic\'><img width=\'92\' src=\''+psrc+'\'>'+iconType+'</div>');st.push('<div class=\'txt\'>');st.push('<p class=\'p1 f14\'>'+pname+'</p>');st.push('<p class=\'p2 clearfix\'>');st.push('<span class=\'fl\'>');if(pBaceCash){st.push('<i>'+pBaceCash+'</i> ')}if(pSavePrice){st.push('<i>'+pSavePrice+'</i>')}st.push('</span>');st.push('<span class=\'fr f60 f13\'>\uFFE5<b class=\'f17\'>'+pprice+'</b>\u5143\u8D77</span>');st.push('</p>');st.push('<p class=\'p3 clearfix f10 f666\'>');st.push('<span class=\'fl\'>\u73ED\u671F\uFF1A'+pDate+'...</span>');st.push('<span class=\'fr f10\'>\u5DF2\u6709'+pTravelNum+'\u4EBA\u51FA\u884C</span>');st.push('</p>');st.push('</div>');st.push('</a></li>')});ul.append(st.join(''));box.find('.bd').attr('data-page',page)}else{$('#pullUp1').remove();if($('#j_listNone').get(0)){return}box.find('.bd').after('<div id=\'j_listNone\' class=\'lh2 tc f20\'>\u6CA1\u6709\u4E86...</div>')}},error:function error(res){},complete:function complete(res){setTimeout(function(){myScroll.refresh()},500)}})};function pullUpAction(listID){var page=$('#'+listID).find('.bd').attr('data-page');page=page||1;loadData(parseInt(page,10)+1)}function loaded(wraperID,listID,pullUpID){var pullUpEl=document.getElementById(pullUpID);myScroll=new window.iScroll(wraperID,{useTransition:true,onRefresh:function onRefresh(){if(pullUpEl.className.match('loading')){pullUpEl.className='init';pullUpEl.querySelector('.pullUpLabel').innerHTML='\u4E0A\u62C9\u663E\u793A\u66F4\u591A...'}},onScrollStart:function onScrollStart(eve){var touch=eve.touches[0];_y=touch.pageY},onScrollMove:function onScrollMove(eve){var pullUpOffset=null;if(!pullUpEl){pullUpOffset=document.body.scrollHeight}else{pullUpOffset=pullUpEl.offsetHeight}if(this.y<this.maxScrollY-5&&!pullUpEl.className.match('flip')){pullUpEl.className='flip';pullUpEl.querySelector('.pullUpLabel').innerHTML='\u91CA\u653E\u5237\u65B0...';this.maxScrollY=this.maxScrollY}else if(this.y>this.maxScrollY+5&&pullUpEl.className.match('flip')){pullUpEl.className='init';pullUpEl.querySelector('.pullUpLabel').innerHTML='\u4E0A\u62C9\u663E\u793A\u66F4\u591A...';this.maxScrollY=pullUpOffset}var touch=eve.touches[0];var pointY=touch.pageY;if(pointY>_y){scrollBar('up',pointY-_y)}else{scrollBar('down',_y-pointY)}},onScrollEnd:function onScrollEnd(eve){if(pullUpEl.className.match('flip')){pullUpEl.className='loading';pullUpEl.querySelector('.pullUpLabel').innerHTML='\u6B63\u5728\u52A0\u8F7D\u66F4\u591A...';pullUpAction(listID)}}});setTimeout(function(){document.getElementById(wraperID).style.left='0'},800)}document.addEventListener('DOMContentLoaded',function(){loaded('wrapper1','thelist1','pullUp1')},false);function scrollBar(flag,distance){var box=$('#j_list');var ohd=box.children('.hd');if(flag==='up'){$('#j_ft').css({'bottom':'0'});if(distance>=47){ohd.css({'top':'0'});if(!ohd.get(0)){$('#wrapper1').css({'top':'0'})}else{$('#wrapper1').css({'top':'47px'})}}}else if(flag==='down'){$('#j_ft').css({'bottom':'-48px'});ohd.css({'top':'-47px'});$('#wrapper1').css({'top':'0'})}}