import React, {  useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const FoodName = (props) => {
    const [finalDuration, setFinalDuration] = useState(0);
    const [finalTemp, setFinalTemp] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        if (!finalTemp) {
            let avgTemp = 0, duration = 0
            {
                props.steps && props.steps.forEach(i => {
                    if (i.type == 'cook') {
                        avgTemp = (((i.topTemp + i.bottomTemp) / 2) * i.duration) + avgTemp
                        duration = i.duration + duration
                    }
                });
            }
            setFinalTemp(Math.round(avgTemp / duration))
            setFinalDuration(duration)
        }
    }, []);

    return (
        <TouchableOpacity onPress={() => { ReactNativeHapticFeedback.trigger("impactMedium"); navigation.navigate('automationEdit', { name: props.name, steps: props.steps, id: props.id }) }}>
            <View style={[styles.foodContainer, { flexDirection: 'row' }]}>
                <View style={styles.tagBadge}>
                    <Icon name="utensils" size={22} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />
                </View>
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
                <View style={[styles.detailsCircle, { backgroundColor: colors.orange }]}>
                    <Icon name="thermometer-half" size={14} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} />
                </View>
                <Text style={styles.detailText}> {finalTemp}°C</Text>

                <View style={[styles.detailsCircle, { backgroundColor: colors.blue }]}>
                    <Icon name="stopwatch" size={14} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} />
                </View>
                <Text style={styles.detailText}> {finalDuration} min</Text>

                <View style={[styles.detailsCircle, { backgroundColor: colors.teal }]}>
                    <Icon name="step-forward" size={14} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} />
                </View>
                {props.steps && <Text style={styles.detailText}> {props.steps.length} Steps</Text>}
            </View>
        </TouchableOpacity>
    )
}

export default function automationScreen() {
    const [data, setData] = useState([]);
    const [keys, setKeys] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactMedium");
            var ws = new WebSocket('ws://oven.local:8069');
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
                    setData(Object.values(d.result))
                    setKeys(Object.keys(d.result))
                    ws.close()
                }
            };
        }, [])
    );

    const generateNewID = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    const newAutomation = () => {
        id = generateNewID(6)
        ReactNativeHapticFeedback.trigger("impactMedium"); 
        navigation.navigate('automationEdit', { name: "New Automation 1",steps: [], id })
    }

    return (
        <ScrollView vertical={true} contentContainerStyle={{ height: '105%', paddingHorizontal: 32, paddingTop: 4 }}>
            <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 10 }} onPress={() => navigation.goBack()}>
                <Text style={[styles.heading,{flex:0, marginRight:'35%'}]}>Automator</Text>
                <Button
                    icon={<Icon name="plus" size={14} color={colors.white} />}
                    onPress={newAutomation}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue,height:25,width:25 }]}
                    containerStyle={[styles.roundButtonPaddingS, {height:30,width:30, alignSelf:'center', flex:2, marginTop:20}]}
                />
            </View>

            {
                data.length > 0 ? data.map((item, i) => (
                    <FoodName key={i} name={item.name} steps={item.steps} id={keys[i]} />
                )) : null
            }
        </ScrollView>
    );
}