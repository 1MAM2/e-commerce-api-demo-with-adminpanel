export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = "dbqcuz1aa";
  const uploadPreset = "Eshop_gorsel_yukleme";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const data = await response.json();
  return data.secure_url;
};
