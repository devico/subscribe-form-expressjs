const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const qs = require('querystring')
const validate = require('./public/common/validation')

const app = express()

const public = './public'
app.use('/', express.static(path.join(__dirname, public)))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/subscribe', (req, res) => {
  let username = req.body.username
  let email = req.body.email
  let valid = validate({username, email})
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (valid) {
    res.end(JSON.stringify({ 'status': 'subscribed' }))
  } else {
    res.end(JSON.stringify({ 'status': 'did not subscribe' }))
  }
})

app.listen(8000, () => {
  console.log('server start on port 8000')
})