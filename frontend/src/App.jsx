import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/UserList";
import StoreList from "./pages/admin/StoreList";
import UserDetail from "./pages/admin/UserDetail";
import AddUser from "./pages/admin/AddUser";
import AddStore from "./pages/admin/AddStore";
import StoreBrowse from "./pages/normal/StoreBrowse";
import OwnerDashboard from "./pages/owner/Dashboard";
import UpdatePassword from "./pages/UpdatePassword";

function Home() {
  const { user, logout } = useAuth();
  if (!user) return <Login />;
  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <p>Logged in as {user.name} ({user.role})</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores"
        element={
          <ProtectedRoute allowedRoles={["NORMAL_USER"]}>
            <StoreBrowse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <UserList />
    </ProtectedRoute>
  }
/><Route
  path="/admin/stores"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <StoreList />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users/:id"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <UserDetail />
    </ProtectedRoute>
  }
/>
<Route
  path="/update-password"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "NORMAL_USER", "STORE_OWNER"]}>
      <UpdatePassword />
    </ProtectedRoute>
  }
/>
<Route path="/admin/users/new" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AddUser /></ProtectedRoute>} />
<Route path="/admin/stores/new" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AddStore /></ProtectedRoute>} />
    </Routes>
  );
}