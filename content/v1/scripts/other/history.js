/*! uzai - v0.1.11 - 2017 */

function loadGuessLike(){window.guessLike||_util.file.load(("dev"===_env?"":_uzw.domain.cdnRandom())+"/content/v1/scripts/com/guesslike.js",function(){window.guessLike("j_guessLikeContainer",null,!1,1)})}try{document.domain="uzai.com"}catch(e){}$(function(){loadGuessLike();var a=$(".fn-pager");a.each(function(){var a=$(this),b=parseInt(a.attr("data-pagesize"),10),c=parseInt(a.attr("data-counts"),10);a.uzPager({pageSize:b,pageItems:c,targetNode:a.siblings(".pager-target-node"),onInit:function(){},onCallback:function(a,b){}})});var b=$(".guess-like-list").find("img[data-original]");b.lazyload({effect:"fadeIn"});var c=$("#j_recentlyViewedBox");c.find(".empty-record").on("click",function(){confirm("确定要清空全部浏览记录？")&&$.ajax({url:"//aj.uzai.com/api/UzaiScanRecords/DelRecord",type:"GET",dataType:"jsonp",success:function(a){if(a&&a.Success===!0){var b=$("#j_newHeader").find(".recently-browsing-history");b.find(".rbh-hd").remove(),b.find(".rbh-bd").remove(),b.find(".none-history").remove(),b.prepend('<div class="none-history tc"><i class="icon-none icon-common-bulky png"></i></div>'),c.find(".mod-bd").empty().append('<div class="fruitless-box tc"><i class="icon-uz vm icon-history png"></i><span class="f666 f24">暂无数据</span></div>')}else alert(a.Message)},error:function(){}})})});
//# sourceMappingURL=/sourcemaps/content/v1/scripts/other/history.js.map