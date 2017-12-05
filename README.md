
--------------
**修改自Jquery-i18n,原项目地址：<a href='https://github.com/i18next/jquery-i18next'>https://github.com/i18next/jquery-i18next</a>**

增加子级保留标签嵌套模式
使用方法在父级的翻译资源上填写$c(子级翻译id)
例子:
```json
{
  "nav": {
    "home": "Ho$c(nav.tip)me",
    "tip":"Children$c(nav.test1)Node$c(nav.test2)Tip",
    "test1":"Test One",
    "test2":"Test Two",
    "page1": "Page One",
    "page2": "Page Two"
  }
}
```


```html
    <ul class="nav">
        <!-- 保留子级的标签的嵌套模式-修改自Jquery-i18next -->
        <li>
            <a href="#" data-i18n="nav.home">
                <span style="color:red;" data-i18n="nav.tip">
                    <label style="color:green;" data-i18n="nav.test1"></label>
                    <label style="color:black;" data-i18n="nav.test2"></label>
                </span>
            </a>
        </li>
        <li>
            <a href="#" data-i18n="nav.page1"></a>
        </li>
        <li>
            <a href="#" data-i18n="nav.page2"></a>
        </li>
    </ul>
```

--------------

Simplifies i18next usage in projects built based on jquery, like:

page source:

```html
<ul class="nav">
  <li><a href="#" data-i18n="nav.home"></a></li>
  <li><a href="#" data-i18n="nav.page1"></a></li>
  <li><a href="#" data-i18n="nav.page2"></a></li>
</ul>
```

loaded resource file (locales/en/translation.json):

```json
{
  "nav": {
    "home": "Home",
    "page1": "Page One",
    "page2": "Page Two"
  }
}
```

javascript code:

```js
$(".nav").localize();

// results in
// <ul class="nav">
//  <li><a href="#" data-i18n="nav.home">Home</a></li>
//  <li><a href="#" data-i18n="nav.page1">Page One</a></li>
//  <li><a href="#" data-i18n="nav.page2">Page Two</a></li>
// </ul>
```

## Initialize the plugin

```js
jqueryI18next.init(i18nextInstance, $, {
  tName: 't', // --> appends $.t = i18next.t
  i18nName: 'i18n', // --> appends $.i18n = i18next
  handleName: 'localize', // --> appends $(selector).localize(opts);
  selectorAttr: 'data-i18n', // selector for translating elements
  targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
  optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
  useOptionsAttr: false, // see optionsAttr
  parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
});
```

## using options in translation function

```js
<a id="btn1" href="#" data-i18n="myKey"></a>
$("#btn1").localize(options);
```

or

```js
<a id="btn1" href="#" data-i18n="myKey" data-i18n-options='{ "a": "b" }'></a>
$("#btn1").localize();
```

`data-i18n-options` attribute must be a valid JSON object.

## usage of selector function

### translate an element

```js
<a id="btn1" href="#" data-i18n="myKey"></a>
$("#btn1").localize(options);
```

myKey: same key as used in i18next (optionally with namespaces)
options: same options as supported in i18next.t

### translate children of an element

```js
<ul class="nav">
  <li><a href="#" data-i18n="nav.home"></a></li>
  <li><a href="#" data-i18n="nav.page1"></a></li>
  <li><a href="#" data-i18n="nav.page2"></a></li>
</ul>
$(".nav").localize();
```

### translate some inner element
```js
<div class="outer" data-i18n="ns:key" data-i18n-target=".inner">
  <input class="inner" type="text"></input>
</div>
$(".outer").localize();
```

### set different attribute
```js
<a id="btn1" href="#" data-i18n="[title]key.for.title"></a>
$("#btn1").localize();
```

### set multiple attributes
```js
<a id="btn1" href="#" data-i18n="[title]key.for.title;myNamespace:key.for.text"></a>
$("#btn1").localize();
```

### set innerHtml attributes
```js
<a id="btn1" href="#" data-i18n="[html]key.for.title"></a>
$("#btn1").localize();
```

### prepend content
```js
<a id="btn1" href="#" data-i18n="[prepend]key.for.title">insert before me, please!</a>
$("#btn1").localize();
```

### append content
```js
<a id="btn1" href="#" data-i18n="[append]key.for.title">append after me, please!</a>
$("#btn1").localize();
```

### set data
```js
<a id="btn1" href="#" data-i18n="[data-someDataAttribute]key.for.content"></a>
$("#btn1").localize();
```
