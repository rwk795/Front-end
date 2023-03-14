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

- console.table()

```javascript
//输出复合类型对象

var languages = [
  { name: "JavaScript", fileExtension: ".js" },
  { name: "TypeScript", fileExtension: ".ts" },
  { name: "CoffeeScript", fileExtension: ".coffee" }
];
console.table(languages);

```

- console.count()

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

- console.dir()

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

- console.assert()

```javascript
//用于在程序运行过程中进行条件判断，该方法接收两个参数，第一个参数为条件，第二个参数为不满足条件时需要的报错信息，但是程序不会停止运行

console.assert(list.childNodes.length < 500, '节点个数大于等于500')
//当节点个数大于等于500个时，会抛出一个错误
```

- console.time()和console.timeEnd()

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

#### 9.Object.getOwnPropertyDescriptor()

该方法可以获取某个对象属性的描述对象，并且只能用于自身的属性，对继承的属性不起作用

```javascript
var obj = { p: 'a' };
Object.getOwnPropertyDescriptor(obj, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

#### 10.Object.defineProperty()

```javascript
//直接定义的对象，他的属性描述值都为true,
//采用Object.defineProperty()定义的对象属性默认值都为false
let obj1 = {
  a:'sss'
}
let obj2 = Object.defineProperty({},'a',{})
console.dir(Object.getOwnPropertyDescriptor(obj1,'a'))
//{ value: 'sss', writable: true, enumerable: true, configurable: true }
console.dir(Object.getOwnPropertyDescriptor(obj2,'a'))
//{value: undefined,writable: false,enumerable: false,configurable: false}
```

#### 11.map

```javascript
['1','2','3'].map(parseInt)//[1,NaN,NaN]
这是因为parseInt(string, radix)会接收两个参数，第一个表示数值，第二个表示解析时的基数，也就是上述表达式可以转换成
['1','2','3'].map((item,index,self) => parseInt(item,index))，因为parseInt('2',1)和parseInt('3',2)都是非法的，因此都会返回NaN
```

#### 12.RegExp 对象

1. RegExp分为两种类型，一种是修饰符相关，一种是修饰符无关

   - 修饰符相关，用于了解设置了什么修饰符。

     1. RegExp.prototype.ignoreCas：返回一个布尔值，i表示忽略大小写。

     2. RegExp.prototype.global：返回一个布尔值，g表示全局匹配。

     3. RegExp.prototype.multiline：返回一个布尔值，m表示多行模式，主要是会修改'^'和'$'的行为，m会识别换行符。

        ```javascript
        /world$/.test('hello world\n') // false
        /world$/m.test('hello world\n') // true
        ```

     4. RegExp.prototype.flags：返回一个字符串，包含了已经设置的所有修饰符，按字母排序。

   - 修饰符无关的属性，主要是下面两个。
     1. RegExp.prototype.lastInde`：返回一个整数，表示下一次开始搜索的位置。该属性可读写，但是只在进行连续搜索时有意义，详细介绍请看后文。`
     2. RegExp.prototype.source：返回正则表达式的字符串形式（不包括反斜杠），该属性只读。

2. RegExp.prototype.test()：用来测试该模式能否匹配成功

   ```javascript
   /cat/.test('cat and dogs')//true
   //带有g修饰符时，可以通过正则对象的lastIndex属性指定开始搜索的位置
   var r = /x/g;
   var s = '_x_x';
   r.lastIndex = 4;
   r.test(s) // false
   
   r.lastIndex // 0
   r.test(s) // true
   ```

3. RegExp.prototype.exec()：用来返回模式匹配的结果

   ```javascript
   var s = '_x_x';
   var r1 = /x/;
   var r2 = /y/;
   r1.exec(s) // ["x"]
   r2.exec(s) // null
   //当正则表达式中包含括号(组匹配)时，则返回的数组会包括多个成员。第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。也就是说，第二个成员对应第一个括号，第三个成员对应第二个括号
   var r = /a(b+)a(c)/;
   var arr = r.exec('abbac_abac');
   arr // ['abbac','bb','c',]
   arr.index // 0，这里表示匹配成功的开始位置
   arr.input // "abbac_abac",这里表示整个原字符串
   ```

4. 字符串上的匹配方法有如下四种

   - String.prototype.match()：返回一个数组，成员是所有匹配的子字符串。
   - String.prototype.search()：按照给定的正则表达式进行搜索，返回一个整数，表示匹配开始的位置。
   - String.prototype.replace()：按照给定的正则表达式进行替换，返回替换后的字符串。
   - String.prototype.split()：按照给定规则进行字符串分割，返回一个数组，包含分割后的各个成员。

#### 13.JSON对象

1. JSON.stringify()

   - 将一个值转换成符合json格式的字符串，该字符串可以被JSON.parse()还原，需要注意的是对于原始类型的字符串，转换结果会带双引号，因为只有这样才能保证在还原的时候知道是其它类型还是字符串类型

   ```javascript
   var m = JSON.stringify('true')
   console.log(m==="true")//false
   console.log(m === "\"true\"")//true
   ```

   - 如果对象的属性值为undefined、函数或者XML对象，会被JSON.stringify()忽略

   - 如果数组的成员是`undefined`、函数或 XML 对象，则这些值被转成null

   - 正则表达式会被转换成空对象

   - 会忽略掉对象上的不可枚举属性

   - JSON.stringify()的第二个参数可以接收一个数组，指定参数对象的哪些属性需要转成字符串

   - JSON.stringify()还可以接受第三个参数，用于增加返回的 JSON 字符串的可读性。

     ```javascript
     // 默认输出
     JSON.stringify({ p1: 1, p2: 2 })
     // JSON.stringify({ p1: 1, p2: 2 })
     
     // 分行输出
     JSON.stringify({ p1: 1, p2: 2 }, null, '\t')
     // {
     // 	"p1": 1,
     // 	"p2": 2
     // }
     JSON.stringify({ p1: 1, p2: 2 }, null, 2);//表示每个属性前面加两个空格
     /*
     "{
       "p1": 1,
       "p2": 2
     }"
     */
     ```

   - 可以通过为对象添加toJSON()方法来自定义转换

     ```javascript
     let user = {
       lastName:'John',
       firstName:'Miss'
     }
     let user1 = {
       lastName:'John',
       firstName:'Miss',
       toJSON:function(){
         return {
           fullName:this.firstName+this.lastName
         }
       }
     }
     console.log(JSON.stringify(user,null,'\t'))
     /*{
             "lastName": "John",
             "firstName": "Miss"
     }*/
     
     console.log(JSON.stringify(user1,null,'\t'))
     //{"fullName": "MissJohn"}
     ```

##### 14.New.target

在函数内部使用new.target时，当该函数是通过new调用的，则new.target指向当前函数，否则为undefined

```javascript
function f() {
  console.log(new.target === f);
}
f() // false
new f() // true
```

#### 15.模块

模块是实现特定功能的一组属性和方法的封装。简单的做法是把模块写成一个对象，所有的模块成员都放到这个对象里面，模块中的变量需要保持私有，封装私有变量有如下几种方法

```javascript
/*1.利用构造函数保存私有变量
  buffer是构造函数的私有变量，无法通过实例对象直接访问，但是这种做法违背了构造函数与实例  对象在数据上相分离的原则（即实例对象的数据，不应该保存在实例对象以外)
*/
function StringBuilder() {
  var buffer = [];

  this.add = function (str) {
     buffer.push(str);
  };
  this.toString = function () {
    return buffer.join('');
  };
}

/*
2.利用实例对象保存数据
这种做法保存的私有变量可以被外部读取
*/
function StringBuilder() {
  this._buffer = [];
}
StringBuilder.prototype = {
  constructor: StringBuilder,
  add: function (str) {
    this._buffer.push(str);
  },
  toString: function () {
    return this._buffer.join('');
  }
  
 /*
 3.利用立即执行函数
 利用这种做法，构造函数内部的私有变量无法被外部读取，并且可以通过暴露出来的方法来访问私有变量
 */
  var module1 = (function () {
　var _count = 0;
　var m1 = function () {
　  //...
　};
　var m2 = function () {
　　//...
　};
   return {
    m1 : m1,
    m2 : m2
   };
	})();
```

