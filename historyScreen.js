import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon  from 'react-native-vector-icons/FontAwesome5';

export default function historyScreen() {
    return (
        <View >
            <Text style={styles.heading}>History</Text>
            <View style={[styles.foodContainer,{flexDirection:'row'}]}>
                <Button
                    buttonStyle={styles.foodCircle}
                    icon={<Icon name="utensils" size={22} color={colors.white} />}
                />
                <Text style={{fontWeight:'bold'}}>Sandwiches</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text>hu</Text>
            </View>
        </View>
    );
}

