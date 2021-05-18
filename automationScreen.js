import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles';
import { Cook, Checkpoint, Pause, Notify, PowerOff, Cooling, timelineData } from './timeline';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ficon from 'react-native-vector-icons/Fontisto';

const data = require('./timeline.json')

const TimelineComponent = (props) => {
    var item = props.item
    item.id = props.id
    item.removeItem=props.removeItem

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

    function removeItem(i) {
        setSteps(st =>st= st.filter((s,index) => index!=i));
        console.log("steps is :",steps);
    }

    return (
        <ScrollView vertical={true} contentContainerStyle={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 200 }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <Text style={styles.heading}>Automator</Text>
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
                        <TimelineComponent item={item} id={i} removeItem={removeItem}/>
                        <View style={styles.timeThread}></View>
                    </Fragment>
                ))
            }
            <Button
                onPress={() => console.log("Add Menu")}
                icon={<Icon name="plus" size={18} color={colors.white} />}
                buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue }]}
                containerStyle={styles.roundButtonPaddingS}
            />
        </ScrollView>
    );
}

