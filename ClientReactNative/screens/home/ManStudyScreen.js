import React, {useRef, useLayoutEffect, useState} from 'react';

import {
  SafeAreaView,
  Text,
  View,
  Alert,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PlanSelectSheet from '../../src/components/sheets/PlanSelectSheet';
import LessonSelectSheet from '../../src/components/sheets/LessonSelectSheet';
import DateTimeSelectSheet from '../../src/components/sheets/DateTimeSelectSheet';
import SubjectSelectSheet from '../../src/components/sheets/SubjectSelectSheet';
import StudyDurationInput from '../../src/components/dialogs/StudyDurationInput';

import {GlobalColors, GlobalStyles} from '../../src/GlobalStyles';

import TouchChoose from '../../src/components/TouchChoose';
import {authorizedRequest} from '../../Service';
import moment from 'moment';

const ManStudyScreen = ({route, navigation}) => {
  const {initDate, studies, planId} = route.params;

  const [requestingPlans, setRequestingPlans] = useState(true);
  const [planText, setPlanText] = useState();
  const [lessonText, setLessonText] = useState();
  const [dateText, setDateText] = useState();
  const [timeText, setTimeText] = useState();
  const [subjectText, setSubjectText] = useState();
  const [subjectsList, setSubjectsList] = useState([]);
  const [durationText, setDurationText] = useState([]);
  const [isDurationVisible, setDurationVisible] = useState(false);

  const plans = useRef();
  const currentPlan = useRef();
  const currentLesson = useRef();
  const lessonSubjects = useRef();
  const currentDate = useRef(moment());
  const currentDuration = useRef(0);
  const currentSubject = useRef('');

  const plansSheet = useRef();
  const lessonsSheet = useRef();
  const subjectSheet = useRef();
  const dateSheet = useRef();
  const timeSheet = useRef();

  useLayoutEffect(() => {
    var paramDate = initDate ?? moment().format('yyyy-MM-DD');

    navigation.setOptions({
      headerTitle: studies ? 'Konu Çalışmamı Düzenle' : 'Konu Çalışması Ekle',
    });

    var initTime = moment().format('HH:mm:ss');
    currentDate.current = moment(paramDate + ' ' + initTime);
    setDateText(currentDate.current.format('yyyy-MM-DD'));
    setTimeText(currentDate.current.format('HH:mm:ss'));

    requestPlans();
  }, []);

  function requestPlans() {
    authorizedRequest('ss/sdb/plan/all', {})
      .then((response) => response.json())
      .then((json) => {
        plans.current = json.plans;

        if (planId) {
          currentPlan.current = plans.current[0];

          json.plans.forEach((p) => {
            if (p.plan_id === planId) currentPlan.current = p;
          });
        }

        let study = studies;
        if (study) {
          // Parse recordPack and convert it to mqs items

          json.plans.forEach((plan, pi) => {
            if (study.plan_name === plan.name) {
              currentPlan.current = plan;

              plan.lessons.forEach((lesson, li) => {
                if (study.lesson_name === lesson.name) {
                  currentLesson.current = lesson;
                  setLessonText(lesson.name);
                  requestLessonSubjects();
                }
              });
            }
          });

          currentSubject.current = study.title;
          setSubjectText(study.title);

          currentDuration.current = study.duration;
          setDurationText(study.duration);

          currentDate.current = moment(study.created);
          setDateText(currentDate.current.format('yyyy-MM-DD HH:mm:ss'));
        }

        setPlanText(currentPlan.current.name);
        setRequestingPlans(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }

  function requestLessonSubjects() {
    authorizedRequest('ss/sdb/plans/subjects/all', {
      plan_id: currentPlan.current.plan_id,
      lesson_id: currentLesson.current.lesson_id,
      lesson_uid: currentLesson.current.lesson_uid,
    })
      .then((response) => response.json())
      .then((json) => {
        lessonSubjects.current = json.subjects;
        setSubjectsList(lessonSubjects.current);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }

  const commitWithArrows = () => {
    var editMode = studies;

    let p = currentPlan.current;
    let l = currentLesson.current;

    var studyItem = {
      plan_id: p.plan_id,
      lesson_id: l.lesson_id,
      plan_name: p.plan_name,
      lesson_name: l.name,
      title: currentSubject.current,
      duration: currentDuration.current,
      colors: l.colors,
      created: currentDate.current.format('yyyy-MM-DD HH:mm:ss'),
    };

    let apiep = editMode
      ? 'api/records/studies/edit'
      : 'api/records/studies/add';
    if (editMode) {
      studyItem.study_id = studies.study_id;
    }

    authorizedRequest(apiep, {item: studyItem})
      .then((response) => {
        response.json();
      })
      .then((json) => {
        if (Platform.OS == 'android') {
          ToastAndroid.showWithGravity(
            editMode ? 'Konu çalışması düzenlendi' : 'Konu çalışması eklendi',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }

        navigation.goBack(null);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const deleteRecord = () => {
    Alert.alert('Bu Kaydı Sil?', null, [
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
      {
        text: 'Evet',
        onPress: () => {
          authorizedRequest('api/records/studies/delete', {
            std_id: studies.study_id,
          })
            .then((response) => {
              if (Platform.OS == 'android') {
                ToastAndroid.showWithGravity(
                  'Konu çalışması silindi',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }

              navigation.goBack(null);
            })
            .catch((error) => console.error(error));
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{backgroundColor: GlobalColors.headerSecondary, elevation: 4}}>
          <PlanSelectSheet plans={plans.current} refs={plansSheet} />
          <DateTimeSelectSheet
            mode="date"
            refs={dateSheet}
            initialDate={currentDate.current.toDate()}
            callback={(date) => {
              currentDate.current = moment(
                date.format('yyyy-MM-DD') +
                  ' ' +
                  currentDate.current.format('HH:mm:ss'),
              );

              setDateText(currentDate.current.format('yyyy-MM-DD'));
              dateSheet.current.close();
            }}
          />
          <DateTimeSelectSheet
            mode="time"
            refs={timeSheet}
            initialDate={currentDate.current.toDate()}
            callback={(date) => {
              currentDate.current = moment(
                currentDate.current.format('yyyy-MM-DD') +
                  ' ' +
                  date.format('HH:mm:ss'),
              );

              setTimeText(currentDate.current.format('HH:mm:ss'));
              timeSheet.current.close();
            }}
          />
          <LessonSelectSheet
            lessons={
              currentPlan.current == null ? null : currentPlan.current.lessons
            }
            refs={lessonsSheet}
            selected={(lesson) => {
              currentLesson.current = lesson;
              setLessonText(lesson.name);
              lessonsSheet.current.close();
              requestLessonSubjects();
            }}
          />
          <SubjectSelectSheet
            refs={subjectSheet}
            subjects={subjectsList ?? []}
            onSelect={(subject) => {
              currentSubject.current = subject;
              setSubjectText(subject);
            }}
          />

          <StudyDurationInput
            visible={isDurationVisible}
            confirm={(val) => {
              currentDuration.current = val;
              setDurationText(val);
              setDurationVisible(false);
            }}
            dismiss={() => setDurationVisible(false)}
          />

          <View
            onPress={() => navigation.navigate('ManStudy', {})}
            style={{
              backgroundColor: 'rgba(255, 141, 115, 1)',
              width: 72,
              borderRadius: 36,
              height: 72,
              shadowOpacity: 0.43,
              shadowRadius: 2.62,
              elevation: 1,
              marginTop: 24,
              alignSelf: 'center',
              flex: 1,
            }}>
            <MaterialIcons
              style={{alignSelf: 'center', marginTop: 19}}
              name={studies ? 'edit' : 'add'}
              color={'rgb(255,255,255)'}
              size={32}
            />
          </View>

          <View style={{paddingStart: 18, marginTop: 24, paddingEnd: 18}}>
            <TouchChoose
              action={() => plansSheet.current.open()}
              title="Plan"
              loading={requestingPlans}
              value={planText ?? ''}
            />

            <TouchChoose
              action={() => dateSheet.current.open()}
              title="Tarih"
              value={dateText}
            />

            <TouchChoose
              action={() => timeSheet.current.open()}
              title="Saat"
              value={timeText}
            />

            <TouchChoose
              action={() => lessonsSheet.current.open()}
              title="Ders"
              loading={requestingPlans}
              value={lessonText ?? 'Seç'}
            />

            <TouchChoose
              title="Ders Konusu"
              value={subjectText ?? 'Seç'}
              action={() => subjectSheet.current.open()}
            />

            <TouchChoose
              title="Süre"
              value={durationText == 0 ? 'Seç' : durationText + ' dk'}
              action={() => setDurationVisible(true)}
            />
          </View>
        </View>
      </ScrollView>

      {navigation.setOptions({
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            {studies && (
              <TouchableOpacity
                onPress={() => deleteRecord()}
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  marginEnd: 3,
                }}>
                <MaterialIcons
                  style={{
                    alignSelf: 'center',
                    marginBottom: 9,
                    paddingEnd: 9,
                    paddingStart: 9,
                  }}
                  name="delete"
                  color={GlobalColors.titleText}
                  size={26}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => commitWithArrows()}
              style={{
                height: '100%',
                justifyContent: 'center',
              }}>
              <MaterialIcons
                style={{
                  alignSelf: 'center',
                  marginBottom: 9,
                  paddingEnd: 9,
                  paddingStart: 9,
                }}
                name="check"
                color={GlobalColors.titleText}
                size={26}
              />
            </TouchableOpacity>
          </View>
        ),
      })}
    </SafeAreaView>
  );
};

export default ManStudyScreen;
