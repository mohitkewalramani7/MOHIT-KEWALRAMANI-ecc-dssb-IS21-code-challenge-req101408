'use client'
import { useEffect, useState } from 'react'
import styles from './projects.module.css'
// import Modal from 'react-modal'
import { DataGrid } from '@mui/x-data-grid'

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';

import CreateProduct from '@/components/createProduct/createProduct'

export default function Projects() {

  const [projectData, setProjectData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const columns = [
    { field: 'productId', headerName: 'Product Id' },
    { field: 'productName', headerName: 'Product Name', minWidth: 300, editable: true },
    { field: 'productOwnerName', headerName: 'Product Owner Name', minWidth: 200 },
    { field: 'scrumMasterName', headerName: 'Scrum Master Name', minWidth: 200 },
    { field: 'Developers', headerName: 'Developers' },
    { field: 'methodology', headerName: 'Methodology' },
    { field: 'startDate', headerName: 'Start Date' },
    { field: 'location', headerName: 'Link', minWidth: 400 },
  ];

  useEffect(() => {
    fetchProjectData()
  }, [])

  useEffect(() => {
    console.log('yes')
    if (success) {
      setTimeout(() => setSuccess(false), 3000);
    }
  }, [success])

  async function fetchProjectData() {
    let res = await fetch('http://localhost:3000/api/products')
    res = await res.json()
    res.map(r => r.id = r.productId)
    console.log(res)
    setProjectData(res)
  }

  async function successfulCreateCallback() {
    setModalOpen(false)
    setSuccess(true)
    fetchProjectData()
  }

  return (
    <main className={styles.main}>
      {success ? <Alert severity="success">Product Successfully Created</Alert> : null}
      <Dialog
        open={modalOpen}>
        <CreateProduct
          cancelClick={() => setModalOpen(false)}
          successfulCreate={() => successfulCreateCallback()}/>
      </Dialog>
      <p className={styles.heading}>
        Projects by the ECC
      </p>
      <div className={styles.buttonLink} onClick={() => setModalOpen(true)}>
          Create New Project
      </div>
      <DataGrid
        rows={projectData}
        columns={columns}
        onCellEditStop={() => alert('meow')}
        disableRowSelectionOnClick={true}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }} />
    </main>
  )
}

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
