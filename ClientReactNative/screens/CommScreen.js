import React, {useState, useEffect} from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  View,
  Text,
  Button,
  SafeAreaView,
  SectionList,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import {
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';

const CommScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.104:5000/ss/asqm/entrance')
      .then((response) => response.json())
      .then((json) => {
        setData(json.lessons);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          paddingStart: 6,
          paddingEnd: 6,
          backgroundColor: 'rgb(250, 250, 250)',
        }}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              marginTop: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Yükleniyor... bir sn lütfen</Text>

            <Button title="Tıkla"></Button>
          </View>
        ) : (
          <ScrollView></ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommScreen;
