import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/30 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          Smart Hotel AI
        </h1>

        <div className="flex gap-8 text-lg">

          <Link
            to="/"
            className="hover:text-cyan-400 transition"
          >
            Home
          </Link>

          <Link
            to="/rooms"
            className="hover:text-cyan-400 transition"
          >
            Rooms
          </Link>

          <Link
            to="/login"
            className="hover:text-cyan-400 transition"
          >
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;