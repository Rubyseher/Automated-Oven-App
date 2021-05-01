import React, { useState } from 'react';
import { Slider, LinearProgress } from 'react-native-elements';
import { Image, View, Text } from 'react-native';
import styles from './styles'

function mainScreen() {
    const [value, setValue] = useState(89);
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
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Image
                        style={{ height: 30, width: 30 }}
                        source={require('./images/OvenTop.png')}
                        resizeMode="contain"
                    />
                    <Text style={{ textAlign: 'right', width: '90%' }}> 180°C </Text>
                </View>
                <Slider
                    value={value}
                    style={{ width: '100%' }}
                    maximumTrackTintColor="#dfddff"
                    minimumTrackTintColor="#ff6a00"
                    maximumValue={200}
                    minimumValue={0}
                    trackStyle={styles.sliderTrackStyle}
                    onValueChange={value => setValue(value)}
                    thumbStyle={{ backgroundColor: 'transparent' }}
                />
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Image
                        style={{ height: 30, width: 30 }}
                        source={require('./images/OvenBottom.png')}
                        resizeMode="contain"
                    />
                    <Text style={{ textAlign: 'right', width: '90%' }}> 18°C </Text>
                </View>
                <Slider
                    value={value}
                    style={{ width: '100%' }}
                    maximumTrackTintColor="#dfddff"
                    minimumTrackTintColor="#ff6a00"
                    maximumValue={200}
                    minimumValue={0}
                    trackStyle={styles.sliderTrackStyle}
                    onValueChange={value => setValue(value)}
                    thumbStyle={{ backgroundColor: 'transparent' }}
                />
            </View>
        </View>
    );
}

export default mainScreen