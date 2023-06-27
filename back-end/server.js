/**
 * API Component for our back-end
*/

const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

// Mock data that is formatted by using sample data
// as well as URLs from the gov.bc Github page
const mock_data = require('./data.json')

app.use(cors())
app.use(express.json()) // for parsing application/json

/**
 * GET request
 * A health check for the API
 * 
 * @returns {200}
 */
app.get('/api/check', (req, res) => {
  res.send('Working Well!')
})

/**
 * GET request
 * Returns all products stored in memory
 * 
 * @returns {200}
 */
app.get('/api/products', (req, res) => {
  res.send(mock_data)
})

/**
 * POST request
 * Creates a product to be stored in memory
 * 
 * @returns {406, 201}
 */
app.post('/api/createProduct', (req, res) => {
  const newData = req.body
  if ('productName' in newData === false) {
    res.statusCode = 406
    res.send({'error': 'Product name is required'})
    return
  }
  newData.productId = 'N' + String(Date.now())
  mock_data.push(req.body)
  res.statusCode = 201
  res.send({'response': 'Created!', ...newData})
})

/**
 * PUT request
 * Updates a product stored in memory
 * 
 * @returns {406, 404, 200}
 */
app.put('/api/updateProduct', (req, res) => {
  const updatedData = req.body
  if ('productId' in updatedData === false) {
    res.statusCode = 406
    res.send({'error': 'Product id is required'})
    return
  }
  if ('productName' in updatedData === false) {
    res.statusCode = 406
    res.send({'error': 'Product name is required'})
    return
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
      return
    }
  })
  res.statusCode = 404
  res.send({'error': `Could not find product with Id: ${productId}`})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
