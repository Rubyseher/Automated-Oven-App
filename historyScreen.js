import React, { useState, useCallback, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles, colors } from './styles'
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FoodListItem from "./FoodListItem";
import { AuthContext } from './AuthContext';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default function historyScreen() {
    const [data, setData] = useState([]);
    const [names, setNames] = useState([]);
    const [filter, setFilter] = useState(false);
    const { config, setConfig } = useContext(AuthContext)
    const [configState, setConfigState] = useState(config)

    const addBookmark = (value) => {
        setConfigState((c) => {
            let newCS = { ...c, bookmarkedHistoryItems: [...c.bookmarkedHistoryItems, value] }
            setConfig(newCS);
            return newCS
        })
    }

    const removeBookmark = (value) => {
        setConfigState((c) => {
            let newCS = { ...c, bookmarkedHistoryItems: [...c.bookmarkedHistoryItems.filter(item => item !== value)] }
            setConfig(newCS);
            return newCS
        })
    }

    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactMedium");

            var ws = new WebSocket(config.url);
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
                    let val = Object.values(d.result)
                    let keys = Object.keys(d.result)
                    keys.sort((e1, e2) => {
                        let k1 = d.result[e1].playbackHistory[d.result[e1].playbackHistory.length - 1].timestamp
                        let k2 = d.result[e2].playbackHistory[d.result[e2].playbackHistory.length - 1].timestamp
                        if (k1 > k2) return -1
                        else if (k1 < k2) return 1
                        else return 0
                    })
                    val.sort((e1, e2) => {
                        let v1 = e1.playbackHistory[e1.playbackHistory.length - 1].timestamp
                        let v2 = e2.playbackHistory[e2.playbackHistory.length - 1].timestamp
                        if (v1 > v2) return -1
                        else if (v1 < v2) return 1
                        else return 0
                    })
                    setData(val)
                    setNames(keys)
                    ws.close()
                }
            };
        }, [])
    );

    return (
        <ScrollView vertical={true} contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 4, paddingBottom: 50 }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
                <Text style={[styles.heading, { flex: 0, marginRight: '55%' }]}>History</Text>
                <Button
                    icon={<Icon name="filter" size={12} color={colors.white} />}
                    onPress={() => setFilter(!filter)}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: filter ? colors.orange : colors.grey, height: 25, width: 25 }]}
                    containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'center', flex: 2, marginTop: 20 }]}
                />
            </View>
            {
                names.length > 0 ? data.map((item, i) => (
                    configState.bookmarkedHistoryItems.includes(names[i]) && <FoodListItem key={i} name={names[i]} steps={item.steps} id={i} bookmarked addBookmark={addBookmark} removeBookmark={removeBookmark} />
                )) : null
            }
            {configState.bookmarkedHistoryItems.length>0 && <View style={styles.divider}></View>}
            {
                names.length > 0 ? data.map((item, i) => (
                    ((!filter  && !configState.bookmarkedHistoryItems.includes(names[i])) || (item.playbackHistory.some(p => p.users.includes(config.name)) && !configState.bookmarkedHistoryItems.includes(names[i]))) && <FoodListItem key={i} name={names[i]} steps={item.steps} id={i} addBookmark={addBookmark} removeBookmark={removeBookmark} />
                )) : null
            }
            {filter && <Text style={[styles.listItemName, { textAlign: 'center', width: '100%', marginLeft: 0 }]}>Showing items used by you.</Text>}

        </ScrollView>
    );
}

