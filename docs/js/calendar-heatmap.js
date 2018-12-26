/* global calendarHeatmap moment d3 */

function calendarHeatmap (year) {
  // defaults
  const width = 750
  const height = 110
  const legendWidth = 150
  let selector = 'body'
  const SQUARE_LENGTH = 11
  const SQUARE_PADDING = 2
  const MONTH_LABEL_PADDING = 6
  let startDate = moment(`${year}-01-01`)
  let endDate = moment(`${year}-12-31`)
  let data = []
  let max = null
  const colorFail = '#E43F6F' // 'paradise pink'
  const colorWin = '#95A78D' // 'spanish gray'
  const colorNoExport = '#D9D9D9' // 'gainsboro'
  const colorNeutral = '#C9C5CB' // 'lavender gray'

  let colorRange = ['#D8E6E7', '#218380']
  let tooltipEnabled = true
  let tooltipUnit = 'export'
  let legendEnabled = true
  let onClick = null
  const weekStart = 1 // 0 for Sunday, 1 for Monday
  let locale = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    No: 'No',
    on: 'on',
    Less: 'Less',
    More: 'More'
  }

  // setters and getters
  chart.data = function (value) {
    if (!arguments.length) { return data }
    data = value
    return chart
  }

  chart.max = function (value) {
    if (!arguments.length) { return max }
    max = value
    return chart
  }

  chart.selector = function (value) {
    if (!arguments.length) { return selector }
    selector = value
    return chart
  }

  chart.startDate = function (value) {
    if (!arguments.length) { return startDate }
    startDate = value
    return chart
  }

  chart.endDate = function (value) {
    if (!arguments.length) { return endDate }
    endDate = value
    return chart
  }

  chart.colorRange = function (value) {
    if (!arguments.length) { return colorRange }
    colorRange = value
    return chart
  }

  chart.tooltipEnabled = function (value) {
    if (!arguments.length) { return tooltipEnabled }
    tooltipEnabled = value
    return chart
  }

  chart.tooltipUnit = function (value) {
    if (!arguments.length) { return tooltipUnit }
    tooltipUnit = value
    return chart
  }

  chart.legendEnabled = function (value) {
    if (!arguments.length) { return legendEnabled }
    legendEnabled = value
    return chart
  }

  chart.onClick = function (value) {
    if (!arguments.length) { return onClick() }
    onClick = value
    return chart
  }

  chart.locale = function (value) {
    if (!arguments.length) { return locale }
    locale = value
    return chart
  }

  function chart () {
    d3.select(chart.selector()).selectAll('svg.calendar-heatmap').remove() // remove the existing chart, if it exists

    var dateRange = d3.timeDays(startDate, endDate) // generates an array of date objects within the specified range
    var monthRange = d3.timeMonths(moment(startDate).startOf('month').toDate(), endDate) // it ignores the first month if the 1st date is after the start of the month
    const firstDate = moment(startDate)
    if (chart.data().length === 0) {
      max = 0
    } else if (max === null) {
      max = d3.max(chart.data(), function (d) { return d.count }) // max data value
    }

    let tooltip
    let dayRects

    drawChart()

    function drawChart () {
      var svg = d3.select(chart.selector())
        .style('position', 'relative')
        .append('svg')
        .attr('width', width)
        .attr('class', 'calendar-heatmap')
        .attr('height', height)
        .style('padding', '36px 72px')

      dayRects = svg.selectAll('.day-cell')
        .data(dateRange) //  array of days for the specified period

      // create a square for each day
      dayRects.enter().append('rect')
        .attr('class', function (d) { return `day-cell ${moment(d).format('YYYY-MM-DD')}` })
        .attr('width', SQUARE_LENGTH)
        .attr('height', SQUARE_LENGTH)
        .attr('fill', function (d) {
          const day = d.getDay()
          // no export on weekends
          if ((day === 6) || (day === 0)) {
            return colorNoExport
          } else {
            switch (countForDate(d)) {
              // no export yet for this date
              case 0:
                return colorNeutral
              // successful export
              case 1:
                return colorWin
              // problemtatic export
              case -1:
                return colorFail
            }
          }
        })
        .attr('x', function (d, i) {
          var cellDate = moment(d)
          var result = cellDate.isoWeek() - firstDate.isoWeek() + (firstDate.isoWeeksInYear() * (cellDate.isoWeekYear() - firstDate.isoWeekYear()))
          return result * (SQUARE_LENGTH + SQUARE_PADDING)
        })
        .attr('y', function (d, i) {
          return MONTH_LABEL_PADDING + formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING)
        })

      if (typeof onClick === 'function') {
        svg.selectAll('.day-cell').on('click', function (d) {
          var count = countForDate(d)
          onClick({date: d, count: count})
        })
      }

      if (chart.tooltipEnabled()) {
        svg.selectAll('.day-cell').on('mouseover', function (d, i) {
          tooltip = d3.select(chart.selector())
            .append('div')
            .attr('class', 'day-cell-tooltip')
            .html(tooltipHTMLForDate(d))
            .style('left', function () { return Math.floor(i / 7) * SQUARE_LENGTH + 'px' })
            .style('top', function () {
              return formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING) + MONTH_LABEL_PADDING * 2 + 'px'
            })
        })
        .on('mouseout', function (d, i) {
          tooltip.remove()
        })
      }

      if (chart.legendEnabled()) {
        var colorRange = [color(0)]
        for (var i = 3; i > 0; i--) {
          colorRange.push(color(max / i))
        }

        var legendGroup = svg.append('g')
        legendGroup.selectAll('.calendar-heatmap-legend')
            .data(colorRange)
            .enter()
          .append('rect')
            .attr('class', 'calendar-heatmap-legend')
            .attr('width', SQUARE_LENGTH)
            .attr('height', SQUARE_LENGTH)
            .attr('x', function (d, i) { return (width - legendWidth) + (i + 1) * 13 })
            .attr('y', height + SQUARE_PADDING)
            .attr('fill', function (d) { return d })

        legendGroup.append('text')
          .attr('class', 'calendar-heatmap-legend-text calendar-heatmap-legend-text-less')
          .attr('x', width - legendWidth - 13)
          .attr('y', height + SQUARE_LENGTH)
          .text(locale.Less)

        legendGroup.append('text')
          .attr('class', 'calendar-heatmap-legend-text calendar-heatmap-legend-text-more')
          .attr('x', (width - legendWidth + SQUARE_PADDING) + (colorRange.length + 1) * 13)
          .attr('y', height + SQUARE_LENGTH)
          .text(locale.More)
      }

      dayRects.exit().remove()
      svg.selectAll('.month')
          .data(monthRange)
          .enter().append('text')
          .attr('class', 'month-name')
          // .style()
          .text(function (d) {
            return locale.months[d.getMonth()]
          })
          .attr('x', function (d, i) {
            var matchIndex = 0
            dateRange.find(function (element, index) {
              matchIndex = index
              return moment(d).isSame(element, 'month') && moment(d).isSame(element, 'year')
            })

            return Math.floor(matchIndex / 7) * (SQUARE_LENGTH + SQUARE_PADDING)
          })
          .attr('y', 0) // fix these to the top

      locale.days.forEach(function (day, index) {
        index = formatWeekday(index)
        if (index % 2 === 0) {
          svg.append('text')
            .attr('class', 'day-initial')
            .attr('transform', 'translate(-8,' + (SQUARE_LENGTH + SQUARE_PADDING) * (index + 1) + ')')
            .style('text-anchor', 'end')
            .attr('dy', '2')
            .text(day)
        }
      })
    }

