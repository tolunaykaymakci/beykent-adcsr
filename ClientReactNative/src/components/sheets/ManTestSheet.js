import React, {useEffect, useRef, useState} from 'react';
import {View, Button, Text, ScrollView, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GlobalColors, GlobalStyles} from '../../GlobalStyles';

import TouchChoose from '../TouchChoose';
import InputDialog from '../dialogs/InputDialog';
import SubjectSelectSheet from './SubjectSelectSheet';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {TestDataItem, SubjectDataItem} from '../ManDataItems';
import {dump} from '../../../Service';

const ManTestSheet = ({refs, confirm, subjectsRef}) => {
  const [showDelete, setShowDelete] = useState(false);

  const [showQCount, setShowQCount] = useState(false);
  const [showCCount, setShowCCount] = useState(false);
  const [showWCount, setShowWCount] = useState(false);

  const [qCount, setQCount] = useState(0);
  const [cCount, setCCount] = useState(0);
  const [wCount, setWCount] = useState(0);
  const [eCount, setECount] = useState(0);

  const [testSubject, setTestSubject] = useState();
  const [isDetailed, setDetailed] = useState(false);

  const subjectSheet = useRef();
  const currentTdi = useRef();

  const manMode = useRef();

  function checkDataCorrectness(_q, _c, _w, _d) {
    let totalCWE = _c + _w;
    var errorText = null;

    console.log('::', _q, _c, _w, _d);

    if (_d)
      if ((_q == 0) & ((_c != 0) | (_w != 0))) {
        errorText = 'Lütfen toplam soru sayısını belirtiniz.';
      } else {
        if (_q == totalCWE) {
          setECount(0);
          //safelyUpdateText(e, "0");
        } else {
          if (_q != 0)
            if (totalCWE > _q) {
              errorText =
                'Doğru, yanlış ve boş sorular ' +
                'birlikte toplam soru sayısını geçemez.';
            } else {
              // CWE less than total, let's investigate
              // We can fill it ourselves
              setECount(_q - (_c + _w));
              //safelyUpdateText(e, _q - (_c + _w) + "");
            }
        }
      }

    return errorText;
  }

  function calculateEmptyCount() {
    var qc = Number(currentTdi.current.totalCount);
    var cc = Number(currentTdi.current.correctCount);
    var wc = Number(currentTdi.currentwrongCount);
    var ec = Number(qc - (cc + wc));
    setECount(ec);
  }

  function commitTest() {
    if (currentTdi.current.subject_title == null) {
      alert('Lütfen konu seçin');
      return;
    }

    if (currentTdi.current.totalCount == 0) {
      alert('Lütfen soru sayısı belirtin');
      return;
    }

    refs.current.close();

    currentTdi.current.placeholder = false;
    confirm(manMode.current, currentTdi.current);
  }

  function loadRefTdi() {
    var tdi =
      refs.current.xmys != null ? refs.current.xmys : new TestDataItem(true);

    if (tdi.placeholder) {
      setShowDelete(false);
      manMode.current = 'add';

      setQCount(0);
      setCCount(0);
      setWCount(0);
      setECount(0);
      setTestSubject(null);
      setDetailed(false);
    } else {
      setShowDelete(true);
      manMode.current = 'edit';

      setQCount(tdi.totalCount);
      setCCount(tdi.correctCount);
      setWCount(tdi.wrongCount);
      setDetailed(tdi.detailed);
      setTestSubject(tdi.subject_title);
      calculateEmptyCount();
    }

    currentTdi.current = tdi;
    dump(currentTdi.current);
  }

  return (
    <RBSheet
      ref={refs}
      closeOnDragDown={true}
      closeOnPressMask={true}
      onOpen={() => loadRefTdi()}
      height={400}
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
      <View style={{margin: 12, marginTop: 0, position: 'relative'}}>
        <SubjectSelectSheet
          refs={subjectSheet}
          subjects={subjectsRef}
          onSelect={(subject) => {
            currentTdi.current.subject_title = subject;
            setTestSubject(subject);
          }}
        />

        {/* Inputs */}
        <InputDialog
          title="Soru Sayısı"
          visible={showQCount}
          confirm={(val) => {
            let r = checkDataCorrectness(
              Number(val),
              Number(currentTdi.current.correctCount),
              Number(currentTdi.current.wrongCount),
              currentTdi.current.detailed,
            );

            if (r != null) {
              alert(r);
              return;
            }

            setShowQCount(false);
            currentTdi.current.totalCount = Number(val);
            setQCount(val);
          }}
          dismiss={() => setShowQCount(false)}
        />
        <InputDialog
          title="Doğru Sayısı"
          visible={showCCount}
          confirm={(val) => {
            let r = checkDataCorrectness(
              Number(currentTdi.current.totalCount),
              Number(val),
              Number(currentTdi.current.wrongCount),
              currentTdi.current.detailed,
            );

            if (r != null) {
              alert(r);
              return;
            }

            setShowCCount(false);
            currentTdi.current.correctCount = Number(val);
            setCCount(val);
          }}
          dismiss={() => setShowCCount(false)}
        />
        <InputDialog
          title="Yanlış Sayısı"
          visible={showWCount}
          confirm={(val) => {
            let r = checkDataCorrectness(
              Number(currentTdi.current.totalCount),
              Number(currentTdi.current.correctCount),
              Number(val),
              currentTdi.current.detailed,
            );

            if (r != null) {
              alert(r);
              return;
            }

            setShowWCount(false);
            currentTdi.current.wrongCount = Number(val);
            setWCount(val);
            //calculateEmptyCount();
          }}
          dismiss={() => setShowWCount(false)}
        />

        <View
          style={{
            width: '100%',
            position: 'absolute',
          }}>
          <Pressable
            onPress={() => commitTest()}
            style={{
              right: 0,
              top: 0,
              alignSelf: 'flex-end',
            }}>
            <MaterialIcons
              style={{
                alignSelf: 'center',
                marginBottom: 9,
                paddingEnd: 9,
                paddingStart: 9,
              }}
              name="check"
              color={GlobalColors.titleText}
              size={30}
            />
          </Pressable>
        </View>

        {showDelete ? (
          <View
            style={{
              width: '100%',
              position: 'absolute',
            }}>
            <Pressable
              onPress={() => alert('silincek!')}
              style={{
                alignSelf: 'flex-start',
              }}>
              <MaterialIcons
                style={{
                  alignSelf: 'center',
                  marginBottom: 9,
                  paddingEnd: 9,
                  paddingStart: 9,
                }}
                name="delete"
                color={GlobalColors.titleText}
                size={30}
              />
            </Pressable>
          </View>
        ) : (
          <></>
        )}

        <View
          style={{
            backgroundColor: 'rgba(62, 116, 182, 1)',
            width: 60,
            borderRadius: 30,
            height: 60,
            shadowOpacity: 0.43,
            shadowRadius: 2.62,
            elevation: 1,
            marginTop: 12,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons
            style={{alignSelf: 'center'}}
            name="add"
            color={'rgb(255,255,255)'}
            size={22}
          />
        </View>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 8,
          }}>
          {showDelete ? 'Testi Düzenle' : 'Test Ekle'}
        </Text>

        <TouchChoose
          title="Ders Konusu"
          value={testSubject ?? 'Seç'}
          action={() => subjectSheet.current.open()}
        />
        <TouchChoose
          title="Soru Sayısı"
          value={qCount == 0 ? 'Belirt' : qCount}
          action={() => {
            setShowQCount(true);
          }}
        />
        <TouchChoose
          action={() => {
            currentTdi.current.detailed = !currentTdi.current.detailed;
            setDetailed(!isDetailed);
          }}
          title="Soru Dağılımlarını Belirt"
          icon={isDetailed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          value=""
        />

        <View
          style={{flexDirection: 'row', display: isDetailed ? 'flex' : 'none'}}>
          <View style={{flex: 1}}>
            <TouchChoose
              title="Doğru"
              value={cCount}
              action={() => {
                setShowCCount(true);
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <TouchChoose
              title="Yanlış"
              value={wCount}
              action={() => {
                setShowWCount(true);
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <TouchChoose title="Boş" value={eCount} />
          </View>
        </View>
      </View>
    </RBSheet>
  );
};

export default ManTestSheet;
