import React, { useState, useCallback, Fragment, useContext } from 'react';
import { FlatList, View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { styles, colors } from './styles'
import Slider from '@react-native-community/slider'
import Ficon from 'react-native-vector-icons/Fontisto';
import { Button } from 'react-native-elements';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SettingSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 7, marginBottom: -12 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%', color: 'grey' }}>{props.handler.value}</Text>
            </View>
            <Slider
                maximumValue={100}
                minimumValue={0}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.blue}
                step={5}
                onSlidingComplete={value => { props.handler.setValue((currWS) => currWS[props.name] = value); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name, value) }}
                value={props.handler.value}
                thumbTintColor="transparent"
            />
        </Fragment>
    )
}

export default function settingsScreen() {
    // const [backlight, setBacklight] = useState(0);
    // const [volume, setVolume] = useState(50);
    const [wsData, setWsData] = useState({
        backlight: 0,
        volume: 0,
        selectedTone: "",
        availableTones: []
    });
    const { name } = useContext(AuthContext)

    const setPivalue = (name, value) => {
        console.log("setPivalue name ", name);
        console.log("setPivalue value ", value);
        var ws = new WebSocket('ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'display',
                function: `set${name}`,
                params: [value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }

    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactMedium");

            var ws = new WebSocket('ws://oven.local:8069');
            ws.onopen = () => {
                req = {
                    module: 'display',
                    function: 'getBacklight',
                    params: []
                }
                ws.send(JSON.stringify(req));
                req = {
                    module: 'audio',
                    function: 'getVolume',
                    params: []
                }
                ws.send(JSON.stringify(req));
                req = {
                    module: 'audio',
                    function: 'getSelectedTone',
                    params: []
                }
                ws.send(JSON.stringify(req));
                req = {
                    module: 'audio',
                    function: 'getAvailableTones',
                    params: []
                }
                ws.send(JSON.stringify(req));
            };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                console.log("msg is ", d);

                if (d.type == 'result') {
                    switch (d.req) {
                        case "getVolume": setWsData((currWS) => { return { ...currWS, volume: d.result } })
                        case "getBacklight": setWsData((currWS) => { return { ...currWS, backlight: d.result } })
                        case "getSelectedTone": setWsData((currWS) => { return { ...currWS, selectedTone: d.result } })
                        case "getAvailableTones": setWsData((currWS) => { return { ...currWS, availableTones: d.result } })
                        default: null
                    }
                    ws.close()
                }
            };
        }, [])
    );
    return (
        <View style={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 300 }}>
            <Text style={styles.heading}>Settings</Text>
            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                <View style={styles.profileCircle}>
                    <Icon name="user" color={colors.white} size={32} solid />
                </View>
                <Text style={[styles.fullName, { marginVertical: 20 }]}>{name}</Text>
                <Button
                    icon={<Icon name="arrow-left" size={12} color={colors.white} />}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.darkGrey, height: 25, width: 25 }]}
                    containerStyle={[styles.roundButtonPaddingS, { height: 30, width: 30, alignSelf: 'flex-start', marginTop: 20, marginLeft: '20%' }]}
                />
            </View >
            <View style={{ width: '93%', alignSelf: 'center' }}>
                <SettingSlider icon={<Ficon name="day-sunny" size={24} color={colors.darkGrey} />} handler={{ value: wsData.backlight, setValue: setWsData }} sendHandler={setPivalue} name='backlight' />
                <SettingSlider icon={<Ficon name="volume-up" size={16} color={colors.darkGrey} />} handler={{ value: wsData.volume, setValue: setWsData }} sendHandler={setPivalue} name='volume' />
            </View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <Button
                    icon={<Icon name="sync-alt" size={24} color={colors.white} />}
                    buttonStyle={[styles.roundButtonM, { backgroundColor: colors.darkGrey }]}
                    containerStyle={styles.roundButtonPaddingM}
                />
                <Button
                    icon={<Icon name="power-off" size={24} color={colors.white} />}
                    buttonStyle={[styles.roundButtonM, { backgroundColor: colors.red }]}
                    containerStyle={styles.roundButtonPaddingM}
                />

            </View>


            <FlatList style={{ height: '140%' }}
                data={[
                    { key: 'Oven URL' },
                    { key: 'Profile' },
                    { key: 'Sleep' },
                    { key: 'History' },
                    { key: 'Detection' },
                    { key: 'Developer' }, // debug mode, logs
                    { key: 'Preferences' },
                    { key: 'Sounds' },
                    { key: 'Safety Alerts' },
                    { key: 'Empty Alerts' },
                    { key: 'Energy Alerts' },
                    { key: 'Notifications' },
                    { key: 'Automations' },
                ]}
                renderItem={({ item }) => <Text style={styles.listItem}>{item.key}</Text>}
            />
        </View>
    );
}

