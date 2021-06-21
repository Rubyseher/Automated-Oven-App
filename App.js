import React, { useEffect, useState, useReducer, useMemo, useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import historyScreen from './historyScreen'
import mainScreen from './mainScreen'
import energyScreen from './energyScreen'
import automationEditScreen from './automationEditScreen'
import automationScreen from './automationScreen'
import settingsScreen from './settingsScreen'
import { styles, colors } from './styles'
import { TextInput, View, Text, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { Notifications } from 'react-native-notifications';
import SplashScreen from  "react-native-splash-screen";

const notificationSetup = () => {
    // Notifications.registerRemoteNotifications();

    // Notifications.events().registerRemoteNotificationsRegistered((event) => {
    //     // TODO: Send the token to my server so it could send back push notifications...
    //     console.log("Device Token Received", event.deviceToken);
    // });
    // Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
    //     // console.error(event);
    // });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        completion({ alert: true, sound: true, badge: false });
    });

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
        completion({ alert: true, sound: true, badge: false });
    });
}

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

const defaultPreferences = {
    url: 'ws://oven.local:8069',
    detection: { fromURL: true },
    notifications: { DONE: true, HIGH_ENERGY: true, EMPTY: true, HIGH_TEMP: true },
    history: { incognito: false },
    automations: { share: true, editable: true },
    bookmarkedHistoryItems: [],
    bookmarkedAutomationItems: [],
}

function LoginScreen(props) {
    const [newName, setNewName] = useState("")
    const { login } = useContext(AuthContext);

    return (
        !props.isLoading ? <View >
            <Text>Hi</Text>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Hi</Text>
                <Text style={styles.welcomeText}>Enter your Name</Text>
                <TextInput
                    style={styles.newName}
                    onChangeText={setNewName}
                    onEndEditing={() => login({ ...defaultPreferences, name: newName })}
                    value={newName}
                />
            </View>
        </View> : <View style={{ width: '100%', height: '100%', justifyContent: 'center', padding: '15%' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}

function AutomationStack() {
    return (
        <Stack.Navigator initialRouteName="automationScreen" headerMode='none'>
            <Stack.Screen name="automationScreen" component={automationScreen} />
            <Stack.Screen name="automationEdit" component={automationEditScreen} />
        </Stack.Navigator>
    );
}

function HistoryStack() {
    return (
        <Stack.Navigator initialRouteName="historyScreen" headerMode='none'>
            <Stack.Screen name="historyScreen" component={historyScreen} />
            <Stack.Screen name="automationEdit" component={automationEditScreen} />
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator initialRouteName="main"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'automations') {
                        return <IonIcon name="color-wand" size={size + 4} color={color} />;
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
            <Tab.Screen name="history" component={HistoryStack} />
            <Tab.Screen name="automations" component={AutomationStack} />
            <Tab.Screen name="main"
                options={{
                    tabBarIcon: () => (
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
                component={mainScreen} />
            <Tab.Screen name="energy" component={energyScreen} />
            <Tab.Screen name="settings" component={settingsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'TO_LOGIN_PAGE':
                    return {
                        ...prevState,
                        isLoading: false,
                        isSignedIn: false,
                    };
                case 'LOGIN':
                    return {
                        ...prevState,
                        isLoading: false,
                        isSignedIn: true,
                        config: action.data
                    };
                case 'LOGOUT':
                    return {
                        ...prevState,
                        isLoading: false,
                        isSignedIn: false,
                        config: null
                    };
            }
        },
        {
            isLoading: true,
            isSignedIn: true,
            config: null
        }
    );

    const context = useMemo(
        () => ({
            login: async data => {
                if (data !== null) {
                    if (!data.url) {
                        dispatch({ type: 'TO_LOGIN_PAGE' });
                    } else {
                        if (data.url && data.name)
                            await AsyncStorage.setItem('config', JSON.stringify(data))
                        var ws = new WebSocket('ws://oven.local:8069');
                        ws.onopen = () => {
                            req = {
                                module: 'other',
                                function: 'setUserName',
                                params: [data.name]
                            }
                            ws.send(JSON.stringify(req));
                        };
                        dispatch({ type: 'LOGIN', data: data });
                    }
                } else {
                    dispatch({ type: 'LOGOUT' });
                }
            },
            setConfig: async data => {
                await AsyncStorage.setItem('config', JSON.stringify(data))
            },
            getConfig: async () => {
                let res = await AsyncStorage.getItem('config')
                return res !== null ? JSON.parse(res) : defaultPreferences
            },
            logout: () => {
                AsyncStorage.clear();
                dispatch({ type: 'TO_LOGIN_PAGE' });
            }
        }),
        []
    );

    useEffect(async () => {
        SplashScreen.hide();
        const configSubscriber = await AsyncStorage.getItem('config')
        context.login(configSubscriber !== null ? JSON.parse(configSubscriber) : null)
        notificationSetup()
    }, [])

    return (
        <AuthContext.Provider value={{ config: state.config, ...context }}>
            <NavigationContainer theme={NavContainerTheme}>
                {!state.isLoading && state.config !== null ? <MainTabs /> : <LoginScreen isLoading={state.isLoading} />}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}
