import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/color';

const PostOwnerInfo = ({ user, navigation }) => {
    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => navigation.navigate("ViewLandlordInfo", { userId: user._id })} 
        >
            <View style={styles.profileInfo}>
                <Image
                    style={styles.avatar}
                    source={require("../../../../assets/images/default_owner_image.png")}
                />
                <View style={styles.textContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.fullName}>
                            {user.fullName}
                        </Text>
                        <MaterialIcons name="star" size={16} color="#FFD700" />
                    </View>
                    <Text style={styles.postCount}>{user.publicRoomCount} bài đăng</Text>
                </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 12,
        paddingRight: 25,
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: COLORS.backgroundMain,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fullName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginRight: 4,
    },
    postCount: {
        fontSize: 14,
        color: '#CEBD69',
    },
});

export default PostOwnerInfo;
