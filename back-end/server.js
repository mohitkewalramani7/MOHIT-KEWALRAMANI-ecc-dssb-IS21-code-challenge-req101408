const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const mock_data = require('./data.json')

app.use(cors())
app.use(express.json()) // for parsing application/json

app.get('/api/check', (req, res) => {
  res.send('Working Well!')
})

app.get('/api/products', (req, res) => {
  res.send(mock_data)
})

app.post('/api/createProduct', (req, res) => {
  const newData = req.body
  newData.productId = 'N' + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
  mock_data.push(req.body)
  res.statusCode = 201
  res.send({'response': 'Created!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
