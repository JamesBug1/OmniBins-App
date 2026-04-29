import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen({ onSignOut }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Jane Doe</Text>
        <Text style={styles.subtitle}>Route Coordinator</Text>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Text style={styles.sectionText}>Notification preferences, profile details, and route options are available here.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EDF6F0',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  sectionText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 16,
  },
});