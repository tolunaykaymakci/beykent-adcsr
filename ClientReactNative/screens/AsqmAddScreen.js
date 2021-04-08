import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Picker,
  TextInput,
  SectionList,
  ScrollView,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PlanSelectSheet from '../src/components/PlanSelectSheet';
import {GlobalColors, GlobalStyles} from '../src/GlobalStyles';

import TouchChoose from '../src/components/TouchChoose';
import {getRequest} from '../Service';

function AsqmAddScreen({route, navigation}) {
  const plansSheet = useRef();
  const [lessonValue, setLessonValue] = useState();
  const [subjectValue, setSubjectValue] = useState();

  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [text, onChangeText] = React.useState('');

  const lessStore = useRef();
  const subjStore = useRef();

  useEffect(() => {
    // Dersleri çağır
    getRequest('ss/asqm/lessons?adcsr=true')
      .then((response) => response.json())
      .then((json) => {
        lessStore.current = json.lessons;
        setLessons(json.lessons);
      })
      .catch((error) => console.error(error));

    // Konuları çağırmak için önce dersin seçilmesi lazım, onu burada yapmıyoruz o yüzden
  }, []);

  const populateSubjects = (lid) => {
    // Dersleri çağır
    getRequest('ss/asqm/subjects?adcsr=true&lid=' + lid)
      .then((response) => response.json())
      .then((json) => {
        subjStore.current = json.subjects;
        setSubjects(json.subjects);
      })
      .catch((error) => console.error(error));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            height: '100%',
          }}>
          <MaterialIcons
            style={{
              paddingEnd: 9,
              paddingStart: 9,
              marginTop: 15,
            }}
            name="save"
            color={GlobalColors.titleText}
            size={24}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      <ScrollView>
        <View style={{backgroundColor: GlobalColors.headerSecondary}}>
          <PlanSelectSheet refs={plansSheet} />

          <View style={{paddingStart: 18, marginTop: 10, paddingEnd: 18}}>
            <View style={{}}>
              <TouchChoose title="Ders" loading={false} />

              <Picker
                selectedValue={lessonValue ?? -1}
                style={{height: 50, width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  setSubjectValue(null);
                  setLessonValue(lessStore.current[itemIndex].id);
                  populateSubjects(itemValue);
                }}>
                {lessons.map((lesson) => (
                  <Picker.Item label={lesson.name} value={lesson.id} />
                ))}
              </Picker>
              <TouchChoose title="Konu" loading={false} />

              <Picker
                selectedValue={subjectValue ?? -1}
                style={{height: 50, width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  setSubjectValue(subjStore.current[itemIndex].title);
                }}>
                {subjects.map((subject) => (
                  <Picker.Item label={subject.title} value={subject.id} />
                ))}
              </Picker>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => alert('Resim Ekleme Butonu')}
                style={{
                  height: '100%',
                }}>
                <MaterialIcons
                  style={{paddingEnd: 9, paddingStart: 9, marginTop: 60}}
                  name="image-search"
                  color={GlobalColors.titleText}
                  size={50}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                multiline={true}
                placeholder="Açıklama Girin"
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => alert('Soru Yükleme Butonu')}
          style={{
            backgroundColor: 'rgba(62, 116, 182, 1)',
            width: 66,
            borderRadius: 33,
            height: 66,
            shadowOpacity: 0.43,
            shadowRadius: 2.62,
            elevation: 1,
            marginTop: 24,
            alignSelf: 'center',
            flex: 1,
          }}>
          <MaterialIcons
            style={{alignSelf: 'center', marginTop: 18}}
            name="add"
            color={'rgb(255,255,255)'}
            size={28}
          />
        </TouchableOpacity>
        <Text
          style={{
            padding: 16,
            margin: 12,
            color: GlobalColors.titleText,
            backgroundColor: GlobalColors.primaryCard,
            borderRadius: 9,
          }}>
          Soru eklemeye başlamak için lütfen yukarıdaki seçimleri yapın.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 150,
    width: 270,
    margin: 20,
    borderWidth: 1.5,
  },
});

export default AsqmAddScreen;
