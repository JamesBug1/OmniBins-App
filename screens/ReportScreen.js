import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const reports = [
  { id: '1', title: 'Report bin overflow', status: 'Open' },
  { id: '2', title: 'Vehicle maintenance', status: 'Scheduled' },
  { id: '3', title: 'Route issue', status: 'Resolved' },
];

export default function ReportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Quick submit</Text>
        <Text style={styles.infoText}>Create or review your latest service reports from this screen.</Text>
      </View>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.badgeOpen}>
              <Text style={styles.badgeText}>{item.status}</Text>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  badgeOpen: {
    backgroundColor: '#2E7D32',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});