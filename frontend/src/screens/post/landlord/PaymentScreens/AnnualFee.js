import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';

const AnnualFee = () => {
    const [itemType, setItemType] = useState('1m'); // Default to 1 month
    const [amount, setAmount] = useState('');
    const [paymentContent, setPaymentContent] = useState('');
    const user = useSelector((state) => state.user.user);
    const [price, setPrice] = useState(200000);

    
    const updateAmountAndContent = (type) => {
        let price = 0;
        let duration = '';
        switch (type) {
            case '1m':
                price = 200000;
                setPrice(200000)
                duration = '1 thang';
                break;
            case '3m':
                price = 200000 * 3 * 0.9;
                setPrice(200000 * 3 * 0.9)
                duration = '3 thang';
                break;
            case '6m':
                price = 200000 * 6 * 0.85;
                setPrice(200000 * 6 * 0.85)
                duration = '6 thang';
                break;
            case '1y':
                price = 200000 * 12 * 0.8;
                setPrice(200000 * 12 * 0.8)
                duration = '1 nam';
                break;
            default:
                break;
        }

        setAmount(`${price.toLocaleString()} VND`);
        setPaymentContent(`${user.fullName} thanh toan hoa don phi thuong nien ${duration}, gia tri: ${price.toLocaleString()} VND`);
    };

    useEffect(() => {
        updateAmountAndContent(itemType);
    }, [itemType]);


    const handlePayment = async () => {
        try {
            const response = await fetch('http://192.168.1.191:8080/api/payment/create_payment_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: price,
                    orderDescription: paymentContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment URL');
            }

            const data = await response.json();

            // Open the payment URL in the default browser
            if (data.paymentUrl) {
                Linking.openURL(data.paymentUrl);
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };



    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.greeting}>Xin chào {user.fullName}</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Các gói hiện tại:</Text>
                    <Picker
                        selectedValue={itemType}
                        style={styles.picker}
                        onValueChange={(itemValue) => setItemType(itemValue)}
                    >
                        <Picker.Item label="Gói 1 tháng" value="1m" />
                        <Picker.Item label="Gói 3 tháng (Giảm 10%)" value="3m" />
                        <Picker.Item label="Gói 6 tháng (Giảm 15%)" value="6m" />
                        <Picker.Item label="Gói 1 năm (Giảm 20%)" value="1y" />
                    </Picker>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tổng số tiền cần thanh toán</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        editable={false}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nội dung thanh toán</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={paymentContent}
                        editable={false}
                        multiline
                        numberOfLines={4}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Thanh toán Redirect" onPress={handlePayment} color="#007BFF" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    greeting: {
        textAlign: 'center',
        fontSize: 26,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        color: '#495057',
        marginBottom: 8,
    },
    picker: {
        height: 50,
        borderColor: '#dee2e6',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f1f3f5',
        color: '#495057',
    },
    input: {
        height: 50,
        borderColor: '#dee2e6',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#e9ecef',
        color: '#495057',
    },
    textArea: {
        height: 80,
        paddingTop: 10,
    },
    buttonContainer: {
        marginTop: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default AnnualFee;
