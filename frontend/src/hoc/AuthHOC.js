import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../context/authContext';

const AuthHOC = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { user } = useAuth();
    const { navigation } = props;

    if (!user) {
      navigation.navigate('Login');
      return null;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        <View>
          <Text>Bạn không có quyền truy cập vào trang này.</Text>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthHOC;
