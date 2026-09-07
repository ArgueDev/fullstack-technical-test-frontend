import { Link, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { EventsPage } from './pages/EventsPage'

function Placeholder({ title }: { title: string }) {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-4 text-slate-600">Esta página estará disponible próximamente.</p>
      <Link to="/" className="mt-6 inline-block font-semibold text-indigo-700 underline">Volver a eventos</Link>
    </main>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:id" element={<Placeholder title="Detalle del evento" />} />
        <Route path="/login" element={<Placeholder title="Iniciar sesión" />} />
        <Route path="*" element={<Placeholder title="Página no encontrada" />} />
      </Routes>
    </>
  )
}