/*
  On Fri, 23 Jan 2018, there was no export (yet).
  The export on Tue, 1 Feb 2018 was successful.
  The export on Wed, 23 Mar 2018 failed.
  On weekends, there are no exports.
*/
    function tooltipHTMLForDate (d) {
      const day = moment(d)
      var dateStr = day.format('ddd, Do MMM YYYY')
      var count = countForDate(d)
      let tooltip
      if (day.isoWeekday() >= 6 /* Saturday or Sunday */) {
        return '<span>On weekends, there are no exports so far.</span>'
      }
      switch (count) {
        case 0:
          tooltip = `On ${dateStr}, there was <strong>no export</strong> (yet).`
          break
        case 1:
          tooltip = `The export on ${dateStr} was <strong>successful</strong>.`
          break
        case -1:
          tooltip = `The export on ${dateStr} <strong>failed</strong>.`
          break
      }
      return `<span>${tooltip}</span>`
    }

    function countForDate (d) {
      var count = 0
      var match = chart.data().find(function (element, index) {
        return moment(element.date).isSame(d, 'day')
      })
      if (match) {
        count = match.count
      }
      return count
    }

    function formatWeekday (weekDay) {
      if (weekStart === 1) { // start on Mondays
        if (weekDay === 0) { //
          return 6
        } else {
          return weekDay - 1
        }
      }
      return weekDay
    }

    var daysOfChart = chart.data().map(function (day) {
      return day.date.toDateString()
    })
  }
  return chart
}

// polyfill for Array.find() method
/* jshint ignore:start */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}
/* jshint ignore:end */
