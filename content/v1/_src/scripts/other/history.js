try {
    document.domain = 'uzai.com';
} catch (e) {

}

$(function () {
    loadGuessLike();

    var pagers = $('.fn-pager');
    pagers.each(function () {
        var pager = $(this);
        var pageSize = parseInt(pager.attr('data-pagesize'), 10);
        var pageItems = parseInt(pager.attr('data-counts'), 10);

        pager.uzPager({
            pageSize: pageSize,
            pageItems: pageItems,//列表条数
            targetNode: pager.siblings('.pager-target-node'),
            onInit: function () {
                //console.log('pager 初始化完成');
            },
            onCallback: function (currentPage, allPage) {
                //分页事件 ajax or dom handle
                //console.log(currentPage);
                //console.log(allPage);
            }
        });
    });

    var imgs = $('.guess-like-list').find('img[data-original]');
    imgs.lazyload({
        effect: "fadeIn"
    });

    var rvb = $('#j_recentlyViewedBox');
    rvb.find('.empty-record').on('click', function () {
        if (confirm('确定要清空全部浏览记录？')) {
            $.ajax({
                url: '//aj.uzai.com/api/UzaiScanRecords/DelRecord',
                type: 'GET',
                dataType: 'jsonp',
                success: function (data) {
                    if (data && data.Success === true) {
                        var rbh = $('#j_newHeader').find('.recently-browsing-history');
                        rbh.find('.rbh-hd').remove();
                        rbh.find('.rbh-bd').remove();
                        rbh.find('.none-history').remove();
                        rbh.prepend('<div class="none-history tc"><i class="icon-none icon-common-bulky png"></i></div>');
                        rvb.find('.mod-bd').empty().append('<div class="fruitless-box tc"><i class="icon-uz vm icon-history png"></i><span class="f666 f24">暂无数据</span></div>');
                    } else {
                        alert(data.Message);
                    }
                },
                error: function () {
                }
            });
        }
    });
});

function loadGuessLike() {
    if (!window.guessLike) {
        _util.file.load((_env === 'dev' ? '' : _uzw.domain.cdnRandom()) + '/content/v1/scripts/com/guesslike.js', function () {
            window.guessLike('j_guessLikeContainer', null, false, 1);
        });
    }
}