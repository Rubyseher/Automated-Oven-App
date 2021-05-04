import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function energyScreen() {
    return (
        <View >
            <Text style={styles.heading}>Energy</Text>
            <AnimatedCircularProgress
                size={260} width={5} fill={70} style={{ alignItems: 'center' }} childrenContainerStyle={{ textAlign: 'center', width: '100%' }} arcSweepAngle={240} rotation={-120} tintColor={colors.lightGreen} backgroundColor={colors.grey}>
                {(fill) => (
                    <Fragment>
                        <Text style={{ fontSize: 64, fontWeight: 'bold',color:colors.lightGreen }}> {269} </Text>
                        <Text style={{ fontSize: 22, color:colors.lightGreen }}> kW</Text>
                    </Fragment>
                )}
            </AnimatedCircularProgress>
            <Text style={{ fontSize: 16, color:colors.lightGreen , textAlign: 'center',marginTop:'-10%'}}> Current Consumption</Text>

        </View>
    );
}

