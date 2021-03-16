import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';

import Service, {AuthorizedRequest} from '../Service';

const DetailsScreen = ({route, navigation}) => {
  const [plan, setPlan] = useState();
  const {planId} = route.params;

  useEffect(() => {
    var x = JSON.stringify(AuthorizedRequest({plan_id: planId}));

    let data = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: x,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch('http://192.168.1.104:5000/ss/sdb/plan', data)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setPlan(json.plan);
        //setData(json.lessons);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {plan == null ? (
          <Text>Plan falan yok!</Text>
        ) : (
          <ScrollView>
            <View style={{flex: 1, padding: 16}}>
              <Text>Plan Detayları</Text>

              <Text style={styles.selectorTitle}>Plan İsmi</Text>
              <Text style={styles.selectorSubtext}>{plan.name}</Text>

              <Text style={styles.selectorTitle}>Çalışılan Sınav</Text>
              <Text style={styles.selectorSubtext}>{plan.exam_title}</Text>

              <Text style={styles.selectorTitle}>Yaratılma Tarihi</Text>
              <Text style={styles.selectorSubtext}>{plan.created}</Text>

              <Text style={styles.selectorTitle}>Ders Programı</Text>
              <Text style={styles.selectorSubtext}>{plan.program_type}</Text>

              <Text style={styles.selectorTitle}>Dersler</Text>
              {plan.lessons.map((lesson) => (
                <Text key={lesson.lesson_id} style={styles.selectorSubtext}>
                  {lesson.name}
                </Text>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
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
});

export default DetailsScreen;
