import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const schedule = [
  { id: '1', title: 'Hillside Ave', time: '08:00', badge: 'On time' },
  { id: '2', title: 'River Park loading', time: '09:15', badge: 'Delayed' },
  { id: '3', title: 'Market Street', time: '10:30', badge: 'On time' },
  { id: '4', title: 'Heritage Mall', time: '12:00', badge: 'On time' },
];

export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={[styles.badge, item.badge === 'Delayed' ? styles.badgeDelayed : styles.badgeReady]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6F0',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  time: {
    fontSize: 13,
    marginTop: 6,
    color: '#6B7280',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  badgeReady: {
    backgroundColor: '#2E7D32',
  },
  badgeDelayed: {
    backgroundColor: '#D97706',
  },
});