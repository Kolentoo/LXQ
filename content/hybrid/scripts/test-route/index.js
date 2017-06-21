var app = angular.module('myApp', []);

app.controller('index', function($http, $scope, $compile) {

    $scope.header_title = '我是主页面的header';
    $scope.bb = '我是BBB';
    $scope.cc = '我是index ';

    angular.element(document).ready(function() {
        // 如果需要子页面就把3个固定值传进来
        api.router($http, $scope, $compile);

    });

});
// main 里面绑定数据
app.controller('main', function($http, $scope, $compile) {

    $scope.aa = '我是ccc';
    $scope.bb = '我是ddd';

});

// test 里面绑定数据
app.controller('test', function($http, $scope, $compile) {

    $scope.header_title = '我是test面';

});
