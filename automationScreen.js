import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Slider } from 'react-native-elements';
import Timeline from './timeline';
const data= require('./timeline.json')

const TopTempSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 7 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '84%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
            </View>

            <Slider
                value={props.handler.value}
                style={{ width: '100%', marginTop: -8 }}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                maximumValue={200}
                minimumValue={0}
                trackStyle={styles.sliderTrackStyle}
                onValueChange={value => props.handler.setValue(value)}
                thumbStyle={{ backgroundColor: 'transparent' }}
            />
        </Fragment>
    )
}
const BottomTempSlider = (props) => {
    return (
        <Fragment>
            <Slider
                value={props.handler.value}
                style={{ width: '100%', marginTop: -8 }}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                maximumValue={200}
                minimumValue={0}
                trackStyle={styles.sliderTrackStyle}
                onValueChange={value => props.handler.setValue(value)}
                thumbStyle={{ backgroundColor: 'transparent' }}
            />

            <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10, marginTop: -5 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '84%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
            </View>
        </Fragment>
    )
}

export default function automationScreen() {

    const [items, setitems] = useState(data);

    return (
        <View >
            <Text style={styles.heading}>Automator</Text>

        <Timeline items={items}/>
        </View>
    );
}

