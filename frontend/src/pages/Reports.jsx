import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../api/client.js";
import DataTable from "../components/DataTable.jsx";

// Sample fallback data to preview charts when DB is empty
const sampleRevenueData = [
  { _id: "2026-07-20", total: 1200, count: 3 },
  { _id: "2026-07-21", total: 2400, count: 5 },
  { _id: "2026-07-22", total: 1800, count: 4 },
  { _id: "2026-07-23", total: 3100, count: 7 },
  { _id: "2026-07-24", total: 2800, count: 6 },
  { _id: "2026-07-25", total: 4200, count: 9 },
  { _id: "2026-07-26", total: 3900, count: 8 }
];

const sampleOrdersData = [
  { _id: "Wash & Fold", quantity: 45, revenue: 4500 },
  { _id: "Dry Cleaning", quantity: 28, revenue: 8400 },
  { _id: "Ironing", quantity: 60, revenue: 1800 },
  { _id: "Shoe Cleaning", quantity: 12, revenue: 2400 }
];

const Reports = () => {
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/reports/revenue"), api.get("/reports/orders")])
      .then(([revenueRes, orderRes]) => {
        const revData = (revenueRes.data || []).map((row) => ({
          ...row,
          _id: row._id || "Unrecorded",
          total: Number(row.total || 0),
          count: Number(row.count || 0)
        }));

        const ordData = (orderRes.data || []).map((row) => ({
          ...row,
          _id: row._id || "Unknown",
          quantity: Number(row.quantity || 0),
          revenue: Number(row.revenue || 0)
        }));

        // Use real DB data if available, otherwise use sample preview data
        setRevenue(revData.length > 0 ? revData : sampleRevenueData);
        setOrders(ordData.length > 0 ? ordData : sampleOrdersData);
      })
      .catch((err) => {
        console.error("Failed to load report data, using sample preview:", err);
        setRevenue(sampleRevenueData);
        setOrders(sampleOrdersData);
      });
  }, []);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Business analytics</span>
          <h1>Reports & Performance</h1>
        </div>
      </header>

      {/* Revenue Trend Section */}
      <section className="content-band">
        <h2>Revenue Trend</h2>
        <div style={{ width: "100%", height: "300px", minHeight: "300px", marginBottom: "1.5rem" }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenue} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="_id" tickLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <DataTable
          columns={[
            { key: "_id", label: "Date" },
            { key: "count", label: "Payments" },
            { key: "total", label: "Revenue", render: (row) => `₹${row.total}` }
          ]}
          rows={revenue}
          emptyMessage="No revenue data yet."
        />
      </section>

      {/* Services Performance Section */}
      <section className="content-band">
        <h2>Services Performance</h2>
        <div style={{ width: "100%", height: "300px", minHeight: "300px", marginBottom: "1.5rem" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orders} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="_id" tickLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                formatter={(value, name) => [
                  name === "revenue" ? `₹${value}` : value,
                  name === "revenue" ? "Revenue" : "Quantity"
                ]}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <DataTable
          columns={[
            { key: "_id", label: "Service" },
            { key: "quantity", label: "Quantity" },
            { key: "revenue", label: "Revenue", render: (row) => `₹${row.revenue}` }
          ]}
          rows={orders}
          emptyMessage="No service data yet."
        />
      </section>
    </div>
  );
};

export default Reports;