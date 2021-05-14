import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {authorizedRequest} from '../Service';

const width = Dimensions.get('window').width;

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

  const onDayPlan = () => {
    navigation.navigate('StudyProgram', {plan: plan});
  };

  return (
    <SafeAreaView style={{flex: 1, width: '100%', height: '100%'}}>
      {plan == null ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#A8DEFF',
              position: 'absolute',
              right: 10,
              top: -55,
              zIndex: 1000,
            }}>
            <Image
              source={require('../assest/trash.png')}
              style={{width: 30, height: 30, right: -10, top: 10}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              height: '100%',
              marginTop: 12,
              zIndex: -1,
            }}>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#A8DEFF',
                width: '90%',
                height: '20%',
                padding: '3%',
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 10,
              }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../assest/exam.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
                <Text style={{fontSize: 16, color: '#003351'}}>
                  {plan.exam_title}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../assest/name.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
                <Text style={{fontSize: 16, color: '#003351'}}>
                  {plan.name}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../assest/calendar.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
                <Text style={{fontSize: 16, color: '#003351'}}>
                  {plan.created}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: 'space-around',
                backgroundColor: '#A8DEFF',
                padding: '3%',
                width: '90%',
                height: '20%',
                marginTop: 20,
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 10,
              }}>
              <Text style={{fontSize: 16, color: '#003351'}}>
                Ders Programı
              </Text>
              <Text style={{fontSize: 13, color: '#003351'}}>
                Bir ders programı oluşturarak kendinize günlük soru hedefleri
                belirleyebilirsiniz. Soru sayacı hedefinize ulaşmanıza yardımcı
                olacaktır.
              </Text>
              <TouchableOpacity
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
                onPress={onDayPlan}>
                <Image
                  source={require('../assest/notebook.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
                <Text style={{fontSize: 16, color: '#003351'}}>
                  Ders Programı Oluştur
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={plan.lessons}
              numColumns={2}
              contentContainerStyle={{
                width: width,
                justifyContent: 'space-around',
                marginTop: 20,
              }}
              columnWrapperStyle={{
                justifyContent: 'space-around',
                width: '98%',
                marginBottom: 20,
              }}
              keyExtractor={(item) => item.lesson_id}
              renderItem={({item, index}) => (
                <View
                  key={index}
                  style={{
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: '#E1F4FF',
                    width: (width * 40) / 100,
                    height: (width * 40) / 100,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 10,
                  }}>
                  <Image
                    source={require('../assest/study.png')}
                    style={{width: 50, height: 50}}
                    resizeMode="contain"
                  />
                  <Text style={{fontSize: 14, color: '#003351'}}>
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        </>
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
