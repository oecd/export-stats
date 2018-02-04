/* global $ _ d3 calendarHeatmap generateData moment */
const threshold = 95
const percentageElt = $('#export-percentage')
const explanationElt = $('#export-explanation')
const from = moment('2018-01-01').startOf('day').toDate()
const to = moment('2018-12-31').endOf('day').toDate()

function displayStats () {
  $.getJSON('https://untitled-y13mrm2i2lqe.runkit.sh/', function (data) {
    const total = data.total
    const success = data.success
    const failures = total - success

    const percentage = Math.round(success * 100 / total)
    percentageElt.text(`${percentage}%`)
    explanationElt.text(`95% is the percentage to strive for.  Out of ${total} exports, ${failures} failed.`)
    if (percentage >= threshold) {
      percentageElt.css('color', 'green')
    } else {
      percentageElt.css('color', 'red')
    }
  })
}

let paddingObj = {}
let finalArr = []

function displayHeatmap () {
  $.getJSON('chartData.json')
  .done(function (data) {
    // intermediate data structures for sorting and replacing ...
    let dataObj = {}

    // initialize the chartData with 'neutral' data, i.e. neither green nor red, just '0'
    Array.from(d3.timeDays(from, to), (item) => { paddingObj[moment(item).endOf('day').unix()] = 0 })
    Array.from(data, (item) => { dataObj[moment(item.date).endOf('day').unix()] = item.count })

    const finalObj = Object.assign(paddingObj, dataObj)
    _.forEach(finalObj, (value, key) => finalArr.push({date: key, count: value}))
    finalArr = _.sortBy(finalArr, 'date')
    finalArr = _.forEach(finalArr, (item) => {
      item.date = moment.unix(item.date).toDate()
    })

    const heatmap = calendarHeatmap()
      .data(finalArr)
      .selector('#heatmap')
      .startDate(from)
      .endDate(to)
      .tooltipEnabled(true)
      .legendEnabled(false)
      .onClick(function (data) {
        console.log('data', data)
      })
    heatmap() // render the chart
  })
  .fail(function (jqxhr, textStatus, error) {
    Array.from(d3.timeDays(from, to), (item) => { paddingObj[moment(item).endOf('day')] = -1 })
    _.forEach(paddingObj, (value, key) => finalArr.push({date: key, count: value}))
    const heatmap = calendarHeatmap()
      .data(finalArr)
      .selector('#heatmap')
      .startDate(from)
      .endDate(to)
      .tooltipEnabled(true)
      .legendEnabled(false)
      .onClick(function (data) {
        console.log('data', data)
      })
    heatmap() // render the chart
  })
}

$(document).ready(function () {
  displayHeatmap()
  displayStats()
})
