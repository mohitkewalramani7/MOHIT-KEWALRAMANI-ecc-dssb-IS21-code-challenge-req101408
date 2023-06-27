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
  const missingFieldsResult = areFieldsMissing(newData)
  if (missingFieldsResult) {
    res.statusCode = 406
    res.send({ 'error': `${missingFieldsResult} field is required` })
    return
  }
  newData.productId = 'N' + String(Date.now())
  mock_data.push(req.body)
  res.statusCode = 201
  res.send({ 'response': 'Created!', ...newData })
})

function areFieldsMissing(inputPayload) {
  if ('productName' in inputPayload === false ||
    !inputPayload.productName ||
    inputPayload.productName === '') {
    return 'productName'
  } else if (
    'productOwnerName' in inputPayload === false ||
    !inputPayload.productOwnerName ||
    inputPayload.productOwnerName === '') return 'productOwnerName'
  else if (
    'scrumMasterName' in inputPayload === false ||
    !inputPayload.scrumMasterName ||
    inputPayload.scrumMasterName === '') return 'scrumMasterName'
  else if (
    'Developers' in inputPayload === false ||
    !inputPayload.Developers ||
    inputPayload.Developers[0] === '' ||
    inputPayload.Developers.length === 0) return 'Developers'
  else if (
    'startDate' in inputPayload === false ||
    !inputPayload.startDate ||
    inputPayload.startDate === '') return 'startDate'
  else if (
    'methodology' in inputPayload === false ||
    !inputPayload.methodology ||
    inputPayload.methodology === '') return 'methodology'
  else if ('location' in inputPayload === false ||
    !inputPayload.location ||
    inputPayload.location === '') return 'location'
  return false
}

/**
 * PUT request
 * Updates a product stored in memory
 * 
 * @returns {406, 404, 200}
 */
app.put('/api/updateProduct', (req, res) => {
  const updatedData = req.body
  if ('productId' in updatedData === false || !updatedData.productId || updatedData.productId === '') {
    res.statusCode = 406
    res.send({ 'error': 'Product id is required' })
    return
  }
  const fieldsMissingCheck = areFieldsMissing(updatedData)
  if (fieldsMissingCheck) {
    res.statusCode = 406
    res.send({ 'error': `${fieldsMissingCheck} is required` })
    return
  }
  const productId = updatedData.productId
  let productFound = false
  mock_data.map(productRecord => {
    if (productRecord.productId === productId) {
      productRecord.productName = updatedData.productName
      productRecord.productOwnerName = updatedData.productOwnerName
      productRecord.Developers = updatedData.Developers
      productRecord.scrumMasterName = updatedData.scrumMasterName
      productRecord.startDate = updatedData.startDate
      productRecord.methodology = updatedData.methodology
      productRecord.location = updatedData.location
      res.send({ 'response': 'Product successfully updated' })
      productFound = true
      return
    }
  })
  if (!productFound) {
    res.statusCode = 404
    res.send({ 'error': `Could not find product with Id: ${productId}` })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
