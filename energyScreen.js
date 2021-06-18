import React, { Fragment, useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native';
import { styles, colors } from './styles'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BarChart } from 'react-native-svg-charts'
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from "moment";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { AuthContext } from './AuthContext';
import { Button } from 'react-native-elements';

const sumReducer = (a, v) => a + v;

export default function energyScreen() {
    const [weekData, setWeekData] = useState([0]);
    const [weekDataSelf, setWeekDataSelf] = useState([0]);
    const [monthSum, setMonthSum] = useState(0);
    const [monthSumSelf, setMonthSumSelf] = useState(0);
    const [currentUsage, setCurrentUsage] = useState(0);
    const { config } = useContext(AuthContext)
    const [filter, setFilter] = useState(false);

    const getCost = (sum) => {
        var cost = 0
        if (sum <= 1.00) cost = 70
        else cost = ((70 * Math.floor(sum)) + (((sum - Math.floor(sum)) / 100) * 80))
        return cost.toFixed(1)
    }

    const parseData = (d) => {
        let dates = Object.keys(d)

        var _weekData = [], _weekDataSelf = []
        for (m = moment().subtract(6, 'd'); m.isSameOrBefore(moment()); m.add(1, 'd')) {
            var date = m.format('YYYY-MM-DD')
            if (dates.slice(-7).includes(date)) {
                _weekData.push(Object.values(d[date]).map(e => e.watts).reduce(sumReducer))
                _weekDataSelf.push(Object.values(d[date]).filter(e => e.users.includes(config.name)).map(e => e.watts).reduce(sumReducer))
            } else {
                _weekData.push(0)
                _weekDataSelf.push(0)
            }
        }
        setWeekData(_weekData)
        setWeekDataSelf(_weekDataSelf)

        var monthEnergy = 0, monthEnergySelf = 0
        dates.slice(-31).forEach(i => {
            if (moment(i, 'YYYY-MM-DD').isSame(moment(), 'month')) {
                monthEnergy += Object.values(d[i]).map(e => e.watts).reduce(sumReducer)
                monthEnergySelf += Object.values(d[i]).filter(e => e.users.includes(config.name)).map(e => e.watts).reduce(sumReducer)
            }
        })
        setMonthSum((monthEnergy / 1000).toFixed(2))
        setMonthSumSelf((monthEnergySelf / 1000).toFixed(2))
    }

    useFocusEffect(
        useCallback(() => {
            const getData = () => {
                var ws = new WebSocket(config.url);
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
                    if (d.type === 'result')
                        (d.req === 'getAll') ? parseData(d.result) : setCurrentUsage(parseInt(d.result))
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
        <ScrollView vertical={true} contentContainerStyle={{ height: '105%', paddingHorizontal: 32, paddingTop: 4 }}>
            <View style={{ flexDirection: 'row', width: '100%' }} onPress={() => navigation.goBack()}>
                <Text style={[styles.heading, { flex: 0, marginRight: '55%' }]}>Energy</Text>
                <Button
                    icon={<Icon name="filter" size={12} color={colors.white} />}
                    onPress={() => setFilter(!filter)}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: filter ? colors.lightGreen : colors.grey, height: 25, width: 25 }]}
                    containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'center', flex: 2, marginTop: 20 }]}
                />
            </View>

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
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{filter ? (weekDataSelf.reduce(sumReducer) / 1000).toFixed(2) : (weekData.reduce(sumReducer) / 1000).toFixed(2)}</Text>
                </View>
            </View>

            <BarChart style={{ height: 110 }} data={filter ? weekDataSelf : weekData} svg={{ fill: colors.lightGreen }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.30} spacingOuter={0.6} yAccessor={({ item }) => item / 10} yMax={30} ></BarChart>
            <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 2, marginTop: '-3%', marginBottom: '3%', marginHorizontal: '4%' }} />

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                    <Icon name="calendar-alt" size={22} color={colors.white} style={{ alignSelf: 'center', marginTop: 11 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Energy</Text>
                <View style={{ width: '90%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{filter ? monthSumSelf : monthSum}</Text>
                </View>
            </View>

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                    <Icon name="rupee-sign" size={22} color={colors.white} style={{ alignSelf: 'center', marginTop: 11 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Cost</Text>
                <View style={{ width: '90%' }}>
                    <Text style={styles.energy}> <Icon name="rupee-sign" size={14} color={colors.textGrey} style={{ padding: 14 }} solid /></Text>
                    <Text style={styles.consumption}>{filter ? getCost(monthSumSelf) : getCost(monthSum)}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

