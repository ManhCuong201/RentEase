import admin from "../config/firebaseAdmin.js";
import { v4 as uuid } from "uuid";
import { Buffer } from "buffer"; // Import Buffer
import { log } from "console";

const bucket = admin.storage().bucket();

const uploadImages = async (imageFiles) => {
  if (imageFiles.length > 10) {
    throw new Error("Maximum 10 images allowed");
  }

  const uploadedFiles = await Promise.all(
    imageFiles.map(async (image, index) => {
      const fileName = `images/${uuid()}-${image.name}`; // Sử dụng uuid để đảm bảo tên tệp duy nhất
      const fileUpload = bucket.file(fileName);

      // Chuyển đổi base64 thành buffer
      const base64EncodedImageString = image.base64.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

      await fileUpload.save(imageBuffer, {
        metadata: {
          contentType: image.type || "image/jpeg", // Sử dụng loại được cung cấp hoặc mặc định là jpeg
        },
      });

      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-17-2025", // Đặt ngày hết hạn
      });

      return { fileName, url }; // Trả về chi tiết tệp bao gồm URL
    })
  );

  return uploadedFiles;
};

const deleteFilesFromFirebaseStorage = async (imageUrls) => {
  try {
    for (const imageUrl of imageUrls) {
      try {
        // Extract filename from the URL
        const decodedUrl = decodeURIComponent(imageUrl);

        // Extract the file path between '/images/' and the query parameters
        const matches = decodedUrl.match(/\/images\/(.*?)\?/);
        if (!matches || !matches[1]) {
          console.log(`Invalid URL format for: ${imageUrl}`);
          continue;
        }

        const filePath = `images/${matches[1]}`;
        console.log("Attempting to delete:", filePath);

        // Reference the file in Firebase Storage
        const file = bucket.file(filePath);

        // Check if file exists
        const [exists] = await file.exists();
        if (!exists) {
          console.log(`File ${filePath} does not exist in storage`);
          continue;
        }

        // Delete the file
        await file.delete();
        console.log(`Successfully deleted: ${filePath}`);
      } catch (individualError) {
        // Log error for individual file but continue with others
        console.error(
          `Error deleting individual file: ${imageUrl}`,
          individualError
        );
      }
    }
  } catch (error) {
    console.error("Error in delete operation:", error);
    throw error;
  }
};

const extractFileNamesWithUrls = (imageUrls) => {
  return imageUrls.map((imageUrl) => {
    const decodedUrl = decodeURIComponent(imageUrl);

    // Check if the URL contains "/images/"
    const imagePathIndex = decodedUrl.indexOf("/images/");

    if (imagePathIndex !== -1) {
      const fileName = decodedUrl.split("/images/")[1].split("?")[0]; // Extract fileName from the URL

      return {
        fileName: fileName,
        url: imageUrl,
      };
    } else {
      console.warn(`URL does not contain "/images/": ${imageUrl}`);
      return {
        fileName: null, // Handle cases where URL format is incorrect
        url: imageUrl,
      };
    }
  });
};

export default {
  uploadImages,
  deleteFilesFromFirebaseStorage,
  extractFileNamesWithUrls,
};
