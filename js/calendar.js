/**
 * @preserve jquery.Slwy.Calendar.js
 * @author Joe.Wu
 * @version v1.0.3
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        require(['jQuery'], factory)
    } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory(require('jQuery'))
    } else {
        root.SlwyCalendar = factory(root.jQuery)
    }
}(this, function ($) {
    var SETTING = {
        locales: {
            en_US: {
                daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                today: 'Today',
                getYearMonth: function (year, month) {
                    return this.months[month] + ' ' + year
                }
            },
            zh_CN: {
                daysShort: ["日", "一", "二", "三", "四", "五", "六"],
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                today: '今天',
                getYearMonth: function (year, month) {
                    return year + '年' + this.months[month]
                }
            }
        },
        getTemplate: function (tplName) {
            var headTemplate = '<thead>' +
                '<tr class="' + this.prefix + '-calendar-header">' +
                '<th></th>' +
                '<th colspan="5" class="' + this.prefix + '-calendar-switch">' +
                '<div class="' + this.prefix + '-calendar-select"></div></th>' +
                '<th></th>' +
                '</tr></thead>';
            var contTemplate = '<tbody><tr><td colspan="7"></td></tr></tbody>';
            var tableTemplate = '<table class="' + this.prefix + '-calendar-table">' +
                headTemplate +
                '<tbody></tbody>' +
                '</table>';
            var template = '<div class="' + this.prefix + '-calendar">' +
                '<div class="' + this.prefix + '-calendar-caret"></div>' +
                '<div class="' + this.prefix + '-calendar-action">' +
                '<div class="' + this.prefix + '-calendar-prev">' +
                '<i class="' + this.prefix + '-calendar-prev-icon"></i></div>' +
                '<div class="' + this.prefix + '-calendar-next">' +
                '<i class="' + this.prefix + '-calendar-next-icon"></i></div>' +
                '</div>' +
                '<div class="' + this.prefix + '-calendar-days">' +
                // tableTemplate +
                '</div>' +
                '<div class="' + this.prefix + '-calendar-months">' +
                '<table class="' + this.prefix + '-calendar-table">' +
                headTemplate +
                contTemplate +
                '</table>' +
                '</div>' +
                '<div class="' + this.prefix + '-calendar-years">' +
                '<table class="' + this.prefix + '-calendar-table">' +
                headTemplate +
                contTemplate +
                '</table>' +
                '</div>' +
                '</div>';
            var tpl = {
                headTemplate: headTemplate,
                contTemplate: contTemplate,
                tableTemplate: tableTemplate,
                template: template
            }
            return tpl[tplName ? (tplName + 'Template') : 'template']
        },
        prefix: 'Slwy',
        yearStart: 1990,//年份开始
        yearEnd: 2050,//年份结束
        weekStart: 0,//一周开始星期，0星期日
        theme: {
            THEME_CUTE: 'cute'
        }
    }

    var VARS = {
        festival: {
            "0101": "元旦",
            "0214": "情人节",
            "0308": "妇女节",
            "0312": "植树节",
            "0315": "消费者权益日",
            "0401": "愚人节",
            "0501": "劳动节",
            "0504": "青年节",
            "0512": "护士节",
            "0601": "儿童节",
            "0701": "建党节",
            "0801": "建军节",
            "0910": "教师节",
            "0928": "孔子诞辰",
            "1001": "国庆节",
            "1006": "老人节",
            "1024": "联合国日",
            "1224": "平安夜",
            "1225": "圣诞节"
        },
        lunarFestival: {
            "0101": "春节",
            "0115": "元宵",
            "0505": "端午",
            "0707": "七夕",
            "0715": "中元",
            "0815": "中秋",
            "0909": "重阳",
            "1208": "腊八",
            "1224": "小年"
        },
        mainFestival: ['元旦', '除夕', '春节', '元宵', '情人节', '清明', '劳动节', '端午', '儿童节', '七夕', '国庆节', '中秋', '重阳', '圣诞节'],
        modesName: ['days', 'months', 'years'],
        modes: [
            {
                className: 'days',
                name: 'Days',
                navFnc: 'Month',
                navStep: 1,
                level: 0
            },
            {
                className: 'months',
                name: 'Months',
                navFnc: 'FullYear',
                navStep: 1,
                level: 1
            },
            {
                className: 'years',
                name: 'Years',
                navFnc: 'FullYear',
                navStep: 10,
                level: 2
            }
        ],
        events: {
            clickEvent: 'click.' + SETTING.prefix + '.Calendar',
            focusEvent: 'focus.' + SETTING.prefix + '.Calendar',
            blurEvent: 'blur.' + SETTING.prefix + '.Calendar',
            keyupEvent: 'keyup.' + SETTING.prefix + '.Calendar',
            inputEvent: 'input.' + SETTING.prefix + '.Calendar',
            changeDateEvent: 'changeDate.' + SETTING.prefix + '.Calendar'
        },
        className: {
            active: SETTING.prefix + '-calendar-active',
            activeDay: SETTING.prefix + '-calendar-day-active',
            disabled: SETTING.prefix + '-calendar-disabled',
            prev: SETTING.prefix + '-calendar-prev',
            next: SETTING.prefix + '-calendar-next',
            day: SETTING.prefix + '-calendar-day',
            days: SETTING.prefix + '-calendar-days',
            old: SETTING.prefix + '-calendar-old',
            new: SETTING.prefix + '-calendar-new',
            week: SETTING.prefix + '-calendar-week',
            month: SETTING.prefix + '-calendar-month',
            months: SETTING.prefix + '-calendar-months',
            year: SETTING.prefix + '-calendar-year',
            years: SETTING.prefix + '-calendar-years',
            title: SETTING.prefix + '-calendar-title',
            titles: SETTING.prefix + '-calendar-titles',
            select: SETTING.prefix + '-calendar-select',
            today: SETTING.prefix + '-calendar-today',
            lunar: SETTING.prefix + '-calendar-lunar',
            festival: SETTING.prefix + '-calendar-festival',
            action: SETTING.prefix + '-calendar-action',
            hidden: SETTING.prefix + '-calendar-hidden',
            caret: SETTING.prefix + '-calendar-caret',
            switch: SETTING.prefix + '-calendar-switch',
        }
    }

    var UTILS = {
        //是否是页面中存在的jquery input对象
        isJqueryInput: function (selector) {
            return $(selector).is('input')
        },
        //指定元素是否上是否存在指定命名空间的事件
        isEventOnNamespace: function (el, event, namespace) {
            var flag = false,
                events = $._data(el[0], 'events')[event]
            el = $(el)
            if (!events) {
                return flag
            }
            $.each(events, function (index, event) {
                if (typeof event.namespace !== 'undefined' && event.namespace === namespace) {
                    flag = true
                }
            })
            return flag
        },
        //是否闰年
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        //获取year年month月的天数
        getDaysOfYearMonth: function (year, month) {
            return [31, (UTILS.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        //比较两个时间是否同一天
        isSameDay: function (date1, date2) {
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
        },
        //返回有效的date
        getValidDate: function (date) {
            return new Date(typeof date === 'string' ? date.replace(/(\d+)[\-\/](\d+)[\-\/](\d+).*/, '$1/$2/$3') : UTILS.setDateTimeZero(date))
        },
        //将date的时间部分置为0
        setDateTimeZero: function (date) {
            if (!(date instanceof Date)) date = new Date()
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)
            return date
        },
        formatDateTime: function (date, fmt) {
            if (typeof (date) == 'string') date = date.replace(/-/g, '/');
            date = new Date(date).toString() !== 'Invalid Date' ? new Date(date) : new Date();
            var o = {
                "M+": date.getMonth() + 1, //月份 
                "d+": date.getDate(), //日 
                "h+": date.getHours(), //小时 
                "m+": date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds(), //毫秒
                "D+": formatDay(date.getDay())  //周几
            };
            function formatDay(num) {
                switch (num) {
                    case 0: return '周日';
                    case 1: return '周一';
                    case 2: return '周二';
                    case 3: return '周三';
                    case 4: return '周四';
                    case 5: return '周五';
                    case 6: return '周六';
                }
            }
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return fmt;
        }
    }


    var lunarInfo = new Array(
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0)

    var solarTerms = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");

    var solarTermsInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758);

    var cDays = new Array('十', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    var cDays2 = new Array('初', '十', '廿', '三');


    function Calendar(opts, srcElement) {
        var dfts = {
            locale: 'zh_CN',//语言时区  
            highlightWeek: true,//是否高亮周末
            onlyThisMonth: false,//每个面板只显示本月
            showLunarAndFestival: false,//显示农历和节日
            showFestival: false,//只显示节日
            showMainFestival: false,//只显示主要节假日
            mainFestival: [],//配置要显示的主要节日列表
            paneCount: 1,//面板数量
            minDate: null,
            maxDate: null,
            dateFormat: 'yyyy-MM-dd',
            onChangeDate: null,
            viewMode: 'days',
            minViewMode: 'days',
            theme: null,
            invalidTips: '该日期不可选'
        }
        this.opts = $.extend(true, dfts, opts)
        var template = SETTING.getTemplate()
        this.$calender = $(template).appendTo('body')
        this.$calenderDays = this.$calender.find('.' + VARS.className.days)
        this.$calenderMonths = this.$calender.find('.' + VARS.className.months)
        this.$calenderYears = this.$calender.find('.' + VARS.className.years)
        this.$calendarAction = this.$calender.find('.' + VARS.className.action)
        this.$srcElement = srcElement && $(srcElement)//触发元素

        this.now = new Date()
        this.viewDate = new Date() //当前面板显示时间
        this.activeDate = this.$srcElement ? UTILS.getValidDate(this.$srcElement.val()) : null //当前选中时间
        this.paneCount = this.opts.paneCount
        this.curPaneCount = 0 //当前面板数量
        this.Lunar = Lunar
        this.mainFestival = $.isArray(this.opts.mainFestival) && this.opts.mainFestival.length && this.opts.mainFestival || VARS.mainFestival
        this.viewMode = VARS.modesName.indexOf(this.opts.viewMode) >= 0 ? VARS.modesName.indexOf(this.opts.viewMode) : 0
        this.minViewMode = VARS.modesName.indexOf(this.opts.minViewMode) >= 0 ? VARS.modesName.indexOf(this.opts.minViewMode) : 0
        this.theme = SETTING.theme[this.opts.theme]

        if (this.theme) {
            this.$calender.addClass(SETTING.prefix + '-calendar-' + this.theme)
        }

        //如有触发元素隐藏日历待触发时显示
        if (this.$srcElement) {
            this.$calender.addClass(VARS.className.hidden)
        } else {
            this.$calender.find('.' + VARS.className.caret).remove()
        }
        this.init()
    }
    Calendar.prototype.init = function () {
        this.bind()
        this.show()
    }

    Calendar.prototype.bind = function () {
        var _this = this,
            clickEvent = VARS.events.clickEvent,
            focusEvent = VARS.events.focusEvent,
            blurEvent = VARS.events.blurEvent,
            keyupEvent = VARS.events.keyupEvent,
            inputEvent = VARS.events.inputEvent,
            changeDateEvent = VARS.events.changeDateEvent

        if (this.$srcElement) {
            this.$srcElement.on(keyupEvent, function (e) {
                var val = $(this).val(),
                    date = val ? new Date(UTILS.formatDateTime(val, 'yyyy/MM/dd')) : null
                _this.activeDate = date
                _this.viewDate = date ? new Date(date) : new Date()
                _this.show()
            })

            this.$srcElement.on(focusEvent, function (e) {
                _this.open()
            })

            this.$srcElement.on(blurEvent, function (e) {
                if (!$(this).val()) return
                var date = new Date(UTILS.formatDateTime($(this).val(), 'yyyy/MM/dd'))
                if ((_this.opts.maxDate && date.valueOf() > new Date(_this.opts.maxDate).valueOf()) || (_this.opts.minDate && date.valueOf() < new Date(_this.opts.minDate).valueOf())) {
                    alert(_this.opts.invalidTips);
                    $(this).val('').trigger(keyupEvent)
                }
            })

            $(document).on(clickEvent, function (e) {
                var $target = $(e.target)

                if (!$target.is(_this.$srcElement) && !$target.closest('.' + SETTING.prefix + '-calendar').is(_this.$calender)) {
                    _this.close()
                }
            })
        }

        //当minDate或maxDate是另一个元素时与其交互改变可选日期
        $.each(['minDate', 'maxDate'], function (index, date) {
            var changeOtherDate = function (e) {
                if (e.type === "changeDate" && e.namespace !== 'Calendar.' + SETTING.prefix) return
                _this.opts[date] = e.date || $(this).val()
                _this.viewDate = new Date()
                _this.activeDate = _this.$srcElement ? UTILS.getValidDate(_this.$srcElement.val()) : null
                _this.renderDays()
            }
            if (_this.opts[date] && UTILS.isJqueryInput(_this.opts[date])) {
                var $date = $(_this.opts[date])
                $date.on(changeDateEvent, changeOtherDate).on(keyupEvent + ' ' + inputEvent, changeOtherDate)
            }
        })

        this.$calender.on(clickEvent, function (e) {
            var $target = $(e.target).closest('span, td, th'),
                // activeClassName = VARS.className.active,
                activeDayClassName = VARS.className.activeDay,
                disabledClassName = VARS.className.disabled,
                dateAttr = SETTING.prefix + '-calendar-date'

            if ($target.is('th') && $target.hasClass(VARS.className.switch)) {
                _this.show(1)
            } else if ($target.is('td') && $target.hasClass(VARS.className.day)) {
                if ($target.hasClass(disabledClassName)) {
                    return
                }
                _this.close()

                var dateStr = $target.attr(dateAttr);

                changeDate(dateStr)
            } else if ($target.is('span')) {
                var dateStr = $target.attr(dateAttr),
                    // curMode = VARS.modes[_this.viewMode],
                    setFunc,
                    renderFunc,
                    pos = 0

                if (_this.viewMode === 1) {
                    setFunc = 'setMonth'
                    pos = $target.index()
                    renderFunc = 'renderDays'
                } else if (_this.viewMode === 2) {
                    setFunc = 'setFullYear'
                    renderFunc = 'renderMonths'
                    pos = dateStr
                }
                if (_this.viewMode > 0 && _this.viewMode === _this.minViewMode) {
                    changeDate(dateStr)
                }
                _this.viewDate[setFunc].call(_this.viewDate, pos)
                _this.show(-1)
            }


            function changeDate(date) {
                var date = new Date(date),
                    formatedDate = UTILS.formatDateTime(date, _this.opts.dateFormat),
                    activeDateLunarInfo,
                    callbackRes = false
                if (new Date(_this.activeDate).valueOf() === date.valueOf()) {
                    return
                }

                _this.$calenderDays.find('td').removeClass(activeDayClassName)
                $target.addClass(activeDayClassName)

                _this.activeDate = date
                activeDateLunarInfo = new _this.Lunar(_this.activeDate)
                callbackRes = typeof _this.opts.onChangeDate === 'function' && _this.opts.onChangeDate.call(_this, _this.activeDate, formatedDate, activeDateLunarInfo)

                if (_this.$srcElement) {
                    $.each(['changeDate', changeDateEvent], function (index, item) {
                        _this.$srcElement.trigger({
                            type: item,
                            date: _this.activeDate,
                            value: formatedDate,
                            lunarInfo: activeDateLunarInfo,
                            close: _this.close.bind(_this),
                            open: _this.open.bind(_this)
                        })
                    })
                    //如果onChangeDate回调未声明并且未在jqueryDom对象上绑定无命名空间的onChangeDate事件或者onChangeDate申明并调用返回的结果为true执行默认操作
                    if (typeof _this.opts.onChangeDate !== 'function' && !UTILS.isEventOnNamespace(_this.$srcElement, 'changeDate', '') || callbackRes) {
                        _this.$srcElement.val(formatedDate)
                    }
                }
            }
        })


        this.$calendarAction.on(clickEvent, function (e) {
            var $target = $(e.target).closest('div'),
                prevClassName = VARS.className.prev,
                nextClassName = VARS.className.next,
                curMode = VARS.modes[_this.viewMode],
                setFunc = 'set' + curMode.navFnc,
                getFunc = 'get' + curMode.navFnc,
                navStep = curMode.navStep

            if ($target.hasClass(prevClassName)) {
                var prevStep = _this.viewMode === 0 ? _this.paneCount * 2 - navStep : navStep
                _this.viewDate[setFunc].call(_this.viewDate, _this.viewDate[getFunc].call(_this.viewDate) - prevStep)
                _this.show()
            } else if ($target.hasClass(nextClassName)) {
                var nextStep = navStep
                _this.viewDate[setFunc].call(_this.viewDate, _this.viewDate[getFunc].call(_this.viewDate) + nextStep)
                _this.show()
            }

        })
    }

    Calendar.prototype.renderDays = function () {
        this.$calenderDays.html('');
        this.curPaneCount = 0;
        (function renderTable() {
            var viewDate = this.viewDate,
                viewYear = viewDate.getFullYear(),
                viewMonth = viewDate.getMonth(),
                nowDate = this.now,
                //上月
                prevMonthDate = new Date(viewYear, viewMonth - 1),
                prevMonthDateY = prevMonthDate.getFullYear(),
                prevMonthDateM = prevMonthDate.getMonth(),
                prevMonthDays = UTILS.getDaysOfYearMonth(prevMonthDateY, prevMonthDateM),
                //下月
                nextMonthDate,
                minDate,
                maxDate,
                $table = $(SETTING.getTemplate('table')),
                prevMonthDateCount = nextMonthDateCount = 0,
                daysHtml = "",
                tr = ''

            prevMonthDate.setDate(prevMonthDays)
            prevMonthDate.setDate(prevMonthDays - (prevMonthDate.getDay() - SETTING.weekStart + 7) % 7)

            nextMonthDate = new Date(prevMonthDate)
            nextMonthDate.setDate(nextMonthDate.getDate() + 42)

            if (this.opts.minDate) minDate = UTILS.isJqueryInput(this.opts.minDate) ? UTILS.getValidDate($(this.opts.minDate).val()) : UTILS.getValidDate(this.opts.minDate)
            if (this.opts.maxDate) maxDate = UTILS.isJqueryInput(this.opts.maxDate) ? UTILS.getValidDate($(this.opts.maxDate).val()) : UTILS.getValidDate(this.opts.maxDate)

            renderTitle.call(this, $table);
            for (startIndex = 1; prevMonthDate.valueOf() < nextMonthDate.valueOf(); prevMonthDate.setDate(prevMonthDate.getDate() + 1), startIndex++) {
                var prevY = prevMonthDate.getFullYear(),
                    prevM = prevMonthDate.getMonth(),
                    prevD = prevMonthDate.getDate(),
                    prevW = prevMonthDate.getDay(),
                    className = VARS.className.day,
                    calendarDateAttr = SETTING.prefix + '-calendar-date="' + prevY + '/' + (prevM + 1) + '/' + prevD + '"',
                    isShow = true,
                    td

                if (prevY < viewYear || (prevY === viewYear && prevM < viewMonth)) {
                    if (this.opts.onlyThisMonth) isShow = false
                    className += ' ' + VARS.className.old
                    prevMonthDateCount++
                } else if (prevY > viewYear || (prevY === viewYear && prevM > viewMonth)) {
                    if (this.opts.onlyThisMonth) isShow = false
                    className += ' ' + VARS.className.new
                    nextMonthDateCount++
                }

                if (minDate && prevMonthDate.valueOf() < minDate.valueOf() || maxDate && prevMonthDate.valueOf() > maxDate.valueOf()) {
                    className += ' ' + VARS.className.disabled
                }

                if ((prevW === 0 || prevW === 6) && this.opts.highlightWeek) {
                    className += ' ' + VARS.className.week
                }

                if (this.activeDate && (prevMonthDate.valueOf() === this.activeDate.valueOf())) {
                    className += ' ' + VARS.className.activeDay
                }

                if (startIndex % 7 === 1) {
                    tr += '<tr>'
                }

                td = isShow ? '<td class="' + className + '" ' + calendarDateAttr + '>' +
                    this.getDay(prevMonthDate, nowDate) +
                    '</td>' : '<td></td>'

                tr += td

                if (startIndex % 7 === 0) {
                    tr += '</tr>'
                    if (this.opts.onlyThisMonth && (prevMonthDateCount === 7 || nextMonthDateCount === 7)) {
                        tr = tr.replace(/<tr>/, '<tr style="display:none"')
                    }
                    prevMonthDateCount = nextMonthDateCount = 0
                    daysHtml += tr
                    tr = ''
                }
            }

            $table.find('tbody').html(daysHtml)
            $table.find('.' + VARS.className.select).text(SETTING.locales[this.opts.locale].getYearMonth(viewDate.getFullYear(), viewDate.getMonth()))
            this.$calenderDays.append($table)

            this.curPaneCount++
            if (this.curPaneCount < this.paneCount) {
                this.viewDate.setMonth(this.viewDate.getMonth() + 1)
                renderTable.call(this)
            }

            function renderTitle(tableEl) {
                var weekStart = SETTING.weekStart, tr = '<tr class="' + VARS.className.titles + '">';
                for (var titleIndex = weekStart; titleIndex < weekStart + 7; titleIndex++) {
                    var className = VARS.className.title,
                        th

                    if (this.opts.highlightWeek && ((titleIndex % 7) === 0 || (titleIndex % 7) === 6)) {
                        className += ' ' + VARS.className.week
                    }

                    th = '<th class="' + className + '">' +
                        SETTING.locales[this.opts.locale].daysShort[titleIndex % 7] +
                        '</th>'

                    tr += th
                }
                tableEl.find('thead').append(tr)
            }
        }.call(this))
    }

    Calendar.prototype.renderMonths = function () {
        var viewDate = this.viewDate,
            activeYear = this.activeDate ? this.activeDate.getFullYear() : null,
            activeMonth = this.activeDate ? this.activeDate.getMonth() : null,
            className = VARS.className.month,
            html = ''

        for (var i = 0; i < 12; i++) {
            var clsName = className,
                year = viewDate.getFullYear(),
                attr = SETTING.prefix + '-calendar-date="' + year + '-' + (i + 1) + '"'
            year === activeYear && i === activeMonth && (clsName += ' ' + VARS.className.active)
            html += '<span class="' + clsName + '" ' + attr + '>' +
                SETTING.locales[this.opts.locale].months[i] +
                '</span>'
        }
        this.$calenderMonths.find('tbody td').first().html(html)
        this.$calenderMonths.find('.' + VARS.className.select).text(viewDate.getFullYear())

    }

    Calendar.prototype.renderYears = function () {
        var viewDate = this.viewDate,
            className = VARS.className.year,
            viewYear = viewDate.getFullYear(),
            activeYear = this.activeDate ? this.activeDate.getFullYear() : null,
            startYear = parseInt(viewYear / 10) * 10,
            html = ''

        for (var i = -1; i <= 10; i++) {
            var clsName = className,
                year = startYear + i,
                attr = SETTING.prefix + '-calendar-date="' + year + '"'
            i === -1 && (clsName += ' ' + VARS.className.old)
            i === 10 && (clsName += ' ' + VARS.className.new)
            year === activeYear && (clsName += ' ' + VARS.className.active)
            html += '<span class="' + clsName + '" ' + attr + '>' +
                year +
                '</span>'
        }

        this.$calenderYears.find('tbody td').first().html(html)
        this.$calenderYears.find('.' + VARS.className.select).text(startYear + '-' + (startYear + 9))
    }

    Calendar.prototype.show = function (level) {
        if (level) {
            this.viewMode = Math.max(this.minViewMode,
                Math.min(2, this.viewMode + level))
        }
        var renderFunc = 'render' + VARS.modes[this.viewMode].name
        this.paneCount = this.viewMode > 0 ? 1 : this.opts.paneCount

        this[renderFunc].call(this)
        this.$calender.find('>div').hide().
            filter('.' + SETTING.prefix + '-calendar-' + VARS.modes[this.viewMode].className).show()
        this.resetCalendarStyle()
    };

    Calendar.prototype.getDay = function (loopDate, nowDate) {
        var str = '',
            todayClassName = VARS.className.today,
            lunarClassName = VARS.className.lunar,
            festivalClassName = VARS.className.festival

        if (UTILS.isSameDay(loopDate, nowDate)) {
            str = '<div class="' + todayClassName + '">' + SETTING.locales[this.opts.locale].today + '</div>'
        } else {
            str = loopDate.getDate()
        }
        if (this.opts.showLunarAndFestival) {
            str += '<div class="' + lunarClassName + '">' + this.getLunarAndFestival(loopDate) + '</div>'
        } else if (this.opts.showMainFestival || this.opts.showFestival) {
            var festival = this.getLunarAndFestival(loopDate, {
                onlyReturnMainFestival: this.opts.showMainFestival,
                onlyReturnFestival: this.opts.showFestival
            })
            this.opts.showMainFestival && !!festival && (str = '')
            str += festival ? ('<div class="' + festivalClassName + '">' + festival + '</div>') : ''
        }
        return str
    }

    Calendar.prototype.getLunarAndFestival = function (date, options) {
        var lunar = new this.Lunar(date),
            sMonthDay = UTILS.formatDateTime(date, 'MMdd'),
            lMonthDay = (lunar.month < 10 ? '0' + lunar.month : lunar.month) + (lunar.day < 10 ? '0' + lunar.day : lunar.day),
            sFestival = VARS.festival[sMonthDay],
            lFestival = VARS.lunarFestival[lMonthDay],
            lDay = lunar.cDay,
            sTerm = lunar.sTerm,
            lunarStr,
            festival,
            mainFestival,
            defaults = {
                onlyReturnFestival: false,
                onlyReturnMainFestival: false
            }
        $.extend(defaults, options)

        if (lunar.month === 12) {
            var lEndDay = lunar.isLeap ? lunar.getLunarLeapDaysByYear(lunar.year) : lunar.getLunarDaysByYearMonth(lunar.year, lunar.month)
            if (lEndDay === lunar.day) {
                lFestival = '除夕'
            }
        }

        lunarStr = sFestival || lFestival || sTerm || lDay
        festival = sFestival || lFestival || sTerm
        mainFestival = this.mainFestival.indexOf(festival) >= 0 && festival
        return defaults.onlyReturnMainFestival ? mainFestival : defaults.onlyReturnFestival ? festival : lunarStr
    }

    Calendar.prototype.resetCalendarStyle = function () {
        var $table = this['$calender' + VARS.modes[this.viewMode].name].find('table'),
            // tableHeight = $table.height(),
            tableWidth = $table.width()

        this.$calender
            .width(this.paneCount > 3 ? tableWidth * 3 : tableWidth * this.paneCount)
        // .height(Math.ceil(this.paneCount / 3) * tableHeight)

        if (this.$srcElement) {
            var offset = this.$srcElement.offset(),
                srcElH = this.$srcElement.outerHeight()
            this.$calender.css({
                left: offset.left,
                top: offset.top + srcElH,
                position: 'absolute',
                zIndex: 9999
            })
        }

    }

    Calendar.prototype.open = function () {
        this.$calender.removeClass(VARS.className.hidden).show()
    }

    Calendar.prototype.close = function () {
        this.$calender.hide()
    }

    function Lunar(sDate) {
        var i,
            leap = 0,
            temp = 0,
            baseDate = new Date(1900, 0, 31),
            offset = (sDate - baseDate) / 86400000

        this.dayCyl = offset + 40
        this.monCyl = 14
        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = this.getLunarDaysByYear(i)
            offset -= temp
            this.monCyl += 12
        }
        if (offset < 0) {
            offset += temp
            i--
            this.monCyl -= 12
        }
        this.year = i
        this.yearCyl = i - 1864
        leap = this.getLunarLeapMonthByYear(i) //闰哪个月
        this.isLeap = false
        for (i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i == (leap + 1) && this.isLeap === false) {	//闰月
                --i
                this.isLeap = true
                temp = this.getLunarLeapDaysByYear(this.year)
            } else {
                temp = this.getLunarDaysByYearMonth(this.year, i)
            }
            if (this.isLeap === true && i == (leap + 1)) this.isLeap = false;	//解除闰月
            if (this.isLeap === false) this.monCyl++;
            offset -= temp;
        }
        if (offset == 0 && leap > 0 && i == leap + 1) {
            if (this.isLeap) {
                this.isLeap = false;
            } else {
                this.isLeap = true; --i; --this.monCyl;
            }
        }
        if (offset < 0) {
            offset += temp
            --i
            --this.monCyl
        }
        this.month = i
        this.day = offset + 1
        this.cDay = this.getChineseLunarDay(this.day)
        this.sTermDay1 = this.getSolarTermDay(sDate.getFullYear(), sDate.getMonth() * 2)
        this.sTermDay2 = this.getSolarTermDay(sDate.getFullYear(), sDate.getMonth() * 2 + 1)
        this.sTerm = ''
        if (sDate.getDate() === this.sTermDay1) {
            this.sTerm = solarTerms[sDate.getMonth() * 2]
        } else if (sDate.getDate() === this.sTermDay2) {
            this.sTerm = solarTerms[sDate.getMonth() * 2 + 1]
        }
    }

    Lunar.prototype = {
        //返回农历year年的总天数
        getLunarDaysByYear: function (year) {
            var i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1)
                sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
            return (sum + this.getLunarLeapDaysByYear(year));
        },
        //返回农历year年闰月的天数
        getLunarLeapDaysByYear: function (year) {
            if (this.getLunarLeapMonthByYear(year)) return ((lunarInfo[year - 1900] & 0x10000) ? 30 : 29);
            else return (0);
        },
        //返回农历year年闰几月，不闰返回0
        getLunarLeapMonthByYear: function (year) {
            return (lunarInfo[year - 1900] & 0xf);
        },
        //返回农历year年month月的总天数
        getLunarDaysByYearMonth: function (year, month) {
            return ((lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29);
        },
        //返回中文农历日期
        getChineseLunarDay: function (day) {
            var str = cDays2[Math.floor(day / (day <= 10 ? 11 : 10))];
            str += cDays[day % 10];
            return str
        },
        //返回year年的第n个节气为几日(从0小寒起算)
        getSolarTermDay: function (year, n) {
            var offDate = new Date((31556925974.7 * (year - 1900) + solarTermsInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
            return (offDate.getUTCDate())
        }
    }

    $.fn.SlwyCalendar = function (options) {
        new Calendar(options, $(this))
        return $(this)
    }

    return function (options, srcElement) {
        if (typeof options === 'string') srcElement = options, options = {}
        if (typeof options === 'undefined') options = {}
        new Calendar(options, srcElement)
    }

}))