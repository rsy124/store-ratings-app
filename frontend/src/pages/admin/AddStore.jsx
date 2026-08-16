import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function AddStore() {
  const [store, setStore] = useState({ name: "", email: "", address: "" });
  const [includeOwner, setIncludeOwner] = useState(false);
  const [owner, setOwner] = useState({ name: "", email: "", address: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = includeOwner ? { ...store, owner } : store;
      await axiosClient.post("/admin/stores", payload);
      setSuccess("Store created successfully.");
      setStore({ name: "", email: "", address: "" });
      setOwner({ name: "", email: "", address: "", password: "" });
      setIncludeOwner(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create store");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add Store</h1>
        <button className="btn-secondary" onClick={() => navigate("/admin/stores")}>
          ← Back to Stores
        </button>
      </div>

      <div className="auth-card" style={{ margin: 0, maxWidth: 500 }}>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="hint valid" style={{ marginBottom: 16 }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Store Name</label>
            <input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Store Email</label>
            <input type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Store Address</label>
            <input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={includeOwner}
                onChange={(e) => setIncludeOwner(e.target.checked)}
                style={{ width: "auto", marginRight: 8 }}
              />
              Create a new Store Owner account for this store
            </label>
          </div>

          {includeOwner && (
            <>
              <div className="form-group">
                <label>Owner Name</label>
                <input value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} required />
                <div className="hint">20–60 characters</div>
              </div>
              <div className="form-group">
                <label>Owner Email</label>
                <input type="email" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Owner Address</label>
                <input value={owner.address} onChange={(e) => setOwner({ ...owner, address: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Owner Password</label>
                <input type="password" value={owner.password} onChange={(e) => setOwner({ ...owner, password: e.target.value })} required />
                <div className="hint">8–16 chars, 1 uppercase, 1 special character</div>
              </div>
            </>
          )}

          <button type="submit">Create Store</button>
        </form>
      </div>
    </div>
  );
}