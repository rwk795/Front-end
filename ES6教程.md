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


#### 11 proxy

```javascript
//1.利用proxy创建一个代理对象，该代理对象相当于原对象与外界的交流方式，对原对象的操作会影响代理对象，对代理对象的操作也会影响原对象
let obj = {
    name:'rwk',
    age:40
}
let proObj = new Proxy(obj,{
    get:function(target,key,receiver){
        console.log(target===obj);//obj
        console.log(receiver===proObj);//proObj
        if(key==='age')return target[key]-10;
        else return target[key];
    }
})
console.log(proObj['name']);
console.log(proObj['age']);

//proxy支持的拦截操作
var proxyObj = new Proxy(obj, {
    get: function(tagert,key,receiver){},
    set: function(tagert,key,receiver){},
    has: function(tagert,key){},
    deleteProperty: function(tagert,key){},
    ownKeys: function(tagert){},
    getOwnPropertyDescriptor: function(tagert,key){},
    defineProperty: function(tagert,key,desc){},
    preventExtensions: function(tagert){},
    getPrototypeOf: function(tagert){},
    isExtensible: function(tagert){},
    setPrototypeof: function(tagert,proto){},
    apply: function(tagert,obj,args){},
    construct: function(tagert,args){},
})

//访问不存在的参数名报错
let proObj1 = new Proxy(obj,{
    get:function(target,key,receiver){
        if(key in target)return target[key];
        else throw new Error(`该属性${key}不存在`);
    }
})
console.log(proObj1['na'])//报错，该属性na不存在

//允许数组下标为负值，并且允许超出数组长度
let proObj2 = new Proxy([3,4,5],{
    get:function(target,key,receiver){
        if(key<0)return target[target.length+parseInt(key)];
        else if (key>=target.length)return target[key-target.length];
        else return target[key];
    }
})

//实现链式计算
let fn = {
    pow2 : n=>n*n,
    double : n=>n*2,
    half : n=>n/2
}
function pipe(nums){
    let func = [];
    let obj = new Proxy({},{
        get:function(target,key,receiver){
            if(key==='end'){
                return func.reduce((acc,cur)=>cur(acc),nums)
            }
            else{
                func.push(fn[key]);
                return obj;
            }
        }
    })
    return obj;
}
console.log(pipe(3).pow2.double.end);//18
```

#### 12 reflect

1. Reflect.get(target, name, receiver) 

   ```javascript
   var myObject = {
     foo: 1,
     bar: 2,
     get baz() {
       return this.foo + this.bar;
     },
   }
   Reflect.get(myObject, 'foo') // 1
   Reflect.get(myObject, 'bar') // 2
   Reflect.get(myObject, 'baz') // 3
   
   var myObject = {
     foo: 1,
     bar: 2,
     get baz() {
       return this.foo + this.bar;
     },
   };
   var myReceiverObject = {
     foo: 4,
     bar: 4,
   };
   Reflect.get(myObject, 'baz', myReceiverObject) //8,如果name属性部署了读取函数（getter），则读取函数的this绑定receiver
   ```

2. Reflect.set(target, name, value, receiver)

   ```javascript
   var myObject = {
     foo: 1,
     set bar(value) {
       return this.foo = value;
     },
   }
   myObject.foo // 1
   Reflect.set(myObject, 'foo', 2);
   myObject.foo // 2
   Reflect.set(myObject, 'bar', 3)
   myObject.foo // 3
   
   var myObject = {
     foo: 4,
     set bar(value) {
       return this.foo = value;
     },
   };
   var myReceiverObject = {
     foo: 0,
   };
   Reflect.set(myObject, 'bar', 1, myReceiverObject);//如果name属性设置了赋值函数，则赋值函数的this绑定receiver
   myObject.foo // 4
   myReceiverObject.foo // 1
   ```

3. Reflect.has(target, name)

   ```javascript
   var myObject = {
     foo: 1,
   };
   // 旧写法
   'foo' in myObject // true
   // 新写法
   Reflect.has(myObject, 'foo') // true
   ```

4. Reflect.deleteProperty(target, name)

   ```javascript
   const myObj = { foo: 'bar' };
   // 旧写法
   delete myObj.foo;
   // 新写法
   Reflect.deleteProperty(myObj, 'foo');
   ```

