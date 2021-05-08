import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function automationScreen() {
    return (
        <View >
            <Text style={styles.heading}>Automator</Text>

            <View style={[styles.autoContainer,{flexDirection: 'row'}]}>
                    <View style={[styles.detailsCircle, { backgroundColor: colors.yellow }]}>
                        <Icon name="utensils" size={14} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} />
                    </View>
                    <Text style={{width:'30%'}}>Automator</Text>
            </View>
        </View>
    );
}

