export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded"></div>
          <h1 className="text-2xl font-bold text-black">TourWeaver</h1>
        </div>
        <nav className="flex items-center gap-6">
          <button className="text-black hover:text-green-600 transition">Sign In</button>
        </nav>
      </div>
    </header>
  );
}