import React from 'react';
import {View, Button, Text, ScrollView, Pressable} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GlobalColors, GlobalStyles} from '../../GlobalStyles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PlanSelectSheet = ({refs, plans}) => {
  return (
    <RBSheet
      ref={refs}
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
      <Text style={{padding: 12, fontSize: 16}}>Plan Seç</Text>

      <View>
        {plans == null ? (
          <Text>?</Text>
        ) : (
          <ScrollView>
            {plans.map((plan, i) => (
              <Pressable
                onPress={() => alert('Henüz implemente edilmedi')}
                style={{
                  ...GlobalStyles.primaryCard,
                  flexDirection: 'row',
                  backgroundColor: GlobalColors.attentionCard,
                }}>
                <MaterialIcons
                  name="assignment"
                  style={{marginRight: 6}}
                  color={'rgb(0,0,0)'}
                  size={18}
                />
                <Text>{plan.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </RBSheet>
  );
};

export default PlanSelectSheet;
