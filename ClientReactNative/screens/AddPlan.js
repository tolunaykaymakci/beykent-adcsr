import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import {authorizedRequest, dump, getRequest} from '../Service';

const AddPlan = ({navigation}) => {
  const [examText, setExamText] = useState();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [planName, setPlanName] = useState();
  const [exams, setExams] = useState();

  const knownExams = useRef();
  const selectedUid = useRef();

  useEffect(() => {
    getRequest('ss/sdb/get-known-exams', {})
      .then((response) => response.json())
      .then((json) => {
        knownExams.current = json.known_exams;
        setExams(knownExams.current);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  const createPlan = () => {
    authorizedRequest('ss/sdb/plans/new', {
      plan: {exam_uid: selectedUid.current, name: planName},
    })
      .then((response) => {
        navigation.goBack();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  return (
    exams !== null && (
      <View style={{padding: '5%'}}>
        <TouchableOpacity
          onPress={() => setPickerVisible(true)}
          style={{
            backgroundColor: '#A8DEFF',
            width: '100%',
            height: 64,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: 50,
              height: 50,
              borderRadius: 25,
              right: -5,
              top: 7,
            }}>
            <Image
              source={require('../assest/arrow.png')}
              style={{width: 30, height: 30, right: -10, top: 10}}
              resizeMode="contain"
            />
          </View>

          <Text style={{fontSize: 16, color: '#003351', right: -70, top: -37}}>
            Çalıştığınız Sınav
          </Text>
          <Text style={{fontSize: 14, color: '#003351', right: -70, top: -33}}>
            {examText ?? 'Seçmek için dokunun'}
          </Text>
        </TouchableOpacity>

        {examText == null ? (
          <></>
        ) : (
          <>
            <View
              onPress={() => setPickerVisible(true)}
              style={{
                backgroundColor: '#A8DEFF',
                width: '100%',
                height: 76,
                borderRadius: 20,
                shadowColor: '#000',
                marginTop: 12,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 20,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  right: -5,
                  top: 14,
                }}>
                <Image
                  source={require('../assest/notebook.png')}
                  style={{width: 30, height: 30, right: -10, top: 10}}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{fontSize: 16, color: '#003351', right: -70, top: -37}}>
                Planınızın İsmi
              </Text>

              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Yazmak için dokunun"
                  placeholderTextColor="#003f5c"
                  autoCapitalize="none"
                  value={planName ?? 'Plan ismim'}
                  onChangeText={(text) => setPlanName(text)}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => createPlan()}
              style={{
                backgroundColor: '#A8DEFF',
                width: 64,
                height: 64,
                alignSelf: 'flex-end',
                marginTop: 12,
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assest/save.png')}
                style={{width: 30, height: 30}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </>
        )}

        {exams == null ? (
          <></>
        ) : (
          <Modal visible={pickerVisible} transparent={true}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                flex: 1,
                width: '100%',
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  height: '40%',
                  width: '100%',
                  backgroundColor: 'white',
                }}>
                <ScrollView>
                  {exams.map((exam, index) => (
                    <TouchableOpacity
                      key={exam.exam_uid}
                      style={{
                        width: '100%',
                        height: 70,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        selectedUid.current = exam.exam_uid;
                        setPickerVisible(false);
                        setExamText(exam.title);
                        setPlanName(exam.acronym + ' Planım');
                      }}>
                      <Text style={{fontSize: 16, top: 10}}>
                        {exam.title + ' (' + exam.acronym + ')'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: '76%',
    backgroundColor: 'rgba(255,255,255,.54)',
    borderRadius: 14,
    height: 32,
    marginTop: -32,
    right: -68,
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 9,
    paddingStart: 9,
    paddingEnd: 9,
  },
  inputText: {
    height: 34,
    color: 'black',
  },
});

export default AddPlan;
