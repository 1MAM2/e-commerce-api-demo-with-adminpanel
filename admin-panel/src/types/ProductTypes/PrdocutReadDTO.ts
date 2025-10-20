export interface ProductReadDTO
{
    Id:number,
    ProductName:string,
    Price:number,
    ImgUrl:string,
    CategoryName:string,
    CategoryId:number,
    FinalPrice:number,
    Discount:number,
    CreateTime:string;
    Description:string
    GalleryImages:string[]
    Stock:number
}