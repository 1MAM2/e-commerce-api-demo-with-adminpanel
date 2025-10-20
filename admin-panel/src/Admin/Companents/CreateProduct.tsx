import { useState, useRef, useEffect } from "react";
import type { ProductReadDTO } from "../../types/ProductTypes/PrdocutReadDTO";
import { AdminService } from "../../Services/AdminService";
import { uploadToCloudinary } from "../Utilits/uploadToClodinary";
import { useDropzone } from "react-dropzone";
import { uploadMultipleToCloudinary } from "../Utilits/uploadToCloudinaryMultipleFile";
import { toast } from "react-toastify";
import type { CategoryReadDTO } from "../../types/CategoryTypes/CategoryReadDTO";

interface CreateProductProps {
  onClose: () => void;
  onCreated: (newProduct: ProductReadDTO) => void;
}

const CreateProduct = ({ onClose, onCreated }: CreateProductProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryReadDTO[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductImgUrl, setNewProductImgUrl] = useState<string>("");
  const [newProductDescription, setNewProductDescription] =
    useState<string>("");
  const [newProductDiscount, setNewProductDiscount] = useState<number>(0);
  const [newProductCategoryId, setNewProductCategoryId] = useState<number>(0);
  const [newProductStock, setNewProductStock] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // çoklu görsel upload

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingGallery] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await AdminService.GetAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Kategori çekilirken hata:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleUploadImage = async () => {
    if (!imageFile) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(imageFile);
      setNewProductImgUrl(url);
    } finally {
      setUploading(false);
    }
  };
  const handleFileUploadMultiple = async (files: File[]) => {
    try {
      const urls = await uploadMultipleToCloudinary(files);
      setGalleryUrls(urls); // state içine atarsın
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductName.trim()) {
      toast.error("ProductName required!");
      return;
    }
    if (!newProductPrice || newProductPrice <= 0) {
      toast.error("Invalid price.");
      return;
    }
    if (!newProductImgUrl) {
      toast.error("Main image not loading");
      return;
    }

    try {
      toast.loading("Product creating...");
      const created = await AdminService.CreateProduct({
        ProductName: newProductName,
        Price: newProductPrice,
        ImgUrl: newProductImgUrl,
        GalleryImages: galleryUrls,
        Description: newProductDescription,
        CategoryId: newProductCategoryId,
        Discount: newProductDiscount,
        Stock: newProductStock,
      });

      toast.dismiss(); // loading mesajını kapat
      toast.success("Product create success");
      //onCreated(created);
      onClose();

      // form reset
      setNewProductName("");
      setNewProductPrice(0);
      setNewProductImgUrl("");
      setImageFile(null);
      setGalleryFiles([]);
      setGalleryUrls([]);
      setNewProductCategoryId(0);
      setNewProductDiscount(0);
      setNewProductStock(0);
      setNewProductDescription("");
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while creating the product");
      console.error("Error creating product:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 space-y-3">
        <h3 className="text-xl font-semibold mb-2">Create a new Product</h3>

        <input
          type="text"
          placeholder="ProductName"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="product_Description"
          value={newProductDescription}
          onChange={(e) => setNewProductDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(parseFloat(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Discount"
          value={newProductDiscount}
          onChange={(e) => setNewProductDiscount(parseFloat(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProductStock}
          onChange={(e) => setNewProductStock(parseInt(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={newProductCategoryId}
          onChange={(e) => setNewProductCategoryId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value={0}>Select Category</option>
          {categories.map((cat) => (
            <option key={cat.Id} value={cat.Id}>
              {cat.CategoryName}
            </option>
          ))}
        </select>
        <div
          className="border-2 border-dashed p-4 text-center cursor-pointer hover:border-blue-500"
          onClick={() => fileInputRef.current?.click()}
        >
          {imageFile ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
              <p className="text-sm text-gray-600">{imageFile.name}</p>
            </div>
          ) : (
            "Click and load your image"
          )}
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
        />

        <button
          onClick={handleUploadImage}
          disabled={!imageFile || uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {uploading ? "Loading..." : "UploadMainImage"}
        </button>
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-4 text-center cursor-pointer hover:border-blue-500"
        >
          <input {...getInputProps()} />
          {galleryFiles.length === 0
            ? "Drop Images or click and load"
            : galleryFiles.map((file) => <p key={file.name}>{file.name}</p>)}
        </div>

        <button
          onClick={() => handleFileUploadMultiple(galleryFiles)}
          disabled={galleryFiles.length === 0 || uploadingGallery}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {uploadingGallery ? "Loading..." : "Gallery Upload"}
        </button>

        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={handleCreateProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
