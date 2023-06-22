'use client'
import styles from './page.module.css'
import Link from 'next/link';

export default function Home() {  
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Submission by Mohit Kewalramani</p>
        <div>
          <img
            className={styles.bclogo}
            src="/BCID_H_rgb_pos.jpg"
            alt="BC Government Logo"
            priority
          />
        </div>
      </div>
      <Link href="/projects/projects" className={styles.buttonLink}>
          View ECC Apps
      </Link>
    </main>
  )
}
