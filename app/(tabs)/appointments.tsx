import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Types
interface DayProps {
  date: number;
  isToday?: boolean;
  hasAppointment?: boolean;
  isSelected?: boolean;
  onSelect: (date: number) => void;
}

interface Appointment {
  id: string;
  doctorName: string;
  type: string;
  time: string;
  isVirtual: boolean;
}

// Calendar Day Component
const Day = ({ date, isToday, hasAppointment, isSelected, onSelect }: DayProps) => (
  <TouchableOpacity
    style={[
      styles.dayContainer,
      isToday && styles.today,
      isSelected && styles.selectedDay,
    ]}
    onPress={() => onSelect(date)}
  >
    <Text style={[
      styles.dayText,
      (isToday || isSelected) && styles.todayText
    ]}>
      {date}
    </Text>
    {hasAppointment && (
      <View style={[
        styles.appointmentIndicator,
        isSelected && styles.selectedAppointmentIndicator
      ]} />
    )}
  </TouchableOpacity>
);

// Calendar Header Component
const CalendarHeader = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <View style={styles.calendarHeader}>
      {days.map((day) => (
        <Text key={day} style={styles.dayLabel}>{day}</Text>
      ))}
    </View>
  );
};

// Appointment List Component
const AppointmentList = () => {
  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      type: 'Annual Check-up',
      time: '10:00 AM',
      isVirtual: false,
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      type: 'Follow-up Consultation',
      time: '2:30 PM',
      isVirtual: true,
    },
  ];

  return (
    <View style={styles.appointmentsContainer}>
      <Text style={styles.sectionTitle}>Today's Appointments</Text>
      {appointments.map((appointment) => (
        <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text style={styles.appointmentType}>{appointment.type}</Text>
            <Text style={styles.appointmentTime}>{appointment.time}</Text>
          </View>
          <View style={styles.appointmentActions}>
            {appointment.isVirtual && (
              <View style={styles.virtualBadge}>
                <Ionicons name="videocam" size={16} color="#1D363F" />
                <Text style={styles.virtualText}>Virtual</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  
  // Generate calendar days (simplified for example)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = new Date().getDate();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>February 2024</Text>
        <CalendarHeader />
        <View style={styles.calendar}>
          {daysInMonth.map((date) => (
            <Day
              key={date}
              date={date}
              isToday={date === today}
              hasAppointment={[5, 12, 15, 20].includes(date)}
              isSelected={date === selectedDate}
              onSelect={setSelectedDate}
            />
          ))}
        </View>
      </View>
      <AppointmentList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 14,
    color: '#8E8E93',
    width: Dimensions.get('window').width / 7 - 16,
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayContainer: {
    width: Dimensions.get('window').width / 7 - 16,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  dayText: {
    fontSize: 16,
    color: '#000000',
  },
  today: {
    backgroundColor: '#1D363F',
    borderRadius: 20,
  },
  todayText: {
    color: '#FFFFFF',
  },
  selectedDay: {
    backgroundColor: '#1D363F20',
    borderRadius: 20,
  },
  appointmentIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ECC749',
    position: 'absolute',
    bottom: 4,
  },
  selectedAppointmentIndicator: {
    backgroundColor: '#FFFFFF',
  },
  appointmentsContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#1D363F',
  },
  appointmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  virtualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D363F10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  virtualText: {
    fontSize: 12,
    color: '#1D363F',
    marginLeft: 4,
  },
}); 