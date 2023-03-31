[TOC]

详细内容见链接：https://wangdoc.com/es6/

#### 1.为什么需要块级作用域

```javascript
//1.内层变量可能会覆盖外层变量
var tmp = new Date();
function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }
}
f(); // undefined，这里涉及到了变量提升，虽然条件判断没有满足，但是var tmp会被提升

//2.用来计数的循环变量泄露为全局变量
var s = 'hello';
for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}
console.log(i); // 5
```

#### 2.模版标签

模版字符串可以直接跟在一个函数后面，这种就被称为“模版标签”

```javascript
alert`hello`
// 等同于
alert(['hello'])

let a = 5;
let b = 10;
tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ',''], 15, 50);
//函数的第一个参数为数组，该数组的成员是模板字符串中那些没有变量替换的部分，后面的参数分别为模版字符串中的变量，有几个变量就有几个参数

//标签模版的一个重要作用就是用来过滤html字符串，防止用户输入恶意内容
let message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
let sender = '<script>alert("abc")</script>'; // 恶意代码
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

message
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>
```

#### 3.String.raw()

这是ES6为原生的 String 对象，提供了一个raw()方法，该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串

```javascript
String.raw`Hi\n${2+3}!`
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

String.raw`Hi\u000A!`;
// 实际返回 "Hi\\u000A!"，显示的是转义后的结果 "Hi\u000A!"

String.raw`Hi\\n`
// 返回 "Hi\\\\n",显示的是转义后的结果"Hi\\n"
String.raw`Hi\\n` === "Hi\\\\n" // true

//String.raw()本质上是一个正常的函数，只是专用于模板字符串的标签函数。如果写成正常函数的形式，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组，对应模板字符串解析后的值。
`foo${1 + 2}bar`
// 等同于
String.raw({ raw: ['foo', 'bar'] }, 1 + 2) // "foo3bar"
```

#### 4.String.normalize()

多欧洲语言有语调符号和重音符号。为了表示它们，Unicode 提供了两种方法。一种是直接提供带重音符号的字符，比如`Ǒ`（\u01D1）。另一种是提供合成符号（combining character），即原字符与重音符号的合成，两个字符合成一个字符，比如`O`（\u004F）和`ˇ`（\u030C）合成Ǒ（\u004F\u030C），ES6 提供字符串实例的normalize()方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。

```javascript
'\u01D1'==='\u004F\u030C' //false
'\u01D1'.length // 1
'\u004F\u030C'.length // 2
'\u01D1'.normalize() === '\u004F\u030C'.normalize()// true
```

