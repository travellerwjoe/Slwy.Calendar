# 使用

1. 通过`<script>`和`<link>`引入`.js`和`.css`
``` html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="dist/jquery.slwy.calendar.min.css">
    ...
  </head>
  <body>
    ...
  </body>
  <script src="https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js"></script>
  <script src="dist/jquery.slwy.calendar.min.js"></script>
    ...
</html>
```

2. 假设有input框，如
``` html
<input id="date" placeholder="点击展开日历">
```

3. 为input初始化日历
``` html
<script>
  $('#date').SlwyCalendar()
</script>
```