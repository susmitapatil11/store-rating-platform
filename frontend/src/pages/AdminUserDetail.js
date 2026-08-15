import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError('Could not load this user'));
  }, [id]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body" style={{ maxWidth: 560 }}>
        <div className="page-header">
          <p className="page-eyebrow">Administration</p>
          <h1 className="page-title">User Details</h1>
          <Link to="/admin/users" style={{ fontSize: 13, color: 'var(--accent-600)' }}>← Back to users</Link>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        {!user && !error && <div className="loading-block">Loading…</div>}

        {user && (
          <div className="card card-pad">
            <div className="detail-list">
              <div className="detail-row">
                <span className="k">Name</span>
                <span className="v">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="k">Email</span>
                <span className="v">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="k">Address</span>
                <span className="v">{user.address || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="k">Role</span>
                <span className="v"><span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span></span>
              </div>
              {user.role === 'OWNER' && (
                <div className="detail-row">
                  <span className="k">Store Rating</span>
                  <span className="v">{user.rating ? `★ ${user.rating}` : 'No ratings yet'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
