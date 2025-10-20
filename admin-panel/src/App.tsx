import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";

import { ToastContainer } from "react-toastify";
import AdminLayout from "./Admin/AdminLayout";
import AdminProducts from "./Admin/Pages/AdminProducts";
import AdminDashBoard from "./Admin/Pages/AdminDashBoard";
import AdminOrders from "./Admin/Pages/AdminOrders";
import AdminUser from "./Admin/Pages/AdminUser";
import AdminCategory from "./Admin/Pages/AdminCategory";
import AdminProductEdit from "./Admin/Pages/AdminProductEdit";
import Account from "./Pages/Account";
function App() {
  // const { checkAuth } = useAuth();

  // useEffect(() => {
  //   checkAuth();
  // }, []);
  return (
    <>
      <Navbar />
      <div className="mainRoot">
        <Routes>
          <Route path="/account" element={<Account />} />
          {/* Admin */}
          <Route path="/admin-panel" element={<AdminLayout />}>
            {/* Varsayılan yönlendirme */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Alt rotalar */}
            <Route path="dashboard" element={<AdminDashBoard />} />
            <Route path="adminProducts" element={<AdminProducts />} />
            <Route path="adminProducts/:id" element={<AdminProductEdit />} />
            <Route path="adminOrders" element={<AdminOrders />} />
            <Route path="adminUser" element={<AdminUser />} />
            <Route path="adminCategory" element={<AdminCategory />} />
          </Route>
        </Routes>

        <ToastContainer position="top-right" />
      </div>
    </>
  );
}

export default App;
