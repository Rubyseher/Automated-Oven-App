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
                <Text style={[styles.fullName,{marginTop:26}]}>Sandwiches</Text>
                <Button
                    buttonStyle={[styles.foodCircle,styles.foodCircleM, {backgroundColor: colors.lightRed }]}
                    icon={<Icon name="bookmark" size={12} color={colors.white} solid />}
                />
                <Button
                    buttonStyle={[styles.foodCircle,styles.foodCircleM, {backgroundColor: colors.blue }]}
                    icon={<Icon name="play" size={10} color={colors.white} solid />}
                />
            </View>
            <View style={[styles.detailsContainer, {justifyContent:'center'}]}>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle, { backgroundColor: colors.orange }]}
                    icon={<Icon name="thermometer-half" size={14} color={colors.white} solid />}
                />
                <Text style={styles.detailText}> 180°C</Text>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle, { backgroundColor: colors.blue }]}
                    icon={<Icon name="stopwatch" size={14} color={colors.white} solid />}
                />
                <Text style={styles.detailText}> 20 min</Text>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle, { backgroundColor: colors.green }]}
                    icon={<Icon name="step-forward" size={14} color={colors.white} solid />}
                />
                <Text style={styles.detailText}> 3 Steps</Text>
            </View>
        </View>
    );
}
