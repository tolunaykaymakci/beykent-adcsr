import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {authorizedRequest} from '../Service';

const DetailsScreen = ({route, navigation}) => {
  const {planId} = route.params;
  const [plan, setPlan] = useState();

  useEffect(() => {
    authorizedRequest('ss/sdb/plan', {
      plan_id: planId,
    })
      .then((response) => response.json())
      .then((json) => {
        setPlan(json.plan);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {plan == null ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <ScrollView>
          <View style={{flexDirection: 'row'}}></View>

          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{backgroundColor: '#f00', height: 24, flex: 1}}>
              <Text style={{alignSelf: 'center'}}>Text1</Text>
            </View>
            <View style={{backgroundColor: '#0f0', height: 24, flex: 1}}>
              <Text>Text2</Text>
            </View>
            <View style={{backgroundColor: '#00f', height: 24, flex: 1}}>
              <Text>Text3</Text>
            </View>
          </View>

          <Text style={{fontSize: 13, fontWeight: 'bold', padding: 12}}>
            PLAN DETAYLARI
          </Text>

          <View style={styles.osman}>
            <Text style={{color: 'rgb(34,34,34)', fontWeight: 'bold'}}>
              Çalıştığınız Sınav
            </Text>
            <Text style={{color: 'rgb(70,70,70)'}}>{plan.exam_title}</Text>
          </View>

          <View style={styles.osman}>
            <Text style={{color: 'rgb(34,34,34)', fontWeight: 'bold'}}>
              Plan İsmi
            </Text>
            <Text style={{color: 'rgb(70,70,70)'}}>{plan.name}</Text>

            <MaterialCommunityIcons
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 24,
                marginEnd: 12,
              }}
              onPress={() => alert('merhaba!')}
              name="border-color"
              color={'rgb(64,64,64)'}
              size={22}
            />
          </View>

          <View style={{backgroundColor: 'white', padding: 12}}>
            <Text style={{color: 'rgb(34,34,34)', fontWeight: 'bold'}}>
              Oluşturulma Tarihi
            </Text>
            <Text style={{color: 'rgb(70,70,70)'}}>{plan.created}</Text>
          </View>

          <Text style={{fontSize: 13, fontWeight: 'bold', padding: 12}}>
            DERSLERİM
          </Text>

          {plan.lessons.map((lesson, index) => (
            <View style={{backgroundColor: 'white', padding: 12}}>
              <Text>{lesson.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  planView: {
    marginStart: 12,
    marginEnd: 12,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 9,
    height: 64,
  },
  osman: {
    backgroundColor: 'white',
    padding: 12,
  },
});

export default DetailsScreen;
