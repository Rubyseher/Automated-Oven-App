import React, { Fragment, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles, colors } from './styles'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Slider } from 'react-native-elements';
import CircularSlider from 'react-native-circular-slider';
import color from 'color';

const TopTempSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 7 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
            </View>

            <Slider
                value={props.handler.value}
                style={{ width: '100%', marginTop: -8 }}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                maximumValue={200}
                minimumValue={0}
                trackStyle={styles.sliderTrackStyle}
                onValueChange={value => props.handler.setValue(value)}
                thumbStyle={{ backgroundColor: 'transparent' }}
            />
        </Fragment>
    )
}
const BottomTempSlider = (props) => {
    return (
        <Fragment>
            <Slider
                value={props.handler.value}
                style={{ width: '100%', marginTop: -8 }}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                maximumValue={200}
                minimumValue={0}
                trackStyle={styles.sliderTrackStyle}
                onValueChange={value => props.handler.setValue(value)}
                thumbStyle={{ backgroundColor: 'transparent' }}
            />

            <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10, marginTop: -5 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%', color: 'grey' }}> {Math.round(props.handler.value)}°C </Text>
            </View>


        </Fragment>
    )
}

export default function automationScreen() {
    const [topTemp, setTopTemp] = useState(180);
    const [bottomTemp, setBottomTemp] = useState(80);
    return (
        <View >
            <Text style={styles.heading}>Automator</Text>

            <View style={[styles.autoContainer, {}]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.detailsCircle, { backgroundColor: colors.yellow }]}>
                        <Icon name="utensils" size={14} color={colors.white} style={{ padding: 4, alignSelf: 'center' }} />
                    </View>
                    <Text style={styles.detailText}> Cook</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '60%', marginLeft: 20 }}>
                        <TopTempSlider icon={<OvenTop height={28} width={28} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} />
                        <BottomTempSlider icon={<OvenBottom height={28} width={28} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} />
                    </View>
                    {/* <AnimatedCircularProgress
                        size={75} width={4} fill={70} style={{width:'35%',alignItems:'center',marginTop:30}} childrenContainerStyle={{width:'90%',textAlign:'center'}} arcSweepAngle={240} rotation={-120} tintColor={colors.blue} backgroundColor={colors.textGrey}>
                        {(fill) => (
                            <Fragment>
                                <Text style={{ fontSize: 22,fontWeight:'600', color: colors.blue }}> {30} </Text>
                                <Text style={{ fontSize: 12,fontWeight:'600', color: colors.blue,marginTop:-3 }}> min</Text>
                            </Fragment>
                        )}
                    </AnimatedCircularProgress> */}

                    {/* <CircleSlider btnRadius={9} dialRadius={38} dialWidth={4} value={50} strokeColor={colors.grey} meterColor={colors.blue} strokeWidth={4} /> */}
                    <CircularSlider
                        startAngle={Math.PI * 8/6}
                        angleLength={Math.PI * 20/6}
                        onUpdate={({ startAngle, angleLength }) => console.log(startAngle, angleLength)}
                        strokeWidth={6}
                        radius={35}
                        gradientColorFrom={colors.blue}
                        gradientColorTo={colors.blue}
                        bgCircleColor={colors.white}
                    />
                </View>
            </View>

        </View>
    );
}

