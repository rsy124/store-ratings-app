import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  function fetchUsers() {
    const params = { ...filters, sortBy, order };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    axiosClient
      .get("/admin/users", { params })
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load users"));
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
        <h1>Users</h1>
        <button className="btn-secondary" onClick={() => navigate("/admin/dashboard")}>
          ← Dashboard
        </button>
      </div>

      <div className="filter-bar">
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <button className="btn-secondary" onClick={fetchUsers}>
          Apply Filters
        </button>
	<button className="btn-secondary" onClick={() => navigate("/admin/users/new")}>+ Add User</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name{arrow("name")}</th>
            <th onClick={() => handleSort("email")}>Email{arrow("email")}</th>
            <th onClick={() => handleSort("address")}>Address{arrow("address")}</th>
            <th onClick={() => handleSort("role")}>Role{arrow("role")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} onClick={() => navigate(`/admin/users/${u.id}`)} style={{ cursor: "pointer" }}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && !error && <p style={{ color: "#6b7280", marginTop: 16 }}>No users found.</p>}
    </div>
  );
}