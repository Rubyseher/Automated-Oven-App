import React, { useState, Fragment, useEffect } from 'react';
// import { Slider } from 'react-native-elements';
import Slider from '@react-native-community/slider'
import { Image, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { styles, colors } from './styles'
import Wand from './assets/wand.svg'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ficon from 'react-native-vector-icons/Fontisto';
import ws from './Server'
import moment from 'moment';

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

            {/* <Slider
                value={props.handler.value}
                style={{ width: '100%', marginTop: -8 }}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                maximumValue={200}
                minimumValue={0}
                trackStyle={styles.sliderTrackStyle}
                onValueChange={value => props.handler.setValue(value)}
                thumbStyle={{ backgroundColor: 'transparent' }}
            /> */}

            <Slider
                maximumValue={250}
                minimumValue={0}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                step={1}
                onValueChange={value => props.handler.setValue(value)}
                // thumbTintColor='transparent'
                // maximumTrackImage={require("./assets/gradient3.png")}
                // minimumTrackImage={require("./assets/gradient2.png")}
                value={props.handler.value}
            />
        </Fragment>
    )
}

function mainScreen({ navigation }) {
    const [food, setFood] = useState('Burger');
    const [time, setTime] = useState("14 min 20 sec left");
    const [topTemp, setTopTemp] = useState(0);
    const [bottomTemp, setBottomTemp] = useState(0);
    const [data, setData] = useState();

    const cookingType = (e) => {
        
        // if()
    }


    const progressPercent = (e) => {
        if(!data.isPaused){
            startTime= moment.unix(data.startTime);
            endTime= moment.unix(data.endTime);
            totalTime=endTime.diff(startTime,'seconds')
        
            calculation=((moment().diff(startTime,'seconds')/totalTime)*100)
            return calculation
        }
        return 0;
    }

    const pauseButton = (e) => {
        req = {
            user: 'John',
            msg: 'method',
            method: 'pauseCooking'
        }
        ws.send(JSON.stringify(req));       
        ws.onmessage = (e) => {
            d = JSON.parse(e.data)
            console.log(d);
            if (d.msg == 'result') {
                console.log("result", d.result);
            }
        };
        if(isPaused){
            setTime("Paused")
        }
    }

    useEffect(() => {
        const parseData = (d) => {
            setTopTemp(d.top)
            setBottomTemp(d.bottom)
        }
        console.log("fetched");
        ws.onopen = () => {
            setInterval(() => {
                req = {
                    user: 'John',
                    msg: 'method',
                    method: 'getCooking'
                }
                ws.send(JSON.stringify(req));
            },1000)

        };
        ws.onmessage = (e) => {
            d = JSON.parse(e.data)
            console.log(d);
            if (d.msg == 'result') {
                console.log("result", d.result);
                setData(d.result)
                parseData(d.result)
            }
        };
    });

    return (
        data ? <View>
            <Image
                style={{ width: '100%', height: '53%' }}
                source={require('./assets/Plate.jpg')}
                resizeMode='cover'
            />
            <GradientProgress value={data.isCooking?progressPercent():0} trackColor={colors.white}  />
            <Text style={styles.title}>{data.isCooking?data.item:'Empty'}</Text>
            <Text style={styles.subtitle}>{data.isCooking?`${moment.unix(data.endTime).diff(moment(), 'minutes')} min ${moment.unix(data.endTime).diff(moment(), 'seconds')%60} sec left`:' '}</Text>
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <TemperatureSlider icon={<OvenTop height={28} width={28} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} />
                <TemperatureSlider icon={<OvenBottom height={28} width={28} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', alignContent: 'center', justifyContent: 'center' }}>
            {data.isCooking && <Button
                    onPress={() => navigation.navigate('automation')}
                    icon={<Wand height={25} width={25} fill={colors.black} />}
                    buttonStyle={styles.roundButtonS}
                    containerStyle={styles.roundButtonPaddingS}
                />}
                <Button
                    onPress={pauseButton}
                    icon={<Ficon name={data.isPaused?'play':'pause'} size={26} color={colors.darkGrey} />}
                    buttonStyle={styles.roundButtonM}
                    containerStyle={[styles.roundButtonPaddingM, { marginLeft: 40, marginRight: 40 }]}
                />
               { data.isCooking && <Button
                    onPress={() => { setTopTemp(0), setBottomTemp(0), setTime("Off"), setFood('Empty') }}
                    icon={<Ficon name="close-a" size={16} color={colors.red} />}
                    buttonStyle={styles.roundButtonS}
                    containerStyle={styles.roundButtonPaddingS}
                />}
            </View>
        </View> : <View></View>
    );
}

export default mainScreen