5. Reflect.construct(rarget,args)

   ```javascript
   function Greeting(name) {
     this.name = name;
   }
   // new 的写法
   const instance = new Greeting('张三');
   // Reflect.construct 的写法
   const instance = Reflect.construct(Greeting, ['张三']);
   ```

6. Reflect.getPrototypeOf(target)

   ```javascript
   const myObj = new FancyThing();
   // 旧写法
   Object.getPrototypeOf(myObj) === FancyThing.prototype;
   // 新写法
   Reflect.getPrototypeOf(myObj) === FancyThing.prototype;
   ```

7. Reflect.setPrototypeOf(target,prototype)

   ```javascript
   const myObj = {};
   
   // 旧写法
   Object.setPrototypeOf(myObj, Array.prototype);
   
   // 新写法
   Reflect.setPrototypeOf(myObj, Array.prototype);
   
   myObj.length // 0
   ```

8. Reflect.apply

   ```javascript
   const ages = [11, 33, 12, 54, 18, 96];
   
   // 旧写法
   const youngest = Math.min.apply(Math, ages);
   const oldest = Math.max.apply(Math, ages);
   const type = Object.prototype.toString.call(youngest);
   // 新写法
   const youngest = Reflect.apply(Math.min, Math, ages);
   const oldest = Reflect.apply(Math.max, Math, ages);
   const type = Reflect.apply(Object.prototype.toString, youngest, []);
   ```

9. Reflect.defineProperty(target, name, desc)

   ```javascript
   function MyDate() {
     /*…*/
   }
   // 旧写法
   Object.defineProperty(MyDate, 'now', {
     value: () => Date.now()
   });
   // 新写法
   Reflect.defineProperty(MyDate, 'now', {
     value: () => Date.now()
   });
   ```

10. Reflect.getOwnPropertyDescriptor(target, name)

    ```javascript
    var myObject = {};
    Object.defineProperty(myObject, 'hidden', {
      value: true,
      enumerable: false,
    });
    // 旧写法
    var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden');
    // 新写法
    var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden');
    ```

11. Reflect.isExtensible(target)

    ```javascript
    const myObject = {};
    
    // 旧写法
    Object.isExtensible(myObject) // true
    // 新写法
    Reflect.isExtensible(myObject) // true
    ```

12. Reflect.preventExtensions(target)

    ```javascript
    //Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。
    var myObject = {};
    // 旧写法
    Object.preventExtensions(myObject) // Object {}
    // 新写法
    Reflect.preventExtensions(myObject) // true
    ```

13. Reflect.ownKeys(target)

    ```javascript
    //Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
    var myObject = {
      foo: 1,
      bar: 2,
      [Symbol.for('baz')]: 3,
      [Symbol.for('bing')]: 4,
    };
    
    // 旧写法
    Object.getOwnPropertyNames(myObject)
    // ['foo', 'bar']
    Object.getOwnPropertySymbols(myObject)
    //[Symbol(baz), Symbol(bing)]
    
    // 新写法
    Reflect.ownKeys(myObject)
    // ['foo', 'bar', Symbol(baz), Symbol(bing)]
    ```

#### 13 promise

1. 解决了回调地狱

   - 回调函数延迟绑定(回调函数不是直接返回的，而是通过then传入)

   - 返回值穿透(我们会根据 then 中回调函数的传入值创建不同类型的Promise, 然后把返回的 Promise 穿透到外层, 以供后续的调用)

   - 错误冒泡:最上面的错误会根据链式调用不断的往后面传，直到最后一个catch，不需要频繁的检查错误

     ```javascript
     readFilePromise('1.json').then(data => {
         return readFilePromise('2.json');
     }).then(data => {
         return readFilePromise('3.json');
     }).then(data => {
         return readFilePromise('4.json');
     }).catch(err => {
       // xxx
     })
     ```

