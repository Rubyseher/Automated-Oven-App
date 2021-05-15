import React, { Fragment, useState } from 'react';
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
    const graphData = [{
        item: "usage",
        data: [180, 300, 0, 80, 30, 150]
    },
    {
        item: "energy",
        data: [160, 380, 90, 180, 0, 190]
    }]

    return (
        <ScrollView vertical={true} contentContainerStyle={{ height: '105%', paddingHorizontal: 36 }}>
            <Text style={styles.heading}>Profile</Text>

            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                <View style={styles.profileCircle}>
                    <Icon name="user" color={colors.white} size={32} solid />
                </View>
                <Text style={[styles.fullName, { marginVertical: 20 }]}>Jon Snow</Text>
            </View >

            <View style={{ flexDirection: 'row', width: '100%' }}>
                <Text style={styles.profileTitles}>Weekly Usage</Text><Text style={styles.energy}>3 hours</Text>
            </View>
            <BarChart style={{ height: 130 }} data={usageData} svg={{ fill: usage }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.40}></BarChart>
            <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 2, marginTop: '-3%', marginBottom: '9%', marginHorizontal: '4%' }} />

            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.profileTitles}>Weekly Usage</Text><Text style={styles.energy}> 1420 kWh</Text>
            </View>
            <BarChart style={{ height: 120 }} data={energyData} svg={{ fill: energy }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.40}></BarChart>
            <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 2, marginTop: '-3%', marginBottom: '9%', marginHorizontal: '4%' }} />

            <Text style={[styles.profileTitles]}>Recomendations</Text>
            <ScrollView horizontal={true} contentContainerStyle={{ width: '100%', height: '170%' }}>
                <View style={styles.recomend}></View>
                <View style={styles.recomendContainer}></View>
            </ScrollView>
        </ScrollView>
    );
}

