import { BarChart3, CreditCard, LayoutDashboard, LogOut, Shirt, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: Shirt },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: BarChart3 }
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">LC</span>
          <div>
            <strong>Laundry CRM</strong>
            <small>Dry-cleaning operations</small>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="user-panel">
          <div>
            <strong>{user?.name}</strong>
            <small>{user?.role}</small>
          </div>
          <button type="button" className="icon-button" onClick={logout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
