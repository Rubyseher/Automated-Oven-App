import React, { useState, Fragment, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import { styles, colors } from './styles'
import Wand from './assets/wand.svg'
import Ficon from 'react-native-vector-icons/Fontisto';
import { Preheat, Cook, Checkpoint, Notify, PowerOff, Cooling } from './carouselItems';
import moment from 'moment';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import jsdom from 'jsdom-jscore-rn';
import { getCookingDetails, getInstructionClass, isAcceptedURL, getTitleClass, cleanTitle } from './webScraper';
import Clipboard from '@react-native-clipboard/clipboard';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import { Notifications } from 'react-native-notifications';
import { AuthContext } from './AuthContext';

// https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/
// https://www.delish.com/cooking/recipe-ideas/recipes/a51451/easy-chicken-parmesan-recipe/

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const progressPercent = (start, end, useTemp = false) => {
    if (useTemp) {
        return Math.round(start / end)
    }
    if (start && end) {
        startTime = moment.unix(start);
        endTime = moment.unix(end);
        totalTime = endTime.diff(startTime, 'seconds')

        return Math.round((moment().diff(startTime, 'seconds') / totalTime) * 100)
    }
    return 0;
}

const TimelineComponent = (props) => {
    var item = props.item
    // console.log("item", item);
    switch (item.type) {
        case "preheat": return <Preheat {...item} percent={props.percent} />
        case "cook": return <Cook {...item} percent={props.percent} />
        case "checkpoint": return <Checkpoint {...item} percent={props.percent} />
        case "notify": return <Notify {...item} percent={props.percent} />
        case "powerOff": return <PowerOff {...item} percent={props.percent} />
        case "cool": return <Cooling {...item} percent={props.percent} />
        default: null
    }
    return null;
}
function mainScreen({ navigation }) {
    const [time, setTime] = useState(0);
    const [data, setData] = useState();
    const [urlData, setUrlData] = useState();
    const [getUrl, setGetUrl] = useState(false);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const { config, getConfig } = useContext(AuthContext)

    const sendCookingFromURL = (values) => {
        console.log("sendCookingFromURL values", values);
        var ws = new WebSocket(config.url || 'ws://oven.local:8069');
        ws.onopen = () => {
            req = {
                module: 'cook',
                function: 'startFromSimple',
                params: [values]
            }
            ws.send(JSON.stringify(req));
            ws.close()
        };
    }

    const fetchFromUrl = async () => {
        let freshConfig = await getConfig()
        if (freshConfig.detection.fromURL) {
            const url = await Clipboard.getString();

            var regexURL = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);

            if (isAcceptedURL(url) && url.match(regexURL)) {
                fetch(url).then(res => res.text()).then(data => {
                    jsdom.env(data, (err, window) => {
                        var cookingValues = getCookingDetails(window.document.querySelectorAll(getInstructionClass(url)), url)
                        cookingValues.item = cleanTitle(window.document.querySelector(getTitleClass(url)).textContent)

                        if (cookingValues['temp'] > 0 && cookingValues['time'] > 0) setUrlData(cookingValues)
                        console.log("cookingValues", cookingValues);
                        setVisible(true)

                    })
                })
            }
        }
    }

    const sendRequest = (task) => {
        var ws = new WebSocket(config.url || 'ws://oven.local:8069');
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
            ReactNativeHapticFeedback.trigger("impactHeavy");
            const parseData = (d) => {
                _time = 0
                firstStepStart = moment.unix(Math.round(d.steps[0].startTime))
                d.steps.filter(s => s.type == 'cook').forEach(step => _time += step.duration * 60)
                firstStepStart.add(_time, 'm')
                setTime(firstStepStart.diff(moment(), 'seconds'))
            }

            let sentDoneNotification, lastCookedItem = ""

            var intervalId = setInterval(() => {
                var ws = new WebSocket(config.url || 'ws://oven.local:8069');
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
                        if (!d.result.isCooking)
                            setGetUrl(true)
                        else {
                            setGetUrl(false)
                            sentDoneNotification = undefined
                        }
                        if (d.result.item !== "Empty")
                            lastCookedItem = d.result.item
                        if (d.result.isDone && !sentDoneNotification && lastCookedItem.length > 1 && config.notifications.DONE)
                            sentDoneNotification = Notifications.postLocalNotification({
                                title: "Done",
                                body: `${lastCookedItem} is done cooking`,
                                sound: "chime.aiff",
                                silent: false,
                                category: "DONE"
                            });
                        // console.log("data", d.result)
                        //     if (data.currentStep == d.result.currentStep - 1)
                        //         this._carousel.snapToItem(d.result.currentStep);
                        setData(d.result)
                        if (d.isCooking) parseData(d.result)
                    }

                    ws.close()
                };
            }, 700)

            setTimeout(() => setLoading(false), 5000)

            return () => {
                clearInterval(intervalId);
            }
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            fetchFromUrl()
        }, [getUrl])
    );

    return (
        data ? <View style={{ height: '100%' }}>
            <Image source={require('./assets/WhitePlateScreen.jpg')} style={{ width: '100%', height: '100%', position: data.item == 'Empty' ? 'relative' : 'absolute', top: 0, left: 0 }} resizeMode="cover" />
            {
                data.steps && <Fragment>

                    <Text style={[styles.title]}>{data.isCooking ? data.item : (data.cooktype == 'Done' ? 'Done' : 'Empty')}</Text>
                    <Text style={styles.subtitle}>{data.isCooking ? `${Math.floor(time / 60)} min and ${time % 60} sec` : ' '}</Text>

                    <Carousel
                        ref={(c) => this._carousel = c}
                        data={data.steps}
                        sliderWidth={400}
                        itemWidth={400}
                        renderItem={({ item }) => <TimelineComponent item={item} percent={item.isDone ? 100 : (item.type == 'preheat' ? progressPercent(data.currentTempTop, item.temp, true) : progressPercent(item.startTime, item.endTime))} />}
                        containerCustomStyle={{ flexGrow: 0 }}
                    />
                    <Pagination
                        dotsLength={data.steps.length}
                        activeDotIndex={data.currentStep}
                        dotStyle={{
                            width: 15,
                            height: 15,
                            borderRadius: 8,
                            marginHorizontal: 6,
                            backgroundColor: colors.blue
                        }}
                        tappableDots={true}
                        carouselRef={this._carousel}
                        inactiveDotStyle={{ backgroundColor: colors.darkGrey }}
                        inactiveDotScale={1}
                        containerStyle={{ paddingVertical: 0 }}
                    />

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 12 }}>
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
                </Fragment>
            }
            {
                data.item == 'Empty' && <Fragment>
                    <Text style={[styles.title, { position: 'absolute', bottom: '20%', alignSelf: 'center', color: colors.darkGrey }]}>Empty</Text>
                    <Text style={{ position: 'absolute', bottom: '15%', marginHorizontal: '20%', alignSelf: 'center', color: colors.darkGrey, textAlign: 'center', fontStyle: 'italic' }}>The crumbs are lonely. Maybe its time to bake something?</Text>
                </Fragment>
            }
            <Modal isVisible={urlData && visible} swipeDirection="up" panResponderThreshold={10} onSwipeComplete={() => setVisible(false)} animationIn='fadeInDown' animationOut='fadeOutUp' useNativeDriver={true} onBackdropPress={() => setVisible(false)} style={{ margin: 0 }} backdropOpacity={0} >

                <View style={styles.urlOverlay} >
                    <View style={[styles.tagBadge, { backgroundColor: colors.blue }]}>
                        <Ficon name="link2" size={20} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />
                    </View>

                    <View style={{ width: '59%', marginLeft: 10 }}>
                        <Text style={styles.urlName}>{urlData && urlData.item}</Text>
                        <Text style={styles.urlTemp}>{urlData && urlData.temp}°C for {urlData && urlData.time} min</Text>

                    </View>

                    <Button
                        onPress={() => sendCookingFromURL(urlData)}
                        icon={<Icon name="play" size={18} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />}
                        buttonStyle={styles.urlPlay}
                    />
                </View>
            </Modal>
        </View> :
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', padding: '15%' }}>
                <ActivityIndicator size="large" />
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, color: colors.textGrey, marginTop: 20 }}>{loading ? "Connecting to the device" : "Couldn't connect to the device. Make sure it's powered on."}</Text>
            </View>

    );
}

export default mainScreen