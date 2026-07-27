import { useEffect, useState } from "react";
import api from "../api/client.js";
import DataTable from "../components/DataTable.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    service: "wash",
    garment: "",
    quantity: 1,
    unitPrice: 100,
    dueDate: "",
    status: "received"
  });

  const load = () => {
    Promise.all([api.get("/orders"), api.get("/customers")]).then(([orderRes, customerRes]) => {
      setOrders(orderRes.data);
      setCustomers(customerRes.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const { service, garment, quantity, unitPrice, ...payload } = form;
    await api.post("/orders", {
      ...payload,
      items: [{ service, garment, quantity: Number(quantity), unitPrice: Number(unitPrice) }]
    });
    setForm({ ...form, garment: "", quantity: 1, unitPrice: 100 });
    load();
  };

  const updateStatus = async (order, status) => {
    await api.put(`/orders/${order._id}`, { ...order, customer: order.customer._id, status });
    load();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Laundry workflow</span>
          <h1>Orders</h1>
        </div>
      </header>

      <section className="content-band two-column">
        <form className="form-grid" onSubmit={submit}>
          <h2>Create Order</h2>
          <label>
            Customer
            <select value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} required>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>{customer.name}</option>
              ))}
            </select>
          </label>
          <label>
            Service
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
              <option value="wash">Wash</option>
              <option value="dry-clean">Dry clean</option>
              <option value="iron">Iron</option>
              <option value="stain-removal">Stain removal</option>
              <option value="alteration">Alteration</option>
            </select>
          </label>
          <label>Garment<input value={form.garment} onChange={(e) => setForm({ ...form, garment: e.target.value })} required /></label>
          <label>Quantity<input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
          <label>Unit Price<input type="number" min="0" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} /></label>
          <label>Due Date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required /></label>
          <button className="primary-button" type="submit">Create order</button>
        </form>

        <DataTable
          columns={[
            { key: "customer", label: "Customer", render: (row) => row.customer?.name },
            { key: "status", label: "Status", render: (row) => <span className="pill">{row.status}</span> },
            { key: "total", label: "Total", render: (row) => `₹${row.total}` },
            {
              key: "next",
              label: "Update",
              render: (row) => (
                <select value={row.status} onChange={(e) => updateStatus(row, e.target.value)}>
                  {["received", "washing", "drying", "ironing", "ready", "delivered", "cancelled"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              )
            }
          ]}
          rows={orders}
          emptyMessage="No orders yet."
        />
      </section>
    </div>
  );
};

export default Orders;
