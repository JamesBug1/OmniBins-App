import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

export default function AccountScreen({ onSignOut, locationEnabled, onToggleLocation, permissionStatus }) {
  const { width } = useWindowDimensions();

  const responsiveStyles = {
    padding: width < 360 ? 12 : 16,
    paddingLarge: width < 360 ? 14 : 20,
    fontLarge: width < 360 ? 24 : 28,
    fontMedium: width < 360 ? 14 : 16,
    fontSmall: width < 360 ? 12 : 14,
  };

  const permissionText =
    permissionStatus === 'granted'
      ? 'Location permission granted'
      : permissionStatus === 'denied'
      ? 'Location permission denied'
      : 'Ask to allow location when enabled';

  return (
    <View style={[styles.container, { paddingHorizontal: responsiveStyles.padding }]}>
      <Text style={[styles.header, { fontSize: responsiveStyles.fontLarge }]}>Account</Text>
      <View style={[styles.card, { paddingHorizontal: responsiveStyles.paddingLarge }]}>
        <Text style={[styles.title, { fontSize: responsiveStyles.fontMedium + 4 }]}>Jane Doe</Text>
        <Text style={[styles.subtitle, { fontSize: responsiveStyles.fontSmall }]}>Route Coordinator</Text>
      </View>
      <View style={[styles.sectionCard, { paddingHorizontal: responsiveStyles.paddingLarge }]}>
        <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontMedium - 2 }]}>Settings</Text>
        <Text style={[styles.sectionText, { fontSize: responsiveStyles.fontSmall }]}>Notification preferences, profile details, and route options are available here.</Text>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { fontSize: responsiveStyles.fontSmall + 1 }]}>Allow location</Text>
            <Text style={[styles.settingDescription, { fontSize: responsiveStyles.fontSmall - 1 }]}>Use your location for weather updates and map centering.</Text>
            <Text style={[styles.permissionText, { fontSize: responsiveStyles.fontSmall - 2 }]}>{permissionText}</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={onToggleLocation}
            trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
            thumbColor={locationEnabled ? '#10B981' : '#FFFFFF'}
          />
        </View>
      </View>
      <TouchableOpacity style={[styles.button, { height: width < 360 ? 48 : 52 }]} onPress={onSignOut}>
        <Text style={[styles.buttonText, { fontSize: responsiveStyles.fontSmall + 2 }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#EDF6F0',
  },
  header: {
    fontWeight: '800',
    color: '#111827',
    marginBottom: '5%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    color: '#6B7280',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: '6%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginHorizontal: 0,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  sectionText: {
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontWeight: '700',
    color: '#111827',
  },
  settingDescription: {
    color: '#6B7280',
    marginTop: 4,
    maxWidth: '85%',
  },
  permissionText: {
    color: '#4B5563',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '10%',
  },
  buttonText: {
    color: '#2E7D32',
    fontWeight: '700',
  },
});