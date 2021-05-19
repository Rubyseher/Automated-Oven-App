import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles';
import { Cook, Checkpoint, Pause, Notify, PowerOff, Cooling, timelineData } from './timeline';
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
        case "Cook": return <Cook {...item} />
        case "Checkpoint": return <Checkpoint {...item} />
        case "Pause": return <Pause {...item} />
        case "Notify": return <Notify {...item} />
        case "PowerOff": return <PowerOff {...item} />
        case "Cooling": return <Cooling {...item} />
        default: null
    }
}

export default function automationScreen({ navigation }) {
    const [items, setItems] = useState(data[1]);
    const [steps, setSteps] = useState(data[1].steps);
    const [visible, setVisible] = useState(true);

    function removeItem(i) {
        setSteps(st => st = st.filter((s, index) => index != i));
        console.log("steps is :", steps);
    }
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function addItem(i) {
        console.log("i is ", i);
        console.log("steps is :", steps);

        switch (i) {
            case "Cook": return setSteps(st => st = st.push(
                {
                    "type": "Cook",
                    "topTemp": 170,
                    "bottomTemp": 0,
                    "time": 30
                }
            ))
            case "Checkpoint": return setSteps(st => st = st.push(
                {
                    "type": "Checkpoint",
                    "wait": true,
                    "timeout": 30
                }
            ))

            case "Pause": return setSteps(st => st = st.push(
                {
                    "type": "Pause"
                }
            ))

            case "Notify": return setSteps(st => st = st.push(
                {
                    "type": "Notify",
                    "destination": ["John", "Bob", "Tom", "Alexa"],
                    "title": "Cooking Complete",
                    "message": "Pizza is done Cooking"
                }
            ))

            case "PowerOff": return setSteps(st => st = st.push(
                {
                    "type": "PowerOff"
                }
            ))

            case "Cooling": return setSteps(st => st = st.push(
                {
                    "type": "Cooling",
                    "duration": 10
                }
            ))

            default: null
        }
        // setSteps(st => st = st.push(i));
        // console.log("steps is :", steps);
    }

    var types = ['Cook', 'Cooling', 'Checkpoint', 'Notify', 'Pause', 'PowerOff']
    var stepColor = ['yellow', 'turquoise', 'blue', 'orange', 'textGrey', 'red']
    var icon = ['utensils', 'snowflake', 'flag', 'bell', 'pause', 'power-off']
    // var ficon=['utensils', 'snowflake', 'flag', 'bell-alt', 'pause', 'power']

    return (
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
    );
}

