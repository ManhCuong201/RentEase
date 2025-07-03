import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { COLORS } from '../../../constants/color';

const TermsComponent = () => {
  return (
    <View style={styles.postTerm}>
      <Text style={styles.postTermHeader}>
        Điều Khoản & Dịch Vụ
      </Text>
      <Text style={styles.postTermBody}>
        Điều khoản dịch vụ được thiết lập rõ ràng và minh bạch, giúp bạn hiểu rõ quyền lợi và trách nhiệm của mình trong suốt quá trình thuê. Điều này đảm bảo rằng bạn có thể an tâm tận hưởng trải nghiệm mà không lo lắng về những bất ngờ không mong muốn.
      </Text>
      <TouchableOpacity style={styles.infoRow}>
        <Foundation name="clipboard-notes" size={24} color="green" />
        <Text style={{ color: 'green', marginLeft: 10 }}>Xem điều khoản và điều kiện</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  postTerm: {
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
  postTermHeader: {
    fontSize: 22,
    marginBottom: 10,
  },
  postTermBody: {
    fontSize: 15,
    opacity: 0.6,
    marginLeft: 10
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10
  },
});

export default TermsComponent;
