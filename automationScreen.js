import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { Cook, Checkpoint, Pause, Notify, PowerOff, Cooling } from './timeline';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ficon from 'react-native-vector-icons/Fontisto';

const data = require('./timeline.json')

const TimelineComponent = (props) => {
    item = props.item
    item.id = props.id
    
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
    const [items, setitems] = useState(data);
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
                items[1].steps.map((item, i) => (
                    <Fragment key={i}>
                        <TimelineComponent item={item} id={i} />
                        <View style={styles.timeThread}></View>
                    </Fragment>
                ))
            }
            <Button
                onPress={() => navigation.navigate('automation')}
                icon={<Icon name="plus" size={18} color={colors.white} />}
                buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue }]}
                containerStyle={styles.roundButtonPaddingS}
            />
        </ScrollView>
    );
}

