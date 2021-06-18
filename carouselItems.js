import React, { useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import CircularSlider from 'rn-circular-slider'
import Slider from '@react-native-community/slider'
import Ficon from 'react-native-vector-icons/Fontisto';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AuthContext } from './AuthContext';

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
                onValueChange={(v) => props.handler.setValue(v)}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                step={5}
                onSlidingComplete={v => { props.sendHandler(v); ReactNativeHapticFeedback.trigger("impactLight"); }}
                value={props.handler.value}
                style={{ marginBottom: -12 }}
                disabled={props.disabled}
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
        <View >
            <AnimatedCircularProgress
                size={125} width={10} fill={props.percent} style={{ alignItems: 'center' }} childrenContainerStyle={{ padding: 0 }} arcSweepAngle={360} rotation={0} tintColor={props.color}>
                {() => (
                    <View style={[styles.carouselCircle, { backgroundColor: props.color }]}>
                        {props.isPaused ? <Ficon name="pause" color={colors.white} size={38} solid style={{ alignSelf: 'center' }} /> :
                            <Icon name={props.icon} color={colors.white} size={38} solid style={{ alignSelf: 'center' }} />}
                    </View>
                )}
            </AnimatedCircularProgress>
            <Text style={[styles.carouselTitle]}>{props.name.capitalize()}</Text>
        </View>
    )
}

export const Preheat = (props) => {
    const [tempSlider, setTempSlider] = useState(parseInt(props.temp));

    const sendTemp = (value) => {
        // var ws = new WebSocket(config.url);
        // ws.onopen = () => {
        //     req = {
        //         module: 'cook',
        //         function: `setTemp`,
        //         params: [props.currentStep, value]
        //     }
        //     ws.send(JSON.stringify(req));
        //     ws.close()
        // };
    }

    return (
        <View style={styles.mainCardContainer}>
            <Title isPaused={props.isPaused} percent={props.percent} name={props.type} icon="fire-alt" color={colors.orange} />
            <Text style={[styles.currentTemp, { color: props.currentTemp > 180 ? colors.red : colors.orange }]}>{props.currentTemp}&deg;C</Text>
            <CircularSlider
                step={1} min={0} max={250} value={props.temp}
                contentContainerStyle={styles.contentContainerStyle}
                strokeWidth={4}
                buttonBorderColor={colors.red}
                openingRadian={Math.PI / 4} buttonRadius={!props.isDone ? 8 : 0} radius={40} linearGradient={[{ stop: '0%', color: colors.orange }, { stop: '100%', color: colors.red }]}
                onChange={(v) => { sendTemp(v); setTempSlider(v); if (v % 15 == 0) ReactNativeHapticFeedback.trigger("impactLight"); }}
            >
                <Text style={[styles.value, { color: colors.orange }]}>{tempSlider}</Text>
                <Text style={[styles.min, { color: colors.orange }]}>&deg;C</Text>
            </CircularSlider>
        </View>
    )
}
export const Cook = (props) => {
    const [topTemp, setTopTemp] = useState(parseInt(props.topTemp));
    const [bottomTemp, setBottomTemp] = useState(parseInt(props.bottomTemp));
    const [timeSlider, setTimeSlider] = useState(parseInt(props.duration));
    const { config } = useContext(AuthContext)

    const sendTime = (value) => {
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `setTime`,
                params: [props.currentStep, value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }

    const sendTemp = (value) => {
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `setTemp`,
                params: [props.currentStep, value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }


    return (
        <View style={styles.mainCardContainer}>

            <Title isPaused={props.isPaused} percent={props.percent} name={props.type} icon="utensils" color={colors.yellow} />

            <View style={{ width: '100%', marginLeft: 20 }}>
                <TemperatureSlider top icon={<OvenTop height={22} width={22} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} name="top" sendHandler={sendTemp} disabled={props.isDone} />
                <TemperatureSlider bottom icon={<OvenBottom height={22} width={22} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} name="bottom" sendHandler={sendTemp} disabled={props.isDone} />
            </View>
            <View style={{ paddingLeft: 5, justifyContent: 'center' }}>
                <CircularSlider
                    step={2} min={0} max={90} value={timeSlider} onChange={(v) => { sendTime(v); setTimeSlider(v); if (v % 15 == 0) ReactNativeHapticFeedback.trigger("impactLight"); }} contentContainerStyle={styles.contentContainerStyle} strokeWidth={4} buttonBorderColor={colors.orange}
                    openingRadian={Math.PI / 4} buttonRadius={!props.isDone ? 8 : 0} radius={40} linearGradient={[{ stop: '0%', color: colors.yellow }, { stop: '100%', color: colors.orange }]}
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
    return (
        <View style={styles.mainCardContainer}>
            <Title isPaused={props.isPaused} percent={props.percent} name={props.type} icon="flag" color={colors.blue} />

            <CircularSlider
                step={5} min={0} max={60} value={timeSlider}
                contentContainerStyle={styles.contentContainerStyle} strokeWidth={4}
                buttonBorderColor={colors.blue} openingRadian={Math.PI / 4}
                buttonRadius={!props.isDone ? 8 : 0} radius={40}
                onChange={setTimeSlider}
                linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.blue }]}
            >
                <Text style={styles.value}>{timeSlider}</Text>
                <Text style={styles.min}>sec</Text>
            </CircularSlider>
        </View>
    )
}

export const Notify = (props) => {
    const destiColor = ["lightRed", "orange", "yellow", "blue"]
    const [title, changeTitle] = useState(props.title);
    const [msg, changeMsg] = useState(props.message);

    return (
        <View style={styles.mainCardContainer}>

            <Title isPaused={props.isPaused} percent={props.percent} name={props.type} icon="bell" color={colors.purple} />

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
        <View style={styles.mainCardContainer}>

            <Title isPaused={props.isPaused} percent={props.percent} name={props.type} icon="power-off" color={colors.red} />
            <Icon name="power-off" size={38} color={colors.lightRed} style={{ alignSelf: 'center', marginTop: 18 }} solid />
        </View>
    )
}

export const Cooling = (props) => {
    const [timeSlider, setTimeSlider] = useState(parseInt(props.duration));

    const sendTime = (value) => {
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `setTime`,
                params: [props.currentStep, value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }

    return (
        <View style={styles.mainCardContainer}>

            <Title isPaused={props.isPaused} percent={props.percent} name={props.type} icon="snowflake" color={colors.turquoise} />

            <CircularSlider
                step={1} min={0} max={10} value={timeSlider} contentContainerStyle={styles.contentContainerStyle}
                strokeWidth={4} buttonBorderColor={colors.turquoise} openingRadian={Math.PI / 4} buttonRadius={!props.isDone ? 8 : 0} radius={40}
                linearGradient={[{ stop: '0%', color: colors.blue }, { stop: '100%', color: colors.turquoise }]}
                onChange={(v) => { sendTime(v); setTimeSlider(v); if (v % 15 == 0) ReactNativeHapticFeedback.trigger("impactLight"); }}
            >
                <Text style={styles.value}>{timeSlider}</Text>
                <Text style={styles.min}>min</Text>
            </CircularSlider>
        </View>
    )
}

// function carouselItems({ navigation }) {
//     useEffect(() => {
//         effect
//         return () => {
//             cleanup
//         }
//     }, [input])
// return(null)
// }
// export default carouselItems
