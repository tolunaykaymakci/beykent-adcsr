// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  Button,
  SafeAreaView,
} from 'react-native';

import * as Progress from 'react-native-progress';
import {GlobalStyles, GlobalColors} from '../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';

import {authorizedRequest} from '../Service';

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
        <>
          <Button onPress={() => alert('test!')} title="Soru Ekle" />
        </>
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

  useLayoutEffect(() => {
    authorizedRequest('api/app/home/', {})
      .then((response) => response.json())
      .then((json) => {
        setMainReport(json);
        setLoadingMain(false);

        //
        // Request sub-modules
        //

        requestSubModules();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  const requestSubModules = () => {
    authorizedRequest('api/app/home/ques', {})
      .then((response) => response.json())
      .then((json) => {
        setQReportData(json);
        setLoadingQReports(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('api/app/home/stud', {})
      .then((response) => response.json())
      .then((json) => {
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
        <ScrollView style={{flex: 1}}>
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

              <Text style={styles.navMenuLabel}>Puanlar</Text>
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
              }}
              onPress={() =>
                nav.navigate('Records', {planId: mainReport.plan.plan_id})
              }></View>
          </View>

          {/* User Study Plans Strip */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                      paddingTop: 6,
                      paddingBottom: 10,
                      marginStart: 6,
                      marginEnd: 6,
                      fontSize: 14.75,
                      alignSelf: 'flex-end',
                      fontWeight: 'bold',
                    }}>
                    {plan.name}
                  </Text>
                ),
              )}
            </View>
          </ScrollView>

          {/* Questions Report Card */}
          <TouchableOpacity
            style={{
              ...GlobalStyles.primaryCard,
              ...GlobalStyles.homeCard,
              height: 'auto',
            }}
            onPress={() =>
              nav.navigate('QuestionsReport', {planId: mainReport.plan.plan_id})
            }>
            <Text style={GlobalStyles.cardTitleText}>Soru Çözümlerim</Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                marginEnd: 5,
                position: 'absolute',
                right: 0,
              }}>
              <Text style={{alignSelf: 'center', fontSize: 13}}>DETAYLAR</Text>

              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="chevron-right"
                color={'rgb(58,79,101)'}
                size={24}
              />
            </View>

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
                  {qReportData != null ? qReportData.qts : null}
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
                <MaterialCommunityIcons
                  style={{alignSelf: 'center'}}
                  name="timer"
                  color={'rgb(58,79,101)'}
                  size={13}
                />
                <Text>{qReportData != null ? qReportData.qlc : null} ders</Text>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginStart: 12}}
                  name="timer"
                  color={'rgb(58,79,101)'}
                  size={13}
                />
                <Text>{qReportData != null ? qReportData.qsc : null} konu</Text>
                <MaterialCommunityIcons
                  style={{alignSelf: 'center', marginStart: 12}}
                  name="timer"
                  color={'rgb(58,79,101)'}
                  size={13}
                />
                <Text>{qReportData != null ? qReportData.qtc : null} test</Text>
              </View>

              {/* Questions Graph */}
              <View
                style={{
                  height: 158,
                  width: '100%',
                  marginTop: 8,
                }}>
                <WebView
                  style={{
                    flex: 1,
                    height: '100%',
                    marginStart: 12,
                    marginEnd: 12,
                  }}
                  source={{uri: 'http://192.168.1.104:5000/grpfr'}}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View>

              {/* Questions Study Program */}
              <View
                style={{
                  height: 40,
                  width: '100%',
                  display: 'none',
                  marginTop: 8,
                  backgroundColor: 'blue',
                }}></View>
            </View>
          </TouchableOpacity>

          {/* Studies Report Card */}
          <TouchableOpacity
            style={{
              ...GlobalStyles.primaryCard,
              ...GlobalStyles.homeCard,
              height: 'auto',
            }}
            onPress={() =>
              nav.navigate('StudiesReport', {planId: mainReport.plan.plan_id})
            }>
            <Text style={GlobalStyles.cardTitleText}>Konu Çalışmalarım</Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 7,
                marginEnd: 5,
                position: 'absolute',
                right: 0,
              }}>
              <Text style={{alignSelf: 'center', fontSize: 13}}>DETAYLAR</Text>

              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="chevron-right"
                color={'rgb(58,79,101)'}
                size={24}
              />
            </View>

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
              style={{flexDirection: 'row', alignSelf: 'center', marginTop: 5}}>
              <MaterialCommunityIcons
                style={{alignSelf: 'center'}}
                name="timer"
                color={'rgb(58,79,101)'}
                size={13}
              />
              <Text> {sReportData != null ? sReportData.slc : null} ders</Text>
              <MaterialCommunityIcons
                style={{alignSelf: 'center', marginStart: 12}}
                name="timer"
                color={'rgb(58,79,101)'}
                size={13}
              />
              <Text> {sReportData != null ? sReportData.ssc : null} konu</Text>
            </View>

            {/* Studies Report Graph */}
            <View
              style={{
                height: 158,
                width: '100%',
                marginTop: 8,
              }}>
              <WebView
                style={{
                  flex: 1,
                  height: '100%',
                  marginStart: 12,
                  marginEnd: 12,
                }}
                source={{uri: 'http://192.168.1.104:5000/grpfr'}}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
          </TouchableOpacity>

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
