import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BarChart } from 'react-native-svg-charts'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from "moment";

export default function energyScreen() {
    const energy = colors.lightGreen
    const [data, setData] = useState();
    const [energyData, setEnergyData] = useState();
    const [weekSum, setWeekSum] = useState(0);

    useEffect(() => {
        const parseData = (d) => {
            const energySum = (accumulator, currentValue) => accumulator + currentValue;
            dates = Object.keys(d)
            console.log("dates", dates);

            // todayDate = moment()
            // console.log(" todayDate", todayDate.format("YYYY/MM/DD"));

            var last7energy = []

            for (m = moment().subtract(6, 'd'); m.isSameOrBefore(moment()); m.add(1, 'd')) {
                var date = m.format('YYYY-MM-DD')
                if (dates.slice(-7).includes(date)) {
                    console.log(date, "is there");
                    todayEnergy = Object.values(d[date]);
                    // console.log("todayEnergy values ", todayEnergy);
                    last7energy.push(todayEnergy.reduce(energySum))
                    // console.log("last7energy of", i, "is ", last7energy);
                }
                else {
                    console.log(date, "is not there")
                    last7energy.push(0)
                }
            }

            console.log("last7energy is ", last7energy);
            setEnergyData(last7energy)
            setWeekSum(last7energy.reduce(energySum))
            console.log(weekSum, "is weekSum")


            // dates.slice(-7).forEach(i => {
            //     // console.log("i", i);

            //     todayEnergy = Object.values(d[i]);
            //     // console.log("todayEnergy evergy ", todayEnergy);
            //     last7energy.push(todayEnergy.reduce(energySum))
            //     // console.log("last7energy of", i, "is ", last7energy);

            //     before7=moment().subtract(7,'d');
            //     ranges = moment(i,'YYYY-MM-DD').range(before7, (todayDate));
            //     console.log('ranges',ranges);
            //     if(ranges) last7.push(i)
            //     // else last7.push([0])

            // });
            // console.log("last7",last7);








            // console.log("energyData",energyData);
            // setWeekSum(energyData.reduce(energySum))
            // console.log("weekSum",weekSum);
            // before7 = energySum.slice(-7)
            // console.log("before7", before7);

            // var energyData = []
            // before7.forEach(i => {
            //     const energySum = (accumulator, currentValue) => accumulator + currentValue;
            // console.log("last7energy is ", dates.reduce(energySum));
            //     energyData = Object.values(d[i])
            // });
            // console.log("energyData", energyData);



            // todays = Object.values(d[dates[dates.length - 1]])
            // console.log("todays energy values",todays);

            // const energySum = (accumulator, currentValue) => accumulator + currentValue;
            // console.log("last7energy is ",todays.reduce(energySum));

        }

        if (!data) {
            var ws = new WebSocket('ws://oven.local:8069');
            ws.onopen = () => {
                // connection opened
                req = {
                    user: 'John',
                    msg: 'method',
                    method: 'getEnergy',
                    params: []
                }
                ws.send(JSON.stringify(req));
            };
            ws.onmessage = (e) => {
                // a message was received
                d = JSON.parse(e.data)
                if (d.msg == 'result') {
                    setData(d.result)
                    parseData(d.result)
                }
                console.log('a message was received');
                // console.log(e.data);
            };
            ws.onerror = (e) => {
                // an error occurred
                console.log("Error Occured");
            };

            return () => ws.close();
        }
    });
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
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>{weekSum}</Text>
                </View>
                
            </View>
            {energyData && <BarChart style={{ height: 120}} data={energyData} svg={{ fill: energy }} contentInset={{ top: 10, bottom: 10 }} spacingInner={0.28} spacingOuter={0.99}></BarChart>}
            <View style={{ borderBottomColor:colors.grey, borderBottomWidth: 2 ,marginTop:'-3%',marginBottom:'3%',marginRight:'11%',marginLeft:'11%'}} />

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
                    <Icon name="calendar-alt" size={22} color={colors.white} style={{ padding: 12 }} solid />
                </View>
                <Text style={styles.tagLabel}>Monthly Energy</Text>
                <View style={{ width: '100%' }}>
                    <Text style={styles.energy}> kWh </Text><Text style={styles.consumption}>  2069 </Text>
                </View>
            </View>

            <View style={styles.tagContainer}>
                <View style={[styles.tagBadge, { backgroundColor: colors.lightGreen, marginTop: 8 }]}>
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

