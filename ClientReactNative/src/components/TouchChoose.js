import React, {useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import {GlobalColors} from '../GlobalStyles';

import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TouchChoose = ({
  title,
  value,
  loading,
  action,
  icon,
  titleSize,
  backColor,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: backColor ?? GlobalColors.primaryCard,
      }}
      onPress={action}>
      <Text style={{...styles.titleText, fontSize: titleSize ?? 16}}>
        {title}
      </Text>

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
          name={icon == null ? 'chevron-right' : icon}
          color={'rgb(58,79,101)'}
          size={23}
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
    borderBottomColor: 'rgba(0,0,0,.08)',
    paddingStart: 12,
    position: 'relative',
    paddingEnd: 12,
  },
  titleText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginEnd: 16,
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
