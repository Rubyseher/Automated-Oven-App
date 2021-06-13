import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles, colors } from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import CircularSlider from 'rn-circular-slider'
import Slider from '@react-native-community/slider'
import { Button } from 'react-native-elements';
import Ficon from 'react-native-vector-icons/Fontisto';

const TemperatureSlider = (props) => {
    const setTemp = (value) => {
        var ws = new WebSocket('ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `setTemp`,
                params: [(props.name=="top"?"top":"bottom"), value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }
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
                onValueChange={(v)=> props.handler.setValue(v)}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                step={5}
                onSlidingComplete={value => { setTemp(value); ReactNativeHapticFeedback.trigger("impactLight"); }}
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
            <View style={[styles.detailsCircle, { backgroundColor: props.color }]}>
                <Icon name={props.icon} size={12} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} solid />
            </View>
            <Text style={styles.autoTitle}> &nbsp;{props.type}</Text>
            <Button
                onPress={() => props.removeItem(props.id)}
                icon={<Ficon name="close-a" size={6} color={colors.white} />}
                buttonStyle={styles.closeButtonS}
                containerStyle={styles.closeButtonPaddingS}
            />
        </View>
    )
}

const Checkbox = (props) => {
    const [checked, setChecked] = useState(true)
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={[styles.detailsCircle, { backgroundColor: props.color }]}>
                <Icon name={props.icon} size={12} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} solid />
            </View>
            <Text style={styles.autoTitle}> &nbsp;{props.type}</Text>
        </View>
    )
}

export const Preheat = (props) => {
    const [tempSlider, setTempSlider] = useState(parseInt(props.temp));
    const setTemp = (value) => {
        var ws = new WebSocket('ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `setTemp`,
                params: ["preheat",value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }
    return (
        <View >
            <CircularSlider
                step={1} min={0} max={250} value={tempSlider}
                onChange={(v) => { setTemp(v); setTempSlider(v); if (v % 2 == 0) ReactNativeHapticFeedback.trigger("impactLight"); }}
                contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.red}
                openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors.orange }, { stop: '100%', color: colors.red }]}
            >
                <Text style={{ 'color': colors.red, 'fontSize': 18 }}>{tempSlider}°C</Text>
            </CircularSlider>
        </View>
    )
}
export const Cook = (props) => {
    const [topTemp, setTopTemp] = useState(parseInt(props.topTemp));
    const [bottomTemp, setBottomTemp] = useState(parseInt(props.bottomTemp));
    const [timeSlider, setTimeSlider] = useState(parseInt(props.duration));
    const setTemp = (value) => {
        var ws = new WebSocket('ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `setTime`,
                params: ["cook",value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }
    return (
        <View >
            <View style={{ width: '100%', marginLeft: 20 }}>
                <TemperatureSlider top icon={<OvenTop height={22} width={22} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} name="top"/>
                <TemperatureSlider bottom icon={<OvenBottom height={22} width={22} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} name="bottom"/>
            </View>
            <View style={{ paddingLeft: 5, justifyContent: 'center' }}>
                <CircularSlider
                    step={2} min={0} max={90} value={timeSlider} onChange={(v) => {setTemp(v); setTimeSlider(v); if (v % 15 == 0) ReactNativeHapticFeedback.trigger("impactLight"); }} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.orange}
                    openingRadian={Math.PI / 4} buttonRadius={8} radius={40} linearGradient={[{ stop: '0%', color: colors.yellow }, { stop: '100%', color: colors.orange }]}
                >
                    <Text style={[styles.value, { color: colors.orange }]}>{timeSlider}</Text>
                    <Text style={[styles.min, { color: colors.orange }]}>min</Text>
                </CircularSlider>
            </View>
        </View>
    )
}
export const Checkpoint = (props) => {
    const [timeSlider, setTimeSlider] = useState(parseInt(props.timeout));
    const [checked, setchecked] = useState(false);
    return (
        <View >
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ paddingLeft: 14, justifyContent: 'center' }}>
                    <CircularSlider
                        step={5} min={0} max={60} value={timeSlider} 
                        contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} 
                        buttonBorderColor={colors.blue} openingRadian={Math.PI / 4} 
                        buttonRadius={8} radius={40} 
                        linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.blue }]}
                    >
                        <Text style={styles.value}>{timeSlider}</Text>
                        <Text style={styles.min}>sec</Text>
                    </CircularSlider>
                </View>
            </View>
        </View>
    )
}
// export const Pause = (props) => {
//     return (
//         <View >
//             <Title type='Pause' color={colors.textGrey} icon="pause" id={props.id}  removeItem={props.removeItem} />
//             <View style={{ margin: 20 }}>
//                 <Ficon name="pause" size={38} color={colors.textGrey} style={{ alignSelf: 'center', marginTop: 18 }} solid />
//             </View>
//         </View>
//     )
// }
export const Notify = (props) => {
    const destiColor = ["lightRed", "orange", "yellow", "blue"]
    const [title, changeTitle] = useState(props.title);
    const [msg, changeMsg] = useState(props.message);

    return (
        <View >
            {/* <View style={{ marginTop: 10 }}>
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
                            <View key={i} style={{ flexDirection: 'row', width: '32%' }}>
                                <View style={[styles.detailsCircle, { backgroundColor: colors[destiColor[i % 4]] }]}>
                                    <Icon name='check' size={10} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} solid />
                                </View>
                                <Text style={styles.autoTitle}> &nbsp;{item}</Text>
                            </View>
                        ))
                    }
                </View>
            </View> */}
        </View>
    )
}
export const PowerOff = (props) => {
    return (
            <View style={{ margin: 20 }}>
                <Icon name="power-off" size={38} color={colors.lightRed} style={{ alignSelf: 'center', marginTop: 18 }} solid />
            </View>
    )
}
export const Cooling = (props) => {
    const [timeSlider, setTimeSlider] = useState(parseInt(props.duration));
    return (
            <CircularSlider
                step={1} min={0} max={10} value={timeSlider} contentContainerStyle={styles.contentContainerStyle} 
                strokeWidth={4} buttonBorderColor={colors.turquoise} openingRadian={Math.PI / 4} buttonRadius={8} radius={40} 
                linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.turquoise }]}
            >
                <Text style={styles.value}>{timeSlider}</Text>
                <Text style={styles.min}>min</Text>
            </CircularSlider>
    )
}


