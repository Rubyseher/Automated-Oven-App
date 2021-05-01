import React, { useState } from 'react';
import { Slider, LinearProgress } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { Image, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

const styles = StyleSheet.create({
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
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
  },
};

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text> Home Screen </Text>
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
  const [value, setValue] = useState(89);
  return (
    <View>
      <Image
        style={{ width: 390, height: 340 }}
        source={require('./images/emptyPlate.png')}
      />
      <LinearProgress color="#ff6a00" variant='determinate' value={0.5} style={{ height: 20 }} trackColor="#dfddff" />
      <Text style={styles.name}>Empty</Text>

      {/* <Button
      style={styles.round}
      title="Solid Button"
      />
      <Icon name="circle" size={30} color="#900" /> */}

      <View style={{ paddingRight: '5%', paddingLeft: '5%',flexDirection:'row',width:'100%'}}>
        <Image
          style={{ height: 30 ,width:30 }}
          source={require('./images/topOven.png')}
          resizeMode='contain'
        />
        <Slider
          value={value}
          style={{width:'90%'}}
          maximumTrackTintColor='#dfddff'
          minimumTrackTintColor='#ff6a00'
          maximumValue={200}
          minimumValue={0}
          trackStyle={{ backgroundColor: '#ff6a00', height: 20, borderRadius: 20 }}
          onValueChange={(value) => setValue(value)}
          thumbStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
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
    <NavigationContainer theme={MyTheme}>
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