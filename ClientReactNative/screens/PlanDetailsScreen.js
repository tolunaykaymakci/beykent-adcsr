import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {authorizedRequest} from '../Service';

const DetailsScreen = ({route, navigation}) => {
  const {planId} = route.params;
  const [plan, setPlan] = useState();

  useEffect(() => {
    authorizedRequest('http://192.168.1.104:5000/ss/sdb/plan', {
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
      <ScrollView style={{flex: 1}}>
        {plan == null ? (
          <Text>Yükleniyor...</Text>
        ) : (
          <View>
            <Text style={{padding: 12, fontWeight: 'bold', fontSize: 13}}>
              PLAN DETAYLARI
            </Text>

            <View style={styles.cardLayout}>
              <Text>Çalıştığınız Sınav</Text>
              <Text>
                {plan.exam_title} ({plan.exam_acr})
              </Text>
            </View>
            <View style={styles.cardLayout}>
              <Text>Plan İsmi</Text>
              <Text>{plan.name}</Text>
              <MaterialCommunityIcons
                style={{
                  position: 'absolute',
                  right: 0,
                  marginRight: 12,
                  marginTop: 21,
                }}
                onPress={() => {
                  alert('plan ismini değiştiriyorum');
                }}
                name="border-color"
                color={'rgb(64,64,64)'}
                size={24}
              />
            </View>
            <View style={styles.cardLayout}>
              <Text>Oluşturulma Tarihi</Text>
              <Text>{plan.created}</Text>
            </View>

            <Text style={{padding: 12, fontWeight: 'bold', fontSize: 13}}>
              DERSLERİM
            </Text>

            {plan.lessons.map((lesson, index) => (
              <Text style={styles.cardLayout}>{lesson.name}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  selectorTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
  },
  selectorSubtext: {
    fontSize: 14.75,
    marginBottom: 4,
  },
  cardLayout: {
    backgroundColor: 'white',
    padding: 12,
  },
});

export default DetailsScreen;
