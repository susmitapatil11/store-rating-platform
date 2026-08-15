import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setSubmitting(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage('Your password has been updated');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body" style={{ maxWidth: 480 }}>
        <div className="page-header">
          <p className="page-eyebrow">Account</p>
          <h1 className="page-title">Change Password</h1>
          <p className="page-subtitle">Update the password used to log in to StoreRate.</p>
        </div>

        <div className="card card-pad">
          {message && <div className="form-success-banner">{message}</div>}
          {error && <div className="form-error-banner">{error}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="currentPassword">Current password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <span className="field-hint">8-16 characters, one uppercase letter, one special character</span>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
