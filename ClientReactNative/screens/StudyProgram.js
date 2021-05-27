import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import TouchChoose from '../src/components/TouchChoose';
import InputDialog from '../src/components/dialogs/InputDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import {authorizedRequest, dump} from '../Service';

class GroupItem {
  drawHeader = false;
  headerTitle = '';
  key;
  representers = [];
  hideItems = false;
}

class RepresenterItem {
  text;
  value = 0;
  luid;
}

const ProgramSelectSheet = ({refs, selected}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}>
      <RBSheet
        ref={refs}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,.3)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            backgroundColor: '#fff',
          },
        }}>
        <Text style={{padding: 12, fontSize: 16}}>Program Türü Seç</Text>

        <TouchableOpacity
          style={{padding: 12, paddingBottom: 6}}
          onPress={() => selected('fixed')}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Sabit Ders Programı
          </Text>
          <Text>Her gün için geçerli bir hedef soru sayısı belirleyin.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 12, paddingBottom: 6}}
          onPress={() => selected('daily')}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Günlük Ders Programı
          </Text>
          <Text>
            Gün için ulaşmak istediğiniz soru sayısını her ders için belirtin.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 12, paddingBottom: 6}}
          onPress={() => selected('weekly')}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Haftalık Ders Programı
          </Text>
          <Text>
            Dersler için ulaşmak istediğiniz soru sayısını haftanın her günü
            için belirtin.
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
};

