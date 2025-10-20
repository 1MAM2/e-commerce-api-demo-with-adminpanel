import { useEffect, useState } from "react";
import type { DashboardDTO } from "../../types/DashBoard/DashboardDTO";
import { AdminService } from "../../Services/AdminService";
import Loading from "../../Components/Loading";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await AdminService.dashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) return <Loading />;

  const { userStats, orderStats, revenue, topProducts,lowStockProducts } = dashboardData;
  console.log(dashboardData);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      {/* Kullanıcı & Sipariş Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Total Users</span>
          <span className="text-2xl font-bold">{userStats.totalUsers}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Total Admins</span>
          <span className="text-2xl font-bold">{userStats.totalAdmins}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Total Customers</span>
          <span className="text-2xl font-bold">{userStats.totalCustomers}</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Total Orders</span>
          <span className="text-2xl font-bold">{orderStats.totalOrders}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Completed Orders</span>
          <span className="text-2xl font-bold">
            {orderStats.completedOrders}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Pending Orders</span>
          <span className="text-2xl font-bold">{orderStats.pendingOrders}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-gray-500">Canceled Orders</span>
          <span className="text-2xl font-bold">
            {orderStats.canceledOrders}
          </span>
        </div>
      </div>

      {/* Aylık Kazanç Grafiği */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={revenue.monthlyRevenue.map((r) => ({
              name: `${r.Month}/${r.Year}`,
              Total: r.Total,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Total"
              stroke="#4ade80"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Product ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.ProductId} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{p.ProductId}</td>
                <td className="py-2 px-4">{p.ProductName || "Unknown"}</td>
                <td className="py-2 px-4">{p.Quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Users */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {userStats.recentUsers.map((u) => (
              <tr key={u.Id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{u.Id}</td>
                <td className="py-2 px-4">{u.UserName}</td>
                <td className="py-2 px-4">{u.Email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Low Stock Products */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">⚠️ Low Stock Products</h2>
        {lowStockProducts.length > 0 ? (
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Stock Quantity</th>
                <th className="py-2 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => (
                <tr key={p.ProductName} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{p.ProductName}</td>
                  <td className="py-2 px-4">{p.Stock}</td>
                  <td className="py-2 px-4 text-center">
                    {p.Stock === 0 ? (
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    ) : p.Stock < 5 ? (
                      <span className="text-orange-500 font-medium">
                        Critical
                      </span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Low</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">All products have sufficient stock ✅</p>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">User ID</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orderStats.recentOrders.map((o) => (
              <tr key={o.Id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{o.Id}</td>
                <td className="py-2 px-4">{o.UserId}</td>
                <td className="py-2 px-4">{o.TotalAmount}</td>
                <td className="py-2 px-4">{o.Status}</td>
                <td className="py-2 px-4">
                  {new Date(o.CreatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