2. 静态方法

   ```javascript
   //不管promise是fulfilled还是rejected都会执行
   Promise.prototype.myFinally = function(onfinally) {
     return this.then(res=>{
       return Promise.resolve(onfinally()).then(() =>res);
     },rej => {
       return Promise.resolve(onfinally()).then(() => {throw rej});
     })
   }
   Promise.myResolve = (p) => {
     return new Promise((resolve,reject) => {
       resolve(p);
     })
   }
   Promise.myReject = (p) => {
     return new Promise((resolve,reject) => {
       reject(p);
     })
   }
   //异步执行一组promise，有一个被rejected就返回rejected，全部fulfilled才会返回fulfilled
   Promise.myAll = (promises) => {
     let len = promises.length;
     let count = 0;
     let result = [];
     return new Promise((resolve,reject) => {
       promises.forEach(p => {
         Promise.myResolve(p)
         .then((res) => {
           result.push(res);
           count ++;
           if(count === len)resolve(result);
         },rej=>{
           reject(rej)
         })
       });
     })
   }
   //异步执行一组promise，返回一组表示promise对象状态的对象
   Promise.myAllSettled = (promises) => {
     let result = [];
     let count = 0;
     let len = promises.length;
     return new Promise((resolve,reject) => {
       promises.forEach((p)=>{
         Promise.myResolve(p)
         .then(res=>{
           count++;
           result.push(res);
           if(count === len)resolve(result);
         },rej => {
           count++;
           result.push(rej);
           if(count === len)resolve(result);
         })
       })
     })
   }
   //异步执行一组peomise，哪个最先执行完就返回那个状态
   Promise.myRace = (promises) => {
     return new Promise((resolve,reject) => {
       promises.forEach(p=>{
         Promise.myResolve(p)
         .then(res => {
           resolve(res);
         },rej=>{
           reject(rej);
         })
       })
     })
   }
   ```

3. promise数组串行执行

   ```javascript
   const p1 = () => {
     return new Promise((resolve,reject) => {
       setTimeout(()=>{
         console.log('p1');
         resolve()
       },1000)
     })
   }
   const p2 = () => {
     return new Promise((resolve,reject) => {
       setTimeout(()=>{
         console.log('p2');
         resolve()
       },2000)
     })
   }
   const p3 = () => {
     return new Promise((resolve,reject) => {
       setTimeout(()=>{
         console.log('p3');
         resolve()
       },3000)
     })
   }
   let promises = [p1,p2,p3];
   //1.采用async await
   let execute1 = async (promises) => {
      for(let i = 0;i<promises.length;i++) {
        await Promise.resolve(promises[i]())
      }
   }
   execute(promises)
   
   //2.采用reduce
   let execute = async (promises) => {
     promises.reduce((acc,cur) => {
       return acc.then(() => cur())
     },Promise.resolve())
   }
   execute(promises)
   
   //将数组中的每个promise的调用都放到上一个promise调用结束之后执行，这里也是promise可以实现链式调用的原理
   const p1 = () => {
     return new Promise((resolve,reject) => {
       setTimeout(()=>{
         console.log('p1');
         execute();
         resolve()
       },1000)
     })
   }
   const p2 = () => {
     return new Promise((resolve,reject) => {
       setTimeout(()=>{
         console.log('p2');
         execute();
         resolve()
       },1000)
     })
   }
   const p3 = () => {
     return new Promise((resolve,reject) => {
       setTimeout(()=>{
         console.log('p3');
         execute();
         resolve()
       },1000)
     })
   }
   let promises = [p1,p2,p3];
   let execute = () => {
     if(promises.length){
       let p = promises.shift();
       p();
     }
   }
   execute()
   ```

   

#### 14事件循环

- 事件循环过程
  1. 所有同步任务都在主线程上执行，形成一个执行栈
  2. 主线程之外还有一个任务队列，只要异步任务有了执行结果，就往任务队列中加入一个事件
  3. 一旦执行栈中的所有同步任务执行完毕，就会去任务队列看有没有需要执行的异步任务，有的话就结束等待状态，加入执行栈
  4. 不断重复1-3过程

- 宏任务与微任务

  微任务：Promise等，
  宏任务：setTimeout,setInterval,整个javascript代码，网络请求，文件读写完成事件，用户交互，渲染事件

  在浏览器环境中：每一个宏任务里面都有一个微任务队列，先执行一个宏任务，然后再执行里面的所有微任务，再执行下一个宏任务以此类推

