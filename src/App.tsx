import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Registro from './app/Registro'
import Empleados from './app/Empleados'
import Lista from './app/Lista'
import Kiosk from './app/Kiosk'
import HealthChecks from './app/HealthChecks'
import Placeholder from './app/Placeholder'
import Stations from './app/Stations'
import Mieruka from './app/Mieruka'
import Anomalias from './app/Anomalias'
import Requirements from './app/Requirements'
import ASIReport from './app/ASIReport'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/kiosk" replace />} />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/lista" element={<Lista />} />
        
        {/* Nuevos modulos desde Kiosco */}
        <Route path="/mieruka" element={<Mieruka />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/health-checks" element={<HealthChecks />} />
        <Route path="/anomalies" element={<Anomalias />} />
        <Route path="/asi-report" element={<ASIReport />} />
      </Route>
    </Routes>
  )
}
