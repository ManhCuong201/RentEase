import React from 'react';
import { View, Text, Image, Pressable, Animated, StyleSheet } from 'react-native';

const BottomSheet = ({ selectedRoom, handleDetailPress, handleDirectionPress, bottomSheetAnimation }) => {
    const bottomSheetTranslateY = bottomSheetAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    return (
        <Animated.View
            style={[
                styles.bottomSheet,
                { transform: [{ translateY: bottomSheetTranslateY }] },
            ]}
        >
            <View style={styles.bottomSheetContent}>
                <View style={styles.roomInfoContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.roomTitle}>{selectedRoom.title || 'N/A'}</Text>
                        <Text style={styles.roomAddress}>{selectedRoom.address || 'N/A'}</Text>
                        <Text style={styles.roomPrice}>{selectedRoom.price ? `${selectedRoom.price} VND` : 'Liên hệ'}</Text>
                    </View>
                    {selectedRoom.image ? (
                        <Image source={{ uri: selectedRoom.image }} style={styles.smallImage} />
                    ) : (
                        <Text>Không có hình ảnh</Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.directionButton} onPress={() => handleDirectionPress(selectedRoom)}>
                        <Text style={styles.directionButtonText}>Chỉ Đường</Text>
                    </Pressable>
                    <Pressable style={styles.detailButton} onPress={() => handleDetailPress(selectedRoom._id)}>
                        <Text style={styles.detailButtonText}>Xem Chi Tiết</Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bottomSheetContent: {
        alignItems: 'stretch',
    },
    roomInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    roomTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    roomAddress: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    roomPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FDD35E',
    },
    smallImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    directionButton: {
        backgroundColor: '#FDD35E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    directionButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    detailButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    detailButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default BottomSheet;