normalize方法可以接受一个参数来指`normalize的方式，参数的四个可选值如下。

- `NFC`，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。
- `NFD`，表示“标准等价分解”（Normalization Form Canonical Decomposition），即在标准等价的前提下，返回合成字符分解的多个简单字符。
- `NFKC`，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。（这只是用来举例，`normalize`方法不能识别中文。）
- `NFKD`，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），即在兼容等价的前提下，返回合成字符分解的多个简单字符。

```javascript
'\u004F\u030C'.normalize('NFC').length // 1
'\u004F\u030C'.normalize('NFD').length // 2
```

#### 5.正则的扩展

1. u修饰符：用来正确处理大于`\uFFFF`的 Unicode 字符

   ```javascript
   /^\uD83D/u.test('\uD83D\uDC2A') // false
   /^\uD83D/.test('\uD83D\uDC2A') // true
   //上面代码中，\uD83D\uDC2A是一个四个字节的 UTF-16 编码，代表一个字符。但是，ES5 不支持四个字节的 UTF-16 编码，会将其识别为两个字符，导致第二行代码结果为true。加了u修饰符以后，ES6 就会识别其为一个字符，所以第一行代码结果为false
   ```

2. y修饰符：`y`修饰符的作用与`g`修饰符类似，也是全局匹配，但是y修饰符需要确保匹配必须从剩余的第一个位置开始

   ```javascript
   var s = 'aaa_aa_a';
   var r1 = /a+/g;
   var r2 = /a+/y;
   
   r1.exec(s) // ["aaa"]
   r2.exec(s) // ["aaa"]
   
   r1.exec(s) // ["aa"]
   r2.exec(s) // null，这里因为lastindex是2，下一次匹配从_aa_a开始，因此无法匹配
   ```

3. s修饰符：doAll模式，因为在正则中"."能代表除了四个字节的 UTF-16 字符和换行符之外的任意字符，但是加上s修饰符之后，使得"."可以匹配任意单个字符。

   ```javascript
   /foo.bar/.test('foo\nbar')
   // false
   /foo.bar/s.test('foo\nbar') // true
   ```

4. 具名组匹配：可以为组匹配指定一个名字

   ```javascript
   //普通的组匹配，只能用下标来表示不同的组，不易与阅读
   const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
   const matchObj = RE_DATE.exec('1999-12-31');
   const year = matchObj[1]; // 1999
   const month = matchObj[2]; // 12
   const day = matchObj[3]; // 31
   
   //具名组匹配
   const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
   const matchObj = RE_DATE.exec('1999-12-31');
   const year = matchObj.groups.year; // "1999"
   const month = matchObj.groups.month; // "12"
   const day = matchObj.groups.day; // "31"
   ```

5. d修饰符：可以让exec()、match()的返回结果添加indices属性，在该属性上面可以拿到匹配的开始位置和结束位置

   ```javascript
   const text = 'zabbcdef';
   const re = /ab/d;
   const result = re.exec(text);
   result.index // 1
   result.indices // [ [1, 3] ],这里数组成员的第一个数字表示匹配开始的位置，第二个数字表示匹配结束的下一个位置
   
   const text = 'zabbcdef';
   const re = /ab+(cd)/d;
   const result = re.exec(text);
   result.indices // [ [ 1, 6 ], [ 4, 6 ] ]，如果包含组匹配，则indices里面的第一个数组为整个匹配结果的开始位置和结束位置，后面的数组成员分别为组匹配的开始位置和结束位置
   ```

#### 6.数值的扩展

1. 数值分隔符：允许使用\_作为分隔符

   ```javascript
   123_00 === 12_300 // true
   12345_00 === 123_4500 // true
   12345_00 === 1_234_500 // true
   ```

2. Number.EPSILON:它表示 1 与大于 1 的最小浮点数之间的差，主要用来定义一个可接受的最小误差范围，大小为2的-52次方

   ```javascript
   Number.EPSILON === Math.pow(2, -52)// true
   Number.EPSILON// 2.220446049250313e-16
   Number.EPSILON.toFixed(20)// "0.00000000000000022204"
   //通过Number.EPSILON来定义一个函数，用来判断两个数值是否“近似”相等
   function withinErrorMargin (left, right) {
     return Math.abs(left - right) < Number.EPSILON;
   }
   
   0.1 + 0.2 === 0.3 // false
   withinErrorMargin(0.1 + 0.2, 0.3) // true
   
   1.1 + 1.3 === 2.4 // false
   withinErrorMargin(1.1 + 1.3, 2.4) // true
   ```

#### 7.函数的扩展

1. 函数参数的解构赋值

   ```javascript
   function foo({x, y = 5} = {}) {
     console.log(x, y);
   }
   foo() // undefined 5
   //特别需要注意的是，如果函数的参数为对象，并且存在默认值以及解构赋值，那么当函数调用时没有写参数，就会先给该参数赋默认值，然后进行解构赋值
   function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
     console.log(method);
   }
   fetch('http://example.com')// "GET"
   
   function f({ a, b = 'world' } = { a: 'hello' }) {
     console.log(b);
   }
   f() // world，首先参数的默认值生效，然后再进行解构赋值，因此b='world'
   
   //如果参数存在对象的话，尽量使用函数解构和默认值结合的方式
   // 写法一
   function m1({x = 0, y = 0} = {}) {
     return [x, y];
   }
   // 写法二
   function m2({x, y} = { x: 0, y: 0 }) {
     return [x, y];
   }
   // 函数没有参数的情况
   m1() // [0, 0]
   m2() // [0, 0]
   // x 和 y 都有值的情况
   m1({x: 3, y: 8}) // [3, 8]
   m2({x: 3, y: 8}) // [3, 8]
   // x 有值，y 无值的情况
   m1({x: 3}) // [3, 0]
   m2({x: 3}) // [3, undefined]
   // x 和 y 都无值的情况
   m1({}) // [0, 0];
   m2({}) // [undefined, undefined]
   m1({z: 3}) // [0, 0]
   m2({z: 3}) // [undefined, undefined]
   ```

2. 函数的length属性：length属性的含义就是该函数预期传入的参数个数，因此如果函数某个参数有默认值，那就不会计算到length中

   ```javascript
   (function (a) {}).length // 1
   (function (a = 5) {}).length // 0
   (function (a, b, c = 5) {}).length // 2
   //这里需要注意的是如果默认参数不是尾参数，该默认参数后面的参数也都不计入length
   (function (a = 0, b, c) {}).length // 0
   (function (a, b = 1, c) {}).length // 1
   ```

3. 参数作用域：当函数参数设置默认值时，函数在进行声明初始化时，参数会形成一个单独的作用域，初始化结束作用域就会消失

   ```javascript
   var x = 1;
   function f(x, y = x) {
     console.log(y);
   }
   f(2) // 2，这里参数y的默认值为x，也就是指向第一个参数x
   
   let x = 1;
   function f(y = x) {
     let x = 2;
     console.log(y);
   }
   f() // 1，这里因为参数作用域中没有x，因此x指向全局x
   
   var x = 1;
   function foo(x, y = function() { x = 2; }) {
     var x = 3;
     y();
     console.log(x);
   }
   foo() // 3，因为第二个参数y的函数里面的x指向的是第一个参数x，但是foo内部定义的x与参数x不是同一个，因此最后输出的x为3
   x // 1，因为foo内部的两个x，都不会影响外部的全局x，因此全局x的值为1
   
   var x = 1;
   function foo(x, y = function() { x = 2; }) {
     x = 3;
     y();
     console.log(x);
   }
   foo() // 2，这里因为foo内部没有var，因此内部的x与参数x与参数y内部的x都是同一个，因此最后x=2
   x // 1，这里因为foo内部不影响全局x
   ```

4. 尾调用优化：函数的最后一步是调用另一个函数，普通的内部函数调用会在内存中形成一个调用栈，因为内部函数调用需要记住外部函数的变量、环境等，如果使用尾调用，则代表该函数调用是函数的最后一步操作，所以不需要保留外层函数的调用帧，目前只有safari支持，需要注意的是，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧。通过尾调用可以延伸到尾递归。

   ```javascript
   //属于尾调用
   function f(x){
     return g(x);
   }
   
   //下面三种情况都不属于尾调用
   // 情况一，调用函数g之后，还进行了赋值操作
   function f(x){
     let y = g(x);
     return y;
   }
   // 情况二，调用函数g之后进行了赋值操作
   function f(x){
     return g(x) + 1;
   }
   // 情况三，相当于调用函数g之后，还执行了return undefined；
   function f(x){
     g(x);
   }
   
   //尾递归例子，斐波那契数列
   //非尾递归
   function Fibonacci (n) {
     if ( n <= 1 ) {return 1};
     return Fibonacci(n - 1) + Fibonacci(n - 2);
   }
   //尾递归
   function Fibonacci(n,s1 = 1,s2 = 1){
     if(n<=1){
       return s2;
     }
     return Fibonacci(n-1,s2,s1+s2)
   }
   ```

#### 8.数组的扩展

1. 扩展运算符：ES6新增了扩展运算符(...)，可以把一个数组转化为用逗号分隔的参数序列

   ```javascript
   console.log(...[1, 2, 3])
   // 1 2 3
   console.log(1, ...[2, 3, 4], 5)
   // 1 2 3 4 5
   const arr = [
     ...(x > 0 ? ['a'] : []),//可以放置表达式
     'b',
   ];
   //利用扩展运算符合并数组
   const arr1 = ['a', 'b'];
   const arr2 = ['c'];
   const arr3 = ['d', 'e'];
   // ES5 的合并数组
   arr1.concat(arr2, arr3);// [ 'a', 'b', 'c', 'd', 'e' ]
   
   // ES6 的合并数组
   [...arr1, ...arr2, ...arr3]// [ 'a', 'b', 'c', 'd', 'e' ]
   
   //把字符串转化为真正的数组
   [...'hello']// [ "h", "e", "l", "l", "o" ]
   
   //可以识别4个字节的Unicode字符
   'x\uD83D\uDE80y'.length // 4
   [...'x\uD83D\uDE80y'].length // 3
   ```

2. Array.from:可以将类数组（必须有length属性）或者有Iterator 接口的对象转化为数组

   ```javascript
   let arrayLike = {
       '0': 'a',
       '1': 'b',
       '2': 'c',
       length: 3
   };
   // ES5 的写法
   var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
   // ES6 的写法
   let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
   // arguments 对象
   function foo() {
     var args = Array.from(arguments);
   }
   Array.from('hello')// ['h', 'e', 'l', 'l', 'o']，字符串有lterator接口
   
   //可以接受一个函数作为第二个参数，对数组中的每个元素进行处理，类似于map
   Array.from({ length: 2 }, () => 'jack')// ['jack', 'jack']
   ```

3. Array.of:用于将一组数据转化成数组，可以说是弥补数组构造函数`Array()`的不足

   ```javascript
   //利用构造函数，参数个数不同行为不同
   Array() // []
   Array(3) // [, , ,]，等价于创建一个长度为3的数组
   Array(3, 11, 8) // [3, 11, 8]//只有当参数个数大于1时，才会返回由参数组成的数组
   
   //利用Array.of，与构造函数不同，Array.of不管参数个数是多少个，最后的行为都是统一的
   Array.of(3, 11, 8) // [3,11,8]
   Array.of(3) // [3]
   Array.of(3).length // 1
   ```

4. copyWithIn：在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组，也就是说会改变原数组

   ```javascript
   Array.prototype.copyWithin(target, start = 0, end = this.length)
   //表示从start开始，到end下标的前一个结束读取数据，从target开始替换
   [1, 2, 3, 4, 5].copyWithin(0, 3)// [4, 5, 3, 4, 5]，表示从下标3开始到最后一位也就是4和5，然后从数组的下标0开始替换
   
   // 将3号位复制到0号位
   [1, 2, 3, 4, 5].copyWithin(0, 3, 4)// [4, 2, 3, 4, 5]
   
   // -2相当于3号位，-1相当于4号位
   [1, 2, 3, 4, 5].copyWithin(0, -2, -1)// [4, 2, 3, 4, 5]
   ```

5. 数组的拉平

   ```javascript
   [1, 2, [3, [4, 5]]].flat()// [1, 2, 3, [4, 5]]
   
   //如果有嵌套数组，则需要输入参数，表示要拉平的层数
   [1, 2, [3, [4, 5]]].flat(2)// [1, 2, 3, 4, 5]
   //如果不管有多少层嵌套都要拉平，则可以用Infinity作为参数
   [1, [2, [3]]].flat(Infinity)// [1, 2, 3]
   
   //flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。
   
   // 相当于 [[2, 4], [3, 6], [4, 8]].flat()
   [2, 3, 4].flatMap((x) => [x, x * 2])// [2, 4, 3, 6, 4, 8]
   ```

#### 9.对象的扩展

1. 属性名表达式

   ```javascript
   //ES6允许用表达式作为对象的属性名
   let lastWord = 'last word';
   const a = {
     'first word': 'hello',
     [lastWord]: 'world'
   };
   a['first word'] // "hello"
   a[lastWord] // "world"
   a['last word'] // "world"
   //需要注意的是当表达式是一个对象，会自动将对象转为字符串'[object Object]'
   const keyA = {a: 1};
   const keyB = {b: 2};
   const myObject = {
     [keyA]: 'valueA',
     [keyB]: 'valueB'
   };
   myObject // Object {[object Object]: "valueB"}，因为keyA和keyB都会转化成字符串'[object Object]'，因此keyA会被keyB覆盖
   ```

2. 属性的可枚举性

   对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为,描述对象的enumerable属性，称为“可枚举性”，如果该属性为false，就表示某些操作会忽略当前属性。

   目前，有四个操作会忽略enumerable为false的属性。

   - for...in循环：只遍历对象自身的和继承的可枚举的属性，会遍历继承的属性，因此遍历对象尽量使用Object.keys()。
   - Object.keys()：返回对象自身的所有可枚举的属性的键名。
   - JSON.stringify()：只串行化对象自身的可枚举的属性。
   - Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

3. super关键字：指向当前对象的原型对象

   ```javascript
   const proto = {
     foo: 'hello'
   };
   const obj = {
     foo: 'world',
     find() {
       return super.foo;
     }
   };
   Object.setPrototypeOf(obj, proto);
   obj.find() // "hello"，这里调用的是原型对象proto的foo属性
   //需要注意的是，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错，目前只有对象方法的简写法可以让JavaScript引擎确认，定义的是对象的方法。
   // 报错，不能用在属性里面
   const obj = {
     foo: super.foo
   }
   // 报错，写在一个函数里面，然后赋值给foo属性
   const obj = {
     foo: () => super.foo
   }
   
   // 报错，写在一个函数里面，然后赋值给foo属性
   const obj = {
     foo: function () {
       return super.foo
     }
   }
   ```

4. AggregateError：一个用来抛出多个错误的构造函数

   AggregateError(errors[, message])

   - errors：数组，它的每个成员都是一个错误对象。该参数是必须的。
   - message：字符串，表示 AggregateError 抛出时的提示信息。该参数是可选的。

   ```javascript
   const error = new AggregateError([
     new Error('ERROR_11112'),
     new TypeError('First name must be a string'),
     new RangeError('Transaction value must be at least 1'),
     new URIError('User profile link must be https'),
   ], 'Transaction cannot be processed')
   ```

5. 克隆一个对象及其原型上的属性

   ```javascript
   // 写法一,不推荐，因为在非浏览器环境不一定成功
   const clone1 = {
     __proto__: Object.getPrototypeOf(obj),
     ...obj
   };
   
   // 写法二，推荐
   const clone2 = Object.assign(
     Object.create(Object.getPrototypeOf(obj)),
     obj
   );
   
   // 写法三，推荐,Object.create的第一个参数表示clone3对象的原型，第二个参数表示需要加入到clone3对象里的属性，可以添加属性描述对象
   const clone3 = Object.create(
     Object.getPrototypeOf(obj),
     Object.getOwnPropertyDescriptors(obj)
   )
   ```

6. Object.hasOwn(obj, property):用来判断属性是否为对象自身的属性，不包括继承属性。与hasOwnProperty方法不同的是，当对象没有原型时，调用hasOwnProperty会报错，因为hasOwnProperty是原型上的方法

   ```javascript
   const foo = Object.create({ a: 123 });
   foo.b = 456;
   Object.hasOwn(foo, 'a') // false
   Object.hasOwn(foo, 'b') // true
   //与对象的hasOwnProperty方法的区别
   //对象的hasOwnProperty方法是用来判断某个属性是否为原生属性
   const obj = Object.create(null);
   obj.hasOwnProperty('foo') // 报错，因为该obj对象没有原型，而hasOwnProperty是原型上的方法
   Object.hasOwn(obj, 'foo') // false
   
   let o = Object.create({});
   console.log(o.hasOwnProperty === Object.hasOwnProperty)//true
   ```

#### 10.Symbol

1. Symbol表示独一无二的值，通过Symbol()生成

   ```javascript
   let s1 = Symbol('foo');
   let s2 = Symbol({
     toString(){
       return 'bar'
     }
   });
   s1 // Symbol(foo)
   s2 // Symbol(bar)，当Symbol的参数是一个对象时，会调用该对象的toString()方法
   //Symbol提供了一个description用来表示该Symbol的描述信息
   s1.description//foo
   s1.description//bar
   ```

2. 作为属性名：使用Symbol作为属性名，对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖

   ```javascript
   //需要注意的是Symbol作为属性名必须用[]，不能用点(.)运算符
   let mySymbol = Symbol();
   const a = {};
   a.mySymbol = 'my';//这里把mySymbol当成了字符串而不是一个Symbol
   a[mySymbol]//undefined
   a['mySymbol']//my
   ```

3. 属性名的遍历

   - for...in、for...of、Object.keys()、Object.getOwnPropertyNames()：都不会读取Symbol属性

   - getOwnPropertySymbols()可以拿到对象中所有作为属性的Symbol，返回一个数组

     ```javascript
     const a = {
       [Symbol('a')]:'a',
       [Symbol('b')]:'b',
     }
     Object.getOwnPropertySymbols(a)//[ Symbol(a), Symbol(b) ]
     ```

   - Reflect.ownKeys()：可以返回一个对象里面的所有键名，包括字符串属性和Symbol属性

     ```javascript
     const a = {
       [Symbol('a')]:'a',
       [Symbol('b')]:'b',
       'c':'c'
     }
     Reflect.ownKeys(a)//[ 'c', Symbol(a), Symbol(b) ]
     ```

4. Symbol.for()：相当于一个注册表，用该方法生成的Symbol，如果描述相同，则会返回同一个Symbol，但是用Symbol生成的永远是独一无二的Symbol

   ```javascript
   const s1 = Symbol.for('s1');
   const s2 = Symbol.for('s1');
   s1 === s2//true
   Symbol.keyfor(s2)//s1,Symbol.keyfor用来返回一个已经注册的Symbol类型的描述
   ```

5. 







