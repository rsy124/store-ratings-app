import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load user"));
  }, [id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>User Detail</h1>
        <button className="btn-secondary" onClick={() => navigate("/admin/users")}>
          ← Back to Users
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {user && (
        <div className="stat-card" style={{ textAlign: "left", maxWidth: 500 }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role === "STORE_OWNER" && (
            <p><strong>Store Rating:</strong> {user.rating ?? "No ratings yet"}</p>
          )}
        </div>
      )}
    </div>
  );
}