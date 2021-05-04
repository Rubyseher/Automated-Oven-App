import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

const FoodName = (props) => {
    const [finalDuration, setFinalDuration] = useState(0);
    const [finalTemp, setFinalTemp] = useState(0);

    useEffect(() => {
        if (!finalTemp) {
            let avgTemp =0, duration =0
            props.steps.forEach(i => {
                if (i.type == 'cook') {
                    avgTemp= (((i.topTemp + i.bottomTemp) / 2) * i.duration) + avgTemp
                    duration=i.duration + duration
                }
            });
            setFinalTemp(avgTemp / duration)
            setFinalDuration(duration)
        }
    });

    return (
        <Fragment>
            <View style={[styles.foodContainer, { flexDirection: 'row' }]}>
                <Button
                    buttonStyle={styles.foodCircle}
                    icon={<Icon name="utensils" size={22} color={colors.white} />}
                />
                <Text style={[styles.fullName, { marginTop: 26, width: '40%' }]}>{props.name}</Text>
                <Button
                    buttonStyle={[styles.foodCircleM, { backgroundColor: colors.lightRed }]}
                    icon={<Icon name="bookmark" size={12} color={colors.white} solid />}
                    containerStyle={{ alignItems: 'flex-end', width: '10%', marginRight: 8 }}
                />
                <Button
                    buttonStyle={[styles.foodCircleM, { backgroundColor: colors.blue }]}
                    icon={<Icon name="play" size={10} color={colors.white} solid />}
                />
            </View>
            <View style={[styles.detailsContainer, { justifyContent: 'center' }]}>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle, { backgroundColor: colors.orange }]}
                    icon={<Icon name="thermometer-half" size={14} color={colors.white} solid />}
                />
                <Text style={styles.detailText}> {finalTemp}°C</Text>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle, { backgroundColor: colors.blue }]}
                    icon={<Icon name="stopwatch" size={14} color={colors.white} solid />}
                />
                <Text style={styles.detailText}> {finalDuration} min</Text>
                <Button
                    buttonStyle={[styles.foodCircle, styles.detailsCircle, { backgroundColor: colors.green }]}
                    icon={<Icon name="step-forward" size={14} color={colors.white} solid />}
                />
                <Text style={styles.detailText}> {props.steps.length} Steps</Text>
            </View>
        </Fragment>
    )
}

export default function historyScreen() {
    const [data, setData] = useState();

    useEffect(() => {
        if (!data) {
            var ws = new WebSocket('ws://oven.local:8069');
            ws.onopen = () => {
                // connection opened
                req = {
                    user: 'John',
                    msg: 'method',
                    method: 'getHistory'
                }
                ws.send(JSON.stringify(req));
            };
            ws.onmessage = (e) => {
                // a message was received
                d = JSON.parse(e.data)
                if (d.msg == 'result') {
                    setData(d.result)
                }
                console.log(e.data);
            };
            return () => ws.close();
        }
    });

    // ws.onerror = (e) => {
    //     // an error occurred
    //     console.log(e.message);
    // };

    // ws.onclose = (e) => {
    //     // connection closed
    //     console.log(e.code, e.reason);
    // };

    return (
        <View >
            <Text style={styles.heading}>History</Text>
            {
                data && data.map((item, i) => (
                    // <Text>{item.playbackHistory[1].timestamp}</Text>
                    <FoodName name={item.item} steps={item.steps} />
                ))
            }
        </View>
    );
}

