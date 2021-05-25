import React, {useRef, useLayoutEffect, useState} from 'react';

import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  ToastAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';

import moment from 'moment';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PlanSelectSheet from '../../src/components/sheets/PlanSelectSheet';
import LessonSelectSheet from '../../src/components/sheets/LessonSelectSheet';
import DateTimeSelectSheet from '../../src/components/sheets/DateTimeSelectSheet';
import ManTestSheet from '../../src/components/sheets/ManTestSheet';

import {GlobalColors, GlobalStyles} from '../../src/GlobalStyles';

import TouchChoose from '../../src/components/TouchChoose';
import {authorizedRequest, dump} from '../../Service';

import {TestDataItem} from '../../src/components/ManDataItems';

const width = Dimensions.get('window').width;

const ManQuestionsScreen = ({route, navigation}) => {
  const {initDate, recordPack} = route.params;

  const [requestingPlans, setRequestingPlans] = useState(true);
  const [planText, setPlanText] = useState();
  const [lessonText, setLessonText] = useState();
  const [dateText, setDateText] = useState();
  const [tmRefTdi, setTmRefTdi] = useState();
  const [subjectsList, setSubjectsList] = useState([]);

  const plans = useRef();
  const currentPlan = useRef();
  const currentLesson = useRef();
  const lessonSubjects = useRef();
  const currentDate = useRef(moment());

  const plansSheet = useRef();
  const lessonsSheet = useRef();
  const dateSheet = useRef();
  const timeSheet = useRef();
  const testSheet = useRef();

  // Test objects
  const mqsItems = useRef([]);

  const [renderItems, setRenderItems] = useState([new TestDataItem(true)]);

  useLayoutEffect(() => {
    if (recordPack) {
      dump(recordPack);
    }

    var initTime = moment().format('HH:mm:ss');
    currentDate.current = moment(initDate + ' ' + initTime);
    setDateText(currentDate.current.format('yyyy-MM-DD HH:mm:ss'));
    requestPlans();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
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
      ),
    });
  }, [navigation]);

  function requestPlans() {
    authorizedRequest('ss/sdb/plan/all', {})
      .then((response) => response.json())
      .then((json) => {
        plans.current = json.plans;
        currentPlan.current = plans.current[0];

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
    let records = [];

    var editMode = false;
    var manageMode = 'tests';
    if (manageMode === 'tests') {
      mqsItems.current.forEach((tdi, i) => {
        if (!tdi.placeholder) {
          var newRecord = null;

          for (var ri = 0; ri != records.length; ri++) {
            var checkRecord = records[ri];

            if (checkRecord.subject_name == tdi.subject_title) {
              newRecord = checkRecord;
              break;
            }
          }

          if (newRecord == null) {
            newRecord = {
              record_lesson: currentLesson.current.lesson_id,
              create_date: currentDate.current.format('yyyy-MM-DD HH:mm:ss'),
              subject_name: tdi.subject_title,
              record_plan: currentPlan.current.plan_id,
              tests: [],
            };

            records.push(newRecord);
          }

          var dataTest = {
            is_detailed: tdi.detailed ? 1 : 0,
            qc_total: tdi.totalCount,
            qc_correct: tdi.correctCount,
            qc_wrong: tdi.wrongCount,
          };

          newRecord.tests.push(dataTest);
        }
      });
    } else {
    }

    var drop = null;
    if (editMode) {
      drop = {};
    }

    authorizedRequest('ss/sdb/reports/records/manipulate', {
      insert: records,
      drop: drop,
    })
      .then((response) => {
        response.json();
      })
      .then((json) => {
        if (Platform.OS == 'android') {
          ToastAndroid.showWithGravity(
            'Soru çözümleri eklendi',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }

        navigation.goBack(null);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      <ScrollView>
        <View
          style={{backgroundColor: GlobalColors.headerSecondary, elevation: 4}}>
          <PlanSelectSheet plans={plans.current} refs={plansSheet} />
          <DateTimeSelectSheet mode="date" refs={dateSheet} />
          <DateTimeSelectSheet mode="time" refs={timeSheet} />
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

          <ManTestSheet
            refs={testSheet}
            refTdi={tmRefTdi}
            subjectsRef={subjectsList}
            confirm={(mode, newTdi) => {
              if (mode == 'add') {
                mqsItems.current = [...mqsItems.current, newTdi];
                setRenderItems([...mqsItems.current, new TestDataItem(true)]);
              } else {
                // Find item index from key first
                var itemIndex = mqsItems.current.indexOf(
                  mqsItems.current.find((x) => x.key === newTdi.key),
                );
                mqsItems[itemIndex] = newTdi;
                setRenderItems([...mqsItems.current, new TestDataItem(true)]);
              }
            }}
          />

          <View
            style={{
              backgroundColor: 'rgb(62, 116, 182)',
              width: 66,
              borderRadius: 33,
              height: 66,
              shadowOpacity: 0.43,
              shadowRadius: 2.62,
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
          </View>

          <View style={{paddingStart: 18, marginTop: 10, paddingEnd: 18}}>
            <TouchChoose
              action={() => plansSheet.current.open()}
              title="Plan"
              loading={requestingPlans}
              value={planText == null ? '' : planText}
            />
            <TouchChoose
              action={() => lessonsSheet.current.open()}
              title="Ders"
              loading={requestingPlans}
              value={lessonText == null ? 'Seç' : lessonText}
            />
            <TouchChoose
              action={() => dateSheet.current.open()}
              title="Tarih"
              value={dateText}
            />
            <TouchChoose
              action={() => timeSheet.current.open()}
              title="Saat"
              value="20:12"
            />
          </View>
        </View>

        {lessonText == null ? (
          <Text
            style={{
              padding: 16,
              margin: 12,
              elevation: 1,
              color: GlobalColors.titleText,
              backgroundColor: GlobalColors.primaryCard,
              borderRadius: 9,
            }}>
            Soru eklemeye başlamak için lütfen yukarıdaki seçimleri yapın.
          </Text>
        ) : (
          <View
            style={{
              marginStart: 6,
              marginEnd: 6,
              marginBottom: 42,
              marginTop: 12,
            }}>
            <FlatList
              data={renderItems}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    setTmRefTdi(item);
                    testSheet.current.xmys = item;
                    testSheet.current.open();
                  }}
                  style={{
                    ...GlobalStyles.primaryCard,
                    flex: 1,
                    marginEnd: 6,
                    marginStart: 6,
                    height: 96,
                    maxWidth: width / 2 - 18,
                  }}>
                  {item.type === 'test' ? (
                    <TestView tdi={item} index={index}></TestView>
                  ) : (
                    <SubjectView sdi={item} index={index}></SubjectView>
                  )}
                </TouchableOpacity>
              )}
              numColumns={2}
              keyExtractor={(item) => item.key}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const TestView = ({tdi, index}) => {
  return (
    <View>
      {tdi.placeholder ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          <MaterialIcons
            name="assignment"
            style={{
              marginEnd: 8,
              alignSelf: 'center',
              color: GlobalColors.titleText,
              marginBottom: 4,
            }}
            color={'rgb(0,0,0)'}
            size={28}
          />
          <Text
            style={{
              alignSelf: 'center',
              color: GlobalColors.subText,
              marginEnd: 8,
            }}>
            Test Ekle
          </Text>
        </View>
      ) : (
        <>
          <Text style={{color: GlobalColors.titleText, fontWeight: 'bold'}}>
            Test {index + 1}
          </Text>
          <Text style={{color: GlobalColors.titleText}}>
            {tdi.totalCount} soru
          </Text>
          <Text style={{color: GlobalColors.subText}}>{tdi.subject_title}</Text>
        </>
      )}
    </View>
  );
};

const SubjectView = ({sdi}) => {
  return (
    <View>
      {sdi.placeholder ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          <MaterialIcons
            name="assignment"
            style={{marginEnd: 8, alignSelf: 'center', marginBottom: 4}}
            color={'rgb(0,0,0)'}
            size={28}
          />
          <Text style={{alignSelf: 'center', marginEnd: 8}}>Konu Ekle</Text>
        </View>
      ) : (
        <Text style={{alignSelf: 'center', marginEnd: 8}}>
          {sdi.subject_title}
        </Text>
      )}
    </View>
  );
};

export default ManQuestionsScreen;
