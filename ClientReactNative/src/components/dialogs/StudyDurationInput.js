import React, {useEffect, useState} from 'react';

import {
  View,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {GlobalStyles} from '../../GlobalStyles';

const StudyDurationInput = ({visible, confirm, dismiss}) => {
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
              Çalışma Süresi
            </Text>

            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.durButton}
                onPress={() => confirm(10)}>
                <Text style={styles.durButtonText}>10 dk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.durButton}
                onPress={() => confirm(15)}>
                <Text style={styles.durButtonText}>15 dk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.durButton}
                onPress={() => confirm(30)}>
                <Text style={styles.durButtonText}>30 dk</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                style={styles.durButton}
                onPress={() => confirm(45)}>
                <Text style={styles.durButtonText}>45 dk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.durButton}
                onPress={() => confirm(60)}>
                <Text style={styles.durButtonText}>60 dk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.durButton}
                onPress={() => confirm(90)}>
                <Text style={styles.durButtonText}>90 dk</Text>
              </TouchableOpacity>
            </View>

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
                  dismiss();
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

const styles = StyleSheet.create({
  durButton: {
    flex: 1 / 3,
    margin: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(65,123,175,1)',
  },
  durButtonText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    padding: 9,
  },
});

export default StudyDurationInput;
