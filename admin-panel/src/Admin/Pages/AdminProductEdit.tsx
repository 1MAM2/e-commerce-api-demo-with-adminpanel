import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { uploadToCloudinary } from "../Utilits/uploadToClodinary";
import { uploadMultipleToCloudinary } from "../Utilits/uploadToCloudinaryMultipleFile";
import Loading from "../../Components/Loading";
import { AdminService } from "../../Services/AdminService";
import type { ProductUpdateDTO } from "../../types/ProductTypes/ProductUpdateDTO";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // local states
  const [loading, setLoading] = useState(true);
  const [ProductName, setProductName] = useState("");
  const [Price, setPrice] = useState<number>(0);
  const [ImgUrl, setImgUrl] = useState("");
  const [CategoryId, setCategoryId] = useState<number>(0);
  const [FinalPrice, setFinalPrice] = useState<number>(0);
  const [Discount, setDiscount] = useState<number>(0);
  const [Description, setDescription] = useState("");
  const [GalleryImages, setGalleryImages] = useState<string[]>([]);
  const [Stock, setStock] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await AdminService.GetProductById(Number(`${id}`));
        const data = res;
        setProductName(data.ProductName);
        setPrice(data.Price);
        setImgUrl(data.ImgUrl);
        setCategoryId(data.CategoryId);
        setFinalPrice(data.FinalPrice);
        setDiscount(data.Discount);
        setDescription(data.Description);
        setStock(data.Stock);
        setGalleryImages(data.GalleryImages || []);
      } catch {
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Dropzone single image (main)
  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: async (files) => {
        const file = files[0];
        if (file) {
          const url = await uploadToCloudinary(file);
          setImgUrl(url);
          toast.success("Main image uploaded!");
        }
      },
    });

  // Dropzone multiple images (gallery)
  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: async (files) => {
      toast.info("Uploading gallery images...");
      const urls = await uploadMultipleToCloudinary(files);
      setGalleryImages((prev) => [...prev, ...urls]);
      toast.success("Gallery images uploaded!");
    },
  });

  const handleSave = async () => {
    const updated: ProductUpdateDTO = {
      ProductName,
      Price,
      ImgUrl,
      CategoryId,
      FinalPrice,
      Discount,
      Description,
      GalleryImages,
      Stock,
    };

    try {
      await AdminService.UpdateProduct(Number(id), updated);
      toast.success("Product updated successfully!");
      navigate("/admin-panel/adminProducts");
    } catch {
      toast.error("Error updating product");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3">
          🛠 Edit Product
        </h2>

        {/* ====== Product Info ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-500">Product Name</p>
            <p className="text-lg font-medium text-gray-800">{ProductName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-lg font-medium text-gray-800">{Price} ₺</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category ID</p>
            <p className="text-lg font-medium text-gray-800">{CategoryId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Discount</p>
            <p className="text-lg font-medium text-gray-800">
              {Discount * 100}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stock</p>
            <p className="text-lg font-medium text-gray-800">{Stock}</p>
          </div>
        </div>

        {/* ====== Editable Form ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={ProductName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={Price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discount</label>
            <input
              type="text"
              value={Discount * 100}
              onChange={(e) => setDiscount(Number(e.target.value) / 100)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="text"
              value={Stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Category ID
            </label>
            <input
              type="number"
              value={CategoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* ====== Description ====== */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* ====== Image Upload ====== */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Main Image</h3>
          <div
            {...getMainRootProps()}
            className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          >
            <input {...getMainInputProps()} />
            <p className="text-gray-500">Drag & drop or click to upload</p>
          </div>

          {ImgUrl && (
            <img
              src={ImgUrl}
              alt="main"
              className="w-40 h-40 object-cover mt-3 rounded-lg border"
            />
          )}
        </div>

        {/* ====== Gallery Upload ====== */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Gallery Images</h3>
          <div
            {...getGalleryRootProps()}
            className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          >
            <input {...getGalleryInputProps()} />
            <p className="text-gray-500">Drag & drop multiple images</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {GalleryImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`gallery-${i}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* ====== Save Button ====== */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
