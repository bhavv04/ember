import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Navbar from './homepage/components/Navbar'
import Hero from './homepage/sections/Hero'
import HowItWorks from './homepage/sections/HowItWorks'
import TheMath from './homepage/sections/TheMath'


export default async function HomePage() {
  const { userId } = await auth()

  if (userId) redirect("/dashboard")

  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <TheMath />
    </main>
  )
}