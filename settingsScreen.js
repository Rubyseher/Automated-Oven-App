import React, { useState,useCallback } from 'react';
import { View, Text,ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { styles, colors } from './styles'

export default function settingsScreen() {
    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactMedium");
        }, [])
    );

    return (
        <ScrollView vertical={true} contentContainerStyle={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 300 }}>
            <Text style={styles.heading}>Settings</Text>
        </ScrollView>
    );
}

