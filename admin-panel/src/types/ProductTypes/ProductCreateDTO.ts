export interface ProductCreateDTO {
  ProductName: string;
  Price: number;
  ImgUrl: string;
  CategoryId: number;
  Discount: number;
  Description: string;
  GalleryImages: string[];
  Stock:number;
}
