// Plumbing Business Website
import './App.css'

// Components
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import BookingForm from './components/BookingForm'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-light">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <HowItWorks />
        <Testimonials />
        <BookingForm />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
