import { useEffect, useState } from "react";
import Loading from "../../Components/Loading";
import { AdminService } from "../../Services/AdminService";
import type { UserReadDTO } from "../../types/UserTypes/UserReadDTO";

const UserList = () => {
  const [users, setUsers] = useState<UserReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Arama için

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await AdminService.getAllUsers();
      setUsers(res);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;
    try {
      await AdminService.deleteAccount(userId);
      setUsers((prev) => prev.filter((u) => u.Id !== userId));
    } catch (err) {
      console.error("An error caught:", err);
    }
  };

  const updateUserRole = (Id: number, role: string) => {
    AdminService.changeRole(Id, role);
  };

  if (loading) return <Loading />;

  // Filtreleme: ID veya Name üzerinden arama
  const filteredUsers = users.filter(
    (user) =>
      user.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Id.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">👥 Users</h1>

      {/* Arama input */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by User ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
      </div>

      <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="py-3 px-4">User ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Phone Number</th>
            <th className="py-3 px-4">Address</th>
            <th className="py-3 px-4">Email Confirmed</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.Id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">{user.Id}</td>
              <td className="py-3 px-4">{user.UserName}</td>
              <td className="py-3 px-4">{user.Email}</td>
              <td className="py-3 px-4">{user.PhoneNumber}</td>
              <td className="py-3 px-4">{user.Address}</td>
              <td className="py-3 px-4">{user.IsEmailConfirmed ? "Yes" : "No"}</td>
              <td className="py-3 px-4">
                {editingId === user.Id ? (
                  <select
                    value={newRole || user.Role}
                    onChange={(e) => setNewRole(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="border rounded-md p-1 text-sm"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                ) : (
                  user.Role
                )}
              </td>
              <td className="py-3 px-4 flex gap-2">
                {editingId === user.Id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateUserRole(user.Id, newRole || user.Role);
                      }}
                      className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                        setNewRole("");
                      }}
                      className="bg-gray-300 px-3 py-1 text-sm rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(user.Id);
                        setNewRole(user.Role);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user.Id);
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
