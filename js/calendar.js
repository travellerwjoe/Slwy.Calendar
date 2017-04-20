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
                '<th colspan="7" class="' + this.prefix + '-calendar-switch">' +
                '<div class="' + this.prefix + '-calendar-select"></div></th>' +
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
        prefix: 'slwy',
        yearStart: 1990,//年份开始
        yearEnd: 2050,//年份结束
        weekStart: 0,//一周开始星期，0星期日
    }

    var UTILS = {
        //获取日期月份第一天的星期
        /*getDayWeekOfMonthFirstDay: function (date) {
            date = new Date(date)
            var dateYear = date.getFullYear(),
                dateMonth = date.getMonth(),
                firstDayDate = new Date(dateYear, dateMonth);
            return firstDayDate.getDay();
        }*/
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
        }
    }



    function Calendar(opts, srcElement) {
        this.dfts = {
            locale: 'zh_CN',//语言时区
            highlightWeek: true,//是否高亮周末
            paneCount: 1,//面板数量
            minDate: null,
            maxDate: null,
            onChange: function (date) {

            }
        }
        this.opts = $.extend(true, this.dfts, opts)
        var template = SETTING.getTemplate();
        this.$calender = $(template).appendTo('body');
        this.$calenderDays = this.$calender.find('.' + SETTING.prefix + '-calendar-days');
        this.$calendarAction = this.$calender.find('.' + SETTING.prefix + '-calendar-action');
        this.$srcElement = $(srcElement)//触发元素

        this.now = new Date()
        this.viewDate = new Date() //当前面板显示时间
        this.activeDate = null //当前选中时间
        this.curPaneCount = 0 //当前面板数量
        this.init()
    }
    Calendar.prototype.init = function () {
        this.bind()
        this.render()
    }

    Calendar.prototype.bind = function () {
        var _this = this,
            clickEvent = 'click.' + SETTING.prefix + '.Calendar',
        this.$calenderDays.on(clickEvent, function (e) {
            var $target = $(e.target).closest('span, td, th'),
                activeClassName = SETTING.prefix + '-calendar-day-active',
                disabledClassName = SETTING.prefix + '-calendar-disabled'

            if ($target.is('td')) {
                if ($target.hasClass(disabledClassName)) {
                    return
                }
                _this.$calenderDays.find('td').removeClass(activeClassName)
                $target.addClass(activeClassName)
                _this.opts.onChange()
            }

        })

        this.$calendarAction.on(clickEvent, function (e) {
            var $target = $(e.target).closest('div'),
                prevClassName = SETTING.prefix + '-calendar-prev',
                nextClassName = SETTING.prefix + '-calendar-next'

            _this.$calenderDays.html('')
            _this.curPaneCount = 0
            if ($target.hasClass(prevClassName)) {
                _this.viewDate.setMonth(_this.viewDate.getMonth() - _this.opts.paneCount * 2 + 1)
                _this.renderDays()
            } else if ($target.hasClass(nextClassName)) {
                _this.viewDate.setMonth(_this.viewDate.getMonth() + 1)
                _this.renderDays()
            }
        })
    }


    Calendar.prototype.render = function () {
        // this.renderTitle()
        this.renderDays()
        this.resetCalendarHeight()
    }

    // Calendar.prototype.renderTitle = function () {
    //     var weekStart = SETTING.weekStart, tr = '<tr>';
    //     for (var titleIndex = weekStart; titleIndex < weekStart + 7; titleIndex++) {
    //         var className = SETTING.prefix + '-calendar-title ',
    //             th

    //         if (this.opts.highlightWeek && ((titleIndex % 7) === 0 || (titleIndex % 7) === 6)) {
    //             className += SETTING.prefix + '-calendar-week'
    //         }

    //         th = '<th class="' + className + '">' +
    //             SETTING.locales[this.opts.locale].daysShort[titleIndex % 7]
    //         '</th>'

    //         tr += th
    //     }
    //     this.$calenderDays.find('thead').append(tr)
    // }

    Calendar.prototype.renderDays = function () {
        var viewDate = this.viewDate,
            viewYear = viewDate.getFullYear(),
            viewMonth = viewDate.getMonth(),
            nowDate = this.now,
            nowYear = nowDate.getFullYear(),
            nowMonth = nowDate.getMonth(),
            // nowFirstDayDate = new Date(nowYear, nowMonth),
            // nowFirstDayWeek = nowFirstDayDate.getDay(),//当月第一天的星期
            // nowDays = UTILS.getDaysOfYearMonth(nowYear, nowMonth),//当月天数
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
            daysHtml = ""

        prevMonthDate.setDate(prevMonthDays)
        prevMonthDate.setDate(prevMonthDays - (prevMonthDate.getDay() - SETTING.weekStart + 7) % 7)

        nextMonthDate = new Date(prevMonthDate)
        nextMonthDate.setDate(nextMonthDate.getDate() + 42)

        if (this.opts.minDate) minDate = UTILS.getValidDate(this.opts.minDate)
        if (this.opts.maxDate) maxDate = UTILS.getValidDate(this.opts.maxDate)

        renderTitle.call(this, $table);
        for (startIndex = 1; prevMonthDate.valueOf() < nextMonthDate.valueOf(); prevMonthDate.setDate(prevMonthDate.getDate() + 1), startIndex++) {
            var prevY = prevMonthDate.getFullYear(),
                prevM = prevMonthDate.getMonth(),
                prevW = prevMonthDate.getDay(),
                className = SETTING.prefix + '-calendar-day ',
                td

            if (prevY < viewYear || (prevY === viewYear && prevM < viewMonth)) {
                className += SETTING.prefix + '-calendar-old '
            } else if (prevY > viewYear || (prevY === viewYear && prevM > viewMonth)) {
                className += SETTING.prefix + '-calendar-new '
            }

            if (minDate && prevMonthDate.valueOf() < minDate.valueOf()) {
                className += SETTING.prefix + '-calendar-disabled '
            } else if (maxDate && prevMonthDate.valueOf() > maxDate.valueOf()) {
                className += SETTING.prefix + '-calendar-disabled '
            }

            if ((prevW === 0 || prevW === 6) && this.opts.highlightWeek) {
                className += SETTING.prefix + '-calendar-week'
            }

            if (startIndex % 7 === 1) {
                daysHtml += '<tr>'
            }

            td = '<td class="' + className + '">' +
                (UTILS.isSameDay(prevMonthDate, nowDate) ? SETTING.locales[this.opts.locale].today : prevMonthDate.getDate()) +
                '</td>'

            daysHtml += td

            if (startIndex % 7 === 0) {
                daysHtml += '</tr>'
            }
        }

        $table.find('tbody').html(daysHtml)
        $table.find('.' + SETTING.prefix + '-calendar-select').text(SETTING.locales[this.opts.locale].getYearMonth(viewDate.getFullYear(), viewDate.getMonth()))
        this.$calenderDays.append($table)

        this.curPaneCount++
        if (this.curPaneCount < this.opts.paneCount) {
            this.viewDate.setMonth(this.viewDate.getMonth() + 1)
            this.renderDays()
        }

        function renderTitle(tableEl) {
            var weekStart = SETTING.weekStart, tr = '<tr>';
            for (var titleIndex = weekStart; titleIndex < weekStart + 7; titleIndex++) {
                var className = SETTING.prefix + '-calendar-title ',
                    th

                if (this.opts.highlightWeek && ((titleIndex % 7) === 0 || (titleIndex % 7) === 6)) {
                    className += SETTING.prefix + '-calendar-week'
                }

                th = '<th class="' + className + '">' +
                    SETTING.locales[this.opts.locale].daysShort[titleIndex % 7]
                '</th>'

                tr += th
            }
            tableEl.find('thead').append(tr)
        }

    }

    Calendar.prototype.resetCalendarHeight = function () {
        var $table = this.$calender.find('table'),
            tableWidth = $table.width(),
            tableHeight = $table.height()
        this.$calender.width(this.opts.paneCount > 3 ? tableWidth * 3 : tableWidth * this.opts.paneCount).height(Math.ceil(this.opts.paneCount / 3) * tableHeight)
    }


    $.fn.SlwyCalendar = function (options) {
        new Calendar(options, $(this))
        return $(this)
    }

    return function (options, srcElement) {
        srcElement = srcElement || event.srcElement || document.getElementsByTagName('body')[0]
        new Calendar(options, srcElement)
    }
    
}))