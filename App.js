import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import profileScreen from './profileScreen'
import historyScreen from './historyScreen'
import mainScreen from './mainScreen'
import energyScreen from './energyScreen'
import settingsScreen from './settingsScreen'

const NavContainerTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={NavContainerTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'profile') {
              iconName = 'user';
            } else if (route.name === 'history') {
              iconName = 'history';
            } else if (route.name === 'main') {
              (iconName = 'utensils'), (size = 47);
            } else if (route.name === 'energy') {
              iconName = 'plug';
            } else if (route.name === 'settings') {
              iconName = 'cog';
            }
            return <Icon name={iconName} size={size} color={color} solid />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#3f91ff',
          showLabel: false,
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="profile" component={profileScreen} />
        <Tab.Screen name="history" component={historyScreen} />
        <Tab.Screen name="main" component={mainScreen} />
        <Tab.Screen name="energy" component={energyScreen} />
        <Tab.Screen name="settings" component={settingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
