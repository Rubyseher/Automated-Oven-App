import React, { Fragment, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles, colors } from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import CircularSlider from 'rn-circular-slider'
import Slider from '@react-native-community/slider'
import { ScrollView } from 'react-native';
import Ficon from 'react-native-vector-icons/Fontisto';

const TemperatureSlider = (props) => {
    return (
        <View>
            {
                props.top && <View style={{ flexDirection: 'row', width: '100%', marginLeft: 4, marginBottom: -12 }}>
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
                onValueChange={value => { props.handler.setValue(value); ReactNativeHapticFeedback.trigger("impactLight"); }}
                value={props.handler.value}
                style={{ marginBottom: -12 }}
                thumbTintColor="transparent"
            />
            {
                props.bottom && <View style={{ flexDirection: 'row', width: '100%', marginLeft: 4 }}>
                    {props.icon}
                    <Text style={{ textAlign: 'right', width: '85%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
                </View>
            }
        </View>
    )
}
const Title = (props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={[styles.detailsCircle, { backgroundColor: colors[props.color] }]}>
                <Icon name={props.icon} size={12} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} solid />
            </View>
            <Text style={styles.autoTitle}> &nbsp;{props.type}</Text>
        </View>
    )
}

const Cook = (props) => {
    const [topTemp, setTopTemp] = useState(parseInt(props.topTemp));
    const [bottomTemp, setBottomTemp] = useState(parseInt(props.bottomTemp));
    const [timeSlider, setTimeSlider] = useState(parseInt(props.time));

    return (
        <View style={[styles.autoContainer]}>
            <Title type="Cook" color={props.color} icon={props.icon} />

            <View style={{ flexDirection: 'row', marginTop: 14 }}>
                <View style={{ width: '60%', marginLeft: 20 }}>
                    <TemperatureSlider top icon={<OvenTop height={22} width={22} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} />
                    <TemperatureSlider bottom icon={<OvenBottom height={22} width={22} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} />
                </View>
                <View style={{ paddingLeft: 5, justifyContent: 'center' }}>
                    <CircularSlider
                        step={2} min={0} max={90} value={timeSlider} onChange={setTimeSlider} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.orange}
                        openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors[props.color] }, { stop: '100%', color: colors.orange }]}
                    >
                        <Text style={[styles.value, { color: colors.orange }]}>{timeSlider}</Text>
                        <Text style={[styles.min, { color: colors.orange }]}>min</Text>
                    </CircularSlider>
                </View>
            </View>
        </View>)

}
const Checkpoint = (props) => {
    const [timeSlider, setTimeSlider] = useState(parseInt(props.timeout));
    const [checked, setchecked] = useState(false);
    return (
        <View style={[styles.autoContainer]}>
            <Title type='Checkpoint' color={props.color} icon={props.icon} />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>

                <View style={{ paddingLeft: 14, justifyContent: 'center' }}>
                    <CircularSlider
                        step={5} min={0} max={60} value={timeSlider} onChange={setTimeSlider} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.blue}
                        openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.blue }]}
                    >
                        <Text style={styles.value}>{timeSlider}</Text>
                        <Text style={styles.min}>sec</Text>
                    </CircularSlider>
                </View>
                <View style={{ width: '60%', marginLeft: 14, marginTop: 15 }}>
                    <Title type="Wait for conformation" color={props.color} icon="check" />
                </View>
            </View>
        </View>
    )
}
const Pause = (props) => {
    return (
        <View style={[styles.autoContainer]}>
            <Title type='Pause' color={props.color} icon={props.icon} />
            <View style={[styles.roundButtonM, { backgroundColor: colors[props.color] ,margin:10 }]}>
                <Ficon name={props.icon} size={24} color={colors.white} style={{ alignSelf: 'center', marginTop: 18 }} solid />
            </View>
        </View>
    )
}
const Notify = (props) => {
    const destiColor = ["lightRed", "orange", "yellow", "blue"]
    const [title, changeTitle] = useState(props.title);
    const [msg, changeMsg] = useState(props.message);
    return (
        <View style={[styles.autoContainer]}>
            <Title type='Notify' color={props.color} icon={props.icon} />
            <View style={{marginTop:10}}>
                <TextInput
                    style={[styles.notifyMsg, { fontWeight: 'bold' }]}
                    onChangeText={changeTitle}
                    value={title}
                />
                <TextInput
                    style={styles.notifyMsg}
                    onChangeText={changeMsg}
                    value={msg}
                />
                <View style={{ flexDirection: 'row', width: '100%', height: 90, flexWrap: 'wrap', padding: 10 }}>

                    {
                        props.destination.map((item, i) => (
                            <View style={{ flexDirection: 'row', width: '32%' }}>
                                <View style={[styles.detailsCircle, { backgroundColor: colors[destiColor[i%4]] }]}>
                                    <Icon name='check' size={10} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} solid />
                                </View>
                                <Text style={styles.autoTitle}> &nbsp;{item}</Text>
                            </View>
                        ))
                    }

                </View>
            </View>


        </View>
    )
}
const PowerOff = (props) => {
    return (
        <View style={[styles.autoContainer]}>
            <Title type='Power Off' color={props.color} icon={props.icon} />
            <View style={[styles.roundButtonM, { backgroundColor: colors[props.color] ,margin:10}]}>
                <Icon name={props.icon} size={24} color={colors.white} style={{ alignSelf: 'center', marginTop: 18 }} solid />
            </View>
        </View>
    )
}
const Cooling = (props) => {
    const [timeSlider, setTimeSlider] = useState(parseInt(props.duration));
    return (
        <View style={[styles.autoContainer]}>
            <Title type="Cooling Time" color={props.color} icon={props.icon} />
            <CircularSlider
                step={1} min={0} max={10} value={timeSlider} onChange={setTimeSlider} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors[props.color]}
                openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors[props.color] }]}
            >
                <Text style={styles.value}>{timeSlider}</Text>
                <Text style={styles.min}>min</Text>
            </CircularSlider>
        </View>
    )
}

export default function Timeline(props) {
    return (
        <ScrollView vertical={true} contentContainerStyle={{ height: '300%', marginTop: 5 }}>
            {
                props.items[1].steps.map((item, i) => {
                    switch (item.type) {
                        case "Cook": return <Cook color={item.color} icon={item.icon} topTemp={item.topTemp} bottomTemp={item.bottomTemp} time={item.time} />
                        case "Checkpoint": return <Checkpoint color={item.color} icon={item.icon} timeout={item.timeout} />
                        case "Pause": return <Pause color={item.color} icon={item.icon} />
                        case "Notify": return <Notify color={item.color} icon={item.icon} title={item.title} message={item.message} destination={item.destination} />
                        case "PowerOff": return <PowerOff color={item.color} icon={item.icon} />
                        case "Cooling": return <Cooling color={item.color} icon={item.icon} duration={item.duration} />
                        default: null
                    }
                    {/* <{item.type}/> */ }
                    {/* <Checkpoint type={item.type} color={item.color} icon={item.icon} /> */ }
                    {/* <Title type={item.type} color={item.color} icon={item.icon} /> */ }
                })
            }
        </ScrollView>
    );
}

