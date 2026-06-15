import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Navbar from './homepage/components/Navbar'
import Hero from './homepage/sections/Hero'
import HowItWorks from './homepage/sections/HowItWorks'
import Footer from './homepage/components/Footer'


export default async function HomePage() {
  const { userId } = await auth()

  if (userId) redirect("/dashboard")

  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  )
}