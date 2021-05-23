import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Picker,
  TextInput,
  Image,
  SectionList,
  ScrollView,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsqmPostTransmission from '../src/transmission/AsqmPostTransmission';
import PlanSelectSheet from '../src/components/PlanSelectSheet';
import {GlobalColors, GlobalStyles} from '../src/GlobalStyles';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import {dump, getRequest} from '../Service';

function AsqmAddScreen({route, navigation}) {
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  const plansSheet = useRef();
  const [lessonValue, setLessonValue] = useState();
  const [subjectValue, setSubjectValue] = useState();

  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [text, onChangeText] = React.useState('');

  const lessStore = useRef();
  const subjStore = useRef();

  const [image0, setImage0] = useState();
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();

  useEffect(() => {
    // Dersleri çağır
    getRequest('ss/asqm/lessons?adcsr=true')
      .then((response) => response.json())
      .then((json) => {
        lessStore.current = json.lessons;
        setLessons(json.lessons);
      })
      .catch((error) => console.error(error));
  }, []);

  const populateSubjects = (lid) => {
    // Konuları çağır
    getRequest('ss/asqm/subjects?adcsr=true&lid=' + lid)
      .then((response) => response.json())
      .then((json) => {
        subjStore.current = json.subjects;
        setSubjects(json.subjects);
      })
      .catch((error) => console.error(error));
  };

  const selectImage = (index) => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8, includeBase64: true},
      (response) => {
        if (response.didCancel) return;

        if (index == 0) {
          setImage0(response);
        } else if (index == 1) {
          setImage1(response);
        } else if (index == 2) {
          setImage2(response);
        }
      },
    );
  };

  const send = () => {
    var postra = new AsqmPostTransmission();
    postra.setLessonId(lessonValue);
    postra.setSubjectId(subjectValue);
    postra.setPostBody(text);
    if (image2) {
      postra.setPostImages(image0, image1, image2);
    } else if (image1) {
      postra.setPostImages(image0, image1);
    } else if (image0) {
      postra.setPostImages(image0);
    }

    postra.transmitter.registerEvents(
      (progress) => {
        setSendProgress(progress);
      },
      (completed) => {
        navigation.goBack();
      },
      (failed) => {},
    );

    setSending(true);
    postra.beginTask();
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      {sending ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 64,
          }}>
          <View
            style={{
              backgroundColor: GlobalColors.primaryCard,
              elevation: 3,
              borderRadius: 4,
              width: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 16}}>
              Soru Gönderiliyor...
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: GlobalColors.subText,
                opacity: 0.8,
              }}>
              Lütfen bekleyin
            </Text>
            <Progress.Circle
              style={{margin: 16, marginBottom: 24}}
              progress={Number(sendProgress / 100)}
              thickness={8}
              size={80}
              formatText={(progress) => Math.floor(sendProgress) + '%'}
              showsText={true}
              textStyle={{fontSize: 16}}
            />
          </View>
        </View>
      ) : (
        <>
          <ScrollView>
            <View style={{backgroundColor: GlobalColors.headerSecondary}}>
              <PlanSelectSheet refs={plansSheet} />

              <View style={{marginTop: 6}}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: 'rgba(0,0,0,.15)',
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    paddingStart: 6,
                    paddingEnd: 6,
                  }}>
                  <Text
                    style={{padding: 8, fontWeight: 'bold', paddingBottom: 6}}>
                    Ders
                  </Text>

                  <Picker
                    selectedValue={lessonValue ?? -1}
                    style={{height: 32, flex: 1}}
                    onValueChange={(itemValue, itemIndex) => {
                      setSubjectValue(null);
                      setLessonValue(lessStore.current[itemIndex].id);
                      populateSubjects(itemValue);
                    }}>
                    {lessons.map((lesson) => (
                      <Picker.Item label={lesson.name} value={lesson.id} />
                    ))}
                  </Picker>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: 'rgba(0,0,0,.15)',
                    paddingBottom: 8,
                    paddingTop: 4,
                    borderBottomWidth: 1,
                    paddingStart: 6,
                    paddingEnd: 6,
                  }}>
                  <Text
                    style={{padding: 8, fontWeight: 'bold', paddingBottom: 6}}>
                    Konu
                  </Text>

                  <Picker
                    selectedValue={subjectValue ?? -1}
                    style={{height: 32, flex: 1}}
                    onValueChange={(itemValue, itemIndex) => {
                      setSubjectValue(subjStore.current[itemIndex].id);
                    }}>
                    {subjects.map((subject) => (
                      <Picker.Item label={subject.title} value={subject.id} />
                    ))}
                  </Picker>
                </View>

                <View
                  style={{
                    borderBottomColor: 'rgba(0,0,0,.15)',
                    paddingBottom: 14,
                    borderBottomWidth: 1,
                    paddingStart: 6,
                    paddingEnd: 6,
                  }}>
                  <Text
                    style={{
                      padding: 8,
                      fontWeight: 'bold',
                      paddingBottom: 6,
                      paddingTop: 12,
                    }}>
                    Soru Fotoğrafları
                  </Text>

                  <Text style={{padding: 8, paddingTop: 0}}>
                    Sorunuza dair en az 1 en fazla 3 fotoğraf ekleyebilirsiniz
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginStart: 8,
                      marginEnd: 8,
                    }}>
                    <TouchableOpacity
                      onPress={() => selectImage(0)}
                      style={{
                        flex: 1,
                        maxWidth: '33%',
                        height: 96,
                      }}>
                      {!image0 ? (
                        <View style={styles.placeh}>
                          <MaterialIcons
                            name="image"
                            color={'rgba(0,0,0,.8)'}
                            size={32}
                          />
                        </View>
                      ) : (
                        <Image
                          source={{
                            uri: image0.uri,
                          }}
                          style={{
                            width: '100%',
                            height: 96,
                          }}
                          resizeMode="cover"
                        />
                      )}
                    </TouchableOpacity>

                    {image0 == null ? (
                      <></>
                    ) : (
                      <TouchableOpacity
                        onPress={() => selectImage(1)}
                        style={{
                          flex: 1,
                          maxWidth: '33%',
                          height: 96,
                        }}>
                        {!image1 ? (
                          <View style={styles.placeh}>
                            <MaterialIcons
                              name="image"
                              color={'rgba(0,0,0,.8)'}
                              size={32}
                            />
                          </View>
                        ) : (
                          <Image
                            source={{
                              uri: image1.uri,
                            }}
                            style={{
                              width: '100%',
                              height: 96,
                            }}
                            resizeMode="cover"
                          />
                        )}
                      </TouchableOpacity>
                    )}

                    {image1 == null ? (
                      <></>
                    ) : (
                      <TouchableOpacity
                        onPress={() => selectImage(2)}
                        style={{
                          flex: 1,
                          maxWidth: '33%',
                          height: 96,
                        }}>
                        {!image2 ? (
                          <View style={styles.placeh}>
                            <MaterialIcons
                              name="image"
                              color={'rgba(0,0,0,.8)'}
                              size={32}
                            />
                          </View>
                        ) : (
                          <Image
                            source={{
                              uri: image2.uri,
                            }}
                            style={{
                              width: '100%',
                              height: 96,
                            }}
                            resizeMode="cover"
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <Text
                  style={{
                    marginStart: 18,
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  Soru Açıklamanız
                </Text>

                <TextInput
                  style={styles.input}
                  onChangeText={onChangeText}
                  value={text}
                  maxLength={2000}
                  textAlignVertical="top"
                  multiline={true}
                  placeholderTextColor="rgb(90,90,90)"
                  placeholder="Neleri denediniz?.."
                />
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute',
              right: 0,
              margin: 12,
              bottom: 0,
              width: 72,
              height: 72,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => send()}
              style={{
                backgroundColor: 'rgba(62, 116, 182, 1)',
                width: 66,
                borderRadius: 33,
                height: 66,
                shadowOpacity: 0.43,
                shadowRadius: 2.62,
                elevation: 1,
              }}>
              <MaterialIcons
                style={{alignSelf: 'center', marginTop: 18}}
                name="send"
                color={'rgb(255,255,255)'}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 72,
    marginStart: 16,
    marginEnd: 16,
    marginBottom: 12,
    padding: 12,
    color: 'black',
    borderRadius: 4,
    borderColor: 'rgb(220, 220, 220)',
    backgroundColor: 'rgb(244, 244, 244)',
    borderWidth: 1.5,
  },
  placeh: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    height: 96,
    borderWidth: 1,
    borderColor: 'rgb(210, 210, 210)',
    backgroundColor: 'rgb(244, 244, 244)',
  },
});

export default AsqmAddScreen;
