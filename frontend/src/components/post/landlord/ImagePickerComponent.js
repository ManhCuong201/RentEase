import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

const ImagePickerComponent = ({ onImagesSelected, initialImages }) => {
  const [images, setImages] = useState(
    Array.isArray(initialImages) ? initialImages : []
  );

  useEffect(() => {
    setImages(Array.isArray(initialImages) ? initialImages : []);
  }, [initialImages]);

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Lỗi", "Ứng dụng cần quyền truy cập thư viện ảnh!");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (
        result &&
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        // Process new images while preserving existing Firebase URLs
        const newImages = await Promise.all(
          result.assets.map(async (asset) => {
            // Check if the asset URI is already a Firebase URL
            if (asset.uri.includes("firebasestorage.googleapis.com")) {
              // If it's a Firebase URL, return it in the expected format without processing
              return {
                uri: asset.uri,
                name: asset.fileName || `image_${Date.now()}.jpg`,
                type: "image/jpeg",
                // Don't include base64 for existing Firebase URLs
                isExisting: true,
              };
            }

            // Process new images as before
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            console.log(`Kích thước tệp: ${fileInfo.size} bytes`);

            if (fileInfo.size > 2 * 1024 * 1024) {
              Alert.alert("Lỗi", "Kích thước tệp tối đa là 2MB.");
              return null;
            }

            // Only manipulate and convert to base64 for new images
            const manipulatedImage = await ImageManipulator.manipulateAsync(
              asset.uri,
              [],
              { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );

            const base64String = await FileSystem.readAsStringAsync(
              manipulatedImage.uri,
              { encoding: FileSystem.EncodingType.Base64 }
            );

            return {
              uri: manipulatedImage.uri,
              name: asset.fileName || `image_${Date.now()}.jpg`,
              type: "image/jpeg",
              base64: base64String,
              isExisting: false,
            };
          })
        );

        // Filter out null values (invalid images)
        const validImages = newImages.filter((image) => image !== null);

        // Combine with existing images
        const updatedImages = [...images];

        // Add new images while checking for duplicates
        validImages.forEach((newImage) => {
          // Check if this image URL already exists in the current images
          const isDuplicate = updatedImages.some(
            (existingImage) => existingImage.uri === newImage.uri
          );

          if (!isDuplicate) {
            updatedImages.push(newImage);
          }
        });

        if (updatedImages.length > 10) {
          Alert.alert("Lỗi", "Tối đa chỉ có thể chọn 10 hình ảnh.");
          return;
        }

        setImages(updatedImages);
        onImagesSelected(updatedImages);
      } else {
        if (!result.assets || result.assets.length === 0) {
          console.log("Không có hình ảnh nào được chọn.");
          Alert.alert("Lỗi", "Không có hình ảnh nào được chọn.");
        } else {
          console.log("Người dùng đã hủy chọn hình ảnh.");
        }
      }
    } catch (error) {
      console.error("Error picking images: ", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh.");
    }
  };

  // Helper function to check if a URL is a Firebase Storage URL
  const isFirebaseStorageUrl = (url) => {
    return (
      typeof url === "string" && url.includes("firebasestorage.googleapis.com")
    );
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  const renderImages = () => {
    if (!images || images.length === 0) {
      return null;
    }

    return images.map((image, index) => (
      <View key={index} style={styles.imageWrapper}>
        <Image source={{ uri: image.uri }} style={styles.image} />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeImage(index)}
        >
          <AntDesign name="closecircle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={openGallery}>
        <AntDesign name="camera" size={30} color="gray" />
        <Text style={styles.imageText}>Ảnh phòng</Text>
        <Text style={styles.imageLimitText}>Tối đa 10 hình</Text>
      </TouchableOpacity>
      <View style={styles.imagesList}>{renderImages()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: "#ffd700",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  imageLimitText: {
    fontSize: 12,
    color: "gray",
  },
  imagesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  deleteButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 12,
  },
});

export default ImagePickerComponent;
