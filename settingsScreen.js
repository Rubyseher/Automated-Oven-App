import React, { useState, useCallback, Fragment, useContext } from 'react';
import { View, Text, ScrollView, Switch, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { styles, colors } from './styles'
import Slider from '@react-native-community/slider'
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';

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
                <Icon name={props.icon} color={colors.white} size={14} solid style={{ alignSelf: 'center' }} />
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

const IconTextInput = (props) => {
    return (
        <View style={styles.dropDown}>
            <View style={[styles.switchIcon, { backgroundColor: props.color }]}>
                <Icon name={props.icon} color={colors.white} size={14} solid style={{ alignSelf: 'center' }} />
            </View>
            <TextInput
                style={[styles.listItemName]}
                onChangeText={props.onChange}
                value={props.value}
            />
        </View>
    )
}

export default function settingsScreen({ navigation }) {
    const [wsData, setWSData] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState();
    const { config, getConfig, setConfig, logout } = useContext(AuthContext)
    const [configState, setConfigState] = useState(config)
    const [confirmClearHistory, setConfirmClearHistory] = useState(false)

    const setLocalConfigItem = (category, name, value) => {
        setConfigState((c) => {
            let newCS = name ? { ...c, [category]: { ...c[category], [name]: value } } : { ...c, [category]: value }
            setConfig(newCS);
            return newCS
        })
    }

    useFocusEffect(
        useCallback(() => {
            async () => {
                let freshConfig = await getConfig()
                setConfigState(freshConfig)
            }
        }, [])
    );

    const notifications = [
        { title: 'Cooking Done', color: colors.yellow, icon: "utensils", isEnabled: configState.notifications.DONE, toggleSwitch: (v) => setLocalConfigItem('notifications', 'DONE', v) },
        { title: 'High Energy Consumption', color: colors.lightGreen, icon: "plug", isEnabled: configState.notifications.HIGH_ENERGY, toggleSwitch: (v) => setLocalConfigItem('notifications', 'HIGH_ENERGY', v) },
        { title: 'Oven Emptied', color: colors.blue, icon: "cookie-bite", isEnabled: configState.notifications.EMPTY, toggleSwitch: (v) => setLocalConfigItem('notifications', 'EMPTY', v) },
        { title: 'High Surrounding Temperature', color: colors.red, icon: "exclamation-triangle", isEnabled: configState.notifications.HIGH_TEMP, toggleSwitch: (v) => setLocalConfigItem('notifications', 'HIGH_TEMP', v) }
    ]

    const history = [
        { title: 'Incognito Mode', color: colors.darkGrey, icon: "user-secret", isEnabled: configState.history.incognito, toggleSwitch: (v) => setLocalConfigItem('history', 'incognito', v) }
    ]
    const automations = [
        { title: 'Share With Other Users', color: colors.purple, icon: "share", isEnabled: configState.automations.share, toggleSwitch: (v) => setLocalConfigItem('automations', 'share', v) },
        { title: 'Allow Others to Edit', color: colors.orange, icon: "edit", isEnabled: configState.automations.editable, toggleSwitch: (v) => setLocalConfigItem('automations', 'editable', v) }
    ]

    var reqList = [['audio', 'Volume'], ['audio', 'SelectedTone'], ['audio', 'AvailableTones'], ['display', 'Backlight'], ['config', ''], ['other', 'Logs'], ['other', 'AvailableModels']]

    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactMedium");

            var ws = new WebSocket(config.url);
            ws.onopen = () => {
                reqList.forEach(r => ws.send(JSON.stringify({ module: r[0], function: 'get' + r[1] })))
            };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                if (d.type == 'result') {
                    setWSData((currWS) => { return { ...currWS, [d.req.length > 3 ? d.req.substring(3) : 'config']: d.result } })
                }
            };
        }, [])
    );

    const sendWSModuleValue = (type, name, value) => {
        setWSData((currWS) => { return { ...currWS, [name]: value } })
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            ws.send(JSON.stringify({ module: type, function: `set${name}`, params: [value] }));
            ws.close()
        };
    }

    const sendWSConfigValue = (name, value) => {
        setWSData((currWS) => { return { ...currWS, config: { ...currWS.config, [name]: value } } })
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            ws.send(JSON.stringify({ module: 'config', function: 'set', params: [name, value] }));
            ws.close()
        };
    }

    const sendPowerValue = (type) => {
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            ws.send(JSON.stringify({ module: 'other', function: type }));
            ws.close()
        };
        navigation.navigate('main')
    }

    const easterEgg = () => {
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            ws.send(JSON.stringify({ module: 'audio', function: 'easterEgg' }));
            ws.close()
        };
    }

    return (
        <ScrollView vertical={true} contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 4, paddingBottom: 50 }}>
            <Text style={styles.heading}>Settings</Text>
            {
                wsData && <Fragment>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                        <View style={styles.profileCircle}>
                            <Icon name="user" color={colors.white} size={32} solid />
                        </View>
                        <Text style={[styles.fullName, { marginVertical: 20 }]}>{config.name}</Text>
                        <Button
                            onPress={logout}
                            icon={<Icon name="arrow-left" size={12} color={colors.white} />}
                            buttonStyle={[styles.roundButtonS, { backgroundColor: colors.darkGrey, height: 25, width: 25 }]}
                            containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'flex-start', marginTop: 20, marginLeft: '20%' }]}
                        />
                    </View >
                    <Text style={styles.listTitle}>Display</Text>
                    <SettingSlider icon={<IonIcon name="sunny" size={24} color={colors.darkGrey} />} handler={{ value: wsData.Backlight, setValue: setWSData }} sendHandler={sendWSModuleValue} name='Backlight' type='display' />
                    <Text style={styles.listTitle}>Sounds</Text>
                    <SettingSlider icon={<Icon name="volume-up" size={20} color={colors.darkGrey} />} handler={{ value: wsData.Volume, setValue: setWSData }} sendHandler={sendWSModuleValue} name='Volume' type='audio' />
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ width: '120%', marginHorizontal: '-10%' }} contentOffset={{ x: -30 }}>
                        {
                            wsData.AvailableTones && wsData.AvailableTones.map((item, i) => (
                                <View key={i} style={{ flexDirection: 'row' }}>
                                    <Button
                                        onPress={() => sendWSModuleValue('audio', 'SelectedTone', item)}
                                        buttonStyle={wsData.SelectedTone == item ? styles.currentTone : styles.chooseTone}
                                        title={item}
                                        titleStyle={wsData.SelectedTone == item ? styles.currentTitle : styles.chooseTitle}
                                        containerStyle={styles.volumeChooseContainer}
                                    />
                                </View>
                            ))
                        }
                    </ScrollView>

                    <Text style={styles.listTitle}>Oven Details</Text>
                    {[
                        { icon: 'address-card', color: colors.red, value: wsData.config && wsData.config.name, onChange: (v) => sendWSConfigValue('name', v) },
                        { icon: 'link', color: colors.blue, value: configState.url, onChange: (v) => setLocalConfigItem('url', null, v) }
                    ].map((d, i) => <IconTextInput key={i} {...d} />)}

                    <Text style={styles.listTitle}>Detection</Text>
                    {[
                        { title: 'Automatic AI Food Detection', color: colors.orange, icon: "magic", isEnabled: wsData.config && wsData.config.autoDetect, toggleSwitch: (v) => sendWSConfigValue('autoDetect', v) },
                        { title: 'Recipe Link Detection', color: colors.blue, icon: "link", isEnabled: configState.detection.fromURL, toggleSwitch: (v) => setLocalConfigItem('detection', 'fromURL', v) }
                    ].map((d, i) => <SwitchItem key={i} {...d} />)}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        {
                            wsData.AvailableModels && wsData.config && wsData.AvailableModels.map((item, i) => (
                                <View key={i} style={{ flexDirection: 'row' }}>
                                    <Button
                                        onPress={() => sendWSConfigValue('modelVersion', item)}
                                        buttonStyle={wsData.config.modelVersion == item ? styles.currentTone : styles.chooseTone}
                                        title={"AI Detector " + item}
                                        titleStyle={wsData.config.modelVersion == item ? styles.currentTitle : styles.chooseTitle}
                                        containerStyle={styles.volumeChooseContainer}
                                    />
                                </View>
                            ))
                        }
                    </ScrollView>

                    <Text style={styles.listTitle}>Notifications</Text>
                    {notifications.map((d, i) => <SwitchItem key={i} {...d} />)}

                    <Text style={styles.listTitle}>Automations</Text>
                    {automations.map((d, i) => <SwitchItem key={i} {...d} />)}

                    <Text style={styles.listTitle}>History</Text>
                    {history.map((d, i) => <SwitchItem key={i} {...d} />)}
                    <Button
                        buttonStyle={[styles.chooseTone, { backgroundColor: confirmClearHistory ? colors.red : colors.darkGrey, paddingVertical: 10 }]}
                        title={confirmClearHistory ? 'Confirm Clear History' : 'Clear All History'}
                        icon={<Icon name="trash" color={colors.white} size={14} solid style={{ marginHorizontal: 15 }} />}
                        titleStyle={[styles.chooseTitle, { color: colors.white }]}
                        containerStyle={[styles.volumeChooseContainer, { height: 50, marginVertical: 5 }]}
                        onPress={() => setConfirmClearHistory(!confirmClearHistory)}
                    />

                    <Text style={styles.listTitle}>Developer</Text>
                    {
                        [{ title: 'Demo Mode', color: colors.yellow, icon: "video", isEnabled: wsData.config ? wsData.config.demoMode : false, toggleSwitch: (v) => sendWSConfigValue('demoMode', v) }].map((d, i) =>
                            <SwitchItem key={i} {...d} />)
                    }
                    <Button
                        buttonStyle={[styles.chooseTone, { backgroundColor: colors.darkGrey, paddingVertical: 10 }]}
                        title='View Logs'
                        icon={<Icon name="scroll" color={colors.white} size={14} solid style={{ marginHorizontal: 15 }} />}
                        titleStyle={[styles.chooseTitle, { color: colors.white }]}
                        containerStyle={[styles.volumeChooseContainer, { height: 50, marginVertical: 5 }]}
                        onPress={() => { setModalContent({ title: 'Logs', body: wsData.Logs }); setModalVisible(true) }}
                    />

                    <Text style={styles.listTitle}>Operating System</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                        <Button
                            icon={<Icon name="sync-alt" size={24} color={colors.white} />}
                            buttonStyle={[styles.roundButtonM, { backgroundColor: colors.purple }]}
                            containerStyle={[styles.roundButtonPaddingM, { marginLeft: 0, marginRight: 0 }]}
                            onPress={() => sendPowerValue('softRestart')}
                        />
                        <Button
                            icon={<Icon name="cloud-download-alt" size={24} color={colors.white} />}
                            buttonStyle={[styles.roundButtonM, { backgroundColor: colors.blue }]}
                            containerStyle={[styles.roundButtonPaddingM, { marginLeft: 0, marginRight: 0 }]}
                            onPress={() => sendPowerValue('update')}
                        />

                    </View>

                    <Text style={styles.listTitle}>Power</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                        <Button
                            icon={<Icon name="sync-alt" size={24} color={colors.white} />}
                            buttonStyle={[styles.roundButtonM, { backgroundColor: colors.orange }]}
                            containerStyle={[styles.roundButtonPaddingM, { marginLeft: 0, marginRight: 0 }]}
                            onPress={() => sendPowerValue('restart')}
                        />
                        <Button
                            icon={<Icon name="power-off" size={24} color={colors.white} />}
                            buttonStyle={[styles.roundButtonM, { backgroundColor: colors.red }]}
                            containerStyle={[styles.roundButtonPaddingM, { marginLeft: 0, marginRight: 0 }]}
                            onPress={() => sendPowerValue('poweroff')}
                        />

                    </View>
                    <TouchableWithoutFeedback onPress={easterEgg}>

                        <Text style={[styles.listItemName, { textAlign: 'center', width: '100%', marginLeft: 0, marginVertical: 50, paddingHorizontal: 20, fontSize: 14 }]}>Some settings may require an oven and app restart to take effect.</Text>
                    </TouchableWithoutFeedback>
                </Fragment>
            }
            <Modal isVisible={modalVisible} swipeDirection="down" onSwipeComplete={() => setModalVisible(false)} onBackdropPress={() => setModalVisible(false)} style={{ margin: 0 }} backdropOpacity={0.5}>
                <View style={styles.overlayContainer}>
                    <Text style={styles.addStep}>{modalContent && modalContent.title}</Text>
                    <ScrollView style={{ paddingHorizontal: 20 }}>
                        <Text style={styles.listItemName}>{modalContent && modalContent.body}</Text>
                    </ScrollView>
                </View>
            </Modal>
        </ScrollView>
    );
}

