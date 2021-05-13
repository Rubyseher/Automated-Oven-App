import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles, colors } from './styles'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BarChart } from 'react-native-svg-charts'
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from "moment";
import ws from './Server'

export default function energyScreen() {
    const energy = colors.lightGreen
    const [data, setData] = useState();
    const [energyData, setEnergyData] = useState();
    const [weekSum, setWeekSum] = useState(0);
    const [monthSum, setMonthSum] = useState();
    const [monthCost, setMonthCost] = useState();
    const [currrentUseage, setCurrrentUseage] = useState();

    useEffect(() => {
        const parseData = (d) => {
            const energySum = (accumulator, currentValue) => accumulator + currentValue;
            dates = Object.keys(d)
            // console.log("dates", dates);

            var last7energy = []
            for (m = moment().subtract(6, 'd'); m.isSameOrBefore(moment()); m.add(1, 'd')) {
                var date = m.format('YYYY-MM-DD')
                if (dates.slice(-7).includes(date)) {
                    // console.log(date, "is there");
                    // todayEnergy = Object.values(d[date]);
                    // console.log("todayEnergy values ", todayEnergy);
                    last7energy.push(Object.values(d[date]).reduce(energySum))
                    // console.log("last7energy is ", last7energy);
                }
                else {
                    // console.log(date, "is not there")
                    last7energy.push(0)
                }
            }

            // console.log("last7energy is ", last7energy);
            setEnergyData(last7energy)
            setWeekSum(last7energy.reduce(energySum))
            // console.log(weekSum, "is weekSum")

            // todayDate = moment()
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
            console.log("cost", cost);

        }

            
        ws.onopen = () => {
            req = {
                msg: 'direct',
                module: 'energy',
                function: 'getAll'
            }
            ws.send(JSON.stringify(req));
            setInterval(() => {
                req = {
                    msg: 'direct',
                    module: 'energy',
                    function: 'getNow'
                }
                ws.send(JSON.stringify(req));
            }, 1000)
        };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                if (d.msg == 'result') {
                    if (d.req == 'getAll') {
                        setData(d.result)
                        // console.log(d.result);
                        parseData(d.result)
                    }
                    else {
                        setCurrrentUseage(parseInt(d.result))
                        // console.log(d.result);
                    }

                }
            };
    });
    return (
            data  ? <ScrollView vertical={true} contentContainerStyle={{ height: '105%' }}>
                <Text style={styles.heading}>Energy</Text>

                {currrentUseage && <AnimatedCircularProgress
                    size={260} width={5} fill={Math.floor((currrentUseage/1350)*100)} style={{ alignItems: 'center' }} childrenContainerStyle={{ textAlign: 'center', width: '100%' }} arcSweepAngle={240} rotation={-120} tintColor={colors.lightGreen} backgroundColor={colors.grey}>
                    {(fill) => (
                        <Fragment>
                            <Text style={{ fontSize: 64, fontWeight: 'bold', color: colors.lightGreen }}> {currrentUseage} </Text>
                            <Text style={{ fontSize: 22, color: colors.lightGreen }}> kW</Text>
                        </Fragment>
                    )}
                </AnimatedCircularProgress>}
                <Text style={{ fontSize: 16, color: colors.lightGreen, textAlign: 'center', marginTop: '-10%' }}> Current Consumption</Text>

                <View style={{ flexDirection: 'row', marginTop: 20, height: 36 }}>
                    <Text style={styles.graphLabel}>Weekly Energy</Text>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{(weekSum / 1000).toFixed(2)}</Text>
                    </View>

                </View>

                {energyData && <BarChart style={{ height: 170 }} data={energyData} svg={{ fill: energy }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.99} yAccessor={({ item }) => item / 10} yMax={100} ></BarChart>}
                <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 2, marginTop: '-3%', marginBottom: '3%', marginRight: '11%', marginLeft: '11%' }} />

                <View style={styles.tagContainer}>
                    <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                        <Icon name="calendar-alt" size={22} color={colors.white} style={{ padding: 12 }} solid />
                    </View>
                    <Text style={styles.tagLabel}>Monthly Energy</Text>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{monthSum}</Text>
                    </View>
                </View>

                <View style={styles.tagContainer}>
                    <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                        <Icon name="rupee-sign" size={22} color={colors.white} style={{ padding: 14 }} solid />
                    </View>
                    <Text style={styles.tagLabel}>Monthly Cost</Text>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{monthCost}</Text>
                    </View>
                </View>
            </ScrollView>:<View></View>
    );
}

