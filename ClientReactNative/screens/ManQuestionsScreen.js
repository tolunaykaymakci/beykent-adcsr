import React, {useRef} from 'react';

import {
  SafeAreaView,
  Text,
  Button,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PlanSelectSheet from '../src/components/PlanSelectSheet';
import {GlobalColors, GlobalStyles} from '../src/GlobalStyles';

import TouchChoose from '../src/components/TouchChoose';

function ManQuestionsScreen({route, navigation}) {
  const plansSheet = useRef();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            height: '100%',
          }}>
          <MaterialIcons
            style={{
              paddingEnd: 9,
              paddingStart: 9,
              marginTop: 15,
            }}
            name="save"
            color={GlobalColors.titleText}
            size={24}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: GlobalColors.windowBackground}}>
      <ScrollView>
        <View style={{backgroundColor: GlobalColors.headerSecondary}}>
          <PlanSelectSheet refs={plansSheet} />

          <Button
            title="Showe"
            onPress={() => {
              plansSheet.current.open();
            }}></Button>

          <View
            style={{
              backgroundColor: 'rgba(62, 116, 182, 1)',
              width: 66,
              borderRadius: 33,
              height: 66,
              shadowOpacity: 0.43,
              shadowRadius: 2.62,
              elevation: 1,
              marginTop: 24,
              alignSelf: 'center',
              flex: 1,
            }}>
            <MaterialIcons
              style={{alignSelf: 'center', marginTop: 18}}
              name="add"
              color={'rgb(255,255,255)'}
              size={28}
            />
          </View>

          <View style={{paddingStart: 18, marginTop: 10, paddingEnd: 18}}>
            <TouchChoose title="Plan" loading={true} />
            <TouchChoose title="Ders" loading={true} />
            <TouchChoose title="Tarih" value="21.03.2021" />
            <TouchChoose title="Saat" value="20:12" />
          </View>
        </View>

        <Text
          style={{
            padding: 16,
            margin: 12,
            color: GlobalColors.titleText,
            backgroundColor: GlobalColors.primaryCard,
            borderRadius: 9,
          }}>
          Soru eklemeye başlamak için lütfen yukarıdaki seçimleri yapın.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ManQuestionsScreen;
