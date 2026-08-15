import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = { ADMIN: '/admin', USER: '/stores', OWNER: '/owner' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const target = location.state?.from || ROLE_HOME[user.role] || '/';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log in, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="auth-side-brand">
          <span className="mark">SR</span>
          StoreRate
        </div>
        <p className="auth-side-quote">
          "One platform to collect, review, and act on ratings across every
          store on the network."
        </p>
        <p className="auth-side-foot">© {new Date().getFullYear()} StoreRate — Store Rating Platform</p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="sub">Log in to your StoreRate account</p>

          {error && <div className="form-error-banner">{error}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
