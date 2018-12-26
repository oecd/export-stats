'use strict'

module.exports.nudger = (event, context, callback) => {
  require('dotenv').config()
  const request = require('request')
  const moment = require('moment')()
  let dateString
  let formattedDate

  if (moment.day() <= 1 || moment.day() > 5) {
    const friday = moment.day(-2) // -2 === Friday
    formattedDate = friday.format('YYYYMMDD')
    dateString = friday.format('dddd')
  } else {
    const yesterday = moment.subtract(1, 'days') // yesterday
    dateString = 'yesterday'
    formattedDate = yesterday.format('YYYYMMDD') // yesterday's date
  }
  
  const slackWebhook = process.env.SLACK_WEBHOOK
  const slackOptions = {
    'text': `Hello there :wave:! Did ${dateString}'s export go OK? If you're unsure, <https://pacps01.oecd.org/Dissemination|check here>.`,
    'attachments': [
      {
        'text': 'Please click the corresponding button:',
        'fallback': 'Sorry, you can\'t give any feedback!',
        'callback_id': 'exportSuccessful',
        'color': '#3AA3E3',
        'attachment_type': 'default',
        'actions': [
          {
            'name': 'export',
            'value': `${formattedDate}-ok`,
            'text': 'Yes! :+1:',
            'type': 'button',
            'style': 'primary'
          },
          {
            'name': 'export',
            'value': `${formattedDate}-ko`,
            'text': 'No! :disappointed:',
            'type': 'button',
            'style': 'danger'
          }
        ]
      }
    ]
  }

  request({
    'method': 'POST',
    'uri': slackWebhook,
    'json': slackOptions
  }, (err, resp) => {
    if (err) console.log(`Slack Error: ${JSON.stringify(err)}`)
    else console.log(`Slack Success: ${JSON.stringify(resp.body)}.`)
  })
  callback()
}
