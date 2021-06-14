import React, { useState, useCallback, Fragment } from 'react';
import { FlatList, View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { styles, colors } from './styles'
import Slider from '@react-native-community/slider'
import Ficon from 'react-native-vector-icons/Fontisto';

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
                        case "getVolume": return setWsData((currWS) => currWS.volume = d.result)
                        case "getBacklight": return setWsData((currWS) => currWS.backlight = d.result)
                        case "getSelectedTone": return setWsData((currWS) => currWS.selectedTone = d.result)
                        case "getAvailableTones": return setWsData((currWS) => currWS.availableTones = d.result)
                        default: null
                    }
                    console.log("d.req is ", d.req);
                    ws.close()
                }
            };
        }, [])
    );
    return (
        <View style={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 300 }}>
            <Text style={styles.heading}>Settings</Text>
            <View style={{ width: '93%', alignSelf: 'center' }}>
                <SettingSlider icon={<Ficon name="day-sunny" size={24} color={colors.darkGrey} />} handler={{ value: wsData.backlight, setValue: setWsData }} sendHandler={setPivalue} name='backlight' />
                <SettingSlider icon={<Ficon name="volume-up" size={16} color={colors.darkGrey} />} handler={{ value: wsData.volume, setValue: setWsData }} sendHandler={setPivalue} name='volume' />
            </View>
            {/* restart button */}
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

