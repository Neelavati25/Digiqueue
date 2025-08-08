import { Header } from "../components/header"
import { Hero } from "../components/hero"
import { Features } from "../components/features"
import { HowItWorks } from "../components/how-it-works"
import { Footer } from "../components/footer"
import '../index.css';
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}
