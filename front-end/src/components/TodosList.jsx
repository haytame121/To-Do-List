import { useCallback, useEffect, useState } from 'react';
import { TodosAPI } from '../api';

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await TodosAPI.list({ limit: 50 });
      setTodos(res?.data?.todos || []);
    } catch (e) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTodo = useCallback(async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await TodosAPI.create({ title });
      setTodos(prev => [res?.data, ...prev]);
      setTitle('');
    } catch (e) {
      setError(e.message || 'Erreur de création');
    }
  }, [title]);

  const toggle = useCallback(async (id) => {
    try {
      const res = await TodosAPI.toggle(id);
      const updated = res?.data;
      setTodos(prev => prev.map(t => t._id === id ? updated : t));
    } catch (e) {
      setError(e.message || 'Erreur de mise à jour');
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      await TodosAPI.remove(id);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      setError(e.message || 'Erreur de suppression');
    }
  }, []);

  return (
    <div className="card">
      <h2>Mes tâches</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={addTodo} className="row">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nouvelle tâche" />
        <button type="submit">Ajouter</button>
      </form>
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <ul className="todos">
          {todos.map(t => (
            <li key={t._id} className={t.completed ? 'completed' : ''}>
              <label>
                <input type="checkbox" checked={!!t.completed} onChange={() => toggle(t._id)} />
                {t.title}
              </label>
              <button onClick={() => remove(t._id)}>Supprimer</button>
            </li>
          ))}
          {todos.length === 0 && <li>Aucune tâche</li>}
        </ul>
      )}
    </div>
  );
}


