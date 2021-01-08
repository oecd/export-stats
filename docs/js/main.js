/* global $ _ d3 calendarHeatmap moment */
const threshold = 95
const explanationElt = $('#export-alltime-explanation')
const apiBase = 'https://slack-export-updater.jfix1.repl.co'

function displayStats(data) {
  Object.keys(data).forEach(function (key) {
    let total, success

    switch (key) {
      case 'alltime':
        total = data.alltime.currentYearTotal
        success = data.alltime.success
        break
      default:
        total = data[key].total
        success = data[key].overallSuccess
        break
    }
    const failures = total - success
    const percentageElt = $(`#export-${key}-percentage`)
    const percentage = Math.round(success * 100 / total)
    percentageElt.text(`${percentage}%`)
    if (key === 'alltime') {
      explanationElt.text(`Our goal is 95%.  Out of ${total} exports this year, ${failures} failed.`)
    }
    if (percentage >= threshold) {
      percentageElt.css('color', 'green')
    } else if (threshold - percentage <= 4) {
      percentageElt.css('color', 'orange')
    } else {
      percentageElt.css('color', 'red')
    }
  })
}

function displayMeme(data) {
  $('#meme').attr('src', data.url)
}

let paddingObj = {}
let finalArr = []

function displayHeatmap(dataByYear) {
  // console.log(`HEATMAP: ${JSON.stringify(dataByYear)}`)
  // data is an Object with year for key and array of export events as value
  // intermediate data structures for sorting and replacing ...
  let dataObj = {}
  for (const year in dataByYear) {
    data = dataByYear[year]

    $('#heatmaps').prepend(`<input type="radio" id="tab${year}" name="tabs" checked/><label for="tab${year}">${year}</label>`)
    $('.tabContent').append(`<div id='heatmap${year}'></div>`)

    const from = moment(`${year}-01-01`).startOf('day').toDate()
    const to = moment(`${year}-12-31`).endOf('day').toDate()

    // initialize the chartData with 'neutral' data, i.e. neither green nor red, just '0'
    Array.from(d3.timeDays(from, to), (item) => { paddingObj[moment(item).endOf('day').unix()] = 0 })
    Array.from(data, (item) => { dataObj[moment(item.date).endOf('day').unix()] = item.count })

    const finalObj = Object.assign(paddingObj, dataObj)
    _.forEach(finalObj, (value, key) => finalArr.push({ date: key, count: value }))
    finalArr = _.sortBy(finalArr, 'date')
    finalArr = _.forEach(finalArr, (item) => {
      item.date = moment.unix(item.date).toDate()
    })

    const heatmap = calendarHeatmap(year)
      .data(finalArr)
      .selector(`#heatmap${year}`)
      .startDate(from)
      .endDate(to)
      .tooltipEnabled(true)
      .legendEnabled(false)
      .onClick((data) => {
        console.log('data', data)
      })
    heatmap() // render the chart
  }
  const years = Object.keys(dataByYear)
  const rules = years.map((y) => `#tab${y}:checked ~ .tabContent #heatmap${y}`)
  injectStyles(`${rules.join(', ')} { display: block;}`)
}

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
}

$(document).ready(function () {
  $.getJSON(`${apiBase}/aio?cachebuster=${moment().unix()}`)
    .done(function (data) {
      displayStats(data.stats)
      displayHeatmap(data.heatmap)
      displayMeme(data.meme)
    })
    .fail(function () {
      // TODO: display some dummy excuse
    })
})
