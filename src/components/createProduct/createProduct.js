import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import styles from './createProduct.module.css'

import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function CreateProduct(props) {

  const productToUpdate = props.productToUpdate

  const [productName, setProductName] = useState(productToUpdate?.productName)
  const [productOwnerName, setProductOwnerName] = useState(productToUpdate?.productOwnerName)
  const [scrumMasterName, sestScrumMasterName] = useState(productToUpdate?.scrumMasterName)
  const [developersList, setDevelopersList] = useState([])
  const [productMethodology, setProductMethodology] = useState((productToUpdate?.methodology) ? productToUpdate?.methodology : 'Agile')
  const [startDate, setStartDate] = useState((productToUpdate?.startDate) ? dayjs(productToUpdate?.startDate) : dayjs(new Date().toISOString().split('T')[0]))
  const [link, setLink] = useState(productToUpdate?.location)

  const developerNames = ['Mohit Kewalramani', 'John Doe', 'Jane Doe', 'Roger Po', 'Robert Al']

  const [progress, setProgress] = useState(false)
  const [formError, setFormError] = useState(false)
  const [errorText, setErrorText] = useState('')

  async function performServerChange() {
    setProgress(true)
    if (!productName || productName === '') {
      setFormError(true)
      setErrorText('Please fill out the product name')
      setProgress(false)
      return
    }

    if (props.isEdit) {
      let r = await updateProduct()
      console.log(r)
    }
    else {
      await createProduct()
    }
    setProgress(false)
  }

  async function updateProduct() {
    let response = await sendUpdateProductRequest()
    console.log(response)
    if (response.responseCode === 200) {
      setErrorText(false)
      props.successfulCreate()
    }
    else {
      setErrorText('Servers are down, please try again later')
    }
  }

  async function sendUpdateProductRequest() {
    const putBody = returnAPIPayload()
    putBody.productId = productToUpdate.productId
    const response = await fetch('http://localhost:3000/api/updateProduct', {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putBody),
    });
    return {
      'responseCode': response.status,
      'responseMessage': response.statusText
    }
  }

  function returnAPIPayload() {
    return {
      'productName': productName,
      'productOwnerName': productOwnerName,
      'Developers': developersList,
      'scrumMasterName': scrumMasterName,
      "startDate": startDate,
      "methodology": productMethodology,
      "location": link
    }
  }

  async function createProduct() {
    let response = await sendCreateProductRequest()
    if (response.responseCode === 201) {
      setErrorText(false)
      props.successfulCreate()
    }
    else {
      setErrorText('Servers are down, please try again later')
    }
  }

  async function sendCreateProductRequest() {
    const response = await fetch('http://localhost:3000/api/createProduct', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(returnAPIPayload()),
    });
    return {
      'responseCode': response.status,
      'responseMessage': response.statusText
    }
  }

  function handleDeveloperSelect(e) {
    let developerName = e.target.value
    if (developerName) {
      const index = developersList.indexOf(developerName);
      if (developersList.indexOf(developerName) > -1) {
        developersList.splice(index)
      }
      else {
        setDevelopersList(developersList.push(developerName))
      }
    }
  }

  function handleDateSelect(newDateValue) {
    function addLeadingZero(val) {
      if (val < 10) {
        return '0' + String(val)
      }
      return String(val)
    }

    let year = newDateValue.$y
    let month = newDateValue.$M + 1
    let day = newDateValue.$D
    const dateValue = year + '-' + addLeadingZero(month) + '-' + addLeadingZero(day)
    setStartDate(dateValue)
  }

  return (
    <div className={styles.createProductForm}>
      <p className={styles.formHeading}>
        {props.isEdit ? 'Edit Product' : 'Add a Product'}
      </p>
      <TextField
        error={formError}
        required
        label="Product Name"
        variant="outlined"
        value={productName}
        onChange={(event) => setProductName(event.target.value)} />
      <div className={styles.spaceDiv} />
      <TextField
        label="Product Owner Name"
        variant="outlined"
        value={productOwnerName}
        onChange={(event) => setProductOwnerName(event.target.value)} />
      <div className={styles.spaceDiv} />
      <TextField
        label="Scrum Master Name"
        variant="outlined"
        value={scrumMasterName}
        onChange={(event) => sestScrumMasterName(event.target.value)} />
      <div className={styles.spaceDiv} />
      <p className={styles.formText}>Developers</p>
      {/* <FormGroup>
        {developerNames.map(d => <FormControlLabel
          label={d}
          value={d}
          onClick={handleDeveloperSelect}
          control={<Checkbox />} />
        )}
      </FormGroup> */}
      <div className={styles.spaceDiv} />
      <div className={styles.spaceDiv} />
      <FormControl>
        <InputLabel id="demo-simple-select-label">Methodology</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={productMethodology}
          label="Methodology"
          onChange={(event) => setProductMethodology(event.target.value)}
        >
          <MenuItem value={'Agile'}>Agile</MenuItem>
          <MenuItem value={'Waterfall'}>Waterfall</MenuItem>
        </Select>
      </FormControl>
      <div className={styles.spaceDiv} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => handleDateSelect(newValue)} />
      </LocalizationProvider>
      <div className={styles.spaceDiv} />
      <TextField label="Link" variant="outlined" value={link} onChange={(event) => setLink(event.target.value)} />
      <div className={styles.spaceDiv} />
      {progress ? <CircularProgress className={styles.submittingSpinner} /> : null}
      <div className={styles.buttonGroup}>
        <div
          className={styles.cancelButtonLink}
          onClick={() => { props.cancelClick() }}>
            Cancel
        </div>
        <div className={styles.buttonLink} onClick={performServerChange}>
          {props.isEdit ? 'Update' : 'Create'}
        </div>
      </div>
      <Snackbar open={errorText !== ''} autoHideDuration={3000}>
        <Alert severity="error">{errorText}</Alert>
      </Snackbar>
    </div>
  )
}
