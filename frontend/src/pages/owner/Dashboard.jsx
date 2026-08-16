import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get("/owner/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load dashboard"));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{data ? data.storeName : "Owner Dashboard"}</h1>
	<button className="btn-secondary" onClick={() => navigate("/update-password")}>
  Update Password
</button>
        <button className="btn-secondary" onClick={logout}>
          Log Out
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {data && (
        <>
          <div className="stat-card" style={{ maxWidth: 240, marginBottom: 24 }}>
            <div className="stat-value">{data.averageRating ?? "—"}</div>
            <div className="stat-label">Average Rating</div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.map((r) => (
                <tr key={r.userId}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.raters.length === 0 && <p style={{ color: "#6b7280", marginTop: 16 }}>No ratings yet.</p>}
        </>
      )}
    </div>
  );
}