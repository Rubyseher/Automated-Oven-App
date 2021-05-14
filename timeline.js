import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import CircularSlider from 'rn-circular-slider'
import Slider from '@react-native-community/slider'
import { ScrollView } from 'react-native';

const TemperatureSlider = (props) => {
    return (
        <Fragment>
            {
                props.top && <View style={{ flexDirection: 'row', width: '100%', marginTop: 14 }}>
                    {props.icon}
                    <Text style={{ textAlign: 'right', width: '85%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
                </View>
            }
            <Slider
                maximumValue={250}
                minimumValue={0}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                step={5}
                onValueChange={value => { props.handler.setValue(value); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name, value) }}
                value={props.handler.value}
                style={{ marginTop: -10 }}
            />
            {
                props.bottom && <View style={{ flexDirection: 'row', width: '100%', marginTop: -6, marginBottom: 10 }}>
                    {props.icon}
                    <Text style={{ textAlign: 'right', width: '85%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
                </View>
            }
        </Fragment>
    )
}
const Title = (props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={[styles.detailsCircle, { backgroundColor: colors[props.color] }]}>
                <Icon name={props.icon} size={12} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} solid />
            </View>
            <Text style={[styles.autoTitle]}> &nbsp;{props.type}</Text>
        </View>
    )
}

const Cook = (props) => {
    const [topTemp, setTopTemp] = useState(180);
    const [bottomTemp, setBottomTemp] = useState(80);
    const [timeSlider, setTimeSlider] = useState(30);

    return (
        <View style={[styles.autoContainer, { marginBottom: 40 }]}>
            <Title type={props.type} color={props.color} icon={props.icon} />

            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '60%', marginLeft: 20 }}>
                    <TemperatureSlider top icon={<OvenTop height={28} width={28} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} />
                    <TemperatureSlider bottom icon={<OvenBottom height={28} width={28} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} />
                </View>
                <View style={{ paddingLeft: 5, justifyContent: 'center' }}>
                    <CircularSlider
                        step={2} min={0} max={90} value={timeSlider} onChange={setTimeSlider} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.blue}
                        openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.blue }]}
                    >
                        <Text style={styles.value}>{timeSlider}</Text>
                        <Text style={styles.min}>min</Text>
                    </CircularSlider>
                </View>
            </View>
        </View>)

}
const Checkpoint = (props) => {
    const [timeSlider, setTimeSlider] = useState(1);
    return (
        <View style={[styles.autoContainer, { marginBottom: 40 }]}>
            <Title type={props.type} color={props.color} icon={props.icon} />
            <View style={{ flexDirection: 'row' }}>

                <View style={{ paddingLeft: 5, justifyContent: 'center' }}>
                    <CircularSlider
                        step={2} min={0} max={10} value={timeSlider} onChange={setTimeSlider} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.blue}
                        openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.blue }]}
                    >
                        <Text style={styles.value}>{timeSlider}</Text>
                        <Text style={styles.min}>min</Text>
                    </CircularSlider>
                </View>
                <View style={{ width: '60%', marginLeft: 20 }}>
                    <Title type={"Send notification"} color={props.color} icon={props.icon} />
                    <Title type={"Wait for conformation"} color={props.color} icon={props.icon} />

                </View>
            </View>
        </View>
    )
}
const Pause = (props) => {
    return (
        <View style={[styles.autoContainer, { marginBottom: 40 }]}>
            <Title type={props.type} color={props.color} icon={props.icon} />
        </View>
    )
}
const Notify = (props) => {
    return (
        <View style={[styles.autoContainer, { marginBottom: 40 }]}>
            <Title type={props.type} color={props.color} icon={props.icon} />
        </View>
    )
}
const PowerOff = (props) => {
    return (
        <View style={[styles.autoContainer, { marginBottom: 40 }]}>
            <Title type={props.type} color={props.color} icon={props.icon} />
        </View>
    )
}
const Cooling = (props) => {
    return (
        <View style={[styles.autoContainer, { marginBottom: 40 }]}>
            <Title type={props.type} color={props.color} icon={props.icon} />
        </View>
    )
}


export default function Timeline(props) {
    return (
        <ScrollView vertical={true} contentContainerStyle={{ height: '300%' }}>
            {
                props.items[1].steps.map((item, i) => (
                    <Fragment>
                        {/* <{item.type}/> */}
                        <Checkpoint type={item.type} color={item.color} icon={item.icon} />
                        {/* <Title type={item.type} color={item.color} icon={item.icon} /> */}
                    </Fragment>
                ))
            }
        </ScrollView>
    );
}

