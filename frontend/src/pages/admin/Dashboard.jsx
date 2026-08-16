import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    axiosClient
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load stats"));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-secondary" onClick={logout}>
          Log Out
        </button>
      </div>

      <nav className="admin-nav">
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/stores">Stores</Link>
      </nav>

      {error && <div className="error-banner">{error}</div>}

      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.users}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.stores}</div>
            <div className="stat-label">Total Stores</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.ratings}</div>
            <div className="stat-label">Total Ratings</div>
          </div>
        </div>
      )}
    </div>
  );
}