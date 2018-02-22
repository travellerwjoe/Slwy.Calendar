# 替换默认配置

一个项目中往往不会只用到一个日历控件，故可以在项目的公共js中替换掉默认配置，省去多余的配置选项代码，使风格保持一致。

**可使用`$.SlwyCalendar.setDefaults`替换默认配置**
```js
$.SlwyCalendar.setDefaults({
    locale: 'zh_CN',
    paneCount: 2,
    yearStart: 2000,
})
```