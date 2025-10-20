import { NavLink, Outlet } from "react-router-dom";

function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white/60 backdrop-blur sticky top-0 z-20 border-b">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>
    </header>
  );
}

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-white  hover:bg-blue-800 hover:text-white ${
      isActive ? "bg-blue-900 font-medium text-black" : "text-black"
    }`;

  return (
    <aside className="w-64 min-w-[220px] border-r hidden md:block bg-gradient-to-b from-blue-900 via-blue-600 to-blue-700 text-white">
      <div className="p-4 border-b text-2xl ">
        <div className="text-2xl font-bold">MyStore</div>
        <div className="text-md text-gray-500 mt-1">Admin Dashboard</div>
      </div>

      <nav className="p-4 space-y-1 text-2xl  bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
        <NavLink to="dashboard" className={linkClass}>
          <span>🏠</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="adminProducts" className={linkClass}>
          <span>🛒</span>
          <span>Products</span>
        </NavLink>
        <NavLink to="adminCategory" className={linkClass}>
          <span>📂</span>
          <span>Categories</span>
        </NavLink>
        <NavLink to="adminOrders" className={linkClass}>
          <span>📦</span>
          <span>Orders</span>
        </NavLink>
        <NavLink to="adminUser" className={linkClass}>
          <span>👥</span>
          <span>Users</span>
        </NavLink>
      </nav>

      <div className="mt-auto p-4 text-xs text-gray-500">
        v1.0 • React + TS + Tailwind
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6">
          {/* Outlet will render nested admin pages */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
