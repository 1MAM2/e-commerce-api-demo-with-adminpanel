export interface ProductUpdateDTO {
  ProductName: string;
  Price: number;
  ImgUrl: string;
  CategoryId: number;
  FinalPrice: number;
  Discount: number;
  Description: string;
  GalleryImages: string[];
  Stock:number;
}
