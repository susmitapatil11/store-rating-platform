import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', dir: 'ASC' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.field, sortDir: sort.dir };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });

    api.get('/admin/stores', { params })
      .then((res) => setStores(res.data))
      .catch(() => setError('Could not load stores'))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => {
    const timeout = setTimeout(fetchStores, 250);
    return () => clearTimeout(timeout);
  }, [fetchStores]);

  const toggleSort = (field) => {
    setSort((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const sortArrow = (field) => (sort.field === field ? (sort.dir === 'ASC' ? '▲' : '▼') : '');

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body">
        <div className="section-actions">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <p className="page-eyebrow">Administration</p>
            <h1 className="page-title">Stores</h1>
            <p className="page-subtitle">Every store registered on the platform, with its current rating.</p>
          </div>
          <Link className="btn btn-primary" to="/admin/stores/new">Add Store</Link>
        </div>

        <div className="card card-pad">
          <div className="table-toolbar">
            <div className="field">
              <label>Name</label>
              <input value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Search name" />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} placeholder="Search email" />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} placeholder="Search address" />
            </div>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Name <span className="sort-arrow">{sortArrow('name')}</span></th>
                <th onClick={() => toggleSort('email')}>Email <span className="sort-arrow">{sortArrow('email')}</span></th>
                <th onClick={() => toggleSort('address')}>Address <span className="sort-arrow">{sortArrow('address')}</span></th>
                <th onClick={() => toggleSort('avgRating')}>Rating <span className="sort-arrow">{sortArrow('avgRating')}</span></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="empty-row"><td colSpan={4}>Loading stores…</td></tr>
              )}
              {!loading && stores.length === 0 && (
                <tr className="empty-row"><td colSpan={4}>No stores match these filters</td></tr>
              )}
              {!loading && stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address || '—'}</td>
                  <td>{s.avgRating ? `★ ${s.avgRating}` : 'No ratings yet'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
