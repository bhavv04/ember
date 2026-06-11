import { Metadata } from 'next'
import Navbar from './homepage/components/Navbar'
import Hero from './homepage/sections/Hero'
import HowItWorks from './homepage/sections/HowItWorks'
import TheMath from './homepage/sections/TheMath'

export const metadata: Metadata = {
  title: "Ember - Visualize Your Weight Loss Journey",
  description: "See the exact calorie deficit mountain you're climbing with Ember's interactive visualizer.",
}


export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <TheMath />
    </div>
  )
}