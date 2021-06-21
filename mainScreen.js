import React, { useState, Fragment, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { styles, colors, itemColors } from './styles'
import Ficon from 'react-native-vector-icons/Fontisto';
import { Preheat, Cook, Checkpoint, Notify, PowerOff, Cooling } from './carouselItems';
import moment from 'moment';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import jsdom from 'jsdom-jscore-rn';
import { getCookingDetails, getInstructionClass, isAcceptedURL, getTitleClass, cleanTitle } from './webScraper';
import Clipboard from '@react-native-clipboard/clipboard';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import { Notifications } from 'react-native-notifications';
import { AuthContext } from './AuthContext';
import IonIcon from 'react-native-vector-icons/Ionicons';

// https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/
// https://www.delish.com/cooking/recipe-ideas/recipes/a51451/easy-chicken-parmesan-recipe/

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const generateNewID = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const progressPercent = (start, end, pause) => {
    if (start && end) {
        startTime = moment.unix(start);
        endTime = moment.unix(end);
        totalTime = endTime.diff(startTime, 'seconds')

        if (pause) {
            pauseTime = moment.unix(pause);
            return Math.round((pauseTime.diff(startTime, 'seconds') / totalTime) * 100)
        }

        return Math.round((moment().diff(startTime, 'seconds') / totalTime) * 100)
    }
    return 0;
}

const TimelineComponent = (props) => {
    switch (props.type) {
        case "preheat": return <Preheat {...props} />
        case "cook": return <Cook {...props} />
        case "checkpoint": return <Checkpoint {...props} />
        case "notify": return <Notify {...props} />
        case "poweroff": return <PowerOff {...props} />
        case "cool": return <Cooling {...props} />
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
    const [delayFetch, setDelayFetch] = useState(false);
    const { config, getConfig } = useContext(AuthContext)

    const [quickTypeVisible, setQuickTypeVisible] = useState(false);
    const [quickTypeInput, setQuickTypeInput] = useState({});

    const sendCookingFromURL = (values) => {
        console.log("sendCookingFromURL values", values);
        var ws = new WebSocket(config ? config.url : 'ws://oven.local:8069');
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
        var ws = new WebSocket(config ? config.url : 'ws://oven.local:8069');
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

    const editAsAutomation = () => {
        let filteredSteps = []

        data.steps.forEach(s => {
            let { startTime, endTime, pauseTime, isDone, ...filteredS } = s
            filteredSteps.push(filteredS)
        })
        navigation.navigate('automations', { screen: 'automationEdit', params: { name: data.item, steps: filteredSteps, id: generateNewID(6), editable: true } })
    }

    useFocusEffect(
        useCallback(() => {
            ReactNativeHapticFeedback.trigger("impactHeavy");
            const parseData = (d) => {
                if (!d.isPaused) {
                    _time = 0
                    nextEndTime = moment.unix(Math.round(d.steps[d.currentStep].endTime))
                    d.steps.filter((s, i) => i > d.currentStep).forEach(s => {
                        switch (s.type) {
                            case 'preheat': _time += s.endTime - s.startTime; break;
                            case 'cook': _time += s.duration * 2; break;
                            case 'cool': _time += s.duration; break;
                            case 'checkpoint': _time += s.timeout; break;
                            default: _time += 5;
                        }
                    })
                    nextEndTime.add(_time, 's')
                    setTime(nextEndTime.diff(moment(), 'seconds'))
                }
            }

            let sentDoneNotification, sentHighEnergyNotification, lastCookedItem = ""

            var intervalId = setInterval(() => {
                var ws = new WebSocket(config ? config.url : 'ws://oven.local:8069');
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
                        // console.log("data", d.result)
                        if (!d.result.isCooking)
                            setGetUrl(true)
                        else { setGetUrl(false); sentDoneNotification = sentHighEnergyNotification = undefined; }
                        if (d.result.item !== "Empty")
                            lastCookedItem = d.result.item
                        if (d.result.isDone && !sentDoneNotification && lastCookedItem.length > 1 && config.notifications.DONE)
                            sentDoneNotification = Notifications.postLocalNotification({ title: "Done", body: `${lastCookedItem} is done cooking`, sound: "chime.aiff", silent: false, category: "DONE" });
                        if (d.result.currentTempTop > 200 && !sentHighEnergyNotification && config.notifications.HIGH_ENERGY)
                            sentHighEnergyNotification = Notifications.postLocalNotification({ title: "Warning: High Energy Consumption", body: 'Your energy consumption is relatively high. Consider lowering cooking temperatures to cut down on costs.', sound: "chime.aiff", silent: false, category: "HIGH_ENERGY" });
                        if (data) if (data.currentStep == d.result.currentStep - 1 && !d.isPaused) if (this._carousel)
                            this._carousel.snapToItem(d.result.currentStep);
                        if (delayFetch) {
                            setTimeout(() => {
                                setData(d.result)
                                if (d.result.isCooking) parseData(d.result)
                                setDelayFetch(false)
                            }, 1200)
                        } else {
                            setData(d.result)
                            if (d.result.isCooking) parseData(d.result)
                        }
                    }

                    ws.close()
                };
            }, 800)

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
            <Image source={{ uri: 'WhitePlateScreen' }} style={{ width: '100%', height: '100%', position: data.item == 'Empty' ? 'relative' : 'absolute', top: 0, left: 0 }} resizeMode="cover" />
            {
                data.steps && <Fragment>

                    <Text style={[styles.title]}>{data.isCooking ? data.item : (data.cooktype == 'Done' ? 'Done' : 'Empty')}</Text>
                    <Text style={styles.subtitle}>{data.isCooking ? `${Math.floor(time / 60)} min and ${time % 60} sec` : ' '}</Text>

                    <Carousel
                        ref={(c) => this._carousel = c}
                        data={data.steps}
                        sliderWidth={400}
                        itemWidth={400}
                        renderItem={({ item }) =>
                            <TimelineComponent {...item}
                                percent={item.isDone ? 100 : progressPercent(item.startTime, item.endTime, item.pauseTime)}
                                isPaused={data.isPaused}
                                currentTemp={data.currentTempTop}
                                currentStep={data.currentStep}
                            />
                        }
                        containerCustomStyle={{ flexGrow: 0 }}
                    />
                    {/* Pagination */}
                    <View style={styles.paginationContainer}>
                        {
                            data.steps.map((s, i) => (
                                <TouchableOpacity key={i}
                                    onPress={() => this._carousel.snapToItem(i)}
                                    style={[styles.paginationItem, { backgroundColor: s.startTime ? itemColors[s.type] : colors.white, borderColor: itemColors[s.type] }]}>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    {/* Controls */}
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 12 }}>
                        {data.isCooking && <Button
                            onPress={editAsAutomation}
                            icon={<IonIcon name="color-wand" size={18} color={colors.darkGrey} />}
                            buttonStyle={styles.roundButtonS}
                            containerStyle={styles.roundButtonPaddingS}
                        />}
                        <Button
                            onPress={() => { sendRequest('pause'); setData(d => { return { ...d, isPaused: true } }); setDelayFetch(true) }}
                            icon={<Ficon name={data.isCooking && !data.isPaused ? 'pause' : 'play'} size={28} color={colors.darkGrey} style={{ alignSelf: 'center' }} />}
                            buttonStyle={styles.roundButtonM}
                            containerStyle={[styles.roundButtonPaddingM]}
                        />
                        {data.isCooking && <Button
                            onPress={() => { sendRequest('stop'); setData(d => { return { ...d, item: 'Empty' } }); setDelayFetch(true) }}
                            icon={<Ficon name="close-a" size={16} color={colors.red} />}
                            buttonStyle={styles.roundButtonS}
                            containerStyle={styles.roundButtonPaddingS}
                        />}
                    </View>
                </Fragment>
            }
            {
                data.item == 'Empty' && <TouchableOpacity onPress={() => setQuickTypeVisible(true)} style={{ position: 'absolute', bottom: '15%', width: '100%' }}>
                    <Text style={[styles.title, { alignSelf: 'center', color: colors.darkGrey }]}>Empty</Text>
                    <Text style={{ marginTop: '3%', marginHorizontal: '20%', alignSelf: 'center', color: colors.darkGrey, textAlign: 'center', fontStyle: 'italic' }}>The crumbs are lonely. Maybe its time to bake something?</Text>
                </TouchableOpacity>
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
            <Modal isVisible={quickTypeVisible} onModalWillShow={() => this._quickTempInput.focus()} swipeDirection="down" panResponderThreshold={10} onSwipeComplete={() => setQuickTypeVisible(false)} animationIn='fadeInUp' animationOut='fadeOut' useNativeDriver={true} onBackdropPress={() => setQuickTypeVisible(false)} style={{ margin: 0 }} backdropOpacity={0.5} >
                <View style={[styles.urlOverlay, { top: '40%', width: '75%' }]} >
                    <View style={[styles.tagBadge, { backgroundColor: colors.blue }]}>
                        <Icon name="pen" solid size={18} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />
                    </View>

                    <View style={{ width: '59%', marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.quickTypeTextInput]}
                            value={quickTypeInput.temp && quickTypeInput.temp.toString()}
                            placeholderTextColor={colors.grey}
                            placeholder="120"
                            onChangeText={v => { setQuickTypeInput(q => { return { ...q, temp: parseInt(v) } }); if (v.length === 3) this._quickTimeInput.focus() }}
                            keyboardType="number-pad"
                            maxLength={3}
                            ref={(r) => this._quickTempInput = r}
                        />
                        <Text style={[styles.quickTypeTextInput]}>&deg;C&nbsp;&nbsp;for&nbsp;&nbsp;</Text>
                        <TextInput
                            style={[styles.quickTypeTextInput]}
                            value={quickTypeInput.time && quickTypeInput.time.toString()}
                            placeholder="20"
                            placeholderTextColor={colors.grey}
                            onChangeText={v => { setQuickTypeInput(q => { return { ...q, time: parseInt(v) } }); if (v.length === 2) this._quickTimeInput.blur() }}
                            maxLength={2}
                            onEndEditing={() => { sendCookingFromURL({ item: `${quickTypeInput.temp} for ${quickTypeInput.time} min`, preheat: true, bake: true, ...quickTypeInput }); setQuickTypeVisible(false) }}
                            keyboardType="number-pad"
                            ref={(r) => this._quickTimeInput = r}
                        />
                        <Text style={[styles.quickTypeTextInput]}>&nbsp;min</Text>
                    </View>
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