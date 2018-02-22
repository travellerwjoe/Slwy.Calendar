# 日期范围限制

## 静态限制

* 只能选择2017-12-12及之后的日期

```js
$('#date').SlwyCalendar({
    minDate: '2017-12-12'
})
```

* 只能选择2017-02-01 到 2018-02-01之间的日期

```js
$('#date').SlwyCalendar({
    minDate: '2017-02-01',
    maxDate: '2018-02-01'
})
```

## 动态限制

| 格式 | 说明 |
|------| ------|
| ${y} | 当前年 |
| ${m} | 当前月 |
| ${d} | 当前日 |
| ${d+1} | 当前日的后一天 |
| ${d-1} | 当前日的前一天 |
| ${ld} | 当前月的最后一天 |
| ${n} | n为数字，可直接指代某天、某月、某年|

* 只能选择今天及之后的日期

```js
$('#date').SlwyCalendar({
    minDate: new Date(),
    minDate: '${y}-${m}-${d}'
})
```

* 只能选择明天到本月最后一天

```js
$('#date').SlwyCalendar({
    minDate: '${y}-${m}-${d+1}',
    maxDate: '${y}-${m}-${ld}'
})
```

* 只能选择今年日期

```js
$('#date').SlwyCalendar({
    minDate: '${y}-${1}-${1}',
    maxDate: '${y}-${12}-${ld}'
})
```

## 多个日历控件交互

* 第一个日期限制为3个月前的当日到今天，第二个日期限制为从第一个日期开始

```js
$('#date1').SlwyCalendar({
    minDate: '${y}-${m-3}-${d}', 
    maxDate: '${y}-${m}-${d}'
})

$('#date2').SlwyCalendar({
    minDate: '${"#date1"}' 
    //minDate: '#date1' 
    //minDate: $('#date1')
})
```

* 第二个日期限制为第一个日期的后一天开始

```js
$('#date1').SlwyCalendar()

$('#date2').SlwyCalendar({  
    minDate: '${"#date1",{d:1}}' 
})
```

* 第二个日期限制为第一个日期的上一年的上个月开始

```js
$('#date1').SlwyCalendar()

$('#date2').SlwyCalendar({  
    minDate: '${"#date1",{y:-1,m:-1}}' 
})
```

* 第二个日期限制为第一个日期的当月最后一天开始

```js
$('#date1').SlwyCalendar()

$('#date2').SlwyCalendar({  
    minDate: '${"#date1",{ld:true}}' 
})
```

**语法`${"#date1",{ld:true}}`，左边为选择器，右边为条件对象，条件对象说明如下**

| 属性 | 取值 | 说明 |
| ---- | ---- | ---- |
| d(D,day,Day) | 1 | 取值为数值时表示偏移，指代选择器日期的前一天后一天等 |
| d(D,day,Day) | true | 取值为true时表示第一天，指代选择器日期月的第一天 |
| m(M,month,Month) | 1 | 取值为数值时表示偏移，指代选择器日期的前一月后一月等 |
| m(M,month,Month) | true | 取值为true时表示第一月，指代选择器日期年的第一天（1月1日） |
| y(Y,year,Year) | 1 | 取值为数值时表示偏移，指代选择器日期的前一年后一年等 |
| ld(LD) | true | 指代选择器日期月的最后一天 |
| lm(LM) | true | 指代选择器日期年的最后一天（12月31日） |



## 多个限制规则

多个限制规则主要用于多个日历控件间的交互，适用于依赖的日历控件还没选择日期时可使用另外一个备用规则

* 最小日期为另一个日期或今天
```js
$('#date').SlwyCalendar({  
    minDate: '${"#date2"} || ${y}-${m}-${d}' 
})
```

* 多于两个规则，使用场景较少
```js
$('#date').SlwyCalendar({  
    minDate: '${"date2"} || ${"date3",{ld:true}} || ${y}-${m+1}-${ld}'
})
```

> 使用`||`来隔开多个限制规则，最左侧的规则优先级最高