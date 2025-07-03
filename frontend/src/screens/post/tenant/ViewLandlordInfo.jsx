import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, ActivityIndicator, ImageBackground } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/color';
import PostAPI from '../../../api/PostAPI';
import RoomList from '../../../components/common/RoomList';

const ViewLandlordInfo = ({ route, navigation }) => {
    const { userId } = route.params;
    const [landlord, setLandlord] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRoomPress = (postId) => {
        navigation.navigate("ViewPostDetailScreen", { postId });
    };

    useEffect(() => {
        const fetchLandlordData = async () => {
            setLoading(true);
            try {
                const landlordInfo = await PostAPI.getLandlordFullInfoByLandlordId(userId);
                setLandlord(landlordInfo);
            } catch (error) {
                console.error("Error fetching landlord data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLandlordData();
    }, [userId]);

    const maskPhoneNumber = (phoneNumber) => {
        return phoneNumber ? `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}` : "";
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!landlord) return null;

    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={require('../../../../assets/images/wallPaperLandlordInfo.png')}
                style={styles.header}
                blurRadius={3}
            >
                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../../../../assets/images/default_owner_image.png')}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.fullName}>{landlord.fullName}</Text>
                    <MaterialIcons name="star" size={18} color="#FFD700" style={styles.starIcon} />
                </View>
                
            </ImageBackground>

            <View style={styles.contactInfo}>
                <View style={styles.contactButton}>
                    <View style={styles.iconAndText}>
                        <FontAwesome name="phone" size={18} color="#3b5998" />
                        <Text style={styles.contactText}>Điện thoại</Text>
                    </View>
                    <Text style={styles.phoneNumber}>{landlord.phoneNumber}</Text>
                </View>

                <View style={styles.contactButton}>
                    <View style={styles.iconAndText}>
                        <FontAwesome name="envelope" size={18} color="#FFA500" />
                        <Text style={styles.contactText}>Email</Text>
                    </View>
                    <Text style={styles.email}>{landlord.email}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tin đã đăng</Text>
                <RoomList posts={landlord.posts} onRoomPress={handleRoomPress} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#FFA500',
    },
    avatarContainer: {
        backgroundColor: '#F68900',
        padding: 3,
        borderRadius: 50,
        marginBottom: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fullName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#181818',
        marginRight: 5,
    },
    starIcon: {
        marginTop: 2,
    },
    contactInfo: {
        // flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    contactButton: {
        flex: 1,
        backgroundColor: '#E5F1FB',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        marginBottom: 5
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    contactText: {
        fontSize: 14,
        color: '#777',
        marginLeft: 8,
    },
    phoneNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        paddingHorizontal: 15,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ViewLandlordInfo;
