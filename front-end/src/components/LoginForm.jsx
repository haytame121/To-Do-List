import { useState } from 'react';
import { AuthAPI, saveToken } from '../api';

export default function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    try {
      setLoading(true);
      const res = await AuthAPI.login({ username, password });
      const token = res?.data?.token;
      if (token) saveToken(token);
      onSuccess?.(res?.data?.user);
    } catch (err) {
      setError(err.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Connexion</h2>
      {error && <div className="error">{error}</div>}
      <label>
        Nom d'utilisateur ou email
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username ou email"
        />
      </label>
      <label>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
        /> 
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>

  );
}