const StudyProgram = ({route, navigation}) => {
  const programSheet = useRef();
  const [items, setItems] = useState();
  const [typeText, setTypeText] = useState();
  const [showInput, setShowInput] = useState(false);
  const {plan, mode} = route.params;

  const currentType = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (mode === 'create') {
      programSheet.current.open();
    } else {
      /** Request program data */
      let apiep = 'ss/sdb/plans/program/' + plan.program_type;
      authorizedRequest(apiep, {plan_id: plan.plan_id})
        .then((response) => response.json())
        .then((json) => {
          if (plan.program_type === 'fixed') {
            setupFixed(json);
          } else if (plan.program_type === 'daily') {
            setupDaily(json);
          } else {
            setupWeekly(json);
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {});
    }
  }, []);

  const setupFixed = (current) => {
    var fixedGroup = new GroupItem();
    fixedGroup.drawHeader = false;

    var rItem = new RepresenterItem();
    rItem.text = 'Sabit Soru Hedefim';

    if (current) {
      rItem.value = current.target;
    }

    fixedGroup.representers.push(rItem);
    currentType.current = 'fixed';
    setItems([fixedGroup]);
    setTypeText('Sabit Ders Programı');
  };

  const setupDaily = (current) => {
    var dailyGroup = new GroupItem();
    dailyGroup.drawHeader = false;
    var repItems = dailyGroup.representers;

    plan.lessons.forEach((lesson, li) => {
      var rItem = new RepresenterItem();
      rItem.text = lesson.name;
      rItem.luid = lesson.lesson_id;
      repItems.push(rItem);
    });

    currentType.current = 'daily';
    setItems([dailyGroup]);
    setTypeText('Günlük Ders Programı');
  };

  const setupWeekly = (current) => {
    const weekDays = [
      ['Pazartesi', 'mon'],
      ['Salı', 'tue'],
      ['Çarşamba', 'wed'],
      ['Perşembe', 'thu'],
      ['Cuma', 'fri'],
      ['Cumartesi', 'sat'],
      ['Pazar', 'sun'],
    ];

    var groups = [];

    weekDays.map((wd, wdi) => {
      var groupItem = new GroupItem();
      groupItem.drawHeader = true;
      groupItem.headerTitle = wd[0];
      groupItem.hideItems = true;
      groupItem.key = wd[1];

      var repItems = groupItem.representers;
      plan.lessons.forEach((lesson, li) => {
        var rItem = new RepresenterItem();
        rItem.text = lesson.name;
        rItem.luid = lesson.lesson_id;
        repItems.push(rItem);
      });

      groups.push(groupItem);
    });

    currentType.current = 'weekly';
    setItems(groups);
    setTypeText('Haftalık Ders Programı');
  };

  const commitProgram = () => {
    var program;
    if (currentType.current === 'fixed') {
      program = {
        target: items[0].representers[0].value,
      };
    } else if (currentType.current === 'daily') {
      var lessons = [];
      items[0].representers.forEach((rep) => {
        if (rep.value !== 0)
          lessons.push({
            lessonId: rep.luid,
            target: rep.value,
          });
      });
      program = {lessons};
    } else if (currentType.current === 'weekly') {
      var days = [];

      items.forEach((gi) => {
        var lessons = [];
        gi.representers.forEach((rep) => {
          if (rep.value !== 0)
            lessons.push({
              lessonId: rep.luid,
              target: rep.value,
            });
        });
        days.push({day: gi.key, lessons});
      });
      program = {days};
    }

    let apiep = 'ss/sdb/plans/program/' + currentType.current + '/set';
    authorizedRequest(apiep, {plan_id: plan.plan_id, program})
      .then((response) => navigation.goBack())
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  /** Helper functions */
  const changeVisibilityForGroupWithKey = (key) => {
    let current = [...items];
    current.forEach((gi, i) => {
      if (gi.key === key) gi.hideItems = !gi.hideItems;
      else gi.hideItems = true;
    });
    setItems(current);
  };

  const updateRepresenterValue = (newValue) => {
    inputRef.current.value = newValue;
    setShowInput(false);
    setItems(items);
  };

  return (
    <ScrollView>
      <ProgramSelectSheet
        refs={programSheet}
        selected={(type) => {
          if (type === 'fixed') setupFixed();
          else if (type === 'daily') setupDaily();
          else setupWeekly();
          programSheet.current.close();
        }}
      />
      <InputDialog
        title="Hedef Soru"
        visible={showInput}
        confirm={(val) => {
          updateRepresenterValue(val);
        }}
        dismiss={() => setShowInput(false)}
      />
      <TouchableOpacity
        onPress={() => programSheet.current.open()}
        style={{
          backgroundColor: '#A8DEFF',
          padding: 6,
          margin: 12,
          borderRadius: 20,
          flexDirection: 'row',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
          }}>
          <Image
            source={require('../assets/arrow.png')}
            style={{width: 30, height: 30}}
            resizeMode="contain"
          />
        </View>

        <View style={{alignSelf: 'center', marginStart: 12}}>
          <Text style={{fontSize: 16, color: '#003351'}}>Program Türü</Text>
          <Text style={{fontSize: 14, color: '#003351'}}>
            {typeText ?? 'Seçmek için dokunun'}
          </Text>
        </View>
      </TouchableOpacity>

      {items && (
        <View style={{margin: 12, overflow: 'hidden', borderRadius: 12}}>
          {navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  commitProgram();
                }}
                style={{
                  height: '100%',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  style={{
                    alignSelf: 'center',
                    marginBottom: 9,
                    paddingEnd: 12,
                    paddingStart: 9,
                  }}
                  name="save"
                  color={'black'}
                  size={26}
                />
              </TouchableOpacity>
            ),
          })}

          {items.map((groupItem) => (
            <View>
              {groupItem.drawHeader && (
                <TouchableOpacity
                  key={groupItem.key}
                  onPress={() => changeVisibilityForGroupWithKey(groupItem.key)}
                  style={{padding: 12, backgroundColor: '#A8DEFF'}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {groupItem.headerTitle}
                  </Text>
                </TouchableOpacity>
              )}
              {!groupItem.hideItems &&
                groupItem.representers.map((rep, ri) => (
                  <TouchChoose
                    title={rep.text}
                    value={rep.value}
                    backColor={'#fff'}
                    action={() => {
                      inputRef.current = rep;
                      setShowInput(true);
                    }}
                  />
                ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default StudyProgram;
