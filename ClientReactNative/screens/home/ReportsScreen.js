import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {WebView} from 'react-native-webview';
import * as Progress from 'react-native-progress';

import moment from 'moment';

import {GlobalStyles, GlobalColors} from '../../src/GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReportLesson from '../../src/components/ReportLesson';

import RDS from './RecordDetailsScreen';

import {authorizedRequest, dump, getAuthToken, makeApiep} from '../../Service';
import {useIsFocused} from '@react-navigation/native';

const RecordItem = ({title, nav, subj, desc, time, action}) => (
  <TouchableOpacity
    onPress={() => action()}
    style={{
      backgroundColor: '#fff',
      height: 64,
      flexDirection: 'row',
    }}>
    <View style={{alignSelf: 'center'}}>
      <Text style={{fontWeight: 'bold', fontSize: 14}}>{title}</Text>
      <Text style={{fontSize: 13}}>{subj}</Text>
      <Text style={{fontSize: 13}}>{desc}</Text>
    </View>

    <View
      style={{
        position: 'absolute',
        flexDirection: 'row',
        right: 6,
        alignSelf: 'center',
      }}>
      <MaterialCommunityIcons
        name="timer"
        color={'rgb(171,180,190)'}
        size={18}
      />
      <Text style={{marginStart: 2, fontSize: 17}}>
        {time.substring(11, 16)}
      </Text>
    </View>
  </TouchableOpacity>
);

