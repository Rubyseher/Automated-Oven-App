import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Slider } from 'react-native-elements';
import CircularSlider from 'rn-circular-slider'
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
    const [topTemp, setTopTemp] = useState(180);
    const [bottomTemp, setBottomTemp] = useState(80);
    const [timeSlider, setTimeSlider] = useState(30);
    const [items, setitems] = useState(data);

    return (
        <View >
            <Text style={styles.heading}>Automator</Text>

            <View style={[styles.autoContainer, {}]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.detailsCircle, { backgroundColor: colors.yellow }]}>
                        <Icon name="utensils" size={14} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} />
                    </View>
                    <Text style={styles.detailText}> Cook</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '60%', marginLeft: 20 }}>
                        <TopTempSlider icon={<OvenTop height={28} width={28} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} />
                        <BottomTempSlider icon={<OvenBottom height={28} width={28} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} />
                    </View>
                    <View style={{paddingLeft:5,justifyContent:'center'}}>
                        <CircularSlider
                            step={2}
                            min={0}
                            max={90}
                            value={timeSlider}
                            onChange={setTimeSlider}
                            contentContainerStyle={styles.contentContainerStyle}
                            strokeWidth={4}
                            buttonBorderColor={colors.blue}
                            openingRadian={Math.PI / 4}
                            buttonRadius={8}
                            radius={40}
                            linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.blue }]}
                        >
                            <Text style={styles.value}>{timeSlider}</Text>
                            <Text style={styles.min}>min</Text>
                        </CircularSlider>
                    </View>
                </View>
            </View>

        </View>
    );
}

