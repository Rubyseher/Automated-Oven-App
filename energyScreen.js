import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BarChart } from 'react-native-svg-charts'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function energyScreen() {
    const energy = colors.lightGreen
    const energyData = [210, 360, 0, 80, 30, 150]
    return (
        <View >
            <Text style={styles.heading}>Energy</Text>

            <AnimatedCircularProgress
                size={260} width={5} fill={70} style={{ alignItems: 'center' }} childrenContainerStyle={{ textAlign: 'center', width: '100%' }} arcSweepAngle={240} rotation={-120} tintColor={colors.lightGreen} backgroundColor={colors.grey}>
                {(fill) => (
                    <Fragment>
                        <Text style={{ fontSize: 64, fontWeight: 'bold', color: colors.lightGreen }}> {269} </Text>
                        <Text style={{ fontSize: 22, color: colors.lightGreen }}> kW</Text>
                    </Fragment>
                )}
            </AnimatedCircularProgress>
            <Text style={{ fontSize: 16, color: colors.lightGreen, textAlign: 'center', marginTop: '-10%' }}> Current Consumption</Text>

            <View style={{ flexDirection: 'row', marginTop: 20, height: 36 }}>
                <Text style={styles.graphLabel}>Weekly Energy</Text>
                <View style={{ width: '100%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>  1420 </Text>
                </View>
            </View>
            <BarChart style={{ height: 120 }} data={energyData} svg={{ fill: energy }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.99}></BarChart>

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen ,marginTop:8}]}>
                    <Icon name="calendar-alt" size={22} color={colors.white} style={{ padding: 12 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Energy</Text>
                <View style={{ width: '100%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>  2069 </Text>
                </View>
            </View>

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen ,marginTop:8}]}>
                    <Icon name="rupee-sign" size={22} color={colors.white} style={{ padding: 14 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Cost</Text>
                <View style={{ width: '100%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>  596 </Text>
                </View>
            </View>
        </View>
    );
}

