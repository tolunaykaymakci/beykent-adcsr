import React from 'react';

import {View, Text, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {TouchableOpacity} from 'react-native-gesture-handler';

import RIDS from '../../screens/home/ReportItemDetailsScreen';
import {GlobalColors} from '../GlobalStyles';
import QuestionReportSubject from './QuestionReportSubject';

const QuestionReportLesson = ({rlesson, nav}) => {
  function colorIntToHex(num) {
    num >>>= 0;
    var b = num & 0xff,
      g = (num & 0xff00) >>> 8,
      r = (num & 0xff0000) >>> 16,
      a = ((num & 0xff000000) >>> 24) / 255;
    return 'rgba(' + [r, g, b, a].join(',') + ')';
  }

  return (
    <View
      style={{
        marginBottom: 10,
      }}>
      <TouchableOpacity
        onPress={() =>
          nav.navigate('ReportItemDetails', {
            initMode: RIDS.REPIDM_QUESTION_REPORT_LESSON,
          })
        }
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: 25,
            backgroundColor: colorIntToHex(rlesson.colors.default),
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
            paddingTop: 9,
            paddingBottom: 9,
            overflow: 'hidden',
            paddingStart: 4,
            paddingEnd: 4,
          }}>
          <Text
            style={{
              marginStart: 3,
              fontSize: 15,
              fontWeight: 'bold',
              color: GlobalColors.titleText,
            }}>
            {rlesson.name}
          </Text>

          <View style={{flexDirection: 'row', marginStart: 3, marginTop: 2}}>
            <MaterialIcons
              style={{alignSelf: 'center'}}
              name="library-books"
              color={'rgb(58,79,101)'}
              size={12.5}
            />
            <Text>{rlesson.subjects.length} konu</Text>
            <MaterialIcons
              style={{alignSelf: 'center', marginStart: 6, display: 'none'}}
              name="insert-drive-file"
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
                fontSize: 14,
                color: GlobalColors.subText,
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

      {rlesson.subjects.map((subj, i) => (
        <QuestionReportSubject lessonRef={rlesson} rsubject={subj} nav={nav} />
      ))}
    </View>
  );
};

export default QuestionReportLesson;
