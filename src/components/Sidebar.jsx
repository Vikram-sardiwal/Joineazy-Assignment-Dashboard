import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

function Sidebar({ user, onLogout }) {
  const isAdmin = user.role === "Admin";

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <GraduationCap size={32} className="text-indigo-400" />
        <h1 className="text-2xl font-bold">Joineazy</h1>
      </div>

      <p className="text-xs text-slate-400 uppercase mb-4">Main Menu</p>

      <nav className="space-y-2">
        <div className="flex items-center gap-3 bg-indigo-600 p-3 rounded-xl">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        <div className="flex items-center gap-3 p-3 text-slate-300">
          {isAdmin ? <Users size={20} /> : <BookOpen size={20} />}
          {isAdmin ? "Students" : "My Assignments"}
        </div>

        <div className="flex items-center gap-3 p-3 text-slate-300">
          <Settings size={20} />
          Settings
        </div>
      </nav>

      <div className="mt-auto border-t border-slate-700 pt-5">
        <div className="mb-4">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-slate-400">{user.role}</p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;