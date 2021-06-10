import React, { Fragment, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import { styles, colors } from './styles'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BarChart } from 'react-native-svg-charts'
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from "moment";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export default function energyScreen() {
    const [energyData, setEnergyData] = useState();
    const [weekSum, setWeekSum] = useState(0);
    const [monthSum, setMonthSum] = useState(0);
    const [monthCost, setMonthCost] = useState(0);
    const [currentUsage, setCurrentUsage] = useState(0);

    const parseData = (d) => {
        const energySum = (accumulator, currentValue) => accumulator + currentValue;
        dates = Object.keys(d)

        var last7energy = []
        for (m = moment().subtract(6, 'd'); m.isSameOrBefore(moment()); m.add(1, 'd')) {
            var date = m.format('YYYY-MM-DD')
            if (dates.slice(-7).includes(date)) last7energy.push(Object.values(d[date]).reduce(energySum))
            else last7energy.push(0)
        }
        setEnergyData(last7energy)
        setWeekSum(last7energy.reduce(energySum))

        var monthValues, monthEnergy = 0
        dates.slice(-31).forEach(i => {
            if (moment(i, 'YYYY-MM-DD').isSame(moment(), 'month')) {
                monthValues = Object.values(d[i]);
                monthEnergy = monthValues.reduce(energySum) + monthEnergy
            }
        })
        setMonthSum((monthEnergy / 1000).toFixed(2))

        var _monthSum = (monthEnergy / 1000)
        var cost = 0
        if (_monthSum && _monthSum <= 1.00) cost = 70
        else cost = ((70 * Math.floor(_monthSum)) + (((_monthSum - Math.floor(_monthSum)) / 100) * 80))
        setMonthCost(cost.toFixed(1))
    }

    useFocusEffect(
        useCallback(() => {
            const getData = () => {
                var ws = new WebSocket('ws://oven.local:8069');
                ws.onopen = () => {
                    req = {
                        module: 'energy',
                        function: 'getAll'
                    }
                    ws.send(JSON.stringify(req));
                    req = {
                        module: 'energy',
                        function: 'getNow'
                    }
                    ws.send(JSON.stringify(req));
                };
                ws.onmessage = (e) => {
                    d = JSON.parse(e.data)
                    if (d.type === 'result') {
                        if (d.req === 'getAll') {
                            parseData(d.result)
                        }
                        else {
                            setCurrentUsage(parseInt(d.result))
                        }
                    }
                    ws.close()
                };
            }
            ReactNativeHapticFeedback.trigger("impactMedium");
            getData()
            var intervalId = setInterval(getData, 2000)

            return () => {
                clearInterval(intervalId);
            }
        }, []))

    return (
        <ScrollView vertical={true} contentContainerStyle={{ height: '105%', paddingHorizontal: 32, paddingTop: 10 }}>
            <Text style={styles.heading}>Energy</Text>

            <AnimatedCircularProgress
                size={275} width={5} fill={Math.round((currentUsage / 650) * 100, 0)} style={{ alignItems: 'center' }} childrenContainerStyle={{ textAlign: 'center', width: '100%' }} arcSweepAngle={240} rotation={-120} tintColor={colors.lightGreen} backgroundColor={colors.grey}>
                {(fill) => (
                    <Fragment>
                        <Text style={{ fontSize: 68, fontWeight: 'bold', color: colors.lightGreen }}> {currentUsage} </Text>
                        <Text style={{ fontSize: 22, color: colors.lightGreen, marginTop: -9 }}> W</Text>
                    </Fragment>
                )}
            </AnimatedCircularProgress>
            <Text style={{ fontSize: 16, color: colors.lightGreen, textAlign: 'center', marginTop: '-14%', marginBottom: '10%' }}> Current Consumption</Text>

            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.graphLabel}>Weekly Energy</Text>
                <View style={{ width: '90%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{(weekSum / 1000).toFixed(2)}</Text>
                </View>
            </View>

            {energyData && <BarChart style={{ height: 110 }} data={energyData} svg={{ fill: colors.lightGreen }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.30} spacingOuter={0.6} yAccessor={({ item }) => item / 10} yMax={100} ></BarChart>}
            <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 2, marginTop: '-3%', marginBottom: '3%', marginHorizontal: '4%' }} />

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                    <Icon name="calendar-alt" size={22} color={colors.white} style={{ alignSelf: 'center', marginTop: 11 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Energy</Text>
                <View style={{ width: '90%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{monthSum}</Text>
                </View>
            </View>

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                    <Icon name="rupee-sign" size={22} color={colors.white} style={{ alignSelf: 'center', marginTop: 11 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Cost</Text>
                <View style={{ width: '90%' }}>
                    <Text style={styles.energy}> <Icon name="rupee-sign" size={14} color={colors.textGrey} style={{ padding: 14 }} solid /></Text>
                    <Text style={styles.consumption}>{monthCost}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

