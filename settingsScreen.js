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
                onSlidingComplete={value => { props.handler.setValue(value); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name,value) }}
                value={props.handler.value}
                thumbTintColor="transparent"
            />
        </Fragment>
    )
}

export default function settingsScreen() {
    const [backlight, setBacklight] = useState(0);
    
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
            };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                console.log("msg", d.type);

                if (d.type == 'result') {
                    setBacklight(d.result)
                    console.log("backlight", d.result);
                    ws.close()
                }
            };
        }, [])
    );
    return (
        <View style={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 300 }}>
            <Text style={styles.heading}>Settings</Text>
            <View style={{ width: '93%', alignSelf: 'center' }}>
                <SettingSlider icon={<Ficon name="day-sunny" size={24} color={colors.darkGrey} />} handler={{ value: backlight, setValue: setBacklight }} sendHandler={setPivalue} name='Backlight'/>
                <SettingSlider icon={<Ficon name="volume-up" size={16} color={colors.darkGrey} />} handler={{ value: backlight, setValue: setBacklight }} sendHandler={setPivalue} name='Volume' />
            </View>
            <FlatList style={{ height: '140%' }}
                data={[
                    { key: 'Display' },
                    // { key: 'backlight' },
                    { key: 'Profile' },
                    { key: 'Sleep' },
                    { key: 'History' },
                    { key: 'Detection' },
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

