import React, { useState } from 'react';
import api from '../utils/api';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data.token);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      // User-friendly error messages
      if (errorMsg.includes('ERR_CONNECTION_REFUSED') || errorMsg.includes('Failed to fetch')) {
        setError('Backend server ei vasta. Veendu, et server jookseb (npm run dev apps/server kaustas)');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>SmartFollow CRM</h1>
        <p className="subtitle">Logi sisse</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sinu@email.ee"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parool</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sisselogimine...' : 'Logi sisse'}
          </button>
        </form>

        <p className="footer-text">
          SmartFollow CRM - Desktop Application v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Login;