function App({route, navigation}) {
  const {planId, mode, type, userref} = route.params;
  const [report, setReport] = useState();
  const [records, setRecords] = useState();
  const [showFab, setShowFab] = useState(false);
  const [programText, setProgramText] = useState();
  const [stateMode, setStateMode] = useState('daily');
  const [qan, setQan] = useState();
  const [programPerc, setProgramPerc] = useState(20);

  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const [nextGroupButtonVisible, setNextGroupButtonVisible] = useState(false);

  const isFocused = useIsFocused();

  const momentDate = useRef(moment(Date.now()));
  const graphWebView = useRef();
  const currentMode = useRef(mode ?? 'daily');
  const plan = useRef();
  const studyProgram = useRef();
  const currentReport = useRef();

  const graphUserId = useRef();

  const graphFirstCall = useRef(true);

  useEffect(() => {
    graphUserId.current = userref ? userref.a_id : global.user.a_id;

    currentMode.current = 'daily';
    navigation.setOptions({
      headerTitle:
        type === 'questions' ? 'Soru Çözümlerim' : 'Konu Çalışmalarım',
    });

    authorizedRequest('ss/sdb/plan', {plan_id: planId})
      .then((response) => response.json())
      .then((json) => {
        plan.current = json.plan;

        // User has study program?
        let pt = json.plan.program_type;
        if (!(pt == null || pt === 'none' || !json.plan.program_active)) {
          setProgramText(
            pt === 'fixed'
              ? 'Sabit Ders Programı'
              : pt === 'daily'
              ? 'Günlük Ders Programı'
              : 'Haftalık Ders Programı',
          );
          studyProgram.current = pt;
        }

        requestReport();
      })
      .catch((error) => console.error(error))
      .finally(() => {});
    requestReport();
  }, [isFocused]);

  const requestReport = () => {
    let user = userref;

    setShowFab(false);

    if (graphFirstCall.current === true) {
      graphFirstCall.current = false;
      setTimeout(function () {
        var repDateStr = momentDate.current.format('yyyy-MM-DD');
        graphWebView.current.injectJavaScript(
          "enableHighlights('" + type + "')",
        );
        graphWebView.current.injectJavaScript(makeGraphRequestJs(repDateStr));
      }, 1000);
    } else {
      var repDateStr = momentDate.current.format('yyyy-MM-DD');
      graphWebView.current.injectJavaScript("enableHighlights('" + type + "')");
      graphWebView.current.injectJavaScript(makeGraphRequestJs(repDateStr));
    }

    updateGraphControls();

    /* Request report */
    authorizedRequest('api/reports/' + type, {
      date: repDateStr,
      mode: currentMode.current,
      plan: planId,
      user: user ? user.a_id : 0,
    })
      .then((response) => response.json())
      .then((json) => {
        currentReport.current = json;
        setReport(json);
        setShowFab(true);

        if (type === 'questions') {
          qAnalyse();
          setProgramPerc(json.perc);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    var recordStartDate = repDateStr;
    var recordEndDate;

    var tempMoment = momentDate.current.clone();
    var nowMoment = moment();
    if (currentMode.current === 'daily') {
      recordEndDate = repDateStr;
    } else if (currentMode.current === 'weekly') {
      tempMoment.add(1, 'w');
    } else {
      if (
        tempMoment.month() === nowMoment.month() &&
        tempMoment.year() === nowMoment.year()
      ) {
        tempMoment.set('D', nowMoment.date);
      } else {
        tempMoment.endOf('month');
      }
    }
    recordEndDate = tempMoment.format('yyyy-MM-DD');

    /* Request records */
    authorizedRequest('api/records/' + type, {
      mode: 'range',
      plan: planId,
      start: recordStartDate,
      end: recordEndDate,
      user: user ? user.a_id : 0,
    })
      .then((response) => response.json())
      .then((json) =>
        setRecords(type === 'questions' ? json.rec_packs : json.studies),
      )
      .catch((error) => console.error(error));
  };

  const previousReportDate = () => {
    var mtype = stateMode === 'monthly' ? 'M' : stateMode[0];
    momentDate.current = momentDate.current.subtract(1, mtype);
    requestReport();
  };

  const nextReportDate = () => {
    var mtype = stateMode === 'monthly' ? 'M' : stateMode[0];
    momentDate.current = momentDate.current.add(1, mtype);
    requestReport();
  };

  const previousReportDateGroup = () => {
    var mtype = stateMode === 'monthly' ? 'M' : stateMode[0];
    var amount = stateMode === 'daily' ? 7 : 5;
    momentDate.current = momentDate.current.subtract(amount, mtype);
    requestReport();
  };

  const nextReportDateGroup = () => {
    var mtype = stateMode === 'monthly' ? 'M' : stateMode[0];
    var amount = stateMode === 'daily' ? 7 : 5;
    momentDate.current = momentDate.current.add(amount, mtype);
    requestReport();
  };

  const updateGraphControls = () => {
    var check = moment().startOf('isoWeek');
    var now = moment();
    var wdl = check.date();
    var ml = check.month();
    var yl = check.year();

    let dd = momentDate.current.date(),
      dm = momentDate.current.month(),
      dy = momentDate.current.year(),
      nd = now.date(),
      nm = now.month(),
      ny = now.year();

    let testCal = momentDate.current.clone();
    var groupEnabled = true;
    var nextEnabled;
    var i;

    if (stateMode === 'daily') {
      nextEnabled = dd === nd && dm === nm && dy === ny ? false : true;

      for (i = 0; i !== 7; i++) {
        if (dd === nd && dm === nm && dy === ny) {
          groupEnabled = false;
          break;
        }
        testCal.add(1, 'd');
      }
    } else if (stateMode === 'weekly') {
      nextEnabled = dd === wdl && dm === ml && dy === yl ? false : true;

      for (i = 0; i !== 5; i++) {
        if (dd === wdl && dm === ml && dy === yl) {
          groupEnabled = false;
          break;
        }
        testCal.add(1, 'w');
      }
    } else if (stateMode === 'monthly') {
      nextEnabled = dm === ml && dy === yl ? false : true;

      for (i = 0; i !== 5; i++) {
        if (dm === ml && dy === yl) {
          groupEnabled = false;
          break;
        }
        testCal.add(1, 'M');
      }
    }

    setNextButtonVisible(nextEnabled);
    setNextGroupButtonVisible(groupEnabled);
  };

  const makeGraphRequestJs = (date) => {
    return `req(${graphUserId.current}, '${type}', '${currentMode.current}', ${planId}, '${date}', '${global.cred}', '${global.pwd}')`;
  };

  const qAnalyse = () => {
    let r = currentReport.current;

    var total = r.solved;
    var correct = r.t_correct;
    var wrong = r.t_wrong;
    var empty = r.t_empty;
    var other = r.t_other;

    // total = 250;
    // correct = 50;
    // wrong = 30;
    // empty = 20;
    // other = 150;

    let percCorrect = (correct * 100) / total;
    let percWrong = (wrong * 100) / total;
    let percEmpty = (empty * 100) / total;
    let percOther = (other * 100) / total;

    let tvc = Math.min(correct) + ' (%' + Math.floor(percCorrect) + ')';
    let tvw = Math.min(wrong) + ' (%' + Math.floor(percWrong) + ')';
    let tve = Math.min(empty) + ' (%' + Math.floor(percEmpty) + ')';
    let tvo = Math.min(other) + ' (%' + Math.floor(percOther) + ')';

    setQan({
      tvc: tvc,
      tvw: tvw,
      tve: tve,
      tvo: tvo,
      tqe: !((((correct == wrong) == empty) == 0) == total),
    });

    // console.log({
    //   tvc: tvc,
    //   tvw: tvw,
    //   tve: tve,
    //   tvo: tvo,
    //   tqe: !((((correct == wrong) == empty) == 0) == total),
    // });
  };

  const reportChangeMode = (newMode) => {
    var cmode = currentMode.current;
    var now = moment();
    if (currentMode === newMode) return;

    let reportDate = momentDate.current;
    if (newMode === 'monthly') {
      reportDate.startOf('month');
    } else if (cmode === 'monthly') {
      reportDate.endOf('month');
      if (reportDate.month() === now.month()) {
        reportDate = now;
      }
      if (newMode === 'weekly') reportDate.startOf('isoWeek');
    } else if (cmode === 'daily' && newMode === 'weekly') {
      reportDate.startOf('isoWeek');
    }

    if (newMode === 'daily') {
      currentMode.current = 'daily';
      setStateMode('daily');
    } else if (newMode === 'weekly') {
      currentMode.current = 'weekly';
      setStateMode('weekly');
    } else {
      currentMode.current = 'monthly';
      setStateMode('monthly');
    }

    requestReport();
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      {userref && (
        <View
          style={{
            backgroundColor: 'rgb(232,232,232)',
            justifyContent: 'space-between',
            height: 64,
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile', {
                  username: userref.username,
                });
              }}
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                alignSelf: 'center',
                marginStart: 12,
              }}>
              <Image
                source={
                  userref.p_url
                    ? {uri: userref.p_url}
                    : require('../../assets/profile_default.png')
                }
                style={{
                  width: 36,
                  height: 36,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={{alignSelf: 'center', marginStart: 10}}>
              <Text style={{fontWeight: 'bold'}}>{userref.disp_name}</Text>
              <Text style={{fontSize: 14}}>@{userref.username}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}></View>
        </View>
      )}

      <View>
        {/* stateMode */}
        <ScrollView>
          <View
            style={{
              backgroundColor: GlobalColors.headerSecondary,
              elevation: 4,
            }}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-start',
                  paddingTop: 6,
                  marginStart: 4,
                }}>
                <Text
                  onPress={() => reportChangeMode('daily')}
                  style={
                    stateMode !== 'daily'
                      ? styles.modeButton
                      : {
                          ...styles.modeButtonActive,
                          borderBottomColor:
                            type === 'questions'
                              ? 'rgb(62, 116, 182)'
                              : 'rgb(255, 141, 115)',
                        }
                  }>
                  Günlük
                </Text>
                <Text
                  onPress={() => reportChangeMode('weekly')}
                  style={
                    stateMode !== 'weekly'
                      ? styles.modeButton
                      : {
                          ...styles.modeButtonActive,
                          borderBottomColor:
                            type === 'questions'
                              ? 'rgb(62, 116, 182)'
                              : 'rgb(255, 141, 115)',
                        }
                  }>
                  Haftalık
                </Text>
                <Text
                  onPress={() => reportChangeMode('monthly')}
                  style={
                    stateMode !== 'monthly'
                      ? styles.modeButton
                      : {
                          ...styles.modeButtonActive,
                          borderBottomColor:
                            type === 'questions'
                              ? 'rgb(62, 116, 182)'
                              : 'rgb(255, 141, 115)',
                        }
                  }>
                  Aylık
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                {nextGroupButtonVisible && (
                  <TouchableOpacity
                    onPress={() => nextReportDateGroup()}
                    style={{width: 36, justifyContent: 'center'}}>
                    <MaterialIcons
                      style={{alignSelf: 'center'}}
                      name="fast-rewind"
                      color={'rgb(58,79,101)'}
                      size={25}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => previousReportDateGroup()}
                  style={{width: 36, justifyContent: 'center'}}>
                  <MaterialIcons
                    style={{alignSelf: 'center'}}
                    name="fast-forward"
                    color={'rgb(58,79,101)'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                height: 132,
                marginTop: 12,
              }}>
              <WebView
                ref={graphWebView}
                style={{
                  flex: 1,
                  height: '100%',
                }}
                onMessage={(message) => {
                  const {data} = message.nativeEvent;
                  momentDate.current = moment(data);
                  requestReport();
                }}
                source={{uri: makeApiep('grpfr')}}
                scalesPageToFit={true}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
              />
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

              {nextButtonVisible && (
                <TouchableOpacity
                  onPress={() => nextReportDate()}
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
              )}

              <TouchableOpacity
                onPress={() => previousReportDate()}
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
                  {type === 'questions' ? report.solved : report.studied}
                </Text>
                <Text style={{fontSize: 16, alignSelf: 'center'}}>
                  {type === 'questions' ? 'SORU' : 'DAKIKA'}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    ...GlobalStyles.primaryCard,
                    borderRadius: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    marginStart: 0,
                    marginEnd: 4,
                    flexDirection: 'row',
                  }}>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginEnd: 3}}
                    name="gesture"
                    color={'rgb(58,79,101)'}
                    size={15}
                  />
                  <Text>{report.lessons.length} ders</Text>
                </View>

                <View
                  style={{
                    ...GlobalStyles.primaryCard,
                    borderRadius: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    marginStart: 4,
                    marginEnd: 4,
                    flexDirection: 'row',
                  }}>
                  <MaterialIcons
                    style={{alignSelf: 'center', marginEnd: 3}}
                    name="library-books"
                    color={'rgb(58,79,101)'}
                    size={15}
                  />
                  <Text>{report.count_subject} konu</Text>
                </View>

                {type === 'questions' && (
                  <View
                    style={{
                      ...GlobalStyles.primaryCard,
                      borderRadius: 16,
                      paddingTop: 8,
                      paddingBottom: 8,
                      marginStart: 4,
                      marginEnd: 0,
                      flexDirection: 'row',
                    }}>
                    <MaterialIcons
                      style={{alignSelf: 'center', marginEnd: 3}}
                      name="insert-drive-file"
                      color={'rgb(58,79,101)'}
                      size={15}
                    />
                    <Text>{report.count_test} test</Text>
                  </View>
                )}
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
                        display: 'none',
                        height: 72,
                        alignSelf: 'center',
                        marginBottom: 6,
                        borderRadius: 36,
                      }}></View>

                    <Text style={{fontWeight: 'bold'}}>
                      Henüz
                      {type === 'questions'
                        ? ' soru çözümü '
                        : ' konu tekrarı '}
                      eklenmemiş
                    </Text>
                    <Text style={{marginBottom: 12}}>
                      Şimdi eklemek için +'ya dokunun
                    </Text>
                  </View>
                ) : (
                  <View>
                    {report.lessons.map((rlesson, rli) => (
                      <ReportLesson
                        rlesson={rlesson}
                        type={type}
                        nav={navigation}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* Study Program */}
              {type !== 'questions' || programText === null ? (
                <></>
              ) : (
                <View
                  style={{
                    ...GlobalStyles.primaryCard,
                    marginTop: 6,
                    height: 'auto',
                  }}
                  onPress={() => nav.navigate('QuestionsReport')}>
                  <Text style={GlobalStyles.cardTitleText}>Ders Programı</Text>
                  <Text style={GlobalStyles.subText}>{programText}</Text>

                  <View style={{flex: 1, flexDirection: 'row', marginTop: 12}}>
                    <View
                      style={{
                        width: 120,
                        height: 90,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Progress.Circle
                        style={{marginLeft: -16}}
                        progress={Number(programPerc / 100)}
                        thickness={8}
                        size={74}
                        formatText={(progress) => Math.floor(programPerc) + '%'}
                        showsText={true}
                        textStyle={{fontSize: 16}}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        marginLeft: 12,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <View style={{flex: 1, height: 45}}>
                          <Text
                            style={{
                              fontSize: 13.5,
                              color: GlobalColors.subText,
                            }}>
                            Hedef
                          </Text>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>
                            {report.target}
                          </Text>
                        </View>
                        <View style={{flex: 1, height: 45}}>
                          <Text
                            style={{
                              fontSize: 13.5,
                              color: GlobalColors.subText,
                            }}>
                            Çözüm
                          </Text>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>
                            {report.program_solved}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <View style={{flex: 1, height: 45}}>
                          <Text
                            style={{
                              fontSize: 13.5,
                              color: GlobalColors.subText,
                            }}>
                            Kalan
                          </Text>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>
                            {report.rem}
                          </Text>
                        </View>
                        <View style={{flex: 1, height: 45}}>
                          <Text
                            style={{
                              fontSize: 13.5,
                              color: GlobalColors.subText,
                            }}>
                            Yüzde
                          </Text>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>
                            {Math.round(report.perc)}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      display: 'none',
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
              )}

              {/* Correct, Wrong & Empty Analyze */}
              {type !== 'questions' || qan == null ? (
                <></>
              ) : (
                <View
                  style={{
                    ...GlobalStyles.primaryCard,
                    marginTop: 6,
                    height: 'auto',
                    display: qan.tqe ? 'flex' : 'none',
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
                          <Text style={{fontWeight: 'bold', color: '#2E9150'}}>
                            DOĞRU SORU
                          </Text>
                          <Text
                            style={{fontSize: 16, color: GlobalColors.subText}}>
                            {qan.tvc}
                          </Text>
                        </View>
                        <View style={{flex: 1, height: 45}}>
                          <Text style={{fontWeight: 'bold', color: '#A33535'}}>
                            YANLIŞ SORU
                          </Text>
                          <Text
                            style={{fontSize: 16, color: GlobalColors.subText}}>
                            {qan.tvw}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <View style={{flex: 1, height: 40}}>
                          <Text style={{fontWeight: 'bold', color: '#B36B1F'}}>
                            BOŞ SORU
                          </Text>
                          <Text
                            style={{fontSize: 16, color: GlobalColors.subText}}>
                            {qan.tve}
                          </Text>
                        </View>
                        <View style={{flex: 1, height: 40}}>
                          <Text style={{fontWeight: 'bold', color: '#206797'}}>
                            DİĞERLERİ
                          </Text>
                          <Text
                            style={{fontSize: 16, color: GlobalColors.subText}}>
                            {qan.tvo}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* <View
                      style={{
                        width: 120,
                        height: 85,
                      }}>
                      <Text>perc</Text>
                    </View> */}
                  </View>
                </View>
              )}

              {/* Records */}
              <View
                style={{
                  ...GlobalStyles.primaryCard,
                  marginTop: 6,
                  height: 'auto',
                  marginBottom: 120,
                }}
                onPress={() => nav.navigate('QuestionsReport')}>
                <Text style={GlobalStyles.cardTitleText}>Kayıtlarım</Text>
                <Text style={GlobalStyles.subText}>
                  Gün Saatlerine Dağılımı
                </Text>

                <View style={{marginTop: 12}}>
                  {records &&
                    records.map((record) => (
                      <RecordItem
                        title={record.lesson_name}
                        time={
                          type == 'questions' ? record.rec_date : record.created
                        }
                        subj={
                          type === 'questions'
                            ? record.recs.length === 1
                              ? record.recs[0].subject_name
                              : record.recs.length + ' konu'
                            : record.title
                        }
                        desc={
                          type === 'questions'
                            ? record.total_solved +
                              ' soru, ' +
                              record.total_test +
                              ' test'
                            : record.duration + ' dakika'
                        }
                        nav={navigation}
                        action={() => {
                          type === 'questions'
                            ? navigation.navigate('ManQuestions', {
                                initDate: momentDate.current.format(
                                  'yyyy-MM-DD',
                                ),
                                planId: plan.plan_id,
                                recordPack: record,
                              })
                            : navigation.navigate('ManStudy', {
                                initDate: momentDate.current.format(
                                  'yyyy-MM-DD',
                                ),
                                planId: plan.plan_id,
                                studies: record,
                              });
                        }}
                      />
                    ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {showFab === false ? null : (
          <TouchableOpacity
            onPress={() =>
              type === 'questions'
                ? navigation.navigate('ManQuestions', {
                    initDate: momentDate.current.format('yyyy-MM-DD'),
                    planId: plan.current.plan_id,
                  })
                : navigation.navigate('ManStudy', {
                    initDate: momentDate.current.format('yyyy-MM-DD'),
                    planId: plan.current.plan_id,
                  })
            }
            style={{
              backgroundColor:
                type === 'questions'
                  ? 'rgb(62, 116, 182)'
                  : 'rgb(255, 141, 115)',
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
        )}
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
  modeButton: {
    padding: 8,
    color: GlobalColors.titleText,
  },
  modeButtonActive: {
    padding: 8,
    color: GlobalColors.titleText,
    fontWeight: 'bold',
    borderBottomWidth: 3,
  },
});

export default App;
