import { Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import DataTable from "../components/DataTable.jsx";

const initialForm = { name: "", phone: "", email: "", address: "", notes: "" };

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);

  const loadCustomers = () => {
    api.get("/customers", { params: { search } }).then(({ data }) => setCustomers(data));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/customers", form);
    setForm(initialForm);
    loadCustomers();
  };

  const remove = async (id) => {
    await api.delete(`/customers/${id}`);
    loadCustomers();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <span className="eyebrow">Customer records</span>
          <h1>Customers</h1>
        </div>
        <form className="search-box" onSubmit={(e) => { e.preventDefault(); loadCustomers(); }}>
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers" />
        </form>
      </header>

      <section className="content-band two-column">
        <form className="form-grid" onSubmit={submit}>
          <h2>Add Customer</h2>
          {["name", "phone", "email", "address"].map((field) => (
            <label key={field}>
              {field}
              <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={field !== "email"} />
            </label>
          ))}
          <label>
            notes
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <button className="primary-button" type="submit">Save customer</button>
        </form>

        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "email", label: "Email" },
            { key: "status", label: "Status" },
            {
              key: "actions",
              label: "",
              render: (row) => (
                <button className="icon-button danger" onClick={() => remove(row._id)} title="Delete customer">
                  <Trash2 size={16} />
                </button>
              )
            }
          ]}
          rows={customers}
          emptyMessage="No matching customers."
        />
      </section>
    </div>
  );
};

export default Customers;