- 代码示例

  ```javascript
  async function async1(){
      console.log('async1 start')
      await async2()
      console.log('async1 end')
  }
  async function async2(){
      console.log('async2')
  }
  console.log('script start')
  setTimeout(function(){
      console.log('setTimeout') 
  },0)  
  async1();
  new Promise(function(resolve){
      console.log('promise1')
      resolve();
  }).then(function(){
      console.log('promise2')
  })
  console.log('script end')
  /**
  script start -> async start -> async2 -> promise1 -> script end 
  ->async1 end ->promise2 -> setTimeout
   **/
  
  //promise.resolve()和promise.reject()才是异步任务,他们异步执行then里面传进去的两个回调函数
  
  const async1 = async() => {
      console.log('第一个async函数开始');
      await async2();
      console.log('第一个async函数结束');
  }
  const async2 = async() => {
      console.log('第二个async函数执行');
  }
  console.log('开始执行');
  setTimeout(() => {
      console.log('setTimeout执行');
  }, 0)
  new Promise(resolve => {
      console.log('promise执行');
      for (var i = 0; i < 100; i++) {
          i == 99 && resolve();
      }
  }).then(() => {
      console.log('执行then函数')
  });
  async1();
  console.log('结束');
  /**
  开始执行 -> promise执行 -> 第一个async函数开始 -> 第二个async函数执行 -> 结束 -> 执行then函数 -> 第一个async函数结束 -> setTimeout执行
  */
  ```

#### 15.Generator

- 可以理解为Generator 函数是一个状态机，封装了多个内部状态。next返回的是yield后面的表达式的值。

  ```javascript
  function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
  }
  var hw = helloWorldGenerator();
  hw.next()// { value: 'hello', done: false }
  hw.next()// { value: 'world', done: false }
  hw.next()// { value: 'ending', done: true }
  hw.next()// { value: undefined, done: true }
  ```

- next方法的参数：yield表达式本身没有返回值，next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

  ```javascript
  function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
  }
  var a = foo(5);
  a.next() // Object{value:6, done:false}
  a.next() // Object{value:NaN, done:false}
  a.next() // Object{value:NaN, done:true}
  
  var b = foo(5);
  b.next() // { value:6, done:false }
  b.next(12) // { value:8, done:false }，因为参数12被当作上一个yield的返回值，也就是y=2*12
  b.next(13) // { value:42, done:true }，参数13被当作上一个yield的返回值，也就是z = 13 
  /**
  上面代码中，第二次运行next方法的时候不带参数，导致 y 的值等于2 * undefined（即NaN），除以 3 以后还是NaN，因此返回对象的value属性也等于NaN。第三次运行Next方法的时候不带参数，所以z等于undefined，返回对象的value属性等于5 + NaN + undefined，即NaN。
  如果向next方法提供参数，返回结果就完全不一样了。上面代码第一次调用b的next方法时，返回x+1的值6；第二次调用next方法，将上一次yield表达式的值设为12，因此y等于24，返回y / 3的值8；第三次调用next方法，将上一次yield表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42
  */
  ```

- for...of循环：可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法

  ```javascript
  function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
  }
  for (let v of foo()) {
    console.log(v);
  }
  // 1 2 3 4 5，因为for...of循环会判断next返回的对象中的done属性，只有done属性为false才会执行循环
  ```

- Generator.prototype.throw：可以在函数体外抛出错误，在Generator函数体内捕获

  ```javascript
  var g = function* () {
    try {
      yield;
    } catch (e) {
      console.log('内部捕获', e);
    }
  };
  var i = g();
  i.next();
  try {
    i.throw('a');
    i.throw('b');
  } catch (e) {
    console.log('外部捕获', e);
  }
  // 内部捕获 a
  // 外部捕获 b
  /**
  上面代码中，遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的catch语句捕获。i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。
  */
  
  /**
  当Generator执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象
  */
  function* g() {
    yield 1;
    console.log('throwing an exception');
    throw new Error('generator broke!');
    yield 2;
    yield 3;
  }
  function log(generator) {
    var v;
    console.log('starting generator');
    try {
      v = generator.next();
      console.log('第一次运行next方法', v);
    } catch (err) {
      console.log('捕捉错误', v);
    }
    try {
      v = generator.next();
      console.log('第二次运行next方法', v);
    } catch (err) {
      console.log('捕捉错误', v);
    }
    try {
      v = generator.next();
      console.log('第三次运行next方法', v);
    } catch (err) {
      console.log('捕捉错误', v);
    }
    console.log('caller done');
  }
  log(g());
  // starting generator
  // 第一次运行next方法 { value: 1, done: false }
  // throwing an exception
  // 捕捉错误 { value: 1, done: false }，这里是被外部捕获了
  // 第三次运行next方法 { value: undefined, done: true }
  // caller done
  ```

