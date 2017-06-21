/********************************************************************
* 描述: 高德地图公用js库，参考高德地图api
* 创建者: wangwei
* 创建日期: 2014-09-17
* 历史:
* ==================================================================
* 更新日期  |  作者  |  备注
* ******************************************************************/
var mapObj, polyline;
/********************
//异步加载高德地图
//callbackMethod：当高德地图js脚本加载完成后执行的js方法（即地图初始化方法）*
********************/
function loadScriptAndMap(callbackMethod) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://webapi.amap.com/maps?v=1.3&key=8903acb8854afcb9d35271c544d67393&callback=" + callbackMethod;
    document.body.appendChild(script);
}
/*************************
//初始化地图对象，加载地图
//eleID: 要绑定地图的元素ID
//lineArr: 线覆盖物节点坐标数组
//markerArr: 点标记坐标数据
*****************************/
function mapInit(eleID, lineArr, markerArr) {
    mapObj = new AMap.Map(eleID, {
        view: new AMap.View2D({
            center: new AMap.LngLat(121.540732, 31.324056), //地图中心点
            zoom: 0.0000000001 //地图显示的缩放级别
        })
    });
    polyline = new AMap.Polyline({
        path: lineArr, //设置线覆盖物路径
        strokeColor: "#515151", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 2, //线宽
        strokeStyle: "dashed", //线样式
        strokeDasharray: [10, 5], //补充线样式
        geodesic: true //绘制大地线
    });
    polyline.setMap(mapObj);
    if (markerArr && markerArr.length) {
        for (var i = 0; i < markerArr.length; i++) {
            var currMarker = markerArr[i];
            currMarker.setMap(mapObj);
        }
    }
}
// 点标记结构
//    var marker1 = new AMap.Marker({
//        //map: mapObj, //添加到地图
//        position: new AMap.LngLat(121.540732, 31.324056), //基点位置
//        offset: new AMap.Pixel(-14, -37), //相对于基点的位置
//        //                icon: new AMap.Icon({  //复杂图标
//        //                    size: new AMap.Size(28, 37), //图标大小
//        //                    image: "http://webapi.amap.com/images/custom_a_j.png", //大图地址
//        //                    imageOffset: new AMap.Pixel(0, 0)//相对于大图的取图位置
//        //                }),
//        content: "<div class='amap-icon' style='position:absolute;width: 28px;height:37px;opacity: 1;'><img src='http://webapi.amap.com/images/custom_a_j.png' style='top: 0px; left: 0px;'/></div><div style='position:absolute;left:28px;color:black;font-size:12px;white-space:nowrap;'>上海</div>"
//    });
//    //marker1.setMap(mapObj);
//    markerArr = !markerArr ? new Array() : markerArr;
//    markerArr.push(marker1);
//    var marker2 = new AMap.Marker({
//        //map: mapObj, //添加到地图
//        position: new AMap.LngLat(114.3337, 22.155332), //基点位置
//        offset: new AMap.Pixel(-14, -34), //相对于基点的位置
//        icon: new AMap.Icon({  //复杂图标
//            size: new AMap.Size(28, 37), //图标大小
//            image: "http://webapi.amap.com/images/custom_a_j.png", //大图地址
//            imageOffset: new AMap.Pixel(-28, 0)//相对于大图的取图位置
//        })
//    });
//    //marker2.setMap(mapObj);
//    markerArr.push(marker2);
//    var marker3 = new AMap.Marker({
//        //map: mapObj, //添加到地图
//        position: new AMap.LngLat(105.852255, 21.134183), //基点位置
//        offset: new AMap.Pixel(-14, -34), //相对于基点的位置
//        icon: new AMap.Icon({  //复杂图标
//            size: new AMap.Size(28, 37), //图标大小
//            image: "http://webapi.amap.com/images/custom_a_j.png", //大图地址
//            imageOffset: new AMap.Pixel(-28 * 2, 0)//相对于大图的取图位置
//        })
//    });
//    //marker3.setMap(mapObj);
//    markerArr.push(marker3);
//    var marker4 = new AMap.Marker({
//        //map: mapObj, //添加到地图
//        position: new AMap.LngLat(101.721396, 3.062052), //基点位置
//        offset: new AMap.Pixel(-14, -34), //相对于基点的位置
//        icon: new AMap.Icon({  //复杂图标
//            size: new AMap.Size(28, 37), //图标大小
//            image: "http://webapi.amap.com/images/custom_a_j.png", //大图地址
//            imageOffset: new AMap.Pixel(-28 * 3, 0)//相对于大图的取图位置
//        })
//    });
//    markerArr.push(marker4);
//String Trim
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};