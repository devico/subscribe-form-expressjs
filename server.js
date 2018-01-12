const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')
const validate = require('./public/common/validation')
const waitInterval = 100000

const app = express()

setInterval((db) => {
  saveToDB(db)
}, waitInterval)

let db

fs.readFile('db.json', 'utf-8', (err, data) => {
  if (err) {
    throw err
  } else {
    db = JSON.parse(data)
  }
})

app.use('/', express.static(path.join(__dirname, './public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/users', (req, res, next) => {
  let html = "<h3>Подписчики</h3><ol>"
  for (let user of db.users) {
    html = html + "<li>" + user.username + " - " + user.email + "</li>"
  }
  html += "</ol>"
  res.send(html)
})

app.post('/subscribe', (req, res) => {
  let username = req.body.username
  let email = req.body.email
  let valid = validate({username, email})
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (valid) {
    db.users.push({username: req.body.username, email: req.body.email, status: 'subscribed'})
    res.end(JSON.stringify({ 'status': 'subscribed' }))
  } else {
    res.end(JSON.stringify({ 'status': 'did not subscribe' }))
  }
})

function exitHandler(options, err) {
  if (err) console.log(err.stack)
  if (options.exit) {
    saveToDB(db)
    process.exit()
  }
}

process.on('exit', exitHandler.bind(null, {exit: true}))
process.on('SIGINT', exitHandler.bind(null, {exit: true}))

function saveToDB(data) {
  let json = JSON.stringify(data, null, 2)
  fs.writeFile('db.json', json, (err) => {
    if (err) throw err
  })
}

app.listen(8000, () => {
  console.log('server start on port 8000')
})