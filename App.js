import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from './screens/DashboardScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import MapScreen from './screens/MapScreen';
import ReportScreen from './screens/ReportScreen';
import AccountScreen from './screens/AccountScreen';
import SignInScreen from './screens/SignInScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
  const [location, setLocation] = useState({ latitude: 10.3, longitude: 123.9 });
  const [bins, setBins] = useState([
    {
      id: 'BIN-01',
      title: 'BIN-01',
      address: 'Public Market, Argao',
      time: '10:30 AM',
      coordinate: { latitude: 10.2962, longitude: 123.8840 },
      collected: false,
      details: 'Recyclable and organic pickup',
    },
    {
      id: 'BIN-02',
      title: 'BIN-02',
      address: 'Tulic, Argao',
      time: '10:45 AM',
      coordinate: { latitude: 10.2979, longitude: 123.8803 },
      collected: false,
      details: 'General waste collection',
    },
    {
      id: 'BIN-03',
      title: 'BIN-03',
      address: 'Brgy. Tugas, Argao',
      time: '11:05 AM',
      coordinate: { latitude: 10.2988, longitude: 123.8852 },
      collected: false,
      details: 'Organic waste section',
    },
    {
      id: 'BIN-04',
      title: 'BIN-04',
      address: 'Brgy. Hugpa, Argao',
      time: '11:30 AM',
      coordinate: { latitude: 10.2948, longitude: 123.8808 },
      collected: false,
      details: 'Paper and cardboard pickup',
    },
  ]);

  const defaultRegion = {
    latitude: 10.2965,
    longitude: 123.8835,
  };

  const userLocation = locationEnabled ? location : defaultRegion;
  const completedCount = bins.filter((bin) => bin.collected).length;
  const pendingCount = bins.length - completedCount;

  const handleCollectBin = (binId) => {
    setBins((current) =>
      current.map((bin) =>
        bin.id === binId ? { ...bin, collected: true } : bin
      )
    );
  };

  const handleToggleLocation = async () => {
    if (locationEnabled) {
      setLocationEnabled(false);
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLocationEnabled(true);
    } else {
      setLocationEnabled(false);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {signedIn ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#2E7D32',
              tabBarInactiveTintColor: '#6B7280',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopColor: '#E5E7EB',
                height: 72,
                paddingBottom: 10,
              },
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Dashboard') iconName = 'view-dashboard-outline';
                else if (route.name === 'Schedule') iconName = 'calendar-month-outline';
                else if (route.name === 'Map') iconName = 'map-marker-radius';
                else if (route.name === 'Report') iconName = 'file-document-outline';
                else if (route.name === 'Account') iconName = 'account-circle-outline';
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen
              name="Dashboard"
              children={() => (
                <DashboardScreen
                  location={userLocation}
                  locationEnabled={locationEnabled}
                  completed={completedCount}
                  pending={pendingCount}
                />
              )}
            />
            <Tab.Screen name="Schedule">
              {({ navigation }) => (
                <ScheduleScreen
                  bins={bins}
                  onCollectBin={handleCollectBin}
                  onOpenBinOnMap={(binId) => navigation.navigate('Map', { selectedBinId: binId })}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Map">
              {({ route }) => (
                <MapScreen
                  location={userLocation}
                  locationEnabled={locationEnabled}
                  route={route}
                  bins={bins}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Report"
              component={ReportScreen}
            />
            <Tab.Screen name="Account">
              {() => (
                <AccountScreen
                  onSignOut={() => setSignedIn(false)}
                  locationEnabled={locationEnabled}
                  onToggleLocation={handleToggleLocation}
                  permissionStatus={permissionStatus}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        ) : (
          <SignInScreen onSignIn={() => setSignedIn(true)} />
        )}
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

