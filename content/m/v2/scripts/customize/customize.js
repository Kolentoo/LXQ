'use strict';var myexports={};myexports.init=function(){myexports.drop();myexports.choose();myexports.loadCity();myexports.submitForm();myexports.customFilter()};myexports.loadCity=function(){var ck=_uzm.cookie.get('uzmCity');$('#j_startCity').val('');ck&&$('#j_startCity').val(ck.split('-')[0])};myexports.drop=function(){$('#j_customize').find('dd').on('click',function(){var o=$(this);var on=o.next('.drop');if(on.css('display')=='none'){o.addClass('on');on.show()}else{o.removeClass('on');on.hide()}})};myexports.choose=function(){$('#j_customize').find('.drop').find('li').on('click',function(){var o=$(this);var opd=o.parents('.drop').prev('dd');var ohide=opd.find('input');var ospn=opd.find('span');var os=o.siblings('li');var ot=$.trim(o.text());os.removeClass('on');o.addClass('on');o.parents('.drop').prev('.on').removeClass('on');ohide.val(ot);ospn.text(ot);o.parents('.drop').hide()})};myexports.submitForm=function(){var pop=function pop(obj,v){_uzm.pop.toast(v)};$('#j_btnSubmit').on('click',function(){var obtn=$(this);if(obtn.hasClass('btn-off')||obtn.val()=='\u5DF2\u5B8C\u6210'){return}var sb=[];var push=function push(obj,name){if(obj.val()){sb.push(name+'='+obj.val())}};var b=true;var startcityname=$('input[name=startcityname]');var locationName=$('input[name=locationName]');var goDate=$('input[name=goDate]');var goDays=$('input[name=goDays]');var goType=$('input[name=goType]');var hotelType=$('input[name=hotelType]');var priceType=$('input[name=priceType]');var person=$('input[name=person]');var son=$('input[name=son]');var username=$('input[name=username]');var mobile=$('input[name=mobile]');var email=$('input[name=email]');if(!startcityname.val()){pop(startcityname,'\u8BF7\u586B\u5199\u51FA\u53D1\u57CE\u5E02');return false}else{push(startcityname,'startcityname')}if(!locationName.val()){pop(locationName,'\u8BF7\u586B\u5199\u76EE\u7684\u5730');return false}else{push(locationName,'locationName')}if(!goDate.val()){pop(goDate,'\u8BF7\u9009\u62E9\u51FA\u53D1\u65E5\u671F');return false}else{var rd=new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate();var myd=goDate.val().replace('\u5E74','/').replace('\u6708','/').replace('-','/').replace('-','/');if(Date.parse(myd)<Date.parse(rd)){pop(goDate,'\u51FA\u53D1\u65E5\u671F\u5927\u4E8E\u7B49\u4E8E\u4ECA\u5929');return false}else{push(goDate,'goDate')}}if(goDays.val()){push(goDays,'goDays')}else{pop(goDays,'\u8BF7\u9009\u62E9\u884C\u7A0B\u5929\u6570');var dp=goDays.parent('dd');if(!dp.hasClass('on')){dp.click()}return false}if(!priceType.val()){pop(priceType,'\u8BF7\u586B\u5199\u4EBA\u5747\u9884\u7B97');return false}else{push(priceType,'priceType')}if(!person.val()){pop(person,'\u8BF7\u586B\u5199\u6210\u4EBA\u6570');return false}else if(parseInt(person.val(),10)<2){pop(person,'\u6210\u4EBA\u6570\u6700\u5C0F\u4E3A2\u4EBA');return false}else{push(person,'person')}if(son.val()){push(son,'son')}if(!username.val()){pop(username,'\u8BF7\u8F93\u5165\u59D3\u540D');return false}else{push(username,'username')}if(!mobile.val()){pop(mobile,'\u8BF7\u586B\u5199\u624B\u673A\u53F7');return false}else{if(!_uzm.regexForm.mobile(mobile.val())){pop(mobile,'\u8BF7\u586B\u5199\u6B63\u786E\u7684\u624B\u673A\u53F7');return false}else{push(mobile,'mobile')}}if(!email.val()){pop(email,'\u8BF7\u586B\u5199\u6B63\u786E\u7684\u90AE\u7BB1');return false}else{if(!_uzm.regexForm.email(email.val())){pop(email,'\u8BF7\u586B\u5199\u6B63\u786E\u7684\u90AE\u7BB1');return false}else{push(email,'email')}}if(goType.val()){push(goType,'goType')}if(hotelType.val()){push(hotelType,'hotelType')}var u='/dzsubmit';$.ajax({url:u,type:'POST',data:sb.join('&'),dataType:'json',beforeSend:function beforeSend(){obtn.val('\u63D0\u4EA4\u4E2D...');obtn.addClass('btn-off')},success:function success(data){if(data.MC=='1000'){obtn.val('\u5DF2\u5B8C\u6210');obtn.addClass('btn-off');_uzm.pop.confirm('<div class="tit f18 mb5">\u6E29\u99A8\u63D0\u793A</div><p style="text-align:left;" class="f15">\u60A8\u5DF2\u6210\u529F\u63D0\u4EA4\u5B9A\u5236\u4FE1\u606F\uFF0C\u65C5\u6E38\u7BA1\u5BB6\u4F1A\u57281\u4E2A\u5DE5\u4F5C\u65E5\u5185\u4EE5021-33977886\u8054\u7CFB\u60A8\uFF0C\u8BF7\u60A8\u4FDD\u6301\u624B\u673A\u7545\u901A\u3002</p>');window._gsCallback&&window._gsCallback(data)}else{obtn.val('\u63D0\u4EA4');obtn.removeClass('btn-off');_uzm.pop.toast('\u63D0\u4EA4\u5931\u8D25')}},error:function error(){obtn.val('\u63D0\u4EA4');obtn.removeClass('btn-off')}})})};myexports.renderInitAllNode=function(index){var oSCA=$('#j_sjCustomAutocomp');var oWrap=oSCA.parent();var oIO=$('#IsOut');var _initNode=function _initNode(cityList){var tlLen=cityList.length;oSCA.empty().hide();oWrap.css({'z-index':'auto'});var html=cityList.map(function(item,idx,arr){return'<li><span class=\'s0\'>'+item.cityurl+'</span><span class=\'s1\'>'+item.name+'</span></li>'});oSCA.append(html)};if(index===1){oIO.val(0);_initNode(window.sjCityList.data.domestic.cityList)}else{oIO.val(1);_initNode(window.sjCityList.data.intercity.cityList)}oSCA.find('li').on('mouseenter',function(){var o=$(this);oSCA.find('li').removeClass('on');o.addClass('on')})};myexports.customFilter=function(){var oSCA=$('#j_sjCustomAutocomp');var oWrap=oSCA.parent();var oTD=$('#txtDestiation');myexports.renderInitAllNode(0);var unitKeyEvent=function unitKeyEvent(o){var scaLi=oSCA.find('li');var ov=$.trim(o.val().toUpperCase());if(!ov){o.focus();oSCA.hide();oWrap.css({'z-index':'auto'});return}var ot=o.offset().top;var ol=o.offset().left;var oh=o.height();oSCA.show();oWrap.css({'z-index':10});oSCA.find('.li-none').remove();scaLi.each(function(k,v){var oo=$(this);var oot=oo.text().toUpperCase();var ootAbb=oo.find('s0').text();if(oot.indexOf(ov)>-1){oo.show()}else{oo.hide()}});var initLis=[];oSCA.find('li').each(function(k,v){var oo=$(this);if(oo.css('display')==='list-item'){initLis.push(oo)}});var lisLen=initLis.length;if(lisLen===0){oSCA.hide();oWrap.css({'z-index':'auto'})}else if(lisLen===1){if(oSCA.find('.s1').text()===$.trim(o.val().toUpperCase())){oSCA.hide();oWrap.css({'z-index':'auto'})}}else if(lisLen>15){for(var i=0;i<initLis.length;i++){var item=initLis[i];if(i>=15){item.hide()}}}scaLi.off('click');oSCA.find('li').on('click',function(){var node=$(this);if(node.css('display')=='list-item'){var ncn=node.find('.s1').text();o.val(ncn);oSCA.hide();oWrap.css({'z-index':'auto'});oSCA.find('.on').removeClass('on')}})};oTD.on('keyup',function(e){var o=$(this);unitKeyEvent(o)});$(document).click(function(event){if($(event.target).attr('id')!='txtDestiation'){oSCA.hide();oWrap.css({'z-index':'auto'})}})};$(function(){myexports.init()});