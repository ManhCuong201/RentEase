import React from "react";
import { ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { COLORS } from "../../../constants/color";

function ImagesCarouselComponent({ images, selectedImage, setSelectedImage }) {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: selectedImage || images[0] }}
        style={styles.largeImage}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {images.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedImage(imageUri)}
          >
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.smallImage,
                selectedImage === imageUri && styles.selectedSmallImage,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.backgroundMain,
  },
  largeImage: {
    width: "100%",
    height: 280,
    marginBottom: 15,
    borderRadius: 20,
  },
  scrollContainer: {},
  smallImage: {
    width: 90,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  selectedSmallImage: {
    borderWidth: 2,
    borderColor: "#A41617",
  },
});

export default ImagesCarouselComponent;
