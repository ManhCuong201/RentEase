import React from 'react';
import { View, Image } from 'react-native';
import { Marker } from 'react-native-maps';

const RoomMarker = React.memo(({ room, onPress, isSelected }) => {
  return (
    <Marker
      coordinate={room.coordinate}
      onPress={onPress}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.imageWrapper, isSelected ? styles.selectedImageWrapper : styles.unselectedImageWrapper]}>
          <Image source={{ uri: room.image }} style={styles.markerImage} />
        </View>
        <View style={[styles.markerTip, isSelected ? styles.selectedTip : styles.unselectedTip]} />
      </View>
    </Marker>
  );
});

const styles = {
  markerContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImageWrapper: {
    borderColor: '#FDD35E', 
  },
  unselectedImageWrapper: {
    borderColor: '#000000', 
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
  selectedTip: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FDD35E', 
  },
  unselectedTip: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000000', 
  },
};

export default RoomMarker;
