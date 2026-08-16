import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const passwordValid = (v) =>
  v.length >= 8 &&
  v.length <= 16 &&
  /[A-Z]/.test(v) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(v);

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const newValid = passwordValid(newPassword);
  const matches = newPassword === confirmPassword && confirmPassword !== "";

  function backPath() {
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "STORE_OWNER") return "/owner/dashboard";
    return "/stores";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!matches) {
      setError("New password and confirmation do not match");
      return;
    }

    try {
      await axiosClient.put("/auth/password", { currentPassword, newPassword });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Update Password</h1>
        <button className="btn-secondary" onClick={() => navigate(backPath())}>
          ← Back
        </button>
      </div>

      <div className="auth-card" style={{ margin: 0, maxWidth: 420 }}>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="hint valid" style={{ marginBottom: 16 }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={newPassword ? (newValid ? "valid" : "invalid") : ""}
              required
            />
            <div className={`hint ${newPassword ? (newValid ? "valid" : "invalid") : ""}`}>
              8–16 chars, 1 uppercase letter, 1 special character
            </div>
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPassword ? (matches ? "valid" : "invalid") : ""}
              required
            />
            {confirmPassword && !matches && <div className="hint invalid">Passwords do not match</div>}
          </div>
          <button type="submit" disabled={!newValid || !matches || !currentPassword}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}