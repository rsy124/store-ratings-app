import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function StoreBrowse() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchStores() {
    const params = {};
    if (search.name) params.name = search.name;
    if (search.address) params.address = search.address;

    axiosClient
      .get("/stores", { params })
      .then((res) => setStores(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load stores"));
  }

  async function submitRating(storeId, value) {
    setSavingId(storeId);
    try {
      await axiosClient.post(`/stores/${storeId}/ratings`, { value });
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit rating");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Browse Stores</h1>
	<button className="btn-secondary" onClick={() => navigate("/update-password")}>
  Update Password
</button>
        <button className="btn-secondary" onClick={logout}>
          Log Out
        </button>
      </div>

      <div className="filter-bar">
        <input
          placeholder="Search by name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
        <button className="btn-secondary" onClick={fetchStores}>
          Search
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="store-grid">
        {stores.map((s) => (
          <div key={s.id} className="stat-card" style={{ textAlign: "left" }}>
            <h3 style={{ marginTop: 0 }}>{s.name}</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>{s.address}</p>
            <p>
              <strong>Overall Rating:</strong> {s.overallRating ?? "No ratings yet"}
            </p>
            <p>
              <strong>Your Rating:</strong> {s.userRating ?? "Not rated yet"}
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className="btn-secondary"
                  disabled={savingId === s.id}
                  style={{
                    background: s.userRating === n ? "#4f46e5" : "white",
                    color: s.userRating === n ? "white" : "#1a1a1a",
                    padding: "6px 12px",
                  }}
                  onClick={() => submitRating(s.id, n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && !error && <p style={{ color: "#6b7280" }}>No stores found.</p>}
    </div>
  );
}