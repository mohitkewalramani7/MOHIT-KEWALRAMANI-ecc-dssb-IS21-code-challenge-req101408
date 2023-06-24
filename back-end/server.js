const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const mock_data = require('./data.json')
var corsOptions = {
  origin: 'http://localhost:3001'
}

app.get('/api/check', cors(corsOptions), (req, res) => {
  res.send('Working Well!')
})

app.get('/api/products', cors(corsOptions), (req, res) => {
  res.send(mock_data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
