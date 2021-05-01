import React, { useState, Fragment } from 'react';
import { Slider } from 'react-native-elements';
import { Image, View, Text } from 'react-native';
import {styles, colors} from './styles'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import LinearGradient from 'react-native-linear-gradient';

const GradientProgress = (props) => {
    return (
        <View style={[{ width: '100%', height: 12, backgroundColor: props.trackColor ? props.trackColor : '#e1dddd' },props.trackStyle]}>
            <LinearGradient colors={[colors.yellow, colors.orange]} start={{ x: 0, y: 0 }} locations={[0.5,1]} style={{ width: `${props.value}%`, height: '100%' }}></LinearGradient>
        </View>
    )
}

const TemperatureSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
            </View>

            <Slider
                value={props.handler.value}
                style={{ width: '100%' }}
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

function mainScreen() {
    const [topTemp, setTopTemp] = useState(180);
    const [bottomTemp, setBottomTemp] = useState(80);
    return (
        <View>
            <Image
                style={{ width: '100%', height: '53%' }}
                source={require('./assets/Plate.jpg')}
                resizeMode='cover'
            />
            <GradientProgress value={70} trackColor={colors.white}/>
            <Text style={styles.title}>Burger</Text>
            <Text style={styles.subtitle}>14 min 34 sec left</Text>
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <TemperatureSlider icon={<OvenTop height={25} width={25} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} />
                <TemperatureSlider icon={<OvenBottom height={25} width={25} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} />
            </View>
        </View>
    );
}

export default mainScreen