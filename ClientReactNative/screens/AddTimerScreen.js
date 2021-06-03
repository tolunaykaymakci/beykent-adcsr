import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TextInput,
  Pressable,
  Button,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {GlobalStyles, GlobalColors} from '../src/GlobalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {authorizedRequest, getRequest} from '../Service';

import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';

const DateSelectSheet = ({refs}) => {
  const [date, setDate] = useState(new Date());
  const [shadow, setShadow] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}>
      <Modal
        animationType="none"
        transparent={true}
        visible={shadow}
        onRequestClose={() => {
          setShadow(false);
        }}>
        <Pressable
          onPress={() => alert('eat shit')}
          style={{
            width: '100%',
            backgroundColor: 'rgba(0,0,0,.3)',
            height: '100%',
          }}></Pressable>
      </Modal>

      <RBSheet
        ref={refs}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onOpen={() => setShadow(true)}
        onClose={() => setShadow(false)}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <DatePicker
          date={date}
          onDateChange={setDate}
          androidVariant="nativeAndroid"
        />
      </RBSheet>
    </View>
  );
};

function App({route, navigation}) {
  const [activeTab, setActiveTab] = useState(0);
  const [knownTimers, setKnownTimers] = useState();
  const dateSheet = useRef();

  useEffect(() => {
    getRequest('ss/sdb/get-known-timers')
      .then((response) => response.json())
      .then((json) => {
        setKnownTimers(json.known_timers);
      })
      .catch((error) => console.error(error));
  }, []);

  function createFromKnownTimers(related) {
    let timer = {
      related: related,
      color: 'blue',
      future: 1,
      done: 0,
      exam: 1,
    };

    authorizedRequest('ss/sdb/timers/create', {timer: timer})
      .then((response) => {
        navigation.goBack(null);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      <View style={{...styles.tabsContainer}}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setActiveTab(0)}
          style={activeTab == 0 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              activeTab == 0
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            SEÇİN
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setActiveTab(1)}
          style={activeTab == 1 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              activeTab == 1
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            YARATIN
          </Text>
        </TouchableHighlight>
      </View>
      {activeTab == 0 ? (
        <ScrollView>
          {knownTimers == null ? (
            <Text>Bir sn..</Text>
          ) : (
            <View>
              {knownTimers.map((t, i) => (
                <TouchableOpacity
                  onPress={() => createFromKnownTimers(t.related)}
                  style={{
                    backgroundColor: '#fff',
                    marginStart: 12,
                    marginEnd: 12,
                    marginTop: 6,
                    marginBottom: 6,
                    padding: 12,
                  }}>
                  <Text>{t.name}</Text>
                  <Text>{t.date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <View>
          <DateSelectSheet refs={dateSheet} />
          <View
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderBottomColor: 'rgba(0,0,0,.1)',
            }}>
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons
                style={{marginStart: 8, marginEnd: 12, alignSelf: 'center'}}
                name="edit"
                color={'rgb(36,36,36)'}
                size={22}
              />
              <View style={{paddingTop: 6, paddingBottom: 6}}>
                <Text style={{fontWeight: 'bold'}}>Sayaç İsmi</Text>
                <TextInput
                  multiline={false}
                  style={{padding: 0}}
                  placeholder="Sayacınıza isim verin"></TextInput>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              dateSheet.current.open();
            }}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderBottomColor: 'rgba(0,0,0,.1)',
            }}>
            <View
              style={{flexDirection: 'row', paddingTop: 6, paddingBottom: 6}}>
              <MaterialIcons
                style={{marginStart: 8, marginEnd: 12, alignSelf: 'center'}}
                name="date-range"
                color={'rgb(36,36,36)'}
                size={22}
              />
              <View>
                <Text style={{fontWeight: 'bold'}}>Tarih</Text>
                <Text>Seçmek için dokunun</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderBottomColor: 'rgba(0,0,0,.1)',
            }}>
            <View
              style={{flexDirection: 'row', paddingTop: 6, paddingBottom: 6}}>
              <MaterialIcons
                style={{marginStart: 8, marginEnd: 12, alignSelf: 'center'}}
                name="access-time"
                color={'rgb(36,36,36)'}
                size={22}
              />
              <View>
                <Text style={{fontWeight: 'bold'}}>Saat</Text>
                <Text>Seçmek için dokunun</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderBottomColor: 'rgba(0,0,0,.1)',
            }}>
            <View
              style={{flexDirection: 'row', paddingTop: 6, paddingBottom: 6}}>
              <MaterialIcons
                style={{marginStart: 8, marginEnd: 12, alignSelf: 'center'}}
                name="format-paint"
                color={'rgb(36,36,36)'}
                size={22}
              />
              <View>
                <Text style={{fontWeight: 'bold'}}>Renk</Text>
                <Text>Seçmek için dokunun</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    backgroundColor: 'white',
    height: 46,
    alignItems: 'center',
    borderBottomColor: '#dedede',
    borderBottomWidth: 0.8,
    borderTopColor: '#fff',
    borderTopWidth: 0.8,
    justifyContent: 'center',
  },
  tabButtonSelected: {
    flex: 1,
    backgroundColor: 'white',
    height: 46,
    alignItems: 'center',
    borderBottomColor: '#dedede',
    borderBottomWidth: 0.6,
    borderTopColor: '#fff',
    borderTopWidth: 0.6,
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 13.75,
    fontWeight: 'bold',
    color: '#646464',
  },
  tabButtonTextSelected: {
    fontSize: 13.75,
    fontWeight: 'bold',
    color: '#5670a3',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 12,
  },
});
export default App;
