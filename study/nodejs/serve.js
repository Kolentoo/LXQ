// 建立web服务器
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// req 请求的信息（url get/post）
// res 请求的相应内容
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('nodejs');
});

server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
});

// 相关延展const，var， let的区别
// 1. const定义的变量不可以修改， 而且必须初始化。
// 2. var定义的变量可以修改， 如果不初始化会输出undefined， 不会报错。
// 3. let是块级作用域， 函数内部使用let定义后， 对函数外部无影响。