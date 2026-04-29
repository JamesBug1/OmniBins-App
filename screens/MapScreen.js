import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const markers = [
  { id: '1', title: 'Station A', coordinate: { latitude: 37.785834, longitude: -122.406417 } },
  { id: '2', title: 'Station B', coordinate: { latitude: 37.78825, longitude: -122.4324 } },
  { id: '3', title: '3rd Ave', coordinate: { latitude: 37.78125, longitude: -122.4054 } },
];

export default function MapScreen({ locationEnabled, location }) {
  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  };

  const markersToShow = locationEnabled
    ? [{ id: 'current', title: 'Your location', coordinate: location }]
    : markers;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Map</Text>
      </View>
      <View style={styles.searchCard}>
        <TextInput placeholder="Search route or stop" placeholderTextColor="#9CA3AF" style={styles.searchInput} />
      </View>
      <MapView style={styles.map} region={region}>
        {markersToShow.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title} />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6F0',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  searchCard: {
    marginHorizontal: 16,
    marginBottom: 12,
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
    fontSize: 15,
    color: '#111827',
  },
  map: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
});