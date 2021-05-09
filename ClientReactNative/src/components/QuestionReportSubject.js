import React from 'react';

import {View, Text, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {TouchableOpacity} from 'react-native-gesture-handler';

import RIDS from '../../screens/home/ReportItemDetailsScreen';
import {GlobalColors} from '../GlobalStyles';

const QuestionReportSubject = ({lessonRef, rsubject, nav}) => {
  function colorIntToHex(num) {
    num >>>= 0;
    var b = num & 0xff,
      g = (num & 0xff00) >>> 8,
      r = (num & 0xff0000) >>> 16,
      a = ((num & 0xff000000) >>> 24) / 255;
    return 'rgba(' + [r, g, b, '0.7'].join(',') + ')';
  }

  return (
    <TouchableOpacity
      onPress={() =>
        nav.navigate('ReportItemDetails', {
          initMode: RIDS.REPIDM_QUESTION_REPORT_SUBJECT,
        })
      }
      style={{
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: 5,
          marginStart: 20,
          backgroundColor: colorIntToHex(lessonRef.colors.default),
          height: '100%',
        }}>
        <MaterialIcons
          style={{marginStart: 5, marginTop: 18, alignSelf: 'center'}}
          name="gesture"
          color={'rgb(255,255,255)'}
          size={14}
        />
      </View>

      <View
        style={{
          flex: 0.65,
          paddingTop: 4,
          paddingBottom: 4,
          overflow: 'hidden',
          paddingStart: 4,
          paddingEnd: 4,
        }}>
        <Text
          style={{
            marginStart: 3,
            fontSize: 14,
            color: GlobalColors.titleText,
          }}>
          {rsubject.name}
        </Text>

        <View style={{flexDirection: 'row', marginStart: 3}}>
          <MaterialIcons
            style={{alignSelf: 'center'}}
            name="insert-drive-file"
            color={'rgb(58,79,101)'}
            size={12.5}
          />
          <Text>{rsubject.test} test</Text>
        </View>
      </View>

      <View
        style={{
          flex: 0.35,
          paddingTop: 4,
          paddingBottom: 4,
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            {rsubject.solved}
          </Text>

          <Text
            style={{
              alignSelf: 'center',
              fontSize: 14,
              color: GlobalColors.subText,
              marginStart: 4,
              marginEnd: 2,
            }}>
            SORU
          </Text>

          <MaterialCommunityIcons
            style={{alignSelf: 'center', display: 'none'}}
            name="chevron-right"
            color={'rgb(58,79,101)'}
            size={22}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default QuestionReportSubject;
