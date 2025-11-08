import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TripWeaver",
  description: "Automated travel planner that generates tours based on your location",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <span>Landing page</span>
      </body>
    </html>
  )
}
