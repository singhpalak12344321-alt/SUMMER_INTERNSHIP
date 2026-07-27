import { useEffect, useState } from "react";
import api from "../api/client.js";
import DataTable from "../components/DataTable.jsx";
import StatCard from "../components/StatCard.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState({ customers: 0, orders: 0, revenue: 0, statusBreakdown: [], recentOrders: [] });

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Operations overview</span>
          <h1>Dashboard</h1>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard label="Customers" value={stats.customers} tone="green" />
        <StatCard label="Orders" value={stats.orders} tone="blue" />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} tone="amber" />
      </div>

      <section className="content-band">
        <h2>Order Status</h2>
        <div className="status-grid">
          {stats.statusBreakdown.map((item) => (
            <div className="status-tile" key={item._id}>
              <span>{item._id}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="content-band">
        <h2>Recent Orders</h2>
        <DataTable
          columns={[
            { key: "customer", label: "Customer", render: (row) => row.customer?.name || "Unknown" },
            { key: "status", label: "Status" },
            { key: "total", label: "Total", render: (row) => `₹${row.total}` },
            { key: "dueDate", label: "Due", render: (row) => new Date(row.dueDate).toLocaleDateString() }
          ]}
          rows={stats.recentOrders}
          emptyMessage="No orders yet."
        />
      </section>
    </div>
  );
};

export default Dashboard;
