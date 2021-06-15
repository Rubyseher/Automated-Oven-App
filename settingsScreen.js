import React, { useState, useCallback, Fragment, useContext } from 'react';
import { FlatList, View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { styles, colors } from './styles'
import Slider from '@react-native-community/slider'
import IonIcon from 'react-native-vector-icons/Ionicons';
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
                onSlidingComplete={value => { props.handler.setValue((currWS) => { return { ...currWS, [`${props.name}`]: value } }); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name, value) }}
                value={props.handler.value}
                thumbTintColor="transparent"
            />
        </Fragment>
    )
}

export default function settingsScreen() {
    const [wsData, setWsData] = useState({
        backlight: 0,
        volume: 0,
        selectedTone: "",
        availableTones: []
    });
    const { name } = useContext(AuthContext)

    const setPivalue = (name, value) => {
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
                reqList = [['display','getBacklight'],['audio','getVolume'],['audio','getSelectedTone'],['audio','getAvailableTones'],['other','getLogs']]
                reqList.forEach(r => ws.send(JSON.stringify({ module: r[0], function: r[1] })))
            };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                console.log("msg is ", d);
                if (d.type == 'result') {
                    setWsData((currWS) => { return { ...currWS, [d.req.substring(3)]: d.result } })
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
                    containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'flex-start', marginTop: 20, marginLeft: '20%'}]}
                />
            </View >
            <View style={{ width: '93%', alignSelf: 'center' }}>
                <SettingSlider icon={<IonIcon name="sunny" size={24} color={colors.darkGrey} />} handler={{ value: wsData.Backlight, setValue: setWsData }} sendHandler={setPivalue} name='Backlight' />
                <SettingSlider icon={<Icon name="volume-up" size={20} color={colors.darkGrey} />} handler={{ value: wsData.Volume, setValue: setWsData }} sendHandler={setPivalue} name='Volume' />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent:'space-evenly' }}>
                <Button
                    icon={<Icon name="sync-alt" size={24} color={colors.white} />}
                    buttonStyle={[styles.roundButtonM, { backgroundColor: colors.darkGrey }]}
                    containerStyle={[styles.roundButtonPaddingM,{marginLeft:0, marginRight:0}]}
                />
                <Button
                    icon={<Icon name="power-off" size={24} color={colors.white} />}
                    buttonStyle={[styles.roundButtonM, { backgroundColor: colors.red }]}
                    containerStyle={[styles.roundButtonPaddingM,{marginLeft:0, marginRight:0}]}
                />

            </View>


            <FlatList style={{ height: 300 }}
                data={[
                    { key: 'Oven URL' },
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

