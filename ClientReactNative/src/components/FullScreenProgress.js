import React, {useEffect, useState} from 'react';

import {
  View,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import * as Progress from 'react-native-progress';

const FullScreenProgress = ({visible}) => {
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
              backgroundColor: 'white',
              borderRadius: 12,
              width: 64,
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Progress.Circle thickness={38} size={22} indeterminate={true} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FullScreenProgress;
