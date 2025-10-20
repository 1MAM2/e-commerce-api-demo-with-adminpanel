import { useEffect, useState } from "react";
import { AdminService } from "../../Services/AdminService";
import { FaTrash, FaPlus } from "react-icons/fa";
import { usePagination } from "../../Custom Hooks/usePagination";
import Loading from "../../Components/Loading";
import type { CategoryReadDTO } from "../../types/CategoryTypes/CategoryReadDTO";

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryReadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 5;

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await AdminService.GetAllCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Filter & Pagination
  const filteredCategories = categories.filter((c) =>
    c.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { currentPage, totalPages, currentData, goToPage, nextPage, prevPage } =
    usePagination(filteredCategories, itemsPerPage);

  // 🔹 Add category
  const handleAddCategory = async () => {
    if (!newName.trim()) return alert("Category name cannot be empty!");
    try {
      const newCat = await AdminService.CreateCategory({
        CategoryName: newName,
      });
      setCategories((prev) => [...prev, newCat]);
      setNewName("");
      setShowAdd(false);
    } catch (err) {
      console.error(err);
      alert("Error adding category!");
    }
  };

  // 🔹 Delete category
  const handleDeleteCategory = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await AdminService.DeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.Id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting category!");
    }
  };

  // 🔹 Inline edit
  const startEditing = (id: number, value: string) => {
    setEditingId(id);
    setEditingValue(value);
  };

  const saveEdit = async (id: number) => {
    if (!editingValue.trim()) return alert("Name cannot be empty!");
    try {
      const updated = {
        ...categories.find((c) => c.Id === id)!,
        Name: editingValue,
      };
      await AdminService.UpdateCategory(updated, id);
      setCategories((prev) => prev.map((c) => (c.Id === id ? updated : c)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Error updating category!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-base font-medium text-gray-700">
                  ID
                </th>
                <th className="px-8 py-4 text-left text-base font-medium text-gray-700">
                  Name
                </th>
                <th className="px-8 py-4 text-center text-base font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData().map((c) => (
                <tr
                  key={c.Id}
                  className="hover:bg-blue-50 hover:shadow-md transition-all duration-150 rounded-lg"
                >
                  <td className="px-8 py-4 text-base">{c.Id}</td>

                  {/* Inline edit name */}
                  <td className="px-8 py-4 text-base">
                    {editingId === c.Id ? (
                      <input
                        type="text"
                        value={editingValue}
                        autoFocus
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => saveEdit(c.Id)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(c.Id)}
                        className="border border-blue-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                    ) : (
                      <span
                        className="hover:text-blue-600 cursor-pointer"
                        onClick={() => startEditing(c.Id, c.CategoryName)}
                      >
                        {c.CategoryName}
                      </span>
                    )}
                  </td>

                  <td className="px-8 py-4 text-center">
                    <button
                      onClick={() => handleDeleteCategory(c.Id)}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors"
                      title="Delete Category"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-2 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Category */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
        {showAdd ? (
          <>
            <input
              type="text"
              placeholder="Category Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
            >
              <FaPlus /> Add
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 border rounded-md"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
          >
            <FaPlus /> Add Category
          </button>
        )}
      </div>
    </div>
  );
}
