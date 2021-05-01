import React from 'react';
import Slide from './slider';
import { Button } from 'react-native-elements';
import { Image, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const styles = StyleSheet.create({
  tinyLogo: {
    width: 390,
    height: 290,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 36,
    marginTop: 45,
    textAlign: 'center',
  },
  round: {
    width: 60,
    height: 20,
  }
});


function HomeScreen() {
  return (
    <View>
      <Image
        style={styles.tinyLogo}
        source={require('./images/emptyPlate.png')}
      />
      <Text style={styles.name}>Emptsy</Text>

      {/* <Button
      style={styles.round}
      title="Solid Button"
      />

      <Icon name="circle" size={30} color="#900" /> */}
      <Slide />
    </View>
  );
}

function historyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text> Home Screen </Text>
    </View>
  );
}
function utensilScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text> Home Screen </Text>
    </View>
  );
}
function powerScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text> Home Screen </Text>
    </View>
  );
}
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text> Home Screen </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'user') { iconName = 'user' }
            else if (route.name === 'history') { iconName = 'history' }
            else if (route.name === 'utensil') { iconName = 'utensils', size = 47 }
            else if (route.name === 'power') { iconName = 'plug' }
            else if (route.name === 'Settings') { iconName = 'cog' }
            return <Icon name={iconName} size={size} color={color} solid />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#3f91ff',
          showLabel: false,
          inactiveTintColor: 'gray',

        }}
      >
        <Tab.Screen name="user" component={HomeScreen} />
        <Tab.Screen name="history" component={historyScreen} />
        <Tab.Screen name="utensil" component={utensilScreen} />
        <Tab.Screen name="power" component={powerScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};