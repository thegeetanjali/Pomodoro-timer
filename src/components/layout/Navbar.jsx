import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname === to ? "text-rose-500" : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="w-full max-w-2xl mx-auto flex items-center justify-between px-4 py-4">
      <Link to="/" className="flex items-center gap-2 font-bold text-gray-800">
        <span className="text-xl">🍅</span>
        <span>Pomodoro</span>
      </Link>
      <div className="flex items-center gap-6">
        {navLink("/", "Timer")}
        {navLink("/dashboard", "Dashboard")}
      </div>
    </nav>
  );
}
