const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')
const validate = require('./public/common/validation')
const db = require('./db.json')

const app = express()

app.use('/', express.static(path.join(__dirname, './public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/users', (req, res, next) => {
  let users = "<h3>Подписчики</h3><ol>"
  for (let user of db['users']) {
    users = users + "<li>" + user.username + " - " + user.email + "</li>"
  }
  users += "</ol>"
  res.send(users)
})

app.post('/subscribe', (req, res) => {
  let username = req.body.username
  let email = req.body.email
  let valid = validate({username, email})
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (valid) {
    console.log('start')
    fs.readFile('db.json', 'utf-8', (err, data) => {
      if (err) {
        throw err
      } else {
        let obj = JSON.parse(data)
        let users = obj.users
        obj.users.push({username: req.body.username, email: req.body.email, status: 'subscribed'})
        let json = JSON.stringify(obj, null, 2)
        fs.writeFile('db.json', json, (err) => {
          if (err) throw err
          console.log('complete')
        })
      }
    })
    res.end(JSON.stringify({ 'status': 'subscribed' }))
  } else {
    res.end(JSON.stringify({ 'status': 'did not subscribe' }))
  }
})

app.listen(8000, () => {
  console.log('server start on port 8000')
})