import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SectionList,
  ScrollView,
} from 'react-native';

import {WebView} from 'react-native-webview';
import * as Progress from 'react-native-progress';

import {GlobalStyles, GlobalColors} from '../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {authorizedRequest} from '../Service';

const QuestionReportLesson = ({rlesson, nav}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        nav.navigate('ReportItemDetails', {
          initMode: -1,
        })
      }
      style={{
        flexDirection: 'row',
      }}>
      <View style={{width: 25, backgroundColor: 'red', height: '100%'}}>
        <MaterialCommunityIcons
          style={{marginTop: 16, marginStart: 5}}
          name="ember"
          color={'rgb(255,255,255)'}
          size={14}
        />
      </View>

      <View
        style={{
          flex: 0.65,
          paddingTop: 9,
          paddingBottom: 9,
          overflow: 'hidden',
          paddingStart: 4,
          paddingEnd: 4,
        }}>
        <Text style={{fontWeight: 'bold', marginStart: 3}}>{rlesson.name}</Text>

        <View style={{flexDirection: 'row', marginStart: 3}}>
          <MaterialCommunityIcons
            style={{alignSelf: 'center'}}
            name="timer"
            color={'rgb(58,79,101)'}
            size={12.5}
          />
          <Text>{rlesson.subjects.length} konu</Text>
          <MaterialCommunityIcons
            style={{alignSelf: 'center', marginStart: 6}}
            name="timer"
            color={'rgb(58,79,101)'}
            size={12.5}
          />
          <Text>{rlesson.test_count} test</Text>
        </View>
      </View>

      <View
        style={{
          flex: 0.35,
          paddingTop: 9,
          paddingBottom: 9,
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            {rlesson.solved}
          </Text>

          <Text
            style={{
              alignSelf: 'center',
              fontSize: 15,
              marginStart: 4,
              marginEnd: 2,
            }}>
            SORU
          </Text>

          <MaterialCommunityIcons
            style={{alignSelf: 'center'}}
            name="chevron-right"
            color={'rgb(58,79,101)'}
            size={22}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Item = ({title, nav}) => (
  <TouchableOpacity
    onPress={() =>
      nav.navigate('RecordDetails', {
        initMode: -1,
      })
    }
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

function App({route, navigation}) {
  const {planId} = route.params;
  const [report, setReport] = useState();
  const [records, setRecords] = useState();
  const [recordList, setRecordList] = useState([]);
  const [graphData, setGraphData] = useState();

  useEffect(() => {
    const recDate = '2021-03-18';

    /* Request questions report */
    authorizedRequest('api/reports/questions', {
      date: recDate,
      mode: 'daily',
      plan: planId,
    })
      .then((response) => response.json())
      .then((json) => {
        setReport(json);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    /* Request questions graph data */
    authorizedRequest('api/reports/graph/questions', {
      seek: recDate,
      mode: 'daily',
      plan: planId,
    })
      .then((response) => response.json())
      .then((json) => {
        // Make graph data
        var labelTexts = [];
        var dataValues = [];

        json.graph.forEach((gi, index) => {
          labelTexts[index] = gi.frontText;
          dataValues[index] = gi.value;
        });

        setGraphData({
          labels: labelTexts,
          datasets: [
            {
              data: dataValues,
            },
          ],
        });
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    /* Request questions records */
    authorizedRequest('api/records/questions', {
      mode: 'range',
      plan: planId,
      start: recDate,
      end: recDate,
    })
      .then((response) => response.json())
      .then((json) => {
        var DATA = [...recordList];

        json.rec_packs.forEach((x, i) => {
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

        setRecordList(DATA);
        setRecords(json.rec_packs);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View>
        <ScrollView>
          <View style={{backgroundColor: '#fff'}}>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text style={{padding: 8, color: GlobalColors.titleText}}>
                Günlük
              </Text>
              <Text style={{padding: 8, color: GlobalColors.titleText}}>
                Haftalık
              </Text>
              <Text style={{padding: 8, color: GlobalColors.titleText}}>
                Aylık
              </Text>
            </View>

            <View
              style={{
                height: 148,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  height: 148,
                  width: 42,
                }}>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginTop: 60}}
                  name="chevron-left"
                  color={'rgb(58,79,101)'}
                  size={25}
                />
              </TouchableOpacity>

              <View style={{height: 148, flex: 1}}>
                <WebView
                  style={{
                    flex: 1,
                    height: '100%',
                    marginStart: -6,
                    marginEnd: -6,
                    marginTop: 12,
                  }}
                  source={{uri: 'http://192.168.1.104:5000/grpfr'}}
                  scalesPageToFit={true}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                />

                {/* <LineChart
                data={
                  graphData == null
                    ? {
                        labels: ['January'],
                        datasets: [
                          {
                            data: [Math.random() * 100],
                          },
                        ],
                      }
                    : graphData
                }
                width={270} // from react-native
                height={136}
                withInnerLines={false}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(52, 106, 172, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(36, 36, 36, ${opacity})`,
                  style: {
                    borderRadius: 4,
                  },
                  propsForDots: {
                    r: '2',
                    strokeWidth: '3',
                    stroke: 'rgba(52, 106, 172, .6)',
                    fill: 'rgba(52, 106, 172, .9)',
                  },
                }}
                style={{
                  backgroundColor: 'red',
                  marginVertical: 4,
                  marginStart: -18,
                  borderRadius: 16,
                }}
              /> */}
              </View>

              <TouchableOpacity
                style={{
                  height: 148,
                  width: 42,
                }}>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginTop: 60}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={25}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 40,
                flexDirection: 'row',
              }}>
              <View style={{height: 40, flex: 1}}>
                <Text style={{marginStart: 12, marginTop: 11}}>
                  {report == null ? 'Yükleniyor' : report.date_string}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 42,
                }}>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginTop: 6}}
                  name="chevron-left"
                  color={'rgb(58,79,101)'}
                  size={25}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 42,
                }}>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginTop: 6}}
                  name="chevron-right"
                  color={'rgb(58,79,101)'}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Graph 

        <View>
          <LineChart
            data={
              graphData == null
                ? {
                    labels: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                    ],
                    datasets: [
                      {
                        data: [
                          Math.random() * 100,
                          Math.random() * 100,
                          Math.random() * 100,
                          Math.random() * 100,
                          Math.random() * 100,
                          Math.random() * 100,
                        ],
                      },
                    ],
                  }
                : graphData
            }
            width={Dimensions.get('window').width} // from react-native
            height={180}
            withInnerLines={false}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(52, 106, 172, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(36, 36, 36, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '4',
                stroke: 'rgba(52, 106, 172, .6)',
                fill: 'rgba(52, 106, 172, .9)',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

*/}

          {/* Report Related Elements */}

          {report == null ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{...GlobalStyles.primaryCard, width: 48, height: 48}}>
                <Progress.Circle
                  style={{
                    position: 'absolute',
                    margin: 12,
                    bottom: 0,
                  }}
                  thickness={40}
                  size={24}
                  indeterminate={true}
                />
              </View>
            </View>
          ) : (
            <View>
              {/* Dashboard */}
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginStart: 4,
                    marginEnd: 4,
                  }}>
                  {report.solved}
                </Text>
                <Text style={{fontSize: 16, alignSelf: 'center'}}>SORU</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 5,
                  marginBottom: 6,
                }}>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center'}}
                  name="timer"
                  color={'rgb(58,79,101)'}
                  size={13}
                />
                <Text>{report.lessons.length} ders</Text>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginStart: 12}}
                  name="timer"
                  color={'rgb(58,79,101)'}
                  size={13}
                />
                <Text>{report.count_subject} konu</Text>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginStart: 12}}
                  name="timer"
                  color={'rgb(58,79,101)'}
                  size={13}
                />
                <Text>{report.count_test} test</Text>
              </View>

              {/* Lesson Distributions */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  marginTop: 12,
                  padding: 0,
                  height: 'auto',
                }}
                onPress={() => nav.navigate('QuestionsReport')}>
                <Text
                  style={{
                    ...GlobalStyles.cardTitleText,
                    padding: 12,
                  }}>
                  Derslere Dağılım
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 11,
                    marginEnd: 6,
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Text style={{alignSelf: 'center', fontSize: 13}}>
                    DERSLER VE KONULAR
                  </Text>

                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    name="chevron-down"
                    color={'rgb(58,79,101)'}
                    size={22}
                  />
                </View>

                {report.lessons.length === 0 ? (
                  <View
                    style={{
                      marginTop: 28,
                      marginBottom: 16,
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'cyan',
                        width: 72,
                        height: 72,
                        alignSelf: 'center',
                        marginBottom: 6,
                        borderRadius: 36,
                      }}></View>

                    <Text style={{fontWeight: 'bold'}}>
                      Henüz soru çözümü eklenmemiş
                    </Text>
                    <Text style={{marginBottom: 12}}>
                      Şimdi eklemek için +'ya dokunun
                    </Text>
                  </View>
                ) : (
                  <View>
                    {report.lessons.map((rlesson, rli) => (
                      <QuestionReportLesson
                        rlesson={rlesson}
                        nav={navigation}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* Study Program */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  marginTop: 6,
                  height: 'auto',
                }}
                onPress={() => nav.navigate('QuestionsReport')}>
                <Text style={GlobalStyles.cardTitleText}>Ders Programı</Text>
                <Text style={GlobalStyles.subText}>$studyProgramType</Text>

                <View style={{flex: 1, flexDirection: 'row', marginTop: 12}}>
                  <View
                    style={{
                      width: 120,
                      height: 90,
                    }}>
                    <Text>perc</Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, height: 45}}>
                        <Text>Hedef</Text>
                        <Text>0</Text>
                      </View>
                      <View style={{flex: 1, height: 45}}>
                        <Text>Çözüm</Text>
                        <Text>0</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, height: 45}}>
                        <Text>Kalan</Text>
                        <Text>0</Text>
                      </View>
                      <View style={{flex: 1, height: 45}}>
                        <Text>Yüzde</Text>
                        <Text>XX%</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    name="chevron-right"
                    color={'rgb(58,79,101)'}
                    size={22}
                  />

                  <Text style={{alignSelf: 'center', fontSize: 13}}>
                    DERSLERİ GÖSTER
                  </Text>
                </View>
              </View>

              {/* Correct, Wrong & Empty Analyze */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  marginTop: 6,
                  height: 'auto',
                }}
                onPress={() => nav.navigate('QuestionsReport')}>
                <Text style={GlobalStyles.cardTitleText}>
                  Doğru/Yanlış Analizi
                </Text>
                <Text style={GlobalStyles.subText}>
                  Soruların Yüzde Dağılımı
                </Text>

                <View style={{flex: 1, flexDirection: 'row', marginTop: 12}}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, height: 45}}>
                        <Text>DOĞRU SORU</Text>
                        <Text>150 SORU (%15)</Text>
                      </View>
                      <View style={{flex: 1, height: 45}}>
                        <Text>YANLIŞ SORU</Text>
                        <Text>150 SORU (%15)</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, height: 45}}>
                        <Text>BOŞ SORU</Text>
                        <Text>150 SORU (%15)</Text>
                      </View>
                      <View style={{flex: 1, height: 45}}>
                        <Text>DİĞERLERİ</Text>
                        <Text>150 SORU (%15)</Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: 120,
                      height: 90,
                    }}>
                    <Text>perc</Text>
                  </View>
                </View>
              </View>

              {/* Records */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  marginTop: 12,
                  height: 'auto',
                }}
                onPress={() => nav.navigate('QuestionsReport')}>
                <Text style={GlobalStyles.cardTitleText}>Kayıtlarım</Text>
                <Text style={GlobalStyles.subText}>
                  Gün Saatlerine Dağılımı
                </Text>

                {/* Records Graph */}
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    marginTop: 8,
                    backgroundColor: 'red',
                  }}></View>

                {/* Records List Display */}

                {records == null ? (
                  <Text>Yükleniyor...</Text>
                ) : (
                  records.map((record) => (
                    <SectionList
                      sections={recordList}
                      keyExtractor={(item, index) => item + index}
                      renderItem={({item}) => (
                        <Item title={item} nav={navigation} />
                      )}
                      renderSectionHeader={({section: {title}}) => (
                        <Text style={styles.header}>{title}</Text>
                      )}
                    />
                  ))
                )}
              </View>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate('ManQuestions', {})}
          style={{
            backgroundColor: 'rgba(52, 106, 172, 1)',
            width: 64,
            borderRadius: 32,
            height: 64,
            shadowOpacity: 0.43,
            shadowRadius: 2.62,
            elevation: 1,
            position: 'absolute',
            alignItems: 'center',
            bottom: 0,
            right: 0,
            margin: 16,
          }}>
          <MaterialIcons
            style={{alignSelf: 'center', marginTop: 15}}
            name="add"
            color={'rgb(255,255,255)'}
            size={32}
          />
        </TouchableOpacity>
      </View>
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
