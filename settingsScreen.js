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
                onSlidingComplete={value => { props.handler.setValue((currWS) => { return { ...currWS, [`${props.name}`]: value } }); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name, value) }}
                value={props.handler.value}
                thumbTintColor="transparent"
            />
        </Fragment>
    )
}

export default function settingsScreen() {
    const [wsData, setWsData] = useState({
        Backlight: 0,
        Volume: 0,
        SelectedTone: "",
        AvailableTones: []
    });
    const { name } = useContext(AuthContext)
    const tempList = [{ key: 'Oven URL' },
    { key: 'History' },
    { key: 'Detection' },
    { key: 'Developer' }, // debug mode, logs
    { key: 'Safety Alerts' },
    { key: 'Empty Alerts' },
    { key: 'Energy Alerts' },
    { key: 'Notifications' },
    { key: 'Automations' }]

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
                var reqList = [['audio', 'getVolume'], ['audio', 'getSelectedTone'], ['audio', 'getAvailableTones'], ['display', 'getBacklight']]
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
        <ScrollView vertical={true} contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 4, paddingBottom: 50 }}>
            <Text style={styles.heading}>Settings</Text>
            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                <View style={styles.profileCircle}>
                    <Icon name="user" color={colors.white} size={32} solid />
                </View>
                <Text style={[styles.fullName, { marginVertical: 20 }]}>{name}</Text>
                <Button
                    icon={<Icon name="arrow-left" size={12} color={colors.white} />}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.darkGrey, height: 25, width: 25 }]}
                    containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'flex-start', marginTop: 20, marginLeft: '20%' }]}
                />
            </View >
            <Text style={styles.listTitle}>Display</Text>
            <SettingSlider icon={<IonIcon name="sunny" size={24} color={colors.darkGrey} />} handler={{ value: wsData.Backlight, setValue: setWsData }} sendHandler={setPivalue} name='Backlight' />
            <Text style={styles.listTitle}>Sounds</Text>
            <SettingSlider icon={<Icon name="volume-up" size={20} color={colors.darkGrey} />} handler={{ value: wsData.Volume, setValue: setWsData }} sendHandler={setPivalue} name='Volume' />

            {/* <View style={styles.dropDown}>
                <View style={[styles.roundButtonS, { padding: 10, shadowRadius: 0, backgroundColor: colors.blue, marginHorizontal: 10 }]}>
                    <Icon name="volume-up" size={18} color={colors.white} />
                </View>
                <Text style={{ color: colors.darkGrey, fontSize: 18, fontWeight: '500' }}>{wsData.SelectedTone}</Text>
            </View> */}

            <ScrollView horizontal={true} contentContainerStyle={{}}>
                {
                    wsData.AvailableTones.map((item, i) => (
                        <View key={i} style={{ flexDirection: 'row'}}>
                            <Button
                                buttonStyle={styles.volumeChoose}
                                title={item}
                                titleStyle={{ color: colors.black ,fontSize:14}}
                                containerStyle={styles.volumeChooseContainer}
                            />
                        </View>
                    ))
                }
            </ScrollView>

            <Text style={styles.listTitle}>Power</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                <Button
                    icon={<Icon name="sync-alt" size={24} color={colors.white} />}
                    buttonStyle={[styles.roundButtonM, { backgroundColor: colors.darkGrey }]}
                    containerStyle={[styles.roundButtonPaddingM, { marginLeft: 0, marginRight: 0 }]}
                />
                <Button
                    icon={<Icon name="power-off" size={24} color={colors.white} />}
                    buttonStyle={[styles.roundButtonM, { backgroundColor: colors.red }]}
                    containerStyle={[styles.roundButtonPaddingM, { marginLeft: 0, marginRight: 0 }]}
                />

            </View>

            {
                tempList.map((tl, k) => <Text key={k} style={styles.listTitle}>{tl.key}</Text>)
            }
        </ScrollView>
    );
}

