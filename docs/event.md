# 事件

## changeDate事件 {docsify-ignore}

1. 当选择日期并且日期改变时，将触发`changeDate`事件

```js
$('#date')
    .SlwyCalendar({
        ...
    })
    .on('changeDate', function(e){
        //选择的日期        
        console.log(e.date)
        //选择的日期格式化后的字符串
        console.log(e.value)
        //选择的日期的农历信息
        console.log(e.lunarInfo)
    })
```

> 同样也可以传入[选项onChangeDate](/options?id=onchangedate-日期选择事件)来触发事件