import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, useWindowDimensions, Modal } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const binLocations = [
  {
    id: 'BIN-01',
    title: 'BIN-01',
    coordinate: { latitude: 10.2962, longitude: 123.8840 },
    address: 'Public Market, Argao',
    status: 'Normal',
    capacity: '15%',
    lastCollection: '8 hours ago',
  },
  {
    id: 'BIN-02',
    title: 'BIN-02',
    coordinate: { latitude: 10.2979, longitude: 123.8803 },
    address: 'Tulic, Argao',
    status: 'Near Full',
    capacity: '75%',
    lastCollection: '2 hours ago',
  },
  {
    id: 'BIN-03',
    title: 'BIN-03',
    coordinate: { latitude: 10.2988, longitude: 123.8852 },
    address: 'Brgy. Tugas, Argao',
    status: 'Full',
    capacity: '100%',
    lastCollection: '30 minutes ago',
  },
  {
    id: 'BIN-04',
    title: 'BIN-04',
    coordinate: { latitude: 10.2948, longitude: 123.8808 },
    address: 'Brgy. Hugpa, Argao',
    status: 'Normal',
    capacity: '25%',
    lastCollection: '5 hours ago',
  },
  {
    id: 'BIN-05',
    title: 'BIN-05',
    coordinate: { latitude: 10.2956, longitude: 123.8829 },
    address: 'Public Market Extension, Argao',
    status: 'Near Full',
    capacity: '80%',
    lastCollection: '1 hour ago',
  },
];

const binRoutes = {
  'BIN-01': [
    { latitude: 10.2960, longitude: 123.8835 },
    { latitude: 10.2961, longitude: 123.8838 },
  ],
  'BIN-02': [
    { latitude: 10.2965, longitude: 123.8840 },
    { latitude: 10.2972, longitude: 123.8820 },
    { latitude: 10.2977, longitude: 123.8810 },
  ],
  'BIN-03': [
    { latitude: 10.2968, longitude: 123.8845 },
    { latitude: 10.2974, longitude: 123.8850 },
    { latitude: 10.2980, longitude: 123.8851 },
  ],
  'BIN-04': [
    { latitude: 10.2955, longitude: 123.8825 },
    { latitude: 10.2950, longitude: 123.8815 },
    { latitude: 10.2949, longitude: 123.8810 },
  ],
  'BIN-05': [
    { latitude: 10.2960, longitude: 123.8830 },
    { latitude: 10.2958, longitude: 123.8832 },
  ],
};

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

