import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AirportTransfersPage from './pages/AirportTransfersPage'
import ScotlandToursPage from './pages/ScotlandToursPage'
import CorporateChauffeurPage from './pages/CorporateChauffeurPage'
import AboutPage from './pages/AboutPage'
import FleetPage from './pages/FleetPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="airport-transfers" element={<AirportTransfersPage />} />
        <Route path="scotland-tours" element={<ScotlandToursPage />} />
        <Route path="corporate-chauffeurs" element={<CorporateChauffeurPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="fleet" element={<FleetPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
