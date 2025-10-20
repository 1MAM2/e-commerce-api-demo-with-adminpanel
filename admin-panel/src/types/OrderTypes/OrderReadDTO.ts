import type { OrderItemReadDTO } from "./OrderItemReadDTO";

export interface OrderReadDTO {
  Id:number;
  UserId: number;
  CreatedAt: string;
  TotalPrice: number;
  Status: OrderStatus; // enum tipi
  OrderItems: OrderItemReadDTO[];
  ImgUrl:string
  ProductName:string
}

export type OrderStatus = 
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";
