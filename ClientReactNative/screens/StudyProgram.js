import React, {useState, useEffect, useRef} from 'react';
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

import TouchChoose from '../src/components/TouchChoose';

class GroupItem {
  drawHeader = false;
  headerTitle = '';
  key;
  representers = [];
}

class RepresenterItem {
  text;
  value = 0;
}

const StudyProgram = ({route, navigation}) => {
  const [items, setItems] = useState();
  const [plan] = route.params;

  useEffect(() => {}, []);

  const setupFixed = (current) => {
    var fixedGroup = new GroupItem();
    fixedGroup.drawHeader = false;

    var rItem = new RepresenterItem();
    rItem.text = 'Sabit Soru Hedefim';

    if (current) {
      rItem.value = current.target;
    }

    fixedGroup.representers.push(rItem);
    setItems([fixedGroup]);
  };

  const setupDaily = () => {
    var dailyGroup = new GroupItem();
    dailyGroup.drawHeader = false;
    var repItems = dailyGroup.representers;

    plan.lessons.forEach((lesson, li) => {
      var rItem = new RepresenterItem();
      rItem.text = lesson.name;
      repItems.push(rItem);
    });

    setItems([dailyGroup]);
  };

  const setupWeekly = (current) => {
    var weekDays = [
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
      groupItem.key = wd[1];

      var repItems = groupItem.representers;
      plan.lessons.forEach((lesson, li) => {
        var rItem = new RepresenterItem();
        rItem.text = lesson.name;
        repItems.push(rItem);
      });

      groups.push(groupItem);
    });

    setItems(groups);
  };

  return (
    <ScrollView>
      <Button title="fill" onPress={() => setupDaily()} />
      {items && (
        <View>
          {items.map((groupItem, gi) => (
            <View>
              {groupItem.drawHeader && <Text>{groupItem.headerTitle}</Text>}
              {groupItem.representers.map((rep, ri) => (
                <TouchChoose title={rep.text} value={rep.value} />
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default StudyProgram;
/* 
export default class StudyProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      selected: null,
    };
  }

  onHandle = (item) => {
    this.setState({
      selected: item,
      isVisible: false,
    });
  };

  render() {
    const data = [
      {
        id: 1,
        name: 'Sabit Ders Programı',
        name2: 'Her gün için geçerli bir hedef soru sayısı belirleyin.',
      },
      {
        id: 2,
        name: 'Günlük Ders Programı',
        name2:
          'Gün için ulaşmak istediğiniz soru sayısını her ders için belirtin.',
      },
      {
        id: 3,
        name: 'Haftalık Ders Programı',
        name2:
          'Dersler için ulaşmak istediğiniz soru sayısını haftanın her günü için belirtin.',
      },
    ];

    return (
      <View style={{padding: '5%'}}>
        <View
          style={{
            backgroundColor: '#A8DEFF',
            width: '100%',
            height: '31%',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 50,
              height: 50,
              borderRadius: 25,
              right: -5,
              top: 5,
            }}
            onPress={() => this.setState({isVisible: true})}>
            <Image
              source={require('../assest/arrow.png')}
              style={{width: 30, height: 30, right: -10, top: 10}}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={{fontSize: 16, color: '#003351', right: -70, top: -37}}>
            Program Tipi
          </Text>
          <Text style={{fontSize: 14, color: '#003351', right: -70, top: -33}}>
            Seçmek için dokunun.
          </Text>
        </View>

        <Modal visible={this.state.isVisible} transparent={true}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              flex: 1,
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{height: '40%', width: '100%', backgroundColor: 'white'}}>
              <ScrollView>
                {data.map((item, key) => (
                  <TouchableOpacity
                    key={key}
                    style={{
                      width: '100%',
                      height: 90,
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => this.onHandle(item)}>
                    <View
                      style={{
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: '#A8DEFF',
                        width: '90%',
                        height: 60,
                        padding: '3%',
                        borderRadius: 30,
                        elevation: 10,
                      }}>
                      <Text style={{fontSize: 16}}>{item.name}</Text>
                      <Text style={{fontSize: 14, top: 7}}>{item.name2}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
 */
