import React, { useState, Fragment } from 'react';
import { Slider, LinearProgress } from 'react-native-elements';
import { Image, View, Text } from 'react-native';
import styles from './styles'

const TemperatureSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <Image
                    style={{ height: 30, width: 30 }}
                    source={props.image}
                    resizeMode="contain"
                />
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
    const [value, setValue] = useState(89);
    const [value2, setValue2] = useState(89);
    return (
        <View>
            <Image
                style={{ width: 390, height: 340 }}
                source={require('./images/emptyPlate.png')}
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
                <TemperatureSlider image={require('./images/OvenTop.png')} handler={{value:value,setValue:setValue}}/>
                <TemperatureSlider image={require('./images/OvenBottom.png')} handler={{value:value2,setValue:setValue2}}/>
            </View>
        </View>
    );
}

export default mainScreen