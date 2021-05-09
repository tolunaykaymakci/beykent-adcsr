// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/
import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Text,
  Button,
  SafeAreaView,
} from 'react-native';

import * as Progress from 'react-native-progress';
import {GlobalStyles, GlobalColors} from '../../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WebView} from 'react-native-webview';

import {authorizedRequest, getAuthToken} from '../../Service';
import moment from 'moment';

const HomeScreen = ({navigation}) => {
  /*
    HOME_MODE 0 => TODAYS SUMMARY,
    HOME_MODE 1 => TIMERS,
    HOME_MODE 2 => FRIENDS
  */
  const [homeMode, setHomeMode] = useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
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
            name="people"
            color={'white'}
            size={26}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <HomeSummaryScreen nav={navigation} />
    </SafeAreaView>
  );
};

const HomeSummaryScreen = ({nav}) => {
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingQReports, setLoadingQReports] = useState(true);
  const [loadingSReports, setLoadingSReports] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingTimers, setLoadingTimers] = useState(true);

  const [mainReport, setMainReport] = useState();
  const [qReportData, setQReportData] = useState();
  const [sReportData, setSReportData] = useState();
  const [recordsData, setRecordsData] = useState();
  const [timersData, setTimersData] = useState();

  const [planExists, setPlanExists] = useState(false);

  const quesGraph = useRef();
  const studGraph = useRef();
  const momentDate = useRef(moment(Date.now()));

  const makeQGraphRequestJs = (date, pid) => {
    return `req('${getAuthToken()}', 'questions', 'daily',
     ${pid}, '${date}')`;
  };

  const makeSGraphRequestJs = (date, pid) => {
    return `req('${getAuthToken()}', 'studies', 'daily',
     ${pid}, '${date}')`;
  };

  useLayoutEffect(() => {
    authorizedRequest('api/app/home/', {})
      .then((response) => response.json())
      .then((json) => {
        setMainReport(json);
        setLoadingMain(false);

        if (json.plan_exists) requestSubModules(json.plan.plan_id);
        setPlanExists(json.plan_exists);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  const requestSubModules = (planId) => {
    momentDate.current = moment(new Date('2021-04-10'));
    var repDateStr = momentDate.current.format('yyyy-MM-DD');

    authorizedRequest('api/app/home/ques', {})
      .then((response) => response.json())
      .then((json) => {
        let jsFunc = makeQGraphRequestJs(repDateStr, planId);
        quesGraph.current.injectJavaScript('disableHighlights()');
        quesGraph.current.injectJavaScript(jsFunc);
        setQReportData(json);
        setLoadingQReports(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('api/app/home/stud', {})
      .then((response) => response.json())
      .then((json) => {
        let jsFunc = makeSGraphRequestJs(repDateStr, planId);
        studGraph.current.injectJavaScript('disableHighlights()');
        studGraph.current.injectJavaScript(jsFunc);

        setSReportData(json);
        setLoadingSReports(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('api/app/home/recs', {})
      .then((response) => response.json())
      .then((json) => {
        setRecordsData(json);
        setLoadingRecords(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('api/app/home/timr', {})
      .then((response) => response.json())
      .then((json) => {
        setTimersData(json);
        setLoadingTimers(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  };

  return (
    <View style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      {loadingMain ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{...GlobalStyles.primaryCard, width: 48, height: 48}}>
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
        <ScrollView style={{flex: 1, marginStart: 0, marginEnd: 0}}>
          {/* <Button
            title="Test WebView"
            onPress={() => nav.navigate('TestScreen', {})}></Button> */}

          {/* Navigation menu */}
          <View style={{flexDirection: 'row', marginTop: 12}}>
            <TouchableOpacity
              style={styles.navMenuButtonLeft}
              onPress={() => nav.navigate('Plans')}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="clipboard-text"
                color={'rgb(58,79,101)'}
                size={22}
              />

              <Text style={styles.navMenuLabel}>Çalışma Planlarım</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navMenuButtonRight}
              onPress={() => nav.navigate('Friends')}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="account-group"
                color={'rgb(58,79,101)'}
                size={22}
              />

              <Text style={styles.navMenuLabel}>Arkadaşlarım</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.navMenuButtonLeft}
              onPress={() => nav.navigate('Guide')}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="segment"
                color={'rgb(58,79,101)'}
                size={22}
              />

              <Text style={styles.navMenuLabel}>Puanlar & Tercih</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navMenuButtonRight}
              onPress={() => nav.navigate('Timers')}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="timer"
                color={'rgb(58,79,101)'}
                size={22}
              />

              <Text style={styles.navMenuLabel}>Sayaçlarım</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.navMenuButtonLeft}
              onPress={() =>
                nav.navigate('SettingsStack', {screen: 'Settings'})
              }>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="cog"
                color={'rgb(58,79,101)'}
                size={22}
              />

              <Text style={styles.navMenuLabel}>Ayarlarım</Text>
            </TouchableOpacity>

            <View
              style={{
                ...styles.navMenuButtonRight,
                backgroundColor: 'transparent',
                opacity: 0,
              }}
              onPress={() =>
                nav.navigate('Records', {planId: mainReport.plan.plan_id})
              }></View>
          </View>

          {!planExists ? (
            <Text>Çalışma Planı Yok</Text>
          ) : (
            <>
              {/* User Study Plans Strip */}
              <ScrollView
                horizontal={true}
                style={{marginTop: 6}}
                showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection: 'row', marginStart: 12}}>
                  <Text
                    style={{
                      ...GlobalStyles.titleText,
                      paddingTop: 12,
                      paddingBottom: 6,
                      marginStart: 6,
                      marginEnd: 6,
                      fontSize: 15.75,
                      fontWeight: 'bold',
                    }}>
                    {mainReport.plan.name}
                  </Text>
                  {mainReport.plans.map((plan) =>
                    plan.name == mainReport.plan.name ? (
                      <></>
                    ) : (
                      <Text
                        style={{
                          ...GlobalStyles.subText,
                          paddingTop: 12,
                          paddingBottom: 6,
                          marginStart: 6,
                          marginEnd: 6,
                          opacity: 0.6,
                          fontSize: 15.75,
                          fontWeight: 'bold',
                        }}>
                        {plan.name}
                      </Text>
                    ),
                  )}
                </View>
              </ScrollView>

              {/* Questions Report Card */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  ...GlobalStyles.homeCard,
                  height: 'auto',
                }}>
                <Text style={GlobalStyles.cardTitleText}>Soru Çözümlerim</Text>

                <TouchableOpacity
                  onPress={() =>
                    nav.navigate('QuestionsReport', {
                      planId: mainReport.plan.plan_id,
                    })
                  }
                  style={{
                    flexDirection: 'row',
                    marginTop: 12,
                    marginEnd: 5,
                    borderColor: '#30457a',
                    borderRadius: 12,
                    borderWidth: 1,
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Text
                    style={{alignSelf: 'center', marginLeft: 9, fontSize: 13}}>
                    BUGÜN
                  </Text>

                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    name="chevron-right"
                    color={'rgba(58,79,101,0)'}
                    size={24}
                  />
                </TouchableOpacity>

                {loadingQReports ? (
                  <View
                    style={{
                      ...GlobalStyles.primaryCard,
                      width: 48,
                      height: 48,
                      position: 'absolute',
                      marginTop: 120,
                      alignSelf: 'center',
                    }}>
                    <Progress.Circle
                      thickness={40}
                      size={24}
                      indeterminate={true}
                    />
                  </View>
                ) : null}

                <View
                  style={{
                    marginTop: 12,
                    opacity: loadingQReports ? 0 : 1,
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 12,
                    }}>
                    <Text style={{fontSize: 16, color: GlobalColors.titleText}}>
                      Bugün
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginStart: 4,
                        marginEnd: 4,
                        color: GlobalColors.titleText,
                      }}>
                      310
                    </Text>
                    <Text style={{fontSize: 16, color: GlobalColors.titleText}}>
                      soru çözüldü
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 5,
                    }}>
                    <MaterialIcons
                      style={{alignSelf: 'center', marginEnd: 3}}
                      name="gesture"
                      color={'rgb(58,79,101)'}
                      size={17}
                    />
                    <Text>1 ders</Text>
                    <MaterialIcons
                      style={{
                        alignSelf: 'center',
                        marginStart: 12,
                        marginEnd: 3,
                      }}
                      name="library-books"
                      color={'rgb(58,79,101)'}
                      size={17}
                    />
                    <Text>1 konu</Text>
                    <MaterialIcons
                      style={{
                        alignSelf: 'center',
                        marginStart: 12,
                        marginEnd: 3,
                      }}
                      name="insert-drive-file"
                      color={'rgb(58,79,101)'}
                      size={17}
                    />
                    <Text>4 test</Text>
                  </View>

                  {/* Questions Graph */}
                  <WebView
                    ref={quesGraph}
                    style={{
                      flex: 1,
                      height: 134,
                      marginTop: 8,
                      marginStart: 12,
                      marginEnd: 12,
                    }}
                    source={{uri: 'grpfr'}}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                  />

                  {/* Questions Study Program */}
                  <View
                    style={{
                      height: 40,
                      display: 'none',
                      width: '100%',
                      marginTop: 8,
                      backgroundColor: 'blue',
                    }}></View>

                  {/* Test UI */}
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      margin: -12,
                      marginTop: 6,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        nav.navigate('QuestionsReport', {
                          planId: mainReport.plan.plan_id,
                        })
                      }
                      style={{
                        backgroundColor: 'rgba(42, 96, 168, .85)',
                        flex: 1,
                        height: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 16, color: 'white'}}>
                        Tüm Çözümlerim
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        nav.navigate('ManQuestions', {
                          initDate: moment().format('yyyy-MM-DD'),
                        });
                      }}
                      style={{
                        backgroundColor: 'rgba(52, 106, 172, 1)',
                        flex: 1,
                        height: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 16, color: 'white'}}>
                        Soru Ekle
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Studies Report Card */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  ...GlobalStyles.homeCard,
                  height: 'auto',
                }}>
                <Text style={GlobalStyles.cardTitleText}>
                  Konu Çalışmalarım
                </Text>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 12,
                    marginEnd: 5,
                    borderColor: '#30457a',
                    borderRadius: 12,
                    borderWidth: 1,
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Text
                    style={{alignSelf: 'center', marginLeft: 9, fontSize: 13}}>
                    BUGÜN
                  </Text>

                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    name="chevron-right"
                    color={'rgba(58,79,101,0)'}
                    size={24}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: 12,
                  }}>
                  <Text style={{fontSize: 16, color: GlobalColors.titleText}}>
                    Bugün
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginStart: 4,
                      marginEnd: 4,
                      color: GlobalColors.titleText,
                    }}>
                    {sReportData != null ? sReportData.sts : null}
                  </Text>
                  <Text style={{fontSize: 16, color: GlobalColors.titleText}}>
                    dakika çalışıldı
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginEnd: 3}}
                    name="gesture"
                    color={'rgb(58,79,101)'}
                    size={17}
                  />
                  <Text>
                    {' '}
                    {sReportData != null ? sReportData.slc : null} ders
                  </Text>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginStart: 12, marginEnd: 3}}
                    name="library-books"
                    color={'rgb(58,79,101)'}
                    size={17}
                  />
                  <Text>
                    {' '}
                    {sReportData != null ? sReportData.ssc : null} konu
                  </Text>
                </View>

                {/* Studies Report Graph */}
                <View
                  style={{
                    height: 134,
                    width: '100%',
                    marginTop: 8,
                  }}>
                  <WebView
                    ref={studGraph}
                    style={{
                      flex: 1,
                      height: '100%',
                      marginStart: 12,
                      marginEnd: 12,
                    }}
                    source={{uri: 'grpfr'}}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                </View>

                {/* Test UI */}
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    margin: -12,
                    marginTop: 6,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      nav.navigate('StudiesReport', {
                        planId: mainReport.plan.plan_id,
                      })
                    }
                    style={{
                      backgroundColor: 'rgba(245, 131, 105, .85)',
                      flex: 1,
                      height: 44,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 16, color: 'white'}}>
                      Tüm Çalışmalarım
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => nav.navigate('ManStudy')}
                    style={{
                      backgroundColor: 'rgba(245, 131, 105, 1)',
                      flex: 1,
                      height: 44,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 16, color: 'white'}}>
                      Çalışma Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    ...GlobalStyles.primaryCard,
                    ...GlobalStyles.homeCard,
                    marginEnd: 6,
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                  onPress={() =>
                    nav.navigate('PlanDetails', {
                      planId: mainReport.plan.plan_id,
                    })
                  }>
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center', marginTop: 14}}
                    name="clipboard-text"
                    color={'rgb(58,79,101)'}
                    size={26}
                  />

                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 4,
                      marginBottom: 14,
                    }}>
                    Planım
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...GlobalStyles.primaryCard,
                    ...GlobalStyles.homeCard,
                    marginStart: 3,
                    marginEnd: 3,
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                  onPress={() =>
                    nav.navigate('Records', {planId: mainReport.plan.plan_id})
                  }>
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center', marginTop: 14}}
                    name="file-document"
                    color={'rgb(58,79,101)'}
                    size={26}
                  />

                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 4,
                      marginBottom: 14,
                    }}>
                    Kayıtlarım
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...GlobalStyles.primaryCard,
                    ...GlobalStyles.homeCard,
                    marginStart: 6,
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                  onPress={() => nav.navigate('Statistics')}>
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center', marginTop: 14}}
                    name="graph"
                    color={'rgb(58,79,101)'}
                    size={26}
                  />

                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 4,
                      marginBottom: 14,
                    }}>
                    İstatistikler
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* User Timers */}
          {loadingTimers ? (
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
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: 'bold',
                  marginStart: 16,
                  marginTop: 6,
                  marginBottom: 6,
                  color: 'rgb(105, 105, 107)',
                }}>
                SAYAÇLARIM
              </Text>

              <FlatList
                ItemSeparatorComponent={
                  Platform.OS !== 'android' &&
                  (({highlighted}) => (
                    <View
                      style={[style.separator, highlighted && {marginLeft: 0}]}
                    />
                  ))
                }
                style={{marginStart: 6, marginEnd: 6}}
                data={timersData.timers}
                numColumns={2}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    key={item.timer_id}
                    style={{
                      flex: 1,
                      ...GlobalStyles.primaryCard,
                      marginEnd: 6,
                      marginStart: 6,
                      backgroundColor: GlobalColors.windowBackground,
                      height: 102,
                    }}
                    onPress={() => this._onPress(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <View>
                      <Text>{item.name}</Text>
                    </View>
                  </TouchableHighlight>
                )}
              />
            </View>
          )}

          {/* Home Footer */}

          <Text style={{fontSize: 21, marginTop: 24, alignSelf: 'center'}}>
            ADCSR
          </Text>

          <Text
            style={{
              fontSize: 14,
              marginTop: 3,
              marginBottom: 12,
              alignSelf: 'center',
            }}>
            Uygulama Sürümü
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    backgroundColor: '#DDDDDD',
    padding: 12,
    height: 102,
    flex: 1,
    marginTop: 6,
    marginStart: 12,
    marginEnd: 12,
    borderRadius: 9,
    marginBottom: 6,
  },
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
    fontSize: 12.75,
    fontWeight: 'bold',
    color: '#646464',
  },
  tabButtonTextSelected: {
    fontSize: 12.75,
    fontWeight: 'bold',
    color: '#5670a3',
  },
  /* New */
  navMenuButtonLeft: {
    ...GlobalStyles.primaryCard,
    ...GlobalStyles.homeCard,
    flexDirection: 'row',
    height: 50,
    marginTop: 0,
    marginEnd: 3,
  },
  navMenuButtonRight: {
    ...GlobalStyles.primaryCard,
    ...GlobalStyles.homeCard,
    flexDirection: 'row',
    marginTop: 0,
    height: 50,
    marginStart: 3,
  },
  navMenuLabel: {
    alignSelf: 'center',
    marginStart: 5,
    color: GlobalColors.titleText,
  },
});
export default HomeScreen;
