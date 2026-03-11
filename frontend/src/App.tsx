import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Questionnaire from './pages/Questionnaire'
import Recommendations from './pages/Recommendations'
import CoffeeCatalog from './pages/CoffeeCatalog'
import CoffeeDetail from './pages/CoffeeDetail'
import Traceability from './pages/Traceability'
import Passport from './pages/Passport'
import Login from './pages/Login'
import TemperatureSimulator from './pages/TemperatureSimulator'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/catalog" element={<CoffeeCatalog />} />
            <Route path="/coffee/:id" element={<CoffeeDetail />} />
            <Route path="/trace/:id" element={<Traceability />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/temperature" element={<TemperatureSimulator />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
