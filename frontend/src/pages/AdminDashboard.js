import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats'));
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body">
        <div className="page-header">
          <p className="page-eyebrow">Overview</p>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">A snapshot of activity across the platform.</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        {!stats && !error && <div className="loading-block">Loading stats…</div>}

        {stats && (
          <div className="stat-grid">
            <div className="stat-card">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Stores</p>
              <p className="stat-value">{stats.totalStores}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Ratings Submitted</p>
              <p className="stat-value">{stats.totalRatings}</p>
            </div>
          </div>
        )}

        <div className="two-col">
          <div className="card card-pad">
            <h3 style={{ marginTop: 0 }}>Users</h3>
            <p className="page-subtitle" style={{ marginBottom: 16 }}>
              Add new administrators or normal users, and review the full account list.
            </p>
            <Link className="btn btn-secondary" to="/admin/users">Manage Users</Link>
          </div>
          <div className="card card-pad">
            <h3 style={{ marginTop: 0 }}>Stores</h3>
            <p className="page-subtitle" style={{ marginBottom: 16 }}>
              Register new stores on the platform and review current ratings.
            </p>
            <Link className="btn btn-secondary" to="/admin/stores">Manage Stores</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
