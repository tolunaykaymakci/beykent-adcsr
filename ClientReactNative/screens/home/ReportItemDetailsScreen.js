import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Picker,
  Dimensions,
  SectionList,
  ScrollView,
} from 'react-native';

import {GlobalStyles, GlobalColors} from '../../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {getRequest} from '../../Service';

/* Report Item Details Init Modes */

function ReportItemDetailsScreen({route, navigation}) {
  const REPIDM_QUESTION_REPORT_LESSON = 1;
  const REPIDM_QUESTION_REPORT_SUBJECT = 2;
  const REPIDM_STUDY_REPORT_LESSON = 3;
  const REPIDM_STUDY_REPORT_SUBJECT = 4;

  const {initMode} = route.params;

  // Bunlar id
  const [lessonValue, setLessonValue] = useState();
  const [subjectValue, setSubjectValue] = useState();

  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);

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

  return (
    <SafeAreaView>
      <View style={{}}>
        <Text style={{padding: 12, paddingBottom: 0}}>Ders</Text>
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

        <Text style={{padding: 12, paddingBottom: 0}}>Konu</Text>
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
    </SafeAreaView>
  );
}

export default ReportItemDetailsScreen;
