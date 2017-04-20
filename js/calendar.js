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
    getTemplate: function () {
        var headTemplate = '<thead>' +
            '<tr class="' + this.prefix + '-calendar-header">' +
            '<th class="' + this.prefix + '-calendar-prev">' +
            '<i class="' + this.prefix + '-calendar-prev-icon"></i></th>' +
            '<th colspan="5" class="' + this.prefix + '-calendar-switch">' +
            '<div class="' + this.prefix + '-calendar-select"></div></th>' +
            '<th class="' + this.prefix + '-calendar-next"><i class="' + this.prefix + '-calendar-next-icon"></i>' +
            '</th></tr></thead>';
        var contTemplate = '<tbody><tr><td colspan="7"></td></tr></tbody>';

        return '<div class="' + this.prefix + '-calendar ' + this.prefix + '-calendar-dropdown">' +
            '<div class="' + this.prefix + '-calendar-caret"></div>' +
            '<div class="' + this.prefix + '-calendar-days">' +
            '<table class="' + this.prefix + '-calendar-table">' +
            headTemplate +
            '<tbody></tbody>' +
            '</table>' +
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
    }
}



function Calendar(opts) {
    this.dfts = {
        locale: 'zh_CN',
        highlightWeek: true,
        paneCount: 1,
        minDate: null,
        maxDate: null,
        onChange: function (date) {

        }
    }
    this.opts = $.extend(true, this.dfts, opts)
    var template = SETTING.getTemplate();
    this.$calender = $(template).appendTo('body');
    this.$calenderDays = this.$calender.find('.' + SETTING.prefix + '-calendar-days');

    this.now = new Date()
    this.viewDate = new Date()
    this.init()
}
Calendar.prototype.init = function () {
    this.bind()
    this.render()
}

Calendar.prototype.bind = function () {
    var _this = this
    this.$calenderDays.on('click.' + SETTING.prefix + '.Calendar', function (e) {
        var $target = $(e.target).closest('span, td, th'),
            activeClassName = SETTING.prefix + '-calendar-day-active',
            disabledClassName = SETTING.prefix + '-calendar-disabled',
            prevClassName = SETTING.prefix + '-calendar-prev',
            nextClassName = SETTING.prefix + '-calendar-next'

        if ($target.is('th') && $target.hasClass(prevClassName)) {
            _this.viewDate.setMonth(_this.viewDate.getMonth() - 1)
            _this.renderDays()
        } else if ($target.is('th') && $target.hasClass(nextClassName)) {
            _this.viewDate.setMonth(_this.viewDate.getMonth() + 1)
            _this.renderDays()
        } else if ($target.is('td')) {
            if ($target.hasClass(disabledClassName)) {
                return
            }
            $target.parents('tbody').find('td').removeClass(activeClassName)
            $target.addClass(activeClassName)
            _this.opts.onChange()
        }

    })
}


Calendar.prototype.render = function () {
    this.renderTitle()
    this.renderDays(this.now)
}

Calendar.prototype.renderTitle = function () {
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
    this.$calenderDays.find('thead').append(tr)
}

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
        daysHtml = ""

    prevMonthDate.setDate(prevMonthDays)
    prevMonthDate.setDate(prevMonthDays - (prevMonthDate.getDay() - SETTING.weekStart + 7) % 7)

    nextMonthDate = new Date(prevMonthDate)
    nextMonthDate.setDate(nextMonthDate.getDate() + 42)

    if (this.opts.minDate) minDate = new Date(typeof this.opts.minDate === 'string' ? this.opts.minDate.replace('-', '/') : this.opts.minDate)
    if (this.opts.maxDate) maxDate = new Date(typeof this.opts.maxDate === 'string' ? this.opts.maxDate.replace('-', '/') : this.opts.maxDate)


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

    this.$calenderDays.find('tbody').html(daysHtml)

    this.$calenderDays.find('.' + SETTING.prefix + '-calendar-select').text(SETTING.locales[this.opts.locale].getYearMonth(viewDate.getFullYear(), viewDate.getMonth()))


}

new Calendar({
    locale: 'zh_CN',
    paneCount: 2,
    // highlightWeek: false,
    minDate: '2017-04-10',
    maxDate: new Date()
})
