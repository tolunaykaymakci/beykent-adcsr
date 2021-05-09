import React, {useEffect, useState} from 'react';

import {
  View,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {GlobalStyles} from '../../GlobalStyles';

const InputDialog = ({visible, title, confirm, dismiss}) => {
  const [currentValue, setCurrentValue] = useState(0);

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          dismiss();
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              ...GlobalStyles.primaryCard,
              padding: 16,
              width: '80%',
              paddingBottom: 10,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 19, marginBottom: 12}}>
              {title == null ? 'Girdi Kutusu' : title}
            </Text>

            <TextInput
              keyboardType="numeric"
              autoFocus={true}
              onFocus={() => {
                if (currentValue == '0') {
                  setCurrentValue('');
                }
              }}
              onBlue={() => {
                if (currentValue == '') {
                  setCurrentValue('0');
                }
              }}
              onChangeText={(text) => setCurrentValue(text)}
              style={{
                fontSize: 22,
                textAlign: 'center',
                backgroundColor: 'rgb(238,238,238)',
                borderBottomColor: 'rgb(226,226,226)',
                borderBottomWidth: 3,
              }}>
              {currentValue}
            </TextInput>

            <View style={{flexDirection: 'row', marginTop: 12}}>
              <TouchableOpacity
                onPress={() => dismiss()}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  VAZGEÇ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  confirm(currentValue);
                  //dismiss();
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  TAMAM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InputDialog;
