import type { ProductReadDTO } from "../types/ProductTypes/PrdocutReadDTO";
import type { ProductCreateDTO } from "../types/ProductTypes/ProductCreateDTO";
import type { ProductUpdateDTO } from "../types/ProductTypes/ProductUpdateDTO";
import type { CategoryReadDTO } from "../types/CategoryTypes/CategoryReadDTO";
import api from "./api";
import type { CategoryCreateDTO } from "../types/CategoryTypes/CategoryCreateDTO";
import type { CategoryUpdateDTO } from "../types/CategoryTypes/CategoryUpdateDTO";
import type { OrderReadDTO } from "../types/OrderTypes/OrderReadDTO";
import type { UserReadDTO } from "../types/UserTypes/UserReadDTO";
import type { DashboardDTO } from "../types/DashBoard/DashboardDTO";
import { toast } from "react-toastify";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });
const BaseUrl = `${import.meta.env.VITE_API_URL}/api`;

export const AdminService = {
  //Product
  async GetAllProducts(): Promise<ProductReadDTO[]> {
    const res = await api.get(`${BaseUrl}/Product/adminGetAll`);
    const data = res.data;
    return data;
  },
  async CreateProduct(
    dto: ProductCreateDTO //:Promise<ProductReadDTO>
  ) {
    // try {
    //   const res = await api.post(`${BaseUrl}/Product`, dto);
    //   const data = res.data;
    //   return data;
    // } catch (err: any) {
    //   console.error("Ürün oluşturulurken hata:", err.response?.data || err);
    //   throw err;
    // }
    console.log("DTO:", dto);

    toast.success("Product has been created");
  },
  async UpdateProduct(id: number, dto: ProductUpdateDTO): Promise<void> {
    // try {
    //   await api.put(`${BaseUrl}/Product/${id}`, dto);
    // } catch (err: any) {
    //   console.error("Ürün update edilemedi hata:", err.response?.data || err);
    //   throw err;
    // }
    console.log("ProductId:", id, "DTO:", dto);

    toast.success("Product has been updated");
  },
  async DeleteProduct(id: number): Promise<void> {
    //Demo
    console.log("ProductId", id);

    // await api.delete(`${BaseUrl}/Product/${id}`);
    toast.success("Product has been deleted");
  },
  async GetProductById(id: number): Promise<ProductReadDTO> {
    const res = await api.get(`${BaseUrl}/Product/${id}`);
    return res.data;
  },

  //Categories
  async GetAllCategories(): Promise<CategoryReadDTO[]> {
    const res = await api.get(`${BaseUrl}/Category`);
    return res.data;
  },
  async DeleteCategory(id: number): Promise<void> {
    //await api.get(`${BaseUrl}/Category/${id}`);
    console.log("CategoryId:", id);

    toast.success("Category has been deleted");
  },
  async CreateCategory(
    dto: CategoryCreateDTO //Promise<CategoryReadDTO>
  ) {
    // const res = await api.post(`${BaseUrl}/Category`, dto);
    // return res.data;
    console.log("Category:", dto);

    toast.success("Category has been created");
  },
  async UpdateCategory(
    dto: CategoryUpdateDTO,
    id: number //: Promise<CategoryReadDTO>
  ) {
    // const res = await api.put(`${BaseUrl}/Category/${id}`, dto);
    // return res.data;
    console.log("CategoryId:", id, "DTO:", dto);
    toast.success("Category has been updated");
  },
  // Orders

  async GetAllOrders(): Promise<OrderReadDTO[]> {
    const res = await api.get(`${BaseUrl}/Order`);
    return res.data;
  },
  getOrderById: async (id: number): Promise<OrderReadDTO> => {
    const res = await api.get<OrderReadDTO>(`${BaseUrl}/Order/${id}`);
    return res.data;
  },
  updateOrderStatus: async (id: number, status: string): Promise<void> => {
    try {
      // Demo modu: Backend kapalı, sadece frontend simülasyon
      // Gerçek backend aktif olsaydı aşağıdaki satırı kullanacaktık
      // await api.patch(`${BaseUrl}/Order/${id}/status?status=${status}`);

      // Demo amaçlı: local state veya frontend mock
      console.log(`Demo: Order ${id} status changed to ${status}`);

      // Toast göster
      toast.success(`Order status has been changed (Demo)`);
    } catch (error) {
      toast.error("Failed to change order status (Demo)");
      console.error(error);
    }
  },
  deleteOrder: async (id: number): Promise<void> => {
    // await api.delete(`${BaseUrl}/${id}`);
    console.log("OrderId:", id);

    toast.success(`Order  has been deleted `);
  },

  // Users
  async getAllUsers(): Promise<UserReadDTO[]> {
    const res = await api.get(`${BaseUrl}/User`);
    return res.data;
  },

  async deleteAccount(id: number): Promise<void> {
    //Demo
    // await api.put(`${BaseUrl}/User/soft-delete/${id}`);
    console.log("UserId:", id);
    toast.success("Account has been deleted");
  },
  async changeRole(id: number, role: string): Promise<void> {
    //Demo olduğu için sadece bu endpoint kapalı
    // await api.put(`${BaseUrl}/User/change-role`, { id, role });
    console.log("UserId:", id, "Role:", role);

    toast.success("Role has been changed");
  },
  // DashBoard
  async dashboard(): Promise<DashboardDTO> {
    const res = await api.get(`${BaseUrl}/DashBoard`);
    return res.data;
  },
  async updateProductStock(productId: number, newStock: number): Promise<void> {
    // Demo
    console.log(" Stock update simulated:", { productId, newStock });

    // await api.put(
    //   `${BaseUrl}/Product/${productId}/stock`,
    //   { newStock },
    //   {
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );
    toast.success(`Stock updated to ${newStock} (Demo)`);
  },
};
