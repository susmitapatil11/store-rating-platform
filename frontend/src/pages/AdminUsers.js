import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'name', dir: 'ASC' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.field, sortDir: sort.dir };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });

    api.get('/admin/users', { params })
      .then((res) => setUsers(res.data))
      .catch(() => setError('Could not load users'))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 250); // small debounce while typing filters
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

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
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">Normal users and administrators registered on the platform.</p>
          </div>
          <Link className="btn btn-primary" to="/admin/users/new">Add User</Link>
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
            <div className="field">
              <label>Role</label>
              <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
                <option value="">All roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="OWNER">Store Owner</option>
              </select>
            </div>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Name <span className="sort-arrow">{sortArrow('name')}</span></th>
                <th onClick={() => toggleSort('email')}>Email <span className="sort-arrow">{sortArrow('email')}</span></th>
                <th onClick={() => toggleSort('address')}>Address <span className="sort-arrow">{sortArrow('address')}</span></th>
                <th onClick={() => toggleSort('role')}>Role <span className="sort-arrow">{sortArrow('role')}</span></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="empty-row"><td colSpan={5}>Loading users…</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr className="empty-row"><td colSpan={5}>No users match these filters</td></tr>
              )}
              {!loading && users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address || '—'}</td>
                  <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td><Link className="btn btn-secondary btn-sm" to={`/admin/users/${u.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
