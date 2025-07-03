import React from 'react';
import { FlatList } from 'react-native';
import AppointmentItem from './AppointmentItem';

const AppointmentList = ({ appointments, onAccept, onReject }) => {
  return (
    <FlatList
      data={appointments}
      renderItem={({ item }) => <AppointmentItem item={item} onAccept={onAccept} onReject={onReject} />}
      keyExtractor={item => item._id}
    />
  );
};

export default AppointmentList;
