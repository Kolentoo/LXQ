/********************************************************************
* 描述: 私家团行程地图js库(高德地图)，参考高德地图api
* 需要引入amap.js高德地图公用js库
* 创建者: wangwei
* 创建日期: 2014-09-17
* 历史:
* ==================================================================
* 酒店地图初始化改版
* 更新日期   |  作者   |  备注
* 2014-10-21 | wangwei | 行程地图加载重叠
* 2014-10-24 | wangwei | 行程地图，点击地点定位到具体地图坐标
* ******************************************************************/
//Array中查找
function findByLngLat(arr, lng, lat) {
    var it = null;
    if (arr && arr.length) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item && item.Lng && item.Lat && item.Lng == lng && item.Lat == lat) {
                it = item;
                break;
            }
        }
    }
    return it;
}
//Array 升序 CommonID
function ascLngLatArr(arr) {
    if (arr && arr.length) {
        arr.sort(function (ex, ey) {
            if (ex.CommonID > ey.CommonID) {
                return 1;
            } else {
                return -1;
            }
        });
    }
}
//Array 升序 Days
function ascLngLatArrByDays(arr) {
    if (arr && arr.length) {
        arr.sort(function (ex, ey) {
            if (ex.Days > ey.Days) {
                return 1;
            } else {
                return -1;
            }
        });
    }
}
//Array中删除
function deleteByLngLat(arr, lng, lat) {
    if (arr && arr.length) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item && item.Lng && item.Lat && item.Lng == lng && item.Lat == lat) {
                arr.splice(i, 1);
            }
        }
    }
}
//int Array中不重复插入
Array.prototype.noRepeatPush = function (vl) {
    var isRepeat = false;
    var arr = this;
    if (arr && arr.length) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == vl) {
                isRepeat = true;
                break;
            }
        }
    }
    if (!isRepeat) {
        arr.push(vl);
    }
};
//int Array中查找
Array.prototype.existByInt = function (vl) {
    var isexist = false;
    var arr = this;
    if (arr && arr.length) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == vl) {
                isexist = true;
                break;
            }
        }
    }
    return isexist;
};
//int Array Asc排序
Array.prototype.ascSort = function () {
    var arr = this;
    arr.sort(function (x, y) {
        if (x > y) {
            return 1;
        } else {
            return -1;
        }
    });
};
//初始化方法
function jouneryMapInit() {
    var windowsArr = []; //地图弹出窗体
    var markerArr = []; //坐标集合
    var markerCustomArr = [];//坐标自定义集合
    var i = 0, j = 0, jouneryItem, jouneryTravelType;
    //获取中心坐标
    var centerL, centerW;
    var hdJouneryPointJson = document.getElementById("hdJouneryPointJson").value;
    var jouneryPointArray = eval("(" + hdJouneryPointJson + ")");
    if (jouneryPointArray && jouneryPointArray.length) {
        ascLngLatArrByDays(jouneryPointArray);
        for (i = 0; i < jouneryPointArray.length; i++) {
            jouneryItem = jouneryPointArray[i];
            if (jouneryItem.ProductTravelTypes && jouneryItem.ProductTravelTypes.length) {
                var isbreak = false;
                for (j = 0; j < jouneryItem.ProductTravelTypes.length; j++) {
                    jouneryTravelType = jouneryItem.ProductTravelTypes[j];
                    if (jouneryTravelType && jouneryTravelType.Longitude && jouneryTravelType.Latitude && $.trim(jouneryTravelType.Longitude)  && $.trim(jouneryTravelType.Latitude)) {
                        centerL = jouneryTravelType.Latitude;
                        centerW = jouneryTravelType.Longitude;
                        isbreak = true;
                        break;
                    }
                }
                if (isbreak) {
                    break;
                }
            }
        }
    }
    if (!centerL || !centerW) {
        centerL = "121.49967";
        centerW = "31.239866";
    }
    //地图加载
    var mapObj, route, toolBar, view; //marker,
    var opt = {
        doubleClickZoom: false, //双击放大地图
        scrollWheel: true, //鼠标滚轮缩放地图
        view: new AMap.View2D({
            center: new AMap.LngLat(centerL, centerW),//地图中心点
            zoom: 3.8 //地图显示的缩放级别
        })
    };

    mapObj = new AMap.Map("jounerymap", opt);
    var path = [];
    //var hdJouneryPointJson = document.getElementById("hdJouneryPointJson").value;
    //var jouneryPointArray = eval("(" + hdJouneryPointJson + ")");
    var lnglatObjArr = [];

    function addMarker(i, lnglatObj) {
        var html = "";
        var itwidth = 0;
        if (lnglatObj && lnglatObj.DayList && lnglatObj.DayList.length) {
            for (var j = 0; j < lnglatObj.DayList.length; j++) {
                html += "<div class='amap-csicon fl' data-day='" + lnglatObj.DayList[j] + "'><img src='//r.uzaicdn.com/content/v1/images/sijia/D" + lnglatObj.DayList[j] + ".png'></div>";
            }
            if (lnglatObj.DayList.length > 1) {
                itwidth = lnglatObj.DayList.length * (30); //26图片宽度，4为间隔像素
            }

            var mar = new AMap.Marker({
                map: mapObj,
                position: new AMap.LngLat(lnglatObj.Lng, lnglatObj.Lat), //基点位置
                topWhenClick: true,
                offset: new AMap.Pixel(-14, -37),
                content: "<div class='location-wrap' style='width:" + itwidth + "px;'><div class='location-" + lnglatObj.CommonKey + " clearfix'>" + html + "</div><div class='location-inner'><div class='decorate-bar'></div></div></div>"
            });
            markerArr.push(new AMap.LngLat(lnglatObj.Lng, lnglatObj.Lat));
            markerCustomArr.push({ Index: i, Lng: lnglatObj.Lng, Lat: lnglatObj.Lat });
            var infoWindow = new AMap.InfoWindow({
                content: "<h3><font color=\"#00a6ac\">  " + lnglatObj.LocationName + "</font></h3>",
                size: new AMap.Size(200, 0),
                autoMove: true,
                offset: new AMap.Pixel(-0, -30)
            });
            windowsArr.push(infoWindow);
            var markerclick = function (e) { mapObj.setZoomAndCenter(mapObj.getZoom(), new AMap.LngLat(lnglatObj.Lng, lnglatObj.Lat)); setTimeout(function () { infoWindow.open(mapObj, mar.getPosition()); }, 100); };
            AMap.event.addListener(mar, "click", markerclick);
        }
    }

    if (jouneryPointArray && jouneryPointArray.length) {
        var k = 1;
       
        for (i = 0; i < jouneryPointArray.length; i++) {
            jouneryItem = jouneryPointArray[i];
            if (jouneryItem.ProductTravelTypes && jouneryItem.ProductTravelTypes.length) {
                for (j = 0; j < jouneryItem.ProductTravelTypes.length; j++) {
                    jouneryTravelType = jouneryItem.ProductTravelTypes[j];
                    if (jouneryTravelType && jouneryTravelType.Longitude && jouneryTravelType.Latitude && $.trim(jouneryTravelType.Longitude)  && $.trim(jouneryTravelType.Latitude)) {
                        path.push(new AMap.LngLat(jouneryTravelType.Latitude, jouneryTravelType.Longitude));
                        var fdItem = findByLngLat(lnglatObjArr, jouneryTravelType.Latitude, jouneryTravelType.Longitude);
                        if (!fdItem) {
                            deleteByLngLat(lnglatObjArr, fdItem.Lng, fdItem.Lat);
                            if (!fdItem.DayList.existByInt(jouneryItem.Days)) {
                                fdItem.Total = fdItem.Total + 1;
                                if (jouneryItem.Days < fdItem.StartDay) {
                                    fdItem.StartDay = jouneryItem.Days;
                                }
                                fdItem.DayList.noRepeatPush(jouneryItem.Days);
                                fdItem.DayList.ascSort();//升序
                                lnglatObjArr.push(fdItem);
                                ascLngLatArr(lnglatObjArr);
                            }
                        } else {
                            var newObj = {};
                            newObj.Lng = jouneryTravelType.Latitude;
                            newObj.Lat = jouneryTravelType.Longitude;
                            newObj.StartDay = jouneryItem.Days;
                            newObj.CommonKey = k;
                            newObj.LocationName = jouneryTravelType.TreeName;
                            newObj.Total = 1;
                            newObj.DayList = [];
                            newObj.DayList.push(jouneryItem.Days);
                            lnglatObjArr.push(newObj);
                            k++;
                        }
                    }
                }
            }
        }

        var lnglatObjArrCopy = lnglatObjArr;
        //先向地图中，添加最前面的那天覆盖物
        if (lnglatObjArr && lnglatObjArr.length) {
            for (i = 0; i < lnglatObjArr.length; i++) {
                var lnglatObj = lnglatObjArr[i];
                addMarker(i, lnglatObj);
            }
        }
        //在地图中添加ToolBar插件
        mapObj.plugin(["AMap.ToolBar"], function () {
            toolBar = new AMap.ToolBar();
            mapObj.addControl(toolBar);
        });

        //设置线条
        polyline = new AMap.Polyline({
            path: path, //设置线覆盖物路径
            strokeColor: "#3E6D02", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 2, //线宽
            strokeStyle: "solid", //线样式
            strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(mapObj);
        //mapObj.moveCamera(CameraUpdateFactory.zoomTo(30));
        //mapObj.setFitView(); //使地图自适应显示到合适的范围

        //地图加载后，绑定jny-address点击/鼠标移上去事件，即把焦点赋予该地址
        $(".jny-address").on("click", function () {
            var os = $(this);
            os.css({ "background-color": "#c59f4c" });
            var lng = os.attr("lng");
            var lat = os.attr("lat");
            var item = findByLngLat(markerCustomArr, lng, lat);
            if (item) {
                mapObj.setZoomAndCenter(mapObj.getZoom(), new AMap.LngLat(item.Lng, item.Lat));
                setTimeout(function () {
                    windowsArr[item.Index].open(mapObj, new AMap.LngLat(item.Lng, item.Lat));
                }, 200);
            }
        });
        $(".jny-address").on("mouseover", function () {
            var os = $(this);
            os.css({"background-color":"#c59f4c"});
        });
        $(".jny-address").on("mouseout", function () {
            var os = $(this);
            os.css({ "background-color": "#209bad" });
        });
    }
}
/**
*酒店地图初始化方法
*/
function hotelMapInit(amapObj, lng, lat, showName) {
    //地图加载
    var  route, marker, toolBar, view;
    if (!amapObj || !amapObj) {
        var opt = {
            doubleClickZoom: false, //双击放大地图
            scrollWheel: true, //鼠标滚轮缩放地图
            view: new AMap.View2D({
                center: new AMap.LngLat(lng, lat),//地图中心点
                zoom: 9
            })
        };
        amapObj = new AMap.Map("hotelmap", opt);
        //在地图中添加ToolBar插件
        amapObj.plugin(["AMap.ToolBar"], function () {
            toolBar = new AMap.ToolBar();
            mapObj.addControl(toolBar);
        });
    } else {
    }
    marker = new AMap.Marker({
        map: amapObj,
        position: new AMap.LngLat(lng, lat),
        offset: new AMap.Pixel(-14, -37),
        content: "<div class='amap-icon' style='position:absolute;width: 26px;height:37px;opacity: 1;'><img src='http://webapi.amap.com/images/1.png' style='top: 0px; left: 0px;'/></div><div style='position:absolute;left:28px;color:black;font-size:12px;white-space:nowrap;'>" + showName + "</div>"
    });
    //amapObj.setFitView(); //使地图自适应显示到合适的范围
}