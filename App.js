import React from 'react';
import BottomNav from './bottomNav';
import { Button } from 'react-native-elements';
import {Image, StyleSheet,View,Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
  tinyLogo: {
    width: 390,
    height: 290,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 36,
    marginTop: 45,
    textAlign: 'center',
  },
  round: {
    width: 60,
    height: 20,
  }
});

const App = () => {
  return (
    <View>
      <Image
      style={styles.tinyLogo}
      source={require('./images/emptyPlate.png')}
      />
      <Text style={styles.name}>Emptsy</Text>

      <Button
      style={styles.round}
      title="Solid Button"
      />

      <Icon name="circle" size={30} color="#900" />
      <BottomNav/>
    </View>
  );
};

export default App;