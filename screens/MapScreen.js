import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const binLocations = [
  {
    id: 'BIN-001',
    title: 'Bin 001',
    coordinate: { latitude: 10.295, longitude: 123.88 },
    address: 'Main Street',
    status: 'Normal',
    capacity: '15%',
    lastCollection: '8 hours ago',
  },
  {
    id: 'BIN-002',
    title: 'Bin 002',
    coordinate: { latitude: 10.305, longitude: 123.89 },
    address: 'Park Ave',
    status: 'Near Full',
    capacity: '75%',
    lastCollection: '2 hours ago',
  },
  {
    id: 'BIN-003',
    title: 'Bin 003',
    coordinate: { latitude: 10.31, longitude: 123.87 },
    address: 'Beach Road',
    status: 'Full',
    capacity: '100%',
    lastCollection: '30 minutes ago',
  },
  {
    id: 'BIN-004',
    title: 'Bin 004',
    coordinate: { latitude: 14.5982, longitude: 120.9845 },
    address: 'Beach Road',
    status: 'Normal',
    capacity: '25%',
    lastCollection: '5 hours ago',
  },
  {
    id: 'BIN-005',
    title: 'Bin 005',
    coordinate: { latitude: 10.3, longitude: 123.92 },
    address: 'Commercial Hub',
    status: 'Near Full',
    capacity: '80%',
    lastCollection: '1 hour ago',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Normal':
      return '#10B981';
    case 'Near Full':
      return '#F59E0B';
    case 'Full':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export default function MapScreen({ locationEnabled, location }) {
  const { width, height } = useWindowDimensions();
  const [selectedBin, setSelectedBin] = useState(null);

  const responsiveStyles = {
    padding: width < 360 ? 12 : 16,
    paddingLarge: width < 360 ? 14 : 20,
    paddingMedium: width < 360 ? 12 : 18,
    fontLarge: width < 360 ? 20 : 24,
    fontMedium: width < 360 ? 14 : 16,
    fontSmall: width < 360 ? 11 : 13,
    fontSize15: width < 360 ? 13 : 15,
    detailsPanelHeight: Math.min(height * 0.6, 600),
  };

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  };

  const handleGetDirections = () => {
    if (selectedBin && locationEnabled) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        selectedBin.coordinate.latitude,
        selectedBin.coordinate.longitude
      );
      alert(
        `📍 Route to ${selectedBin.id}\n\n` +
        `From: Your Location\n` +
        `To: ${selectedBin.address}\n\n` +
        `Distance: ${distance} km\n` +
        `Status: ${selectedBin.status}\n\n` +
        `Tap Get Directions to open maps app.`
      );
    } else if (selectedBin) {
      alert(
        `Enable location in settings to calculate distance and get directions to ${selectedBin.id}.`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerBar, { paddingHorizontal: responsiveStyles.padding }]}>
        <Text style={[styles.headerTitle, { fontSize: responsiveStyles.fontLarge }]}>Map & Location</Text>
        <Text style={[styles.headerSubtitle, { fontSize: responsiveStyles.fontSmall }]}>Interactive map showing all smart bin locations</Text>
      </View>
      <View style={[styles.searchCard, { marginHorizontal: responsiveStyles.padding }]}>
        <TextInput placeholder="Search route or stop" placeholderTextColor="#9CA3AF" style={[styles.searchInput, { fontSize: responsiveStyles.fontSize15 }]} />
      </View>
      <MapView style={[styles.map, { marginHorizontal: responsiveStyles.padding }]} region={region}>
        {binLocations.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={bin.coordinate}
            onPress={() => setSelectedBin(bin)}
            title={bin.id}
          >
            <View style={[styles.markerContainer, { backgroundColor: getStatusColor(bin.status) }]}>
              <MaterialCommunityIcons name="trash-can" size={18} color="#FFFFFF" />
            </View>
          </Marker>
        ))}

        {locationEnabled && (
          <Marker coordinate={location} title="Your Location">
            <View style={styles.gpsPulse}>
              <View style={styles.gpsMarker}>
                <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {selectedBin && (
        <View style={[styles.detailsPanel, { maxHeight: responsiveStyles.detailsPanelHeight, paddingHorizontal: responsiveStyles.paddingLarge }]}>
          <TouchableOpacity onPress={() => setSelectedBin(null)} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={width < 360 ? 18 : 20} color="#6B7280" />
          </TouchableOpacity>
          <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
            <View style={styles.detailsHeader}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedBin.status) }]}>
                <Text style={[styles.statusText, { fontSize: responsiveStyles.fontSmall - 2 }]}>{selectedBin.status}</Text>
              </View>
              <Text style={[styles.binId, { fontSize: responsiveStyles.fontMedium + 4 }]}>{selectedBin.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
              <Text style={[styles.detailLabel, { fontSize: responsiveStyles.fontSize15 }]}>{selectedBin.address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailHeading, { fontSize: responsiveStyles.fontSmall + 1 }]}>Status</Text>
            </View>
            <View style={styles.statusBadgeBox}>
              <Text style={[styles.statusBadgeText, { fontSize: responsiveStyles.fontSmall - 1 }]}>{selectedBin.status}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailHeading, { fontSize: responsiveStyles.fontSmall + 1 }]}>Capacity</Text>
            </View>
            <Text style={[styles.detailValue, { fontSize: responsiveStyles.fontSize15 }]}>{selectedBin.capacity}</Text>

            <View style={styles.detailRow}>
              <Text style={[styles.detailHeading, { fontSize: responsiveStyles.fontSmall + 1 }]}>Coordinates</Text>
            </View>
            <Text style={[styles.detailValue, { fontSize: responsiveStyles.fontSize15 }]}>
              {selectedBin.coordinate.latitude.toFixed(4)}, {selectedBin.coordinate.longitude.toFixed(4)}
            </Text>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
              <Text style={[styles.detailLabel, { fontSize: responsiveStyles.fontSmall }]}>Last collection: {selectedBin.lastCollection}</Text>
            </View>

            <TouchableOpacity style={[styles.directionsButton, { paddingVertical: width < 360 ? 10 : 12 }]} onPress={handleGetDirections}>
              <MaterialCommunityIcons name="directions" size={16} color="#FFFFFF" />
              <Text style={[styles.directionsButtonText, { fontSize: responsiveStyles.fontSmall + 1 }]}>Get Directions</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6F0',
  },
  headerBar: {
    paddingBottom: '2%',
    paddingTop: '4%',
  },
  headerTitle: {
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  searchCard: {
    marginBottom: '3%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  searchInput: {
    color: '#111827',
  },
  map: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  gpsPulse: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  gpsMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  detailsContent: {
    paddingRight: 20,
  },
  detailsHeader: {
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  binId: {
    fontWeight: '800',
    color: '#111827',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailLabel: {
    color: '#6B7280',
    marginLeft: 8,
  },
  detailHeading: {
    fontWeight: '700',
    color: '#111827',
  },
  detailValue: {
    color: '#4B5563',
    marginBottom: 12,
  },
  statusBadgeBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#10B981',
    fontWeight: '700',
  },
  directionsButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
});