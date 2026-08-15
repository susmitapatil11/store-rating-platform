import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
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
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.data?.errors) setFieldErrors(err.response.data.errors);
      setError(err.response?.data?.message || 'Could not create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body" style={{ maxWidth: 560 }}>
        <div className="page-header">
          <p className="page-eyebrow">Administration</p>
          <h1 className="page-title">Add User</h1>
          <p className="page-subtitle">Create a normal user, store owner, or another admin account.</p>
        </div>

        <div className="card card-pad">
          {error && <div className="form-error-banner">{error}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} className={fieldErrors.name ? 'has-error' : ''} placeholder="e.g. Placeholder Full Name Here" required />
              {fieldErrors.name ? <span className="field-error">{fieldErrors.name}</span> : <span className="field-hint">20-60 characters</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={fieldErrors.email ? 'has-error' : ''} placeholder="name@example.com" required />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" value={form.address} onChange={handleChange} className={fieldErrors.address ? 'has-error' : ''} />
              {fieldErrors.address ? <span className="field-error">{fieldErrors.address}</span> : <span className="field-hint">Up to 400 characters</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Temporary Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={fieldErrors.password ? 'has-error' : ''} required />
              {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : <span className="field-hint">8-16 characters, one uppercase letter, one special character</span>}
            </div>

            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="USER">Normal User</option>
                <option value="OWNER">Store Owner</option>
                <option value="ADMIN">Administrator</option>
              </select>
              {form.role === 'OWNER' && (
                <span className="field-hint">
                  You can link this owner to a store from the "Add Store" screen afterwards.
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create User'}
              </button>
              <Link className="btn btn-secondary" to="/admin/users">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
