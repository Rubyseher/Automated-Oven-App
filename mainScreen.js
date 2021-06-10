import React, { useState, Fragment, useCallback } from 'react';
import Slider from '@react-native-community/slider'
import { useFocusEffect } from '@react-navigation/native';
import { Image, View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { styles, colors } from './styles'
import Wand from './assets/wand.svg'
import OvenTop from './assets/Oven Direction Top.svg'
import OvenBottom from './assets/Oven Direction Bottom.svg'
import LinearGradient from 'react-native-linear-gradient';
import Ficon from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import jsdom from 'jsdom-jscore-rn';
import { getCookingDetails } from './webScraper';
import Clipboard from '@react-native-clipboard/clipboard';
import Carousel from 'react-native-snap-carousel';

const GradientProgress = (props) => {
    return (
        <View style={[{ width: '100%', height: 12, backgroundColor: props.trackColor ? props.trackColor : '#e1dddd' }, props.trackStyle]}>
            <LinearGradient colors={[colors.yellow, colors.orange]} start={{ x: 0, y: 0 }} locations={[0.5, 1]} style={{ width: `${props.value}%`, height: '100%' }}></LinearGradient>
        </View>
    )
}

const TemperatureSlider = (props) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 7, marginBottom: -12 }}>
                {props.icon}
                <Text style={{ textAlign: 'right', width: '90%', color: 'grey' }}>{props.handler.value == 0 ? "OFF" : Math.round(props.handler.value) + "°C"} </Text>
            </View>
            <Slider
                maximumValue={250}
                minimumValue={0}
                maximumTrackTintColor={colors.grey}
                minimumTrackTintColor={colors.yellow}
                step={5}
                onSlidingComplete={value => { props.handler.setValue(value); ReactNativeHapticFeedback.trigger("impactLight"); props.sendHandler(props.name, value) }}
                value={props.handler.value}
                thumbTintColor="transparent"
            />
        </Fragment>
    )
}

