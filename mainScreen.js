import React, { useState, Fragment } from 'react';
import { Slider, LinearProgress } from 'react-native-elements';
import { Image, View, Text } from 'react-native';
import styles from './styles'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'

const TemperatureSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%' }}> {Math.round(props.handler.value)}°C </Text>
            </View>

            <Slider
                value={props.handler.value}
                style={{ width: '100%' }}
                maximumTrackTintColor="#dfddff"
                minimumTrackTintColor="#ff6a00"
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
    const [value, setValue] = useState(180);
    const [value2, setValue2] = useState(80);
    return (
        <View>
            <Image
                style={{ width: '100%', height:'54%' }}
                source={require('./assets/Plate.jpg')}
                resizeMode='contain'
            />
            <LinearProgress
                color="#ff6a00"
                variant="determinate"
                value={0.5}
                style={{ height: 20 }}
                trackColor="#dfddff"
            />
            <Text style={styles.name}>Empty</Text>

            {/* <Button
        style={styles.round}
        title="Solid Button"
        />
        <Icon name="circle" size={30} color="#900" /> */}
            <View style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                <TemperatureSlider icon={<OvenTop height={30} width={30} fill={'black'}/>} handler={{value:value,setValue:setValue}}/>
                <TemperatureSlider icon={<OvenBottom height={30} width={30} fill={'black'}/>} handler={{value:value2,setValue:setValue2}}/>
            </View>
        </View>
    );
}

export default mainScreen