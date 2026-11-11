
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-5">
          <div className="bg-red-700 text-white p-3 rounded-xl">
            <GraduationCap size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Welcome to Joineazy
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-7">
          Login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border rounded-lg p-3 outline-none focus:border-red-700"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg font-semibold flex justify-center items-center gap-2"
          >
            <LogIn size={18} />
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-700 font-semibold">
            Register
          </Link>
        </p>

        <div className="mt-6 border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold mb-2">Demo credentials:</p>
          <p>Student: student1@gmail.com</p>
          <p>Professor: admin1@gmail.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
