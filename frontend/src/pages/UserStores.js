import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import api from '../api/axios';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.address) params.address = filters.address;

    api.get('/stores', { params })
      .then((res) => setStores(res.data))
      .catch(() => setError('Could not load stores'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(fetchStores, 250);
    return () => clearTimeout(timeout);
  }, [fetchStores]);

  const handleRate = async (storeId, value) => {
    setSavingId(storeId);
    try {
      await api.post(`/stores/${storeId}/rating`, { value });
      setStores((prev) => prev.map((s) => (
        s.id === storeId ? { ...s, userRating: value } : s
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your rating');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-body">
        <div className="page-header">
          <p className="page-eyebrow">Browse</p>
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">Search for a store and submit or update your rating.</p>
        </div>

        <div className="table-toolbar" style={{ marginBottom: 24 }}>
          <div className="field">
            <label>Store name</label>
            <input value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Search by name" />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} placeholder="Search by address" />
          </div>
        </div>

        {error && <div className="form-error-banner">{error}</div>}
        {loading && <div className="loading-block">Loading stores…</div>}

        {!loading && stores.length === 0 && (
          <div className="loading-block">No stores match your search</div>
        )}

        <div className="store-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <div>
                <h3 className="store-card-name">{store.name}</h3>
                <p className="store-card-address">{store.address || 'No address on file'}</p>
              </div>

              <div className="store-card-ratings">
                <div>
                  <span className="label">Overall rating</span>
                  <span className="value">{store.avgRating ? `★ ${store.avgRating}` : 'No ratings yet'}</span>
                </div>
                <div>
                  <span className="label">Your rating</span>
                  <span className="value">{store.userRating ? `${store.userRating} / 5` : 'Not rated'}</span>
                </div>
              </div>

              <div>
                <span className="label" style={{ fontSize: 12, color: 'var(--ink-500)', display: 'block', marginBottom: 6 }}>
                  {store.userRating ? 'Update your rating' : 'Rate this store'}
                </span>
                <StarRating
                  value={store.userRating || 0}
                  disabled={savingId === store.id}
                  onChange={(v) => handleRate(store.id, v)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