export default function MapScreen({ locationEnabled, location, route, bins = [] }) {
  const { width, height } = useWindowDimensions();
  const [selectedBin, setSelectedBin] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    if (route?.params?.selectedBinId) {
      const selected = bins.find((bin) => bin.id === route.params.selectedBinId);
      if (selected) {
        setSelectedBin(selected);
        setShowDetails(false);
      }
    }
  }, [route?.params?.selectedBinId, bins]);

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

  const mapData = bins.length ? bins : binLocations;
  const routeDistance = selectedBin
    ? calculateDistance(
        location.latitude,
        location.longitude,
        selectedBin.coordinate.latitude,
        selectedBin.coordinate.longitude
      )
    : null;

  const routeCoordinates = selectedBin
    ? [
        location,
        ...(binRoutes[selectedBin.id] || []),
        selectedBin.coordinate,
      ]
    : [];

  const region = selectedBin
    ? {
        latitude: (location.latitude + selectedBin.coordinate.latitude) / 2,
        longitude: (location.longitude + selectedBin.coordinate.longitude) / 2,
        latitudeDelta: Math.max(0.04, Math.abs(location.latitude - selectedBin.coordinate.latitude) * 2.5),
        longitudeDelta: Math.max(0.05, Math.abs(location.longitude - selectedBin.coordinate.longitude) * 2.5),
      }
    : {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05,
      };

  const handleGetDirections = () => {
    if (selectedBin) {
      setShowNavigation(true);
    }
  };

  const calculateEstimatedTime = (distanceKm) => {
    const avgSpeed = 30;
    const hours = Math.floor(distanceKm / avgSpeed);
    const minutes = Math.round((distanceKm % avgSpeed) / avgSpeed * 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
        {mapData.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={bin.coordinate}
            onPress={() => {
              setSelectedBin(bin);
              setShowDetails(true);
            }}
            title={bin.id}
          >
            <View style={[styles.markerContainer, { backgroundColor: getStatusColor(bin.status || 'Normal') }]}> 
              <MaterialCommunityIcons name="trash-can" size={18} color="#FFFFFF" />
            </View>
          </Marker>
        ))}

        {selectedBin && routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2563EB"
            strokeWidth={4}
            lineDashPattern={[6, 4]}
          />
        )}

        <Marker coordinate={location} title="Your Location">
          <View style={styles.gpsPulse}>
            <View style={styles.gpsMarker}>
              <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#FFFFFF" />
            </View>
          </View>
        </Marker>
      </MapView>

      {selectedBin && showDetails && (
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

            <View style={[styles.detailRow, { justifyContent: 'space-between' }]}> 
              <Text style={[styles.detailHeading, { fontSize: responsiveStyles.fontSmall + 1 }]}>Distance</Text>
              <Text style={[styles.detailValue, { fontSize: responsiveStyles.fontSize15 }]}>{routeDistance} km</Text>
            </View>

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

      <Modal visible={showNavigation} transparent animationType="slide" onRequestClose={() => setShowNavigation(false)}>
        <View style={styles.navigationContainer}>
          <View style={styles.navigationHeader}>
            <TouchableOpacity onPress={() => setShowNavigation(false)} style={styles.navigationCloseButton}>
              <MaterialCommunityIcons name="arrow-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.navigationTitle}>{selectedBin?.id}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.navigationMap}>
            <MapView style={styles.navigationMapInner} region={region}>
              {selectedBin && routeCoordinates.length > 1 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#2563EB"
                  strokeWidth={5}
                  lineDashPattern={[6, 4]}
                />
              )}

              {mapData.map((bin) => (
                <Marker
                  key={bin.id}
                  coordinate={bin.coordinate}
                  title={bin.id}
                >
                  <View style={[styles.markerContainer, { backgroundColor: getStatusColor(bin.status || 'Normal') }]}>
                    <MaterialCommunityIcons name="trash-can" size={18} color="#FFFFFF" />
                  </View>
                </Marker>
              ))}

              <Marker coordinate={location} title="Your Location">
                <View style={styles.gpsPulse}>
                  <View style={styles.gpsMarker}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </Marker>
            </MapView>
          </View>

          <View style={styles.navigationInfo}>
            <View style={styles.navigationStats}>
              <View style={styles.navigationStatBox}>
                <MaterialCommunityIcons name="road" size={20} color="#2563EB" />
                <Text style={styles.navigationStatLabel}>Distance</Text>
                <Text style={styles.navigationStatValue}>{routeDistance} km</Text>
              </View>
              <View style={styles.navigationStatBox}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#2563EB" />
                <Text style={styles.navigationStatLabel}>Est. Time</Text>
                <Text style={styles.navigationStatValue}>{calculateEstimatedTime(parseFloat(routeDistance))}</Text>
              </View>
              <View style={styles.navigationStatBox}>
                <MaterialCommunityIcons name="map-marker-check" size={20} color="#2563EB" />
                <Text style={styles.navigationStatLabel}>Destination</Text>
                <Text style={styles.navigationStatValue}>{selectedBin?.id}</Text>
              </View>
            </View>

            <View style={styles.navigationDetails}>
              <Text style={styles.navigationDestinationLabel}>Destination</Text>
              <Text style={styles.navigationDestinationName}>{selectedBin?.address}</Text>
              <Text style={styles.navigationDestinationStatus}>{selectedBin?.status}</Text>

              <View style={styles.navigationInstructions}>
                <MaterialCommunityIcons name="routes" size={16} color="#6B7280" />
                <Text style={styles.navigationInstructionText}>Follow the marked route to reach the bin location</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.navigationStartButton}>
              <MaterialCommunityIcons name="navigation" size={18} color="#FFFFFF" />
              <Text style={styles.navigationStartButtonText}>Start Navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  navigationContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  navigationCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navigationMap: {
    flex: 1,
    overflow: 'hidden',
  },
  navigationMapInner: {
    flex: 1,
  },
  navigationInfo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  navigationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  navigationStatBox: {
    alignItems: 'center',
  },
  navigationStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },
  navigationStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  navigationDetails: {
    marginBottom: 20,
  },
  navigationDestinationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  navigationDestinationName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  navigationDestinationStatus: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 4,
    fontWeight: '600',
  },
  navigationInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  navigationInstructionText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    fontWeight: '500',
  },
  navigationStartButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  navigationStartButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 8,
  },
});