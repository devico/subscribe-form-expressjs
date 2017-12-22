const express = require('express')
const path = require('path')
const app = express()
const qs = require('querystring')
const validate = require('./public/common/validation')

const public = './public'

app.use('/', express.static(path.join(__dirname, public)))

app.post('/subscribe', function(req, res) {
  let body = ''
  req.on('data', function(chunk) {
    body += chunk
  })
  req.on('end', function () {
    let data = qs.parse(body)
    let username = data.username
    let email = data.email
    let valid = validate({username, email})
    res.writeHead(200, {'Content-Type': 'application/json'})
    if (valid) {
      res.end(JSON.stringify({ 'status': 'subscribed' }))
    } else {
      res.end(JSON.stringify({ 'status': 'did not subscribe' }))
    }
  })
})

app.listen(8000, function() {
  console.log('server start on port 8000')
})