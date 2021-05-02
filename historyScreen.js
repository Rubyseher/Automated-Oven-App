import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function historyScreen() {
    return (
        <View >
            <Text style={styles.heading}>History</Text>
            <View style={[styles.foodContainer, { flexDirection: 'row' }]}>
                <Button
                    buttonStyle={styles.foodCircle}
                    icon={<Icon name="utensils" size={22} color={colors.white} />}
                />
                <Text style={{ fontWeight: 'bold', marginLeft: 14, marginTop: 26, marginRight: 38, fontSize: 22 }}>Sandwiches</Text>
                <Button
                    buttonStyle={[styles.foodCircle, { height: 28, width: 28, marginTop: 26, backgroundColor: colors.lightRed }]}
                    icon={<Icon name="bookmark" size={12} color={colors.white} solid />}
                />
                <Button
                    buttonStyle={[styles.foodCircle, { height: 28, width: 28, marginTop: 26, backgroundColor: colors.blue }]}
                    icon={<Icon name="play" size={10} color={colors.white} solid />}
                />
            </View>
            <View style={styles.detailsContainer}>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle,{backgroundColor: colors.orange }]}
                    icon={<Icon name="thermometer-half" size={18} color={colors.white} solid />}
                />
                <Text style={{marginTop:15}}>180°C</Text>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle,{backgroundColor: colors.blue }]}
                    icon={<Icon name="stopwatch" size={18} color={colors.white} solid />}
                />
                <Text>20 min</Text>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle,{backgroundColor: colors.green }]}
                    icon={<Icon name="step-forward" size={18} color={colors.white} solid />}
                />
                <Text>3 Steps</Text>
            </View>
        </View>
    );
}

