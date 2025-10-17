import { useState } from 'react';
import { AuthAPI, saveToken } from '../api';

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.email || !form.password) {
      setError('Username, email et mot de passe sont requis.');
      return;
    }
    try {
      setLoading(true);
      const res = await AuthAPI.register(form);
      const token = res?.data?.token;
      if (token) saveToken(token);
      onSuccess?.(res?.data?.user);
    } catch (err) {
      setError(err.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Inscription</h2>
      {error && <div className="error">{error}</div>}
      <label>
        Nom d'utilisateur
        <input name="username" value={form.username} onChange={handleChange} />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      <label>
        Mot de passe
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </label>
      <div className="row">
        <label>
          Prénom
          <input name="firstName" value={form.firstName} onChange={handleChange} />
        </label>
        <label>
          Nom
          <input name="lastName" value={form.lastName} onChange={handleChange} />
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Création…' : "S'inscrire"}
      </button>
    </form>
  );
}


