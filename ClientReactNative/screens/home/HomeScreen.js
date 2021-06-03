// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/
import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  SafeAreaView,
} from 'react-native';

import * as Progress from 'react-native-progress';
import {GlobalStyles, GlobalColors} from '../../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WebView} from 'react-native-webview';

import {authorizedRequest, dump, getAuthToken, makeApiep} from '../../Service';
import moment from 'moment';

const HomeScreen = ({navigation}) => {
  return <HomeSummaryScreen nav={navigation} />;
};

const HomeSummaryScreen = ({nav}) => {
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingQReports, setLoadingQReports] = useState(true);
  const [loadingSReports, setLoadingSReports] = useState(true);

  const [mainReport, setMainReport] = useState();
  const [qReportData, setQReportData] = useState();
  const [sReportData, setSReportData] = useState();

  const [planExists, setPlanExists] = useState(false);

  const quesGraph = useRef();
  const studGraph = useRef();
  const momentDate = useRef(moment(Date.now()));

  const makeQGraphRequestJs = (date, pid) => {
    return `req(${global.user.a_id}, 'questions', 'daily', ${pid}, '${date}', '${global.cred}', '${global.pwd}')`;
  };

  const makeSGraphRequestJs = (date, pid) => {
    return `req(${global.user.a_id}, 'studies', 'daily', ${pid}, '${date}', '${global.cred}', '${global.pwd}')`;
  };

  const requestHome = () => {
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
  };

  useEffect(() => requestHome(), []);

  const requestSubModules = (planId) => {
    momentDate.current = moment();
    var repDateStr = momentDate.current.format('yyyy-MM-DD');

    authorizedRequest('api/app/home/ques', {plan: planId})
      .then((response) => response.json())
      .then((json) => {
        dump(json);
        setQReportData(json);
        setLoadingQReports(false);

        setTimeout(function () {
          let jsFunc = makeQGraphRequestJs(repDateStr, planId);
          quesGraph.current.injectJavaScript('disableHighlights()');
          quesGraph.current.injectJavaScript(jsFunc);
        }, 1000);
      })
      .catch((error) => console.error(error));

    authorizedRequest('api/app/home/stud', {plan: planId})
      .then((response) => response.json())
      .then((json) => {
        setSReportData(json);
        setLoadingSReports(false);

        setTimeout(function () {
          let jsFunc = makeSGraphRequestJs(repDateStr, planId);
          studGraph.current.injectJavaScript('disableHighlights()');
          studGraph.current.injectJavaScript(jsFunc);
        }, 1000);
      })
      .catch((error) => console.error(error));
  };

  const setActivePlan = (planId) => {
    authorizedRequest('ss/a/settings/set', {
      s_key: 'UserActiveStudyPlan',
      s_val: planId.toString(),
      s_type: 'long',
    })
      .then((response) => {
        requestHome();
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      {nav.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => nav.navigate('Plans')}
            style={{
              backgroundColor: GlobalColors.accentColor,
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
              borderTopRightRadius: 21,
              borderBottomRightRadius: 21,
              padding: 8,
              marginRight: 8,
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>Çalışma Planlarım</Text>
          </TouchableOpacity>
        ),
      })}

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
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loadingMain} onRefresh={requestHome} />
          }
          style={{flex: 1, marginStart: 0, marginEnd: 0}}>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <TouchableOpacity
              style={styles.navMenuButtonLeft}
              onPress={() => nav.navigate('Guide')}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="segment"
                color={'rgb(58,79,101)'}
                size={22}
              />

              <Text style={styles.navMenuLabel}>Puan Hesapla</Text>
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

          {!planExists ? (
            <View
              style={{
                height: 160,
                marginStart: 24,
                marginEnd: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Henüz plan yaratılmamış</Text>
              <Text>Çalışmaya başlamak için bir plan oluşturun</Text>
            </View>
          ) : (
            <>
              {/* User Study Plans Strip */}
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection: 'row', marginStart: 12}}>
                  <Text
                    style={{
                      ...GlobalStyles.titleText,
                      paddingTop: 18,
                      paddingBottom: 9,
                      marginStart: 6,
                      marginEnd: 6,
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {mainReport.plan.name}
                  </Text>
                  {mainReport.plans.map((plan) =>
                    plan.name == mainReport.plan.name ? (
                      <></>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setActivePlan(plan.plan_id)}>
                        <Text
                          style={{
                            ...GlobalStyles.subText,
                            paddingTop: 18,
                            paddingBottom: 9,
                            marginStart: 6,
                            marginEnd: 6,
                            opacity: 0.6,
                            fontSize: 15.4,
                          }}>
                          {plan.name}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </ScrollView>

              <View>
                {/* Questions Report Card */}
                <View
                  style={{
                    ...GlobalStyles.primaryCard,
                    ...GlobalStyles.homeCard,
                    height: 'auto',
                  }}>
                  <Text style={GlobalStyles.cardTitleText}>
                    Soru Çözümlerim
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      nav.navigate('Reports', {
                        planId: mainReport.plan.plan_id,
                        mode: 'daily',
                        type: 'questions',
                      })
                    }
                    style={{
                      flexDirection: 'row',
                      marginTop: 12,
                      marginEnd: 5,
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 14,
                      }}>
                      {qReportData
                        ? qReportData.qts +
                          ' SORU, ' +
                          qReportData.qtc +
                          ' TEST'
                        : '...'}
                    </Text>

                    <MaterialCommunityIcons
                      style={{alignSelf: 'center'}}
                      name="chevron-right"
                      color={'rgba(58,79,101,1)'}
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
                    {/* Questions Graph */}
                    <WebView
                      ref={quesGraph}
                      style={{
                        flex: 1,
                        height: 110,
                        marginTop: 8,
                        marginStart: 6,
                        marginEnd: 6,
                      }}
                      source={{uri: makeApiep('grpfr')}}
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
                          nav.navigate('Reports', {
                            planId: mainReport.plan.plan_id,
                            mode: 'daily',
                            type: 'questions',
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
                            planId: mainReport.plan.plan_id,
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
                    onPress={() =>
                      nav.navigate('Reports', {
                        planId: mainReport.plan.plan_id,
                        mode: 'daily',
                        type: 'studies',
                      })
                    }
                    style={{
                      flexDirection: 'row',
                      marginTop: 12,
                      marginEnd: 5,
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 14,
                      }}>
                      {sReportData
                        ? sReportData.sts + ' DK, ' + sReportData.slc + ' DERS'
                        : '...'}
                    </Text>

                    <MaterialCommunityIcons
                      style={{alignSelf: 'center'}}
                      name="chevron-right"
                      color={'rgba(58,79,101,1)'}
                      size={24}
                    />
                  </TouchableOpacity>

                  {/* Studies Report Graph */}
                  <View
                    style={{
                      height: 110,
                      width: '100%',
                      marginTop: 16,
                    }}>
                    <WebView
                      ref={studGraph}
                      style={{
                        flex: 1,
                        height: '100%',
                        marginStart: 6,
                        marginEnd: 6,
                      }}
                      source={{uri: makeApiep('grpfr')}}
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
                        nav.navigate('Reports', {
                          planId: mainReport.plan.plan_id,
                          mode: 'daily',
                          type: 'studies',
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
                      onPress={() =>
                        nav.navigate('ManStudy', {
                          planId: mainReport.plan.plan_id,
                        })
                      }
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
              </View>

              <View style={{height: 120}}></View>
            </>
          )}
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
