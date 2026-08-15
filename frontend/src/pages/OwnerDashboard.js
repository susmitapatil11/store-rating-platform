import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/owner/overview')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load your store'));
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body">
        <div className="page-header">
          <p className="page-eyebrow">My Store</p>
          <h1 className="page-title">{data ? data.store.name : 'Store Dashboard'}</h1>
          <p className="page-subtitle">Ratings customers have left for your store.</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}
        {!data && !error && <div className="loading-block">Loading…</div>}

        {data && (
          <>
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="stat-card">
                <p className="stat-label">Average Rating</p>
                <p className="stat-value">{data.averageRating ? `★ ${data.averageRating}` : '—'}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Total Ratings</p>
                <p className="stat-value">{data.raters.length}</p>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ marginTop: 0 }}>Customer Ratings</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.raters.length === 0 && (
                    <tr className="empty-row"><td colSpan={3}>No ratings submitted yet</td></tr>
                  )}
                  {data.raters.map((r) => (
                    <tr key={r.userId}>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td>{r.rating} / 5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
