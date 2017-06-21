"use strict";

let arr = [1, 2, 3, 4, 5, 6, 7];
console.log(arr.map(c=>c + 1));

const arr2 = [1, 2, 3, 4, 5, 6, 7];
console.log(arr2.filter(c=>c > 3));

var arr3 = [2, 3, 4, 5, 6, 7];
console.log(arr3.some(c=>c > 8));

var set = new Set();
set.add(1);
set.add(1);
set.add(2);

set.has(3);

var map = new Map();
map.set('a', {});
map.set('b', { v: 1 });
map.set('a', 2);

map.has('a');

function spred(...d) {
    console.log(...d);
}

spred(1, 2, 3, 4);

for(let item of map) {
    console.log(item);
}

for(let item of set) {
    console.log(item);
}

var [a,b,c]=[1,2,3];
console.log(a,b,c);

var {foo,bar}={foo:1,bar:{v:1}};
console.log(foo,bar);

var blocks=[{a:1,b:2},{a:2,b:2},{a:3,b:3}];
var sb="<ul>";
blocks.forEach(item=>{
    sb+=`<li>${item.a},${item.b}</li>`;
});
console.log(sb+'</ul>');

console.log('git hook dev env');
