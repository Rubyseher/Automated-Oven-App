import React, { useState,useCallback } from 'react';
import { FlatList,View, Text,ScrollView } from 'react-native';
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
        <View style={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 300}}>
            <Text style={styles.heading}>Settings</Text>
            <FlatList style={{height:'140%'}}
        data={[
          {key: 'Display'},
          {key: 'Brightness'},
          {key: 'Profile'},
          {key: 'Sleep'},
          {key: 'History'},
          {key: 'Detection'},
          {key: 'Preferences'},
          {key: 'Sounds'},
          {key: 'Safety Alerts'},
          {key: 'Empty Alerts'},
          {key: 'Energy Alerts'},
          {key: 'Notifications'},
          {key: 'Automations'},
        ]}
        renderItem={({item}) => <Text style={styles.listItem}>{item.key}</Text>}
      />
        </View>
    );
}

