export type DashboardDTO = {
  userStats: {
    totalUsers: number;
    totalAdmins: number;
    totalCustomers: number;
    activeUsers: number;
    recentUsers: { Id: number; UserName: string; Email: string; CreatedAt: string; }[];
  };
  orderStats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    canceledOrders: number;
    averageOrder: number;
    recentOrders: { Id: number; UserId: number; TotalAmount: number; Status: string; CreatedAt: string; }[];
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: { Year: number; Month: number; Total: number; }[];
  };
  topProducts: { ProductId: number; ProductName?: string; Quantity: number; }[];
  lowStockProducts :{ProductName?: string; Stock:number}[];
}