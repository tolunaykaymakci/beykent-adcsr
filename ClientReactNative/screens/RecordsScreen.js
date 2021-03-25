import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableHighlight,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';

import {GlobalStyles, GlobalColors} from '../src/GlobalStyles';
import {authorizedRequest} from '../Service';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function App({route, navigation}) {
  const [activeTab, setActiveTab] = useState(0);
  const [recordData, setRecordsData] = useState();
  const {planId} = route.params;

  const [listData, setListData] = useState([]);

  var last = Number.MAX_SAFE_INTEGER;

  const Item = ({title}) => (
    <TouchableOpacity
      onPress={() => alert('poncik!')}
      style={{
        backgroundColor: '#fff',
        height: 64,
        flexDirection: 'row',
      }}>
      <MaterialCommunityIcons
        style={{alignSelf: 'center'}}
        name="border-color"
        color={'rgb(171,180,190)'}
        size={24}
      />

      <View style={{alignSelf: 'center'}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>Ders Konusu</Text>
        <Text style={styles.title}>
          {126} soru, {6} test
        </Text>
      </View>

      <View style={{position: 'absolute', right: 0, alignSelf: 'center'}}>
        <MaterialCommunityIcons
          name="border-color"
          color={'rgb(171,180,190)'}
          size={24}
        />
      </View>
    </TouchableOpacity>
  );

  useLayoutEffect(() => {
    last = Number.MAX_SAFE_INTEGER;
    setListData({});
    requestItems();
  }, []);

  const requestItems = () => {
    if (activeTab == 0) {
      requestQuestionItems();
    } else {
      // requestStudyItems();
    }
  };

  const requestQuestionItems = () => {
    authorizedRequest('api/records/questions', {
      mode: 'continuous',
      plan: planId,
      last: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => response.json())
      .then((json) => {
        var DATA = [...listData];

        json.question_records.forEach((x, i) => {
          let recDate = x.rec_date.split(' ')[0];

          var found = false;
          for (var i = 0; i != DATA.length; i++)
            if (DATA[i].title == recDate) {
              found = true;
              DATA[i].data.push(x.lesson_name);
              break;
            }

          if (!found)
            DATA.push({
              title: x.rec_date.split(' ')[0],
              data: [x.lesson_name],
            });
        });

        setListData(DATA);
        setRecordsData(json.question_records);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  const changeMode = (mode) => {
    if (mode === 'q' && activeTab !== 0) {
      setActiveTab(0);
      last = Number.MAX_SAFE_INTEGER;
      setListData({});
      requestItems();
    } else if (mode === 's' && activeTab !== 1) {
      setActiveTab(1);
      last = Number.MAX_SAFE_INTEGER;
      setListData({});
      requestItems();
    }
  };

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
            SORULARIM
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
            ÇALIŞMALARIM
          </Text>
        </TouchableHighlight>
      </View>
      {activeTab == 0 ? (
        <View>
          {recordData == null ? (
            <Text>Yükleniyor...</Text>
          ) : (
            recordData.map((record) => (
              <SectionList
                sections={listData}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item title={item} />}
                renderSectionHeader={({section: {title}}) => (
                  <Text style={styles.header}>{title}</Text>
                )}
              />
            ))
          )}
        </View>
      ) : (
        <View>
          <Text>Konular modu</Text>
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
    borderTopColor: '#dedede',
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
    borderTopColor: '#dedede',
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
