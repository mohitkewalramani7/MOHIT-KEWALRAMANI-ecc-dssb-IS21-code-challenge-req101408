const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const mock_data = require('./data.json')
var corsOptions = {
  origin: 'http://localhost:3001'
}

app.use(cors())
app.use(express.json()) // for parsing application/json

app.get('/api/check', (req, res) => {
  res.send('Working Well!')
})

app.get('/api/products', (req, res) => {
  res.send(mock_data)
})

app.post('/api/createProduct', (req, res) => {
  console.log(req.body)
  res.statusCode = 201
  res.send({'response': 'Created!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
