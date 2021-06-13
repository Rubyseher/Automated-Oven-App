import { View, Text, TextInput } from 'react-native';
import React, { Fragment, useState } from 'react';
import { styles, colors } from './styles';
import { Preheat, Cook, Checkpoint, Notify, PowerOff, Cooling } from './timeline';
import { ScrollView } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
        case "power off": return <PowerOff {...item} />
        case "cooling": return <Cooling {...item} />
        default: null
    }
    return null;
}

export default function automationEditScreen({ navigation,route }, props) {
    const {iData} = route.params;
    // const [data, setData] = useState();
    const [steps, setSteps] = useState(iData.steps);
    const [visible, setVisible] = useState(false);
    const [foodName, changeFoodname] = useState(iData.name);
    console.log("steps is ",foodName);
    
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
                "time": 30
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

            case "power off":
                content = {
                    "type": "power off"
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

    var types = ['cook', 'notify', 'checkpoint', 'preheat', 'cooling', 'power off']
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

