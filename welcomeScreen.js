import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors, styles } from './styles'

export default function welcomeScreen() {
  const[newName,setNewName]=useState("")
  return (
    <View >
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Hi</Text>
        <Text style={styles.welcomeText}>Enter your Name</Text>
        <TextInput
          style={styles.newName}
          onChangeText={setNewName}
          value={newName}
        />
      </View>
    </View>
  );
}

