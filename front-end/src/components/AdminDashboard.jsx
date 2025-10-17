import { useCallback, useEffect, useState } from 'react';
import { AdminAPI } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
      setLoading(true);
      setError('');
      try {
        const [s, u] = await Promise.all([AdminAPI.stats(), AdminAPI.users()]);
        setStats(s?.data);
        setUsers(u?.data || []);
      } catch (e) {
        setError(e.message || 'Erreur de chargement admin');
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setRole = useCallback(async (id, role) => {
    try {
      const res = await AdminAPI.updateUser(id, { role });
      setUsers(prev => prev.map(u => u._id === id ? res.data : u));
    } catch (e) {
      setError(e.message || 'Erreur de mise à jour');
    }
  }, []);

  const setActive = useCallback(async (id, isActive) => {
    try {
      const res = await AdminAPI.updateUser(id, { isActive });
      setUsers(prev => prev.map(u => u._id === id ? res.data : u));
    } catch (e) {
      setError(e.message || 'Erreur de mise à jour');
    }
  }, []);

  return (
    <div className="card admin">
      <h2 className="admin-title">Admin Dashboard</h2>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <>
          {stats && (
            <div className="admin-grid">
              <div className="stat">
                <div className="stat-label">Utilisateurs</div>
                <div className="stat-value">{stats.usersCount}</div>
                <div className="stat-sub">Actifs: {stats.activeUsers}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Tâches</div>
                <div className="stat-value">{stats.todosCount}</div>
                <div className="stat-sub">Complétées: {stats.completedTodos} ({stats.completionRate}%)</div>
              </div>
            </div>
          )}
          <div className="admin-users">
            <h3>Derniers utilisateurs</h3>
            <ul className="user-list">
              {users.map(u => (
                <li key={u._id} className="user-item">
                  <div className="user-meta">
                    <div className="user-name">{u.fullName || u.username}</div>
                    <div className="user-email">{u.email}</div>
                  </div>
                  <div className="user-actions">
                    <span className={u.role === 'admin' ? 'badge badge-admin' : 'badge badge-user'}>
                      {u.role}
                    </span>
                    <button onClick={() => setRole(u._id, u.role === 'admin' ? 'user' : 'admin')}>
                      {u.role === 'admin' ? 'Rétrograder' : 'Promouvoir'}
                    </button>
                    <button onClick={() => setActive(u._id, !u.isActive)}>
                      {u.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </li>
              ))}
              {users.length === 0 && <li className="user-item">Aucun utilisateur</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}


