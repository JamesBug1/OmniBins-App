import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const alertItems = [
  { id: '1', title: 'BIN-01 is full', subtitle: '10:30 AM', type: 'urgent' },
  { id: '2', title: 'BIN-02 needs attention', subtitle: '10:30 AM', type: 'warning' },
  { id: '3', title: 'BIN-03 gas exceeded', subtitle: '10:30 AM', type: 'info' },
];

const schedule = {
  nextStop: 'BIN-01',
  location: 'Public Market, Argao',
  time: '10:30 AM',
  date: 'April 28, 2026',
};

const weatherFallback = {
  temperature: '28°C',
  condition: 'Partly Cloudy',
  humidity: '60%',
  wind: '12 km/h',
  feelsLike: '31°C',
};

export default function DashboardScreen({ location, locationEnabled, completed = 0, pending = 0 }) {
  const { width, height } = useWindowDimensions();
  const [showNotifications, setShowNotifications] = useState(false);
  const [weather, setWeather] = useState(weatherFallback);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const responsiveStyles = {
    padding: width < 360 ? 12 : 16,
    paddingLarge: width < 360 ? 14 : 20,
    paddingMedium: width < 360 ? 12 : 18,
    gap: width < 360 ? 8 : 16,
    radiusLarge: width < 360 ? 18 : 24,
    fontLarge: width < 360 ? 22 : 28,
    fontMedium: width < 360 ? 16 : 20,
    fontSmall: width < 360 ? 12 : 14,
    fontTiny: width < 360 ? 10 : 12,
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError(null);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code`
        );
        const data = await response.json();
        if (data.current) {
          const conditionMap = {
            0: 'Clear',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            80: 'Rain showers',
            81: 'Moderate showers',
            82: 'Violent showers',
            95: 'Thunderstorm',
            99: 'Hail',
          };

          setWeather({
            temperature: `${data.current.temperature_2m}°C`,
            condition: conditionMap[data.current.weather_code] || 'Cloudy',
            humidity: `${data.current.relative_humidity_2m}%`,
            wind: `${data.current.wind_speed_10m} km/h`,
            feelsLike: `${data.current.apparent_temperature}°C`,
          });
        } else {
          setWeatherError('Weather data unavailable');
        }
      } catch (error) {
        setWeatherError('Unable to load weather');
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(() => {
      fetchWeather();
    }, 60000);

    return () => clearInterval(interval);
  }, [location]);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleAlertPress = (item) => {
    Alert.alert(item.title, `${item.subtitle}\nStatus: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`);
  };

  const handleViewAll = () => {
    Alert.alert('Notifications', 'Showing all recent alerts.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7} onPress={handleToggleNotifications}>
          <MaterialCommunityIcons name="bell-outline" size={26} color="#2E7D32" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <Modal visible={showNotifications} transparent animationType="fade" onRequestClose={handleToggleNotifications}>
        <View style={styles.modalOverlay}>
          <View style={styles.notificationPanel}>
            <View style={styles.notificationPanelHeader}>
              <Text style={styles.notificationPanelTitle}>Notifications</Text>
              <TouchableOpacity onPress={handleToggleNotifications} activeOpacity={0.7}>
                <MaterialCommunityIcons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.notificationPanelCountText}>{alertItems.length} new alerts</Text>
            <FlatList
              data={alertItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.notificationPanelItem} activeOpacity={0.7} onPress={() => handleAlertPress(item)}>
                  <View style={[styles.alertMarker, styles[`marker_${item.type}`]]} />
                  <View style={styles.alertTextWrapper}>
                    <Text style={styles.alertTitle}>{item.title}</Text>
                    <Text style={styles.alertSubtitle}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.panelSeparator} />}
            />
            <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton} activeOpacity={0.7}>
              <Text style={styles.viewAllButtonText}>View all notifications</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.greetingTitle}>Good morning, James!👋</Text>
      <Text style={styles.greetingSubtitle}>Stay safe and keep the city clean.</Text>

      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <View>
            <Text style={styles.temperature}>{weather.temperature}</Text>
            <Text style={styles.weatherLabel}>{weather.condition}</Text>
          </View>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={42} color="#2E7D32" />
        </View>
        <View style={styles.weatherStatsRow}>
          <View style={styles.weatherStat}>
            <Text style={styles.weatherStatValue}>Humidity</Text>
            <Text style={styles.weatherStatDetail}>{weather.humidity}</Text>
          </View>
          <View style={styles.weatherStat}>
            <Text style={styles.weatherStatValue}>Wind</Text>
            <Text style={styles.weatherStatDetail}>{weather.wind}</Text>
          </View>
          <View style={styles.weatherStat}>
            <Text style={styles.weatherStatValue}>Feels Like</Text>
            <Text style={styles.weatherStatDetail}>{weather.feelsLike}</Text>
          </View>
        </View>
      </View>

      <View style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.sectionLabel}>Today’s Schedule</Text>
          <Text style={styles.scheduleDate}>{schedule.date}</Text>
        </View>
        <View style={styles.scheduleBody}>
          <View>
            <Text style={styles.nextStopLabel}>Next Stop</Text>
            <Text style={styles.nextStopTitle}>{schedule.nextStop}</Text>
            <Text style={styles.nextStopSubtitle}>{schedule.location}</Text>
            <Text style={styles.nextStopTime}>{schedule.time}</Text>
          </View>
          <View style={styles.scheduleImageWrapper}>
            <View style={styles.truckCircle}>
              <MaterialCommunityIcons name="truck" size={28} color="#2E7D32" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.summaryCardComplete, styles.summaryCardSpacing]}>
          <Text style={styles.summaryCount}>{completed}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardPending]}>
          <Text style={styles.summaryCount}>{pending}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summarySubLabel}>Tasks</Text>
        </View>
      </View>

      <View style={styles.alertsCard}>
        <View style={styles.alertsHeader}>
          <Text style={styles.sectionLabel}>Recent Alerts</Text>
          <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={alertItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.alertRow} activeOpacity={0.7} onPress={() => handleAlertPress(item)}>
              <View style={styles.alertMarkerWrapper}>
                <View style={[styles.alertMarker, styles[`marker_${item.type}`]]} />
              </View>
              <View style={styles.alertTextWrapper}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.alertSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({  container: {
    flex: 1,
    backgroundColor: '#EDF6F0',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F3B21',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  notificationPanel: {
    width: '100%',
    maxWidth: 360,
    maxHeight: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  notificationPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationPanelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  notificationPanelCountText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  notificationPanelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  panelSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  viewAllButton: {
    marginTop: 8,
    paddingVertical: 12,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 18,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  weatherLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  weatherStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherStat: {
    flex: 1,
    alignItems: 'flex-start',
  },
  weatherStatValue: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  weatherStatDetail: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  scheduleDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  scheduleBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextStopLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 6,
  },
  nextStopTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  nextStopSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  nextStopTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  scheduleImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F4F9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
    minHeight: 120,
  },
  summaryCardSpacing: {
    marginRight: 12,
  },

  summaryCardComplete: {
    backgroundColor: '#F4F9F4',
  },
  summaryCardPending: {
    backgroundColor: '#FEF4EC',
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  summarySubLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  alertsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  alertMarkerWrapper: {
    width: 20,
    alignItems: 'center',
  },
  alertMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  marker_urgent: {
    backgroundColor: '#EF4444',
  },
  marker_warning: {
    backgroundColor: '#F59E0B',
  },
  marker_info: {
    backgroundColor: '#3B82F6',
  },
  alertTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});