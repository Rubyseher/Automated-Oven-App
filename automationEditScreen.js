import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { Fragment, useState, useContext } from 'react';
import { styles, colors } from './styles';
import { Preheat, Cook, Checkpoint, Notify, PowerOff, Cooling } from './timeline';
import { ScrollView } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from './AuthContext';
import Ficon from 'react-native-vector-icons/Fontisto';

const TimelineComponent = (props) => {
    var item = props.item
    item.id = props.id
    item.removeItem = props.removeItem

    switch (item.type) {
        case "preheat": return <Preheat {...item} />
        case "cook": return <Cook {...item} />
        case "checkpoint": return <Checkpoint {...item} />
        // case "Pause": return <Pause {...item} />
        case "notify": return <Notify {...item} />
        case "poweroff": return <PowerOff {...item} />
        case "cooling": return <Cooling {...item} />
        default: null
    }
    return null;
}

export default function automationEditScreen({ navigation, route }) {
    const { id, editable } = route.params;
    // const [data, setData] = useState();
    const [steps, setSteps] = useState(route.params.steps);
    const [visible, setVisible] = useState(false);
    const [foodName, changeFoodname] = useState(route.params.name);
    const { name } = useContext(AuthContext);
    const [saveIsDeleteButton, setSaveIsDeleteButton] = useState(false)

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
            case "preheat": content = {
                "type": "preheat",
                "temp": 60
            }
                break;
            case "cook": content = {
                "type": "cook",
                "topTemp": 170,
                "bottomTemp": 0,
                "duration": 30
            }
                break;

            case "checkpoint": content = {
                "type": "checkpoint",
                "wait": true,
                "timeout": 30
            }
                break;
            case "notify":
                content = {
                    "type": "notify",
                    "destination": ["John", "Bob", "Tom", "Alexa"],
                    "title": "Cooking Complete",
                    "message": "Pizza is done Cooking"
                }
                break;

            case "poweroff":
                content = {
                    "type": "poweroff"
                }
                break;

            case "cooling":
                content = {
                    "type": "cooling",
                    "duration": 10
                }
                break;

            default: null
        }
        st.push(content)
        setSteps(st)
        setVisible(!visible);
    }

    var types = ['cook', 'notify', 'checkpoint', 'preheat', 'cooling', 'poweroff']
    var stepColor = ['yellow', 'purple', 'blue', 'orange', 'turquoise', 'red']
    var icon = ['utensils', 'bell', 'flag', 'fire-alt', 'snowflake', 'power-off']

    const saveAutomation = () => {
        if (steps.length > 0) {
            var ws = new WebSocket('ws://oven.local:8069');
            ws.onopen = () => {
                req = {
                    module: 'automations',
                    function: 'set',
                    params: [id, {
                        name: foodName,
                        createdBy: name,
                        creationDate: Math.floor(Date.now() / 1000),
                        lastUsed: Math.floor(Date.now() / 1000),
                        steps
                    }]
                }
                ws.send(JSON.stringify(req));
                ws.close()
            };
        }
        navigation.goBack()
    }

    const deleteAutomation = () => {
        var ws = new WebSocket('ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'automations',
                function: 'delete',
                params: [id]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }

    return (
        <Fragment>
            <ScrollView vertical={true} contentContainerStyle={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 200, paddingTop: 50 }}>
                <View style={{ flexDirection: 'row', width: '100%' }} >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" size={22} color={colors.blue} />
                    </TouchableOpacity>
                    <Text style={[styles.heading, { fontSize: 26, marginTop: -5, marginRight: '23%' }]}>{editable ? '   Edit Automation' : '   ' +foodName}</Text>
                    {editable && <Button
                        icon={saveIsDeleteButton ? <Ficon name="close-a" size={10} color={colors.white} /> : <Icon name={"trash"} size={12} color={colors.white} />}
                        onPress={() => setSaveIsDeleteButton(!saveIsDeleteButton)}
                        buttonStyle={[styles.roundButtonS, { backgroundColor: saveIsDeleteButton ? colors.darkGrey : colors.red, height: 25, width: 25 }]}
                        containerStyle={[styles.roundButtonPaddingS, { height: 30, width: 30, alignSelf: 'center', flex: 2, marginTop: -15 }]}
                    />}
                </View>

                {editable && <TextInput
                    style={styles.saveAuto}
                    onChangeText={changeFoodname}
                    value={foodName}
                />}

                {
                    steps.map((item, i) => (
                        <Fragment key={i}>
                            <TimelineComponent item={item} id={i} removeItem={removeItem} />
                            {
                                (editable || i <steps.length-1)&& <View style={styles.timeThread}></View>
                                }
                        </Fragment>
                    ))
                }

                {editable && <Button
                    onPress={toggleOverlay}
                    icon={<Icon name="plus" size={18} color={colors.white} />}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue }]}
                    containerStyle={styles.roundButtonPaddingS}
                />}
            </ScrollView>

            {editable && <View style={styles.saveOverlay}>
                <Button
                    title={saveIsDeleteButton ? "Delete" : "Save"}
                    titleStyle={styles.saveText}
                    buttonStyle={[styles.saveButton, { backgroundColor: saveIsDeleteButton ? colors.red : colors.darkBlue }]}
                    onPress={saveIsDeleteButton ? deleteAutomation : saveAutomation}
                />
            </View>}

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
        </Fragment>

    );
}

