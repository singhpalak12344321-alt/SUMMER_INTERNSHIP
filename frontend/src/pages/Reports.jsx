import { useEffect, useState } from "react";
import api from "../api/client.js";
import DataTable from "../components/DataTable.jsx";

const Reports = () => {
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/reports/revenue"), api.get("/reports/orders")]).then(([revenueRes, orderRes]) => {
      setRevenue(revenueRes.data);
      setOrders(orderRes.data);
    });
  }, []);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Business analytics</span>
          <h1>Reports</h1>
        </div>
      </header>

      <section className="content-band">
        <h2>Revenue by Day</h2>
        <DataTable
          columns={[
            { key: "_id", label: "Date" },
            { key: "count", label: "Payments" },
            { key: "total", label: "Revenue", render: (row) => `₹${row.total}` }
          ]}
          rows={revenue.map((row) => ({ ...row, _id: row._id || "Unrecorded" }))}
          emptyMessage="No revenue data yet."
        />
      </section>

      <section className="content-band">
        <h2>Services Performance</h2>
        <DataTable
          columns={[
            { key: "_id", label: "Service" },
            { key: "quantity", label: "Quantity" },
            { key: "revenue", label: "Revenue", render: (row) => `₹${row.revenue}` }
          ]}
          rows={orders.map((row) => ({ ...row, _id: row._id || "Unknown" }))}
          emptyMessage="No service data yet."
        />
      </section>
    </div>
  );
};

export default Reports;
