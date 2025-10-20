import { uploadToCloudinary } from "./uploadToClodinary";

export const uploadMultipleToCloudinary = async (
  files: File[]
): Promise<string[]> => {
  const urls: string[] = [];

  for (const file of files) {
    const url = await uploadToCloudinary(file);
    urls.push(url);
  }

  return urls;
};