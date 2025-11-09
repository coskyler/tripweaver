export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          {/* Tour/Pathfinding SVG logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
            className="w-8 h-8 text-green-600"
          >
            {/* Route line */}
            <path
              d="M8 36 C16 28, 24 20, 40 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Start point */}
            <circle cx="8" cy="36" r="4" fill="currentColor" />
            {/* End point */}
            <circle cx="40" cy="12" r="4" fill="white" stroke="currentColor" strokeWidth="3" />
          </svg>


          <h1 className="text-2xl font-bold text-black">Tourweaver</h1>
        </div>

        {/* Right-side actions */}
        <nav className="flex items-center gap-6">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white grid place-items-center font-bold text-lg">
            U
          </div>
        </nav>

      </div>
    </header>
  );
}
