import React, { useState, useCallback, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FoodListItem from "./FoodListItem";
import { AuthContext } from './AuthContext';

export default function automationScreen() {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const [filter, setFilter] = useState(false);
    const navigation = useNavigation();
    const { config, setConfig } = useContext(AuthContext)
    const [configState, setConfigState] = useState(config)

    const addBookmark = (value) => {
        setConfigState((c) => {
            let newCS = { ...c, bookmarkedAutomationItems: [...c.bookmarkedAutomationItems, value] }
            setConfig(newCS);
            return newCS
        })
    }

    const removeBookmark = (value) => {
        setConfigState((c) => {
            let newCS = { ...c, bookmarkedAutomationItems: [...c.bookmarkedAutomationItems.filter(item => item !== value)] }
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
                    module: 'automations',
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
                        let k1 = d.result[e1].lastUsed
                        let k2 = d.result[e2].lastUsed
                        if (k1 > k2) return -1
                        else if (k1 < k2) return 1
                        else return 0
                    })
                    val.sort((e1, e2) => {
                        let v1 = e1.lastUsed
                        let v2 = e2.lastUsed
                        if (v1 > v2) return -1
                        else if (v1 < v2) return 1
                        else return 0
                    })
                    setData(val)
                    setKeys(keys)
                    ws.close()
                }
            };
        }, [])
    );

    const generateNewID = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    const newAutomation = () => {
        id = generateNewID(6)
        ReactNativeHapticFeedback.trigger("impactMedium");
        navigation.navigate('automationEdit', { name: "New Automation 1", steps: [], id, editable: true })
    }

    return (
        <ScrollView vertical={true} contentContainerStyle={{ height: '105%', paddingHorizontal: 32, paddingTop: 4 }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
                <Text style={[styles.heading, { flex: 0, marginRight: '20%' }]}>Automator</Text>
                <Button
                    icon={<Icon name="filter" size={12} color={colors.white} />}
                    onPress={() => setFilter(!filter)}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: filter ? colors.red : colors.grey, height: 25, width: 25 }]}
                    containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'center', flex: 2, marginTop: 20 }]}
                />
                <Button
                    icon={<Icon name="plus" size={14} color={colors.white} />}
                    onPress={newAutomation}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue, height: 25, width: 25 }]}
                    containerStyle={[styles.roundButtonPaddingS, { height: 35, width: 35, alignSelf: 'center', flex: 2, marginTop: 20 }]}
                />
            </View>
            {
                data.length > 0 && data.map((item, i) => (
                    configState.bookmarkedAutomationItems.includes(keys[i]) && <FoodListItem key={i} name={item.name} steps={item.steps} id={keys[i]} editable bookmarked addBookmark={addBookmark} removeBookmark={removeBookmark} bookmarkedById />
                ))
            }
            {configState.bookmarkedAutomationItems.length>0 && <View style={styles.divider}></View>}
            {
                data.length > 0 && data.map((item, i) => (
                    ((!filter  && !configState.bookmarkedAutomationItems.includes(keys[i])) || (item.createdBy == config.name && !configState.bookmarkedAutomationItems.includes(keys[i]))) && <FoodListItem key={i} name={item.name} steps={item.steps} id={keys[i]} editable addBookmark={addBookmark} removeBookmark={removeBookmark} bookmarkedById />
                ))
            }
            {filter && <Text style={[styles.listItemName, { textAlign: 'center', width: '100%', marginLeft: 0 }]}>Showing items created by you.</Text>}
        </ScrollView>
    );
}