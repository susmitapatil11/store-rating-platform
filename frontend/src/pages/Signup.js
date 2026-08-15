import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/stores', { replace: true });
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || 'Could not create your account');
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
          "Sign up once, rate every store you visit — and help other
          customers pick well."
        </p>
        <p className="auth-side-foot">© {new Date().getFullYear()} StoreRate — Store Rating Platform</p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="sub">Sign up as a customer to start rating stores</p>

          {error && <div className="form-error-banner">{error}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={fieldErrors.name ? 'has-error' : ''}
                required
              />
              {fieldErrors.name
                ? <span className="field-error">{fieldErrors.name}</span>
                : <span className="field-hint">20-60 characters</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={fieldErrors.email ? 'has-error' : ''}
                required
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={fieldErrors.address ? 'has-error' : ''}
              />
              {fieldErrors.address
                ? <span className="field-error">{fieldErrors.address}</span>
                : <span className="field-hint">Up to 400 characters</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={fieldErrors.password ? 'has-error' : ''}
                required
              />
              {fieldErrors.password
                ? <span className="field-error">{fieldErrors.password}</span>
                : <span className="field-hint">8-16 characters, one uppercase letter, one special character</span>}
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
