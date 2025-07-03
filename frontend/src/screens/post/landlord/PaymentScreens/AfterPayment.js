import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const AfterPayment = ({ route, navigation }) => {
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTransactionInfo = async () => {
      try {
        const response = await fetch('http://localhost:8081/afterpaymentReturn'); // Change this URL
        const data = await response.json();
        setTransactionInfo(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMessage('Error fetching transaction info.');
        console.error(error);
      }
    };

    fetchTransactionInfo();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : transactionInfo ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Giao dịch thành công!</Text>
          <Text>Số tiền: {transactionInfo.amount}</Text>
          <Text>Mã ngân hàng: {transactionInfo.bankCode}</Text>
          <Text>Số giao dịch ngân hàng: {transactionInfo.bankTranNo}</Text>
          <Text>Loại thẻ: {transactionInfo.cardType}</Text>
          <Text>Thông tin đơn hàng: {transactionInfo.orderInfo}</Text>
          <Text>Ngày thanh toán: {transactionInfo.payDate}</Text>
          <Text>Số giao dịch: {transactionInfo.transactionNo}</Text>
        </View>
      ) : (
        <View style={styles.failureContainer}>
          <Text style={styles.failureText}>Giao dịch thất bại</Text>
          <Text>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: '#dff0d8',
    padding: 20,
    borderRadius: 10,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3c763d',
  },
  failureContainer: {
    alignItems: 'center',
    backgroundColor: '#f2dede',
    padding: 20,
    borderRadius: 10,
  },
  failureText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#a94442',
  },
});

export default AfterPayment;
