/** Component that allows a user to create or
 * update a Product
*/

// React imports and dependent libraries
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// Material UI front-end component
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'

// Material UI data-grid component
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

// Material UI Icons
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Internal project file imports
import { apiUrl } from '@/commons'
import styles from './createProduct.module.css'

export default function CreateProduct(props) {

  // Constant that represents the maximum number of developers
  // we can add
  const MAX_NUMBER_OF_DEVELOPERS = 5

  // Details on the product to update (if applicable)
  const productToUpdate = props.productToUpdate

  // Fields of the form
  const [productName, setProductName] = useState(productToUpdate?.productName)
  const [productOwnerName, setProductOwnerName] = useState(productToUpdate?.productOwnerName)
  const [scrumMasterName, sestScrumMasterName] = useState(productToUpdate?.scrumMasterName)
  const [developersList, setDevelopersList] = useState(productToUpdate?.Developers ? productToUpdate?.Developers : [''])
  const [productMethodology, setProductMethodology] = useState((productToUpdate?.methodology) ? productToUpdate?.methodology : 'Agile')
  const [startDate, setStartDate] = useState((productToUpdate?.startDate) ? dayjs(productToUpdate?.startDate) : dayjs(new Date().toISOString().split('T')[0]))
  const [link, setLink] = useState(productToUpdate?.location)

  // Whether or not to show the progress bar
  const [progress, setProgress] = useState(false)
  const [formError, setFormError] = useState(false)
  // The error text to show feedback to the user for
  const [errorText, setErrorText] = useState('')

  /**
   * Closes the error feedback snackbar after 3 seconds
   */
  useEffect(() => {
    if (errorText !== '') {
      setTimeout(() => setErrorText(''), 3000);
    }
  }, [errorText])

  /**
   * Method that is called when we click to either save or
   * create a new product. It is then routed to a POST or PUT
   * request
   * 
   * @return {}
   */
  async function performServerChange() {
    setProgress(true)
    if (!validateForm()) {
      setErrorText('Please fill out all required fields')
      setFormError(true)
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

  /**
   * Validates whether all required fields are filled in
   * 
   * @return {boolean}
   */
  function validateForm() {
    if (!productName ||
      productName === '' ||
      !productOwnerName ||
      productOwnerName === '' ||
      !scrumMasterName ||
      scrumMasterName === '' ||
      developersList.length === 0 ||
      developersList[0] === '' ||
      !link ||
      link === ''
    ) {
      return false
    }
    return true
  }

  /**
   * Method used to perform a product update
   * 
   * @return {}
   */
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

  /**
   * Helper method used to perform product update
   * 
   * @return {object} - The contents of the API response
   */
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

  /**
   * Helper method to construct payload to send to the API
   * 
   * @return {object} - JSON formatted object of form details
   */
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

  /**
   * Method used to perform a product create
   * 
   * @return {}
   */
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

  /**
   * Helper method used to perform product create
   * 
   * @return {object} - The contents of the API response
   */
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

  /**
   * Method used to update developers in the developers list
   * when we dynamically add them onto the form
   * 
   * @param {integer} index - The index of the array we are modifying 
   * @param {string} newValue - The new developer's name
   */
  function handleDeveloperUpdate(index, newValue) {
    const newDevs = [...developersList]
    newDevs[index] = newValue
    setDevelopersList(newDevs)
  }

  /**
   * Callback method used when adding a developer to
   * the developers list
   * 
   * @return {}
   */
  function handleDeveloperAdd() {
    if (developersList.length < MAX_NUMBER_OF_DEVELOPERS) {
      const newDevs = [...developersList]
      newDevs.push('')
      setDevelopersList(newDevs)
    }
  }

  /**
   * Callback method used when deleting a developer from
   * the developers list
   * 
   * @param {integer} index - The index of the array we
   * are deleting
   * 
   * @return {}
   */
  function handleDeveloperDelete(index) {
    const newDevs = [...developersList]
    newDevs.splice(index, 1)
    setDevelopersList(newDevs)
  }

  /**
   * Callback method we use to update the new date value
   * for the product start date
   * 
   * @param {object} newDateValue - Object containing details 
   * of the date selected
   * 
   * @return {}
   */
  function handleDateSelect(newDateValue) {
    /**
     * Helper method to add a leading 0 to our month
     * and date fields, to format the date in YYYY-MM-DD
     * format
     * 
     * @param {int} val - The integer value of the date or
     * month field
     * 
     * @return {string} - A string value of the date or month with
     * a leading 0 if necessary
     */
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
        error={formError && (!productName || productName?.length === 0)}
        required
        label="Product Name"
        variant="outlined"
        value={productName}
        onChange={(event) => setProductName(event.target.value)} />
      <div className={styles.spaceDiv} />
      <TextField
        error={formError && (!productOwnerName || productOwnerName?.length === 0)}
        required
        label="Product Owner Name"
        variant="outlined"
        value={productOwnerName}
        onChange={(event) => setProductOwnerName(event.target.value)} />
      <div className={styles.spaceDiv} />
      <TextField
        error={formError && (!scrumMasterName || scrumMasterName?.length === 0)}
        required
        label="Scrum Master Name"
        variant="outlined"
        value={scrumMasterName}
        onChange={(event) => sestScrumMasterName(event.target.value)} />
      <div className={styles.spaceDiv} />
      <p className={styles.formText}>Developers</p>
      {developersList.map((dev, index) => (
        <div key={index} className={styles.developerRow}>
          <TextField
            error={index === 0 && formError && developersList[0]?.length === 0}
            required={index === 0}
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
      <TextField
        error={formError && (!link || link?.length === 0)}
        required
        label="Link"
        variant="outlined"
        value={link} onChange={(event) => setLink(event.target.value)} />
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
