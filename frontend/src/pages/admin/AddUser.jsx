import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function AddUser() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "NORMAL_USER" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axiosClient.post("/admin/users", form);
      setSuccess("User created successfully.");
      setForm({ name: "", email: "", address: "", password: "", role: "NORMAL_USER" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add User</h1>
        <button className="btn-secondary" onClick={() => navigate("/admin/users")}>
          ← Back to Users
        </button>
      </div>

      <div className="auth-card" style={{ margin: 0, maxWidth: 500 }}>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="hint valid" style={{ marginBottom: 16 }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
            <div className="hint">20–60 characters</div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
            <div className="hint">8–16 chars, 1 uppercase, 1 special character</div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="NORMAL_USER">Normal User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit">Create User</button>
        </form>
      </div>
    </div>
  );
}