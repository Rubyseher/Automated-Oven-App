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
                onValueChange={(value) => setValue( value )}
            />
            <Text>Value: {value}</Text>
        </View>
    );
};
export default Slide;
