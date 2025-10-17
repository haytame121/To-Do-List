import { useEffect, useState } from 'react'
import './App.css'
import LoginForm from './components/LoginForm.jsx'
import RegisterForm from './components/RegisterForm.jsx'
import { AuthAPI, clearToken } from './api.js'
import TodosList from './components/TodosList.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

function App() {
  const [tab, setTab] = useState('login')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('')

  useEffect(() => {
    // Try fetching profile if token exists
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await AuthAPI.profile()
        setUser(res?.data?.user || null)
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    try {
      await AuthAPI.logout()
    } catch {}
    clearToken()
    setUser(null)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="container">
      <h1>To-Do Auth</h1>
      <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 12 }}>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="">Default</option>
          <option value="glass">Glass</option>
          <option value="neumorphic">Neumorphic</option>
        </select>
      </div>
      {loading ? (
        <div>Chargement…</div>
      ) : user ? (
        <>
          <div className="card">
            <h2>Bienvenue {user?.fullName || user?.username}</h2>
            <p>Email: {user?.email}</p>
            <button onClick={handleLogout}>Se déconnecter</button>
          </div>
          {user?.role === 'admin' && <AdminDashboard />}
          <TodosList />
        </>
      ) : (
        <>
          <div className="tabs">
            <button className={tab==='login'? 'active':''} onClick={() => setTab('login')}>Connexion</button>
            <button className={tab==='register'? 'active':''} onClick={() => setTab('register')}>Inscription</button>
          </div>
          {tab === 'login' ? (
            <LoginForm onSuccess={(u) => setUser(u)} />
          ) : (
            <RegisterForm onSuccess={(u) => setUser(u)} />
          )}
          {error && <div className="error">{error}</div>}
        </>
      )}
    </div>
  )
}

export default App
