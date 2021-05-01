import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="utensils" size={30} color="#900" />
        </View>
    );
}

function historyScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="history" size={30} color="#900" />
        </View>
    );
}
function utensilScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="utensils" size={30} color="#900" />
        </View>
    );
}
function powerScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="utensils" size={30} color="#900" />
        </View>
    );
}
function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="utensils" size={30} color="#900" />
        </View>
    );
}

const Tab = createBottomTabNavigator();

const BottomNav = () => {
    return (
        <View>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, size }) => {
                            let iconName;
                            if (route.name === 'user') { iconName = 'user' } 
                            else if (route.name === 'history') { iconName = 'history' }
                            else if (route.name === 'utensil') { iconName = 'utensils' ,size='77'}
                            else if (route.name === 'power') { iconName = 'plug' }
                            else if (route.name === 'Settings') { iconName = 'cog' }
                            return <Icon name={iconName} size={size} color={color} solid/>;
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
        </View>
    )
}
export default BottomNav;
