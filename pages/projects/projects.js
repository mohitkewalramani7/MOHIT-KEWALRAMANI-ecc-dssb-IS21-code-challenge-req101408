'use client'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import styles from './projects.module.css'

export default function Projects() {

  const [projectData, setProjectData] = useState([])

  useEffect(() => {
    async function fetchProjectData() {
      let res = await fetch('http://localhost:3000')
      res = await res.json()
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
      {/* {projectData.map((project, index) => <p key={index}>{project.productName}</p>)} */}
      <Table striped bordered hover className={styles.tableData}>
        <thead>
          <tr>
            <th>Row Number</th>
            <th>Product Name</th>
            <th>Product Owner</th>
            <th>Developers</th>
            <th>Scrum Master</th>
            <th>Start Date</th>
            <th>Methodology</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {projectData.map((project, index) => <tr key={index}>
            <td>{index + 1}</td>
            <td>{project.productName}</td>
            <td>{project.productOwnerName}</td>
            <td>{project.Developers.join(', ')}</td>
            <td>{project.scrumMasterName}</td>
            <td>{project.startDate}</td>
            <td>{project.methodology}</td>
            <td><a href={project.location} target='_blank'>{project.location}</a></td>
          </tr>)}
        </tbody>
      </Table>
    </main>
  )
}
