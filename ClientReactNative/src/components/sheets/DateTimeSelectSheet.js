import React, {useState} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {GlobalColors, GlobalStyles} from '../../GlobalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {dump} from '../../../Service';

const DateTimeSelectSheet = ({refs, mode, callback, initialDate}) => {
  const [date, setDate] = useState(initialDate ?? new Date());
  const [shadow, setShadow] = useState(false);

  const triggerDateChanged = () => {
    // let formatted = moment(date).format(
    //   mode === 'date'
    //     ? 'yyyy-MM-DD'
    //     : mode === 'time'
    //     ? 'HH:mm:ss'
    //     : 'yyyy-MM-DD HH:mm:ss',
    // );
    // dump(formatted);
    // alert(formatted);
    callback(moment(date));
  };

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

      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          marginTop: 18,
        }}>
        <TouchableOpacity onPress={triggerDateChanged} style={{margin: 6}}>
          <MaterialIcons
            style={{
              alignSelf: 'center',
              marginBottom: 9,
              paddingEnd: 9,
              paddingStart: 9,
            }}
            name="check"
            color={GlobalColors.titleText}
            size={26}
          />
        </TouchableOpacity>
      </View>

      <DatePicker
        date={date}
        mode={mode}
        style={{alignSelf: 'center'}}
        onDateChange={setDate}
        androidVariant="nativeAndroid"
      />
    </RBSheet>
  );
};

export default DateTimeSelectSheet;
