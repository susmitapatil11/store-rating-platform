import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/admin/store-owners')
      .then((res) => setOwners(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || null });
      navigate('/admin/stores');
    } catch (err) {
      if (err.response?.data?.errors) setFieldErrors(err.response.data.errors);
      setError(err.response?.data?.message || 'Could not create store');
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
          <h1 className="page-title">Add Store</h1>
          <p className="page-subtitle">Register a new store on the platform.</p>
        </div>

        <div className="card card-pad">
          {error && <div className="form-error-banner">{error}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Store Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} className={fieldErrors.name ? 'has-error' : ''} placeholder="e.g. Placeholder Store Name Here" required />
              {fieldErrors.name ? <span className="field-error">{fieldErrors.name}</span> : <span className="field-hint">20-60 characters</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Store Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={fieldErrors.email ? 'has-error' : ''} placeholder="contact@example.com" required />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" value={form.address} onChange={handleChange} className={fieldErrors.address ? 'has-error' : ''} />
              {fieldErrors.address ? <span className="field-error">{fieldErrors.address}</span> : <span className="field-hint">Up to 400 characters</span>}
            </div>

            <div className="field">
              <label htmlFor="ownerId">Store Owner (optional)</label>
              <select id="ownerId" name="ownerId" value={form.ownerId} onChange={handleChange}>
                <option value="">No owner assigned yet</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.name} — {o.email}</option>
                ))}
              </select>
              <span className="field-hint">
                Only accounts with the Store Owner role and no store yet are listed here.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Store'}
              </button>
              <Link className="btn btn-secondary" to="/admin/stores">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
