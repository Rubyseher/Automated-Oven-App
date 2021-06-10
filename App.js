import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import profileScreen from './profileScreen'
import historyScreen from './historyScreen'
import mainScreen from './mainScreen'
import energyScreen from './energyScreen'
import automationEditScreen from './automationEditScreen'
import automationScreen from './automationScreen'
import settingsScreen from './settingsScreen'
import { styles, colors } from './styles'
import { TextInput, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NavContainerTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function LoginScreen() {
  const [newName, setNewName] = useState("")
  return (
    <View >
      <Text>Hi</Text>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Hi</Text>
        <Text style={styles.welcomeText}>Enter your Name</Text>
        <TextInput
          style={styles.newName}
          onChangeText={setNewName}
          onEndEditing={async () => {
            if (newName.length > 1) {
              await AsyncStorage.setItem('name',newName)
            }
          }}
          value={newName}
        />
      </View>
    </View>
  );
}

function Main() {
  return (
    <Stack.Navigator initialRouteName="main" headerMode='none'>
      <Stack.Screen name="main" component={mainScreen} />
      <Stack.Screen name="automationScreen" component={automationScreen} />
      <Stack.Screen name="automationEdit" component={automationEditScreen} />
    </Stack.Navigator>
  );
}

function AllScreen() {
  return (
    <Tab.Navigator initialRouteName="main"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'profile') {
            iconName = 'user';
          } else if (route.name === 'history') {
            iconName = 'history';
          } else if (route.name === 'energy') {
            iconName = 'plug';
          } else if (route.name === 'settings') {
            iconName = 'cog';
          }
          return <Icon name={iconName} size={size} color={color} solid />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.blue,
        showLabel: false,
        inactiveTintColor: colors.navBarInactive,
        style: { borderTopWidth: 0 }
      }}>
      <Tab.Screen name="profile" component={profileScreen} />
      <Tab.Screen name="history" component={historyScreen} />
      <Tab.Screen name="main"
        options={{
          tabBarIcon: ({ color }) => (
            <View
              style={{
                position: 'absolute',
                bottom: 0, // space from bottombar
                height: 70,
                width: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.blue,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4.84,
                elevation: 5,
              }}
            >
              <Icon name="utensils" color={colors.white} size={32} />
            </View>
          )
        }}
        component={Main} />
      <Tab.Screen name="energy" component={energyScreen} />
      <Tab.Screen name="settings" component={settingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [userName, setUserName] = useState()
  useEffect(async() => {
    const user = await AsyncStorage.getItem('name')
    console.log("Storage iss ", user);
    setUserName(user);
    if (user!= null) {
      var ws = new WebSocket('ws://oven.local:8069');
      ws.onopen = () => {
          req = {
              module: 'other',
              function: 'setUserName',
              params: [user]
          }
          ws.send(JSON.stringify(req));
      };
    }
  },[])

  return (
    <NavigationContainer theme={NavContainerTheme}>
      <RootStack.Navigator mode="modal" headerMode='none'>
        {userName != null ?
          <Tab.Screen name="allScreen" component={AllScreen} />
          :
          <Stack.Screen name="login" component={LoginScreen} />
        }
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
