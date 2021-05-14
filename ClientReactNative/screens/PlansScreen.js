// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';

import * as Progress from 'react-native-progress';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getRequest, authorizedRequest} from '../Service';
import {GlobalColors} from '../src/GlobalStyles';

import {useIsFocused} from '@react-navigation/native';

const PlansScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    authorizedRequest('ss/sdb/plan/all', {})
      .then((response) => response.json())
      .then((json) => {
        setPlans(json.plans);
        setLoading(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, [isFocused]);

  const goToPlanDetails = (planId) => {
    navigation.navigate('PlanDetails', {planId});
  };

  return loading ? (
    <View
      style={{
        flex: 1,
        backgroundColor: GlobalColors.windowBackground,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Progress.Circle
        style={{
          margin: 12,
          bottom: 0,
        }}
        color={GlobalColors.accentColor}
        thickness={40}
        size={36}
        indeterminate={true}
      />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: GlobalColors.windowBackground,
      }}>
      {plans.length === 0 ? (
        <View style={{alignItems: 'center', marginTop: 64}}>
          <Image
            source={require('../assest/study.png')}
            style={{width: 70, height: 70, margin: 12}}
            resizeMode="contain"
          />
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Henüz plan yaratılmamış
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 2,
              maxWidth: '80%',
              textAlign: 'center',
            }}>
            Şimdi bir çalışma planı oluşturmak için artıya dokunun
          </Text>
        </View>
      ) : (
        plans.map((r) => (
          <TouchableOpacity
            key={r.plan_id}
            onPress={() => goToPlanDetails(r.plan_id)}>
            <View style={styles.planView}>
              <View
                style={{alignItems: 'center', width: '100%', height: '100%'}}>
                <View
                  style={{
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: '#A8DEFF',
                    width: 400,
                    height: 65,
                    padding: '3%',
                    borderRadius: 30,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 10,
                  }}>
                  <Text style={{fontSize: 16, color: '#003351', top: 3}}>
                    {r.name}
                  </Text>
                  <Text style={{fontSize: 16, color: '#003351', top: 17}}>
                    {r.exam_title}
                  </Text>
                  <Text style={{fontSize: 16, color: '#003351', top: 32}}>
                    {r.created}
                  </Text>
                  <Image
                    source={require('../assest/name.png')}
                    style={{width: 50, height: 50, right: 150, top: -5}}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('AddPlan')}
        style={{
          backgroundColor: '#A8DEFF',
          width: 64,
          borderRadius: 34,
          height: 64,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowRadius: 20,
          shadowOpacity: 0.5,
          elevation: 1,
          position: 'absolute',
          alignItems: 'center',
          bottom: 0,
          right: 0,
          margin: 16,
        }}>
        <Image
          source={require('../assest/add.webp')}
          style={{width: 60, height: 60}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
export default PlansScreen;

const styles = StyleSheet.create({
  planView: {
    marginStart: 12,
    marginEnd: 12,
    marginTop: 6,
    marginBottom: 6,
    padding: 8,
    borderRadius: 9,
    height: 64,
  },
});
