/* global $ */
const threshold = 95
const percentageElt = $('#export-percentage')
const explanationElt = $('#export-explanation')

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

displayStats()
