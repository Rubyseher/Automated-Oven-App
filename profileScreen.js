import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BarChart } from 'react-native-svg-charts'

export default function profileScreen() {
    const usage = colors.blue
    const energy = colors.lightGreen
    const usageData = [180, 300, 0, 80, 30, 150]
    const energyData = [180, 300, 0, 80, 30, 150]

    return (
        <View >
            <ScrollView vertical={true} contentContainerStyle={{ height: '105%' }}>
                <Text style={styles.heading}>Profile</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        icon={<Icon name="user" color={colors.white} size={28} solid />}
                        buttonStyle={styles.profileCircle}
                    // containerStyle={[styles.foodCircleM, {marginLeft:50,marginTop:-17}]}
                    />
                    <Text style={[styles.fullName, { marginTop: 20 }]}>Jon Snow</Text>
                </View >

                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={styles.weekly}>Weekly Usage</Text>
                    <Text style={styles.energy}>3 hours</Text>
                </View>
                <BarChart style={{ height: 120 }} data={usageData} svg={{ fill: usage }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.99}></BarChart>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text style={styles.weekly}>Weekly Usage</Text>
                    <Text style={styles.energy}> 1420 kWh</Text>
                </View>
                <BarChart style={{ height: 120 }} data={energyData} svg={{ fill: energy }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.99}></BarChart>

                <Text style={[styles.weekly, { marginTop: 20 }]}>Recomendations</Text>
                <ScrollView horizontal={true} contentContainerStyle={{ width: '100%', height: '170%' }}>
                    <View style={styles.recomend}>
                    </View>
                    <View style={styles.recomendContainer}></View>
                </ScrollView>
            </ScrollView>
        </View>
    );
}

