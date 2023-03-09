#### 1.函数声明提升与变量声明提升
函数声明提升会把函数声明和定义全都提升至作用域顶部，变量声明提升会把变量声明提升到顶部，但是变量定义还在原始位置
```javascript
事例一:
console.log(typeof fn);
function fn(){};
var fn;
//function,因为这里用到了变量提升，先声明的是函数

事例二:
function fn(a){
    console.log(a);
    var a = 2;
    function a(){
    console.log(a);
    }
}
fn(1);
//function a(){}，这里等价于
var a;
a = function(){
    console.log(a);
}
console.log(a);
a = 2;

事例三：
if('a' in window){
    var a = 10;
}
alert(a);//10,function和var会提前声明，而其实{…}内的变量也会提前声明。于是代码还没执行前，a变量已经被声明，于是 ‘a’ in window 返回true，a被赋值。
```
详情可见链接<https://segmentfault.com/a/1190000011326520>
##### 2.label标签
js允许语句的前面有标签（label），相当于定位符，用于跳转到程序的任意位置，可以与continue或break配合使用，标签的格式如下。
```javascript
label:
  语句

top:
  for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
      if (i === 1 && j === 1) break top;
      console.log('i=' + i + ', j=' + j);
    }
  }//这里满足条件之后会跳出外层循环

  top:
  for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
      if (i === 1 && j === 1) continue top;
      console.log('i=' + i + ', j=' + j);
    }
  }//这里满足条件之后会跳出内层循环，进入下一次外层循环
```
#### 3.数据类型
基本数据类型:null, undefined,number,string,boolean,symbol,bigInt，其他的类型都用typeof都会返回object
```javascript
//可以判断任意数据类型的函数
function getType(obj) {
    if (obj === null) return String(obj);
    return typeof obj === 'object' 
    ? Object.prototype.toString.call(obj)
    : typeof obj;
 }
 //为什么一定要用Object.prototype.toString方法，而不是直接用数据类型.toString()方法，这里是因为其它数据类型的toString方法都被重写了
 console.log(getType(1232)); 
```
#### 4.let、var和const的区别
1. let：块作用域，出了块之后就失效，实际上let也会变量提升，但是它只会定义一个变量，并不会给变量赋值，就是不会给变量传一个undefined,所以运行会报错
```javascript
console.log(aa);
let aa = 10;
//ReferenceError: Cannot access 'aa' before initialization
这里并不是说aa没有定义，而是aa没有初始化，也就是并没有自动给aa赋值undefined
let aa;
console.log(aa)//undefined;这里let aa会自动给aa初始化，但是上面的变量提升不会初始化
```
2. var:函数作用域，会变量提升
3. 声明的时候必须初始化，并且声明之后，该变量指向的地址就不能改变，但是该地址的内容还是可以改变
#### 5.null和undefined的区别
1. null可以理解为有值，值为空，转化为数值时为0
2. undefined表示值未定义，转化为数值时为NaN
#### 6.函数作用域
1. 函数内部的变量提升

   函数作用域内部会产生“变量提升”现象。var命令声明的变量，不管在什么位置，变量声明都会被提升到函数体的头部。
```javascript
function foo(x) {
  if (x > 100) {
    var tmp = x - 100;
  }
}
// 等同于
function foo(x) {
  var tmp;
  if (x > 100) {
    tmp = x - 100;
  };
}
```

2. 函数本身的作用域

   函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其声明时所在的作用域，与其运行时所在的作用域无关。

   ```javascript
   var a = 1;
   var x = function () {
     console.log(a);
   };
   function f() {
     var a = 2;
     x();
   }
   f() // 1
   ```

#### 7.finally

finally表示不管是否出现错误，都必需在最后运行的语句，不管出现错误还是因为return等操作导致程序终止，终止之前都必须执行finally中的语句。

```javascript
function cleansUp() {
  try {
    throw new Error('出错了……');
    console.log('此行不会执行');
  } finally {
    console.log('完成清理工作');
  }
}
cleansUp()
// 完成清理工作
// Uncaught Error: 出错了……
//    at cleansUp (<anonymous>:3:11)
//    at <anonymous>:10:1

function idle(x) {
  try {
    console.log(x);
    return 'result';
  } finally {
    console.log('FINALLY');
  }
}
idle('hello')
// hello
// FINALLY

function f() {
  try {
    console.log(0);
    throw 'bug';
  } catch(e) {
    console.log(1);
    return true; // 这句原本会延迟到 finally 代码块结束再执行
    console.log(2); // 不会运行
  } finally {
    console.log(3);
    return false; // 这句会覆盖掉前面那句 return
    console.log(4); // 不会运行
  }

  console.log(5); // 不会运行
}
var result = f();
// 0
// 1
// 3

result
// false
```

#### 8.console 对象

1. console.table()

   ```javascript
   //输出复合类型对象
   
   var languages = [
     { name: "JavaScript", fileExtension: ".js" },
     { name: "TypeScript", fileExtension: ".ts" },
     { name: "CoffeeScript", fileExtension: ".coffee" }
   ];
   console.table(languages);
   
   ```

2. console.count()

   ```javascript
   //用于计数，输出它被调用了多少次
   
   function greet(user) {
     console.count();
     return 'hi ' + user;
   }
   greet('bob')
   //  : 1
   // "hi bob"
   greet('alice')
   //  : 2
   // "hi alice"
   greet('bob')
   //  : 3
   // "hi bob"
   ```

3. console.dir()

   ```javascript
   //用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示，也可用于输出DOM对象
   
   console.log({f1: 'foo', f2: 'bar'})
   // Object {f1: "foo", f2: "bar"}
   
   console.dir({f1: 'foo', f2: 'bar'})
   // Object
   //   f1: "foo"
   //   f2: "bar"
   //   __proto__: Object
   ```

4. console.assert()

   ```javascript
   //用于在程序运行过程中进行条件判断，该方法接收两个参数，第一个参数为条件，第二个参数为不满足条件时需要的报错信息，但是程序不会停止运行
   
   console.assert(list.childNodes.length < 500, '节点个数大于等于500')
   //当节点个数大于等于500个时，会抛出一个错误
   ```

5. console.time()和console.timeEnd()

   ```javascript
   //time表示计时开始，timeEnd表示计时结束，可以结合使用来计算出一个操作所花费的时间，注意time和timeEnd里面的参数名需要保持一致
   
   console.time('Array initialize');
   var array= new Array(1000000);
   for (var i = array.length - 1; i >= 0; i--) {
     array[i] = new Object();
   };
   console.timeEnd('Array initialize');
   // Array initialize: 1914.481ms
   ```

   

