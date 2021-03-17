// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
} from 'react-native';

import {authorizedRequest} from '../Service';

const PlansScreen = ({navigation}) => {
  const [plans, setPlans] = useState();

  useEffect(() => {
    authorizedRequest('http://192.168.1.104:5000/ss/sdb/plan/all', {})
      .then((response) => response.json())
      .then((json) => {
        setPlans(json.plans);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  const goToPlanDetails = (planId) => {
    navigation.navigate('PlanDetails', {planId});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {plans == null ? (
        <Text>Çalışma Planı Yaratılmamış</Text>
      ) : (
        plans.map((r) => (
          <TouchableOpacity
            key={r.plan_id}
            onPress={() => goToPlanDetails(r.plan_id)}>
            <View style={styles.planView}>
              <Text>{r.name}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </SafeAreaView>
  );
};
export default PlansScreen;

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
});
