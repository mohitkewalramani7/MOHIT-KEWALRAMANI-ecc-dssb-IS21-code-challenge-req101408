'use client'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';

import styles from './projects.module.css'

export default function Projects() {

  const [projectData, setProjectData] = useState([])
  
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
    async function fetchProjectData() {
      let res = await fetch('http://localhost:3000')
      res = await res.json()
      res.map((r, i) => r.id = i)
      console.log(res)
      setProjectData(res)
    }
    fetchProjectData()
  }, [])

  return (
    <main className={styles.main}>
      <p className={styles.heading}>
        Projects by the ECC
      </p>
      <DataGrid
        rows={projectData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }} />
    </main>
  )
}