function mainScreen({ navigation }) {
    const [time, setTime] = useState(" ");
    const [topTemp, setTopTemp] = useState(0);
    const [bottomTemp, setBottomTemp] = useState(0);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    const FetchUrl = async () => {
        const url = await Clipboard.getString();
        console.log("url ", url);
        // let url = "https://www.allrecipes.com/recipe/11432/twisty-cookies/"
        fetch(url)
            .then(res => res.text())
            .then(data => {
                jsdom.env(data, (errors, window) => {
                    var instClass

                    if (url.includes("allrecipes"))
                        instClass = ".instructions-section"
                    else if (url.includes("sallysbaking") || url.includes("gimmesomeoven"))
                        instClass = ".tasty-recipes-instructions-body"
                    else if (url.includes("recipetineats"))
                        instClass = ".wprm-recipe-instructions"
                    else if (url.includes("delish"))
                        instClass = ".direction-lists"
                    else if (url.includes("indianhealthyrecipes") || url.includes("vegrecipesofindia"))
                        instClass = ".wprm-recipe-instructions"
                    else {
                        console.log("Unsupported Website");
                        return
                    }
                    const inst = window.document.querySelectorAll(instClass)
                    console.log("url is", url);
                    console.log("getcooking details called", getCookingDetails(inst, url)[temp]);
                    // var ws = new WebSocket('ws://oven.local:8069');
                    // bothTemp = getCookingDetails(inst, url)[temp]
                    // ws.onopen = () => {
                    //     req = {
                    //         module: 'cook',
                    // function: `set${name}Temp`,
                    //     params: {
                    //         "bottom": bothTemp,
                    //         "cooktype":getCookingDetails(inst, url)[bake]?"Bake":"Cook",
                    //         "endTime": getCookingDetails(inst, url)[time],
                    //         "isCooking": false,
                    //         "isPaused": false,
                    //         "startTime": 0,
                    //         "top": bothTemp
                    //     }
                    // }
                    // ws.send(JSON.stringify(req));
                    // ws.close()
                    // };
                })
            })
    }

    const progressPercent = (e) => {
        if (!data.isPaused) {
            startTime = moment.unix(data.startTime);
            endTime = moment.unix(data.endTime);
            totalTime = endTime.diff(startTime, 'seconds')

            calculation = ((moment().diff(startTime, 'seconds') / totalTime) * 100)
            return calculation
        }
        return 0;
    }

    const setTemp = (name, value) => {
        var ws = new WebSocket('ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: `set${name}Temp`,
                params: [value]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }

    const sendRequest = (task) => {
        var ws = new WebSocket('ws://oven.local:8069');
        ReactNativeHapticFeedback.trigger("impactHeavy");
        ws.onopen = () => {
            if (task == 'stop')
                req = {
                    module: 'cook',
                    function: 'stop'
                }
            else
                req = {
                    module: 'cook',
                    function: data.isPaused ? 'resume' : 'pause'
                }
            ws.send(JSON.stringify(req));
            ws.close()
        };

    }

    useFocusEffect(
        useCallback(() => {
            FetchUrl()
            ReactNativeHapticFeedback.trigger("impactHeavy");
            const parseData = (d) => {
                setTopTemp(d.top)
                setBottomTemp(d.bottom)
                d.isPaused ? setTime('Paused') : setTime(`${moment.unix(d.endTime).diff(moment(), 'minutes')} min ${moment.unix(d.endTime).diff(moment(), 'seconds') % 60} sec left`)
            }
            var intervalId = setInterval(() => {
                var ws = new WebSocket('ws://oven.local:8069');
                ws.onopen = () => {
                    req = {
                        module: 'cook',
                        function: 'get'
                    }
                    ws.send(JSON.stringify(req));
                };
                ws.onmessage = (e) => {
                    d = JSON.parse(e.data)
                    if (d.type == 'result' && d.req == 'get') {
                        setData(d.result)
                        console.log(d.result);
                        parseData(d.result)
                    }
                    ws.close()
                };
            }, 1000)

            setTimeout(() => setLoading(false), 5000)

            return () => {
                clearInterval(intervalId);
            }
        }, [])
    );





    const Entries = [
        {
            title: "Item 1",
            text: "Text 1",
        },
        {
            title: "Item 2",
            text: "Text 2",
        },
        {
            title: "Item 3",
            text: "Text 3",
        },
        {
            title: "Item 4",
            text: "Text 4",
        },
        {
            title: "Item 5",
            text: "Text 5",
        },
    ]
    console.log("item.title", Entries[0].title);

    const rItem = ({item}) => {
        // console.log("item.title", item[i].title);
        return (
            <View style={{
                backgroundColor: colors.lightBlue,
                borderRadius: 12,
                height: 350,
                padding: 50,
                // marginLeft: 25,
                // marginRight: 25,
            }}>
                <Text style={{ fontSize: 30 }}>{item.type}</Text>
                <Text>{item.type}</Text>
            </View>

        )
    }

    return (
        data ? <View>

            <Text style={styles.title}>{data.isCooking ? data.item : (data.cooktype == 'Done' ? 'Done' : 'Empty')}</Text>

            <Carousel
                layout={"default"}
                ref={ref => this.carousel = ref}
                data={data.steps}
                sliderWidth={300}
                itemWidth={300}
                renderItem={rItem}
            // onSnapToItem={index => this.setState({ activeIndex: index })} 
            />

            {/* <GradientProgress value={data.isCooking ? progressPercent() : 0} trackColor={colors.white} /> */}

            <Text style={styles.subtitle}>{data.isCooking ? time : ' '}</Text>
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <TemperatureSlider icon={<OvenTop height={29} width={29} fill={colors.black} />} handler={{ value: topTemp, setValue: setTopTemp }} sendHandler={setTemp} name='Top' />
                <TemperatureSlider icon={<OvenBottom height={29} width={29} fill={colors.black} />} handler={{ value: bottomTemp, setValue: setBottomTemp }} sendHandler={setTemp} name='Bottom' />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 18 }}>
                {data.isCooking && <Button
                    onPress={() => navigation.navigate('automationScreen')}
                    icon={<Wand height={25} width={25} fill={colors.black} />}
                    buttonStyle={styles.roundButtonS}
                    containerStyle={styles.roundButtonPaddingS}
                />}
                <Button
                    onPress={() => sendRequest('pause')}
                    icon={<Ficon name={data.isCooking && !data.isPaused ? 'pause' : 'play'} size={28} color={colors.darkGrey} style={{ alignSelf: 'center' }} />}
                    buttonStyle={styles.roundButtonM}
                    containerStyle={[styles.roundButtonPaddingM]}
                />
                {data.isCooking && <Button
                    onPress={() => sendRequest('stop')}
                    icon={<Ficon name="close-a" size={16} color={colors.red} />}
                    buttonStyle={styles.roundButtonS}
                    containerStyle={styles.roundButtonPaddingS}
                />}
            </View>
        </View> :
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', padding: '15%' }}>
                <ActivityIndicator size="large" />
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, color: colors.textGrey, marginTop: 20 }}>{loading ? "Connecting to the device" : "Couldn't connect to the device. Make sure it's powered on."}</Text>
            </View>

    );
}

export default mainScreen