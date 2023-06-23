'use client'
import { useEffect, useState } from 'react'
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
      {projectData.map((project, index) => <p key={index}>{project.productName}</p>)}
    </main>
  )
}
