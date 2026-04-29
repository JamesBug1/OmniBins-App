import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Schedule" component={ScheduleScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Report" component={ReportScreen} />
            <Tab.Screen name="Account">
              {() => <AccountScreen onSignOut={() => setSignedIn(false)} />}
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

