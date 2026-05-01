import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ScheduleScreen({ bins, onCollectBin, onOpenBinOnMap }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>View Schedule</Text>
      <View style={styles.searchRow}>
        <Text style={styles.searchLabel}>Search:</Text>
        <View style={styles.dateInput}>
          <MaterialCommunityIcons name="calendar-month" size={18} color="#2E7D32" style={styles.calendarIcon} />
          <Text style={styles.dateText}>08/17/2025</Text>
        </View>
      </View>
      <FlatList
        data={bins}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onOpenBinOnMap(item.id)}
          >
            <View style={styles.cardMain}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="trash-can" size={24} color="#2E7D32" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.address}</Text>
                <Text style={styles.cardDetail}>{item.details}</Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <Text style={styles.cardTime}>{item.time}</Text>
              <TouchableOpacity
                style={[styles.collectButton, item.collected && styles.collectedButton]}
                activeOpacity={0.8}
                onPress={(event) => {
                  event.stopPropagation();
                  if (!item.collected) onCollectBin(item.id);
                }}
              >
                <Text style={[styles.collectButtonText, item.collected && styles.collectedButtonText]}>
                  {item.collected ? 'Collected' : 'Collect'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    width: 72,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#E7F5EA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  cardDetail: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  collectButton: {
    backgroundColor: '#FDE68A',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  collectButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  collectedButton: {
    backgroundColor: '#D1FAE5',
  },
  collectedButtonText: {
    color: '#047857',
  },
});