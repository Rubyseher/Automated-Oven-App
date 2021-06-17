import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { AuthContext } from './AuthContext';

export default FoodListItem = (props) => {
    const [finalDuration, setFinalDuration] = useState(0);
    const [finalTemp, setFinalTemp] = useState(0);
    const navigation = useNavigation();
    const { config } = useContext(AuthContext)

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

    const runSteps = () => {
        console.log({ item: props.name, steps: props.steps });
        var ws = new WebSocket(config.url);
        ws.onopen = () => {
            ws.send(JSON.stringify({ module: 'cook', function: 'startFromSteps', params: [{ item: props.name, steps: props.steps }] }));
            ws.close()
        };
    }

    return (
        <TouchableOpacity onPress={() => { ReactNativeHapticFeedback.trigger("impactMedium"); navigation.navigate('automationEdit', props) }}>
            <View style={[styles.foodContainer, { flexDirection: 'row' }]}>
                <View style={styles.tagBadge}>
                    <Icon name="utensils" size={22} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />
                </View>
                <Text style={[styles.fullName, { marginTop: 26, width: '40%' }]}>{props.name}</Text>
                <Button
                    buttonStyle={[styles.foodCircleM, { backgroundColor: props.bookmarked ? colors.darkGrey : colors.lightRed }]}
                    icon={<Icon name={props.bookmarked ? "tint-slash" : "bookmark"} size={12} color={colors.white} solid />}
                    containerStyle={{ alignItems: 'flex-end', width: '10%', marginRight: 8 }}
                    onPress={() => props.bookmarked ? props.removeBookmark(props.bookmarkedById ? props.id : props.name) : props.addBookmark(props.bookmarkedById ? props.id : props.name)}
                />
                <Button
                    buttonStyle={[styles.foodCircleM, { backgroundColor: colors.blue }]}
                    icon={<Icon name="play" size={10} color={colors.white} solid />}
                    onPress={runSteps}
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