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
  if ('productName' in newData === false) {
    res.statusCode = 406
    res.send({'error': 'Product name is required'})
    return
  }
  newData.productId = 'N' + Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
  mock_data.push(req.body)
  res.statusCode = 201
  res.send({'response': 'Created!', ...newData})
})

app.put('/api/updateProduct', (req, res) => {
  const updatedData = req.body
  if ('productId' in updatedData === false) {
    res.statusCode = 406
    res.send({'error': 'Product id is required'})
  }
  if ('productName' in updatedData === false) {
    res.statusCode = 406
    res.send({'error': 'Product name is required'})
  }
  const productId = updatedData.productId
  mock_data.map(productRecord => {
    if (productRecord.productId === productId) {
      productRecord.productName = updatedData.productName
      productRecord.productOwnerName = updatedData.productOwnerName
      productRecord.Developers = updatedData.Developers
      productRecord.scrumMasterName = updatedData.scrumMasterName
      productRecord.startDate = updatedData.startDate
      productRecord.methodology = updatedData.methodology
      productRecord.location = updatedData.location
      res.send({'response': 'Product successfully updated'})
    }
  })
  res.statusCode = 404
  res.send({'error': `Could not find product with Id: ${productId}`})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
