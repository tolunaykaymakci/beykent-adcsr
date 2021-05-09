import React, {useState} from 'react';
import {View, Button, Text, ScrollView, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {GlobalColors, GlobalStyles} from '../../GlobalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateTimeSelectSheet = ({refs, mode}) => {
  const [date, setDate] = useState(new Date());
  const [shadow, setShadow] = useState(false);

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
      <Text style={{padding: 12, fontSize: 16}}>
        {mode == 'date' ? 'Tarih' : mode == 'time' ? 'Saat' : 'Saat ve Tarih'}{' '}
        Seç
      </Text>

      <View>
        <DatePicker
          date={date}
          mode={mode}
          style={{alignSelf: 'center'}}
          onDateChange={setDate}
          androidVariant="nativeAndroid"
        />
      </View>
    </RBSheet>
  );
};

export default DateTimeSelectSheet;
