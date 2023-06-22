import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ECC Web Apps Catalogue',
  description: 'A catalogue of ECC apps visibile and editable',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="icon.png"
          type="image/png"
          sizes="any"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
