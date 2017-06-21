
_util.file.load(seabag.autocomplete, function () {
    $("#j_searchBox").autocomplete("/ashx/searchData.ashx", {
        minChars: 1,
        selectFirst: false,
        matchContains: true
    });

    $("#j_searchBoxBtn").on(_tap, function () {
        if ($("#j_searchBox").val() == "") {
            _uzm.pop.toast("请输入内容！");
        }
        else {
            $("#j_searchForm").submit();
        }
    });
});
