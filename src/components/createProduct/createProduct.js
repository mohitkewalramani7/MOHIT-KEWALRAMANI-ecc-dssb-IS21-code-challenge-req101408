import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { apiUrl } from '@/commons'
import styles from './createProduct.module.css'

import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function CreateProduct(props) {

  const MAX_NUMBER_OF_DEVELOPERS = 5

  const productToUpdate = props.productToUpdate

  const [productName, setProductName] = useState(productToUpdate?.productName)
  const [productOwnerName, setProductOwnerName] = useState(productToUpdate?.productOwnerName)
  const [scrumMasterName, sestScrumMasterName] = useState(productToUpdate?.scrumMasterName)
  const [developersList, setDevelopersList] = useState(productToUpdate?.Developers ? productToUpdate?.Developers : [''])
  const [productMethodology, setProductMethodology] = useState((productToUpdate?.methodology) ? productToUpdate?.methodology : 'Agile')
  const [startDate, setStartDate] = useState((productToUpdate?.startDate) ? dayjs(productToUpdate?.startDate) : dayjs(new Date().toISOString().split('T')[0]))
  const [link, setLink] = useState(productToUpdate?.location)

  const [progress, setProgress] = useState(false)
  const [formError, setFormError] = useState(false)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (errorText !== '') {
      setTimeout(() => setErrorText(''), 3000);
    }
  }, [errorText])

  async function performServerChange() {
    setProgress(true)
    if (!productName || productName === '') {
      setFormError(true)
      setErrorText('Please fill out the product name')
      setProgress(false)
      return
    }

    if (props.isEdit) {
      await updateProduct()
    }
    else {
      await createProduct()
    }
    setProgress(false)
  }

  async function updateProduct() {
    let response
    try {
      response = await sendUpdateProductRequest()
    } catch (e) {
      setErrorText('Can\'t reach the server, please try again later')
    }
    if (response?.responseCode === 200) {
      setErrorText(false)
      props.successfulCreate()
    }
    else {
      setErrorText(response?.responseMessage?.error)
    }
  }

  async function sendUpdateProductRequest() {
    const putBody = returnAPIPayload()
    putBody.productId = productToUpdate.productId
    const response = await fetch(`${apiUrl}/updateProduct`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putBody),
    });
    const responseBodyJson = await response.json()
    return {
      'responseCode': response.status,
      'responseMessage': responseBodyJson
    }
  }

  function returnAPIPayload() {
    return {
      'productName': productName,
      'productOwnerName': productOwnerName,
      'Developers': developersList.filter(d => d !== ''),
      'scrumMasterName': scrumMasterName,
      "startDate": startDate,
      "methodology": productMethodology,
      "location": link
    }
  }

  async function createProduct() {
    let response
    try {
      response = await sendCreateProductRequest()
    } catch (e) {
      setErrorText('Can\'t reach the server, please try again later')
    }
    if (response?.responseCode === 201) {
      setErrorText(false)
      props.successfulCreate()
    }
    else {
      setErrorText(response?.responseMessage?.error)
    }
  }

  async function sendCreateProductRequest() {
    const response = await fetch(`${apiUrl}/createProduct`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(returnAPIPayload()),
    });
    const responseBodyJson = await response.json()
    return {
      'responseCode': response.status,
      'responseMessage': responseBodyJson
    }
  }

  function handleDeveloperUpdate(index, newValue) {
    const newDevs = [...developersList]
    newDevs[index] = newValue
    setDevelopersList(newDevs)
  }

  function handleDeveloperAdd() {
    if (developersList.length < MAX_NUMBER_OF_DEVELOPERS) {
      const newDevs = [...developersList]
      newDevs.push('')
      setDevelopersList(newDevs)
    }
  }

  function handleDeveloperDelete(index) {
    const newDevs = [...developersList]
    newDevs.splice(index, 1)
    setDevelopersList(newDevs)
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
    setStartDate(dayjs(dateValue))
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
      {developersList.map((dev, index) => (
        <div key={index} className={styles.developerRow}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleRoundedIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            label={`Developer ` + (index + 1)}
            variant="outlined"
            value={developersList[index]}
            onChange={(e) => handleDeveloperUpdate(index, e.target.value)}/>
          {index !== 0 ? <DeleteOutlineIcon onClick={() => handleDeveloperDelete(index)} /> : null}
        </div>
      ))}
      <div className={styles.spaceDiv} />
      {developersList.length < MAX_NUMBER_OF_DEVELOPERS ? <div className={styles.buttonLink} onClick={handleDeveloperAdd}>
          Add Developer (up to {MAX_NUMBER_OF_DEVELOPERS})
      </div> : null}
      <div className={styles.spaceDiv} />
      <div className={styles.spaceDiv} />
      <FormControl>
        <InputLabel>Methodology</InputLabel>
        <Select
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
