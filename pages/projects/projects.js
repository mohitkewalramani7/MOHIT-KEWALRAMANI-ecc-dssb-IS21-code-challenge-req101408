/** Component that represents the page which showcases all product
 * data in the form of a table
*/

'use client'
// React imports
import { useEffect, useState } from 'react'
import Head from 'next/head'

// Material UI front-end components
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import Snackbar from '@mui/material/Snackbar'

// Material UI data-grid component
import { DataGrid } from '@mui/x-data-grid'

// Internal project file imports
import { apiUrl } from '@/commons'
import styles from './projects.module.css'
import CreateProduct from '@/components/createProduct/createProduct'

export default function Projects() {

  // List of data that is retrieved from the back-end
  const [projectData, setProjectData] = useState([])
  
  // Whether or not the modal to create/update a record is open
  const [modalOpen, setModalOpen] = useState(false)

  // Whether or not we are opening the modal to edit a record or not
  const [editModal, setEditModal] = useState(false)

  // The product we want to update by opening the modal
  const [productToUpdate, setProductToUpdate] = useState({})

  // Whether or not the API call to update or create is successful or not
  const [success, setSuccess] = useState(false)
  
  const columns = [
    { field: 'productId', headerName: 'Product Id' },
    { field: 'productName', headerName: 'Product Name', minWidth: 300 },
    { field: 'productOwnerName', headerName: 'Product Owner Name', minWidth: 200 },
    { field: 'scrumMasterName', headerName: 'Scrum Master Name', minWidth: 200 },
    { field: 'developersLabel', headerName: 'Developers', minWidth: 400 },
    { field: 'methodology', headerName: 'Methodology' },
    { field: 'startDate', headerName: 'Start Date', minWidth: 200 },
    { field: 'location', headerName: 'Link', minWidth: 400 },
  ];

  /**
   * The first call to the API that retrieves product data
   */
  useEffect(() => {
    fetchProjectData()
  }, [])

  /**
   * Switches the success hook to false after 3 seconds so the snackbar
   * message hides
   */
  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(false), 3000);
    }
  }, [success])

  /**
   * An asynchronous call to the back-end that gets the project data
   * to render in the data grid. This would be called on refreshing
   * the page, or when a POST or PUT request is made
   * 
   * @returns {}
   */
  async function fetchProjectData() {
    /**
     * 
     * @param {JSON[]} rawData - The raw data we want to pre-process
     * @returns {JSON[]} - The raw data formatted for the data grid
     */
    function preProcessProjectData(rawData) {
      rawData.map(d => {
        d.id = d.productId
        d.developersLabel = d.Developers?.join(', ')
        d.startDate = d.startDate?.split('T')[0]
      })
      return rawData
    }

    try {
      let res = await fetch(`${apiUrl}/products`)
      res = await res.json()
      res = preProcessProjectData(res)
      setProjectData(res)
    }
    catch (e) {
      console.error(e)
    }
  }

  /**
   * The callback that is called after a successful
   * POST or PUT request
   * 
   * @returns {}
   */
  async function successfulCreateCallback() {
    setModalOpen(false)
    setSuccess(true)
    fetchProjectData()
  }

  /**
   * Called when we want to open the modal to create
   * a new product record
   * 
   * @returns {}
   */
  async function openModalCreate() {
    setEditModal(false)
    setProductToUpdate({})
    setModalOpen(true)
  }

  /**
   * Called when we want to open the modal to edit
   * a product record
   * 
   * @param {event} e - The event that the datagrid passes
   * which includes data on the row being clicked for editing
   */
  async function openModalEdit(e) {
    const clickedRow = e.row
    console.log(clickedRow)
    setProductToUpdate(clickedRow)
    setEditModal(true)
    setModalOpen(true)
  }

  return (
    <main className={styles.main}>
      <Head>
        <title>Projects</title>
        <link rel="icon" href="/icon.png" sizes="any" />
      </Head>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}>
        <CreateProduct
          cancelClick={() => setModalOpen(false)}
          successfulCreate={() => successfulCreateCallback()}
          isEdit={editModal}
          productToUpdate={productToUpdate} />
      </Dialog>
      <p className={styles.heading}>
        Projects by the ECC
      </p>
      {projectData.length > 0 ? <div className={styles.bodyContent}>
      <p className={styles.caption}>
        Click a row to view or edit the product record
      </p>
      <div className={styles.buttonLink} onClick={openModalCreate}>
          Create New Project
      </div>
      <DataGrid
        rows={projectData}
        columns={columns}
        disableRowSelectionOnClick={true}
        onRowClick={openModalEdit}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }} />
        </div> : null
      }
      {projectData.length === 0 ? <p className={styles.caption}>
        Unfortunately our servers are down, please try again later
      </p> : null}
      <Snackbar open={success}>
        <Alert severity="success">Success!</Alert>
      </Snackbar>
    </main>
  )
}
