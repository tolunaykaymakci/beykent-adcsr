import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {authorizedRequest, dump} from '../Service';
import {useIsFocused} from '@react-navigation/native';

const width = Dimensions.get('window').width;

const DetailsScreen = ({route, navigation}) => {
  const {planId} = route.params;
  const [plan, setPlan] = useState();
  const [program, setProgram] = useState('none');
  const isFocused = useIsFocused();

  useEffect(() => {
    getPlan();
  }, [isFocused]);

  const getPlan = () => {
    authorizedRequest('ss/sdb/plan', {
      plan_id: planId,
    })
      .then((response) => response.json())
      .then((json) => {
        setPlan(json.plan);
        setProgram(json.plan.program_type ?? 'none');
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const goToStudyProgram = (mode) =>
    navigation.navigate('StudyProgram', {plan, mode});

  const deleteStudyProgram = () => {
    Alert.alert('Programı Sil?', 'Ders programınız silinsin mi?', [
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
      {
        text: 'Evet, sil',
        onPress: () => {
          authorizedRequest('ss/sdb/plans/program/delete', {
            plan_id: plan.plan_id,
          })
            .then((response) => setProgram('none'))
            .catch((error) => console.error(error))
            .finally(() => {});
        },
      },
    ]);
  };

  const deleteStudyPlan = () => {
    Alert.alert(
      'Planı Sil? (Dikkat!)',
      'Bu çalışma planını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!',
      [
        {
          text: 'Vazgeç',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Evet, sil', onPress: () => console.log('OK Pressed')},
      ],
    );
  };

  return (
    <SafeAreaView style={{flex: 1, width: '100%', height: '100%'}}>
      {plan && (
        <>
          <TouchableOpacity
            onPress={deleteStudyPlan}
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
              source={require('../assets/trash.png')}
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
                  source={require('../assets/exam.png')}
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
                  source={require('../assets/name.png')}
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
                  source={require('../assets/calendar.png')}
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
                belirleyebilirsiniz. Hedefinize ulaşmanıza yardımcı olacağız!
              </Text>

              {program === 'none' ? (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  onPress={() => goToStudyProgram('create')}>
                  <Image
                    source={require('../assets/notebook.png')}
                    style={{width: 30, height: 30}}
                    resizeMode="contain"
                  />
                  <Text style={{fontSize: 16, color: '#003351'}}>
                    Ders Programı Oluştur
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={{marginTop: 4, marginBottom: 4, fontSize: 15}}>
                    {program === 'fixed'
                      ? 'Sabit Ders Programı'
                      : program === 'daily'
                      ? 'Günlük Ders Programı'
                      : 'Haftalık Ders Programı'}
                  </Text>
                  <View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                      onPress={deleteStudyProgram}>
                      <Image
                        source={require('../assets/trash.png')}
                        style={{width: 30, height: 30}}
                        resizeMode="contain"
                      />
                      <Text style={{fontSize: 16, color: '#003351'}}>
                        Programı Sil
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginEnd: 8,
                      }}
                      onPress={() => goToStudyProgram('edit')}>
                      <Image
                        source={require('../assets/edit.png')}
                        style={{width: 30, height: 30}}
                        resizeMode="contain"
                      />
                      <Text style={{fontSize: 16, color: '#003351'}}>
                        Düzenle
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
                    source={require('../assets/study.png')}
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
