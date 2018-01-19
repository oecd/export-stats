'use strict'

module.exports.nudger = (event, context, callback) => {
  require('dotenv').config()
  const request = require('request')
  const slackWebhook = process.env.SLACK_WEBHOOK
  const slackOptions = {
    'text': 'Bonjour ! Les derniers exports, étaient-ils OK ?',
    'attachments': [
      {
        'text': 'Choisis le bouton correspondant',
        'fallback': 'Désolé, tu ne peux pas donner ton avis !',
        'callback_id': 'exportSuccessful',
        'color': '#3AA3E3',
        'attachment_type': 'default',
        'actions': [
          {
            'name': 'export',
            'text': 'Oui ! :+1:',
            'type': 'button',
            'style': 'primary',
            'value': true
          },
          {
            'name': 'export',
            'text': 'Non ! :disappointed:',
            'type': 'button',
            'style': 'danger',
            'value': false
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
