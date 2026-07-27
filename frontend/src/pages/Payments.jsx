import { useEffect, useState } from "react";
import api from "../api/client.js";
import DataTable from "../components/DataTable.jsx";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order: "", amount: "", method: "cash", reference: "" });

  const load = () => {
    Promise.all([api.get("/payments"), api.get("/orders")]).then(([paymentRes, orderRes]) => {
      setPayments(paymentRes.data);
      setOrders(orderRes.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const selectedOrder = orders.find((order) => order._id === form.order);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/payments", {
      ...form,
      customer: selectedOrder.customer._id,
      amount: Number(form.amount || selectedOrder.total)
    });
    setForm({ order: "", amount: "", method: "cash", reference: "" });
    load();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Collections</span>
          <h1>Payments</h1>
        </div>
      </header>

      <section className="content-band two-column">
        <form className="form-grid" onSubmit={submit}>
          <h2>Record Payment</h2>
          <label>
            Order
            <select value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value, amount: "" })} required>
              <option value="">Select order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.customer?.name} - ₹{order.total}
                </option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0"
              value={form.amount}
              placeholder={selectedOrder ? String(selectedOrder.total) : "0"}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
          <label>
            Method
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank-transfer">Bank transfer</option>
            </select>
          </label>
          <label>Reference<input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} /></label>
          <button className="primary-button" type="submit" disabled={!selectedOrder}>Save payment</button>
        </form>

        <DataTable
          columns={[
            { key: "customer", label: "Customer", render: (row) => row.customer?.name },
            { key: "amount", label: "Amount", render: (row) => `₹${row.amount}` },
            { key: "method", label: "Method" },
            { key: "status", label: "Status", render: (row) => <span className="pill">{row.status}</span> },
            { key: "paidAt", label: "Paid", render: (row) => new Date(row.paidAt).toLocaleDateString() }
          ]}
          rows={payments}
          emptyMessage="No payment records."
        />
      </section>
    </div>
  );
};

export default Payments;
