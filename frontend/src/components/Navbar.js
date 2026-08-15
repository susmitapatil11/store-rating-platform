import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  USER: [
    { to: '/stores', label: 'Browse Stores' },
  ],
  OWNER: [
    { to: '/owner', label: 'My Store' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="mark">SR</span>
        StoreRate
      </div>

      <nav className="topbar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="/change-password"
          className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}
        >
          Change Password
        </NavLink>

        <div className="topbar-user">
          <span>
            <span className="topbar-user-name">{user.name}</span>
            <span className="topbar-user-role">{user.role}</span>
          </span>
          <button className="btn-ghost-light" onClick={handleLogout}>Log out</button>
        </div>
      </nav>
    </header>
  );
}
