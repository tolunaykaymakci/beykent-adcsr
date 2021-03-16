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
          <Button onPress={() => alert('poncik!')} title="Soru Ekle" />
        </>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{...styles.tabsContainer, display: 'none'}}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setHomeMode(0)}
          style={homeMode == 0 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              homeMode == 0
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            BUGÜNÜN ÖZETİ
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setHomeMode(1)}
          style={homeMode == 1 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              homeMode == 1
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            SAYAÇLARIM
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#edf3ff"
          onPress={() => setHomeMode(2)}
          style={homeMode == 2 ? styles.tabButtonSelected : styles.tabButton}>
          <Text
            style={
              homeMode == 2
                ? styles.tabButtonTextSelected
                : styles.tabButtonText
            }>
            ARKADAŞLARIM
          </Text>
        </TouchableHighlight>
      </View>

      {homeMode == 0 ? (
        <HomeSummaryScreen nav={navigation} />
      ) : (
        <Text>Not Implemented Yet</Text>
      )}
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
    authorizedRequest('http://192.168.1.104:5000/api/app/home/', {})
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
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
    authorizedRequest('http://192.168.1.104:5000/api/app/home/ques', {})
      .then((response) => response.json())
      .then((json) => {
        setQReportData(json);
        setLoadingQReports(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('http://192.168.1.104:5000/api/app/home/stud', {})
      .then((response) => response.json())
      .then((json) => {
        setSReportData(json);
        setLoadingSReports(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('http://192.168.1.104:5000/api/app/home/recs', {})
      .then((response) => response.json())
      .then((json) => {
        setRecordsData(json);
        setLoadingRecords(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {});

    authorizedRequest('http://192.168.1.104:5000/api/app/home/timr', {})
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
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: 'row', marginStart: 12}}>
              <Text
                style={{
                  ...GlobalStyles.titleText,
                  paddingTop: 6,
                  paddingBottom: 10,
                  marginStart: 6,
                  marginEnd: 6,
                  fontSize: 19,
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
          <TouchableOpacity
            style={{...GlobalStyles.primaryCard, ...GlobalStyles.homeCard}}
            onPress={() => nav.navigate('QuestionsReport')}>
            <Text style={GlobalStyles.cardTitleText}>Soru Çözümlerim</Text>
            <Text style={GlobalStyles.subText}>Bugün</Text>
            <MaterialCommunityIcons
              style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
              name="border-color"
              color={'rgb(171,180,190)'}
              size={36}
            />

            {loadingQReports ? (
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
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  margin: 12,
                  bottom: 0,
                }}>
                <Text style={{fontSize: 25, marginEnd: 3}}>
                  {qReportData.qts}
                </Text>
                <Text
                  style={{fontSize: 16, alignSelf: 'flex-end', marginEnd: 3}}>
                  soru
                </Text>
                <Text style={{fontSize: 25, marginEnd: 3}}>
                  {qReportData.qtc}
                </Text>
                <Text style={{fontSize: 16, alignSelf: 'flex-end'}}>test</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginEnd: 6,
              }}
              onPress={() => nav.navigate('StudiesReport')}>
              <Text style={GlobalStyles.cardTitleText}>Çalışmalarım</Text>
              <Text style={GlobalStyles.subText}>Bugün</Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="notebook"
                color={'rgb(171,180,190)'}
                size={36}
              />

              {loadingSReports ? (
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
                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    margin: 12,
                    bottom: 0,
                  }}>
                  <Text
                    style={{
                      ...GlobalStyles.titleText,
                      fontSize: 25,
                      marginEnd: 3,
                    }}>
                    {sReportData.sts}
                  </Text>
                  <Text
                    style={{
                      ...GlobalStyles.subText,
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      marginEnd: 3,
                    }}>
                    dakika
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginStart: 6,
              }}
              onPress={() =>
                nav.navigate('Records', {planId: mainReport.plan.plan_id})
              }>
              <Text style={GlobalStyles.cardTitleText}>Kayıtlarım</Text>
              <Text style={GlobalStyles.subText}>Tüm Kayıtlarım</Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="file-document"
                color={'rgb(171,180,190)'}
                size={36}
              />

              {loadingRecords ? (
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
                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    margin: 12,
                    bottom: 0,
                  }}>
                  <Text
                    style={{
                      ...GlobalStyles.titleText,
                      fontSize: 25,
                      marginEnd: 3,
                    }}>
                    {recordsData.count_q + recordsData.count_s}
                  </Text>
                  <Text
                    style={{
                      ...GlobalStyles.subText,
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      marginEnd: 3,
                    }}>
                    kayıt
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginEnd: 6,
              }}
              onPress={() => nav.navigate('Statistics')}>
              <Text style={GlobalStyles.cardTitleText}>İstatistiklerim</Text>
              <Text style={GlobalStyles.subText}>
                Genel Durumum, Ders İstatistiklerim
              </Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="graph"
                color={'rgb(171,180,190)'}
                size={36}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginStart: 6,
              }}
              onPress={() =>
                nav.navigate('PlanDetails', {planId: mainReport.plan.plan_id})
              }>
              <Text style={GlobalStyles.cardTitleText}>Planım</Text>
              <Text style={GlobalStyles.subText}>
                Dersler, konular, ders programları
              </Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="clipboard-text"
                color={'rgb(171,180,190)'}
                size={36}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              marginStart: 16,
              marginTop: 12,
              marginBottom: 6,
              color: 'rgb(105, 105, 107)',
            }}>
            NAVİGASYON
          </Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginEnd: 6,
              }}
              onPress={() => nav.navigate('Plans')}>
              <Text style={GlobalStyles.cardTitleText}>Çalışma Planlarım</Text>
              <Text style={GlobalStyles.subText}>Tüm Planlarım</Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="clipboard-text"
                color={'rgb(171,180,190)'}
                size={36}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginStart: 6,
              }}
              onPress={() => nav.navigate('Timers')}>
              <Text style={GlobalStyles.cardTitleText}>Sayaçlarım</Text>
              <Text style={GlobalStyles.subText}>Tüm Sayaçlarım</Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="timer"
                color={'rgb(171,180,190)'}
                size={36}
              />
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginEnd: 6,
              }}
              onPress={() => nav.navigate('Guide')}>
              <Text style={GlobalStyles.cardTitleText}>Puanlar & Tercih</Text>
              <Text style={GlobalStyles.subText}>
                Puan hesapla veya bölümlere bak
              </Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="segment"
                color={'rgb(171,180,190)'}
                size={36}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...GlobalStyles.primaryCard,
                ...GlobalStyles.homeCard,
                marginStart: 6,
              }}
              onPress={() =>
                nav.navigate('SettingsStack', {screen: 'Settings'})
              }>
              <Text style={GlobalStyles.cardTitleText}>Ayarlar</Text>
              <Text style={GlobalStyles.subText}>Uygulama Ayarları</Text>
              <MaterialCommunityIcons
                style={{position: 'absolute', margin: 12, right: 0, bottom: 0}}
                name="cog"
                color={'rgb(171,180,190)'}
                size={36}
              />
            </TouchableOpacity>
          </View>

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
});
export default HomeScreen;
