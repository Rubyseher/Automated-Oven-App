import React, { useState, useCallback, Fragment, useContext } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
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
                onSlidingComplete={value => { props.handler.setValue((currWS) => { return { ...currWS, [`${props.name}`]: value } }); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.type, props.name, value) }}
                value={props.handler.value}
                thumbTintColor="transparent"
            />
        </Fragment>
    )
}

const SwitchItem = (props) => {
    return (
        <View style={styles.switchItemContainer}>
            <View style={[styles.switchIcon, { backgroundColor: props.color }]}>
                <Icon name={props.icon} color={colors.white} size={14} solid />
            </View>
            <Text style={styles.listItemName}>{props.title}</Text>
            <Switch
                trackColor={{ false: colors.grey, true: props.color }}
                onValueChange={props.toggleSwitch}
                value={props.isEnabled}
            />
        </View>
    )
}

export default function settingsScreen() {
    const [wsData, setWsData] = useState();
    const { name } = useContext(AuthContext)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const detectionList = [
        { title: 'Automatic AI Food Detection', color: colors.blue, icon: "magic", isEnabled, toggleSwitch },
        { title: 'Recipe Link Detection', color: colors.orange, icon: "link", isEnabled, toggleSwitch }
    ]
    const notifications = [
        { title: 'Cooking Done', color: colors.yellow, icon: "utensils", isEnabled, toggleSwitch },
        { title: 'High Energy Consumption', color: colors.lightGreen, icon: "plug", isEnabled, toggleSwitch },
        { title: 'Oven Emptied', color: colors.blue, icon: "sign-out-alt", isEnabled, toggleSwitch },
        { title: 'High Surrounding Temperature', color: colors.red, icon: "temperature-high", isEnabled, toggleSwitch }
    ]

    const history = [
        { title: 'Incognito Mode', color: colors.darkGrey, icon: "user-secret", isEnabled, toggleSwitch }
    ]
    const automations = [
        { title: 'Share With Other Users', color: colors.purple, icon: "share", isEnabled, toggleSwitch },
        { title: 'Allow Others to Edit', color: colors.red, icon: "edit", isEnabled, toggleSwitch }
    ]
    const developer = [
        { title: 'Demo Mode', color: colors.yellow, icon: "code", isEnabled, toggleSwitch },
    ]
    var reqList = [['audio', 'Volume'], ['audio', 'SelectedTone'], ['audio', 'AvailableTones'], ['display', 'Backlight']]

    const setPivalue = (type, name, value) => {
        setWsData((currWS) => { return { ...currWS, [name]: value } })

        var ws = new WebSocket('ws://oven.local:8069');
        console.log("type,name, value is ", type, name, value);
        ws.onopen = () => {
            req = {
                module: type,
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
                reqList.forEach(r => ws.send(JSON.stringify({ module: r[0], function: 'get' + r[1] })))
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
            {
                wsData && <Fragment>
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
                    <SettingSlider icon={<IonIcon name="sunny" size={24} color={colors.darkGrey} />} handler={{ value: wsData.Backlight, setValue: setWsData }} sendHandler={setPivalue} name='Backlight' type='display' />
                    <Text style={styles.listTitle}>Sounds</Text>
                    <SettingSlider icon={<Icon name="volume-up" size={20} color={colors.darkGrey} />} handler={{ value: wsData.Volume, setValue: setWsData }} sendHandler={setPivalue} name='Volume' type='audio' />
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ width: '120%', marginHorizontal: '-10%' }} contentOffset={{ x: -30 }}>
                        {
                            wsData.AvailableTones && wsData.AvailableTones.map((item, i) => (
                                <View key={i} style={{ flexDirection: 'row' }}>
                                    <Button
                                        onPress={() => setPivalue('audio', 'SelectedTone', item)}
                                        buttonStyle={wsData.SelectedTone == item ? styles.currentTone : styles.chooseTone}
                                        title={item}
                                        titleStyle={wsData.SelectedTone == item ? styles.currentTitle : styles.chooseTitle}
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

                    <Text style={styles.listTitle}>Oven Details</Text>
                    <Text style={styles.chooseTitle}>Name: Text</Text>
                    <Text style={styles.chooseTitle}>URL: Text</Text>

                    <Text style={styles.listTitle}>Detection</Text>
                    {detectionList.map((d, i) => <SwitchItem key={i} {...d} />)}


                    <Text style={styles.listTitle}>Notifications</Text>
                    {notifications.map((d, i) => <SwitchItem key={i} {...d} />)}

                    <Text style={styles.listTitle}>History</Text>
                    {history.map((d, i) => <SwitchItem key={i} {...d} />)}
                    <Button
                        buttonStyle={styles.chooseTone}
                        title='Clear All History'
                        titleStyle={styles.chooseTitle}
                        containerStyle={styles.volumeChooseContainer}
                    />

                    <Text style={styles.listTitle}>Automations</Text>
                    {automations.map((d, i) => <SwitchItem key={i} {...d} />)}

                    <Text style={styles.listTitle}>Developer</Text>
                    {developer.map((d, i) => <SwitchItem key={i} {...d} />)}
                    <Button
                        buttonStyle={styles.chooseTone}
                        title='View Logs '
                        titleStyle={styles.chooseTitle}
                        containerStyle={styles.volumeChooseContainer}
                    />
                </Fragment>
            }
        </ScrollView>
    );
}

