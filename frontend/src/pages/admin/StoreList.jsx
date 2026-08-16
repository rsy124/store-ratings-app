import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  function fetchStores() {
    const params = { ...filters, sortBy, order };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    axiosClient
      .get("/admin/stores", { params })
      .then((res) => setStores(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load stores"));
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSort(field) {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  }

  function arrow(field) {
    if (sortBy !== field) return "";
    return order === "asc" ? " ▲" : " ▼";
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Stores</h1>
        <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
          ← Dashboard
        </button>
      </div>

      <div className="filter-bar">
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} />
        <button className="btn-secondary" onClick={fetchStores}>
          Apply Filters
        </button>
	<button className="btn-secondary" onClick={() => navigate("/admin/stores/new")}>+ Add Store</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name{arrow("name")}</th>
            <th onClick={() => handleSort("email")}>Email{arrow("email")}</th>
            <th onClick={() => handleSort("address")}>Address{arrow("address")}</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.rating ?? "No ratings yet"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {stores.length === 0 && !error && <p style={{ color: "#6b7280", marginTop: 16 }}>No stores found.</p>}
    </div>
  );
}