/* global $ */
const threshold = 95
const elt = $('#export-percentage')

function displayStats () {
  $.getJSON('https://untitled-y13mrm2i2lqe.runkit.sh/', function (data) {
    const percentage = Math.round(data.success * 100 / data.total)
    elt.text(`${percentage}%`)
    if (percentage >= threshold) {
      elt.css('color', 'green')
    } else {
      elt.css('color', 'red')
    }
  })
}

displayStats()
