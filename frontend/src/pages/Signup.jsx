import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const rules = {
  name: {
    validate: (v) => v.length >= 20 && v.length <= 60,
    hint: "20–60 characters",
  },
  email: {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    hint: "A valid email address",
  },
  address: {
    validate: (v) => v.length > 0 && v.length <= 400,
    hint: "Up to 400 characters",
  },
  password: {
    validate: (v) =>
      v.length >= 8 &&
      v.length <= 16 &&
      /[A-Z]/.test(v) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(v),
    hint: "8–16 chars, 1 uppercase letter, 1 special character",
  },
};

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
  }

  function fieldStatus(field) {
    if (!touched[field] || form[field] === "") return "";
    return rules[field].validate(form[field]) ? "valid" : "invalid";
  }

  const allValid = Object.keys(rules).every((f) => rules[f].validate(form[f]));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await axiosClient.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="auth-card">
      <h2>Sign Up</h2>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit}>
        {["name", "email", "address", "password"].map((field) => (
          <div className="form-group" key={field}>
            <label style={{ textTransform: "capitalize" }}>{field}</label>
            <input
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldStatus(field)}
              required
            />
            <div className={`hint ${fieldStatus(field)}`}>{rules[field].hint}</div>
          </div>
        ))}
        <button type="submit" disabled={!allValid}>
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}