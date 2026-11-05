
import { useState } from "react";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

import { users } from "./data/users";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [selectedUser, setSelectedUser] = useState(users[2]);

  // Restore login session
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(
        "joineazy_logged_in_user"
      );

      if (!savedUser) return null;

      const parsedUser = JSON.parse(savedUser);

      return (
        users.find((user) => user.id === parsedUser.id) || null
      );
    } catch {
      return null;
    }
  });

  const handleLogin = () => {
    if (!selectedUser) return;

    setLoggedInUser(selectedUser);

    localStorage.setItem(
      "joineazy_logged_in_user",
      JSON.stringify(selectedUser)
    );
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("joineazy_logged_in_user");
  };

  // Login Page
  if (!loggedInUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">

        {/* University Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="bg-red-700 text-white p-2 rounded-lg">
                <GraduationCap size={27} />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Joineazy
                </h1>
                <p className="text-xs text-slate-500">
                  University Management Portal
                </p>
              </div>
            </div>

            <span className="hidden sm:block text-sm text-slate-500">
              Student & Admin Portal
            </span>

          </div>
        </header>

        {/* Login Section */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">

          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden grid md:grid-cols-2">

            {/* Left Section */}
            <div className="hidden md:flex bg-red-800 text-white p-10 flex-col justify-center">

              <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center mb-8">
                <BookOpen size={30} />
              </div>

              <h2 className="text-3xl font-bold leading-snug">
                Welcome to Your
                <br />
                Learning Journey
              </h2>

              <p className="text-red-100 mt-5 leading-7">
                Access your academic dashboard, manage
                university activities and stay connected
                with your learning community.
              </p>

              <div className="mt-10 space-y-4 text-sm text-red-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={19} />
                  Secure Demo Login
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap size={19} />
                  Student & Admin Access
                </div>
              </div>

            </div>

            {/* Right Login Form */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">

              <div className="mb-8">
                <p className="text-red-700 text-sm font-semibold uppercase tracking-wider">
                  Account Login
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                  Welcome Back!
                </h2>

                <p className="text-slate-500 text-sm mt-2">
                  Select your account to access the portal.
                </p>
              </div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select User
              </label>

              <select
                value={selectedUser?.id ?? ""}
                onChange={(e) => {
                  const user = users.find(
                    (item) => item.id === Number(e.target.value)
                  );

                  setSelectedUser(user);
                }}
                className="w-full border border-slate-300 bg-white p-3.5 rounded-lg outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 text-slate-700"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.role}
                  </option>
                ))}
              </select>

              <button
                onClick={handleLogin}
                disabled={!selectedUser}
                className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white p-3.5 rounded-lg mt-7 flex justify-center items-center gap-2 font-semibold transition-colors"
              >
                Login to Dashboard
                <ArrowRight size={19} />
              </button>

              <div className="border-t border-slate-100 mt-8 pt-5 text-center">
                <p className="text-xs text-slate-400">
                  Demo Login • No Password Required
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  © 2026 Joineazy University Portal
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0">
        <Sidebar
          user={loggedInUser}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full">

        <Navbar user={loggedInUser} />

        <div className="w-full">
          {loggedInUser.role === "Student" ? (
            <StudentDashboard user={loggedInUser} />
          ) : (
            <AdminDashboard user={loggedInUser} />
          )}
        </div>

      </main>

    </div>
  );
}

export default App;
