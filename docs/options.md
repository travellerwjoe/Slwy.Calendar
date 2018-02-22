# 选项

初始化日历时如不传入选项则会使用默认配置，可以自定义这些配置选项替换默认配置。

``` js
$('#date').SlwyCalendar({
    // locale: 'zh_CN',
    // paneCount: 2,
    // paneCountOfGroup: 3,
    // onlyThisMonth: true,
    // showMainFestival: true,
    // showFestival: true,
    // showLunarAndFestival: true,
    // mainFestival: [],
    // dateFormat: 'yyyy/MM/dd',
    // highlightWeek: false,
    // minDate: '${"#date"} || ${y}-${m}-${d}',
    // maxDate: '${"#date",{ld:true}}',
    // theme: 'THEME_CUTE_NOBORDER',
    // size: 'sm',
    // caret: false
    // weekStart: 1
    // viewMode:'years',
    // minViewMode:'days'
    /* onChangeDate: function (date, value, lunarInfo) {
        console.log(date, value)
        return true
    } */
    // invalidTips: '该日期不可选',
    // weekStart: 0,
    // yearStart: 1900,
    // yearEnd: 2050,
    // viewMode: 'days',
    // minViewMode: 'days',
})
```

## locale 时区语言
* 类型： `String`
* 默认： `'zh_CN'`
* 值：`'zh_CN'`||`'en_US'`

展示的语言

``` js
$('#date').SlwyCalendar({
    //中文
    locale: 'zh_CN',
    //英文
    locale: 'en_US',
})
```


## highlightWeek 高亮周末
* 类型： `Boolean`
* 默认： `true`
* 值：`true`||`false`

设置是否高亮展示周末

``` js
$('#date').SlwyCalendar({
    //高亮周末
    highlightWeek: true,
    //不高亮周末
    highlightWeek: false,
})
```


## onlyThisMonth 只展示当月
* 类型： `Boolean`
* 默认： `false`
* 值：`true`||`false`

设置是否只展示当月的日期

``` js
$('#date').SlwyCalendar({
    //只展示当月
    onlyThisMonth: true,
    //上月下月都展示
    onlyThisMonth: false,
})
```


## paneCount 面板数量
* 类型： `Number`
* 默认： `1`
* 值：`1,2...`

设置展示的面板数量，即同时展示多少个月份

```js
$('#date').SlwyCalendar({
    //只展示当月
    paneCount: 1,
    //展示当月和下月
    paneCount: 2,
})
```


## paneCountOfGroup 一组面板数量
* 类型： `Number`
* 默认： `3`
* 值：`3,4...`

设置同时展示的一组（行）面板的数量，一般与`paneCount`配合使用

```js
$('#date').SlwyCalendar({
    //一行展示三个月
    paneCountOfGroup: 3,
    //一行展示四个月
    paneCountOfGroup: 4,
})
```


## dateFormat 时间格式
* 类型： `String`
* 默认： `yyyy-MM-dd`
* 值：`yyyy-MM-dd` || `yyyy/MM/dd` 等

设置选择时间后的时间格式，其中`yyyy`表示年，`MM`表示月，`dd`表示日

```js
$('#date').SlwyCalendar({
    //2018-02-22
    dateFormat: 'yyyy-MM-dd',
    //2018/02/22
    dateFormat: 'yyyy/MM/dd',
})
```


## weekStart 周开始日
* 类型： `Number`
* 默认： `0`
* 值：`0-6`

设置每列的开始是星期几，默认`0`表示`星期日`

```js
$('#date').SlwyCalendar({
    //日 一 二 三 四 五 六
    weekStart: 0,
    //一 二 三 四 五 六 日
    weekStart: 1,
})
```


## yearStart 日历起始年
* 类型： `Number`
* 默认： `1900`
* 值：`1900` || `2000` 等

设置日历的起始范围，配合`yearEnd`使用

```js
$('#date').SlwyCalendar({
    //日历范围1900-2050
    yearStart: 1900,
    yearEnd: 2050,
    //日历范围2000-2050
    yearStart: 2000,
    yearEnd: 2050    
})
```


## yearStart 日历截止年
* 类型： `Number`
* 默认： `2050`
* 值：`2050` || `2100` 等

设置日历的起始范围，配合`yearStart`使用

```js
$('#date').SlwyCalendar({
    //日历范围1900-2050
    yearStart: 1900,
    yearEnd: 2050,
    //日历范围2000-2050
    yearStart: 2000,
    yearEnd: 2050    
})
```


## caret 显示三角箭头
* 类型： `Boolean`
* 默认： `true`
* 值：`true` || `false` 

设置是否显示与input框之间的三角箭头

```js
$('#date').SlwyCalendar({
    caret: true  
})
```


## theme 显示主题
* 类型： `String`
* 默认： `'THEME_CUTE'`
* 值：`'THEME_CUTE'` || `'THEME_CUTE_NOBORDER'` 

设置日历的显示主题，目前只有`THEME_CUTE`和`THEME_CUTE_NOBORDER`，区别在于一个显示日期的边框，一个不显示

```js
$('#date').SlwyCalendar({
    //默认主题，显示日期边框
    theme: 'THEME_CUTE'
    //没有日期边框
    theme: 'THEME_CUTE_NOBORDER'
})
```

## size 显示大小
* 类型： `String`
* 默认： `null`
* 值：`'sm'` || `null` 

设置日历的显示大小，不设置为默认大小，设置为`sm`日历整体会缩小一定比例

```js
$('#date').SlwyCalendar({
    //mini版日历
    size: 'sm'
})
```


## viewMode 初始视图
* 类型： `String`
* 默认： `'days'`
* 值：`'days'` || `'months'` || `'years'`

