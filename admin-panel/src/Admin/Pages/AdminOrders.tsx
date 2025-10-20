import { useEffect, useState } from "react";
import Loading from "../../Components/Loading";
import { AdminService } from "../../Services/AdminService";
import type { OrderReadDTO } from "../../types/OrderTypes/OrderReadDTO";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export const statusMap: Record<number, string> = {
  0: "Cancelled",
  1: "Paid",
  2: "Pending",
  3: "Processing",
  4: "Shipped",
  5: "Delivered",
};

// Renk haritası
export const colorMap: Record<number, string> = {
  0: "bg-red-100 text-red-800",
  1: "bg-green-100 text-green-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-blue-100 text-blue-800",
  4: "bg-blue-300 text-blue-800",
  5: "bg-green-300 text-green-800",
};

const OrderList = () => {
  const [orders, setOrders] = useState<OrderReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<number | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Siparişleri çek
  useEffect(() => {
    fetchOrders();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const res = await AdminService.GetAllOrders();
      setOrders(res);
    } catch (err) {
      console.error("Siparişler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  // Durumu güncelle

  const updateOrderStatus = async (orderId: number, statusNum: number) => {
    try {
      await AdminService.updateOrderStatus(orderId, statusNum.toString());

      setEditingId(null);
      setNewStatus(null);
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">📦 Orders List</h1>

      <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="py-3 px-4">Id</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Total Price</th>
            <th className="py-3 px-4">Last Status Update</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.Id}>
              <tr
                className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => toggleExpand(order.Id)}
              >
                <td className="py-3 px-4">{order.Id}</td>
                <td className="py-3 px-4">{order.UserId}</td>
                <td className="py-3 px-4">{order.TotalPrice.toFixed(2)} ₺</td>
                <td className="py-3 px-4">
                  {new Date(order.CreatedAt).toLocaleString("tr-TR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-3 px-4">
                  {editingId === order.Id ? (
                    <select
                      value={newStatus ?? order.Status}
                      onChange={(e) => setNewStatus(Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="border rounded-md p-1 text-sm"
                    >
                      {Object.entries(statusMap).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-md ${
                        colorMap[Number(order.Status)]
                      }`}
                    >
                      {statusMap[Number(order.Status)]}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingId === order.Id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order.Id,
                            newStatus ?? Number(order.Status)
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewStatus(null);
                        }}
                        className="bg-gray-300 px-3 py-1 text-sm rounded-md hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(order.Id);
                        setNewStatus(Number(order.Status));
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Change Status
                    </button>
                  )}
                </td>
              </tr>

              {/* Order Items detay tablosu */}
              <AnimatePresence>
                {expandedOrderId === order.Id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan={5} className="p-0 bg-gray-50">
                      <div className="p-4 border-t border-gray-200">
                        <h4 className="text-md font-semibold mb-2 text-gray-700">
                          🧾 Order Items
                        </h4>
                        <table className="w-full text-sm border rounded-md">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left">
                                Product ID
                              </th>
                              <th className="px-3 py-2 text-left">
                                Product Name
                              </th>
                              <th className="px-3 py-2 text-left">Image</th>
                              <th className="px-3 py-2 text-left">Quantity</th>
                              <th className="px-3 py-2 text-left">
                                Unit Price
                              </th>
                              <th className="px-3 py-2 text-left">
                                Total Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.OrderItems.map((item, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2">{item.ProductId}</td>
                                <td className="px-3 py-2">
                                  {item.ProductName}
                                </td>
                                <td className="px-3 py-2">
                                  <img
                                    src={item.ImgUrl}
                                    alt={item.ProductName}
                                    className="w-12 h-12 object-cover rounded-md shadow-sm border"
                                  />
                                </td>
                                <td className="px-3 py-2">{item.Quantity}</td>
                                <td className="px-3 py-2">₺{item.UnitPrice}</td>
                                <td className="px-3 py-2 font-semibold">
                                  ₺{item.TotalPrice}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default OrderList;
