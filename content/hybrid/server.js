//html目录
var dir = '/html/member';
//域名
var host = 'mhome.uzai.com';
//端口
var port = 35733;



var express = require('express');
var bodyParser = require('body-parser');
var rest = require('restler');

var app = express();
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var pathname = __dirname + dir;

app.use(express.static(pathname));

var server = app.listen(port, host, function () {

    //server.address().address='mdingzhi.'
    //var host = server.address().address;
    //var port = server.address().port;


});


app.post('/data/post', function (req, res) {

    console.log(pathname);

    var url = req.body.path + req.body.controller + '/' + req.body.action;
    var param = JSON.parse(req.body.param);

    rest.post(url, {
        data: param,
    }).on('complete', function (data, response) {
        if (response.statusCode == 200) {
            res.send(data);
        }
        else {
            var data = JSON.stringify({
                ErrorCode: -4,
                ErrorMsg: '服务器访问失败,请重试',
            });
            res.send(data);
        }
    });

});


app.get('/', function (req, res) {
    var hello = 'this is a node server for hybrid. have a goodtime. O(∩_∩)O~~'
    res.send(hello);
    console.log(hello);
});
