import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppointmentList from './AppointmentList';
import BookingAPI from '../../api/BookingApi'; // import API
import { useSelector } from "react-redux";

const Appointment = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?.role === 'tenant') {
          const tenantAppointments = await BookingAPI.getMyBookings(user.email);
          setAppointments(tenantAppointments);
        } else if (user?.role === 'landlord') {
          const landlordAppointments = await BookingAPI.getLandlordBookings(user.email);
          setAppointments(landlordAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (user?.email) {
      fetchAppointments();
    }
  }, [user?.email, user?.role]);

  const handleAccept = async (appointmentId) => {
    try {
      await BookingAPI.updateBookingStatus(appointmentId, 'Accepted');
      setAppointments(prev => prev.map(app =>
        app._id === appointmentId ? { ...app, status: 'Accepted' } : app
      ));
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await BookingAPI.updateBookingStatus(appointmentId, 'Rejected');
      setAppointments(prev => prev.map(app =>
        app._id === appointmentId ? { ...app, status: 'Rejected' } : app
      ));
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  const tabs = [
    { title: 'Chờ Xác Nhận', status: 'Pending' },
    { title: 'Lịch Đã Hủy', status: 'Rejected' },
    { title: 'Lịch hẹn thành công', status: 'Accepted' },
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === 0) return appointment.status === 'Pending';
    if (activeTab === 1) return appointment.status === 'Rejected';
    if (activeTab === 2) return appointment.status === 'Accepted';
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index ? styles.activeTabText : null]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <AppointmentList
        appointments={filteredAppointments}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderBottomColor: '#eee',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f4511e',
  },
  inactiveTab: {
    borderBottomWidth: 0,
  },
  tabText: {
    color: '#999',
  },
  activeTabText: {
    color: '#f4511e',
    fontWeight: 'bold',
  },
});

export default Appointment;