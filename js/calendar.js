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
    }

    var UTILS = {
        //是否是页面中存在的jquery input对象
        isJqueryInput: function (selector) {
            return $(selector).is('input')
        },
        //指定元素是否上是否存在指定命名空间的事件
        isEventOnNamespace(el, event, namespace) {
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
            date = new Date(date);
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

    function Calendar(opts, srcElement) {
        this.dfts = {
            locale: 'zh_CN',//语言时区
            highlightWeek: true,//是否高亮周末
            paneCount: 1,//面板数量
            minDate: null,
            maxDate: null,
            dateFormat: 'yyyy-MM-dd',
            onChangeDate: null
        }
        this.opts = $.extend(true, this.dfts, opts)
        var template = SETTING.getTemplate();
        this.$calender = $(template).appendTo('body');
        this.$calenderDays = this.$calender.find('.' + SETTING.prefix + '-calendar-days');
        this.$calendarAction = this.$calender.find('.' + SETTING.prefix + '-calendar-action');
        this.$srcElement = srcElement && $(srcElement)//触发元素

        this.now = new Date()
        this.viewDate = new Date() //当前面板显示时间
        this.activeDate = this.$srcElement ? UTILS.getValidDate(this.$srcElement.val()) : null //当前选中时间
        this.curPaneCount = 0 //当前面板数量

        //如有触发元素隐藏日历待触发时显示
        if (this.$srcElement) {
            this.$calender.addClass(SETTING.prefix + '-calendar-hidden')
        } else {
            this.$calender.find('.' + SETTING.prefix + '-calendar-caret').remove()
        }
        this.init()
    }
    Calendar.prototype.init = function () {
        this.bind()
        this.render()
    }

    Calendar.prototype.bind = function () {
        var _this = this,
            clickEvent = 'click.' + SETTING.prefix + '.Calendar',
            focusEvent = 'focus.' + SETTING.prefix + '.Calendar',
            blurEvent = 'blur.' + SETTING.prefix + '.Calendar',
            changeDateEvent = 'changeDate.' + SETTING.prefix + '.Calendar'

        if (this.$srcElement) {
            this.$srcElement.on(focusEvent, function (e) {
                _this.open()
            })

            $(document).on(clickEvent, function (e) {
                var $target = $(e.target)

                if (!$target.is(_this.$srcElement) && !$target.closest('.' + SETTING.prefix + '-calendar').is(_this.$calender)) {
                    _this.close()
                }
            })
        }

        $.each(['minDate', 'maxDate'], function (index, date) {
            if (_this.opts[date] && UTILS.isJqueryInput(_this.opts[date])) {
                var $date = $(_this.opts[date])
                $date.on(changeDateEvent, function (e) {
                    if (e.namespace !== 'Calendar.' + SETTING.prefix) return
                    _this.opts[date] = e.value
                    _this.viewDate = new Date()
                    _this.activeDate = _this.$srcElement ? UTILS.getValidDate(_this.$srcElement.val()) : null
                    _this.curPaneCount = 0
                    _this.$calenderDays.html('')
                    _this.renderDays()

                })
            }
        })

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

                var date = new Date($target.attr(SETTING.prefix + '-calendar-date')),
                    formatedDate = UTILS.formatDateTime(date, _this.opts.dateFormat),
                    cbRes

                if (new Date(_this.activeDate).valueOf() === date.valueOf()) {
                    return
                }

                _this.activeDate = date
                typeof _this.opts.onChangeDate === 'function' && _this.opts.onChangeDate.call(_this, _this.activeDate, formatedDate)

                if (_this.$srcElement) {
                    $.each(['changeDate', changeDateEvent], function (index, item) {
                        _this.$srcElement.trigger({
                            type: item,
                            date: _this.activeDate,
                            value: formatedDate,
                            close: _this.close.bind(_this),
                            open: _this.open.bind(_this)
                        })
                    })
                    //如果onChangeDate回调未声明并且未在jqueryDom对象上绑定无命名空间的onChangeDate事件执行默认操作
                    if (typeof _this.opts.onChangeDate !== 'function' && !UTILS.isEventOnNamespace(_this.$srcElement, 'changeDate', '')) {
                        _this.$srcElement.val(formatedDate)
                        _this.close()
                    }

                }
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
        this.renderDays()
        this.resetCalendarStyle()
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
            $table = $(SETTING.getTemplate('table')),
            daysHtml = ""

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
                className = SETTING.prefix + '-calendar-day ',
                calendarDateAttr = SETTING.prefix + '-calendar-date="' + prevY + '/' + (prevM + 1) + '/' + prevD + '"',
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
                className += SETTING.prefix + '-calendar-week '
            }

            if (this.activeDate && (prevMonthDate.valueOf() === this.activeDate.valueOf())) {
                className += SETTING.prefix + '-calendar-day-active '
            }

            if (startIndex % 7 === 1) {
                daysHtml += '<tr>'
            }

            td = '<td class="' + className + '" ' + calendarDateAttr + '>' +
                (UTILS.isSameDay(prevMonthDate, nowDate) ? SETTING.locales[this.opts.locale].today : prevD) +
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

    Calendar.prototype.resetCalendarStyle = function () {
        var $table = this.$calender.find('table'),
            tableWidth = $table.width(),
            tableHeight = $table.height()
        this.$calender.width(this.opts.paneCount > 3 ? tableWidth * 3 : tableWidth * this.opts.paneCount).height(Math.ceil(this.opts.paneCount / 3) * tableHeight)

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
        this.$calender.removeClass(SETTING.prefix + '-calendar-hidden').show()
    }

    Calendar.prototype.close = function () {
        this.$calender.hide()
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