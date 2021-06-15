import React, {  useState, useCallback } from 'react';
import { View, Text, ScrollView} from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FoodListItem from "./FoodListItem";

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
            <View style={{ flexDirection: 'row', width: '100%'}} onPress={() => navigation.goBack()}>
                <Text style={[styles.heading,{flex:0, marginRight:'35%'}]}>Automator</Text>
                <Button
                    icon={<Icon name="plus" size={14} color={colors.white} />}
                    onPress={newAutomation}
                    buttonStyle={[styles.roundButtonS, { backgroundColor: colors.blue,height:25,width:25 }]}
                    containerStyle={[styles.roundButtonPaddingS, {height:30,width:30, alignSelf:'center', flex:2, marginTop:20}]}
                />
            </View>
            {
                data.length > 0 && data.map((item, i) => (
                    <FoodListItem key={i} name={item.name} steps={item.steps} id={keys[i]} editable/>
                ))
            }
        </ScrollView>
    );
}