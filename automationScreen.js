import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { styles, colors } from './styles'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import Ficon from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

const FoodName = (props) => {
  const [finalDuration, setFinalDuration] = useState(0);
  const [finalTemp, setFinalTemp] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (!finalTemp) {
      let avgTemp = 0, duration = 0
      {
        props.steps && props.steps.forEach(i => {
          if (i.type == 'Cook') {
            avgTemp = (((i.topTemp + i.bottomTemp) / 2) * i.time) + avgTemp
            duration = i.time + duration
          }
        });
      }
      setFinalTemp(Math.round(avgTemp / duration))
      setFinalDuration(duration)
    }
  }, []);

  return (
    <Fragment >
      <View style={[styles.foodContainer, { flexDirection: 'row' }]}>
        {/* <TouchableWithoutFeedback onPress={() => navigation.navigate('automationEditScreen')}>
          <View style={styles.tagBadge}>
            <Icon name="utensils" size={22} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />
          </View>
          <Text style={[styles.fullName, { marginTop: 26, width: '40%' }]}>{props.name}</Text>
        </TouchableWithoutFeedback> */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('automationEdit')}>
          <View style={{flexDirection:'row'}}>
            <View style={styles.tagBadge}>
              <Icon name="utensils" size={22} color={colors.white} style={{ padding: 13, alignSelf: 'center' }} />
            </View>
            <Text style={styles.autoRecipe}>{props.name}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Button
          buttonStyle={[styles.foodCircleM, { backgroundColor: colors.lightRed }]}
          icon={<Icon name="bookmark" size={12} color={colors.white} solid />}
          containerStyle={{ alignItems: 'flex-end', width: '10%', marginRight: 8 }}
        />
        <Button
          buttonStyle={[styles.foodCircleM, { backgroundColor: colors.blue }]}
          icon={<Icon name="play" size={10} color={colors.white} solid />}
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
    </Fragment>
  )
}
export default function automationScreen({ navigation }, props) {
  const [data, setData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      var ws = new WebSocket('ws://oven.local:8069');
      ws.onopen = () => {
        req = {
          msg: 'direct',
          module: 'automations',
          function: 'get'
        }
        ws.send(JSON.stringify(req));
      };
      ws.onmessage = (e) => {
        d = JSON.parse(e.data)
        if (d.msg == 'result') {
          setData(d.result)
          console.log(d.result);
          ws.close()
        }
      };
    }, [])
  );

  return (
    <ScrollView vertical={true} contentContainerStyle={{ marginTop: 5, marginHorizontal: 32, paddingBottom: 200 }}>
      <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 40 }}>
        <Text style={styles.closeHeading}>Automator</Text>
        <Button
          onPress={() => navigation.goBack()}
          icon={<Ficon name="close-a" size={8} color={colors.white} />}
          buttonStyle={styles.closeButtonM}
          containerStyle={styles.closeButtonPaddingM}
        />
      </View>
      {
        data.length > 0 ? data.map((item, i) => (
          <FoodName key={i} name={item.name} steps={item.steps} />
        )) : null
      }
    </ScrollView>
  );
}