设置日历最初打开时的视图，`days`表示最初打开为日期视图，`months`表示月视图，`years`表示年视图

```js
$('#date').SlwyCalendar({
    //默认最初打开为日期视图
    viewMode: 'days',
    //月视图
    viewMode: 'months',
    //年视图
    viewMode: 'years'
})
```


## minViewMode 最小可选择视图
* 类型： `String`
* 默认： `'days'`
* 值：`'days'` || `'months'` || `'years'`

设置日历最小可选择的视图，一般配合`viewMode`使用，`days`表示最小可选择到日期视图，`months`表示最小只能选择到月视图，`years`表示最小可选择到年视图

```js
$('#date').SlwyCalendar({
    //初始打开为月视图，选择月份后可打开日期视图
    viewMode: 'months',
    minViewMode: 'days',
    //初始打开为年视图，选择年份后可打开月视图，但选择月份后不打开日期视图
    viewMode: 'years',
    minViewMode: 'months'
})
```


## showFestival 显示节日
* 类型： `Boolean`
* 默认： `true`
* 值：`true` || `false`

设置是否显示节日，节日包括节气、农历节日和一些知名节日

```js
$('#date').SlwyCalendar({
    //显示节日
    showFestival: true
})
```


## showMainFestival 显示主要节日
* 类型： `Boolean`
* 默认： `true`
* 值：`true` || `false`

设置是否显示主要节日，主要节日有`'元旦', '除夕', '春节', '元宵', '情人节', '清明', '劳动节', '端午', '儿童节', '七夕', '国庆节', '中秋', '重阳', '圣诞节'`, 主要节日也可通过选项`mainFestival`手动配置

```js
$('#date').SlwyCalendar({
    //显示主要节日
    showMainFestival: true
})
```

> 此选项会覆盖`showFestival`，并且只会显示节日不会连同显示日期



## showLunarAndFestival 显示节日与农历日期
* 类型： `Boolean`
* 默认： `true`
* 值：`true` || `false`

设置是否显示节日与农历日期，在选项`showFestival`的基础上显示农历日期

```js
$('#date').SlwyCalendar({
    //显示主要节日
    showMainFestival: true
})
```

> 此选项会覆盖`showFestival`和`showMainFestival`



## mainFestival 主要节日列表
* 类型： `Array`
* 默认： `[]`
* 值：`['元旦','立冬']` 等

设置自定义的主要节日列表，配合选项`showMainFestival`使用，可设置的节日有：`'元旦','情人节','妇女节','植树节','消费者权益日','愚人节','劳动节','青年节','护士节','儿童节','建党节','建军节','教师节','孔子诞辰','国庆节','老人节','联合国日','平安夜','圣诞节','春节','元宵','端午','七夕','中元','中秋','重阳','腊八','小年','除夕','清明'`

```js
$('#date').SlwyCalendar({
    //显示自定义主要节日
    showMainFestival: true,
    mainFestival: ['元旦','劳动节','平安夜','圣诞节','中秋','重阳']
})
```


## onChangeDate 日期选择事件
* 类型： `Function`
* 默认： `null`
* 值：`callback(date,value,lunarInfo)`

日期选择后的回调函数

```js
$('#date').SlwyCalendar({
    onChangeDate: function(date, value, lunarInfo){
        //选择的日期
        console.log(date)
        //选择的日期格式化后的字符串
        console.log(value)
        //选择的日期的农历信息
        console.log(lunarInfo)
    }
})
```

> 也可通过为绑定的input元素使用`.on`监听[changeDate事件](event.md)



## minDate 最小选择日期
* 类型： `String` || `Date` || `jQuery Object`
* 默认： `null`
* 值：`'2017-12-12'` || `'#date2'` || `new Date()` || `$('#date2')` || `'${"date2"} || ${"date2",{ld:true}} || ${y}-${m+1}-${ld}'` 等

设置选择的日期范围，可与选项`maxDate`配合使用，可传入多种类型规则，具体规则介绍查看[日期范围限制](limit.md)

```js
$('#date').SlwyCalendar({
    //可选择2017-12-12及之后日期
    minDate: '2017-12-12'
    //可选择id为date2的日期值及之后的日期
    minDate: '#date2'
    minDate: $('#date2')
    //可选择今天及之后的日期
    minDate: new Date()
    //可选择id为date2的日期值及之后的日期，若无值则使用id为date3的日期值的最后一天，若再无值使用下个月的最后一天最为最小选择日期
    minDate: '${"#date2"} || ${"#date3",{ld:true}} || ${y}-${m+1}-${ld}'
})
```


## maxDate 最大选择日期
* 类型： `String` || `Date` || `jQuery Object`
* 默认： `null`
* 值：`'2017-12-12'` || `'#date2'` || `new Date()` || `$('#date2')` || `'${"date2"} || ${"date2",{ld:true}} || ${y}-${m+1}-${ld}'` 等

设置选择的日期范围，可与选项`minDate`配合使用，可传入多种类型规则，具体规则介绍查看[日期范围限制](limit.md)

```js
$('#date').SlwyCalendar({
    //可选择2017-12-12及之前日期
    maxDate: '2017-12-12'
    //可选择id为date2的日期值及之前的日期
    maxDate: '#date2'
    maxDate: $('#date2')
    //可选择今天及之前的日期
    maxDate: new Date()
    //可选择id为date2的日期值及之前的日期，若无值则使用id为date3的日期值的最后一天，若再无值使用下个月的最后一天最为最大选择日期
    maxDate: '${"#date2"} || ${"#date3",{ld:true}} || ${y}-${m+1}-${ld}'
})
```