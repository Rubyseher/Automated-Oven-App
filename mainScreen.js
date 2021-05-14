import React, { useState, Fragment, useEffect } from 'react';
import Slider from '@react-native-community/slider'
import { Image, View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { styles, colors } from './styles'
import Wand from './assets/wand.svg'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import LinearGradient from 'react-native-linear-gradient';
import Ficon from 'react-native-vector-icons/Fontisto';
import ws from './Server'
import moment from 'moment';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
// import RNRestart from 'react-native-restart';

const GradientProgress = (props) => {
    return (
        <View style={[{ width: '100%', height: 12, backgroundColor: props.trackColor ? props.trackColor : '#e1dddd' }, props.trackStyle]}>
            <LinearGradient colors={[colors.yellow, colors.orange]} start={{ x: 0, y: 0 }} locations={[0.5, 1]} style={{ width: `${props.value}%`, height: '100%' }}></LinearGradient>
        </View>
    )
}

const TemperatureSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 7 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
            </View>
            <Slider
                maximumValue={250}
                minimumValue={0}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                step={5}
                onValueChange={value => { props.handler.setValue(value); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name, value) }}
                value={props.handler.value}
            />
        </Fragment>
    )
}

function mainScreen({ navigation }) {
    const [food, setFood] = useState('Empty');
    const [time, setTime] = useState(" ");
    const [topTemp, setTopTemp] = useState(0);
    const [bottomTemp, setBottomTemp] = useState(0);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    const progressPercent = (e) => {
        if (!data.isPaused) {
            startTime = moment.unix(data.startTime);
            endTime = moment.unix(data.endTime);
            totalTime = endTime.diff(startTime, 'seconds')

            calculation = ((moment().diff(startTime, 'seconds') / totalTime) * 100)
            return calculation
        }
        return 0;
    }

    const setTemp = (name, value) => {
        req = {
            msg: 'direct',
            module: 'cook',
            function: `set${name}Temp`,
            params: [value]
        }
        ws.send(JSON.stringify(req));
    }

    const sendRequest = (task) => {
        ReactNativeHapticFeedback.trigger("impactHeavy");
        if (task == 'stop')
            req = {
                msg: 'direct',
                module: 'cook',
                function: 'stop'
            }
        else
            req = {
                msg: 'direct',
                module: 'cook',
                function: data.isPaused ? 'resume' : 'pause'
            }
        ws.send(JSON.stringify(req));
    }

    useEffect(() => {
        const parseData = (d) => {
            setTopTemp(d.top)
            setBottomTemp(d.bottom)
            d.isPaused ? setTime('Paused') : setTime(`${moment.unix(d.endTime).diff(moment(), 'minutes')} min ${moment.unix(d.endTime).diff(moment(), 'seconds') % 60} sec left`)
        }
        console.log(ws.readyState);
        ws.onopen = () => {
            interval = setInterval(() => {
                req = {
                    msg: 'direct',
                    module: 'cook',
                    function: 'get'
                }
                ws.send(JSON.stringify(req));
            }, 1000)
        };
        ws.onmessage = (e) => {
            d = JSON.parse(e.data)
            if (d.msg == 'result' && d.result.hasOwnProperty('isCooking')) {
                console.log("result", d.result);
                setData(d.result)
                parseData(d.result)
            }
        };
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    });

    return (
        data ? <View>
            <Image
                style={{ width: '100%', height: '50%' }}
                source={require('./assets/Plate.jpg')}
                resizeMode='cover'
            />
            <GradientProgress value={data.isCooking ? progressPercent() : 0} trackColor={colors.white} />
            <Text style={styles.title}>{data.isCooking ? data.item : 'Empty'}</Text>
            <Text style={styles.subtitle}>{data.isCooking ? time : ' '}</Text>
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <TemperatureSlider icon={<OvenTop height={28} width={28} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} sendHandler={setTemp} name='Top' />
                <TemperatureSlider icon={<OvenBottom height={28} width={28} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} sendHandler={setTemp} name='Bottom' />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', alignContent: 'center', justifyContent: 'center' }}>
                {data.isCooking && <Button
                    onPress={() => navigation.navigate('automation')}
                    icon={<Wand height={25} width={25} fill={colors.black} />}
                    buttonStyle={styles.roundButtonS}
                    containerStyle={styles.roundButtonPaddingS}
                />}
                <Button
                    onPress={() => sendRequest('pause')}
                    icon={<Ficon name={data.isCooking && !data.isPaused ? 'pause' : 'play'} size={26} color={colors.darkGrey} />}
                    buttonStyle={styles.roundButtonM}
                    containerStyle={[styles.roundButtonPaddingM, { marginLeft: 40, marginRight: 40 }]}
                />
                {data.isCooking && <Button
                    onPress={() => sendRequest('stop')}
                    icon={<Ficon name="close-a" size={16} color={colors.red} />}
                    buttonStyle={styles.roundButtonS}
                    containerStyle={styles.roundButtonPaddingS}
                />}
            </View>
        </View> :

            <View style={{ width: '100%', height: '100%', justifyContent: 'center', padding: '15%' }}>
                {loading && <ActivityIndicator size="large" />}
                {!loading &&
                    <Fragment>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, color: colors.textGrey }}>Oops! Couldn't Connect to The Device.{'\n'}</Text>
                        <Button
                            title="Try Again"
                            type="clear"
                            titleStyle={{ color: colors.blue }}
                            onPress={() => {
                                ReactNativeHapticFeedback.trigger("impactHeavy");
                                // RNRestart.Restart()
                            }}
                        />
                    </Fragment>
                }
            </View>
    );
}

export default mainScreen