/* global $ _ d3 calendarHeatmap moment */
const threshold = 95
const explanationElt = $('#export-alltime-explanation')

function displayStats () {
  $.getJSON('https://untitled-ithfprzbpej6.runkit.sh/', function (data) {
    Object.keys(data).forEach(function (key) {
      const total = data[key].currentYearTotal
      const success = data[key].success
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
  })
}

function displayMeme () {
  $.getJSON('https://api-endpoint-for-export-stats-uij8p2objuah.runkit.sh/meme-generator')
    .done(function (data) {
      $('#meme').attr('src', data.url)
    })
}

let paddingObj = {}
let finalArr = []

function displayHeatmap () {
  $.getJSON(`https://untitled-uij8p2objuah.runkit.sh/docs-for-heatmap?cachebuster=${moment().unix()}`)
    .done(function (dataByYear) {
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
        _.forEach(finalObj, (value, key) => finalArr.push({date: key, count: value}))
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
    })
    // if the API doesn't return data, or not in time, display a dummy one
    .fail(function (jqxhr, textStatus, error) {
      const year = moment().year()
      const from = moment(`${year}-01-01`).startOf('day').toDate()
      const to = moment(`${year}-12-31`).endOf('day').toDate()

      console.log(`Error retrieving documents for heatmap: ${error}.`)
      Array.from(d3.timeDays(from, to), (item) => { paddingObj[moment(item).endOf('day')] = -1 })
      _.forEach(paddingObj, (value, key) => finalArr.push({date: key, count: value}))
      const heatmap = calendarHeatmap(year)
        .data(finalArr)
        .selector(`#heatmap${year}`)
        .startDate(from)
        .endDate(to)
        .tooltipEnabled(true)
        .legendEnabled(false)
        .onClick(function (data) {
          console.log('data', data)
        })
      heatmap() // render the chart
    })
    .always(function(data, textStatus) {
      if (textStatus === 'success') {
        // now we know that we can use the data object
        const years = Object.keys(data)
        const rules = years.map((y) => `#tab${y}:checked ~ .tabContent #heatmap${y}`)
        injectStyles(`${rules.join(', ')} { display: block;}`)
        console.log(`injecting style rules`)
      } else {
        // no data object as request was not successful
        // but we still need to create and activate tab
        const year = moment().year()
        injectStyles(`#tab${year}:checked ~ .tabContent #heatmap${year} { diplay: block;}`)
        console.log('request failed, still displaying correctly what we can ...')
      }
    })
}

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");    
}

$(document).ready(function () {
  displayStats()
  displayHeatmap()
  displayMeme()
})
