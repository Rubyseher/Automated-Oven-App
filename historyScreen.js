import React, { useState, useCallback } from 'react';
import { Text,ScrollView } from 'react-native';
import { styles } from './styles'
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FoodListItem from "./FoodListItem";

export default function historyScreen() {
    const [data, setData] = useState([]);
    const [names, setNames] = useState([]);

    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactMedium");

            var ws = new WebSocket('ws://oven.local:8069');
            ws.onopen = () => {
                req = {
                    module: 'history',
                    function: 'get'
                }
                ws.send(JSON.stringify(req));
            };
            ws.onmessage = (e) => {
                d = JSON.parse(e.data)
                if (d.type == 'result') {
                    setData(Object.values(d.result).reverse())
                    setNames(Object.keys(d.result).reverse())
                    ws.close()
                }
            };
        }, [])
    );

    return (
        <ScrollView vertical={true} contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 4,paddingBottom:50 }}>
            <Text style={styles.heading}>History</Text>
            {
                names.length > 0 ? data.map((item, i) => (
                    <FoodListItem key={i} name={names[i]} steps={item.steps} id={i}/>
                )) : null
            }
        </ScrollView>
    );
}

