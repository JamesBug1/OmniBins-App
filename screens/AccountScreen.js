import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';

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
      
      {/* Profile Card */}
      <View style={[styles.card, { paddingHorizontal: responsiveStyles.paddingLarge }]}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }} 
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={[styles.title, { fontSize: responsiveStyles.fontMedium + 4 }]}>Jane Doe</Text>
            <Text style={[styles.subtitle, { fontSize: responsiveStyles.fontSmall }]}>Route Coordinator</Text>
          </View>
        </View>
      </View>

      {/* Account Details - SEPARATE CARD/BOX */}
      <View style={[styles.detailsCard, { paddingHorizontal: responsiveStyles.paddingLarge }]}>
        <Text style={[styles.detailsHeader, { fontSize: responsiveStyles.fontMedium }]}>Account Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>📱</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>+1 (555) 123-4567</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>✉️</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>jane.doe@company.com</Text>
            </View>
          </View>
          
          <View style={[styles.detailRow, styles.lastDetailRow]}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>🆔</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Employee ID</Text>
              <Text style={styles.detailValue}>EMP-45678</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={[styles.sectionCard, { paddingHorizontal: responsiveStyles.paddingLarge }]}>
        <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontMedium - 2 }]}>Settings</Text>
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
    paddingVertical: 24,
    marginBottom: '4%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  profileTextContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    color: '#6B7280',
  },
  // NEW: Separate Account Details Card
  detailsCard: {
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
  detailsHeader: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  lastDetailRow: {
    paddingBottom: 4,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailIconText: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
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
    marginBottom: 16,
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