import { Link, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { Header } from './components/Header'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

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
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Placeholder title="Página no encontrada" />} />
      </Routes>
    </>
  )
}
