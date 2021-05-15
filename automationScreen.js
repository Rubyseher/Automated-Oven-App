import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import Timeline from './timeline';
const data= require('./timeline.json')

export default function automationScreen() {

    const [items, setitems] = useState(data);

    return (
        <View >
            <Text style={styles.heading}>Automator</Text>

        <Timeline items={items}/>
        </View>
    );
}

