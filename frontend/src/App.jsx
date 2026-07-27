import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Customers from "./pages/Customers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import Payments from "./pages/Payments.jsx";
import Reports from "./pages/Reports.jsx";

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="customers" element={<Customers />} />
      <Route path="orders" element={<Orders />} />
      <Route path="payments" element={<Payments />} />
      <Route path="reports" element={<Reports />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
