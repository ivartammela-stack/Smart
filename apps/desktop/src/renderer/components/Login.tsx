import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import logo3d from '../assets/smartfollow-logo.png';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved email on mount (never passwords for security)
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Save or clear email based on "Remember me"
        // SECURITY: Never store passwords in localStorage!
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
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
    <div className="sf-login-page">
      <div className="sf-login-gradient" />
      
      {/* Floating logo in background */}
      <div 
        className="sf-login-logo-mark"
        style={{ backgroundImage: `url(${logo3d})` }}
        aria-hidden="true"
      />

      <div className="sf-login-shell">
        <main className="sf-login-main">
          <section className="sf-login-card">
            <header className="sf-login-header">
              <h2>Logi sisse</h2>
              <p>Halda kliente, tehinguid ja järeltegevusi ühest kohast.</p>
            </header>

            <form className="sf-login-form" onSubmit={handleLogin}>
              <div className="sf-form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sinunimi@ettevote.ee"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="sf-form-group">
                <label htmlFor="password">Parool</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div className="sf-login-row">
                <label className="sf-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Mäleta mind</span>
                </label>

                <span className="sf-login-hint">Admin: admin@smartfollow.ee</span>
              </div>

              {error && (
                <div className="sf-login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="sf-button-primary"
                disabled={loading}
              >
                {loading ? 'Sisselogimine…' : 'Logi sisse'}
              </button>
            </form>

            <footer className="sf-login-footer">
              <span>SmartFollow CRM · Desktop rakendus</span>
              <span className="sf-login-version">v1.3.0</span>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;

