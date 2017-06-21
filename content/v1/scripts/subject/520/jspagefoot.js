//模块延迟加载

// 不同的路由路径       
var CommonRouleUrl = "/ashx/ashx_Subject2016520.ashx";
//默认出发城市
// var StartCity =<%=ViewData["City"] %>;        
//爆款秒杀加载
function LoadSecKillContent(activityName_P, city_P) {
    $.ajax(
                      {
                          type: 'post',
                          url: CommonRouleUrl,
                          data: { "activityName": activityName_P, "city": city_P },
                          success: function (result) {
                              $("#query_ms_1").empty();
                              $("#query_ms_1").prepend(result);
                          },
                          error: function () { alert('异步请求发生异常！') }
                      });
}
//公共内容加载
function LoadCommonContent(activityName_P, city_P, strKeyFlag_P, strStyleContent_P, strFirstClassName_P, strSecondClassName_P) {

    $.ajax(
                      {
                          type: 'post',
                          url: CommonRouleUrl,
                          dataType: 'json',
                          data: { "activityName": activityName_P, "city": city_P, "strKeyFlag": strKeyFlag_P, "strStyleContent": strStyleContent_P, "strFirstClassName": strFirstClassName_P, "strSecondClassName": strSecondClassName_P },
                          success: function (result) {
                              $("#" + strKeyFlag_P + "_lijian").empty();
                              $("#" + strKeyFlag_P).empty();

                              $("#" + strKeyFlag_P + "_lijian").prepend(result.MaxDiff);
                              $("#" + strKeyFlag_P).prepend(result.StrHtml);
                          },
                          error: function () { alert('异步请求发生异常！') }
                      });

}

var cll = new ContentLazyLoad();

cll.addCallBack($("#modul_bkms"), function () {
    LoadSecKillContent("16520爆款秒杀", StartCity);
});
cll.addCallBack($("#modul_ouzhou"), function () {
    LoadCommonContent("16520我去欧洲", StartCity, "ouzhou", "red", "menuOn", "menuNo");
});
cll.addCallBack($("#modul_rihantai"), function () {
    LoadCommonContent("16520我去日韩台", StartCity, "rihantai", "yellow", "menU1", "menu1");
});
cll.addCallBack($("#modul_dongnanya"), function () {
    LoadCommonContent("16520我去东南亚", StartCity, "dongnanya", "bluebg", "menU2", "menu2");
});
cll.addCallBack($("#modul_haidao"), function () {
    LoadCommonContent("16520我去海岛", StartCity, "haidao", "red", "menuOn", "menuNo");
});
cll.addCallBack($("#modul_meizhou"), function () {
    LoadCommonContent("16520我去美洲", StartCity, "meizhou", "yellow", "menU1", "menu1");
});
cll.addCallBack($("#modul_dayangzhou"), function () {
    LoadCommonContent("16520我去大洋洲", StartCity, "dayangzhou", "bluebg", "menU2", "menu2");
});
cll.addCallBack($("#modul_zhongdongfei"), function () {
    LoadCommonContent("16520我去中东非", StartCity, "zhongdongfei", "red", "menuOn", "menuNo");
});
cll.addCallBack($("#modul_youlun"), function () {
    LoadCommonContent("16520我去油轮", StartCity, "youlun", "yellow", "Blu", "blu");
});
cll.addCallBack($("#modul_zhoubianyou"), function () {
    LoadCommonContent("16520我去周边游", StartCity, "zhoubianyou", "bluebg", "menU2", "menu2");
});
cll.addCallBack($("#modul_guoneiyou"), function () {
    LoadCommonContent("16520我去国内游", StartCity, "guoneiyou", "red", "menuOn", "menuNo");
});
cll.scrollBind();