- Generator.prototype.return:返回给定的参数值，并且终结遍历 Generator 函数

  ```javascript
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
  }
  var g = gen();
  g.next()        // { value: 1, done: false }
  g.return('foo') // { value: "foo", done: true }
  g.next()        // { value: undefined, done: true }
  
  /**
  如果 Generator 函数内部有try...finally代码块，且正在执行try代码块，那么return()方法会导致立刻进入finally代码块，执行完以后，整个函数才会结束。
  */
  function* numbers () {
    yield 1;
    try {
      yield 2;
      yield 3;
    } finally {
      yield 4;
      yield 5;
    }
    yield 6;
  }
  var g = numbers();
  g.next() // { value: 1, done: false }
  g.next() // { value: 2, done: false }
  g.return(7) // { value: 4, done: false }
  g.next() // { value: 5, done: false }
  g.next() // { value: 7, done: true }
  //上述代码调用return之后，立刻执行finally代码块，等finally执行完之后再执行return方法的返回值
  ```

- yield*表达式:用来在Generator内部遍历一个遍历器对象

  ```javascript
  //1.yield*表达式遍历
  function* inner() {
    yield 'hello!';
  }
  function* outer1() {
    yield 'open';
    yield inner();
    yield 'close';
  }
  var gen = outer1()
  gen.next().value // "open"
  gen.next().value // 返回一个遍历器对象
  gen.next().value // "close"
  
  
  function* outer2() {
    yield 'open'
    yield* inner()
    yield 'close'
  }
  var gen = outer2()
  gen.next().value // "open"
  gen.next().value // "hello!"
  gen.next().value // "close"
  
  
  //2.可以用for...of遍历yield*表达式
  let delegatedIterator = (function* () {
    yield 'Hello!';
    yield 'Bye!';
  }());
  let delegatingIterator = (function* () {
    yield 'Greetings!';
    yield* delegatedIterator;
    yield 'Ok, bye.';
  }());
  for(let value of delegatingIterator) {
    console.log(value);
  }
  // "Greetings!
  // "Hello!"
  // "Bye!"
  // "Ok, bye."
  
  //3.任何数据结构只要有 Iterator 接口，就可以被yield*遍历
  let read = (function* () {
    yield 'hello';
    yield* 'hello';
  })();
  read.next().value // "hello"
  read.next().value // "h"
  ```

#### 16 async

- 可以看成Generator的语法糖，async必须结合await使用

- 返回一个promise

  ```javascript
  //1.async函数的return的值会成为函数调用之后then方法的参数
  async function f() {
    return 'hello world';
  }
  
  f().then(v => console.log(v))// "hello world"
  
  //2.async函数运行出错，会被then函数的第二个参数获取
  async function f() {
    throw new Error('出错了');
  }
  f().then(
    v => console.log('resolve', v),
    e => console.log('reject', e)
  )//reject Error: 出错了
  ```

- 注意点

  1. await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中
  2. await必须放在async内部
  3. 如果要执行循环的异步操作，不能使用foreach，可以用for循环

#### 17 Class

- 可以看作是构造函数的语法糖，本质上也就是function

  ```javascript
  class Point {
    // ...
  }
  typeof Point // "function"
  Point === Point.prototype.constructor // true
  ```

- getter与setter:class也支持getter和setter，并且与Object一样都是存在该class的prototype对象中的属性的 Descriptor 对象上

  ```javascript
  class MyClass {
    constructor() {
      // ...
    }
    get prop() {
      return 'getter';
    }
    set prop(value) {
      console.log('setter: '+value);
    }
  }
  let inst = new MyClass();
  inst.prop = 123;// setter: 123
  inst.prop// 'getter'
  ```

- 静态方法与静态属性：class中支持静态方法和静态属性，都是只允许通过class直接访问，与实例对象无关。

  注意：静态方法中的this指的是当前类而不是实例

  ```javascript
  class Foo {
    static classMethod() {
      return 'hello';
    }
  }
  Foo.classMethod() // 'hello'
  var foo = new Foo();
  foo.classMethod()// TypeError: foo.classMethod is not a function
  ```

- 私有方法和私有属性:class中支持私有方法和私有属性，用#+方法名/属性名表示。

  注意：私有属性可以通过in关键字判断

- 静态块：在类的内部设置一个代码块，在类生成时运行且只运行一次，主要作用是对静态属性进行初始化

  ```javascript
  class C {
    static x = 1;
    static {
      this.x; // 1
      // 或者
      C.x; // 1
    }
  }
  ```

