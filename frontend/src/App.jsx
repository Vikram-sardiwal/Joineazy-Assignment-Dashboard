
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import CoursesDashboard from "./pages/CoursesDashboard";
import CourseDetails from "./pages/CourseDetails";

// Protected route
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Dashboard layout
function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:block shrink-0">
        <Sidebar user={user} onLogout={logout} />
      </aside>

      <main className="flex-1 min-w-0 w-full">
        <Navbar user={user} />
        <CoursesDashboard user={user} />
      </main>
    </div>
  );
}

// Course layout
function CourseLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:block shrink-0">
        <Sidebar user={user} onLogout={logout} />
      </aside>

      <main className="flex-1 min-w-0 w-full">
        <Navbar user={user} />
        <CourseDetails user={user} />
      </main>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={user ? "/dashboard" : "/login"} replace />
        }
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CourseLayout />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
