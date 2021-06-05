import { View, Text, TextInput } from 'react-native';
import React, { Fragment, useState, useCallback } from 'react';
import { styles, colors } from './styles';
import { Preheat, Cook, Checkpoint, Pause, Notify, PowerOff, Cooling, timelineData } from './timeline';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ficon from 'react-native-vector-icons/Fontisto';

const data = require('./timeline.json')

const TimelineComponent = (props) => {
    var item = props.item
    item.id = props.id
    item.removeItem = props.removeItem

    switch (item.type) {
        case "Preheat": return <Preheat {...item} />
        case "Cook": return <Cook {...item} />
        case "Checkpoint": return <Checkpoint {...item} />
        // case "Pause": return <Pause {...item} />
        case "Notify": return <Notify {...item} />
        case "PowerOff": return <PowerOff {...item} />
        case "Cooling": return <Cooling {...item} />
        default: null
    }
}

export default function automationEditScreen({ navigation }, props) {
    const [steps, setSteps] = useState(data[1].steps);
    const [visible, setVisible] = useState(false);
    const [foodName, changeFoodname] = useState(data[1].name);

    useFocusEffect(
        useCallback(() => {
            var ws = new WebSocket('ws://oven.local:8069');
            ws.onopen = () => {
                req = {
                    msg: 'direct',
                    module: 'automations',
                    function: 'get'
                }
                ws.send(JSON.stringify(req));
            };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                if (d.msg == 'result') {
                    // setData(d.result)
                    console.log(d.result);
                    ws.close()
                }
            };
        }, [])
    );

    function removeItem(i) {
        setSteps(st => st = st.filter((s, index) => index != i));
    }
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function addItem(i) {
        var content = {}
        var st = steps;

        switch (i) {
            case "Preheat": content = {
                "type": "Preheat",
                "temp": 60
            }
                break;
            case "Cook": content = {
                "type": "Cook",
                "topTemp": 170,
                "bottomTemp": 0,
                "time": 30
            }
                break;

            case "Checkpoint": content = {
                "type": "Checkpoint",
                "wait": true,
                "timeout": 30
            }
                break;
            case "Notify":
                content = {
                    "type": "Notify",
                    "destination": ["John", "Bob", "Tom", "Alexa"],
                    "title": "Cooking Complete",
                    "message": "Pizza is done Cooking"
                }
                break;

            case "PowerOff":
                content = {
                    "type": "PowerOff"
                }
                break;

            case "Cooling":
                content = {
                    "type": "Cooling",
                    "duration": 10
                }
                break;

            default: null
        }
        st.push(content)
        setSteps(st)
        setVisible(!visible);
    }

    var types = ['Cook', 'Notify', 'Checkpoint', 'Preheat', 'Cooling', 'PowerOff']
    var stepColor = ['yellow', 'purple', 'blue', 'orange', 'turquoise', 'red']
    var icon = ['utensils', 'bell', 'flag', 'fire-alt', 'snowflake', 'power-off']

    return (
        <View>
            <ScrollView vertical={true} contentContainerStyle={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 200 }}>

                <Overlay isVisible={visible} overlayStyle={styles.overlayContainer} onBackdropPress={toggleOverlay}>
                    <Text style={styles.addStep}>Add Step</Text>
                    <View style={{ flexDirection: 'row', width: '100%', height: 90, flexWrap: 'wrap', marginHorizontal: 50 }}>
                        {
                            types.map((item, i) => (
                                <View key={i} style={{ width: '40%' }}>
                                    <Button
                                        onPress={() => addItem(types[i])}
                                        icon={<Icon name={icon[i]} size={35} color={colors.white} solid />}
                                        buttonStyle={[styles.stepCircle, { backgroundColor: colors[stepColor[i]] }]}
                                        containerStyle={styles.stepCirclePadding}
                                    />
                                    <Text style={styles.stepTitle}>{types[i]}</Text>
                                </View>
                            ))
                        }
                    </View>
                </Overlay>

                <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 40 }}>
                    <Text style={styles.closeHeading}>Automator</Text>
                    <Button
                        onPress={() => navigation.goBack()}
                        icon={<Ficon name="close-a" size={8} color={colors.white} />}
                        buttonStyle={styles.closeButtonM}
                        containerStyle={styles.closeButtonPaddingM}
                    />
                </View>

                <TextInput
                    style={styles.saveAuto}
                    onChangeText={changeFoodname}
                    value={foodName}
                />

                {
                    steps.map((item, i) => (
                        <Fragment key={i}>
                            <TimelineComponent item={item} id={i} removeItem={removeItem} />
                            <View style={styles.timeThread}></View>
                        </Fragment>
                    ))
                }

                <Button
                    onPress={toggleOverlay}
                    icon={<Icon name="plus" size={18} color={colors.white} />}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue }]}
                    containerStyle={styles.roundButtonPaddingS}
                />
            </ScrollView>
            
            <View style={styles.saveOverlay}>
                <Button
                    title="Save"
                    titleStyle={styles.saveText}
                    buttonStyle={styles.saveButton}
                    // containerStyle={styles.saveButton}
                />
            </View>
        </View>

    );
}

