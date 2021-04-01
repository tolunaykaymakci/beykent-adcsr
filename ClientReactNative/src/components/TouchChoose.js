import React from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {GlobalColors} from '../GlobalStyles';

import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TouchChoose = ({title, value, loading, action}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={action}>
      <Text style={styles.titleText}>{title}</Text>

      <View style={styles.valueContainer}>
        {loading ? (
          <Progress.Circle
            style={{
              marginEnd: 4,
              alignSelf: 'center',
            }}
            thickness={40}
            size={16}
            indeterminate={true}
          />
        ) : (
          <Text style={styles.valueText}>{value}</Text>
        )}

        <MaterialCommunityIcons
          style={{alignSelf: 'center'}}
          name="chevron-right"
          color={'rgb(58,79,101)'}
          size={22}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: GlobalColors.headerSecondary,
    borderBottomColor: GlobalColors.seperator,
    paddingStart: 12,
    position: 'relative',
    paddingEnd: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: GlobalColors.titleText,
  },
  valueContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginEnd: 6,
    position: 'absolute',
    right: 0,
  },
  valueText: {
    alignSelf: 'center',
    color: GlobalColors.subText,
    fontSize: 13,
  },
});

export default TouchChoose;
