import { useEffect, useState } from 'react'
import styles from './createProduct.module.css'

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function CreateProduct(props) {

  const [productName, setProductName] = useState('')
  const [productOwnerName, setProductOwnerName] = useState('')
  const [scrumMasterName, sestScrumMasterName] = useState('')
  const [develoeprsList, setDevelopersList] = useState([])
  const [productMethodology, setProductMethodology] = useState('Agile')
  const [startDate, setStartDate] = useState('')
  const [link, setLink] = useState('')

  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(false)

  async function createProduct() {
    setCreating(true)
    let response = await sendCreateProductRequest()
    console.log(response)
    setCreating(false)
    if (response.responseCode === 201) {
      setError(false)
      props.successfulCreate()
    }
    else {
      setError(true)
    }
  }

  async function sendCreateProductRequest() {
    const response = await fetch('http://localhost:3000/api/createProduct', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'productName': productName,
        'productOwnerName': productOwnerName,
        'Developers': develoeprsList,
        'scrumMasterName': scrumMasterName,
        "startDate": startDate,
        "methodology": productMethodology,
        "location": link
      }),
    });
    return {
      'responseCode': response.status,
      'responseMessage': response.statusText
    }
  }

  return (
    <div className={styles.createProductForm}>
      <p>Add a Product</p>
      <TextField required label="Product Name" variant="outlined" value={productName} onChange={(event) => setProductName(event.target.value)} />
      <TextField label="Product Owner Name" variant="outlined" value={productOwnerName} onChange={(event) => setProductOwnerName(event.target.value)} />
      <TextField label="Scrum Master Name" variant="outlined" value={scrumMasterName} onChange={(event) => sestScrumMasterName(event.target.value)} />
      <p>Developers</p>
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
      <p>Start Date</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker />
      </LocalizationProvider>
      <TextField label="Link" variant="outlined" value={link} onChange={(event) => setLink(event.target.value)} />
      <button onClick={createProduct}>Submit</button>
      {creating ? <CircularProgress /> : null}
      <button onClick={() => { props.cancelClick() }}>Cancel</button>
      <br />
      {/* {success ? <Alert severity="success">Product Successfully Created</Alert> : null} */}
      {error ? <Alert severity="error">There was an error, please try again later</Alert> : null}
    </div>
  )
}
