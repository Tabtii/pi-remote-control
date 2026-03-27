import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import GatewayConfigScreen from './src/screens/GatewayConfigScreen';
import ChatScreen from './src/screens/ChatScreen';
import StatusScreen from './src/screens/StatusScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{name === 'Chat' ? '💬' : '📊'}</Text>
      <Text style={{ fontSize: 10, color: focused ? '#e94560' : '#666' }}>{name}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopColor: '#0f3460',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Chat" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Status" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
        }}
      >
        <Stack.Screen name="Config" component={GatewayConfigScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