- 注意点

  1. 不存在变量提升

  2. 支持name属性

  3. 支持Generator函数

  4. this

  5. new.target：在class内部使用，返回class类，当子类继承父类时，new.target返回子类

     ```javascript
     //用来创建一个必须被继承才能使用的类
     class Shape {
       constructor() {
         if (new.target === Shape) {
           throw new Error('本类不能实例化');
         }
       }
     }
     class Rectangle extends Shape {
       constructor(length, width) {
         super();
         // ...
       }
     }
     var x = new Shape();  // 报错
     var y = new Rectangle(3, 4);  // 正确
     ```

#### 18 ES Module

- 特点

  ```javascript
  //1.编译时加载
  // CommonJS模块，运行时加载本质就是先加载整个‘fs’模块，生成一个fs对象，再从对象中读取三个方法
  let { stat, exists, readfile } = require('fs');
  // ES6模块，编译时加载，这里的‘fs’不是模块，而是用export导出的指定的代码，不需要先运行生成一个对象
  import { stat, exists, readFile } from 'fs';
  
  //2.动态绑定接口
  export var foo = 'bar';
  setTimeout(() => foo = 'baz', 500);//可以实时获取模块内部的值
  
  //输出的是只读接口，不允许修改，但是允许修改接口里面的属性
  import {a} from './xxx.js'
  a = {}; // Syntax Error : 'a' is read-only;
  a.foo = 'foo'//合法的
  ```

- export与import的复合写法

  ```javascript
  export { foo, bar } from 'my_module';
  // 可以简单理解为
  import { foo, bar } from 'my_module';
  export { foo, bar };
  ```

- Import():运行时加载，并且是异步的，返回一个promise

  ```javascript
  if (condition) {
    import('moduleA').then(...);
  } else {
    import('moduleB').then(...);
  }
  ```

#### 19 跨域

1. postMessage(message, url)方法

2. websocket

3. 代理服务器：需要在服务端做额外开发，将跨域请求发送给同域下的服务器，由该服务器做http请求访问外域

4. jsonp：因为<script><img><link>标签都可以跨域，这些标签链接的资源都是get方式访问的，所以jsonp也只能用于get请求。其实就是把请求放到一个<script>标签中，请求不光要传参数，还要传一个函数，该函数在前端进行声明，然后服务端返回一个执行函数，执行函数里面有需要的数据，这样浏览器就能拿到服务端的跨域数据了

   ```javascript
   function handleResponse(response) {
     console.log(` You're at IP address ${response.ip}, 
   	which is in ${response.city}, ${response.region_name}`); 
   } 
   let script = document.createElement("script"); 
   script.src = "http://freegeoip.net/json/?callback=handleResponse"; document.body.insertBefore(script, document.body.firstChild);
   ```

