/** Component representing the landing page of the application  */

'use client'
import styles from './page.module.css'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {  
  return (
    <main className={styles.main}>
      <Head>
        <title>Projects</title>
        <link rel="icon" href="/icon.png" sizes="any" />
      </Head>
      <div className={styles.description}>
        <p>Submission by Mohit Kewalramani</p>
        <div>
          <img
            className={styles.bclogo}
            src="/BCID_H_rgb_pos.jpg"
            alt="BC Government Logo"
          />
        </div>
      </div>
      <Link href="/projects/projects" className={styles.buttonLink}>
          View ECC Apps
      </Link>
    </main>
  )
}
