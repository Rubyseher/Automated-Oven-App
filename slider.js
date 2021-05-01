import { Slider } from 'react-native-elements';
import { Animated } from 'react-native';
import React, {useState} from 'react';
import {View,Text} from 'react-native';


const Slide = () => {
    const [value, setValue] = useState(89);

    return (
        <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
            <Slider
                value={value}
                maximumTrackTintColor='#dfddff'
                minimumTrackTintColor='#ff6a00'
                maximumValue={200}
                minimumValue={0}
                trackStyle={{backgroundColor:'#ff6a00',height:20,borderRadius:20 }}
                onValueChange={(value) => setValue( value )}
                thumbStyle={{ backgroundColor: 'transparent' }}
            />
            <Text>Value: {value}</Text>
        </View>
    );
};
export default Slide;