5. cors：目前最通用的跨域方案，这里将请求分为简单请求和复杂请求

   - 简单请求：必须满足下面两个条件。

     1. 请求方法是head、get、post中的一种

     2. 请求头信息只能包括Accept、Accept-Language、Content-Language、Last-Event-ID、Content-Type只包括三个值：application/x-www-form-urlencoded、multipart/form-data、text/plain

        ```javascript
        //简单请求会携带的额外头部origin
        Origin: http://www.nczonline.net
        如果服务器决定响应请求，那么应该发送 Access-Control-Allow-Origin 头部，包含相同的源； 或者如果资源是公开的，那么就包含"*"。比如：
        Access-Control-Allow-Origin: http://www.nczonline.net
        ```

   - 复杂请求：除了简单请求以外的请求

     1. option预检请求：其实就是首先询问服务器当前网页所在的域名是否在服务器的许可名单之中，请求头包括下面三个信息
        1. Origin：与简单请求一样
        2. Access-Control-Request-Method：请求准备使用的方法
        3. Access-Control-Request-Header：请求希望自定义的头部
     2. 预检通过之后会再次进行请求

   #### 20 CSRF和XSS

   - csrf攻击(跨站点请求伪造)

     1. 当客户访问了一个安全的网站比如银行

     2. 在访问银行的cookie还没有失效的情况下，又点击了一个钓鱼网站，该网站以用户的名义去访问之前的银行，银行以为还是用户去访问，钓鱼网站就可以对银行进行操作

        ```javascript
        例子: 
        1. 一家银行的转账地址为: www.a.com/withdraw?from=A&to=B&amount=1000
        2. 一个攻击者在www.b.com 放置代码为: <img src="www.a.com/withdraw?from=A&to=B&amount=1000" />
         
        例如A用户刚给B转完账，登录状态还没有失效，如果www.a.com没有安全措施，可能会让A损失1000元
        ```

     3. 攻击场景：

        1. 自动get请求：当点击钓鱼网站，自动向某个服务器发送一个get请求(构造了一个url)
        2. 自动post请求：钓鱼网站自己构造了一个表单，并且会携带用户的cookie自动发送这个表单
        3. 手动get请求：钓鱼网站上可以有一个链接，点击后自动发送携带cookie的请求

     4. 防范

        - 用同源策略可以防止csrf攻击，因为钓鱼网站的请求大部分来自外域，因此禁止外域访问资源。
        - 设置cookie的Samesite属性为'strict'，在strict模式下，浏览器完全禁止第三方请求携带Cookie。
        - csrf token：浏览器第一次访问服务端的时候，服务费会发送一个token携带在cookie里，之后浏览器再次访问，需要将token放在请求头，但是csrf只是借用了cookie，并不能获取cookie信息，也就无法获取token。
        - referer首部：该首部会表明请求的来源，服务端通过这个字段判断请求来源是否安全，但是这个不够安全，因为referer完全是由浏览器管理的，可以被修改。

   - xss攻击(跨站脚本)

     1. 存储型：就是把恶意脚本存储在服务端的数据库中，比如服务端会存储客户评论，要是我在评论中添加一段恶意脚本，服务端会把这段脚本存储起来然后返回给浏览器执行。
     2. 反射型：恶意脚本作为网络请求的一部分，会把一段恶意脚本放在访问服务器的url的参数中，当服务器收到url得到参数后把这个脚本反射到html文档中并返回给客户端，客户端解析html就会执行被插入的恶意脚本。
     3. 文档型：文档型不经过服务器，是拦截数据传输过程的数据，并修改其内容。
     4. 防范方法：
        - 对所有用户的输入都进行转义(可以防范文档型和反射型)
        - csp(内容安全策略):(白名单策略，明确告诉客户端可以加载哪些外部资源)
          1. 限制加载其他域的资源，这样即使黑客插入来一个js文件，这个文件也没法被加载
          2. 禁止向第三方域提交资源，防止收到xss攻击之后资料不会泄露
          3. 提供上报机制，帮助我们尽快发现有哪些xss攻击，以便尽快修复问题
        - httpOnly(是服务器通过http响应头设置的)
          使用了httponly的cookie，只会在http请求时被使用，不能被任何js代码获取，因为xss攻击一般都是为了获取用户cookie

   #### 21对象深拷贝的问题

   1. bject.assign()可以实现浅拷贝

   2. JSON.parse(JSON.stringify()),这可以实现简单的深拷贝，但是有几个缺点：

      - 无法解决循环引用，无法拷贝特殊的对象，比如RegExp, Date, Set, Map等，无法拷贝函数

      - JSON.stringify会自动忽略undefined,function,symbol

   3. 解决循环引用以及特殊对象的深拷贝

      ```javascript
   function deepClone(obj, hash = new WeakMap()) {
        if (typeof obj !== 'object' || obj == null) {
          // 如果是基本数据类型或者null，直接返回
          return obj;
        }
        if (hash.has(obj)) {
          // 如果已经拷贝过该对象，则直接返回之前拷贝的结果，防止循环引用导致死循环
          return hash.get(obj);
        }
        let result;
        if (obj instanceof RegExp) {
          // 对正则对象进行特殊处理
          result = new RegExp(obj.source, obj.flags);
     } else if (obj instanceof Date) {
          // 对Date对象进行特殊处理
       result = new Date(obj.getTime());
        } else if (typeof obj === 'function') {
       // 对函数进行特殊处理
          result = function(...args) {
            return obj.apply(this, args);
          };
        } else {
          // 处理复杂类型
          result = Array.isArray(obj) ? [] : {};
          // 将当前对象存储到哈希表中
          hash.set(obj, result);
          for (let key in obj) {
            // 递归调用，实现深拷贝
            result[key] = deepClone(obj[key], hash);
          }
        }
        return result;
      }
      ```
      
      
   
   













