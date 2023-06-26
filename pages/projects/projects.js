'use client'
import { useEffect, useState } from 'react'
import styles from './projects.module.css'
import { DataGrid } from '@mui/x-data-grid'

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';

import CreateProduct from '@/components/createProduct/createProduct'

export default function Projects() {

  const [projectData, setProjectData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [productToUpdate, setProductToUpdate] = useState({})
  const [success, setSuccess] = useState(false)
  
  const columns = [
    { field: 'productId', headerName: 'Product Id' },
    { field: 'productName', headerName: 'Product Name', minWidth: 300 },
    { field: 'productOwnerName', headerName: 'Product Owner Name', minWidth: 200 },
    { field: 'scrumMasterName', headerName: 'Scrum Master Name', minWidth: 200 },
    { field: 'Developers', headerName: 'Developers', minWidth: 400 },
    { field: 'methodology', headerName: 'Methodology' },
    { field: 'startDate', headerName: 'Start Date', minWidth: 200 },
    { field: 'location', headerName: 'Link', minWidth: 400 },
  ];

  useEffect(() => {
    fetchProjectData()
  }, [])

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(false), 3000);
    }
  }, [success])

  async function fetchProjectData() {
    function preProcessProjectData(rawData) {
      rawData.map(d => {
        d.id = d.productId
        d.Developers = d.Developers.join(', ')
        d.startDate = d.startDate.split('T')[0]
      })
      return rawData
    }

    let res = await fetch('http://localhost:3000/api/products')
    res = await res.json()
    res = preProcessProjectData(res)
    console.log(res)
    setProjectData(res)
  }

  async function successfulCreateCallback() {
    setModalOpen(false)
    setSuccess(true)
    fetchProjectData()
  }

  async function openModalCreate() {
    setEditModal(false)
    setProductToUpdate({})
    setModalOpen(true)
  }

  async function openModalEdit(e) {
    const clickedRow = e.row
    console.log(clickedRow)
    setProductToUpdate(clickedRow)
    setEditModal(true)
    setModalOpen(true)
  }

  return (
    <main className={styles.main}>
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
      <p className={styles.caption}>
        Double click a row to edit the product record
      </p>
      <div className={styles.buttonLink} onClick={openModalCreate}>
          Create New Project
      </div>
      <DataGrid
        rows={projectData}
        columns={columns}
        disableRowSelectionOnClick={true}
        onRowDoubleClick={openModalEdit}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }} />
      <Snackbar open={success}>
        <Alert severity="success">Product Successfully Created</Alert>
      </Snackbar>
    </main>
  )
}
