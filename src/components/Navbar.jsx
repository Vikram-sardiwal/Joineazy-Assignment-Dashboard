import { Bell, Search } from "lucide-react";

function Navbar({ user }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Welcome back, {user.name}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 w-28"
          />
        </div>

        <Bell size={21} className="text-slate-500" />

        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}

export default Navbar;