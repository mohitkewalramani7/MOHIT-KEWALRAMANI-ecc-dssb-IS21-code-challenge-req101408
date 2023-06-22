const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const mock_data = require('./data.json')
var corsOptions = {
  origin: 'http://localhost:3001'
}

app.get('/', cors(corsOptions), (req, res) => {
  res.send(mock_data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
