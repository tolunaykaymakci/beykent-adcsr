import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GlobalColors, GlobalStyles} from '../../GlobalStyles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LessonSelectSheet = ({refs, lessons, selected}) => {
  return (
    <RBSheet
      ref={refs}
      height={400}
      animationType={'slide'}
      closeOnDragDown={true}
      closeOnPressMask={true}
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
      <Text style={{padding: 12, fontSize: 16, paddingBottom: 6}}>
        Ders Seç
      </Text>

      <View style={{marginStart: 6, marginEnd: 6}}>
        {lessons == null ? (
          <Text>?</Text>
        ) : (
          <FlatList
            data={lessons}
            renderItem={({item, index}) => (
              <View
                style={{
                  flex: 1,
                }}>
                <Pressable
                  onPress={() => {
                    selected(item);
                  }}
                  style={{
                    ...GlobalStyles.primaryCard,
                    flexDirection: 'row',
                    height: 56,
                    marginStart: 3,
                    marginEnd: 3,
                    marginBottom: 3,
                    alignContent: 'center',
                    backgroundColor: GlobalColors.attentionCard,
                  }}>
                  <MaterialIcons
                    name="gesture"
                    style={{marginEnd: 8, alignSelf: 'center'}}
                    color={'rgb(0,0,0)'}
                    size={18}
                  />
                  <Text style={{alignSelf: 'center', marginEnd: 8}}>
                    {item.name}
                  </Text>
                </Pressable>
              </View>
            )}
            numColumns={2}
            keyExtractor={(item) => item.lesson_id}
          />
        )}
      </View>
    </RBSheet>
  );
};

export default LessonSelectSheet;
